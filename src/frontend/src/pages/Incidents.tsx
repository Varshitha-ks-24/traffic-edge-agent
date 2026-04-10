import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useSimulationStore } from "@/lib/simulationStore";
import { reportIncident } from "@/lib/trafficApi";
import { cn } from "@/lib/utils";
import type { Incident } from "@/types/traffic";
import { IncidentStatus } from "@/types/traffic";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  Loader2,
  Send,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const INCIDENT_TYPES = [
  "Roadblock",
  "Construction",
  "Event",
  "Flood",
  "Debris",
  "Signal Failure",
  "Other",
];

const TYPE_ICON: Record<string, React.ReactNode> = {
  Roadblock: <ShieldAlert className="h-3.5 w-3.5" />,
  Construction: <AlertTriangle className="h-3.5 w-3.5" />,
  Event: <Users className="h-3.5 w-3.5" />,
  Flood: <AlertTriangle className="h-3.5 w-3.5" />,
  Debris: <AlertTriangle className="h-3.5 w-3.5" />,
  "Signal Failure": <AlertTriangle className="h-3.5 w-3.5" />,
  Other: <FileText className="h-3.5 w-3.5" />,
};

function formatTs(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function ValidationBar({ score }: { score: number }) {
  const barColor =
    score >= 70 ? "bg-primary" : score >= 40 ? "bg-accent" : "bg-destructive";
  const textColor =
    score >= 70
      ? "text-primary"
      : score >= 40
        ? "text-accent"
        : "text-destructive";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-smooth", barColor)}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
      <span
        className={cn(
          "font-mono text-[10px] font-bold tabular-nums",
          textColor,
        )}
      >
        {score}
      </span>
    </div>
  );
}

interface ChartEntry {
  type: string;
  count: number;
}

