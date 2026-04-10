import { createActor } from "@/backend";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
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
import {
  acknowledgeEmergency,
  getEmergencyAlerts,
  getSegments,
  triggerEmergencySimulation,
} from "@/lib/trafficApi";
import { cn } from "@/lib/utils";
import type { EmergencyAlert, TrafficSegment } from "@/types/traffic";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Siren,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { toast } from "sonner";

// ─── Signal Grid ───────────────────────────────────────────────────────────────

const INTERSECTIONS = [
  { id: "I-01", label: "Main & 1st" },
  { id: "I-02", label: "Park & Oak" },
  { id: "I-03", label: "River & 5th" },
  { id: "I-04", label: "Central Blvd" },
];

interface SignalLight {
  color: "red" | "amber" | "green";
  active: boolean;
}

function SignalHead({
  lights,
  label,
  priority,
}: {
  lights: SignalLight[];
  label: string;
  priority: boolean;
}) {
  const colorMap: Record<string, string> = {
    red: "bg-destructive",
    amber: "bg-accent",
    green: "bg-primary",
  };
  const dimMap: Record<string, string> = {
    red: "bg-destructive/20",
    amber: "bg-accent/20",
    green: "bg-primary/20",
  };
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3 transition-smooth",
        priority && "border-primary/60 ring-1 ring-primary/30",
      )}
    >
      <div className="flex flex-col items-center gap-1 rounded-md bg-muted/60 p-1.5">
        {lights.map((l) => (
          <div
            key={l.color}
            className={cn(
              "h-4 w-4 rounded-full",
              l.active ? colorMap[l.color] : dimMap[l.color],
              l.active &&
                l.color === "green" &&
                "shadow-[0_0_8px_2px_oklch(0.62_0.25_195_/_0.5)]",
              l.active &&
                l.color === "red" &&
                "shadow-[0_0_8px_2px_oklch(0.62_0.24_24_/_0.5)]",
            )}
          />
        ))}
      </div>
      <span className="text-center font-mono text-[9px] text-muted-foreground">
        {label}
      </span>
      {priority && (
        <span className="rounded bg-primary/15 px-1 py-0.5 font-mono text-[8px] font-bold uppercase text-primary">
          PRIORITY
        </span>
      )}
    </div>
  );
}

