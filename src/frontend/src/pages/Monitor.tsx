import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimulationStore } from "@/lib/simulationStore";
import { getSystemComponents, getWaitTimeEstimate } from "@/lib/trafficApi";
import { cn } from "@/lib/utils";
import type { SystemComponent, TrafficSegment } from "@/types/traffic";
import { SystemStatus, TrafficLevel } from "@/types/traffic";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Globe,
  Radio,
  RefreshCw,
  Server,
  Shield,
  Timer,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WaitEstimate {
  segmentId: string;
  segmentName: string;
  district: string;
  congestionPct: number;
  baseWait: number;
  weatherImpact: number;
  total: number;
  trafficLevel: string;
}

interface LogEntry {
  id: string;
  ts: string;
  componentName: string;
  event: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  action: string;
}

interface UptimeSeries {
  points: number[];
}

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_GLOW: Record<string, string> = {
  [SystemStatus.Operational]:
    "border-primary/35 shadow-[0_0_16px_rgba(98,213,228,0.16)]",
  [SystemStatus.Degraded]:
    "border-accent/40 shadow-[0_0_16px_rgba(217,170,59,0.2)]",
  [SystemStatus.Failed]:
    "border-destructive/50 shadow-[0_0_16px_rgba(220,60,60,0.28)]",
  [SystemStatus.Maintenance]: "border-border/60",
};

const STATUS_DOT: Record<string, string> = {
  [SystemStatus.Operational]: "bg-primary animate-pulse",
  [SystemStatus.Degraded]: "bg-accent animate-pulse",
  [SystemStatus.Failed]: "bg-destructive animate-pulse",
  [SystemStatus.Maintenance]: "bg-muted-foreground",
};

const SEVERITY_TEXT: Record<string, string> = {
  Critical: "text-destructive",
  High: "text-destructive/80",
  Medium: "text-accent",
  Low: "text-primary",
};

const SEVERITY_BORDER: Record<string, string> = {
  Critical: "border-l-destructive bg-destructive/5",
  High: "border-l-destructive/60",
  Medium: "border-l-accent bg-accent/5",
  Low: "border-l-primary/50",
};

const CONGESTION_COLOR: Record<string, string> = {
  [TrafficLevel.High]: "text-destructive",
  [TrafficLevel.Medium]: "text-accent",
  [TrafficLevel.Low]: "text-primary",
  [TrafficLevel.NoTraffic]: "text-muted-foreground",
};

function componentIcon(type: string) {
  const t = type.toLowerCase();
  if (t === "sensor") return Radio;
  if (t.includes("ai")) return Cpu;
  if (t === "database") return Database;
  if (t === "api") return Globe;
  return Server;
}

// ─── Synthetic Data ───────────────────────────────────────────────────────────

const FALLBACK_COMPONENTS: SystemComponent[] = [
  {
    id: "s1",
    name: "Sensor Node Alpha",
    componentType: "Sensor",
    status: SystemStatus.Operational,
    uptimePct: 99.1,
    lastChecked: BigInt(Date.now() - 12_000) * 1_000_000n,
    failureCount: 0n,
  },
  {
    id: "s2",
    name: "Sensor Node Beta",
    componentType: "Sensor",
    status: SystemStatus.Degraded,
    uptimePct: 87.3,
    lastChecked: BigInt(Date.now() - 45_000) * 1_000_000n,
    failureCount: 2n,
  },
  {
    id: "s3",
    name: "Sensor Node Gamma",
    componentType: "Sensor",
    status: SystemStatus.Operational,
    uptimePct: 98.7,
    lastChecked: BigInt(Date.now() - 8_000) * 1_000_000n,
    failureCount: 0n,
  },
  {
    id: "s4",
    name: "Sensor Node Delta",
    componentType: "Sensor",
    status: SystemStatus.Failed,
    uptimePct: 41.2,
    lastChecked: BigInt(Date.now() - 120_000) * 1_000_000n,
    failureCount: 7n,
  },
  {
    id: "ai1",
    name: "Vision AI Engine",
    componentType: "AI Model",
    status: SystemStatus.Operational,
    uptimePct: 99.8,
    lastChecked: BigInt(Date.now() - 5_000) * 1_000_000n,
    failureCount: 0n,
  },
  {
    id: "ai2",
    name: "Prediction AI Model",
    componentType: "AI Model",
    status: SystemStatus.Maintenance,
    uptimePct: 95.0,
    lastChecked: BigInt(Date.now() - 600_000) * 1_000_000n,
    failureCount: 1n,
  },
  {
    id: "db1",
    name: "Traffic Database",
    componentType: "Database",
    status: SystemStatus.Operational,
    uptimePct: 99.9,
    lastChecked: BigInt(Date.now() - 3_000) * 1_000_000n,
    failureCount: 0n,
  },
  {
    id: "api1",
    name: "REST API Gateway",
    componentType: "API",
    status: SystemStatus.Operational,
    uptimePct: 99.5,
    lastChecked: BigInt(Date.now() - 7_000) * 1_000_000n,
    failureCount: 0n,
  },
];

