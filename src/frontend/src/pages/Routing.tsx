import { createActor } from "@/backend";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimulationStore } from "@/lib/simulationStore";
import { computeOptimalRoute, getRoutes, getSegments } from "@/lib/trafficApi";
import { cn } from "@/lib/utils";
import type { Anomaly, Route, TrafficSegment } from "@/types/traffic";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Navigation,
  RefreshCw,
  Route as RouteIcon,
  Shuffle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Constants ────────────────────────────────────────────────────────────────

const DISTRICTS = [
  "Downtown Core",
  "Westside Business District",
  "Eastside Residential",
  "North Industrial Zone",
] as const;

type District = (typeof DISTRICTS)[number];

const CONGESTION_RED = 70;
const CONGESTION_AMBER = 35;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function congestionColor(pct: number): string {
  if (pct >= CONGESTION_RED) return "oklch(0.62 0.24 24)";
  if (pct >= CONGESTION_AMBER) return "oklch(0.72 0.23 55)";
  return "oklch(0.62 0.25 195)";
}

function congestionLabel(pct: number): string {
  if (pct >= CONGESTION_RED) return "Critical";
  if (pct >= CONGESTION_AMBER) return "Moderate";
  return "Clear";
}

function fmtTime(ts: bigint): string {
  return new Date(Number(ts)).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// ─── Rerouting history ────────────────────────────────────────────────────────

interface RerouteEvent {
  id: string;
  timestamp: string;
  segment: string;
  reason: string;
  action: string;
  severity: "high" | "medium" | "low";
}

const STATIC_EVENTS: RerouteEvent[] = [
  {
    id: "s1",
    timestamp: "12:04:22",
    segment: "Westside Ave",
    reason: "Congestion spike detected (>75%)",
    action: "Redirected 34 vehicles via North Bypass",
    severity: "high",
  },
  {
    id: "s2",
    timestamp: "11:52:01",
    segment: "East Harbor Rd",
    reason: "Animal obstacle detected on road surface",
    action: "Temporary signal hold + alternate route activated",
    severity: "medium",
  },
  {
    id: "s3",
    timestamp: "11:38:47",
    segment: "Industrial Blvd",
    reason: "Active construction zone — lane reduction",
    action: "Weight-restricted detour applied to heavy vehicles",
    severity: "low",
  },
];

function buildRerouteHistory(
  anomalies: Anomaly[],
  segMap: Record<string, string>,
): RerouteEvent[] {
  const live: RerouteEvent[] = anomalies
    .filter((a) => a.isActive)
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      timestamp: fmtTime(a.detectedAt),
      segment: segMap[a.segmentId] ?? a.segmentId,
      reason: a.description,
      action: `Rerouted — ${a.reasoning.slice(0, 80)}${a.reasoning.length > 80 ? "…" : ""}`,
      severity:
        a.severity === "Critical" || a.severity === "High"
          ? "high"
          : a.severity === "Medium"
            ? "medium"
            : "low",
    }));

  return [...live, ...STATIC_EVENTS].slice(0, 5);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function RouteBreadcrumb({ segments }: { segments: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {segments.map((seg, i) => (
        <span className="flex items-center gap-1" key={seg}>
          <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 font-mono text-[11px] text-primary">
            <MapPin className="h-3 w-3 shrink-0" />
            {seg}
          </span>
          {i < segments.length - 1 && (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
        </span>
      ))}
    </div>
  );
}

function RoutePathDiagram({ segments }: { segments: string[] }) {
  if (segments.length === 0) return null;
  return (
    <div className="mt-3 flex items-start gap-0 overflow-x-auto pb-2">
      {segments.map((seg, i) => (
        <span className="flex shrink-0 items-start" key={seg}>
          <span className="flex flex-col items-center gap-1">
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono text-[10px] font-bold",
                i === 0 || i === segments.length - 1
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border bg-muted text-muted-foreground",
              )}
            >
              {i + 1}
            </span>
            <span className="max-w-[68px] break-words text-center font-mono text-[9px] leading-tight text-muted-foreground">
              {seg}
            </span>
          </span>
          {i < segments.length - 1 && (
            <span className="mx-1 mt-3.5 h-0.5 w-8 shrink-0 bg-primary/30" />
          )}
        </span>
      ))}
    </div>
  );
}

