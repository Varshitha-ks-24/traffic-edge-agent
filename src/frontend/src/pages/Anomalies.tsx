import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimulationStore } from "@/lib/simulationStore";
import { resolveAnomaly } from "@/lib/trafficApi";
import { cn } from "@/lib/utils";
import { AlertSeverity, AnomalyType } from "@/types/traffic";
import type { Anomaly } from "@/types/traffic";
import {
  Activity,
  AlertTriangle,
  Car,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  MapPin,
  Package,
  PawPrint,
  ShieldCheck,
  Siren,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

type SeverityFilter = AlertSeverity | "All";
type TypeFilter = AnomalyType | "All";

// ── Constants ──────────────────────────────────────────────────────────────────

const SEVERITY_FILTERS: SeverityFilter[] = [
  "All",
  AlertSeverity.Critical,
  AlertSeverity.High,
  AlertSeverity.Medium,
  AlertSeverity.Low,
];

const TYPE_FILTERS: TypeFilter[] = [
  "All",
  AnomalyType.Accident,
  AnomalyType.EmergencyVehicle,
  AnomalyType.Pedestrian,
  AnomalyType.Animal,
  AnomalyType.Obstacle,
  AnomalyType.VehicleBreakdown,
];

const TYPE_LABEL: Record<AnomalyType, string> = {
  [AnomalyType.Accident]: "Accident",
  [AnomalyType.EmergencyVehicle]: "Emergency",
  [AnomalyType.Pedestrian]: "Pedestrian",
  [AnomalyType.Animal]: "Animal",
  [AnomalyType.Obstacle]: "Obstacle",
  [AnomalyType.VehicleBreakdown]: "Breakdown",
};

const SEVERITY_ORDER: Record<AlertSeverity, number> = {
  [AlertSeverity.Critical]: 0,
  [AlertSeverity.High]: 1,
  [AlertSeverity.Medium]: 2,
  [AlertSeverity.Low]: 3,
};

const SEVERITY_BAR: Record<AlertSeverity, string> = {
  [AlertSeverity.Critical]: "bg-destructive",
  [AlertSeverity.High]: "bg-accent",
  [AlertSeverity.Medium]: "bg-primary",
  [AlertSeverity.Low]: "bg-muted-foreground",
};

const TYPE_BAR_COLOR: Record<AnomalyType, string> = {
  [AnomalyType.Accident]: "bg-destructive",
  [AnomalyType.EmergencyVehicle]: "bg-accent",
  [AnomalyType.Pedestrian]: "bg-primary",
  [AnomalyType.Animal]: "bg-[oklch(0.7_0.15_145)]",
  [AnomalyType.Obstacle]: "bg-[oklch(0.65_0.18_30)]",
  [AnomalyType.VehicleBreakdown]: "bg-muted-foreground",
};

const TYPE_TEXT_COLOR: Record<AnomalyType, string> = {
  [AnomalyType.Accident]: "text-destructive",
  [AnomalyType.EmergencyVehicle]: "text-accent",
  [AnomalyType.Pedestrian]: "text-primary",
  [AnomalyType.Animal]: "text-[oklch(0.7_0.15_145)]",
  [AnomalyType.Obstacle]: "text-[oklch(0.65_0.18_30)]",
  [AnomalyType.VehicleBreakdown]: "text-muted-foreground",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function AnomalyTypeIcon({
  type,
  className,
}: { type: AnomalyType; className?: string }) {
  const cls = cn("h-4 w-4", className);
  switch (type) {
    case AnomalyType.Accident:
      return <Car className={cls} />;
    case AnomalyType.EmergencyVehicle:
      return <Siren className={cls} />;
    case AnomalyType.Pedestrian:
      return <User className={cls} />;
    case AnomalyType.Animal:
      return <PawPrint className={cls} />;
    case AnomalyType.Obstacle:
      return <Package className={cls} />;
    case AnomalyType.VehicleBreakdown:
      return <Wrench className={cls} />;
  }
}

function timeAgo(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  const secs = Math.floor((Date.now() - ms) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

function formatTs(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// Derive CV model confidence from severity
function cvConfidence(severity: AlertSeverity): number {
  const map: Record<AlertSeverity, number> = {
    [AlertSeverity.Critical]: 97,
    [AlertSeverity.High]: 88,
    [AlertSeverity.Medium]: 74,
    [AlertSeverity.Low]: 61,
  };
  return map[severity] ?? 70;
}

// Estimate affected vehicles from severity
function affectedVehicles(severity: AlertSeverity): number {
  const map: Record<AlertSeverity, number> = {
    [AlertSeverity.Critical]: 42,
    [AlertSeverity.High]: 28,
    [AlertSeverity.Medium]: 14,
    [AlertSeverity.Low]: 6,
  };
  return map[severity] ?? 10;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-destructive/40 bg-destructive/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-destructive">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
      </span>
      LIVE
    </span>
  );
}

interface FilterToggleGroupProps<T extends string> {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  labelFn?: (v: T) => string;
  activeClassFn?: (v: T) => string;
  dataOcidPrefix?: string;
}

function FilterToggleGroup<T extends string>({
  options,
  value,
  onChange,
  labelFn,
  activeClassFn,
  dataOcidPrefix = "filter",
}: FilterToggleGroupProps<T>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const isActive = value === opt;
        const activeClass = activeClassFn
          ? activeClassFn(opt)
          : "border-primary bg-primary/20 text-primary";
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "rounded border px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider transition-smooth",
              isActive
                ? activeClass
                : "border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
            data-ocid={`${dataOcidPrefix}-${opt.toLowerCase()}`}
          >
            {labelFn ? labelFn(opt) : opt}
          </button>
        );
      })}
    </div>
  );
}