function TrafficSignalGrid({ hasEmergency }: { hasEmergency: boolean }) {
  const [priorityIdx, setPriorityIdx] = useState(0);

  useEffect(() => {
    if (!hasEmergency) return;
    const id = setInterval(() => {
      setPriorityIdx((p) => (p + 1) % INTERSECTIONS.length);
    }, 1500);
    return () => clearInterval(id);
  }, [hasEmergency]);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <Zap className="h-4 w-4 text-accent" />
          Adaptive Signal Control
          {hasEmergency && (
            <span className="ml-auto flex items-center gap-1 rounded bg-destructive/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-destructive">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-destructive" />
              EMERGENCY MODE
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-4 gap-3">
          {INTERSECTIONS.map((inter, idx) => {
            const isPriority = hasEmergency && idx === priorityIdx;
            const isCleared = hasEmergency && idx !== priorityIdx;
            const lights: SignalLight[] = isPriority
              ? [
                  { color: "red", active: false },
                  { color: "amber", active: false },
                  { color: "green", active: true },
                ]
              : isCleared
                ? [
                    { color: "red", active: true },
                    { color: "amber", active: false },
                    { color: "green", active: false },
                  ]
                : [
                    { color: "red", active: false },
                    { color: "amber", active: true },
                    { color: "green", active: false },
                  ];
            return (
              <SignalHead
                key={inter.id}
                lights={lights}
                label={inter.label}
                priority={isPriority}
              />
            );
          })}
        </div>
        <p className="mt-3 font-mono text-[10px] text-muted-foreground">
          {hasEmergency
            ? "Emergency corridor cleared — all cross-traffic halted. Priority path illuminated."
            : "Normal operation — adaptive timing active across all intersections."}
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Alert Card ────────────────────────────────────────────────────────────────

const VEHICLE_ICONS: Record<string, string> = {
  Ambulance: "🚑",
  "Fire Truck": "🚒",
  Police: "🚓",
  Hazmat: "☢️",
};

function EmergencyAlertCard({
  alert,
  onAcknowledge,
  acknowledging,
}: {
  alert: EmergencyAlert;
  onAcknowledge: (id: string) => void;
  acknowledging: boolean;
}) {
  const priority = Number(alert.priority);
  const pct = Math.min(100, (priority / 10) * 100);
  const barColor =
    priority >= 8
      ? "bg-destructive"
      : priority >= 5
        ? "bg-accent"
        : "bg-primary";

  const ts = Number(alert.triggeredAt);
  const triggeredDate = new Date(ts > 1e12 ? ts / 1_000_000 : ts * 1000);
  const timeStr = Number.isNaN(triggeredDate.getTime())
    ? "—"
    : triggeredDate.toLocaleTimeString();

  return (
    <div
      className="rounded-lg border border-destructive/40 bg-destructive/10 p-4"
      data-ocid="emergency-alert-card"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20 text-xl">
            {VEHICLE_ICONS[alert.vehicleType] ?? "🚨"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Siren className="h-3.5 w-3.5 text-destructive" />
              <span className="font-display text-sm font-bold text-foreground">
                {alert.vehicleType}
              </span>
              <StatusBadge status="Critical" />
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              Segment:{" "}
              <span className="text-foreground">{alert.segmentId}</span>
              &nbsp;·&nbsp;Triggered: {timeStr}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-primary/40 text-primary hover:bg-primary/10"
          onClick={() => onAcknowledge(alert.id)}
          disabled={acknowledging}
          data-ocid="emergency-acknowledge-btn"
        >
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
          {acknowledging ? "Acknowledging…" : "Acknowledge"}
        </Button>
      </div>

      <p className="mt-3 text-sm text-foreground/80">{alert.description}</p>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Priority Level
          </span>
          <span className="font-mono text-[11px] font-bold text-foreground">
            {priority}/10
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", barColor)}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-3 rounded-md border border-border bg-muted/50 p-3">
        <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          Recommended Action
        </p>
        <p className="text-xs text-foreground">{alert.recommendedAction}</p>
      </div>
    </div>
  );
}

// ─── Pie chart colours ─────────────────────────────────────────────────────────

const PIE_COLORS = [
  "oklch(0.62 0.25 195)",
  "oklch(0.72 0.23 55)",
  "oklch(0.62 0.24 24)",
  "oklch(0.68 0.18 110)",
  "oklch(0.55 0.15 280)",
];

// ─── Main page ─────────────────────────────────────────────────────────────────

export function Emergency() {
  const { actor, isFetching } = useActor(createActor);

  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [segments, setSegments] = useState<TrafficSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [acknowledging, setAcknowledging] = useState<string | null>(null);

  const [selectedSegment, setSelectedSegment] = useState("");
  const [vehicleType, setVehicleType] = useState("Ambulance");
  const [triggering, setTriggering] = useState(false);
  const [lastTriggered, setLastTriggered] = useState<EmergencyAlert | null>(
    null,
  );

  const prevAlertIds = useRef<Set<string>>(new Set());

  const fetchAlerts = useCallback(async () => {
    if (!actor) return;
    try {
      const [allAlerts, segs] = await Promise.all([
        getEmergencyAlerts(actor, false),
        getSegments(actor),
      ]);
      for (const a of allAlerts.filter(
        (a) => a.isActive && !prevAlertIds.current.has(a.id),
      )) {
        toast.error(`🚨 Emergency: ${a.vehicleType} on ${a.segmentId}`, {
          description: a.description,
          duration: 6000,
        });
      }
      prevAlertIds.current = new Set(allAlerts.map((a) => a.id));
      setAlerts(allAlerts);
      setSegments(segs);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (!actor || isFetching) return;
    fetchAlerts();
    const id = setInterval(fetchAlerts, 5000);
    return () => clearInterval(id);
  }, [actor, isFetching, fetchAlerts]);

  const handleAcknowledge = useCallback(
    async (alertId: string) => {
      if (!actor) return;
      setAcknowledging(alertId);
      try {
        await acknowledgeEmergency(actor, alertId);
        toast.success("Emergency acknowledged");
        await fetchAlerts();
      } catch {
        toast.error("Failed to acknowledge emergency");
      } finally {
        setAcknowledging(null);
      }
    },
    [actor, fetchAlerts],
  );

  const handleTrigger = useCallback(async () => {
    if (!actor || !selectedSegment) {
      toast.error("Select a segment first");
      return;
    }
    setTriggering(true);
    setLastTriggered(null);
    try {
      const result = await triggerEmergencySimulation(
        actor,
        selectedSegment,
        vehicleType,
      );
      setLastTriggered(result);
      toast.success(`Emergency simulation triggered: ${result.vehicleType}`);
      await fetchAlerts();
    } catch {
      toast.error("Failed to trigger emergency simulation");
    } finally {
      setTriggering(false);
    }
  }, [actor, selectedSegment, vehicleType, fetchAlerts]);

  const activeAlerts = alerts.filter((a) => a.isActive);
  const resolvedAlerts = alerts.filter((a) => !a.isActive);
  const hasEmergency = activeAlerts.length > 0;

  const typeCounts = alerts.reduce<Record<string, number>>((acc, a) => {
    acc[a.vehicleType] = (acc[a.vehicleType] ?? 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(typeCounts).map(([name, value]) => ({
    name,
    value,
  }));
  const signalAdjustments = activeAlerts.length * 4 + resolvedAlerts.length * 2;

  return (
    <div className="space-y-6 p-6" data-ocid="emergency-page">
      {/* Page header */}
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">
          Emergency Detection & Priority Response
        </h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          AI-powered detection of emergency vehicles, accidents, and hazardous
          scenarios
        </p>
      </div>

      {/* Emergency active banner */}
      {hasEmergency && (
        <div
          className="flex items-center gap-3 rounded-lg border border-destructive/60 bg-destructive/10 px-4 py-3"
          data-ocid="emergency-active-banner"
        >
          <Siren className="h-5 w-5 animate-pulse text-destructive" />
          <span className="pulse-glow font-mono text-sm font-bold uppercase tracking-widest text-destructive">
            ⚠ EMERGENCY ACTIVE — {activeAlerts.length} incident
            {activeAlerts.length !== 1 ? "s" : ""} in progress
          </span>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard
          title="Active Emergencies"
          value={loading ? "—" : activeAlerts.length}
          icon={<AlertOctagon className="h-4 w-4 text-destructive" />}
          colorClass={hasEmergency ? "text-destructive" : undefined}
          data-ocid="metric-active-emergencies"
        />
        <MetricCard
          title="Total This Session"
          value={loading ? "—" : alerts.length}
          icon={<Activity className="h-4 w-4 text-primary" />}
          data-ocid="metric-total-emergencies"
        />
        <MetricCard
          title="Avg Response Time"
          value="2.3 min"
          subtitle="simulated estimate"
          icon={<Clock className="h-4 w-4 text-accent" />}
          data-ocid="metric-avg-response"
        />
        <MetricCard
          title="Signal Adjustments"
          value={loading ? "—" : signalAdjustments}
          subtitle="intersections reconfigured"
          icon={<Zap className="h-4 w-4 text-accent" />}
          data-ocid="metric-signal-adjustments"
        />
      </div>

      {/* Active Emergencies */}
      <section data-ocid="active-emergencies-section">
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Active Emergency Alerts
        </h2>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        ) : activeAlerts.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card py-10"
            data-ocid="empty-active-emergencies"
          >
            <CheckCircle2 className="h-8 w-8 text-primary" />
            <p className="font-mono text-sm text-muted-foreground">
              No active emergencies — all clear
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <EmergencyAlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={handleAcknowledge}
                acknowledging={acknowledging === alert.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trigger + Signal Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Trigger panel */}
        <Card className="border-border bg-card" data-ocid="trigger-panel">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <Siren className="h-4 w-4 text-destructive" />
              Trigger Emergency Simulation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <label
                htmlFor="segment-select"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                Segment
              </label>
              <Select
                value={selectedSegment}
                onValueChange={setSelectedSegment}
              >
                <SelectTrigger
                  id="segment-select"
                  className="border-input bg-background font-mono text-xs"
                  data-ocid="trigger-segment-select"
                >
                  <SelectValue placeholder="Select segment…" />
                </SelectTrigger>
                <SelectContent>
                  {segments.map((s) => (
                    <SelectItem
                      key={s.id}
                      value={s.id}
                      className="font-mono text-xs"
                    >
                      {s.name} — {s.district}
                    </SelectItem>
                  ))}
                  {segments.length === 0 && (
                    <SelectItem value="__loading" disabled>
                      Loading segments…
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="vehicle-select"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                Vehicle Type
              </label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger
                  id="vehicle-select"
                  className="border-input bg-background font-mono text-xs"
                  data-ocid="trigger-vehicle-select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Ambulance", "Fire Truck", "Police", "Hazmat"].map((v) => (
                    <SelectItem key={v} value={v} className="font-mono text-xs">
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              variant="destructive"
              onClick={handleTrigger}
              disabled={triggering || !selectedSegment}
              data-ocid="trigger-emergency-btn"
            >
              <Siren className="mr-2 h-4 w-4" />
              {triggering ? "Triggering…" : "Trigger Emergency"}
            </Button>

            {lastTriggered && (
              <div
                className="rounded-md border border-primary/30 bg-primary/10 p-3"
                data-ocid="trigger-confirmation"
              >
                <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-primary">
                  Simulation Triggered
                </p>
                <p className="font-mono text-xs text-foreground">
                  <span className="text-muted-foreground">ID:</span>{" "}
                  {lastTriggered.id}
                </p>
                <p className="font-mono text-xs text-foreground">
                  <span className="text-muted-foreground">Vehicle:</span>{" "}
                  {lastTriggered.vehicleType} · Priority{" "}
                  {String(lastTriggered.priority)}/10
                </p>
                <p className="mt-1 text-xs text-foreground/80">
                  {lastTriggered.recommendedAction}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Signal Grid */}
        <TrafficSignalGrid hasEmergency={hasEmergency} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pie chart */}
        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Emergency Type Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {pieData.length === 0 ? (
              <p className="py-8 text-center font-mono text-xs text-muted-foreground">
                No data yet — trigger a simulation to populate
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.12 0 0)",
                      border: "1px solid oklch(0.22 0 0)",
                      borderRadius: "6px",
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "11px",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "10px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Session summary */}
        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Response Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {(
              [
                {
                  label: "Active Incidents",
                  value: activeAlerts.length,
                  color: "text-destructive",
                },
                {
                  label: "Resolved",
                  value: resolvedAlerts.length,
                  color: "text-primary",
                },
                {
                  label: "Signal Adjustments",
                  value: signalAdjustments,
                  color: "text-accent",
                },
                {
                  label: "Avg Response Time",
                  value: "2.3 min",
                  color: "text-foreground",
                },
              ] as const
            ).map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {row.label}
                </span>
                <span
                  className={cn("font-display text-lg font-bold", row.color)}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Emergency Log */}
      <section data-ocid="emergency-log-section">
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Emergency Log
        </h2>
        <Card className="border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {[
                    "ID",
                    "Type",
                    "Segment",
                    "Priority",
                    "Triggered At",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  (["r0", "r1", "r2"] as const).map((rk) => (
                    <tr key={rk} className="border-b border-border">
                      {(
                        ["c0", "c1", "c2", "c3", "c4", "c5", "c6"] as const
                      ).map((ck) => (
                        <td key={ck} className="px-4 py-2.5">
                          <Skeleton className="h-3 w-16" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : alerts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center font-mono text-xs text-muted-foreground"
                      data-ocid="empty-log"
                    >
                      No emergency records yet
                    </td>
                  </tr>
                ) : (
                  alerts.map((alert) => {
                    const ts = Number(alert.triggeredAt);
                    const d = new Date(ts > 1e12 ? ts / 1_000_000 : ts * 1000);
                    const timeStr = Number.isNaN(d.getTime())
                      ? "—"
                      : d.toLocaleTimeString();
                    const prio = Number(alert.priority);
                    return (
                      <tr
                        key={alert.id}
                        className="border-b border-border transition-colors hover:bg-muted/30"
                        data-ocid="emergency-log-row"
                      >
                        <td className="px-4 py-2.5 font-mono text-[10px] text-muted-foreground">
                          {alert.id.slice(0, 8)}…
                        </td>
                        <td className="px-4 py-2.5 font-medium text-foreground">
                          {alert.vehicleType}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-muted-foreground">
                          {alert.segmentId}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums">
                          <span
                            className={
                              prio >= 8
                                ? "text-destructive"
                                : prio >= 5
                                  ? "text-accent"
                                  : "text-primary"
                            }
                          >
                            {String(alert.priority)}/10
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-muted-foreground">
                          {timeStr}
                        </td>
                        <td className="px-4 py-2.5">
                          <StatusBadge
                            status={alert.isActive ? "Critical" : "Resolved"}
                            label={alert.isActive ? "Active" : "Resolved"}
                          />
                        </td>
                        <td className="max-w-[180px] truncate px-4 py-2.5 text-[10px] text-muted-foreground">
                          {alert.recommendedAction}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
