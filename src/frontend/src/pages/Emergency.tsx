import { createActor } from "@/backend";
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
  ChevronDown,
  Clock,
  ShieldCheck,
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

// ─── Constants ─────────────────────────────────────────────────────────────────

const INTERSECTIONS = [
  { id: "I-01", label: "Downtown-Main" },
  { id: "I-02", label: "Downtown-5th" },
  { id: "I-03", label: "Midtown-Broadway" },
  { id: "I-04", label: "Midtown-Park" },
];

const PIE_COLORS = [
  "oklch(0.62 0.24 24)", // red — Ambulance
  "oklch(0.72 0.23 55)", // amber — Fire
  "oklch(0.62 0.25 195)", // cyan — Police
  "oklch(0.68 0.18 110)", // green — Hazmat
  "oklch(0.55 0.15 280)", // purple — other
];

// ─── Vehicle Icon Components ────────────────────────────────────────────────────

function AmbulanceIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      role="img"
      aria-label="Ambulance"
    >
      <title>Ambulance</title>
      <rect
        x="2"
        y="8"
        width="20"
        height="10"
        rx="2"
        fill="currentColor"
        opacity="0.15"
      />
      <rect
        x="2"
        y="8"
        width="20"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 13h4M12 11v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="6" cy="18" r="2" fill="currentColor" />
      <circle cx="18" cy="18" r="2" fill="currentColor" />
      <path
        d="M14 8V6a2 2 0 0 0-4 0v2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function FireIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      role="img"
      aria-label="Fire Truck"
    >
      <title>Fire Truck</title>
      <path
        d="M12 2C12 2 6 8 6 13a6 6 0 0 0 12 0c0-3-2-6-2-6s-1 2-2 2c0-2-2-5-2-7z"
        fill="currentColor"
        opacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 14c0 1.1-.9 2-2 2 0-1 .5-2 1-3 .5 1 1 2 1 1z"
        fill="currentColor"
      />
    </svg>
  );
}

function PoliceIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      role="img"
      aria-label="Police"
    >
      <title>Police</title>
      <path
        d="M12 2l2.5 4h4.5l-3.5 3 1.5 4.5L12 11l-5 2.5L8.5 9 5 6h4.5L12 2z"
        fill="currentColor"
        opacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 15v5h6v-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HazmatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      role="img"
      aria-label="Hazmat"
    >
      <title>Hazmat</title>
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path
        d="M12 9a6 6 0 0 1 5.196 3H21a9 9 0 0 0-18 0h3.804A6 6 0 0 1 12 9z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M6.804 15a6 6 0 0 1 0-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17.196 15a6 6 0 0 0 0-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const VEHICLE_ICON_MAP: Record<string, React.ReactNode> = {
  Ambulance: <AmbulanceIcon className="h-5 w-5 text-destructive" />,
  "Fire Truck": <FireIcon className="h-5 w-5 text-accent" />,
  Police: <PoliceIcon className="h-5 w-5 text-primary" />,
  Hazmat: <HazmatIcon className="h-5 w-5 text-[oklch(0.68_0.18_110)]" />,
};

const VEHICLE_EMOJI_MAP: Record<string, string> = {
  Ambulance: "🚑",
  "Fire Truck": "🚒",
  Police: "🚓",
  Hazmat: "☢️",
};

// ─── Active Alert Count Banner ──────────────────────────────────────────────────

