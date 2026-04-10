import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimulationStore } from "@/lib/simulationStore";
import { getSystemComponents, getWaitTimeEstimate } from "@/lib/trafficApi";
import type { SystemComponent, TrafficSegment } from "@/types/traffic";
import { SystemStatus } from "@/types/traffic";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  RefreshCw,
  Server,
  Shield,
  Wifi,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WaitEstimate {
  segmentId: string;
  segmentName: string;
  district: string;
  waitSeconds: number;
  congestionPct: number;
  congestionWait: number;
  weatherImpact: number;
  trafficLevel: string;
}

interface AlertEvent {
  id: string;
  ts: Date;
  component: string;
  event: string;
  action: string;
  severity: "info" | "warn" | "error";
}

interface UptimePoint {
  tick: number;
  Sensor: number;
  "AI Model": number;
  API: number;
  Database: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

const COMPONENT_ICONS: Record<string, React.ReactNode> = {
  Sensor: <Wifi className="h-4 w-4" />,
  "AI Model": <Zap className="h-4 w-4" />,
  API: <Server className="h-4 w-4" />,
  Database: <Database className="h-4 w-4" />,
};

const STATUS_ICON_COLOR: Record<string, string> = {
  Operational: "text-primary",
  Degraded: "text-accent",
  Failed: "text-destructive",
  Maintenance: "text-muted-foreground",
};

const STATUS_BORDER: Record<string, string> = {
  Operational: "border-primary/25",
  Degraded: "border-accent/30",
  Failed: "border-destructive/40",
  Maintenance: "border-border",
};

const ALERT_DOT: Record<AlertEvent["severity"], string> = {
  info: "bg-primary",
  warn: "bg-accent",
  error: "bg-destructive",
};

const ALERT_LABEL: Record<AlertEvent["severity"], string> = {
  info: "text-primary",
  warn: "text-accent",
  error: "text-destructive",
};

function relativeTime(ts: bigint): string {
  const diffMs = Date.now() - Number(ts) / 1_000_000;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${Math.floor(diffMin / 60)}h ago`;
}

function jitter(base: number): number {
  return Math.min(100, Math.max(70, base + (Math.random() * 4 - 2)));
}

function buildUptimeHistory(components: SystemComponent[]): UptimePoint[] {
  const types = ["Sensor", "AI Model", "API", "Database"] as const;
  const baseMap: Record<string, number> = {};
  for (const t of types) {
    const matching = components.filter((c) => c.componentType === t);
    baseMap[t] =
      matching.length > 0
        ? matching.reduce((s, c) => s + c.uptimePct, 0) / matching.length
        : 97;
  }
  const sensor = baseMap.Sensor ?? 97;
  const aiModel = baseMap["AI Model"] ?? 97;
  const api = baseMap.API ?? 97;
  const database = baseMap.Database ?? 97;
  return Array.from({ length: 24 }, (_, i) => ({
    tick: i + 1,
    Sensor: jitter(sensor),
    "AI Model": jitter(aiModel),
    API: jitter(api),
    Database: jitter(database),
  }));
}

function generateAlerts(components: SystemComponent[]): AlertEvent[] {
  const events: AlertEvent[] = [];
  const now = Date.now();
  components.forEach((c, idx) => {
    if (c.status === SystemStatus.Degraded) {
      events.push({
        id: `degraded-${c.id}`,
        ts: new Date(now - idx * 45_000),
        component: c.name,
        event: `Performance degraded — ${c.componentType} latency elevated`,
        action: "Fallback routing activated",
        severity: "warn",
      });
    }
    if (c.status === SystemStatus.Failed) {
      events.push({
        id: `failed-${c.id}`,
        ts: new Date(now - idx * 30_000),
        component: c.name,
        event: `Component offline — ${String(c.failureCount)} consecutive failures`,
        action: "Redundant node promoted, alert dispatched",
        severity: "error",
      });
    }
    if (c.status === SystemStatus.Maintenance) {
      events.push({
        id: `maint-${c.id}`,
        ts: new Date(now - idx * 120_000),
        component: c.name,
        event: "Scheduled maintenance window started",
        action: "Traffic rerouted via secondary path",
        severity: "info",
      });
    }
  });
  const ok = components.filter((c) => c.status === SystemStatus.Operational);
  ok.slice(0, 6).forEach((c, idx) => {
    events.push({
      id: `ok-${c.id}`,
      ts: new Date(now - (idx + 1) * 90_000),
      component: c.name,
      event: "Heartbeat check passed — all metrics nominal",
      action: "No action required",
      severity: "info",
    });
  });
  return events.sort((a, b) => b.ts.getTime() - a.ts.getTime()).slice(0, 10);
}

function buildWaitEstimate(seg: TrafficSegment, rawWait: number): WaitEstimate {
  const weatherImpact =
    seg.trafficLevel === "High" ? 28 : seg.trafficLevel === "Medium" ? 14 : 5;
  const congestionWait = Math.max(0, rawWait - weatherImpact);
  return {
    segmentId: seg.id,
    segmentName: seg.name,
    district: seg.district,
    waitSeconds: rawWait,
    congestionPct: Number(seg.congestionPct),
    congestionWait,
    weatherImpact,
    trafficLevel: seg.trafficLevel,
  };
}

function waitExplanation(est: WaitEstimate): string {
  const cLevel =
    est.congestionPct >= 70
      ? "High Traffic"
      : est.congestionPct >= 40
        ? "Medium Traffic"
        : "Low Traffic";
  const weatherNote =
    est.weatherImpact > 0
      ? ` + weather reducing avg speed (−${est.weatherImpact}s impact)`
      : "";
  return `Wait time at ${est.segmentName} is ${est.waitSeconds}s due to ${est.congestionPct}% congestion (${cLevel})${weatherNote}.`;
}

// ─── Health Gauge ─────────────────────────────────────────────────────────────

function HealthGauge({ pct }: { pct: number }) {
  const color =
    pct >= 80
      ? "oklch(0.62 0.25 195)"
      : pct >= 50
        ? "oklch(0.72 0.23 55)"
        : "oklch(0.62 0.24 24)";
  const data = [
    { name: "Health", value: pct },
    { name: "Gap", value: 100 - pct },
  ];
  return (
    <div
      className="relative flex items-center justify-center"
      data-ocid="health-gauge"
    >
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={54}
            outerRadius={72}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={color} />
            <Cell fill="oklch(0.18 0 0)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center">
        <span
          className="font-display text-3xl font-bold tabular-nums leading-none"
          style={{ color }}
        >
          {pct}%
        </span>
        <span className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          Operational
        </span>
      </div>
    </div>
  );
}

// ─── Component Card ───────────────────────────────────────────────────────────

function ComponentCard({ comp }: { comp: SystemComponent }) {
  const isDegraded = comp.status === SystemStatus.Degraded;
  const isFailed = comp.status === SystemStatus.Failed;
  const needsFallback = isDegraded || isFailed;
  const icon = COMPONENT_ICONS[comp.componentType] ?? (
    <Shield className="h-4 w-4" />
  );

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 transition-smooth hover:border-primary/30",
        STATUS_BORDER[comp.status] ?? "border-border",
      )}
      data-ocid={`component-card-${comp.id}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "shrink-0",
              STATUS_ICON_COLOR[comp.status] ?? "text-muted-foreground",
            )}
          >
            {icon}
          </span>
          <span className="min-w-0 truncate text-sm font-semibold text-foreground">
            {comp.name}
          </span>
        </div>
        <StatusBadge status={comp.status} className="shrink-0" />
      </div>

      {/* Type + fallback */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className="border-border font-mono text-[10px] text-muted-foreground"
        >
          {comp.componentType}
        </Badge>
        {needsFallback && (
          <span className="flex items-center gap-1 font-mono text-[10px] text-accent">
            <AlertTriangle className="h-3 w-3" />
            Fallback active
          </span>
        )}
      </div>

      {/* Uptime bar */}
      <div className="mb-3 space-y-1">
        <div className="flex justify-between font-mono text-[10px]">
          <span className="text-muted-foreground">Uptime</span>
          <span className="tabular-nums text-foreground">
            {comp.uptimePct.toFixed(1)}%
          </span>
        </div>
        <Progress
          value={comp.uptimePct}
          className="h-1.5"
          data-ocid={`uptime-bar-${comp.id}`}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
        <span>
          Failures:{" "}
          <span
            className={
              Number(comp.failureCount) > 0
                ? "text-destructive"
                : "text-foreground"
            }
          >
            {String(comp.failureCount)}
          </span>
        </span>
        <span>Checked {relativeTime(comp.lastChecked)}</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function Monitor() {
  const { snapshot, actor } = useSimulationStore();
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [loadingComps, setLoadingComps] = useState(true);
  const [waitTimes, setWaitTimes] = useState<WaitEstimate[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stable uptime history — rebuilt only when components change
  const uptimeHistory = useMemo<UptimePoint[]>(
    () => buildUptimeHistory(components),
    [components],
  );

  const alertFeed = useMemo(() => generateAlerts(components), [components]);

  const fetchData = useCallback(async () => {
    if (!actor) return;
    try {
      const comps = await getSystemComponents(actor);
      setComponents(comps);
      setLoadingComps(false);
      setLastRefresh(new Date());

      const segments: TrafficSegment[] = snapshot?.segments ?? [];
      const estimates = await Promise.all(
        segments.map(async (seg) => {
          const raw = await getWaitTimeEstimate(actor, seg.id);
          return buildWaitEstimate(seg, Number(raw));
        }),
      );
      setWaitTimes(estimates.sort((a, b) => b.waitSeconds - a.waitSeconds));
    } catch {
      setLoadingComps(false);
    }
  }, [actor, snapshot?.segments]);

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, 15_000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchData]);

  // Summary counts
  const healthPct = snapshot ? Number(snapshot.systemHealth) : 0;
  const opCount = components.filter(
    (c) => c.status === SystemStatus.Operational,
  ).length;
  const degCount = components.filter(
    (c) => c.status === SystemStatus.Degraded,
  ).length;
  const failCount = components.filter(
    (c) => c.status === SystemStatus.Failed,
  ).length;
  const avgUptime =
    components.length > 0
      ? (
          components.reduce((s, c) => s + c.uptimePct, 0) / components.length
        ).toFixed(1)
      : "—";

  const areaColors: Record<string, string> = {
    Sensor: "oklch(0.62 0.25 195)",
    "AI Model": "oklch(0.72 0.23 55)",
    API: "oklch(0.68 0.18 110)",
    Database: "oklch(0.55 0.15 280)",
  };

  return (
    <div className="space-y-6 p-6" data-ocid="monitor-page">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            System Reliability &amp; Health Monitor
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            REAL-TIME MONITORING — SENSORS · AI MODELS · INFRASTRUCTURE
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
              <RefreshCw className="h-3 w-3" />
              {lastRefresh.toLocaleTimeString()} · auto 15s
            </span>
          )}
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 font-mono text-xs text-primary"
            data-ocid="health-badge"
          >
            {healthPct}% HEALTH
          </Badge>
        </div>
      </div>

      {/* ── Overview: Gauge + KPIs ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {/* Donut gauge */}
        <div className="col-span-1 flex flex-col items-center justify-center rounded-lg border border-border bg-card py-5">
          {loadingComps ? (
            <Skeleton className="h-40 w-40 rounded-full" />
          ) : (
            <HealthGauge pct={healthPct} />
          )}
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Overall Health Score
          </p>
        </div>

        {/* KPI grid */}
        <div className="col-span-1 grid grid-cols-2 gap-4 md:col-span-4">
          <MetricCard
            title="Operational"
            value={opCount}
            subtitle={`of ${components.length} components`}
            trend="neutral"
            icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
            data-ocid="metric-operational"
          />
          <MetricCard
            title="Degraded"
            value={degCount}
            subtitle="Fallback activated"
            trend={degCount > 0 ? "up" : "neutral"}
            icon={<AlertTriangle className="h-4 w-4 text-accent" />}
            data-ocid="metric-degraded"
          />
          <MetricCard
            title="Failed"
            value={failCount}
            subtitle="Requires intervention"
            trend={failCount > 0 ? "up" : "neutral"}
            icon={<XCircle className="h-4 w-4 text-destructive" />}
            data-ocid="metric-failed"
          />
          <MetricCard
            title="Avg Uptime"
            value={`${avgUptime}%`}
            subtitle="Network-wide average"
            trend="neutral"
            icon={<Clock className="h-4 w-4 text-primary" />}
            data-ocid="metric-avg-uptime"
          />
        </div>
      </div>

      {/* ── Component Cards ── */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              System Components
            </span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            {components.length} REGISTERED
          </span>
        </div>

        {loadingComps ? (
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <Skeleton key={k} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : components.length === 0 ? (
          <p
            className="px-4 py-10 text-center font-mono text-xs text-muted-foreground"
            data-ocid="components-empty"
          >
            No component data — click TICK to simulate
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            {components.map((comp) => (
              <ComponentCard key={comp.id} comp={comp} />
            ))}
          </div>
        )}
      </div>

      {/* ── Alert Feed + Uptime Chart ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Alert feed */}
        <div
          className="rounded-lg border border-border bg-card"
          data-ocid="alert-feed"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                System Event Log
              </span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              LAST 10 EVENTS
            </span>
          </div>
          <div className="divide-y divide-border/50">
            {alertFeed.length === 0 ? (
              <p className="px-4 py-8 text-center font-mono text-xs text-muted-foreground">
                No events yet — awaiting system data
              </p>
            ) : (
              alertFeed.map((ev) => (
                <div
                  key={ev.id}
                  className="flex gap-3 px-4 py-3"
                  data-ocid={`event-${ev.id}`}
                >
                  <div
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      ALERT_DOT[ev.severity],
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={cn(
                          "font-mono text-[10px] font-semibold",
                          ALERT_LABEL[ev.severity],
                        )}
                      >
                        {ev.component}
                      </span>
                      <span className="shrink-0 font-mono text-[9px] text-muted-foreground">
                        {ev.ts.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-foreground">{ev.event}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      → {ev.action}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Uptime area chart */}
        <div
          className="rounded-lg border border-border bg-card"
          data-ocid="uptime-chart"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                Uptime History — 24 Ticks
              </span>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={uptimeHistory}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  {Object.entries(areaColors).map(([key, color]) => (
                    <linearGradient
                      key={key}
                      id={`grad-${key.replace(/\s/g, "")}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.22 0 0)"
                  vertical={false}
                />
                <XAxis
                  dataKey="tick"
                  tick={{
                    fill: "oklch(0.52 0 0)",
                    fontSize: 10,
                    fontFamily: "JetBrains Mono",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[80, 100]}
                  tick={{
                    fill: "oklch(0.52 0 0)",
                    fontSize: 10,
                    fontFamily: "JetBrains Mono",
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.12 0 0)",
                    border: "1px solid oklch(0.22 0 0)",
                    borderRadius: "6px",
                    fontFamily: "JetBrains Mono",
                    fontSize: 11,
                  }}
                  labelStyle={{ color: "oklch(0.93 0 0)" }}
                  formatter={(val: number, name: string) => [
                    `${val.toFixed(1)}%`,
                    name,
                  ]}
                />
                <Legend
                  wrapperStyle={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 10,
                  }}
                />
                {Object.entries(areaColors).map(([key, color]) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={color}
                    strokeWidth={1.5}
                    fill={`url(#grad-${key.replace(/\s/g, "")})`}
                    dot={false}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Predictive Wait Times ── */}
      <div
        className="rounded-lg border border-border bg-card"
        data-ocid="wait-times-section"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Predictive Waiting Time Estimation
            </span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            SORTED BY DELAY
          </span>
        </div>

        {waitTimes.length === 0 ? (
          <p className="px-4 py-10 text-center font-mono text-xs text-muted-foreground">
            No segment data — click TICK to simulate
          </p>
        ) : (
          <>
            {/* Stacked horizontal bar chart */}
            <div className="p-4">
              <ResponsiveContainer
                width="100%"
                height={Math.max(180, waitTimes.slice(0, 8).length * 34)}
              >
                <BarChart
                  data={waitTimes.slice(0, 8)}
                  layout="vertical"
                  margin={{ top: 4, right: 24, left: 90, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.22 0 0)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{
                      fill: "oklch(0.52 0 0)",
                      fontSize: 10,
                      fontFamily: "JetBrains Mono",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${v}s`}
                  />
                  <YAxis
                    type="category"
                    dataKey="segmentName"
                    tick={{
                      fill: "oklch(0.82 0 0)",
                      fontSize: 10,
                      fontFamily: "JetBrains Mono",
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.12 0 0)",
                      border: "1px solid oklch(0.22 0 0)",
                      borderRadius: "6px",
                      fontFamily: "JetBrains Mono",
                      fontSize: 11,
                    }}
                    labelStyle={{ color: "oklch(0.93 0 0)" }}
                    formatter={(val: number, name: string) => [
                      `${val}s`,
                      name === "congestionWait"
                        ? "Congestion"
                        : "Weather Impact",
                    ]}
                  />
                  <Legend
                    wrapperStyle={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 10,
                    }}
                    formatter={(val: string) =>
                      val === "congestionWait" ? "Congestion" : "Weather Impact"
                    }
                  />
                  <Bar
                    dataKey="congestionWait"
                    stackId="wait"
                    name="congestionWait"
                    radius={[0, 0, 0, 0]}
                  >
                    {waitTimes.slice(0, 8).map((entry) => (
                      <Cell
                        key={entry.segmentId}
                        fill={
                          entry.congestionPct >= 70
                            ? "oklch(0.62 0.24 24)"
                            : entry.congestionPct >= 40
                              ? "oklch(0.72 0.23 55)"
                              : "oklch(0.62 0.25 195)"
                        }
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="weatherImpact"
                    stackId="wait"
                    fill="oklch(0.68 0.18 110)"
                    radius={[0, 3, 3, 0]}
                    name="weatherImpact"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Explainability rows */}
            <div className="border-t border-border">
              <div className="divide-y divide-border/50">
                {waitTimes.slice(0, 5).map((est) => (
                  <div
                    key={est.segmentId}
                    className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    data-ocid={`wait-explain-${est.segmentId}`}
                  >
                    <div className="flex min-w-0 items-baseline gap-3">
                      <span className="shrink-0 font-mono text-[11px] font-bold tabular-nums text-accent">
                        {est.waitSeconds}s
                      </span>
                      <p className="min-w-0 text-xs text-muted-foreground">
                        {waitExplanation(est)}
                      </p>
                    </div>
                    <StatusBadge
                      status={est.trafficLevel}
                      className="shrink-0 self-start sm:self-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