function RouteResultCard({ route }: { route: Route }) {
  return (
    <div
      className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4"
      data-ocid="route-result-card"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" />
            <span className="font-display text-sm font-semibold text-foreground">
              {route.name}
            </span>
            {route.isOptimal && (
              <Badge
                className="border-primary/40 bg-primary/15 font-mono text-[10px] text-primary"
                variant="outline"
              >
                OPTIMAL
              </Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1 font-mono text-xs text-muted-foreground">
            <span>{route.fromDistrict}</span>
            <ArrowRight className="h-3 w-3" />
            <span>{route.toDistrict}</span>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="text-center">
            <div className="font-display text-lg font-bold tabular-nums text-primary">
              {route.totalDistance.toFixed(1)}
              <span className="ml-0.5 font-mono text-[10px] text-muted-foreground">
                km
              </span>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Distance
            </div>
          </div>
          <div className="text-center">
            <div className="font-display text-lg font-bold tabular-nums text-accent">
              {Number(route.estimatedMinutes)}
              <span className="ml-0.5 font-mono text-[10px] text-muted-foreground">
                min
              </span>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Est. Time
            </div>
          </div>
        </div>
      </div>

      {route.segments.length > 0 && (
        <div className="mt-3">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Route Path
          </div>
          <RouteBreadcrumb segments={route.segments} />
          <RoutePathDiagram segments={route.segments} />
        </div>
      )}

      {route.reasoning && (
        <div className="mt-3 flex gap-2 rounded border border-primary/20 bg-background/60 p-3">
          <Brain className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <div className="mb-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
              AI Reasoning
            </div>
            <p className="font-body text-xs leading-relaxed text-muted-foreground">
              {route.reasoning}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Recharts custom tooltip ──────────────────────────────────────────────────

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CongestionTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const pct = payload[0].value;
  return (
    <div className="rounded border border-border bg-popover px-3 py-2 shadow-lg">
      <div className="font-mono text-[10px] text-muted-foreground">{label}</div>
      <div
        className="mt-0.5 font-display text-sm font-bold tabular-nums"
        style={{ color: congestionColor(pct) }}
      >
        {pct}%{" "}
        <span className="font-mono text-[10px] font-normal text-muted-foreground">
          — {congestionLabel(pct)}
        </span>
      </div>
    </div>
  );
}

// ─── Routes table ─────────────────────────────────────────────────────────────

type SortKey = "name" | "totalDistance" | "estimatedMinutes";

function SortIndicator({ active, asc }: { active: boolean; asc: boolean }) {
  if (!active) return null;
  return (
    <span className="ml-1 font-mono text-[10px] text-primary">
      {asc ? "↑" : "↓"}
    </span>
  );
}

function RouteTableRow({ route }: { route: Route }) {
  const isCongested = !route.isOptimal && !!route.alternateOf;
  return (
    <tr
      className={cn(
        "border-b border-border/50 transition-colors hover:bg-muted/20",
        route.isOptimal && "bg-primary/5",
        isCongested && "bg-accent/5",
      )}
      data-ocid="route-table-row"
    >
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          <RouteIcon
            className={cn(
              "h-3.5 w-3.5 shrink-0",
              route.isOptimal ? "text-primary" : "text-muted-foreground",
            )}
          />
          <span
            className={cn(
              "font-body text-sm",
              route.isOptimal
                ? "font-semibold text-primary"
                : "text-foreground",
            )}
          >
            {route.name}
          </span>
        </div>
      </td>
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-1 font-mono text-xs">
          <span className="text-foreground">{route.fromDistrict}</span>
          <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
          <span className="text-foreground">{route.toDistrict}</span>
        </div>
      </td>
      <td className="px-4 py-2.5 text-right font-mono text-sm tabular-nums text-foreground">
        {route.totalDistance.toFixed(1)} km
      </td>
      <td className="px-4 py-2.5 text-right font-mono text-sm tabular-nums text-foreground">
        {Number(route.estimatedMinutes)} min
      </td>
      <td className="px-4 py-2.5">
        {route.isOptimal ? (
          <StatusBadge label="Optimal" status="Operational" />
        ) : isCongested ? (
          <StatusBadge label="Congested" status="Degraded" />
        ) : (
          <StatusBadge label="Alternative" status="Low" />
        )}
      </td>
      <td className="max-w-[200px] px-4 py-2.5">
        <p
          className="truncate font-body text-xs text-muted-foreground"
          title={route.reasoning}
        >
          {route.reasoning}
        </p>
      </td>
    </tr>
  );
}

// ─── Rerouting history row ────────────────────────────────────────────────────

function RerouteRow({ event }: { event: RerouteEvent }) {
  const styles = {
    high: {
      border: "border-l-destructive",
      bg: "bg-destructive/5",
      icon: "text-destructive",
    },
    medium: {
      border: "border-l-accent",
      bg: "bg-accent/5",
      icon: "text-accent",
    },
    low: {
      border: "border-l-primary",
      bg: "bg-primary/5",
      icon: "text-primary",
    },
  };
  const s = styles[event.severity];
  const Icon =
    event.severity === "high"
      ? AlertTriangle
      : event.severity === "medium"
        ? Shuffle
        : CheckCircle2;

  return (
    <div
      className={cn("flex gap-3 rounded border-l-2 p-3", s.border, s.bg)}
      data-ocid="reroute-history-row"
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", s.icon)} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <span className="font-body text-sm font-medium text-foreground">
            {event.segment}
          </span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {event.timestamp}
          </span>
        </div>
        <p className="mt-0.5 font-body text-xs text-muted-foreground">
          {event.reason}
        </p>
        <p className="mt-1 font-mono text-[10px] text-foreground">
          ↳ {event.action}
        </p>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export function Routing() {
  const { actor, isFetching: actorLoading } = useActor(createActor);
  const snapshot = useSimulationStore((s) => s.snapshot);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [segments, setSegments] = useState<TrafficSegment[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);

  const [fromDistrict, setFromDistrict] = useState<District | "">("");
  const [toDistrict, setToDistrict] = useState<District | "">("");
  const [computedRoute, setComputedRoute] = useState<Route | null | undefined>(
    undefined,
  );
  const [isComputing, setIsComputing] = useState(false);

  const [sortKey, setSortKey] = useState<SortKey>("totalDistance");
  const [sortAsc, setSortAsc] = useState(true);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadData = useCallback(async () => {
    if (!actor) return;
    try {
      const [r, s] = await Promise.all([getRoutes(actor), getSegments(actor)]);
      setRoutes(r);
      setSegments(s);
    } catch {
      // silent retry
    } finally {
      setIsLoadingRoutes(false);
    }
  }, [actor]);

  useEffect(() => {
    if (actorLoading || !actor) return;
    loadData();
    intervalRef.current = setInterval(loadData, 10_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [actor, actorLoading, loadData]);

  const handleCompute = async () => {
    if (!actor || !fromDistrict || !toDistrict || fromDistrict === toDistrict)
      return;
    setIsComputing(true);
    setComputedRoute(undefined);
    try {
      const result = await computeOptimalRoute(actor, fromDistrict, toDistrict);
      setComputedRoute(result);
    } catch {
      setComputedRoute(null);
    } finally {
      setIsComputing(false);
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((p) => !p);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedRoutes = [...routes].sort((a, b) => {
    let va: number | string;
    let vb: number | string;
    if (sortKey === "estimatedMinutes") {
      va = Number(a.estimatedMinutes);
      vb = Number(b.estimatedMinutes);
    } else if (sortKey === "totalDistance") {
      va = a.totalDistance;
      vb = b.totalDistance;
    } else {
      va = a.name;
      vb = b.name;
    }
    if (va < vb) return sortAsc ? -1 : 1;
    if (va > vb) return sortAsc ? 1 : -1;
    return 0;
  });

  const chartData = segments.map((s) => ({
    name: s.name.length > 14 ? `${s.name.slice(0, 12)}…` : s.name,
    congestion: Number(s.congestionPct),
  }));

  const segMap: Record<string, string> = {};
  for (const s of segments) {
    segMap[s.id] = s.name;
  }
  const anomalies = snapshot?.activeAnomalies ?? [];
  const rerouteHistory = buildRerouteHistory(anomalies, segMap);

  const sameDistrict =
    fromDistrict && toDistrict && fromDistrict === toDistrict;

  return (
    <div className="space-y-6 p-6" data-ocid="routing-page">
      {/* ─── Page Header ─── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            <h1 className="font-display text-xl font-bold text-foreground">
              Adaptive Vehicle Rerouting Engine
            </h1>
          </div>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            Graph-based pathfinding with A*/Dijkstra optimization for real-time
            traffic conditions
          </p>
        </div>
        <Button
          className="gap-2 border-border bg-muted font-mono text-xs text-muted-foreground hover:border-primary/40 hover:text-primary"
          data-ocid="refresh-routes-btn"
          onClick={loadData}
          size="sm"
          variant="outline"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* ─── Route Calculator ─── */}
      <Card
        className="border-border bg-card"
        data-ocid="route-calculator-panel"
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <RouteIcon className="h-4 w-4 text-primary" />
            Route Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                From District
              </span>
              <Select
                onValueChange={(v) => setFromDistrict(v as District)}
                value={fromDistrict}
              >
                <SelectTrigger
                  aria-label="Select origin district"
                  className="border-input bg-background font-body text-sm"
                  data-ocid="from-district-select"
                >
                  <SelectValue placeholder="Select origin district" />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                To District
              </span>
              <Select
                onValueChange={(v) => setToDistrict(v as District)}
                value={toDistrict}
              >
                <SelectTrigger
                  aria-label="Select destination district"
                  className="border-input bg-background font-body text-sm"
                  data-ocid="to-district-select"
                >
                  <SelectValue placeholder="Select destination district" />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {sameDistrict && (
            <p className="font-mono text-[11px] text-destructive">
              Origin and destination must be different districts.
            </p>
          )}

          <Button
            className="gap-2 font-mono text-xs"
            data-ocid="compute-route-btn"
            disabled={
              !fromDistrict || !toDistrict || !!sameDistrict || isComputing
            }
            onClick={handleCompute}
          >
            {isComputing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Navigation className="h-3.5 w-3.5" />
            )}
            {isComputing ? "Computing…" : "Compute Optimal Route"}
          </Button>

          {isComputing && (
            <div className="mt-2 space-y-2" data-ocid="route-loading-state">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}

          {!isComputing &&
            computedRoute !== undefined &&
            computedRoute !== null && <RouteResultCard route={computedRoute} />}

          {!isComputing && computedRoute === null && (
            <div className="mt-3 flex items-center gap-2 rounded border border-accent/30 bg-accent/5 px-3 py-2 font-mono text-xs text-accent">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              No route found between selected districts. Try a different pair.
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── All Routes Table ─── */}
      <Card className="border-border bg-card" data-ocid="routes-table-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <RouteIcon className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              All Routes
            </span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              {routes.length} total
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingRoutes ? (
            <div className="space-y-2 p-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton className="h-10 w-full rounded" key={i} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {(
                      [
                        {
                          key: "name" as SortKey,
                          label: "Route",
                          align: "left",
                        },
                        { key: null, label: "From → To", align: "left" },
                        {
                          key: "totalDistance" as SortKey,
                          label: "Distance",
                          align: "right",
                        },
                        {
                          key: "estimatedMinutes" as SortKey,
                          label: "Est. Time",
                          align: "right",
                        },
                        { key: null, label: "Status", align: "left" },
                        { key: null, label: "Reasoning", align: "left" },
                      ] as Array<{
                        key: SortKey | null;
                        label: string;
                        align: "left" | "right";
                      }>
                    ).map(({ key, label, align }) => (
                      <th
                        className={cn(
                          "px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                          align === "right" ? "text-right" : "text-left",
                          key && "cursor-pointer hover:text-foreground",
                        )}
                        key={label}
                        onClick={key ? () => handleSort(key) : undefined}
                        onKeyDown={
                          key
                            ? (e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  handleSort(key);
                              }
                            : undefined
                        }
                      >
                        {label}
                        {key && (
                          <SortIndicator
                            active={sortKey === key}
                            asc={sortAsc}
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedRoutes.length === 0 ? (
                    <tr>
                      <td
                        className="px-4 py-10 text-center font-mono text-xs text-muted-foreground"
                        colSpan={6}
                        data-ocid="routes-empty-state"
                      >
                        No routes available — run a simulation tick to generate
                        data.
                      </td>
                    </tr>
                  ) : (
                    sortedRoutes.map((r) => (
                      <RouteTableRow key={r.id} route={r} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Traffic Flow Visualization ─── */}
      <Card className="border-border bg-card" data-ocid="congestion-chart-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Traffic Flow — Congestion by Segment
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            {[
              { color: "bg-destructive/60", label: "Critical (>70%)" },
              { color: "bg-accent/60", label: "Moderate (35–70%)" },
              { color: "bg-primary/60", label: "Clear (<35%)" },
            ].map(({ color, label }) => (
              <span
                className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground"
                key={label}
              >
                <span
                  className={cn("inline-block h-2 w-4 rounded-sm", color)}
                />
                {label}
              </span>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {segments.length === 0 ? (
            <div className="flex h-40 items-center justify-center font-mono text-xs text-muted-foreground">
              Awaiting segment data…
            </div>
          ) : (
            <ResponsiveContainer height={230} width="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 16, bottom: 44, left: 0 }}
              >
                <CartesianGrid
                  stroke="hsl(var(--border))"
                  strokeDasharray="3 3"
                  strokeOpacity={0.4}
                />
                <XAxis
                  angle={-30}
                  dataKey="name"
                  height={50}
                  interval={0}
                  textAnchor="end"
                  tick={{
                    fill: "oklch(0.52 0 0)",
                    fontSize: 9,
                    fontFamily: "JetBrains Mono",
                  }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{
                    fill: "oklch(0.52 0 0)",
                    fontSize: 9,
                    fontFamily: "JetBrains Mono",
                  }}
                  tickFormatter={(v: number) => `${v}%`}
                  width={38}
                />
                <Tooltip content={<CongestionTooltip />} />
                <ReferenceLine
                  label={{
                    value: "Critical",
                    position: "insideTopRight",
                    fill: "oklch(0.62 0.24 24)",
                    fontSize: 9,
                  }}
                  stroke="oklch(0.62 0.24 24)"
                  strokeDasharray="4 3"
                  strokeOpacity={0.7}
                  y={CONGESTION_RED}
                />
                <ReferenceLine
                  label={{
                    value: "Moderate",
                    position: "insideTopRight",
                    fill: "oklch(0.72 0.23 55)",
                    fontSize: 9,
                  }}
                  stroke="oklch(0.72 0.23 55)"
                  strokeDasharray="4 3"
                  strokeOpacity={0.7}
                  y={CONGESTION_AMBER}
                />
                <Line
                  dataKey="congestion"
                  dot={(props: {
                    cx: number;
                    cy: number;
                    payload: { congestion: number };
                    index: number;
                  }) => (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      fill={congestionColor(props.payload.congestion)}
                      key={`dot-${props.index}`}
                      r={4}
                      stroke="oklch(0.12 0 0)"
                      strokeWidth={1.5}
                    />
                  )}
                  stroke="oklch(0.62 0.25 195)"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* ─── Rerouting History ─── */}
      <Card
        className="border-border bg-card"
        data-ocid="rerouting-history-card"
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            Rerouting History
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              Last 5 events
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rerouteHistory.length === 0 ? (
            <div
              className="flex flex-col items-center gap-2 py-8 text-center"
              data-ocid="reroute-empty-state"
            >
              <CheckCircle2 className="h-8 w-8 text-primary/40" />
              <p className="font-mono text-xs text-muted-foreground">
                No rerouting events detected. Traffic is flowing normally.
              </p>
            </div>
          ) : (
            rerouteHistory.map((e) => <RerouteRow event={e} key={e.id} />)
          )}
        </CardContent>
      </Card>
    </div>
  );
}