function AlertCountBanner({ count }: { count: number }) {
  const hasAlerts = count > 0;
  return (
    <div
      className={cn(
        "relative flex items-center gap-6 overflow-hidden rounded-xl border px-6 py-4 transition-smooth",
        hasAlerts
          ? "border-destructive/60 bg-destructive/10 glow-red"
          : "border-border bg-card",
      )}
      data-ocid="alert-count-banner"
    >
      {/* Scanline when active */}
      {hasAlerts && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-destructive/60 to-transparent" />
      )}

      {/* Large number */}
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "font-display text-7xl font-black leading-none tabular-nums",
            hasAlerts
              ? "text-destructive drop-shadow-[0_0_20px_oklch(0.62_0.24_24_/_0.8)]"
              : "text-muted-foreground",
          )}
        >
          {count}
        </span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Active Incidents
        </span>
      </div>

      {/* Divider */}
      <div className="h-16 w-px bg-border" />

      {/* Status text */}
      <div className="flex-1">
        {hasAlerts ? (
          <>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-ping rounded-full bg-destructive" />
              <span className="font-display text-lg font-bold uppercase tracking-widest text-destructive">
                EMERGENCY ACTIVE
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-destructive/70">
              {count} emergency incident{count !== 1 ? "s" : ""} require
              immediate response. Signal corridors are being dynamically
              adjusted.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="font-display text-lg font-bold text-primary">
                ALL CLEAR
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              No active emergencies. All intersections operating normally.
            </p>
          </>
        )}
      </div>

      {hasAlerts && (
        <Siren className="h-12 w-12 animate-pulse text-destructive/40" />
      )}
    </div>
  );
}

// ─── Traffic Signal Grid ────────────────────────────────────────────────────────

interface SignalLight {
  color: "red" | "amber" | "green";
  active: boolean;
}

function SignalBulb({
  light,
  emergency,
}: {
  light: SignalLight;
  emergency: boolean;
}) {
  const activeClasses: Record<string, string> = {
    red: "bg-destructive shadow-[0_0_10px_3px_oklch(0.62_0.24_24_/_0.6)]",
    amber: "bg-accent shadow-[0_0_10px_3px_oklch(0.72_0.23_55_/_0.6)]",
    green:
      emergency && light.active
        ? "bg-primary shadow-[0_0_16px_6px_oklch(0.62_0.25_195_/_0.8)] animate-pulse"
        : "bg-primary shadow-[0_0_10px_3px_oklch(0.62_0.25_195_/_0.6)]",
  };
  const dimClasses: Record<string, string> = {
    red: "bg-destructive/15",
    amber: "bg-accent/15",
    green: "bg-primary/15",
  };

  return (
    <div
      className={cn(
        "h-5 w-5 rounded-full transition-all duration-500",
        light.active ? activeClasses[light.color] : dimClasses[light.color],
      )}
    />
  );
}

