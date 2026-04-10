import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import { IncidentStatus } from "@/types/traffic";
import type { Incident } from "@/types/traffic";
import {
  AlertTriangle,
  Cat,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  Send,
  ShieldAlert,
  Siren,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ── Constants ────────────────────────────────────────────────────────────────

const INCIDENT_TYPES = [
  "Accident",
  "Pedestrian",
  "Animal",
  "Obstacle",
  "Breakdown",
  "Emergency",
] as const;

type IncidentTypeKey = (typeof INCIDENT_TYPES)[number];

const TYPE_META: Record<
  IncidentTypeKey,
  { icon: React.ReactNode; color: string }
> = {
  Accident: {
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    color: "text-destructive",
  },
  Pedestrian: {
    icon: <User className="h-3.5 w-3.5" />,
    color: "text-accent",
  },
  Animal: {
    icon: <Cat className="h-3.5 w-3.5" />,
    color: "text-accent",
  },
  Obstacle: {
    icon: <ShieldAlert className="h-3.5 w-3.5" />,
    color: "text-accent",
  },
  Breakdown: {
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    color: "text-muted-foreground",
  },
  Emergency: {
    icon: <Siren className="h-3.5 w-3.5" />,
    color: "text-destructive",
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTs(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type ScoreTier = {
  label: string;
  color: string;
  bg: string;
  border: string;
  barColor: string;
};

function getScoreTier(score: number): ScoreTier {
  if (score > 80)
    return {
      label: "Confirmed",
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/30",
      barColor: "bg-primary",
    };
  if (score >= 60)
    return {
      label: "Likely",
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/30",
      barColor: "bg-primary",
    };
  if (score >= 30)
    return {
      label: "Plausible",
      color: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/30",
      barColor: "bg-accent",
    };
  return {
    label: "Insufficient",
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    barColor: "bg-destructive",
  };
}

function getTypeIcon(type: string): React.ReactNode {
  const meta = TYPE_META[type as IncidentTypeKey];
  return meta ? (
    <span className={meta.color}>{meta.icon}</span>
  ) : (
    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  colorClass,
  ocid,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  colorClass?: string;
  ocid: string;
}) {
  return (
    <Card
      className="border-border bg-card glow-cyan"
      data-ocid={`stat-${ocid}`}
    >
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p
            className={cn(
              "font-mono text-xl font-bold tabular-nums",
              colorClass ?? "text-foreground",
            )}
          >
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ValidationScorePanel({ incident }: { incident: Incident }) {
  const score = Number(incident.validationScore);
  const tier = getScoreTier(score);

  const breakdown = [
    {
      label: "Location Consistency",
      pct: Math.min(100, score + Math.round(Math.sin(score) * 12)),
    },
    {
      label: "Timing Pattern",
      pct: Math.min(100, score + Math.round(Math.cos(score * 0.5) * 10)),
    },
    {
      label: "Sensor Corroboration",
      pct: Math.min(100, Math.max(0, score - 5 + Math.round(score * 0.1))),
    },
    {
      label: "Reporter Confidence",
      pct: Math.min(100, score + Math.round(score * 0.05)),
    },
  ];

  return (
    <div
      className={cn(
        "mt-4 rounded-lg border p-4 transition-smooth",
        tier.bg,
        tier.border,
      )}
      data-ocid="validation-score-panel"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          AI Validation Result
        </span>
        <div
          className={cn("flex items-center gap-2 rounded px-2 py-0.5", tier.bg)}
        >
          <span
            className={cn(
              "font-mono text-2xl font-black tabular-nums",
              tier.color,
            )}
          >
            {score}
          </span>
          <div>
            <p
              className={cn(
                "font-mono text-xs font-bold leading-none",
                tier.color,
              )}
            >
              {tier.label}
            </p>
            <p className="font-mono text-[9px] text-muted-foreground">/ 100</p>
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            tier.barColor,
          )}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Score breakdown */}
      <div className="space-y-2">
        {breakdown.map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="w-36 shrink-0 font-mono text-[10px] text-muted-foreground">
              {b.label}
            </span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full",
                  tier.barColor,
                  "opacity-70",
                )}
                style={{ width: `${b.pct}%` }}
              />
            </div>
            <span
              className={cn(
                "w-8 text-right font-mono text-[10px] tabular-nums",
                tier.color,
              )}
            >
              {b.pct}
            </span>
          </div>
        ))}
      </div>

      {/* Reasoning text */}
      {incident.reporterNote && (
        <div className="mt-3 border-t border-border/40 pt-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Validation Reasoning
          </p>
          <p className="mt-1 font-mono text-xs leading-relaxed text-foreground">
            {score > 80
              ? `Report confirmed: ${incident.reporterNote} — All sensor signals consistent with reported incident. Auto-validated.`
              : score >= 60
                ? `Likely valid: ${incident.reporterNote} — Sensor data partially corroborates report. Flagged for priority review.`
                : score >= 30
                  ? `Plausible report: ${incident.reporterNote} — Insufficient corroborating signals. Queued for manual verification.`
                  : `Insufficient evidence: ${incident.reporterNote} — No corroborating sensor data found. Report auto-rejected.`}
          </p>
        </div>
      )}

      {/* Tier scale */}
      <div className="mt-3 flex gap-1 border-t border-border/40 pt-3">
        {[
          {
            range: "<30",
            label: "Insufficient",
            c: "bg-destructive/20 text-destructive",
          },
          { range: "30–60", label: "Plausible", c: "bg-accent/20 text-accent" },
          {
            range: "60–80",
            label: "Likely",
            c: "bg-emerald-400/20 text-emerald-400",
          },
          { range: ">80", label: "Confirmed", c: "bg-primary/20 text-primary" },
        ].map((t) => (
          <div
            key={t.range}
            className={cn(
              "flex flex-1 flex-col items-center rounded px-1 py-1.5",
              t.c,
              score > 80 && t.range === ">80" ? "ring-1 ring-primary" : "",
              score >= 60 && score <= 80 && t.range === "60–80"
                ? "ring-1 ring-emerald-400"
                : "",
              score >= 30 && score < 60 && t.range === "30–60"
                ? "ring-1 ring-accent"
                : "",
              score < 30 && t.range === "<30" ? "ring-1 ring-destructive" : "",
            )}
          >
            <span className="font-mono text-[9px] font-bold">{t.range}</span>
            <span className="font-mono text-[8px] opacity-80">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusTimeline({ incident }: { incident: Incident }) {
  type TimelineStep = {
    status: string;
    ts: bigint;
    icon: React.ReactNode;
    active: boolean;
    desc: string;
  };

  const steps: TimelineStep[] = [
    {
      status: "Submitted",
      ts: incident.reportedAt,
      icon: <Send className="h-3 w-3" />,
      active: true,
      desc: "Report received by the AI validation pipeline.",
    },
    {
      status: "AI Processing",
      ts: BigInt(Number(incident.reportedAt) + 500_000_000),
      icon: <TrendingUp className="h-3 w-3" />,
      active: true,
      desc: `Validation score computed: ${Number(incident.validationScore)}/100.`,
    },
    {
      status:
        incident.status === IncidentStatus.Validated
          ? "Validated"
          : incident.status === IncidentStatus.Rejected
            ? "Rejected"
            : incident.status === IncidentStatus.Resolved
              ? "Validated"
              : "Pending Review",
      ts:
        incident.validatedAt ??
        BigInt(Number(incident.reportedAt) + 1_500_000_000),
      icon:
        incident.status === IncidentStatus.Rejected ? (
          <XCircle className="h-3 w-3" />
        ) : incident.status === IncidentStatus.Pending ? (
          <Clock className="h-3 w-3" />
        ) : (
          <CheckCircle2 className="h-3 w-3" />
        ),
      active: incident.status !== IncidentStatus.Pending,
      desc:
        incident.status === IncidentStatus.Validated
          ? "Report verified and integrated into traffic AI decision pipeline."
          : incident.status === IncidentStatus.Rejected
            ? "Insufficient corroborating evidence. Report auto-rejected."
            : incident.status === IncidentStatus.Resolved
              ? "Incident confirmed and marked as resolved."
              : "Awaiting additional sensor data or manual reviewer.",
    },
    ...(incident.status === IncidentStatus.Resolved
      ? [
          {
            status: "Resolved",
            ts: BigInt(
              Number(incident.validatedAt ?? incident.reportedAt) +
                3_000_000_000,
            ),
            icon: <CheckCircle2 className="h-3 w-3" />,
            active: true,
            desc: "Incident cleared. Traffic conditions returned to normal.",
          },
        ]
      : []),
  ];

  return (
    <ul className="mt-1 space-y-1 pl-1" data-ocid="incident-timeline">
      {steps.map((step, idx) => (
        <li key={step.status} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-smooth",
                step.active
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {step.icon}
            </div>
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "mt-0.5 w-px flex-1 transition-smooth",
                  step.active ? "bg-primary/30" : "bg-border",
                )}
                style={{ minHeight: "16px" }}
              />
            )}
          </div>
          <div className="pb-2 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-mono text-xs font-semibold",
                  step.active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.status}
              </span>
              {step.active && (
                <span className="font-mono text-[9px] text-muted-foreground">
                  {formatTs(step.ts)}
                </span>
              )}
            </div>
            <p className="mt-0.5 font-mono text-[10px] leading-relaxed text-muted-foreground">
              {step.desc}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function IncidentRow({
  incident,
  segmentName,
}: {
  incident: Incident;
  segmentName: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const score = Number(incident.validationScore);
  const tier = getScoreTier(score);

  return (
    <>
      <tr
        className={cn(
          "border-b border-border/40 transition-colors hover:bg-muted/20",
          expanded && "bg-muted/10",
        )}
        data-ocid={`incident-row-${incident.id}`}
      >
        <td className="py-2.5 pr-3 pl-4">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center justify-center rounded p-0.5 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            aria-label={
              expanded ? "Collapse incident details" : "Expand incident details"
            }
          >
            {expanded ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        </td>
        <td className="py-2.5 pr-4">
          <span className="flex items-center gap-1.5 font-mono text-xs text-foreground">
            {getTypeIcon(incident.incidentType)}
            {incident.incidentType}
          </span>
        </td>
        <td className="py-2.5 pr-4 font-mono text-[10px] text-foreground">
          {segmentName || incident.segmentId}
        </td>
        <td className="max-w-[180px] py-2.5 pr-4">
          <p className="line-clamp-1 font-mono text-[10px] text-muted-foreground">
            {incident.reporterNote || "—"}
          </p>
        </td>
        <td className="whitespace-nowrap py-2.5 pr-4 font-mono text-[10px] text-muted-foreground">
          {formatDate(incident.reportedAt)}
        </td>
        <td className="py-2.5 pr-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", tier.barColor)}
                style={{ width: `${score}%` }}
              />
            </div>
            <span
              className={cn(
                "w-6 font-mono text-[10px] font-bold tabular-nums",
                tier.color,
              )}
            >
              {score}
            </span>
            <span
              className={cn(
                "hidden font-mono text-[9px] sm:inline",
                tier.color,
              )}
            >
              {tier.label}
            </span>
          </div>
        </td>
        <td className="py-2.5">
          <StatusBadge status={incident.status} />
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-border/40 bg-muted/5">
          <td colSpan={7} className="px-8 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Status Timeline
                </p>
                <StatusTimeline incident={incident} />
              </div>
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Validation Details
                </p>
                <div
                  className={cn("rounded-lg border p-3", tier.bg, tier.border)}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={cn(
                        "font-mono text-2xl font-black tabular-nums",
                        tier.color,
                      )}
                    >
                      {score}
                      <span className="ml-1 text-sm font-normal text-muted-foreground">
                        / 100
                      </span>
                    </span>
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 font-mono text-xs font-bold",
                        tier.bg,
                        tier.color,
                      )}
                    >
                      {tier.label}
                    </span>
                  </div>
                  <Progress value={score} className="h-1.5 mb-3" />
                  <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
                    {score > 80
                      ? "All sensor signals confirm this report. Automatically validated and integrated into the decision pipeline."
                      : score >= 60
                        ? "Multiple corroborating signals found. Flagged as likely valid, pending final review."
                        : score >= 30
                          ? "Partial signal match. Insufficient for auto-validation — queued for manual review."
                          : "No corroborating sensor data. Auto-rejected from the AI pipeline."}
                  </p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface FormErrors {
  segmentId?: string;
  incidentType?: string;
  description?: string;
}

export function Incidents() {
  const { actor, snapshot } = useSimulationStore();
  const segments = snapshot?.segments ?? [];

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loadingIncidents, setLoadingIncidents] = useState(false);

  // Form state
  const [segmentId, setSegmentId] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedIncident, setSubmittedIncident] = useState<Incident | null>(
    null,
  );

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
      /* silent on poll failure */
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

  function validateForm(): boolean {
    const errors: FormErrors = {};
    if (!segmentId) errors.segmentId = "Please select a road segment.";
    if (!incidentType) errors.incidentType = "Please select an incident type.";
    if (description.trim().length < 10)
      errors.description = "Description must be at least 10 characters.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    if (!actor) {
      setFormErrors({ segmentId: "Backend not connected." });
      return;
    }

    setSubmitting(true);
    setSubmittedIncident(null);
    try {
      const result = await reportIncident(
        actor,
        segmentId,
        incidentType,
        description.trim(),
      );
      setSubmittedIncident(result);
      const score = Number(result.validationScore);
      const tier = getScoreTier(score);
      toast.success("Incident report submitted", {
        description: `${incidentType} on ${segmentId} — Score: ${score}/100 (${tier.label})`,
      });
      setSegmentId("");
      setIncidentType("");
      setDescription("");
      setFormErrors({});
      await fetchIncidents();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      toast.error("Failed to report incident", { description: msg });
    } finally {
      setSubmitting(false);
    }
  }

  // Stats
  const total = incidents.length;
  const pendingCount = incidents.filter(
    (i) => i.status === IncidentStatus.Pending,
  ).length;
  const validatedCount = incidents.filter(
    (i) => i.status === IncidentStatus.Validated,
  ).length;
  const resolvedCount = incidents.filter(
    (i) => i.status === IncidentStatus.Resolved,
  ).length;

  // Segment name lookup
  const segmentMap = new Map(
    segments.map((s) => [s.id, `${s.name} — ${s.district}`]),
  );

  return (
    <div className="space-y-6 p-6" data-ocid="incidents-page">
      {/* Page header */}
      <div className="border-b border-border pb-4">
        <h1 className="font-display text-xl font-bold text-foreground">
          Human-in-the-Loop Incident Reporting
        </h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          Crowd-sourced incident validation integrated into the AI decision
          pipeline
        </p>
      </div>

      {/* Stats header */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Reported"
          value={total}
          icon={<FileText className="h-4 w-4 text-primary" />}
          ocid="total"
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          icon={<Clock className="h-4 w-4 text-accent" />}
          colorClass={
            pendingCount > 0 ? "text-accent" : "text-muted-foreground"
          }
          ocid="pending"
        />
        <StatCard
          label="Validated"
          value={validatedCount}
          icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
          colorClass="text-primary"
          ocid="validated"
        />
        <StatCard
          label="Resolved"
          value={resolvedCount}
          icon={<CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
          colorClass="text-muted-foreground"
          ocid="resolved"
        />
      </div>

      {/* Report form + result */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Form */}
        <Card className="border-border bg-card" data-ocid="report-form-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
              <Send className="h-4 w-4 text-primary" />
              Submit Incident Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Segment */}
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Road Segment <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={segmentId}
                  onValueChange={(v) => {
                    setSegmentId(v);
                    setFormErrors((prev) => ({
                      ...prev,
                      segmentId: undefined,
                    }));
                  }}
                  data-ocid="select-segment"
                >
                  <SelectTrigger
                    className={cn(
                      "border-input bg-background font-mono text-xs transition-smooth focus:ring-1 focus:ring-primary",
                      formErrors.segmentId && "border-destructive",
                    )}
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
                {formErrors.segmentId && (
                  <p
                    className="font-mono text-[10px] text-destructive"
                    data-ocid="err-segment"
                  >
                    {formErrors.segmentId}
                  </p>
                )}
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Incident Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={incidentType}
                  onValueChange={(v) => {
                    setIncidentType(v);
                    setFormErrors((prev) => ({
                      ...prev,
                      incidentType: undefined,
                    }));
                  }}
                  data-ocid="select-incident-type"
                >
                  <SelectTrigger
                    className={cn(
                      "border-input bg-background font-mono text-xs transition-smooth focus:ring-1 focus:ring-primary",
                      formErrors.incidentType && "border-destructive",
                    )}
                    data-ocid="select-type-trigger"
                  >
                    <SelectValue placeholder="Select incident type…" />
                  </SelectTrigger>
                  <SelectContent>
                    {INCIDENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        <span className="flex items-center gap-2">
                          {TYPE_META[t].icon}
                          {t}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.incidentType && (
                  <p
                    className="font-mono text-[10px] text-destructive"
                    data-ocid="err-type"
                  >
                    {formErrors.incidentType}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (e.target.value.trim().length >= 10) {
                      setFormErrors((prev) => ({
                        ...prev,
                        description: undefined,
                      }));
                    }
                  }}
                  placeholder="Describe what you observed (min. 10 characters)…"
                  className={cn(
                    "min-h-[90px] resize-none border-input bg-background font-mono text-xs transition-smooth focus:ring-1 focus:ring-primary",
                    formErrors.description && "border-destructive",
                  )}
                  data-ocid="input-description"
                />
                <div className="flex items-center justify-between">
                  {formErrors.description ? (
                    <p
                      className="font-mono text-[10px] text-destructive"
                      data-ocid="err-desc"
                    >
                      {formErrors.description}
                    </p>
                  ) : (
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {description.trim().length} chars (min 10)
                    </span>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
                data-ocid="btn-submit-report"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Report Incident
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right: result or AI info */}
        <div className="space-y-4">
          {submittedIncident ? (
            <Card
              className="border-border bg-card"
              data-ocid="submission-result-card"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Submission Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-semibold text-foreground">
                      {submittedIncident.incidentType}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      Segment:{" "}
                      {segmentMap.get(submittedIncident.segmentId) ??
                        submittedIncident.segmentId}
                    </p>
                  </div>
                  <StatusBadge status={submittedIncident.status} />
                </div>
                <ValidationScorePanel incident={submittedIncident} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 w-full font-mono text-xs text-muted-foreground"
                  onClick={() => setSubmittedIncident(null)}
                >
                  Dismiss
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-widest text-primary">
                  <ShieldAlert className="h-4 w-4" />
                  AI Validation Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                  Each report is scored 0–100 based on{" "}
                  <span className="text-foreground">location consistency</span>,{" "}
                  <span className="text-foreground">timing patterns</span>,{" "}
                  <span className="text-foreground">sensor corroboration</span>,
                  and <span className="text-foreground">reporter history</span>.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      range: ">80",
                      label: "Confirmed",
                      c: "bg-primary/15 text-primary border-primary/20",
                    },
                    {
                      range: "60–80",
                      label: "Likely",
                      c: "bg-emerald-400/15 text-emerald-400 border-emerald-400/20",
                    },
                    {
                      range: "30–60",
                      label: "Plausible",
                      c: "bg-accent/15 text-accent border-accent/20",
                    },
                    {
                      range: "<30",
                      label: "Insufficient",
                      c: "bg-destructive/15 text-destructive border-destructive/20",
                    },
                  ].map((t) => (
                    <div
                      key={t.range}
                      className={cn(
                        "flex items-center justify-between rounded border px-2 py-1.5",
                        t.c,
                      )}
                    >
                      <span className="font-mono text-xs font-bold">
                        {t.range}
                      </span>
                      <span className="font-mono text-[10px] opacity-80">
                        {t.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick stats */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
                Pipeline Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  label: "Confirmed (>80)",
                  count: incidents.filter((i) => Number(i.validationScore) > 80)
                    .length,
                  color: "text-primary",
                },
                {
                  label: "Likely (60–80)",
                  count: incidents.filter(
                    (i) =>
                      Number(i.validationScore) >= 60 &&
                      Number(i.validationScore) <= 80,
                  ).length,
                  color: "text-emerald-400",
                },
                {
                  label: "Plausible (30–60)",
                  count: incidents.filter(
                    (i) =>
                      Number(i.validationScore) >= 30 &&
                      Number(i.validationScore) < 60,
                  ).length,
                  color: "text-accent",
                },
                {
                  label: "Insufficient (<30)",
                  count: incidents.filter((i) => Number(i.validationScore) < 30)
                    .length,
                  color: "text-destructive",
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
      </div>

      {/* Incidents list */}
      <Card className="border-border bg-card" data-ocid="incidents-table-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
              Incident Reports
            </CardTitle>
            <span className="font-mono text-[10px] text-muted-foreground">
              {loadingIncidents ? "Refreshing…" : "Auto-refresh every 10s"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loadingIncidents && incidents.length === 0 ? (
            <div className="space-y-2 p-4">
              {(["a", "b", "c"] as const).map((k) => (
                <Skeleton key={k} className="h-10 rounded" />
              ))}
            </div>
          ) : incidents.length === 0 ? (
            <div
              className="flex flex-col items-center gap-3 py-12"
              data-ocid="incidents-empty-state"
            >
              <FileText className="h-10 w-10 text-muted-foreground/30" />
              <p className="font-mono text-xs text-muted-foreground">
                No incidents reported yet — use the form above to submit one.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left" data-ocid="incidents-table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="w-6 pb-2 pl-4" />
                    {[
                      "Type",
                      "Segment",
                      "Description",
                      "Reported At",
                      "Val. Score",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground first:pl-4"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((inc) => (
                    <IncidentRow
                      key={inc.id}
                      incident={inc}
                      segmentName={segmentMap.get(inc.segmentId) ?? ""}
                    />
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
