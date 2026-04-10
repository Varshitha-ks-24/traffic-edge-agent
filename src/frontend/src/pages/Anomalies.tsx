import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimulationStore } from "@/lib/simulationStore";
import { getAnomalies, resolveAnomaly } from "@/lib/trafficApi";
import { cn } from "@/lib/utils";
import { AlertSeverity, AnomalyType } from "@/types/traffic";
import type { Anomaly } from "@/types/traffic";
import {
  Activity,
  AlertTriangle,
  Car,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  MapPin,
  Package,
  PawPrint,
  Siren,
  User,
  Wrench,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

// ── Constants ──────────────────────────────────────────────────────────────────

const SEVERITY_BAR: Record<AlertSeverity, string> = {
  [AlertSeverity.Critical]: "bg-destructive",
  [AlertSeverity.High]: "bg-orange-500",
  [AlertSeverity.Medium]: "bg-accent",
  [AlertSeverity.Low]: "bg-primary",
};

const SEVERITY_ORDER: Record<AlertSeverity, number> = {
  [AlertSeverity.Critical]: 0,
  [AlertSeverity.High]: 1,
  [AlertSeverity.Medium]: 2,
  [AlertSeverity.Low]: 3,
};

const TYPE_CHART_COLOR: Record<AnomalyType, string> = {
  [AnomalyType.Accident]: "oklch(0.62 0.24 24)",
  [AnomalyType.EmergencyVehicle]: "oklch(0.62 0.24 24)",
  [AnomalyType.Pedestrian]: "oklch(0.72 0.23 55)",
  [AnomalyType.Animal]: "oklch(0.68 0.18 110)",
  [AnomalyType.Obstacle]: "oklch(0.62 0.25 195)",
  [AnomalyType.VehicleBreakdown]: "oklch(0.55 0.15 280)",
};

const TYPE_LABEL: Record<AnomalyType, string> = {
  [AnomalyType.Pedestrian]: "Pedestrian",
  [AnomalyType.Animal]: "Animal",
  [AnomalyType.Obstacle]: "Obstacle",
  [AnomalyType.Accident]: "Accident",
  [AnomalyType.VehicleBreakdown]: "Breakdown",
  [AnomalyType.EmergencyVehicle]: "Emergency",
};

type SeverityFilter = AlertSeverity | "All";
const SEVERITY_FILTERS: SeverityFilter[] = [
  "All",
  AlertSeverity.Critical,
  AlertSeverity.High,
  AlertSeverity.Medium,
  AlertSeverity.Low,
];
const FILTER_LABEL: Record<SeverityFilter, string> = {
  All: "All",
  [AlertSeverity.Critical]: "Critical",
  [AlertSeverity.High]: "High",
  [AlertSeverity.Medium]: "Medium",
  [AlertSeverity.Low]: "Low",
};
const FILTER_ACTIVE_CLASS: Record<SeverityFilter, string> = {
  All: "bg-secondary text-foreground border-border",
  [AlertSeverity.Critical]:
    "bg-destructive/20 text-destructive border-destructive/40",
  [AlertSeverity.High]: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  [AlertSeverity.Medium]: "bg-accent/20 text-accent border-accent/40",
  [AlertSeverity.Low]: "bg-primary/20 text-primary border-primary/40",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function AnomalyTypeIcon({
  type,
  className,
}: {
  type: AnomalyType;
  className?: string;
}) {
  const props = { className: cn("h-4 w-4", className) };
  switch (type) {
    case AnomalyType.Pedestrian:
      return <User {...props} />;
    case AnomalyType.Animal:
      return <PawPrint {...props} />;
    case AnomalyType.Obstacle:
      return <Package {...props} />;
    case AnomalyType.Accident:
      return <Car {...props} />;
    case AnomalyType.VehicleBreakdown:
      return <Wrench {...props} />;
    case AnomalyType.EmergencyVehicle:
      return <Siren {...props} />;
  }
}

function timeAgo(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  const secs = Math.floor((Date.now() - ms) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

// ── Anomaly Card ──────────────────────────────────────────────────────────────

interface AnomalyCardProps {
  anomaly: Anomaly;
  onResolve: (id: string) => Promise<void>;
  resolving: boolean;
}

function AnomalyCard({ anomaly, onResolve, resolving }: AnomalyCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "relative flex overflow-hidden rounded-lg border bg-card transition-smooth hover:border-primary/20",
        anomaly.isActive ? "border-border" : "border-border/40 opacity-60",
      )}
      data-ocid={`anomaly-card-${anomaly.id}`}
    >
      {/* Severity side bar */}
      <div
        className={cn(
          "w-1 shrink-0",
          SEVERITY_BAR[anomaly.severity as AlertSeverity] ?? "bg-muted",
        )}
      />

      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {anomaly.isActive && (
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
              </span>
            )}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
              <AnomalyTypeIcon type={anomaly.anomalyType as AnomalyType} />
            </span>
            <span className="truncate font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              {TYPE_LABEL[anomaly.anomalyType as AnomalyType] ??
                anomaly.anomalyType}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge status={anomaly.severity} />
            {!anomaly.isActive && (
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                RESOLVED
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-snug text-foreground/90">
          {anomaly.description}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {anomaly.segmentId}
          </span>
          <span className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            {timeAgo(anomaly.detectedAt)}
          </span>
        </div>

        {/* AI Reasoning toggle */}
        <div className="border-t border-border/50 pt-2">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors duration-200 hover:text-primary"
            onClick={() => setExpanded((v) => !v)}
            data-ocid={`anomaly-reasoning-toggle-${anomaly.id}`}
          >
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              AI Reasoning
            </span>
            {expanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
          {expanded && (
            <p className="mt-2 rounded bg-muted/60 px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {anomaly.reasoning}
            </p>
          )}
        </div>

        {/* Resolve action */}
        {anomaly.isActive && (
          <div className="flex justify-end pt-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 border-primary/30 font-mono text-[10px] uppercase tracking-wider text-primary hover:bg-primary/10"
              disabled={resolving}
              onClick={() => onResolve(anomaly.id)}
              data-ocid={`anomaly-resolve-${anomaly.id}`}
            >
              <CheckCircle className="h-3 w-3" />
              {resolving ? "Resolving…" : "Resolve"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Distribution Chart ────────────────────────────────────────────────────────

function DistributionChart({ anomalies }: { anomalies: Anomaly[] }) {
  const counts = Object.values(AnomalyType).map((t) => ({
    name: TYPE_LABEL[t],
    count: anomalies.filter((a) => a.anomalyType === t).length,
    color: TYPE_CHART_COLOR[t],
  }));

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Anomaly Distribution by Type
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={counts}
          barCategoryGap="30%"
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <XAxis
            dataKey="name"
            tick={{
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              fill: "hsl(var(--muted-foreground))",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              fill: "oklch(0.52 0 0)",
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "oklch(0.15 0 0)",
              border: "1px solid oklch(0.22 0 0)",
              borderRadius: "6px",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: "oklch(0.93 0 0)",
            }}
            cursor={{ fill: "oklch(0.18 0 0)" }}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {counts.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Detection Stats ───────────────────────────────────────────────────────────

function DetectionStats({ anomalies }: { anomalies: Anomaly[] }) {
  const typeCounts = Object.values(AnomalyType).map((t) => ({
    type: t,
    count: anomalies.filter((a) => a.anomalyType === t).length,
  }));
  const mostCommon = typeCounts.reduce(
    (best, cur) => (cur.count > best.count ? cur : best),
    { type: AnomalyType.Pedestrian, count: 0 },
  );

  const stats: { label: string; value: string; color: string }[] = [
    {
      label: "Total Detected",
      value: String(anomalies.length),
      color: "text-foreground",
    },
    {
      label: "Most Common",
      value: TYPE_LABEL[mostCommon.type],
      color: "text-accent",
    },
    { label: "Avg Resolution", value: "4.2 min", color: "text-primary" },
    { label: "ML Accuracy", value: "94.7%", color: "text-primary" },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Detection Statistics
      </h3>
      <dl className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, color }) => (
          <div
            key={label}
            className="flex flex-col gap-0.5 rounded-md bg-muted/50 p-3"
          >
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              {label}
            </span>
            <span
              className={cn(
                "font-display text-lg font-bold leading-none tabular-nums",
                color,
              )}
            >
              {value}
            </span>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function Anomalies() {
  const actor = useSimulationStore((s) => s.actor);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("All");
  const [activeOnly, setActiveOnly] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const prevCriticalIds = useRef<Set<string>>(new Set());

  const fetchAnomalies = useCallback(async () => {
    if (!actor) return;
    try {
      const data = await getAnomalies(actor, false);
      const sorted = [...data].sort(
        (a, b) =>
          (SEVERITY_ORDER[a.severity as AlertSeverity] ?? 99) -
          (SEVERITY_ORDER[b.severity as AlertSeverity] ?? 99),
      );
      // Toast new critical anomalies
      const newCriticals = sorted.filter(
        (a) =>
          a.severity === AlertSeverity.Critical &&
          a.isActive &&
          !prevCriticalIds.current.has(a.id),
      );
      for (const a of newCriticals) {
        toast.error(`Critical: ${a.description}`, {
          duration: 6000,
          icon: "🚨",
        });
      }
      prevCriticalIds.current = new Set(
        sorted
          .filter((a) => a.severity === AlertSeverity.Critical && a.isActive)
          .map((a) => a.id),
      );
      setAnomalies(sorted);
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    fetchAnomalies();
    const id = setInterval(fetchAnomalies, 5000);
    return () => clearInterval(id);
  }, [fetchAnomalies]);

  const handleResolve = useCallback(
    async (anomalyId: string) => {
      if (!actor) return;
      setResolvingId(anomalyId);
      try {
        await resolveAnomaly(actor, anomalyId);
        toast.success("Anomaly resolved");
        await fetchAnomalies();
      } catch {
        toast.error("Failed to resolve anomaly");
      } finally {
        setResolvingId(null);
      }
    },
    [actor, fetchAnomalies],
  );

  const filtered = anomalies.filter((a) => {
    if (activeOnly && !a.isActive) return false;
    if (severityFilter !== "All" && a.severity !== severityFilter) return false;
    return true;
  });

  const activeCount = anomalies.filter((a) => a.isActive).length;
  const resolvedCount = anomalies.filter((a) => !a.isActive).length;
  const criticalCount = anomalies.filter(
    (a) => a.severity === AlertSeverity.Critical && a.isActive,
  ).length;

  return (
    <div className="flex flex-col gap-6 p-6" data-ocid="anomalies-page">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Edge-Case Anomaly Detection
        </h1>
        <p className="font-mono text-xs text-muted-foreground">
          Real-time computer vision pipeline monitoring unexpected road events
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          title="Total Detected"
          value={anomalies.length}
          icon={<Activity className="h-4 w-4 text-primary" />}
          data-ocid="anomaly-stat-total"
        />
        <MetricCard
          title="Active Anomalies"
          value={activeCount}
          trend={activeCount > 3 ? "up" : "neutral"}
          icon={<AlertTriangle className="h-4 w-4 text-accent" />}
          colorClass="text-accent"
          data-ocid="anomaly-stat-active"
        />
        <MetricCard
          title="Resolved Today"
          value={resolvedCount}
          trend="down"
          icon={<CheckCircle className="h-4 w-4 text-primary" />}
          data-ocid="anomaly-stat-resolved"
        />
        <MetricCard
          title="Critical Alerts"
          value={criticalCount}
          trend={criticalCount > 0 ? "up" : "neutral"}
          icon={<Siren className="h-4 w-4 text-destructive" />}
          colorClass={criticalCount > 0 ? "text-destructive" : undefined}
          data-ocid="anomaly-stat-critical"
        />
      </div>

      {/* Filter Bar */}
      <div
        className="flex flex-wrap items-center gap-2"
        data-ocid="anomaly-filter-bar"
      >
        {SEVERITY_FILTERS.map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setSeverityFilter(f)}
            className={cn(
              "rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-smooth",
              severityFilter === f
                ? FILTER_ACTIVE_CLASS[f]
                : "border-border/50 bg-muted/30 text-muted-foreground hover:border-border hover:text-foreground",
            )}
            data-ocid={`anomaly-filter-${f.toLowerCase()}`}
          >
            {FILTER_LABEL[f]}
          </button>
        ))}
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setActiveOnly((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-smooth",
              activeOnly
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border/50 bg-muted/30 text-muted-foreground hover:border-border hover:text-foreground",
            )}
            data-ocid="anomaly-filter-active-toggle"
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                activeOnly ? "bg-primary" : "bg-muted-foreground",
              )}
            />
            {activeOnly ? "Active Only" : "Show All"}
          </button>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Anomaly list */}
        <div
          className="flex flex-col gap-3 lg:col-span-2"
          data-ocid="anomaly-list"
        >
          {loading ? (
            [1, 2, 3, 4].map((k) => (
              <Skeleton key={k} className="h-36 rounded-lg" />
            ))
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/50 py-16 text-center"
              data-ocid="anomaly-empty-state"
            >
              <CheckCircle className="h-10 w-10 text-primary/40" />
              <p className="font-mono text-xs text-muted-foreground">
                No anomalies match the current filters
              </p>
              <button
                type="button"
                onClick={() => {
                  setSeverityFilter("All");
                  setActiveOnly(false);
                }}
                className="font-mono text-[10px] uppercase tracking-wider text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map((anomaly) => (
              <AnomalyCard
                key={anomaly.id}
                anomaly={anomaly}
                onResolve={handleResolve}
                resolving={resolvingId === anomaly.id}
              />
            ))
          )}
        </div>

        {/* Right panels */}
        <div className="flex flex-col gap-4">
          <DistributionChart anomalies={anomalies} />
          <DetectionStats anomalies={anomalies} />
        </div>
      </div>
    </div>
  );
}