function IntersectionSignal({
  label,
  lights,
  isPriority,
  hasEmergency,
}: {
  label: string;
  lights: SignalLight[];
  isPriority: boolean;
  hasEmergency: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border bg-card p-4 transition-smooth",
        isPriority
          ? "border-primary/60 ring-2 ring-primary/30 shadow-[0_0_20px_oklch(0.62_0.25_195_/_0.25)]"
          : "border-border",
      )}
    >
      {/* Signal housing */}
      <div className="flex flex-col items-center gap-2 rounded-lg bg-[oklch(0.06_0_0)] p-3 shadow-inner">
        {lights.map((l) => (
          <SignalBulb key={l.color} light={l} emergency={isPriority} />
        ))}
      </div>

      <span className="text-center font-mono text-[10px] leading-tight text-muted-foreground">
        {label}
      </span>

      {isPriority && (
        <span className="flex items-center gap-1 rounded-sm bg-primary/15 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest text-primary">
          <span className="h-1 w-1 animate-ping rounded-full bg-primary" />
          PRIORITY
        </span>
      )}
      {hasEmergency && !isPriority && (
        <span className="rounded-sm bg-destructive/15 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-destructive">
          HALTED
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
    }, 1800);
    return () => clearInterval(id);
  }, [hasEmergency]);

  return (
    <Card className="border-border bg-card" data-ocid="signal-grid">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <Zap className="h-4 w-4 text-accent" />
          Adaptive Signal Control
          {hasEmergency ? (
            <span className="ml-auto flex items-center gap-1.5 rounded bg-destructive/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-destructive">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-destructive" />
              EMERGENCY MODE
            </span>
          ) : (
            <span className="ml-auto rounded bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-primary">
              NORMAL
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {INTERSECTIONS.map((inter, idx) => {
            const isPriority = hasEmergency && idx === priorityIdx;
            const isCleared = hasEmergency && !isPriority;
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
              <IntersectionSignal
                key={inter.id}
                label={inter.label}
                lights={lights}
                isPriority={isPriority}
                hasEmergency={isCleared}
              />
            );
          })}
        </div>

        <p className="mt-4 rounded-md border border-border bg-muted/30 px-3 py-2 font-mono text-[10px] leading-relaxed text-muted-foreground">
          {hasEmergency
            ? `⚡ Emergency corridor ACTIVE — ${INTERSECTIONS[priorityIdx].label} prioritized. All cross-traffic suspended. Signal corridor cleared for emergency passage.`
            : "◎ Normal operation — adaptive timing optimizing traffic flow across all intersections."}
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Emergency Alert Card ───────────────────────────────────────────────────────

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

  const vehicleIcon = VEHICLE_ICON_MAP[alert.vehicleType] ?? (
    <AlertOctagon className="h-5 w-5 text-destructive" />
  );

  return (
    <div
      className="rounded-xl border border-destructive/50 bg-destructive/8 p-4 transition-smooth"
      data-ocid="emergency-alert-card"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Vehicle Icon + Info */}
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/15 text-xl">
            {VEHICLE_EMOJI_MAP[alert.vehicleType] ?? "🚨"}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-sm font-bold text-foreground">
                {alert.vehicleType}
              </span>
              <StatusBadge status="Critical" label="CRITICAL" />
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              <span className="text-foreground/70">Segment:</span>{" "}
              <span className="text-primary">{alert.segmentId}</span>
              &ensp;·&ensp;
              <span className="text-foreground/70">At:</span> {timeStr}
            </p>
          </div>
        </div>

        {/* Vehicle type icon (decorative, larger) */}
        <div className="flex items-center gap-3">
          <div className="hidden h-9 w-9 items-center justify-center sm:flex">
            {vehicleIcon}
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
      </div>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-foreground/85">
        {alert.description}
      </p>

      {/* Priority bar */}
      <div className="mt-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Priority Level
          </span>
          <span
            className={cn(
              "font-mono text-sm font-bold tabular-nums",
              barColor.replace("bg-", "text-"),
            )}
          >
            {priority}/10
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              barColor,
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Reasoning / Recommended Action */}
      <div className="mt-3 rounded-md border border-border bg-muted/40 px-3 py-2.5">
        <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          AI Recommended Action
        </p>
        <p className="text-xs leading-relaxed text-foreground/80">
          {alert.recommendedAction}
        </p>
      </div>
    </div>
  );
}

// ─── Acknowledged Alert Row ─────────────────────────────────────────────────────

function AcknowledgedRow({ alert }: { alert: EmergencyAlert }) {
  const ts = Number(alert.triggeredAt);
  const d = new Date(ts > 1e12 ? ts / 1_000_000 : ts * 1000);
  const timeStr = Number.isNaN(d.getTime()) ? "—" : d.toLocaleTimeString();

  return (
    <div
      className="flex items-center justify-between gap-3 border-b border-border py-2.5 last:border-0 opacity-50"
      data-ocid="acknowledged-alert-row"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-base" aria-hidden>
          {VEHICLE_EMOJI_MAP[alert.vehicleType] ?? "🚨"}
        </span>
        <div className="min-w-0">
          <span className="block truncate font-mono text-xs text-foreground">
            {alert.vehicleType}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {alert.segmentId}
          </span>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <span className="font-mono text-[10px] text-muted-foreground">
          {timeStr}
        </span>
        <StatusBadge status="Resolved" label="ACK" />
      </div>
    </div>
  );
}

// ─── Vehicle Donut Chart ────────────────────────────────────────────────────────

function VehicleDonutChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Emergency Type Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <Activity className="h-8 w-8 text-muted-foreground/40" />
            <p className="font-mono text-xs text-muted-foreground">
              Trigger a simulation to see breakdown
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.12 0 0)",
                    border: "1px solid oklch(0.22 0 0)",
                    borderRadius: "8px",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "11px",
                    color: "oklch(0.93 0 0)",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "10px",
                    color: "oklch(0.52 0 0)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Count pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {data.map((entry, idx) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1"
                >
                  <span className="text-sm">
                    {VEHICLE_EMOJI_MAP[entry.name] ?? "🚨"}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {entry.name}
                  </span>
                  <span
                    className="font-display text-sm font-bold tabular-nums"
                    style={{ color: PIE_COLORS[idx % PIE_COLORS.length] }}
                  >
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

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
  const [showAcknowledged, setShowAcknowledged] = useState(true);

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
        toast.success("Emergency acknowledged and logged");
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
      toast.success(`Emergency simulation triggered: ${result.vehicleType}`, {
        description: result.description,
      });
      await fetchAlerts();
    } catch {
      toast.error("Failed to trigger emergency simulation");
    } finally {
      setTriggering(false);
    }
  }, [actor, selectedSegment, vehicleType, fetchAlerts]);

  const activeAlerts = alerts.filter((a) => a.isActive);
  const acknowledgedAlerts = alerts.filter((a) => !a.isActive);
  const hasEmergency = activeAlerts.length > 0;

  const typeCounts = alerts.reduce<Record<string, number>>((acc, a) => {
    acc[a.vehicleType] = (acc[a.vehicleType] ?? 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(typeCounts).map(([name, value]) => ({
    name,
    value,
  }));
  const signalAdjustments =
    activeAlerts.length * 4 + acknowledgedAlerts.length * 2;

  return (
    <div className="space-y-6 p-6" data-ocid="emergency-page">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            Emergency Detection & Priority Response
          </h1>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            Real-time AI detection of emergency vehicles, accidents, and
            hazardous scenarios
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Live Feed
          </span>
        </div>
      </div>

      {/* Active Alert Count Banner */}
      <AlertCountBanner count={activeAlerts.length} />

      {/* Metric Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Active Emergencies",
            value: loading ? "—" : String(activeAlerts.length),
            color: hasEmergency ? "text-destructive" : "text-foreground",
            icon: <AlertOctagon className="h-4 w-4 text-destructive" />,
            ocid: "metric-active",
          },
          {
            label: "Total This Session",
            value: loading ? "—" : String(alerts.length),
            color: "text-foreground",
            icon: <Activity className="h-4 w-4 text-primary" />,
            ocid: "metric-total",
          },
          {
            label: "Signal Adjustments",
            value: loading ? "—" : String(signalAdjustments),
            color: "text-accent",
            icon: <Zap className="h-4 w-4 text-accent" />,
            ocid: "metric-signals",
          },
          {
            label: "Avg Response Time",
            value: "2.3 min",
            color: "text-foreground",
            icon: <Clock className="h-4 w-4 text-primary" />,
            ocid: "metric-response",
          },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-border bg-card p-4"
            data-ocid={m.ocid}
          >
            <div className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              {m.icon}
              {m.label}
            </div>
            <span
              className={cn(
                "font-display text-2xl font-black tabular-nums",
                m.color,
              )}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* Active Alerts */}
      <section data-ocid="active-alerts-section">
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Active Emergency Alerts
        </h2>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-36 rounded-xl" />
            <Skeleton className="h-36 rounded-xl" />
          </div>
        ) : activeAlerts.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card py-12"
            data-ocid="empty-active-alerts"
          >
            <ShieldCheck className="h-10 w-10 text-primary/50" />
            <p className="font-mono text-sm text-muted-foreground">
              No active emergencies — all clear
            </p>
            <p className="font-mono text-xs text-muted-foreground/60">
              Use the simulation panel to test emergency response
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

      {/* Signal Grid + Trigger Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Signal Grid */}
        <TrafficSignalGrid hasEmergency={hasEmergency} />

        {/* Trigger Panel */}
        <Card className="border-border bg-card" data-ocid="trigger-panel">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <Siren className="h-4 w-4 text-destructive" />
              Trigger Test Emergency
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
                htmlFor="vehicle-type-select"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                Vehicle Type
              </label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger
                  id="vehicle-type-select"
                  className="border-input bg-background font-mono text-xs"
                  data-ocid="trigger-vehicle-select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    ["Ambulance", "Fire Truck", "Police", "Hazmat"] as const
                  ).map((v) => (
                    <SelectItem key={v} value={v} className="font-mono text-xs">
                      {VEHICLE_EMOJI_MAP[v]} {v}
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
              {triggering ? "Triggering…" : "Trigger Test Emergency"}
            </Button>

            {lastTriggered && (
              <div
                className="rounded-lg border border-primary/30 bg-primary/8 p-3"
                data-ocid="trigger-confirmation"
              >
                <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-primary">
                  ✓ Simulation Triggered
                </p>
                <div className="space-y-1 font-mono text-xs">
                  <p>
                    <span className="text-muted-foreground">ID: </span>
                    <span className="text-foreground">
                      {lastTriggered.id.slice(0, 12)}…
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Vehicle: </span>
                    <span className="text-foreground">
                      {lastTriggered.vehicleType}
                    </span>
                    <span className="ml-2 text-muted-foreground">Priority</span>
                    <span className="ml-1 text-accent">
                      {String(lastTriggered.priority)}/10
                    </span>
                  </p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-foreground/75">
                  {lastTriggered.recommendedAction}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Donut chart */}
        <VehicleDonutChart data={pieData} />

        {/* Response Statistics */}
        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Response Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0 pt-4">
            {(
              [
                {
                  label: "Active Incidents",
                  value: loading ? "—" : String(activeAlerts.length),
                  color: "text-destructive",
                },
                {
                  label: "Acknowledged",
                  value: loading ? "—" : String(acknowledgedAlerts.length),
                  color: "text-primary",
                },
                {
                  label: "Signal Adjustments",
                  value: loading ? "—" : String(signalAdjustments),
                  color: "text-accent",
                },
                {
                  label: "Avg Response Time",
                  value: "2.3 min",
                  color: "text-foreground",
                },
                {
                  label: "Corridors Cleared",
                  value: loading ? "—" : String(activeAlerts.length),
                  color: "text-primary",
                },
              ] as const
            ).map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between border-b border-border py-3 last:border-0"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {row.label}
                </span>
                <span
                  className={cn(
                    "font-display text-xl font-black tabular-nums",
                    row.color,
                  )}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Acknowledged Alerts Section */}
      <section data-ocid="acknowledged-alerts-section">
        <button
          type="button"
          className="mb-3 flex w-full items-center justify-between"
          onClick={() => setShowAcknowledged((v) => !v)}
          data-ocid="acknowledged-toggle"
        >
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Acknowledged Alerts
            <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
              {acknowledgedAlerts.length}
            </span>
          </h2>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              !showAcknowledged && "-rotate-90",
            )}
          />
        </button>

        {showAcknowledged && (
          <Card className="border-border bg-card" data-ocid="acknowledged-list">
            {loading ? (
              <div className="space-y-2 p-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : acknowledgedAlerts.length === 0 ? (
              <div className="px-4 py-8 text-center font-mono text-xs text-muted-foreground">
                No acknowledged alerts yet
              </div>
            ) : (
              <div className="px-4 py-2">
                {acknowledgedAlerts.map((alert) => (
                  <AcknowledgedRow key={alert.id} alert={alert} />
                ))}
              </div>
            )}
          </Card>
        )}
      </section>
    </div>
  );
}