const FALLBACK_SEGMENTS: TrafficSegment[] = [
  {
    id: "sg1",
    name: "Main St / 5th Ave",
    district: "Downtown",
    congestionPct: 78n,
    waitTimeSeconds: 95n,
    trafficLevel: TrafficLevel.High,
    avgSpeed: 12,
    lat: 0,
    lon: 0,
    vehicleCount: 120n,
  },
  {
    id: "sg2",
    name: "Harbor Bridge",
    district: "Port Area",
    congestionPct: 52n,
    waitTimeSeconds: 60n,
    trafficLevel: TrafficLevel.Medium,
    avgSpeed: 28,
    lat: 0,
    lon: 0,
    vehicleCount: 75n,
  },
  {
    id: "sg3",
    name: "University Blvd",
    district: "Midtown",
    congestionPct: 34n,
    waitTimeSeconds: 35n,
    trafficLevel: TrafficLevel.Low,
    avgSpeed: 42,
    lat: 0,
    lon: 0,
    vehicleCount: 40n,
  },
  {
    id: "sg4",
    name: "Industrial Ring Rd",
    district: "East Side",
    congestionPct: 89n,
    waitTimeSeconds: 130n,
    trafficLevel: TrafficLevel.High,
    avgSpeed: 8,
    lat: 0,
    lon: 0,
    vehicleCount: 200n,
  },
  {
    id: "sg5",
    name: "Westside Expressway",
    district: "West End",
    congestionPct: 20n,
    waitTimeSeconds: 18n,
    trafficLevel: TrafficLevel.Low,
    avgSpeed: 65,
    lat: 0,
    lon: 0,
    vehicleCount: 22n,
  },
  {
    id: "sg6",
    name: "Central Park Loop",
    district: "Uptown",
    congestionPct: 61n,
    waitTimeSeconds: 72n,
    trafficLevel: TrafficLevel.Medium,
    avgSpeed: 22,
    lat: 0,
    lon: 0,
    vehicleCount: 88n,
  },
  {
    id: "sg7",
    name: "Airport Connector",
    district: "North Gate",
    congestionPct: 45n,
    waitTimeSeconds: 50n,
    trafficLevel: TrafficLevel.Medium,
    avgSpeed: 35,
    lat: 0,
    lon: 0,
    vehicleCount: 55n,
  },
  {
    id: "sg8",
    name: "Riverside Drive",
    district: "South Bank",
    congestionPct: 9n,
    waitTimeSeconds: 10n,
    trafficLevel: TrafficLevel.NoTraffic,
    avgSpeed: 72,
    lat: 0,
    lon: 0,
    vehicleCount: 8n,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(ns: bigint): string {
  const diff = Date.now() - Number(ns) / 1_000_000;
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3_600_000)}h ago`;
}

function buildUptimeSeries(base: number, status: string): UptimeSeries {
  const pts: number[] = [];
  let v = base;
  const variance =
    status === SystemStatus.Failed
      ? 22
      : status === SystemStatus.Degraded
        ? 10
        : 3;
  for (let i = 0; i < 20; i++) {
    v = Math.max(0, Math.min(100, v + (Math.random() - 0.5) * variance));
    pts.push(v);
  }
  return { points: pts };
}

function buildWaitEstimates(
  segments: TrafficSegment[],
  overrides: Record<string, number>,
): WaitEstimate[] {
  return segments.map((seg) => {
    const baseWait =
      overrides[seg.id] !== undefined
        ? overrides[seg.id]
        : Number(seg.waitTimeSeconds);
    const weatherImpact =
      seg.trafficLevel === TrafficLevel.High
        ? 45
        : seg.trafficLevel === TrafficLevel.Medium
          ? 20
          : 5;
    return {
      segmentId: seg.id,
      segmentName: seg.name,
      district: seg.district,
      congestionPct: Number(seg.congestionPct),
      baseWait,
      weatherImpact,
      total: baseWait + weatherImpact,
      trafficLevel: seg.trafficLevel,
    };
  });
}

function generateLogEntries(components: SystemComponent[]): LogEntry[] {
  const entries: LogEntry[] = [];
  const now = Date.now();
  components.forEach((comp, idx) => {
    if (comp.status === SystemStatus.Failed) {
      entries.push({
        id: `fail-${comp.id}`,
        ts: new Date(now - idx * 25_000).toLocaleTimeString(),
        componentName: comp.name,
        event: `OFFLINE — ${Number(comp.failureCount)} consecutive failure(s) recorded. Last uptime: ${comp.uptimePct.toFixed(1)}%`,
        severity: "Critical",
        action:
          "Initiate manual restart; escalate to on-call engineer immediately",
      });
    }
    if (comp.status === SystemStatus.Degraded) {
      entries.push({
        id: `deg-${comp.id}`,
        ts: new Date(now - idx * 55_000).toLocaleTimeString(),
        componentName: comp.name,
        event: `Performance degraded — uptime dropped to ${comp.uptimePct.toFixed(1)}%`,
        severity: "Medium",
        action:
          "Monitor for 10 min; trigger diagnostic if uptime falls below 85%",
      });
    }
    if (comp.status === SystemStatus.Maintenance) {
      entries.push({
        id: `maint-${comp.id}`,
        ts: new Date(now - idx * 120_000).toLocaleTimeString(),
        componentName: comp.name,
        event:
          "Scheduled maintenance window active — component offline by design",
        severity: "Low",
        action: "Standby — automated recovery expected within scheduled window",
      });
    }
    if (
      Number(comp.failureCount) > 0 &&
      comp.status === SystemStatus.Operational
    ) {
      entries.push({
        id: `rec-${comp.id}`,
        ts: new Date(now - idx * 90_000).toLocaleTimeString(),
        componentName: comp.name,
        event: `Recovered — ${Number(comp.failureCount)} historical fault(s) on record`,
        severity: "Low",
        action:
          "Verify stability over next 30 min; clear alert after confirmation",
      });
    }
  });
  const order: Record<string, number> = {
    Critical: 0,
    High: 1,
    Medium: 2,
    Low: 3,
  };
  return entries.sort(
    (a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9),
  );
}

// ─── Uptime Sparkline ─────────────────────────────────────────────────────────

function UptimeSparkline({
  series,
  status,
}: { series: UptimeSeries; status: string }) {
  const W = 100;
  const H = 28;
  const { points } = series;
  const min = Math.min(...points);
  const max = Math.max(...points, min + 1);
  const scaleY = (v: number) => H - ((v - min) / (max - min)) * (H - 4) - 2;
  const pathD = points
    .map(
      (v, i) =>
        `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * W} ${scaleY(v)}`,
    )
    .join(" ");
  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`;
  const clr =
    status === SystemStatus.Operational
      ? { stroke: "rgba(98,213,228,0.85)", fill: "rgba(98,213,228,0.08)" }
      : status === SystemStatus.Degraded
        ? { stroke: "rgba(217,170,59,0.85)", fill: "rgba(217,170,59,0.08)" }
        : status === SystemStatus.Failed
          ? { stroke: "rgba(220,60,60,0.85)", fill: "rgba(220,60,60,0.08)" }
          : {
              stroke: "rgba(120,120,140,0.55)",
              fill: "rgba(120,120,140,0.04)",
            };
  return (
    <svg
      width={W}
      height={H}
      className="overflow-visible shrink-0"
      aria-hidden="true"
    >
      <path d={areaD} fill={clr.fill} />
      <path
        d={pathD}
        fill="none"
        stroke={clr.stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Health Ring ──────────────────────────────────────────────────────────────

function HealthRing({ pct }: { pct: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const dash = (clamped / 100) * circ;
  const gap = circ - dash;
  const isGood = clamped > 80;
  const isMid = clamped > 50 && clamped <= 80;
  const ringCls = isGood
    ? "stroke-primary"
    : isMid
      ? "stroke-accent"
      : "stroke-destructive";
  const valCls = isGood
    ? "text-primary"
    : isMid
      ? "text-accent"
      : "text-destructive";
  const label = isGood ? "NOMINAL" : isMid ? "DEGRADED" : "CRITICAL";
  return (
    <div className="flex flex-col items-center gap-2" data-ocid="health-ring">
      <div className="relative">
        <svg
          width={128}
          height={128}
          viewBox="0 0 128 128"
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={64}
            cy={64}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={10}
          />
          <circle
            cx={64}
            cy={64}
            r={r}
            fill="none"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            className={cn("transition-all duration-700", ringCls)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "font-mono text-[22px] font-bold tabular-nums leading-none",
              valCls,
            )}
          >
            {clamped}%
          </span>
          <span className="font-mono text-[8px] tracking-[0.15em] text-muted-foreground mt-0.5">
            HEALTH
          </span>
        </div>
      </div>
      <span
        className={cn(
          "font-mono text-[9px] font-semibold uppercase tracking-[0.18em]",
          valCls,
        )}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Component Card ───────────────────────────────────────────────────────────

function ComponentCard({
  comp,
  series,
}: { comp: SystemComponent; series: UptimeSeries }) {
  const Icon = componentIcon(comp.componentType);
  return (
    <div
      className={cn(
        "relative flex flex-col gap-2.5 rounded-lg border bg-card p-4 transition-smooth",
        STATUS_GLOW[comp.status] ?? "border-border",
      )}
      data-ocid={`component-card-${comp.id}`}
    >
      {/* Live dot */}
      <span
        className={cn(
          "absolute right-3 top-3 h-1.5 w-1.5 rounded-full",
          STATUS_DOT[comp.status] ?? "bg-muted-foreground",
        )}
      />

      {/* Icon + name */}
      <div className="flex items-center gap-2 pr-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted/60 shrink-0">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-foreground leading-tight">
            {comp.name}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            {comp.componentType}
          </p>
        </div>
      </div>

      <StatusBadge status={comp.status} />

      {/* Uptime + sparkline */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Uptime
          </p>
          <p className="font-mono text-sm font-bold tabular-nums text-foreground">
            {comp.uptimePct.toFixed(1)}%
          </p>
        </div>
        <UptimeSparkline series={series} status={comp.status} />
      </div>

      {/* Last checked */}
      <p className="font-mono text-[9px] text-muted-foreground">
        Checked:{" "}
        <span className="text-foreground/70">
          {relativeTime(comp.lastChecked)}
        </span>
      </p>

      {/* Alert message */}
      {comp.status !== SystemStatus.Operational && (
        <div
          className={cn(
            "flex items-start gap-1.5 rounded border px-2 py-1.5",
            comp.status === SystemStatus.Failed
              ? "border-destructive/25 bg-destructive/8"
              : comp.status === SystemStatus.Degraded
                ? "border-accent/25 bg-accent/8"
                : "border-border/50 bg-muted/30",
          )}
        >
          <AlertTriangle
            className={cn(
              "mt-0.5 h-3 w-3 shrink-0",
              comp.status === SystemStatus.Failed
                ? "text-destructive"
                : comp.status === SystemStatus.Degraded
                  ? "text-accent"
                  : "text-muted-foreground",
            )}
          />
          <p className="font-mono text-[9px] leading-snug text-foreground/70">
            {comp.status === SystemStatus.Failed
              ? `${Number(comp.failureCount)} failure(s) — immediate attention required`
              : comp.status === SystemStatus.Degraded
                ? `${Number(comp.failureCount)} fault(s) logged — performance reduced`
                : "Scheduled downtime — recovery expected within 30 min"}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Wait Time Table ──────────────────────────────────────────────────────────

function WaitTimeTable({ estimates }: { estimates: WaitEstimate[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px]">
        <thead>
          <tr className="border-b border-border/60 bg-muted/30">
            {[
              { label: "Segment Name", align: "left" },
              { label: "District", align: "left" },
              { label: "Congestion", align: "left" },
              { label: "Base Wait", align: "right" },
              { label: "Weather +", align: "right" },
              { label: "Total Wait", align: "right" },
            ].map(({ label, align }) => (
              <th
                key={label}
                className={cn(
                  "px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground",
                  align === "right" ? "text-right" : "text-left",
                )}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {estimates.map((est) => {
            const isHigh = est.total > 120;
            return (
              <tr
                key={est.segmentId}
                className={cn(
                  "border-b border-border/30 transition-colors hover:bg-muted/15",
                  isHigh && "bg-accent/4",
                )}
                data-ocid={`wait-row-${est.segmentId}`}
              >
                <td className="px-4 py-2.5 font-mono text-[11px] text-foreground">
                  {est.segmentName}
                </td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
                  {est.district}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={cn(
                      "font-mono text-[11px] font-semibold tabular-nums",
                      CONGESTION_COLOR[est.trafficLevel],
                    )}
                  >
                    {est.congestionPct}%
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-[11px] tabular-nums text-foreground">
                  {est.baseWait}s
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-[11px] tabular-nums text-accent">
                  +{est.weatherImpact}s
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span
                    className={cn(
                      "font-mono text-[11px] font-bold tabular-nums",
                      isHigh ? "text-accent" : "text-foreground",
                    )}
                  >
                    {est.total}s
                  </span>
                  {isHigh && (
                    <Badge
                      variant="outline"
                      className="ml-2 border-accent/40 bg-accent/10 px-1 py-0 font-mono text-[8px] text-accent"
                    >
                      SLOW
                    </Badge>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Log Entry ────────────────────────────────────────────────────────────────

const SEV_ICON: Record<string, typeof XCircle> = {
  Critical: XCircle,
  High: AlertTriangle,
  Medium: AlertTriangle,
  Low: CheckCircle2,
};

function EventLogEntry({ entry }: { entry: LogEntry }) {
  const SevIcon = SEV_ICON[entry.severity] ?? Activity;
  return (
    <div
      className={cn(
        "border-l-2 px-4 py-3 transition-colors hover:bg-muted/10",
        SEVERITY_BORDER[entry.severity],
      )}
      data-ocid={`log-entry-${entry.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <SevIcon
            className={cn(
              "mt-0.5 h-3.5 w-3.5 shrink-0",
              SEVERITY_TEXT[entry.severity],
            )}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-semibold text-foreground/80">
                {entry.componentName}
              </span>
              <span
                className={cn(
                  "font-mono text-[9px] uppercase tracking-wider",
                  SEVERITY_TEXT[entry.severity],
                )}
              >
                {entry.severity}
              </span>
            </div>
            <p className="mt-0.5 font-mono text-[10px] leading-snug text-foreground/70">
              {entry.event}
            </p>
            <p className="mt-1 font-mono text-[9px] leading-snug text-muted-foreground">
              <span className="text-primary/70">→ </span>
              {entry.action}
            </p>
          </div>
        </div>
        <span className="shrink-0 font-mono text-[9px] tabular-nums text-muted-foreground">
          {entry.ts}
        </span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function Monitor() {
  const { snapshot, actor } = useSimulationStore();
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [waitEstimates, setWaitEstimates] = useState<WaitEstimate[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stable sparkline series per component
  const seriesMap = useMemo(() => {
    const map: Record<string, UptimeSeries> = {};
    for (const c of components.length > 0 ? components : FALLBACK_COMPONENTS) {
      map[c.id] = buildUptimeSeries(c.uptimePct, c.status);
    }
    return map;
  }, [components]);

  const displayComponents =
    components.length > 0 ? components : FALLBACK_COMPONENTS;

  const fetchData = useCallback(async () => {
    if (!actor) {
      // Use synthetic data
      setComponents([]);
      setWaitEstimates(
        buildWaitEstimates(
          snapshot?.segments?.length ? snapshot.segments : FALLBACK_SEGMENTS,
          {},
        ),
      );
      setLoading(false);
      setLastRefresh(new Date());
      return;
    }
    try {
      const comps = await getSystemComponents(actor);
      setComponents(comps);
      const segs: TrafficSegment[] = snapshot?.segments?.length
        ? snapshot.segments
        : FALLBACK_SEGMENTS;
      const overrides: Record<string, number> = {};
      await Promise.all(
        segs.map(async (seg) => {
          try {
            const raw = await getWaitTimeEstimate(actor, seg.id);
            overrides[seg.id] = Number(raw);
          } catch {
            /* use default */
          }
        }),
      );
      setWaitEstimates(buildWaitEstimates(segs, overrides));
      setLastRefresh(new Date());
    } catch {
      setComponents([]);
      setWaitEstimates(buildWaitEstimates(FALLBACK_SEGMENTS, {}));
    } finally {
      setLoading(false);
    }
  }, [actor, snapshot?.segments]);

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, 15_000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchData]);

  const displaySegments =
    waitEstimates.length > 0
      ? waitEstimates
      : buildWaitEstimates(FALLBACK_SEGMENTS, {});
  const healthPct = snapshot ? Number(snapshot.systemHealth) : 72;
  const logEntries = useMemo(
    () => generateLogEntries(displayComponents),
    [displayComponents],
  );

  const operational = displayComponents.filter(
    (c) => c.status === SystemStatus.Operational,
  ).length;
  const degraded = displayComponents.filter(
    (c) => c.status === SystemStatus.Degraded,
  ).length;
  const failed = displayComponents.filter(
    (c) => c.status === SystemStatus.Failed,
  ).length;
  const avgUptime =
    displayComponents.length > 0
      ? (
          displayComponents.reduce((s, c) => s + c.uptimePct, 0) /
          displayComponents.length
        ).toFixed(1)
      : "—";

  return (
    <div className="flex flex-col gap-6 p-6" data-ocid="monitor-page">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            System Monitor
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Infrastructure diagnostics · real-time health
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
              <RefreshCw className="h-3 w-3" />
              {lastRefresh.toLocaleTimeString()} · auto 15s
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
              Live
            </span>
          </span>
        </div>
      </div>

      {/* ── Overall Stats ── */}
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        data-ocid="system-stats"
      >
        <MetricCard
          title="Operational"
          value={loading ? "—" : operational}
          subtitle={`of ${displayComponents.length} components`}
          icon={<CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
          colorClass="text-primary"
          data-ocid="stat-operational"
        />
        <MetricCard
          title="Degraded"
          value={loading ? "—" : degraded}
          subtitle="Fallback active"
          icon={<AlertTriangle className="h-3.5 w-3.5 text-accent" />}
          colorClass={degraded > 0 ? "text-accent" : undefined}
          data-ocid="stat-degraded"
        />
        <MetricCard
          title="Failed"
          value={loading ? "—" : failed}
          subtitle="Needs intervention"
          icon={<XCircle className="h-3.5 w-3.5 text-destructive" />}
          colorClass={failed > 0 ? "text-destructive" : undefined}
          data-ocid="stat-failed"
        />
        <MetricCard
          title="Avg Uptime"
          value={loading ? "—" : `${avgUptime}%`}
          subtitle="Network-wide average"
          icon={<Activity className="h-3.5 w-3.5 text-primary" />}
          data-ocid="stat-avg-uptime"
        />
      </div>

      {/* ── Health Ring + Component Grid ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[160px_1fr]">
        {/* Health ring panel */}
        <div
          className="flex flex-col items-center justify-start gap-4 rounded-lg border border-border bg-card p-5"
          data-ocid="health-panel"
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Health Score
          </p>
          {loading ? (
            <Skeleton className="h-32 w-32 rounded-full" />
          ) : (
            <HealthRing pct={healthPct} />
          )}
          <div className="w-full space-y-1.5 border-t border-border/50 pt-3">
            {(["Sensor", "AI Model", "Database", "API"] as const).map(
              (type) => {
                const count = displayComponents.filter((c) =>
                  type === "AI Model"
                    ? c.componentType.toLowerCase().includes("ai")
                    : c.componentType === type,
                ).length;
                const IconComp = componentIcon(type);
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <IconComp className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-[9px] uppercase text-muted-foreground">
                        {type}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-semibold text-foreground">
                      {count}
                    </span>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* Component grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => `sk-comp-${i}`).map((k) => (
              <Skeleton key={k} className="h-52 rounded-lg" />
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-2 gap-3 md:grid-cols-4"
            data-ocid="component-grid"
          >
            {displayComponents.map((comp) => (
              <ComponentCard
                key={comp.id}
                comp={comp}
                series={
                  seriesMap[comp.id] ??
                  buildUptimeSeries(comp.uptimePct, comp.status)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Wait Times Table + Event Log ── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Wait time table */}
        <div
          className="flex flex-col rounded-lg border border-border bg-card overflow-hidden"
          data-ocid="wait-time-panel"
        >
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Timer className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Predictive Wait Times
            </span>
            <Badge
              variant="outline"
              className="ml-auto border-primary/30 bg-primary/10 font-mono text-[9px] text-primary"
            >
              {displaySegments.length} SEGMENTS
            </Badge>
          </div>
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }, (_, i) => `sk-wait-${i}`).map((k) => (
                <Skeleton key={k} className="h-8 rounded" />
              ))}
            </div>
          ) : (
            <WaitTimeTable estimates={displaySegments} />
          )}
          <div className="border-t border-border/40 px-4 py-2 mt-auto">
            <p className="font-mono text-[9px] text-muted-foreground">
              Rows highlighted in amber indicate total wait &gt; 120s
            </p>
          </div>
        </div>

        {/* Event log */}
        <div
          className="flex flex-col rounded-lg border border-border bg-card overflow-hidden"
          data-ocid="event-log-panel"
        >
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Zap className="h-4 w-4 text-accent" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Alert Event Log
            </span>
            <Badge
              variant="outline"
              className={cn(
                "ml-auto font-mono text-[9px]",
                logEntries.some((e) => e.severity === "Critical")
                  ? "border-destructive/35 bg-destructive/10 text-destructive"
                  : "border-primary/30 bg-primary/10 text-primary",
              )}
            >
              {logEntries.length} EVENTS
            </Badge>
          </div>
          <ScrollArea
            className="flex-1"
            style={{ maxHeight: 380 }}
            data-ocid="event-log-scroll"
          >
            {loading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 4 }, (_, i) => `sk-log-${i}`).map((k) => (
                  <Skeleton key={k} className="h-16 rounded" />
                ))}
              </div>
            ) : logEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-14">
                <CheckCircle2 className="h-7 w-7 text-primary/40" />
                <p className="font-mono text-xs text-muted-foreground">
                  All systems nominal
                </p>
                <p className="font-mono text-[10px] text-muted-foreground/60">
                  No active alerts to display
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/25">
                {logEntries.map((entry) => (
                  <EventLogEntry key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </ScrollArea>
          <div className="border-t border-border/40 px-4 py-2">
            <p className="font-mono text-[9px] text-muted-foreground">
              {logEntries.length} events · refreshes every 15s
            </p>
          </div>
        </div>
      </div>

      {/* ── Uptime Chart: inline SVG area chart ── */}
      <div
        className="rounded-lg border border-border bg-card overflow-hidden"
        data-ocid="uptime-chart"
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Clock className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
            Uptime History — 20 Simulated Ticks
          </span>
          <div className="ml-auto flex items-center gap-4">
            {[
              { label: "Sensor", color: "bg-primary" },
              { label: "AI Model", color: "bg-accent" },
              { label: "Database", color: "bg-[oklch(0.68_0.18_110)]" },
              { label: "API", color: "bg-[oklch(0.55_0.15_280)]" },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", color)} />
                <span className="font-mono text-[9px] text-muted-foreground uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4">
          <UptimeMultiChart components={displayComponents} />
        </div>
      </div>
    </div>
  );
}

// ─── Multi-line Uptime Chart ───────────────────────────────────────────────────

function UptimeMultiChart({ components }: { components: SystemComponent[] }) {
  const W = 800;
  const H = 120;
  const PAD = { top: 8, right: 8, bottom: 20, left: 32 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const typeGroups: Record<string, SystemComponent[]> = {
    Sensor: components.filter((c) => c.componentType === "Sensor"),
    "AI Model": components.filter((c) =>
      c.componentType.toLowerCase().includes("ai"),
    ),
    Database: components.filter((c) => c.componentType === "Database"),
    API: components.filter((c) => c.componentType === "API"),
  };

  const seriesDefs = [
    {
      key: "Sensor",
      stroke: "rgba(98,213,228,0.85)",
      fill: "rgba(98,213,228,0.07)",
    },
    {
      key: "AI Model",
      stroke: "rgba(217,170,59,0.85)",
      fill: "rgba(217,170,59,0.07)",
    },
    {
      key: "Database",
      stroke: "rgba(140,200,100,0.85)",
      fill: "rgba(140,200,100,0.07)",
    },
    {
      key: "API",
      stroke: "rgba(140,100,220,0.75)",
      fill: "rgba(140,100,220,0.06)",
    },
  ];

  const N = 20;

  function buildSeries(comps: SystemComponent[]): number[] {
    if (comps.length === 0)
      return Array.from({ length: N }, () => 97 + (Math.random() - 0.5) * 2);
    const base = comps.reduce((s, c) => s + c.uptimePct, 0) / comps.length;
    const status = comps.some((c) => c.status === SystemStatus.Failed)
      ? SystemStatus.Failed
      : comps.some((c) => c.status === SystemStatus.Degraded)
        ? SystemStatus.Degraded
        : SystemStatus.Operational;
    const variance =
      status === SystemStatus.Failed
        ? 18
        : status === SystemStatus.Degraded
          ? 8
          : 2.5;
    let v = base;
    return Array.from({ length: N }, () => {
      v = Math.max(60, Math.min(100, v + (Math.random() - 0.5) * variance));
      return v;
    });
  }

  const allSeries = seriesDefs.map(({ key }) =>
    buildSeries(typeGroups[key] ?? []),
  );

  const minY = 60;
  const maxY = 100;
  const scaleX = (i: number) => PAD.left + (i / (N - 1)) * innerW;
  const scaleY = (v: number) =>
    PAD.top + innerH - ((v - minY) / (maxY - minY)) * innerH;

  const yTicks = [65, 75, 85, 95, 100];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      preserveAspectRatio="none"
      className="overflow-visible"
      aria-hidden="true"
    >
      {/* Grid lines */}
      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={PAD.left}
            y1={scaleY(tick)}
            x2={W - PAD.right}
            y2={scaleY(tick)}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={1}
          />
          <text
            x={PAD.left - 4}
            y={scaleY(tick) + 3}
            fontSize={8}
            fill="rgba(150,150,170,0.7)"
            textAnchor="end"
            fontFamily="JetBrains Mono, monospace"
          >
            {tick}%
          </text>
        </g>
      ))}

      {/* X axis ticks */}
      {Array.from({ length: 5 }, (_, i) => Math.round((i / 4) * (N - 1))).map(
        (idx) => (
          <text
            key={idx}
            x={scaleX(idx)}
            y={H - 4}
            fontSize={8}
            fill="rgba(150,150,170,0.6)"
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
          >
            T{idx + 1}
          </text>
        ),
      )}

      {/* Series */}
      {seriesDefs.map(({ key, stroke, fill }, si) => {
        const pts = allSeries[si];
        const linePath = pts
          .map((v, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(v)}`)
          .join(" ");
        const areaPath = `${linePath} L ${scaleX(N - 1)} ${PAD.top + innerH} L ${scaleX(0)} ${PAD.top + innerH} Z`;
        return (
          <g key={key}>
            <path d={areaPath} fill={fill} />
            <path
              d={linePath}
              fill="none"
              stroke={stroke}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </svg>
  );
}
