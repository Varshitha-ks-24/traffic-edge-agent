import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimulationStore } from "@/lib/simulationStore";
import { cn } from "@/lib/utils";
import { AlertSeverity, AnomalyType, WeatherCondition } from "@/types/traffic";
import type { Anomaly, TrafficSegment, WeatherData } from "@/types/traffic";
import {
  Activity,
  AlertTriangle,
  Car,
  CloudFog,
  CloudRain,
  Cpu,
  Eye,
  Footprints,
  ShieldAlert,
  Snowflake,
  Sun,
  ThermometerSun,
  Truck,
  Wind,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(nanoTs: bigint): string {
  const ms = Number(nanoTs / 1_000_000n);
  const diff = Date.now() - ms;
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3_600_000)}h ago`;
}

function congestionBgColor(pct: number): string {
  if (pct >= 70) return "bg-destructive";
  if (pct >= 35) return "bg-accent";
  return "bg-primary";
}

function congestionTextColor(pct: number): string {
  if (pct >= 70) return "text-destructive";
  if (pct >= 35) return "text-accent";
  return "text-primary";
}

function congestionHsl(pct: number): string {
  if (pct >= 70) return "hsl(var(--destructive))";
  if (pct >= 35) return "hsl(var(--accent))";
  return "hsl(var(--primary))";
}

const ANOMALY_ICONS: Record<AnomalyType, React.ReactNode> = {
  [AnomalyType.Pedestrian]: <Footprints className="h-3.5 w-3.5" />,
  [AnomalyType.Obstacle]: <AlertTriangle className="h-3.5 w-3.5" />,
  [AnomalyType.Animal]: <Eye className="h-3.5 w-3.5" />,
  [AnomalyType.Accident]: <ShieldAlert className="h-3.5 w-3.5" />,
  [AnomalyType.VehicleBreakdown]: <Truck className="h-3.5 w-3.5" />,
  [AnomalyType.EmergencyVehicle]: <Zap className="h-3.5 w-3.5" />,
};

const SEVERITY_BORDER: Record<AlertSeverity, string> = {
  [AlertSeverity.Critical]: "border-l-destructive",
  [AlertSeverity.High]: "border-l-accent",
  [AlertSeverity.Medium]: "border-l-primary",
  [AlertSeverity.Low]: "border-l-muted-foreground",
};

// ─── WeatherIcon ─────────────────────────────────────────────────────────────

function WeatherIcon({
  condition,
  className,
}: {
  condition: WeatherCondition;
  className?: string;
}) {
  const props = { className: cn("h-5 w-5", className) };
  switch (condition) {
    case WeatherCondition.Rain:
      return <CloudRain {...props} />;
    case WeatherCondition.Fog:
      return <CloudFog {...props} />;
    case WeatherCondition.Storm:
      return <Zap {...props} />;
    case WeatherCondition.Snow:
      return <Snowflake {...props} />;
    default:
      return <Sun {...props} />;
  }
}

// ─── SegmentCard ──────────────────────────────────────────────────────────────

function SegmentCard({ seg }: { seg: TrafficSegment }) {
  const pct = Number(seg.congestionPct);

  return (
    <div
      className="flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3 transition-smooth hover:border-primary/40"
      data-ocid={`segment-card-${seg.id}`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="truncate font-mono text-[11px] font-semibold text-foreground">
            {seg.name}
          </p>
          <p className="truncate font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            {seg.district}
          </p>
        </div>
        <StatusBadge status={seg.trafficLevel} />
      </div>

      <div className="grid grid-cols-3 gap-1 text-center">
        {(
          [
            {
              label: "Vehicles",
              value: String(seg.vehicleCount),
              icon: <Car className="h-3 w-3" />,
            },
            {
              label: "Speed",
              value: `${seg.avgSpeed.toFixed(0)}km/h`,
              icon: <Activity className="h-3 w-3" />,
            },
            {
              label: "Wait",
              value: `${seg.waitTimeSeconds}s`,
              icon: <Zap className="h-3 w-3" />,
            },
          ] as { label: string; value: string; icon: React.ReactNode }[]
        ).map(({ label, value, icon }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-0.5 rounded bg-muted/50 px-1 py-1.5"
          >
            <span className="text-muted-foreground">{icon}</span>
            <span className="font-mono text-[10px] font-bold tabular-nums text-foreground">
              {value}
            </span>
            <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Congestion
          </span>
          <span
            className={cn(
              "font-mono text-[10px] font-bold tabular-nums",
              congestionTextColor(pct),
            )}
          >
            {pct}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              congestionBgColor(pct),
            )}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── AnomalyRow ───────────────────────────────────────────────────────────────

function AnomalyRow({
  anomaly,
  segName,
}: {
  anomaly: Anomaly;
  segName: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 border-l-2 py-2.5 pl-3 pr-3 transition-smooth hover:bg-muted/20",
        SEVERITY_BORDER[anomaly.severity] ?? "border-l-muted-foreground",
      )}
      data-ocid={`anomaly-row-${anomaly.id}`}
    >
      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
        {ANOMALY_ICONS[anomaly.anomalyType] ?? (
          <AlertTriangle className="h-3.5 w-3.5" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-[11px] font-semibold text-foreground">
          {anomaly.description}
        </p>
        <p className="font-mono text-[9px] text-muted-foreground">{segName}</p>
      </div>
      <div className="flex flex-shrink-0 flex-col items-end gap-1">
        <StatusBadge status={anomaly.severity} />
        <span className="font-mono text-[9px] text-muted-foreground">
          {timeAgo(anomaly.detectedAt)}
        </span>
      </div>
    </div>
  );
}

// ─── WeatherPanel ─────────────────────────────────────────────────────────────

function WeatherPanel({ weather }: { weather: WeatherData }) {
  const conditionLabel = weather.condition as string;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <WeatherIcon condition={weather.condition} className="h-6 w-6" />
        </div>
        <div>
          <p className="font-display text-base font-bold text-foreground">
            {conditionLabel}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Current Conditions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(
          [
            {
              icon: <ThermometerSun className="h-3.5 w-3.5" />,
              value: `${weather.temperature.toFixed(1)}°C`,
              label: "Temp",
            },
            {
              icon: <Eye className="h-3.5 w-3.5" />,
              value: `${weather.visibility}m`,
              label: "Visibility",
            },
            {
              icon: <Wind className="h-3.5 w-3.5" />,
              value: `${weather.windSpeed.toFixed(1)}km/h`,
              label: "Wind",
            },
          ] as { icon: React.ReactNode; value: string; label: string }[]
        ).map(({ icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 rounded-lg bg-muted/40 py-2"
          >
            <span className="text-primary">{icon}</span>
            <span className="font-mono text-[11px] font-bold tabular-nums text-foreground">
              {value}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>

      {weather.affectedDistricts.length > 0 && (
        <div>
          <p className="mb-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Affected Districts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {weather.affectedDistricts.map((d) => (
              <span
                key={d}
                className="rounded bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
        <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-primary">
          AI Recommendation
        </p>
        <p className="font-mono text-[11px] leading-relaxed text-foreground">
          {weather.recommendation}
        </p>
      </div>
    </div>
  );
}

// ─── CongestionChart ──────────────────────────────────────────────────────────

interface ChartItem {
  district: string;
  congestion: number;
}

function CongestionChart({ segments }: { segments: TrafficSegment[] }) {
  const grouped = segments.reduce<Record<string, number[]>>((acc, seg) => {
    if (!acc[seg.district]) acc[seg.district] = [];
    acc[seg.district].push(Number(seg.congestionPct));
    return acc;
  }, {});

  const data: ChartItem[] = Object.entries(grouped).map(([district, vals]) => ({
    district: district.length > 11 ? `${district.slice(0, 9)}…` : district,
    congestion: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
  }));

  return (
    <div className="mt-2">
      <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        Avg Congestion by District
      </p>
      <ResponsiveContainer width="100%" height={90}>
        <BarChart
          data={data}
          barSize={20}
          margin={{ top: 2, right: 4, bottom: 0, left: -28 }}
        >
          <XAxis
            dataKey="district"
            tick={{
              fontSize: 9,
              fill: "hsl(var(--muted-foreground))",
              fontFamily: "JetBrains Mono",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{
              fontSize: 8,
              fill: "hsl(var(--muted-foreground))",
              fontFamily: "JetBrains Mono",
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
              fontSize: "10px",
              fontFamily: "JetBrains Mono",
              color: "hsl(var(--foreground))",
            }}
            formatter={(val: number) => [`${val}%`, "Congestion"]}
          />
          <Bar dataKey="congestion" radius={[3, 3, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.district}
                fill={congestionHsl(entry.congestion)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── DashboardSkeleton ────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-4 p-5" data-ocid="dashboard-skeleton">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["a", "b", "c", "d"] as const).map((k) => (
          <Skeleton key={k} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-5 w-44 rounded" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => i).map((i) => (
          <Skeleton key={i} className="h-36 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Skeleton className="h-60 rounded-lg" />
        <Skeleton className="h-60 rounded-lg" />
      </div>
      <Skeleton className="h-32 rounded-lg" />
    </div>
  );
}

// ─── Dashboard (main export) ─────────────────────────────────────────────────

export function Dashboard() {
  const { snapshot, isLoading, lastUpdated } = useSimulationStore();

  if (isLoading && !snapshot) {
    return <DashboardSkeleton />;
  }

  if (!snapshot) {
    return (
      <div
        className="flex h-full flex-col items-center justify-center gap-3"
        data-ocid="dashboard-empty"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <Activity className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="font-mono text-sm text-muted-foreground">
          Connecting to traffic intelligence system…
        </p>
      </div>
    );
  }

  const { segments, activeAnomalies, weather, systemHealth } = snapshot;

  const totalVehicles = segments.reduce(
    (sum, s) => sum + Number(s.vehicleCount),
    0,
  );
  const avgCongestion =
    segments.length > 0
      ? Math.round(
          segments.reduce((sum, s) => sum + Number(s.congestionPct), 0) /
            segments.length,
        )
      : 0;
  const healthPct = Number(systemHealth);
  const anomalyCount = activeAnomalies.length;

  const segById: Record<string, TrafficSegment> = Object.fromEntries(
    segments.map((s) => [s.id, s]),
  );

  return (
    <div className="space-y-4 p-5" data-ocid="dashboard-page">
      {/* ── Top Metric Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          title="Active Vehicles"
          value={totalVehicles.toLocaleString()}
          subtitle="Across all road segments"
          icon={<Car className="h-4 w-4 text-primary" />}
          data-ocid="metric-vehicles"
        />
        <MetricCard
          title="Active Anomalies"
          value={anomalyCount}
          subtitle={anomalyCount > 0 ? "Requires attention" : "All clear"}
          icon={<AlertTriangle className="h-4 w-4" />}
          colorClass={anomalyCount > 0 ? "text-destructive" : "text-primary"}
          data-ocid="metric-anomalies"
        />
        <MetricCard
          title="Avg Congestion"
          value={`${avgCongestion}%`}
          subtitle="Mean across all segments"
          icon={<Activity className="h-4 w-4" />}
          colorClass={congestionTextColor(avgCongestion)}
          data-ocid="metric-congestion"
        />
        <MetricCard
          title="System Health"
          value={`${healthPct}%`}
          subtitle={
            healthPct >= 90
              ? "All systems nominal"
              : healthPct >= 70
                ? "Minor degradation"
                : "Attention required"
          }
          icon={<Cpu className="h-4 w-4" />}
          colorClass={
            healthPct >= 90
              ? "text-primary"
              : healthPct >= 70
                ? "text-accent"
                : "text-destructive"
          }
          data-ocid="metric-health"
        />
      </div>

      {/* ── Grid Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1 w-4 rounded-full bg-primary" />
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-foreground">
            City Traffic Grid
          </h2>
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
            {segments.length} segments
          </span>
        </div>
        {lastUpdated && (
          <span className="font-mono text-[9px] text-muted-foreground">
            Last updated{" "}
            <span className="text-primary">
              {lastUpdated.toLocaleTimeString()}
            </span>
          </span>
        )}
      </div>

      {/* ── Segment Grid ── */}
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        data-ocid="segment-grid"
      >
        {segments.map((seg) => (
          <SegmentCard key={seg.id} seg={seg} />
        ))}
        {segments.length === 0 && (
          <div
            className="col-span-4 flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card py-12 text-center"
            data-ocid="segment-grid-empty"
          >
            <Car className="h-8 w-8 text-muted-foreground" />
            <p className="font-mono text-xs text-muted-foreground">
              No segment data — use TICK to simulate
            </p>
          </div>
        )}
      </div>

      {/* ── Bottom Row: Anomalies + Weather ── */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Recent Anomalies */}
        <div
          className="rounded-lg border border-border bg-card"
          data-ocid="anomalies-panel"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-3 rounded-full bg-destructive" />
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-foreground">
                Recent Anomalies
              </h3>
              {anomalyCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 font-mono text-[9px] font-bold text-destructive-foreground pulse-glow">
                  {anomalyCount}
                </span>
              )}
            </div>
            <span className="font-mono text-[9px] text-muted-foreground">
              Live detection feed
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {activeAnomalies.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center gap-2 py-10 text-center"
                data-ocid="anomalies-empty"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <p className="font-mono text-[11px] text-foreground">
                  No active anomalies detected
                </p>
                <p className="font-mono text-[9px] text-muted-foreground">
                  All road segments operating normally
                </p>
              </div>
            ) : (
              activeAnomalies
                .slice(0, 5)
                .map((anomaly) => (
                  <AnomalyRow
                    key={anomaly.id}
                    anomaly={anomaly}
                    segName={
                      segById[anomaly.segmentId]?.name ?? anomaly.segmentId
                    }
                  />
                ))
            )}
          </div>
        </div>

        {/* Weather Intelligence */}
        <div
          className="rounded-lg border border-border bg-card"
          data-ocid="weather-panel"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-3 rounded-full bg-primary" />
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-foreground">
                Weather Intelligence
              </h3>
            </div>
            <div className="flex items-center gap-1.5 rounded bg-muted/50 px-2 py-1">
              <WeatherIcon
                condition={weather.condition}
                className="h-3 w-3 text-primary"
              />
              <span className="font-mono text-[9px] text-muted-foreground">
                {weather.condition as string}
              </span>
            </div>
          </div>
          <div className="p-4">
            <WeatherPanel weather={weather} />
          </div>
        </div>
      </div>

      {/* ── Congestion Bar Chart ── */}
      {segments.length > 0 && (
        <div
          className="rounded-lg border border-border bg-card p-4"
          data-ocid="congestion-chart"
        >
          <div className="flex items-center gap-2">
            <div className="h-1 w-3 rounded-full bg-accent" />
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-foreground">
              Congestion Overview
            </h3>
          </div>
          <CongestionChart segments={segments} />
        </div>
      )}
    </div>
  );
}
