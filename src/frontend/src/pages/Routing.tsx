import { createActor } from "@/backend";
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
import {
  ALL_DISTRICTS,
  FALLBACK_SEGMENTS,
  computeOptimalRoute,
  getRoutes,
  getSegments,
} from "@/lib/trafficApi";
import { cn } from "@/lib/utils";
import type { Route, TrafficSegment } from "@/types/traffic";
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
  Wifi,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CONGESTION_RED = 70;
const CONGESTION_AMBER = 35;

function congestionColor(pct: number): string {
  if (pct >= CONGESTION_RED) return "oklch(0.62 0.24 24)";
  if (pct >= CONGESTION_AMBER) return "oklch(0.72 0.23 55)";
  return "oklch(0.62 0.25 195)";
}

function congestionLabel(pct: number): "Critical" | "Moderate" | "Clear" {
  if (pct >= CONGESTION_RED) return "Critical";
  if (pct >= CONGESTION_AMBER) return "Moderate";
  return "Clear";
}

function congestionBg(pct: number): string {
  if (pct >= CONGESTION_RED) return "bg-destructive/70";
  if (pct >= CONGESTION_AMBER) return "bg-accent/70";
  return "bg-primary/70";
}

function congestionBadgeVariant(label: string) {
  if (label === "Critical")
    return "border-destructive/40 bg-destructive/15 text-destructive";
  if (label === "Moderate") return "border-accent/40 bg-accent/15 text-accent";
  return "border-primary/40 bg-primary/15 text-primary";
}

// ─── Waypoints breadcrumb ─────────────────────────────────────────────────────

function WaypointChain({ segments }: { segments: string[] }) {
  if (!segments.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-3">
      {segments.map((seg, i) => (
        <span key={seg} className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded bg-primary/10 border border-primary/20 px-2 py-0.5 font-mono text-[10px] text-primary">
            <MapPin className="h-2.5 w-2.5 shrink-0" />
            {seg}
          </span>
          {i < segments.length - 1 && (
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
          )}
        </span>
      ))}
    </div>
  );
}

// ─── Optimal Route Result Panel ───────────────────────────────────────────────