interface TypeBarChartProps {
  anomalies: Anomaly[];
}

function TypeBarChart({ anomalies }: TypeBarChartProps) {
  const types = Object.values(AnomalyType);
  const counts = types.map((t) => ({
    type: t,
    count: anomalies.filter((a) => a.anomalyType === t).length,
  }));
  const max = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Anomaly Distribution by Type
      </p>
      <div className="space-y-3">
        {counts.map(({ type, count }) => (
          <div key={type} className="flex items-center gap-3">
            <div
              className={cn(
                "flex w-28 shrink-0 items-center gap-1.5",
                TYPE_TEXT_COLOR[type],
              )}
            >
              <AnomalyTypeIcon type={type} className="h-3 w-3 shrink-0" />
              <span className="truncate font-mono text-[11px] font-medium">
                {TYPE_LABEL[type]}
              </span>
            </div>
            <div className="relative h-4 flex-1 overflow-hidden rounded bg-muted/40">
              <div
                className={cn(
                  "h-full rounded transition-all duration-500",
                  TYPE_BAR_COLOR[type],
                )}
                style={{
                  width: `${(count / max) * 100}%`,
                  minWidth: count > 0 ? "4px" : "0",
                }}
              />
            </div>
            <span className="w-5 shrink-0 text-right font-mono text-xs text-muted-foreground">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Anomaly Card ──────────────────────────────────────────────────────────────

interface AnomalyCardProps {
  anomaly: Anomaly;
  segmentName: string;
  segmentDistrict: string;
  onResolve: (id: string) => Promise<void>;
  resolving: boolean;
}

function AnomalyCard({
  anomaly,
  segmentName,
  segmentDistrict,
  onResolve,
  resolving,
}: AnomalyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isCritical = anomaly.severity === AlertSeverity.Critical;
  const confidence = cvConfidence(anomaly.severity);
  const vehicles = affectedVehicles(anomaly.severity);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card transition-smooth hover:border-primary/30",
        isCritical ? "border-destructive/40 glow-red" : "border-border",
        !anomaly.isActive && "opacity-60",
      )}
      data-ocid={`anomaly-card-${anomaly.id}`}
    >
      {/* Severity side stripe */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-0.5",
          SEVERITY_BAR[anomaly.severity],
        )}
      />

      <div className="flex flex-1 flex-col gap-2 p-4 pl-4.5">
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {anomaly.isActive && (
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
              </span>
            )}
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted/60",
                TYPE_TEXT_COLOR[anomaly.anomalyType],
              )}
            >
              <AnomalyTypeIcon type={anomaly.anomalyType} />
            </span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {TYPE_LABEL[anomaly.anomalyType]}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge status={anomaly.severity} />
            {!anomaly.isActive && (
              <Badge
                variant="outline"
                className="font-mono text-[10px] border-muted text-muted-foreground"
              >
                RESOLVED
              </Badge>
            )}
          </div>
        </div>

        {/* Location + time */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 font-mono text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1 text-primary">
            <MapPin className="h-3 w-3" />
            {segmentName}
          </span>
          <span>{segmentDistrict}</span>
          <span className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            {timeAgo(anomaly.detectedAt)}
          </span>
          <span className="ml-auto font-mono text-[10px] text-muted-foreground/70">
            {formatTs(anomaly.detectedAt)}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm leading-snug text-foreground/90">
          {anomaly.description}
        </p>

        {/* Expand toggle */}
        <div className="border-t border-border/50 pt-2">
          <button
            type="button"
            className="flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors duration-200 hover:text-primary"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            data-ocid={`anomaly-expand-${anomaly.id}`}
          >
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              Detection Details &amp; AI Reasoning
            </span>
            {expanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>

          {/* Expanded detail */}
          {expanded && (
            <div className="mt-3 space-y-3">
              {/* AI Reasoning */}
              <div>
                <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  AI Reasoning
                </p>
                <p className="rounded bg-muted/50 px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                  {anomaly.reasoning}
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {/* CV Confidence */}
                <div className="rounded-md border border-border bg-muted/20 p-3">
                  <div className="mb-2 flex items-center gap-1.5">
                    <Cpu className="h-3 w-3 text-primary" />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      CV Model Confidence
                    </span>
                  </div>
                  <p className="font-mono text-xl font-bold text-primary">
                    {confidence}%
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>

                {/* Affected vehicles */}
                <div className="rounded-md border border-border bg-muted/20 p-3">
                  <div className="mb-2 flex items-center gap-1.5">
                    <Users className="h-3 w-3 text-accent" />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      Affected Vehicles
                    </span>
                  </div>
                  <p className="font-mono text-xl font-bold text-accent">
                    ~{vehicles}
                  </p>
                </div>

                {/* Anomaly ID */}
                <div className="col-span-2 rounded-md border border-border bg-muted/20 p-3 sm:col-span-1">
                  <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    Anomaly ID
                  </p>
                  <p className="break-all font-mono text-[10px] text-foreground/60">
                    {anomaly.id}
                  </p>
                </div>
              </div>

              {/* Resolve action */}
              {anomaly.isActive && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-primary/40 font-mono text-[11px] uppercase tracking-wider text-primary hover:bg-primary/10"
                    disabled={resolving}
                    onClick={() => onResolve(anomaly.id)}
                    data-ocid={`anomaly-resolve-${anomaly.id}`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {resolving ? "Resolving…" : "Mark Resolved"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function Anomalies() {
  const { snapshot, isLoading, actor, fetchSnapshot } = useSimulationStore();

  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [resolvingIds, setResolvingIds] = useState<Set<string>>(new Set());
  const prevCriticalIds = useRef<Set<string>>(new Set());

  // Build segment map from snapshot
  const segmentMap = useMemo(() => {
    const map: Record<string, { name: string; district: string }> = {};
    for (const seg of snapshot?.segments ?? []) {
      map[seg.id] = { name: seg.name, district: seg.district };
    }
    return map;
  }, [snapshot]);

  // All anomalies from snapshot active list
  const allAnomalies = useMemo(
    () => snapshot?.activeAnomalies ?? [],
    [snapshot],
  );

  // Toast new critical anomalies
  useEffect(() => {
    const newCriticals = allAnomalies.filter(
      (a) =>
        a.severity === AlertSeverity.Critical &&
        a.isActive &&
        !prevCriticalIds.current.has(a.id),
    );
    for (const a of newCriticals) {
      toast.error(`Critical: ${a.description}`, { duration: 6000, icon: "🚨" });
    }
    prevCriticalIds.current = new Set(
      allAnomalies
        .filter((a) => a.severity === AlertSeverity.Critical && a.isActive)
        .map((a) => a.id),
    );
  }, [allAnomalies]);

  // Stats
  const activeCount = allAnomalies.filter((a) => a.isActive).length;
  const criticalCount = allAnomalies.filter(
    (a) => a.isActive && a.severity === AlertSeverity.Critical,
  ).length;
  const resolvedCount = allAnomalies.filter((a) => !a.isActive).length;

  // Filtered + sorted
  const filtered = useMemo(() => {
    return allAnomalies
      .filter((a) => {
        const svOk = severityFilter === "All" || a.severity === severityFilter;
        const tpOk = typeFilter === "All" || a.anomalyType === typeFilter;
        return svOk && tpOk;
      })
      .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  }, [allAnomalies, severityFilter, typeFilter]);

  const handleResolve = useCallback(
    async (id: string) => {
      if (!actor) return;
      setResolvingIds((prev) => new Set(prev).add(id));
      try {
        await resolveAnomaly(actor, id);
        toast.success("Anomaly marked as resolved");
        await fetchSnapshot();
      } catch {
        toast.error("Failed to resolve anomaly");
      } finally {
        setResolvingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [actor, fetchSnapshot],
  );

  const severityActiveClass = (v: SeverityFilter): string => {
    const map: Record<SeverityFilter, string> = {
      All: "border-border bg-secondary text-foreground",
      [AlertSeverity.Critical]:
        "border-destructive/50 bg-destructive/15 text-destructive",
      [AlertSeverity.High]: "border-accent/50 bg-accent/15 text-accent",
      [AlertSeverity.Medium]: "border-primary/50 bg-primary/15 text-primary",
      [AlertSeverity.Low]:
        "border-muted-foreground/50 bg-muted text-muted-foreground",
    };
    return map[v] ?? "border-primary bg-primary/20 text-primary";
  };

  return (
    <div className="flex flex-col gap-6 p-6" data-ocid="anomalies-page">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Edge-Case Anomaly Detection
            </h1>
            <LiveBadge />
          </div>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            Real-time computer vision pipeline monitoring unexpected road events
          </p>
        </div>
      </div>

      {/* Summary metric cards */}
      {isLoading && !snapshot ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((k) => (
            <Skeleton key={k} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : (
        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          data-ocid="anomaly-metrics"
        >
          <MetricCard
            title="Total Anomalies"
            value={allAnomalies.length}
            icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
            data-ocid="anomaly-stat-total"
          />
          <MetricCard
            title="Active"
            value={activeCount}
            trend={activeCount > 3 ? "up" : "neutral"}
            icon={<Activity className="h-4 w-4 text-primary" />}
            colorClass="text-primary"
            className="glow-cyan"
            data-ocid="anomaly-stat-active"
          />
          <MetricCard
            title="Critical"
            value={criticalCount}
            trend={criticalCount > 0 ? "up" : "neutral"}
            icon={<Siren className="h-4 w-4 text-destructive" />}
            colorClass={criticalCount > 0 ? "text-destructive" : undefined}
            className={criticalCount > 0 ? "glow-red" : ""}
            data-ocid="anomaly-stat-critical"
          />
          <MetricCard
            title="Resolved Today"
            value={resolvedCount}
            trend="down"
            icon={<CheckCircle className="h-4 w-4 text-accent" />}
            colorClass="text-accent"
            data-ocid="anomaly-stat-resolved"
          />
        </div>
      )}

      {/* Type breakdown bar chart */}
      {snapshot && <TypeBarChart anomalies={allAnomalies} />}

      {/* Filter bar */}
      <div
        className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
        data-ocid="anomaly-filter-bar"
      >
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Filter by Severity
          </span>
          <FilterToggleGroup
            options={SEVERITY_FILTERS}
            value={severityFilter}
            onChange={setSeverityFilter}
            labelFn={(v) => (v === "All" ? "All" : v)}
            activeClassFn={severityActiveClass}
            dataOcidPrefix="severity-filter"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Filter by Type
          </span>
          <FilterToggleGroup
            options={TYPE_FILTERS}
            value={typeFilter}
            onChange={setTypeFilter}
            labelFn={(v) =>
              v === "All" ? "All" : TYPE_LABEL[v as AnomalyType]
            }
            dataOcidPrefix="type-filter"
          />
        </div>
      </div>

      {/* Anomaly list */}
      <div className="flex flex-col gap-2" data-ocid="anomaly-list">
        {isLoading && !snapshot ? (
          [1, 2, 3].map((k) => <Skeleton key={k} className="h-36 rounded-lg" />)
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-card/50 py-16 text-center"
            data-ocid="anomaly-empty-state"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground">
                No active anomalies
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {severityFilter !== "All" || typeFilter !== "All"
                  ? "No anomalies match the current filters."
                  : "All systems operating normally."}
              </p>
            </div>
            {(severityFilter !== "All" || typeFilter !== "All") && (
              <Button
                size="sm"
                variant="outline"
                className="font-mono text-[11px]"
                onClick={() => {
                  setSeverityFilter("All");
                  setTypeFilter("All");
                }}
                data-ocid="clear-filters-btn"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          filtered.map((anomaly) => {
            const seg = segmentMap[anomaly.segmentId];
            return (
              <AnomalyCard
                key={anomaly.id}
                anomaly={anomaly}
                segmentName={seg?.name ?? anomaly.segmentId}
                segmentDistrict={seg?.district ?? "—"}
                onResolve={handleResolve}
                resolving={resolvingIds.has(anomaly.id)}
              />
            );
          })
        )}
      </div>

      {filtered.length > 0 && (
        <p className="font-mono text-[10px] text-muted-foreground">
          Showing {filtered.length} of {allAnomalies.length} anomalies
        </p>
      )}
    </div>
  );
}
