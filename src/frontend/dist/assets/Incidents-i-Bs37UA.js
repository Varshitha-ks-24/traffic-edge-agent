import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, a as cn, u as useSimulationStore, I as IncidentStatus, F as FileText, B as Button, S as Skeleton, T as TriangleAlert } from "./index-B2saiLCY.js";
import { M as MetricCard } from "./MetricCard-Dc_yh-OV.js";
import { R as ResponsiveContainer, T as Tooltip, B as Bar, S as StatusBadge } from "./generateCategoricalChart-BlZ_UpE5.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, S as Select, d as SelectTrigger, e as SelectValue, f as SelectContent, g as SelectItem } from "./select-DV-QCRQR.js";
import { P as Primitive } from "./index-CP23uTC2.js";
import { f as reportIncident } from "./trafficApi-Cx6Z_Vgx.js";
import { u as ue } from "./index-CaOJaaq8.js";
import { a as CircleCheck, C as Clock } from "./clock-r8C7qKsq.js";
import { S as ShieldAlert } from "./shield-alert-2CpwHeZJ.js";
import { L as LoaderCircle } from "./loader-circle-CSSJnhgX.js";
import { B as BarChart } from "./BarChart-tvARipHJ.js";
import { C as CartesianGrid } from "./CartesianGrid-j6ZSpWe3.js";
import { X as XAxis, Y as YAxis } from "./YAxis-CqFXLIIE.js";
import "./chevron-up-Cp4dxTJd.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a = props.onMouseDown) == null ? void 0 : _a.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
const INCIDENT_TYPES = [
  "Roadblock",
  "Construction",
  "Event",
  "Flood",
  "Debris",
  "Signal Failure",
  "Other"
];
const TYPE_ICON = {
  Roadblock: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-3.5 w-3.5" }),
  Construction: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
  Event: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
  Flood: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
  Debris: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
  "Signal Failure": /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
  Other: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" })
};
function formatTs(ts) {
  const ms = Number(ts) / 1e6;
  const d = new Date(ms);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function ValidationBar({ score }) {
  const barColor = score >= 70 ? "bg-primary" : score >= 40 ? "bg-accent" : "bg-destructive";
  const textColor = score >= 70 ? "text-primary" : score >= 40 ? "text-accent" : "text-destructive";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-20 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn("h-full rounded-full transition-smooth", barColor),
        style: { width: `${Math.min(score, 100)}%` }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "font-mono text-[10px] font-bold tabular-nums",
          textColor
        ),
        children: score
      }
    )
  ] });
}
function buildChartData(incidents) {
  const counts = {};
  for (const inc of incidents) {
    counts[inc.incidentType] = (counts[inc.incidentType] ?? 0) + 1;
  }
  return Object.entries(counts).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);
}
function IncidentTimeline({ incidents }) {
  const validated = incidents.filter((i) => i.status === IncidentStatus.Validated).sort((a, b) => Number(b.reportedAt) - Number(a.reportedAt)).slice(0, 5);
  if (validated.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-4 text-center font-mono text-xs text-muted-foreground", children: "No validated incidents yet" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: validated.map((inc, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }) }),
      idx < validated.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 w-px flex-1 bg-border" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs font-semibold text-foreground", children: [
        inc.incidentType,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-normal text-muted-foreground", children: [
          "— Segment ",
          inc.segmentId
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 line-clamp-1 font-mono text-[10px] text-muted-foreground", children: inc.reporterNote || "No description" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: formatTs(inc.reportedAt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ValidationBar, { score: Number(inc.validationScore) })
      ] })
    ] })
  ] }, inc.id)) });
}
function Incidents() {
  const { actor, snapshot } = useSimulationStore();
  const segments = (snapshot == null ? void 0 : snapshot.segments) ?? [];
  const [incidents, setIncidents] = reactExports.useState([]);
  const [loadingIncidents, setLoadingIncidents] = reactExports.useState(false);
  const [segmentId, setSegmentId] = reactExports.useState("");
  const [incidentType, setIncidentType] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [formError, setFormError] = reactExports.useState(null);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const intervalRef = reactExports.useRef(null);
  const fetchIncidents = reactExports.useCallback(async () => {
    if (!actor) return;
    setLoadingIncidents(true);
    try {
      const data = await actor.getIncidents();
      setIncidents(
        data.slice().sort((a, b) => Number(b.reportedAt) - Number(a.reportedAt))
      );
    } catch {
    } finally {
      setLoadingIncidents(false);
    }
  }, [actor]);
  reactExports.useEffect(() => {
    fetchIncidents();
    intervalRef.current = setInterval(fetchIncidents, 1e4);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchIncidents]);
  async function handleSubmit(e) {
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
      ue.success("Incident reported", {
        description: `${incidentType} on segment ${segmentId} submitted for AI validation.`
      });
      setSegmentId("");
      setIncidentType("");
      setDescription("");
      await fetchIncidents();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      ue.error("Failed to report incident", { description: msg });
    } finally {
      setSubmitting(false);
    }
  }
  const total = incidents.length;
  const validatedCount = incidents.filter(
    (i) => i.status === IncidentStatus.Validated
  ).length;
  const pendingCount = incidents.filter(
    (i) => i.status === IncidentStatus.Pending
  ).length;
  const avgScore = total === 0 ? 0 : Math.round(
    incidents.reduce((s, i) => s + Number(i.validationScore), 0) / total
  );
  const validatedPct = total === 0 ? 0 : Math.round(validatedCount / total * 100);
  const chartData = buildChartData(incidents);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-6", "data-ocid": "incidents-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Human-in-the-Loop Incident Reporting" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-mono text-xs text-muted-foreground", children: "Crowd-sourced incident validation and integration into the AI decision pipeline" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Total Reports",
          value: total,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-primary" }),
          "data-ocid": "metric-total"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Validated %",
          value: `${validatedPct}%`,
          trend: "up",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-primary" }),
          colorClass: "text-primary",
          "data-ocid": "metric-validated-pct"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Avg Validation Score",
          value: avgScore,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4 text-accent" }),
          colorClass: avgScore >= 70 ? "text-primary" : avgScore >= 40 ? "text-accent" : "text-destructive",
          "data-ocid": "metric-avg-score"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Pending Review",
          value: pendingCount,
          trend: pendingCount > 3 ? "up" : "neutral",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-accent" }),
          colorClass: pendingCount > 0 ? "text-accent" : "text-muted-foreground",
          "data-ocid": "metric-pending"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "report-form-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-widest text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 text-primary" }),
          "Submit Incident Report"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Segment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: segmentId,
                onValueChange: setSegmentId,
                "data-ocid": "select-segment",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "border-input bg-background font-mono text-xs",
                      "data-ocid": "select-segment-trigger",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select road segment…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: segments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__loading", disabled: true, children: "Loading segments…" }) : segments.map((seg) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: seg.id, children: [
                    seg.name,
                    " — ",
                    seg.district
                  ] }, seg.id)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Incident Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: incidentType,
                onValueChange: setIncidentType,
                "data-ocid": "select-incident-type",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "border-input bg-background font-mono text-xs",
                      "data-ocid": "select-type-trigger",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select type…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: INCIDENT_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    TYPE_ICON[t],
                    t
                  ] }) }, t)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: description,
                onChange: (e) => setDescription(e.target.value),
                placeholder: "Describe what you observed (min. 10 characters)…",
                className: "min-h-[80px] resize-none border-input bg-background font-mono text-xs",
                "data-ocid": "input-description"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [
              description.trim().length,
              " / 10 min chars"
            ] })
          ] }),
          formError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-[10px] text-destructive",
              "data-ocid": "form-error",
              children: formError
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              disabled: submitting,
              className: "w-full",
              "data-ocid": "btn-submit-report",
              children: [
                submitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "mr-2 h-4 w-4" }),
                "Submit Report"
              ]
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/20 bg-primary/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-widest text-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4" }),
            "AI Validation Engine"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs leading-relaxed text-muted-foreground", children: [
              "AI validation score is calculated based on:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "location consistency" }),
              ",",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "timing patterns" }),
              ",",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "corroboration with sensor data" }),
              ", and ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "reporter history" }),
              ". Reports scoring",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-primary", children: ">70" }),
              " are auto-validated."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 pt-1", children: [
              {
                label: ">70",
                tier: "bg-primary/15 text-primary border-primary/20",
                desc: "Auto-Validated"
              },
              {
                label: "40–70",
                tier: "bg-accent/15 text-accent border-accent/20",
                desc: "Manual Review"
              },
              {
                label: "<40",
                tier: "bg-destructive/15 text-destructive border-destructive/20",
                desc: "Auto-Rejected"
              }
            ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "flex flex-col items-center rounded border p-2",
                  t.tier
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-bold", children: t.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 font-mono text-[9px] opacity-80", children: t.desc })
                ]
              },
              t.label
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-mono text-sm font-semibold uppercase tracking-widest text-foreground", children: "Recent Validated Incidents" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(IncidentTimeline, { incidents }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-mono text-sm font-semibold uppercase tracking-widest text-foreground", children: "Incidents by Type" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: chartData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-40 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: "No incident data yet" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 180, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          BarChart,
          {
            data: chartData,
            margin: { top: 4, right: 8, left: -16, bottom: 0 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CartesianGrid,
                {
                  strokeDasharray: "3 3",
                  stroke: "hsl(var(--border))",
                  vertical: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                XAxis,
                {
                  dataKey: "type",
                  tick: {
                    fontSize: 9,
                    fontFamily: "JetBrains Mono",
                    fill: "hsl(var(--muted-foreground))"
                  },
                  axisLine: false,
                  tickLine: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                YAxis,
                {
                  tick: {
                    fontSize: 9,
                    fontFamily: "JetBrains Mono",
                    fill: "hsl(var(--muted-foreground))"
                  },
                  axisLine: false,
                  tickLine: false,
                  allowDecimals: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  contentStyle: {
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontFamily: "JetBrains Mono",
                    color: "hsl(var(--foreground))"
                  },
                  cursor: { fill: "hsl(var(--muted) / 0.4)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Bar,
                {
                  dataKey: "count",
                  fill: "hsl(var(--primary))",
                  radius: [3, 3, 0, 0]
                }
              )
            ]
          }
        ) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-mono text-sm font-semibold uppercase tracking-widest text-foreground", children: "Pipeline Status" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: [
          {
            label: "Auto-Validated (>70)",
            count: incidents.filter(
              (i) => Number(i.validationScore) > 70 && i.status === IncidentStatus.Validated
            ).length,
            color: "text-primary"
          },
          {
            label: "Under Review (40–70)",
            count: incidents.filter(
              (i) => Number(i.validationScore) >= 40 && Number(i.validationScore) <= 70
            ).length,
            color: "text-accent"
          },
          {
            label: "Auto-Rejected (<40)",
            count: incidents.filter(
              (i) => Number(i.validationScore) < 40 && i.status === IncidentStatus.Rejected
            ).length,
            color: "text-destructive"
          },
          {
            label: "Resolved",
            count: incidents.filter(
              (i) => i.status === IncidentStatus.Resolved
            ).length,
            color: "text-muted-foreground"
          }
        ].map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: row.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "font-mono text-sm font-bold tabular-nums",
                    row.color
                  ),
                  children: row.count
                }
              )
            ]
          },
          row.label
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "incidents-table-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-mono text-sm font-semibold uppercase tracking-widest text-foreground", children: "Incident Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: "Auto-refresh every 10s" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: loadingIncidents && incidents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded" }, k)) }) : incidents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-3 py-10",
          "data-ocid": "incidents-empty-state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-8 w-8 text-muted-foreground/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No incidents reported yet — use the form above to submit one." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", "data-ocid": "incidents-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
          "ID",
          "Segment",
          "Type",
          "Description",
          "Reported At",
          "Val. Score",
          "Status"
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "pb-2 pr-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: incidents.map((inc) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border/40 transition-colors hover:bg-muted/20",
            "data-ocid": `incident-row-${inc.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-2.5 pr-4 font-mono text-[10px] text-muted-foreground", children: [
                inc.id.slice(0, 8),
                "…"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 pr-4 font-mono text-[10px] text-foreground", children: inc.segmentId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 font-mono text-xs text-foreground", children: [
                TYPE_ICON[inc.incidentType] ?? /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" }),
                inc.incidentType
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "max-w-[200px] py-2.5 pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-1 font-mono text-[10px] text-muted-foreground", children: inc.reporterNote || "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap py-2.5 pr-4 font-mono text-[10px] text-muted-foreground", children: formatTs(inc.reportedAt) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ValidationBar, { score: Number(inc.validationScore) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: inc.status }) })
            ]
          },
          inc.id
        )) })
      ] }) }) })
    ] })
  ] });
}
export {
  Incidents
};