function OptimalRoutePanel({ route }: { route: Route }) {
  const avgCong = route.segments.length > 3 ? 55 : 20;
  const congLabel = congestionLabel(avgCong);

  return (
    <div
      className="rounded-xl border border-primary/40 bg-primary/5 glow-cyan scan-line-container overflow-hidden"
      data-ocid="optimal-route-panel"
    >
      {/* Header strip */}
      <div className="flex items-center gap-2 bg-primary/10 border-b border-primary/20 px-4 py-2">
        <Navigation className="h-4 w-4 text-primary" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
          Optimal Route Found
        </span>
        <Badge
          className="ml-auto border-primary/50 bg-primary/20 font-mono text-[9px] text-primary"
          variant="outline"
        >
          ✓ RECOMMENDED
        </Badge>
      </div>

      <div className="p-4 space-y-4">
        {/* Route name + from→to */}
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            {route.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <span className="text-foreground">{route.fromDistrict}</span>
            <ArrowRight className="h-3 w-3 text-primary" />
            <span className="text-foreground">{route.toDistrict}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border bg-card/60 p-3 text-center">
            <div className="font-display text-2xl font-bold tabular-nums text-primary">
              {route.totalDistance.toFixed(1)}
              <span className="ml-0.5 font-mono text-[10px] font-normal text-muted-foreground">
                km
              </span>
            </div>
            <div className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Distance
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card/60 p-3 text-center">
            <div className="font-display text-2xl font-bold tabular-nums text-accent">
              {Number(route.estimatedMinutes)}
              <span className="ml-0.5 font-mono text-[10px] font-normal text-muted-foreground">
                min
              </span>
            </div>
            <div className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Est. Time
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card/60 p-3 text-center">
            <div
              className={cn(
                "font-mono text-sm font-bold",
                congestionBadgeVariant(congLabel)
                  .split(" ")
                  .find((c) => c.startsWith("text-")),
              )}
            >
              {congLabel}
            </div>
            <div className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Congestion
            </div>
          </div>
        </div>

        {/* Waypoints */}
        {route.segments.length > 0 && (
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Waypoints
            </div>
            <WaypointChain segments={route.segments} />
          </div>
        )}

        {/* AI Reasoning card */}
        {route.reasoning && (
          <div
            className="rounded-lg border border-primary/20 bg-background/70 p-4 relative"
            data-ocid="ai-reasoning-card"
          >
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-primary shrink-0" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                AI Reasoning
              </span>
            </div>
            <div className="relative">
              {/* Left accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/40 rounded-full" />
              <blockquote className="pl-4">
                <p className="font-body text-sm leading-relaxed text-foreground/90 italic">
                  &ldquo;{route.reasoning}&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Alternative Route Card ────────────────────────────────────────────────────

function AlternativeRouteCard({
  route,
  rank,
}: {
  route: Route;
  rank: number;
}) {
  const congPct = route.segments.length > 3 ? 55 : 20 + rank * 10;
  const label = congestionLabel(congPct);
  return (
    <div
      className={cn(
        "rounded-lg border bg-card/50 p-3 flex items-start gap-3 transition-smooth hover:border-border/80",
        route.isOptimal ? "border-primary/30 bg-primary/5" : "border-border/50",
      )}
      data-ocid="alt-route-card"
    >
      <div
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono text-[10px] font-bold",
          route.isOptimal
            ? "bg-primary/20 text-primary"
            : "bg-muted/60 text-muted-foreground",
        )}
      >
        {rank}
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "font-body text-sm font-medium truncate",
              route.isOptimal ? "text-primary" : "text-foreground",
            )}
          >
            {route.name}
          </span>
          {route.isOptimal && (
            <Badge
              className="border-primary/40 bg-primary/15 font-mono text-[9px] text-primary"
              variant="outline"
            >
              OPTIMAL
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-mono text-[11px] tabular-nums text-foreground">
            {route.totalDistance.toFixed(1)}{" "}
            <span className="text-muted-foreground">km</span>
          </span>
          <span className="font-mono text-[11px] tabular-nums text-foreground">
            {Number(route.estimatedMinutes)}{" "}
            <span className="text-muted-foreground">min</span>
          </span>
          <span
            className={cn(
              "font-mono text-[10px] px-1.5 py-0.5 rounded border",
              congestionBadgeVariant(label),
            )}
          >
            {congPct}% — {label}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Congestion Heatmap ───────────────────────────────────────────────────────

function CongestionHeatmap({ segments }: { segments: TrafficSegment[] }) {
  if (!segments.length) {
    return (
      <div className="flex items-center justify-center h-32 font-mono text-xs text-muted-foreground">
        Awaiting segment data…
      </div>
    );
  }

  return (
    <div className="space-y-2" data-ocid="congestion-heatmap">
      {segments.map((seg) => {
        const pct = Number(seg.congestionPct);
        const label = congestionLabel(pct);
        return (
          <div key={seg.id} className="flex items-center gap-3 min-w-0">
            <span className="font-mono text-[10px] text-muted-foreground w-32 shrink-0 truncate">
              {seg.name}
            </span>
            <div className="flex-1 h-4 rounded-sm bg-muted/30 overflow-hidden relative">
              <div
                className={cn(
                  "h-full rounded-sm transition-all duration-700",
                  congestionBg(pct),
                )}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
              <span
                className="absolute right-2 top-0 bottom-0 flex items-center font-mono text-[9px] font-bold"
                style={{ color: congestionColor(pct) }}
              >
                {pct}%
              </span>
            </div>
            <span
              className="font-mono text-[10px] w-14 shrink-0 text-right"
              style={{ color: congestionColor(pct) }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Travel Time Chart (CSS-based) ───────────────────────────────────────────

function TravelTimeChart({ routes }: { routes: Route[] }) {
  if (!routes.length) {
    return (
      <div className="flex items-center justify-center h-32 font-mono text-xs text-muted-foreground">
        No route data yet.
      </div>
    );
  }

  const maxTime = Math.max(...routes.map((r) => Number(r.estimatedMinutes)));

  return (
    <div className="space-y-2.5" data-ocid="travel-time-chart">
      {routes.map((route, i) => {
        const mins = Number(route.estimatedMinutes);
        const pct = maxTime > 0 ? (mins / maxTime) * 100 : 0;
        const isOptimal = route.isOptimal;
        return (
          <div key={route.id} className="flex items-center gap-3 min-w-0">
            <span className="font-mono text-[10px] text-muted-foreground w-32 shrink-0 truncate">
              {route.name.length > 16
                ? `${route.name.slice(0, 14)}…`
                : route.name}
            </span>
            <div className="flex-1 h-5 rounded-sm bg-muted/30 overflow-hidden relative">
              <div
                className={cn(
                  "h-full rounded-sm transition-all duration-700",
                  isOptimal
                    ? "bg-primary/70"
                    : i % 2 === 0
                      ? "bg-secondary/60"
                      : "bg-muted/60",
                )}
                style={{ width: `${pct}%` }}
              />
              {isOptimal && (
                <CheckCircle2 className="absolute left-2 top-0 bottom-0 my-auto h-3 w-3 text-primary" />
              )}
            </div>
            <span
              className={cn(
                "font-mono text-[11px] tabular-nums w-16 shrink-0 text-right",
                isOptimal ? "text-primary font-bold" : "text-muted-foreground",
              )}
            >
              {mins} min
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function Routing() {
  const { actor, isFetching: actorLoading } = useActor(createActor);
  const snapshot = useSimulationStore((s) => s.snapshot);
  const lastUpdated = useSimulationStore((s) => s.lastUpdated);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [segments, setSegments] = useState<TrafficSegment[]>(FALLBACK_SEGMENTS);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);

  const [fromDistrict, setFromDistrict] = useState<string>("");
  const [toDistrict, setToDistrict] = useState<string>("");
  const [computedRoute, setComputedRoute] = useState<Route | null | undefined>(
    undefined,
  );
  const computedRouteRef = useRef<Route | null | undefined>(undefined);
  const updateComputedRoute = useCallback((r: Route | null | undefined) => {
    computedRouteRef.current = r;
    setComputedRoute(r);
  }, []);
  const [isComputing, setIsComputing] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load segments always (fallback if actor unavailable), routes only when actor is ready
  const loadData = useCallback(async () => {
    const [s] = await Promise.all([getSegments(actor)]);
    setSegments(s);
    if (actor) {
      try {
        const r = await getRoutes(actor);
        setRoutes(r);
      } catch {
        // silent — routes panel just stays empty
      }
    }
    setIsLoadingRoutes(false);
  }, [actor]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (actorLoading || !actor) return;
    intervalRef.current = setInterval(loadData, 10_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [actor, actorLoading, loadData]);

  // Auto-refresh computed route on new snapshot (use ref to avoid infinite loop)
  useEffect(() => {
    if (!snapshot || !computedRouteRef.current) return;
    const { fromDistrict: from, toDistrict: to } = computedRouteRef.current;
    if (!from || !to) return;
    computeOptimalRoute(actor, from, to, segments)
      .then((r) => updateComputedRoute(r))
      .catch(() => {});
  }, [snapshot, actor, segments, updateComputedRoute]);

  const handleCompute = async () => {
    if (!fromDistrict || !toDistrict || fromDistrict === toDistrict) return;
    setIsComputing(true);
    updateComputedRoute(undefined);
    try {
      const result = await computeOptimalRoute(
        actor,
        fromDistrict,
        toDistrict,
        segments,
      );
      updateComputedRoute(result);
    } catch {
      updateComputedRoute(null);
    } finally {
      setIsComputing(false);
    }
  };

  const sameDistrict =
    fromDistrict && toDistrict && fromDistrict === toDistrict;
  const alternativeRoutes = routes.filter(
    (r) => !computedRoute || r.id !== computedRoute.id,
  );

  const formattedLastUpdate = lastUpdated
    ? lastUpdated.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

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
            Graph-based pathfinding (A*/Dijkstra) with real-time congestion
            awareness
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Real-time indicator */}
          {formattedLastUpdate && (
            <div
              className="flex items-center gap-1.5 rounded border border-primary/20 bg-primary/5 px-3 py-1.5"
              data-ocid="realtime-indicator"
            >
              <Wifi className="h-3 w-3 text-primary pulse-glow" />
              <span className="font-mono text-[10px] text-primary">LIVE</span>
              <span className="font-mono text-[10px] text-muted-foreground ml-1">
                {formattedLastUpdate}
              </span>
            </div>
          )}
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
      </div>

      {/* ─── Route Planner ─── */}
      <Card className="border-border bg-card" data-ocid="route-planner-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <RouteIcon className="h-4 w-4 text-primary" />
            Route Planner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto]">
            {/* From */}
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                From
              </span>
              <Select
                onValueChange={(v) => setFromDistrict(v)}
                value={fromDistrict}
              >
                <SelectTrigger
                  aria-label="Select origin district"
                  className="border-input bg-background font-body text-sm"
                  data-ocid="from-district-select"
                >
                  <SelectValue placeholder="Select origin…" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_DISTRICTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Arrow connector */}
            <div className="flex items-end pb-2">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* To */}
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                To
              </span>
              <Select
                onValueChange={(v) => setToDistrict(v)}
                value={toDistrict}
              >
                <SelectTrigger
                  aria-label="Select destination district"
                  className="border-input bg-background font-body text-sm"
                  data-ocid="to-district-select"
                >
                  <SelectValue placeholder="Select destination…" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_DISTRICTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CTA */}
            <div className="flex items-end">
              <Button
                className="gap-2 font-mono text-xs whitespace-nowrap"
                data-ocid="find-optimal-route-btn"
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
                {isComputing ? "Computing…" : "Find Optimal Route"}
              </Button>
            </div>
          </div>

          {sameDistrict && (
            <p className="flex items-center gap-1.5 font-mono text-[11px] text-destructive">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              Origin and destination must be different districts.
            </p>
          )}

          {/* Loading skeleton */}
          {isComputing && (
            <div className="space-y-3 mt-2" data-ocid="route-loading-state">
              <Skeleton className="h-5 w-2/5" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          )}

          {/* Optimal result */}
          {!isComputing &&
            computedRoute !== undefined &&
            computedRoute !== null && (
              <OptimalRoutePanel route={computedRoute} />
            )}

          {/* No route found (only shown if truly null — shouldn't happen with local fallback) */}
          {!isComputing && computedRoute === null && (
            <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 font-mono text-xs text-accent">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              No route found between selected districts. Try a different pair.
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Alternative Routes ─── */}
      <Card className="border-border bg-card" data-ocid="alt-routes-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <RouteIcon className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Alternative Routes
            </span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              {routes.length} available
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingRoutes ? (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : routes.length === 0 ? (
            <div
              className="flex flex-col items-center gap-2 py-10 text-center"
              data-ocid="alt-routes-empty-state"
            >
              <RouteIcon className="h-8 w-8 text-muted-foreground/30" />
              <p className="font-mono text-xs text-muted-foreground">
                No routes available — run a simulation tick to generate data.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {(computedRoute ? alternativeRoutes : routes).map((route, i) => (
                <AlternativeRouteCard
                  key={route.id}
                  route={route}
                  rank={i + 1}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Two-column: Heatmap + Travel Time ─── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Congestion Heatmap */}
        <Card
          className="border-border bg-card"
          data-ocid="congestion-heatmap-card"
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Congestion Heatmap
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {[
                { cls: "bg-destructive/70", label: "Critical" },
                { cls: "bg-accent/70", label: "Moderate" },
                { cls: "bg-primary/70", label: "Clear" },
              ].map(({ cls, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground"
                >
                  <span
                    className={cn("h-2 w-3 rounded-sm inline-block", cls)}
                  />
                  {label}
                </span>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <CongestionHeatmap segments={segments} />
          </CardContent>
        </Card>

        {/* Travel Time Chart */}
        <Card
          className="border-border bg-card"
          data-ocid="travel-time-chart-card"
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Travel Time Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRoutes ? (
              <div className="space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-5 w-full rounded" />
                ))}
              </div>
            ) : (
              <TravelTimeChart routes={routes} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