function buildChartData(incidents: Incident[]): ChartEntry[] {
  const counts: Record<string, number> = {};
  for (const inc of incidents) {
    counts[inc.incidentType] = (counts[inc.incidentType] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

function IncidentTimeline({ incidents }: { incidents: Incident[] }) {
  const validated = incidents
    .filter((i) => i.status === IncidentStatus.Validated)
    .sort((a, b) => Number(b.reportedAt) - Number(a.reportedAt))
    .slice(0, 5);

  if (validated.length === 0) {
    return (
      <p className="py-4 text-center font-mono text-xs text-muted-foreground">
        No validated incidents yet
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {validated.map((inc, idx) => (
        <li key={inc.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            {idx < validated.length - 1 && (
              <div className="mt-1 w-px flex-1 bg-border" />
            )}
          </div>
          <div className="pb-3">
            <p className="font-mono text-xs font-semibold text-foreground">
              {inc.incidentType}{" "}
              <span className="font-normal text-muted-foreground">
                — Segment {inc.segmentId}
              </span>
            </p>
            <p className="mt-0.5 line-clamp-1 font-mono text-[10px] text-muted-foreground">
              {inc.reporterNote || "No description"}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground">
                {formatTs(inc.reportedAt)}
              </span>
              <ValidationBar score={Number(inc.validationScore)} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Incidents() {
  const { actor, snapshot } = useSimulationStore();
  const segments = snapshot?.segments ?? [];

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loadingIncidents, setLoadingIncidents] = useState(false);

  const [segmentId, setSegmentId] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchIncidents = useCallback(async () => {
    if (!actor) return;
    setLoadingIncidents(true);
    try {
      const data = await actor.getIncidents();
      setIncidents(
        data
          .slice()
          .sort((a, b) => Number(b.reportedAt) - Number(a.reportedAt)),
      );
    } catch {
      /* silent — no crash on poll failure */
    } finally {
      setLoadingIncidents(false);
    }
  }, [actor]);

  useEffect(() => {
    fetchIncidents();
    intervalRef.current = setInterval(fetchIncidents, 10_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchIncidents]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!segmentId) return setFormError("Please select a segment.");
    if (!incidentType) return setFormError("Please select an incident type.");
    if (description.trim().length < 10)
      return setFormError("Description must be at least 10 characters.");
    if (!actor) return setFormError("Backend not connected.");

    setSubmitting(true);
    try {
      await reportIncident(actor, segmentId, incidentType, description.trim());
      toast.success("Incident reported", {
        description: `${incidentType} on segment ${segmentId} submitted for AI validation.`,
      });
      setSegmentId("");
      setIncidentType("");
      setDescription("");
      await fetchIncidents();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      toast.error("Failed to report incident", { description: msg });
    } finally {
      setSubmitting(false);
    }
  }

  const total = incidents.length;
  const validatedCount = incidents.filter(
    (i) => i.status === IncidentStatus.Validated,
  ).length;
  const pendingCount = incidents.filter(
    (i) => i.status === IncidentStatus.Pending,
  ).length;
  const avgScore =
    total === 0
      ? 0
      : Math.round(
          incidents.reduce((s, i) => s + Number(i.validationScore), 0) / total,
        );
  const validatedPct =
    total === 0 ? 0 : Math.round((validatedCount / total) * 100);

  const chartData = buildChartData(incidents);

  return (
    <div className="space-y-6 p-6" data-ocid="incidents-page">
      {/* Page header */}
      <div className="border-b border-border pb-4">
        <h1 className="font-display text-xl font-bold text-foreground">
          Human-in-the-Loop Incident Reporting
        </h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          Crowd-sourced incident validation and integration into the AI decision
          pipeline
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard
          title="Total Reports"
          value={total}
          icon={<FileText className="h-4 w-4 text-primary" />}
          data-ocid="metric-total"
        />
        <MetricCard
          title="Validated %"
          value={`${validatedPct}%`}
          trend="up"
          icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
          colorClass="text-primary"
          data-ocid="metric-validated-pct"
        />
        <MetricCard
          title="Avg Validation Score"
          value={avgScore}
          icon={<ShieldAlert className="h-4 w-4 text-accent" />}
          colorClass={
            avgScore >= 70
              ? "text-primary"
              : avgScore >= 40
                ? "text-accent"
                : "text-destructive"
          }
          data-ocid="metric-avg-score"
        />
        <MetricCard
          title="Pending Review"
          value={pendingCount}
          trend={pendingCount > 3 ? "up" : "neutral"}
          icon={<Clock className="h-4 w-4 text-accent" />}
          colorClass={
            pendingCount > 0 ? "text-accent" : "text-muted-foreground"
          }
          data-ocid="metric-pending"
        />
      </div>

      {/* Form + Explainer */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Report form */}
        <Card className="border-border bg-card" data-ocid="report-form-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
              <Send className="h-4 w-4 text-primary" />
              Submit Incident Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Segment
                </Label>
                <Select
                  value={segmentId}
                  onValueChange={setSegmentId}
                  data-ocid="select-segment"
                >
                  <SelectTrigger
                    className="border-input bg-background font-mono text-xs"
                    data-ocid="select-segment-trigger"
                  >
                    <SelectValue placeholder="Select road segment…" />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.length === 0 ? (
                      <SelectItem value="__loading" disabled>
                        Loading segments…
                      </SelectItem>
                    ) : (
                      segments.map((seg) => (
                        <SelectItem key={seg.id} value={seg.id}>
                          {seg.name} — {seg.district}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Incident Type
                </Label>
                <Select
                  value={incidentType}
                  onValueChange={setIncidentType}
                  data-ocid="select-incident-type"
                >
                  <SelectTrigger
                    className="border-input bg-background font-mono text-xs"
                    data-ocid="select-type-trigger"
                  >
                    <SelectValue placeholder="Select type…" />
                  </SelectTrigger>
                  <SelectContent>
                    {INCIDENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        <span className="flex items-center gap-2">
                          {TYPE_ICON[t]}
                          {t}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Description
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you observed (min. 10 characters)…"
                  className="min-h-[80px] resize-none border-input bg-background font-mono text-xs"
                  data-ocid="input-description"
                />
                <span className="font-mono text-[10px] text-muted-foreground">
                  {description.trim().length} / 10 min chars
                </span>
              </div>

              {formError && (
                <p
                  className="font-mono text-[10px] text-destructive"
                  data-ocid="form-error"
                >
                  {formError}
                </p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
                data-ocid="btn-submit-report"
              >
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right column: explainer + timeline */}
        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-widest text-primary">
                <Info className="h-4 w-4" />
                AI Validation Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                AI validation score is calculated based on:{" "}
                <span className="text-foreground">location consistency</span>,{" "}
                <span className="text-foreground">timing patterns</span>,{" "}
                <span className="text-foreground">
                  corroboration with sensor data
                </span>
                , and <span className="text-foreground">reporter history</span>.
                Reports scoring{" "}
                <span className="font-bold text-primary">&gt;70</span> are
                auto-validated.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  {
                    label: ">70",
                    tier: "bg-primary/15 text-primary border-primary/20",
                    desc: "Auto-Validated",
                  },
                  {
                    label: "40–70",
                    tier: "bg-accent/15 text-accent border-accent/20",
                    desc: "Manual Review",
                  },
                  {
                    label: "<40",
                    tier: "bg-destructive/15 text-destructive border-destructive/20",
                    desc: "Auto-Rejected",
                  },
                ].map((t) => (
                  <div
                    key={t.label}
                    className={cn(
                      "flex flex-col items-center rounded border p-2",
                      t.tier,
                    )}
                  >
                    <span className="font-mono text-sm font-bold">
                      {t.label}
                    </span>
                    <span className="mt-0.5 font-mono text-[9px] opacity-80">
                      {t.desc}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
                Recent Validated Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IncidentTimeline incidents={incidents} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
              Incidents by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex h-40 items-center justify-center">
                <span className="font-mono text-xs text-muted-foreground">
                  No incident data yet
                </span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="type"
                    tick={{
                      fontSize: 9,
                      fontFamily: "JetBrains Mono",
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 9,
                      fontFamily: "JetBrains Mono",
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontFamily: "JetBrains Mono",
                      color: "hsl(var(--foreground))",
                    }}
                    cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
              Pipeline Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                label: "Auto-Validated (>70)",
                count: incidents.filter(
                  (i) =>
                    Number(i.validationScore) > 70 &&
                    i.status === IncidentStatus.Validated,
                ).length,
                color: "text-primary",
              },
              {
                label: "Under Review (40–70)",
                count: incidents.filter(
                  (i) =>
                    Number(i.validationScore) >= 40 &&
                    Number(i.validationScore) <= 70,
                ).length,
                color: "text-accent",
              },
              {
                label: "Auto-Rejected (<40)",
                count: incidents.filter(
                  (i) =>
                    Number(i.validationScore) < 40 &&
                    i.status === IncidentStatus.Rejected,
                ).length,
                color: "text-destructive",
              },
              {
                label: "Resolved",
                count: incidents.filter(
                  (i) => i.status === IncidentStatus.Resolved,
                ).length,
                color: "text-muted-foreground",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between"
              >
                <span className="font-mono text-[10px] text-muted-foreground">
                  {row.label}
                </span>
                <span
                  className={cn(
                    "font-mono text-sm font-bold tabular-nums",
                    row.color,
                  )}
                >
                  {row.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Incidents table */}
      <Card className="border-border bg-card" data-ocid="incidents-table-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
              Incident Reports
            </CardTitle>
            <span className="font-mono text-[10px] text-muted-foreground">
              Auto-refresh every 10s
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {loadingIncidents && incidents.length === 0 ? (
            <div className="space-y-2">
              {(["a", "b", "c"] as const).map((k) => (
                <Skeleton key={k} className="h-10 rounded" />
              ))}
            </div>
          ) : incidents.length === 0 ? (
            <div
              className="flex flex-col items-center gap-3 py-10"
              data-ocid="incidents-empty-state"
            >
              <FileText className="h-8 w-8 text-muted-foreground/40" />
              <p className="font-mono text-xs text-muted-foreground">
                No incidents reported yet — use the form above to submit one.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left" data-ocid="incidents-table">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "ID",
                      "Segment",
                      "Type",
                      "Description",
                      "Reported At",
                      "Val. Score",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((inc) => (
                    <tr
                      key={inc.id}
                      className="border-b border-border/40 transition-colors hover:bg-muted/20"
                      data-ocid={`incident-row-${inc.id}`}
                    >
                      <td className="py-2.5 pr-4 font-mono text-[10px] text-muted-foreground">
                        {inc.id.slice(0, 8)}…
                      </td>
                      <td className="py-2.5 pr-4 font-mono text-[10px] text-foreground">
                        {inc.segmentId}
                      </td>
                      <td className="py-2.5 pr-4">
                        <span className="flex items-center gap-1.5 font-mono text-xs text-foreground">
                          {TYPE_ICON[inc.incidentType] ?? (
                            <FileText className="h-3.5 w-3.5" />
                          )}
                          {inc.incidentType}
                        </span>
                      </td>
                      <td className="max-w-[200px] py-2.5 pr-4">
                        <p className="line-clamp-1 font-mono text-[10px] text-muted-foreground">
                          {inc.reporterNote || "—"}
                        </p>
                      </td>
                      <td className="whitespace-nowrap py-2.5 pr-4 font-mono text-[10px] text-muted-foreground">
                        {formatTs(inc.reportedAt)}
                      </td>
                      <td className="py-2.5 pr-4">
                        <ValidationBar score={Number(inc.validationScore)} />
                      </td>
                      <td className="py-2.5">
                        <StatusBadge status={inc.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
