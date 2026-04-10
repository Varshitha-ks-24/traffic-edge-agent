import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimulationStore } from "@/lib/simulationStore";
import { cn } from "@/lib/utils";
import {
  AlertSeverity,
  type Anomaly,
  AnomalyType,
  type TrafficSegment,
  WeatherCondition,
  type WeatherData,
} from "@/types/traffic";
import {
  Activity,
  AlertTriangle,
  Box,
  Car,
  Clock,
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Cpu,
  Eye,
  Footprints,
  MapPin,
  PawPrint,
  Shield,
  Sun,
  Thermometer,
  TrendingDown,
  TrendingUp,
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

function congestionColor(pct: number): string {
  if (pct >= 70) return "hsl(var(--destructive))";
  if (pct >= 30) return "hsl(var(--accent))";
  return "hsl(var(--primary))";
}

function congestionRawColor(pct: number): string {
  if (pct >= 70) return "#ef4444";
  if (pct >= 30) return "#f59e0b";
  return "#22d3ee";
}

function congestionTextClass(pct: number): string {
  if (pct >= 70) return "text-destructive";
  if (pct >= 30) return "text-accent";
  return "text-primary";
}

function formatClock(ts: bigint): string {
  const ms = Number(ts);
  // Handle both nanosecond (IC) and millisecond timestamps
  const d =
    ms > 1e15
      ? new Date(Math.floor(ms / 1_000_000))
      : new Date(ms < 1e12 ? ms * 1000 : ms);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function timeAgo(ts: bigint): string {
  const ms = Number(ts);
  const d = ms > 1e15 ? Math.floor(ms / 1_000_000) : ms < 1e12 ? ms * 1000 : ms;
  const diff = Date.now() - d;
  if (diff < 0) return "just now";
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3_600_000)}h ago`;
}

// ─── Anomaly Icon Map ─────────────────────────────────────────────────────────

const ANOMALY_ICON: Record<AnomalyType, React.ReactNode> = {
  [AnomalyType.Accident]: <AlertTriangle className="h-3.5 w-3.5" />,
  [AnomalyType.Pedestrian]: <Footprints className="h-3.5 w-3.5" />,
  [AnomalyType.Animal]: <PawPrint className="h-3.5 w-3.5" />,
  [AnomalyType.Obstacle]: <Box className="h-3.5 w-3.5" />,
  [AnomalyType.EmergencyVehicle]: <Zap className="h-3.5 w-3.5" />,
  [AnomalyType.VehicleBreakdown]: <Car className="h-3.5 w-3.5" />,
};

const SEVERITY_BORDER: Record<AlertSeverity, string> = {
  [AlertSeverity.Critical]: "border-l-destructive bg-destructive/5",
  [AlertSeverity.High]: "border-l-destructive/60 bg-destructive/5",
  [AlertSeverity.Medium]: "border-l-accent bg-accent/5",
  [AlertSeverity.Low]: "border-l-primary bg-primary/5",
};

// ─── Weather Icon ─────────────────────────────────────────────────────────────

function WeatherIcon({
  condition,
  className,
}: {
  condition: WeatherCondition;
  className?: string;
}) {
  const cls = cn("h-5 w-5", className);
  switch (condition) {
    case WeatherCondition.Rain:
      return <CloudRain className={cn(cls, "text-primary")} />;
    case WeatherCondition.Fog:
      return <Cloud className={cn(cls, "text-muted-foreground")} />;
    case WeatherCondition.Storm:
      return <CloudLightning className={cn(cls, "text-destructive")} />;
    case WeatherCondition.Snow:
      return <CloudSnow className={cn(cls, "text-primary")} />;
    default:
      return <Sun className={cn(cls, "text-accent")} />;
  }
}

// ─── Panel Shell ──────────────────────────────────────────────────────────────

function Panel({
  title,
  icon,
  badge,
  children,
  className,
  "data-ocid": dataOcid,
}: {
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  "data-ocid"?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-border bg-card overflow-hidden",
        className,
      )}
      data-ocid={dataOcid}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary shrink-0">{icon}</span>}
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {title}
          </span>
          {badge}
        </div>
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}

// ─── SVG Traffic Map ──────────────────────────────────────────────────────────

// Fixed positions for 8 named districts in a city-grid layout (560×320 viewBox)
const NODE_POS: Record<string, { x: number; y: number }> = {
  "seg-downtown": { x: 280, y: 160 },
  "seg-northside": { x: 280, y: 65 },
  "seg-eastbridge": { x: 420, y: 160 },
  "seg-westgate": { x: 140, y: 160 },
  "seg-harbor": { x: 420, y: 255 },
  "seg-uptown": { x: 140, y: 65 },
  "seg-industrial": { x: 420, y: 65 },
  "seg-suburbs": { x: 280, y: 255 },
};

const ROADS: Array<[string, string]> = [
  ["seg-downtown", "seg-northside"],
  ["seg-downtown", "seg-eastbridge"],
  ["seg-downtown", "seg-westgate"],
  ["seg-downtown", "seg-suburbs"],
  ["seg-northside", "seg-uptown"],
  ["seg-northside", "seg-industrial"],
  ["seg-eastbridge", "seg-harbor"],
  ["seg-eastbridge", "seg-industrial"],
  ["seg-westgate", "seg-uptown"],
  ["seg-suburbs", "seg-harbor"],
];

function TrafficMap({ segments }: { segments: TrafficSegment[] }) {
  const byId = new Map(segments.map((s) => [s.id, s]));

  // For segments not in our fixed positions, spread them out
  let fallbackIdx = 0;
  const fallbackPositions = [
    { x: 560, y: 160 },
    { x: 0, y: 160 },
    { x: 280, y: 0 },
    { x: 560, y: 255 },
    { x: 0, y: 65 },
  ];

  const allPositions = new Map<string, { x: number; y: number }>();
  for (const seg of segments) {
    if (NODE_POS[seg.id]) {
      allPositions.set(seg.id, NODE_POS[seg.id]);
    } else {
      allPositions.set(
        seg.id,
        fallbackPositions[fallbackIdx++ % fallbackPositions.length],
      );
    }
  }

  return (
    <svg
      viewBox="0 0 560 320"
      className="w-full h-full"
      role="img"
      aria-label="City traffic map showing 8 district nodes color-coded by congestion level"
    >
      {/* Background grid */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(255,255,255,0.025)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="560" height="320" fill="url(#grid)" />

      {/* Road connections */}
      {ROADS.map(([fromId, toId]) => {
        const from = allPositions.get(fromId);
        const to = allPositions.get(toId);
        if (!from || !to) return null;
        const seg = byId.get(fromId);
        const pct = seg ? Number(seg.congestionPct) : 0;
        const color = congestionRawColor(pct);
        return (
          <g key={`${fromId}-${toId}`}>
            {/* Road substrate */}
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Traffic color layer */}
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={color}
              strokeWidth="3"
              strokeOpacity="0.55"
              strokeLinecap="round"
              strokeDasharray={pct >= 70 ? "8 5" : "none"}
            />
          </g>
        );
      })}

      {/* Segment nodes */}
      {segments.map((seg) => {
        const pos = allPositions.get(seg.id);
        if (!pos) return null;
        const pct = Number(seg.congestionPct);
        const color = congestionRawColor(pct);
        const r = 22;
        const shortName = seg.name.split(" ").slice(0, 2).join(" ");
        return (
          <g key={seg.id} transform={`translate(${pos.x},${pos.y})`}>
            {/* Outer glow */}
            <circle r={r + 7} fill={color} fillOpacity="0.07" />
            {/* Background circle */}
            <circle
              r={r}
              fill="oklch(0.1 0 0)"
              stroke={color}
              strokeWidth="1.5"
            />
            {/* Congestion % */}
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              y={-5}
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="700"
              fill={color}
            >
              {pct}%
            </text>
            {/* Segment short name */}
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              y={7}
              fontSize="6.5"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fill="rgba(255,255,255,0.45)"
            >
              {shortName}
            </text>
            {/* Speed label below node */}
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              y={r + 13}
              fontSize="7.5"
              fontFamily="JetBrains Mono, monospace"
              fill="rgba(255,255,255,0.3)"
            >
              {Math.round(seg.avgSpeed)} km/h
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Segment Congestion Bar List ──────────────────────────────────────────────

function SegmentBars({ segments }: { segments: TrafficSegment[] }) {
  const sorted = [...segments].sort(
    (a, b) => Number(b.congestionPct) - Number(a.congestionPct),
  );
  return (
    <div className="space-y-2.5">
      {sorted.map((seg) => {
        const pct = Number(seg.congestionPct);
        const color = congestionRawColor(pct);
        return (
          <div
            key={seg.id}
            className="flex items-center gap-3 group"
            data-ocid={`seg-bar-${seg.id}`}
          >
            <span className="w-24 truncate font-mono text-[10px] text-muted-foreground group-hover:text-foreground transition-smooth">
              {seg.name}
            </span>
            <div className="flex-1 h-2 rounded-full bg-muted/60 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(pct, 100)}%`, background: color }}
              />
            </div>
            <span
              className="w-9 text-right font-mono text-[10px] font-bold tabular-nums"
              style={{ color }}
            >
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Recharts District Chart ──────────────────────────────────────────────────

interface ChartItem {
  name: string;
  congestion: number;
}

function DistrictChart({ segments }: { segments: TrafficSegment[] }) {
  const grouped: Record<string, number[]> = {};
  for (const seg of segments) {
    if (!grouped[seg.district]) grouped[seg.district] = [];
    grouped[seg.district].push(Number(seg.congestionPct));
  }
  const data: ChartItem[] = Object.entries(grouped).map(([district, vals]) => ({
    name: district.length > 10 ? `${district.slice(0, 9)}…` : district,
    congestion: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
  }));

  return (
    <ResponsiveContainer width="100%" height={100}>
      <BarChart
        data={data}
        barSize={18}
        margin={{ top: 4, right: 4, bottom: 0, left: -28 }}
      >
        <XAxis
          dataKey="name"
          tick={{
            fontSize: 8,
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
            <Cell key={entry.name} fill={congestionColor(entry.congestion)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Anomaly Alert Feed ───────────────────────────────────────────────────────

function AnomalyFeed({
  anomalies,
  segById,
}: {
  anomalies: Anomaly[];
  segById: Record<string, TrafficSegment>;
}) {
  const active = anomalies.filter((a) => a.isActive).slice(0, 5);

  if (active.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center h-32 gap-2"
        data-ocid="anomalies-empty"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">
          No active anomalies
        </p>
      </div>
    );
  }

  return (
    <div
      className="space-y-0 divide-y divide-border/60"
      data-ocid="anomaly-feed"
    >
      {active.map((anomaly) => {
        const borderCls =
          SEVERITY_BORDER[anomaly.severity] ??
          "border-l-muted-foreground bg-muted/5";
        const segName = segById[anomaly.segmentId]?.name ?? anomaly.segmentId;
        return (
          <div
            key={anomaly.id}
            className={cn(
              "flex items-start gap-3 border-l-2 py-2.5 pl-3 pr-2 transition-smooth hover:brightness-110",
              borderCls,
            )}
            data-ocid={`anomaly-row-${anomaly.id}`}
          >
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
              {ANOMALY_ICON[anomaly.anomalyType] ?? (
                <AlertTriangle className="h-3.5 w-3.5" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-[11px] font-semibold text-foreground">
                {anomaly.description}
              </p>
              <p className="font-mono text-[9px] text-muted-foreground">
                {segName}
              </p>
              {anomaly.reasoning && (
                <p className="mt-0.5 font-mono text-[9px] text-muted-foreground/70 leading-relaxed line-clamp-1">
                  ↳ {anomaly.reasoning}
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <StatusBadge status={anomaly.severity} />
              <span className="font-mono text-[8px] text-muted-foreground">
                {timeAgo(anomaly.detectedAt)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Weather Panel ────────────────────────────────────────────────────────────

function WeatherPanel({ weather }: { weather: WeatherData }) {
  return (
    <div className="flex flex-col gap-3" data-ocid="weather-panel-inner">
      {/* Condition + Temperature */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-muted/60">
          <WeatherIcon condition={weather.condition} className="h-7 w-7" />
        </div>
        <div>
          <p className="font-display text-2xl font-bold tabular-nums leading-none">
            {weather.temperature.toFixed(1)}°C
          </p>
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">
            {weather.condition as string}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {(
          [
            {
              Icon: Eye,
              label: "Visibility",
              value: `${weather.visibility}m`,
            },
            {
              Icon: Wind,
              label: "Wind",
              value: `${weather.windSpeed.toFixed(0)} km/h`,
            },
            {
              Icon: Thermometer,
              label: "Feels",
              value: `${(weather.temperature - 2).toFixed(0)}°`,
            },
          ] as { Icon: React.ElementType; label: string; value: string }[]
        ).map(({ Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 rounded-lg bg-muted/40 py-2"
          >
            <Icon className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-[11px] font-bold">{value}</span>
            <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Affected districts */}
      {weather.affectedDistricts.length > 0 && (
        <div>
          <p className="mb-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Affected Districts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {weather.affectedDistricts.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1 rounded bg-accent/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-accent"
              >
                <MapPin className="h-2.5 w-2.5" />
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendation */}
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

// ─── Anomaly Timeline Ticker ──────────────────────────────────────────────────

function AnomalyTicker({ anomalies }: { anomalies: Anomaly[] }) {
  const recent = [...anomalies]
    .sort((a, b) => Number(b.detectedAt) - Number(a.detectedAt))
    .slice(0, 8);

  if (recent.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 font-mono text-[10px] text-muted-foreground">
        No events recorded
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50" data-ocid="anomaly-ticker">
      {recent.map((anomaly, i) => {
        const sevColor =
          anomaly.severity === AlertSeverity.Critical ||
          anomaly.severity === AlertSeverity.High
            ? "text-destructive"
            : anomaly.severity === AlertSeverity.Medium
              ? "text-accent"
              : "text-primary";
        return (
          <div
            key={anomaly.id}
            className={cn(
              "flex items-center gap-3 py-2 px-1 hover:bg-muted/20 transition-smooth",
              i === 0 && "bg-muted/10",
            )}
          >
            <span className={cn("shrink-0", sevColor)}>
              {ANOMALY_ICON[anomaly.anomalyType] ?? (
                <AlertTriangle className="h-3.5 w-3.5" />
              )}
            </span>
            <div className="flex-1 min-w-0">
              <span className="font-mono text-[10px] text-foreground">
                {anomaly.anomalyType}
              </span>
              <span className="font-mono text-[9px] text-muted-foreground mx-1.5">
                @
              </span>
              <span className="font-mono text-[9px] text-muted-foreground truncate">
                {anomaly.segmentId.replace("seg-", "")}
              </span>
            </div>
            <div className="shrink-0 text-right">
              <span className="font-mono text-[8px] text-muted-foreground">
                {formatClock(anomaly.detectedAt)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Segment Detail Table ─────────────────────────────────────────────────────

function SegmentTable({ segments }: { segments: TrafficSegment[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            {[
              "Segment",
              "District",
              "Level",
              "Congestion",
              "Vehicles",
              "Speed",
              "Wait",
            ].map((h) => (
              <th
                key={h}
                className="pb-2 pr-4 font-mono text-[9px] uppercase tracking-widest text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {segments.map((seg) => {
            const pct = Number(seg.congestionPct);
            const color = congestionRawColor(pct);
            return (
              <tr
                key={seg.id}
                className="hover:bg-muted/20 transition-smooth"
                data-ocid={`segment-row-${seg.id}`}
              >
                <td className="py-2 pr-4 font-mono text-[11px] text-foreground">
                  {seg.name}
                </td>
                <td className="py-2 pr-4 font-mono text-[10px] text-muted-foreground">
                  {seg.district}
                </td>
                <td className="py-2 pr-4">
                  <StatusBadge status={seg.trafficLevel} />
                </td>
                <td className="py-2 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(pct, 100)}%`,
                          background: color,
                        }}
                      />
                    </div>
                    <span
                      className="font-mono text-[10px] tabular-nums"
                      style={{ color }}
                    >
                      {pct}%
                    </span>
                  </div>
                </td>
                <td className="py-2 pr-4 font-mono text-[10px] tabular-nums text-right text-foreground">
                  {Number(seg.vehicleCount).toLocaleString()}
                </td>
                <td className="py-2 pr-4 font-mono text-[10px] tabular-nums text-right text-foreground">
                  {seg.avgSpeed.toFixed(0)} km/h
                </td>
                <td className="py-2 font-mono text-[10px] tabular-nums text-right text-muted-foreground">
                  {String(seg.waitTimeSeconds)}s
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-4 p-5" data-ocid="dashboard-skeleton">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["a", "b", "c", "d"] as const).map((k) => (
          <Skeleton key={k} className="h-24 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-12 gap-4">
        <Skeleton className="col-span-8 h-72 rounded-lg" />
        <Skeleton className="col-span-4 h-72 rounded-lg" />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <Skeleton className="col-span-4 h-56 rounded-lg" />
        <Skeleton className="col-span-4 h-56 rounded-lg" />
        <Skeleton className="col-span-4 h-56 rounded-lg" />
      </div>
      <Skeleton className="h-40 rounded-lg" />
    </div>
  );
}

// ─── Dashboard (main export) ──────────────────────────────────────────────────

export function Dashboard() {
  const { snapshot, isLoading, error, lastUpdated } = useSimulationStore();

  if (error) {
    return (
      <div
        className="flex h-full flex-col items-center justify-center gap-3"
        data-ocid="dashboard-error"
      >
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p className="font-mono text-sm text-destructive">
          System Error: {error}
        </p>
      </div>
    );
  }

  if (isLoading && !snapshot) {
    return <DashboardSkeleton />;
  }

  if (!snapshot) {
    return (
      <div
        className="flex h-full flex-col items-center justify-center gap-3"
        data-ocid="dashboard-empty"
      >
        <Activity className="h-8 w-8 text-muted-foreground pulse-glow" />
        <p className="font-mono text-sm text-muted-foreground">
          Connecting to traffic intelligence system…
        </p>
      </div>
    );
  }

  const { segments, activeAnomalies, weather, systemHealth } = snapshot;

  const totalVehicles = segments.reduce(
    (s, seg) => s + Number(seg.vehicleCount),
    0,
  );
  const avgCongestion =
    segments.length > 0
      ? Math.round(
          segments.reduce((s, seg) => s + Number(seg.congestionPct), 0) /
            segments.length,
        )
      : 0;
  const avgWait =
    segments.length > 0
      ? Math.round(
          segments.reduce((s, seg) => s + Number(seg.waitTimeSeconds), 0) /
            segments.length,
        )
      : 0;
  const healthPct = Number(systemHealth);
  const activeCount = activeAnomalies.filter((a) => a.isActive).length;

  const segById: Record<string, TrafficSegment> = Object.fromEntries(
    segments.map((s) => [s.id, s]),
  );

  return (
    <div className="space-y-4 p-5" data-ocid="dashboard-page">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground tracking-tight">
            Traffic Intelligence Dashboard
          </h1>
          <p className="font-mono text-[9px] text-muted-foreground mt-0.5">
            {lastUpdated
              ? `Last sync: ${lastUpdated.toLocaleTimeString()} · Auto-refresh every 5s`
              : "Connecting to simulation…"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {snapshot.activeEmergencies.length > 0 && (
            <span className="flex items-center gap-1.5 rounded border border-destructive/40 bg-destructive/10 px-2.5 py-1.5 font-mono text-[9px] text-destructive glow-red pulse-glow">
              <Zap className="h-3 w-3" />
              {snapshot.activeEmergencies.length} EMERGENCY
            </span>
          )}
          {activeCount > 0 && (
            <span className="flex items-center gap-1.5 rounded border border-accent/40 bg-accent/10 px-2.5 py-1.5 font-mono text-[9px] text-accent glow-amber">
              <AlertTriangle className="h-3 w-3" />
              {activeCount} ALERTS
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded border border-primary/30 bg-primary/10 px-2.5 py-1.5 font-mono text-[9px] text-primary">
            <Activity className="h-3 w-3 pulse-glow" />
            LIVE
          </span>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          title="Avg Congestion"
          value={`${avgCongestion}%`}
          subtitle={
            avgCongestion >= 70
              ? "High traffic density"
              : avgCongestion >= 30
                ? "Moderate traffic"
                : "Flow nominal"
          }
          trend={
            avgCongestion >= 70
              ? "up"
              : avgCongestion <= 30
                ? "down"
                : "neutral"
          }
          icon={
            avgCongestion >= 70 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )
          }
          colorClass={congestionTextClass(avgCongestion)}
          data-ocid="kpi-congestion"
        />
        <MetricCard
          title="Total Vehicles"
          value={totalVehicles.toLocaleString()}
          subtitle={`across ${segments.length} segments`}
          icon={<Car className="h-4 w-4 text-primary" />}
          data-ocid="kpi-vehicles"
        />
        <MetricCard
          title="Avg Wait Time"
          value={`${avgWait}s`}
          subtitle="per intersection"
          trend={avgWait >= 90 ? "up" : "down"}
          icon={<Clock className="h-4 w-4" />}
          colorClass={avgWait >= 90 ? "text-destructive" : "text-primary"}
          data-ocid="kpi-wait"
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
          data-ocid="kpi-health"
        />
      </div>

      {/* ── Map + Anomaly Feed ── */}
      <div className="grid grid-cols-12 gap-4">
        {/* Traffic Map */}
        <Panel
          title="Live Traffic Map"
          icon={<MapPin className="h-3.5 w-3.5" />}
          className="col-span-12 lg:col-span-8 scan-line-container glow-cyan"
          data-ocid="traffic-map"
        >
          <div className="h-64 lg:h-72">
            <TrafficMap segments={segments} />
          </div>
          {/* Map legend */}
          <div className="mt-3 flex flex-wrap items-center gap-5">
            {[
              { color: "#ef4444", label: "High >70%" },
              { color: "#f59e0b", label: "Medium 30–70%" },
              { color: "#22d3ee", label: "Low <30%" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-4 rounded-full"
                  style={{ background: color }}
                />
                <span className="font-mono text-[9px] text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Anomaly Alert Feed */}
        <Panel
          title="Anomaly Alerts"
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
          badge={
            activeCount > 0 ? (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 font-mono text-[9px] font-bold text-destructive-foreground pulse-glow">
                {activeCount}
              </span>
            ) : null
          }
          className="col-span-12 lg:col-span-4"
          data-ocid="anomaly-panel"
        >
          <AnomalyFeed anomalies={activeAnomalies} segById={segById} />
        </Panel>
      </div>

      {/* ── Segment Bars + Weather + Ticker ── */}
      <div className="grid grid-cols-12 gap-4">
        {/* Segment Congestion Bars */}
        <Panel
          title="Segment Congestion"
          icon={<Activity className="h-3.5 w-3.5" />}
          className="col-span-12 md:col-span-4"
          data-ocid="segment-bars"
        >
          <SegmentBars segments={segments} />
          {segments.length > 0 && (
            <div className="mt-4 border-t border-border pt-3">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                By District
              </p>
              <DistrictChart segments={segments} />
            </div>
          )}
        </Panel>

        {/* Weather Intelligence */}
        <Panel
          title="Weather Intelligence"
          icon={<CloudRain className="h-3.5 w-3.5" />}
          className="col-span-12 md:col-span-4"
          data-ocid="weather-panel"
        >
          <WeatherPanel weather={weather} />
        </Panel>

        {/* Anomaly Timeline Ticker */}
        <Panel
          title="Event Timeline"
          icon={<Clock className="h-3.5 w-3.5" />}
          className="col-span-12 md:col-span-4"
          data-ocid="event-timeline"
        >
          <AnomalyTicker anomalies={activeAnomalies} />
        </Panel>
      </div>

      {/* ── Segment Detail Table ── */}
      {segments.length > 0 && (
        <Panel
          title="Segment Detail"
          icon={<Car className="h-3.5 w-3.5" />}
          data-ocid="segment-table"
        >
          <SegmentTable segments={segments} />
        </Panel>
      )}
    </div>
  );
}
