import { c as createLucideIcon, u as useSimulationStore, r as reactExports, d as AlertSeverity, j as jsxRuntimeExports, A as Activity, T as TriangleAlert, e as Siren, a as cn, S as Skeleton, B as Button, b as AnomalyType } from "./index-B2saiLCY.js";
import { M as MetricCard } from "./MetricCard-Dc_yh-OV.js";
import { S as StatusBadge, R as ResponsiveContainer, T as Tooltip, B as Bar, C as Cell } from "./generateCategoricalChart-BlZ_UpE5.js";
import { g as getAnomalies, r as resolveAnomaly } from "./trafficApi-Cx6Z_Vgx.js";
import { u as ue } from "./index-CaOJaaq8.js";
import { M as MapPin } from "./map-pin-CMkI_NuK.js";
import { E as Eye, C as Car } from "./eye-DeBSEf3w.js";
import { C as ChevronUp, a as ChevronDown } from "./chevron-up-Cp4dxTJd.js";
import { B as BarChart } from "./BarChart-tvARipHJ.js";
import { X as XAxis, Y as YAxis } from "./YAxis-CqFXLIIE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
];
const Package = createLucideIcon("package", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "11", cy: "4", r: "2", key: "vol9p0" }],
  ["circle", { cx: "18", cy: "8", r: "2", key: "17gozi" }],
  ["circle", { cx: "20", cy: "16", r: "2", key: "1v9bxh" }],
  [
    "path",
    {
      d: "M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z",
      key: "1ydw1z"
    }
  ]
];
const PawPrint = createLucideIcon("paw-print", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
      key: "cbrjhi"
    }
  ]
];
const Wrench = createLucideIcon("wrench", __iconNode);
const SEVERITY_BAR = {
  [AlertSeverity.Critical]: "bg-destructive",
  [AlertSeverity.High]: "bg-orange-500",
  [AlertSeverity.Medium]: "bg-accent",
  [AlertSeverity.Low]: "bg-primary"
};
const SEVERITY_ORDER = {
  [AlertSeverity.Critical]: 0,
  [AlertSeverity.High]: 1,
  [AlertSeverity.Medium]: 2,
  [AlertSeverity.Low]: 3
};
const TYPE_CHART_COLOR = {
  [AnomalyType.Accident]: "oklch(0.62 0.24 24)",
  [AnomalyType.EmergencyVehicle]: "oklch(0.62 0.24 24)",
  [AnomalyType.Pedestrian]: "oklch(0.72 0.23 55)",
  [AnomalyType.Animal]: "oklch(0.68 0.18 110)",
  [AnomalyType.Obstacle]: "oklch(0.62 0.25 195)",
  [AnomalyType.VehicleBreakdown]: "oklch(0.55 0.15 280)"
};
const TYPE_LABEL = {
  [AnomalyType.Pedestrian]: "Pedestrian",
  [AnomalyType.Animal]: "Animal",
  [AnomalyType.Obstacle]: "Obstacle",
  [AnomalyType.Accident]: "Accident",
  [AnomalyType.VehicleBreakdown]: "Breakdown",
  [AnomalyType.EmergencyVehicle]: "Emergency"
};
const SEVERITY_FILTERS = [
  "All",
  AlertSeverity.Critical,
  AlertSeverity.High,
  AlertSeverity.Medium,
  AlertSeverity.Low
];
const FILTER_LABEL = {
  All: "All",
  [AlertSeverity.Critical]: "Critical",
  [AlertSeverity.High]: "High",
  [AlertSeverity.Medium]: "Medium",
  [AlertSeverity.Low]: "Low"
};
const FILTER_ACTIVE_CLASS = {
  All: "bg-secondary text-foreground border-border",
  [AlertSeverity.Critical]: "bg-destructive/20 text-destructive border-destructive/40",
  [AlertSeverity.High]: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  [AlertSeverity.Medium]: "bg-accent/20 text-accent border-accent/40",
  [AlertSeverity.Low]: "bg-primary/20 text-primary border-primary/40"
};
function AnomalyTypeIcon({
  type,
  className
}) {
  const props = { className: cn("h-4 w-4", className) };
  switch (type) {
    case AnomalyType.Pedestrian:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(User, { ...props });
    case AnomalyType.Animal:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(PawPrint, { ...props });
    case AnomalyType.Obstacle:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { ...props });
    case AnomalyType.Accident:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { ...props });
    case AnomalyType.VehicleBreakdown:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { ...props });
    case AnomalyType.EmergencyVehicle:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Siren, { ...props });
  }
}
function timeAgo(ns) {
  const ms = Number(ns) / 1e6;
  const secs = Math.floor((Date.now() - ms) / 1e3);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}
function AnomalyCard({ anomaly, onResolve, resolving }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "relative flex overflow-hidden rounded-lg border bg-card transition-smooth hover:border-primary/20",
        anomaly.isActive ? "border-border" : "border-border/40 opacity-60"
      ),
      "data-ocid": `anomaly-card-${anomaly.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "w-1 shrink-0",
              SEVERITY_BAR[anomaly.severity] ?? "bg-muted"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-2 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
              anomaly.isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2.5 w-2.5 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-60" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnomalyTypeIcon, { type: anomaly.anomalyType }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-mono text-xs font-semibold uppercase tracking-wider text-foreground", children: TYPE_LABEL[anomaly.anomalyType] ?? anomaly.anomalyType })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: anomaly.severity }),
              !anomaly.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground", children: "RESOLVED" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-snug text-foreground/90", children: anomaly.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
              anomaly.segmentId
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-3 w-3" }),
              timeAgo(anomaly.detectedAt)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/50 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "flex w-full items-center justify-between text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors duration-200 hover:text-primary",
                onClick: () => setExpanded((v) => !v),
                "data-ocid": `anomaly-reasoning-toggle-${anomaly.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3" }),
                    "AI Reasoning"
                  ] }),
                  expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" })
                ]
              }
            ),
            expanded && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 rounded bg-muted/60 px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground", children: anomaly.reasoning })
          ] }),
          anomaly.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "h-7 gap-1.5 border-primary/30 font-mono text-[10px] uppercase tracking-wider text-primary hover:bg-primary/10",
              disabled: resolving,
              onClick: () => onResolve(anomaly.id),
              "data-ocid": `anomaly-resolve-${anomaly.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3" }),
                resolving ? "Resolving…" : "Resolve"
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
function DistributionChart({ anomalies }) {
  const counts = Object.values(AnomalyType).map((t) => ({
    name: TYPE_LABEL[t],
    count: anomalies.filter((a) => a.anomalyType === t).length,
    color: TYPE_CHART_COLOR[t]
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Anomaly Distribution by Type" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 180, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      BarChart,
      {
        data: counts,
        barCategoryGap: "30%",
        margin: { top: 4, right: 4, left: -20, bottom: 0 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            XAxis,
            {
              dataKey: "name",
              tick: {
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                fill: "hsl(var(--muted-foreground))"
              },
              axisLine: false,
              tickLine: false
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            YAxis,
            {
              allowDecimals: false,
              tick: {
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                fill: "oklch(0.52 0 0)"
              },
              axisLine: false,
              tickLine: false
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Tooltip,
            {
              contentStyle: {
                background: "oklch(0.15 0 0)",
                border: "1px solid oklch(0.22 0 0)",
                borderRadius: "6px",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: "oklch(0.93 0 0)"
              },
              cursor: { fill: "oklch(0.18 0 0)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "count", radius: [3, 3, 0, 0], children: counts.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.color }, entry.name)) })
        ]
      }
    ) })
  ] });
}
function DetectionStats({ anomalies }) {
  const typeCounts = Object.values(AnomalyType).map((t) => ({
    type: t,
    count: anomalies.filter((a) => a.anomalyType === t).length
  }));
  const mostCommon = typeCounts.reduce(
    (best, cur) => cur.count > best.count ? cur : best,
    { type: AnomalyType.Pedestrian, count: 0 }
  );
  const stats = [
    {
      label: "Total Detected",
      value: String(anomalies.length),
      color: "text-foreground"
    },
    {
      label: "Most Common",
      value: TYPE_LABEL[mostCommon.type],
      color: "text-accent"
    },
    { label: "Avg Resolution", value: "4.2 min", color: "text-primary" },
    { label: "ML Accuracy", value: "94.7%", color: "text-primary" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Detection Statistics" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "grid grid-cols-2 gap-3", children: stats.map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col gap-0.5 rounded-md bg-muted/50 p-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "font-display text-lg font-bold leading-none tabular-nums",
                color
              ),
              children: value
            }
          )
        ]
      },
      label
    )) })
  ] });
}
function Anomalies() {
  const actor = useSimulationStore((s) => s.actor);
  const [anomalies, setAnomalies] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [severityFilter, setSeverityFilter] = reactExports.useState("All");
  const [activeOnly, setActiveOnly] = reactExports.useState(false);
  const [resolvingId, setResolvingId] = reactExports.useState(null);
  const prevCriticalIds = reactExports.useRef(/* @__PURE__ */ new Set());
  const fetchAnomalies = reactExports.useCallback(async () => {
    if (!actor) return;
    try {
      const data = await getAnomalies(actor, false);
      const sorted = [...data].sort(
        (a, b) => (SEVERITY_ORDER[a.severity] ?? 99) - (SEVERITY_ORDER[b.severity] ?? 99)
      );
      const newCriticals = sorted.filter(
        (a) => a.severity === AlertSeverity.Critical && a.isActive && !prevCriticalIds.current.has(a.id)
      );
      for (const a of newCriticals) {
        ue.error(`Critical: ${a.description}`, {
          duration: 6e3,
          icon: "🚨"
        });
      }
      prevCriticalIds.current = new Set(
        sorted.filter((a) => a.severity === AlertSeverity.Critical && a.isActive).map((a) => a.id)
      );
      setAnomalies(sorted);
    } finally {
      setLoading(false);
    }
  }, [actor]);
  reactExports.useEffect(() => {
    fetchAnomalies();
    const id = setInterval(fetchAnomalies, 5e3);
    return () => clearInterval(id);
  }, [fetchAnomalies]);
  const handleResolve = reactExports.useCallback(
    async (anomalyId) => {
      if (!actor) return;
      setResolvingId(anomalyId);
      try {
        await resolveAnomaly(actor, anomalyId);
        ue.success("Anomaly resolved");
        await fetchAnomalies();
      } catch {
        ue.error("Failed to resolve anomaly");
      } finally {
        setResolvingId(null);
      }
    },
    [actor, fetchAnomalies]
  );
  const filtered = anomalies.filter((a) => {
    if (activeOnly && !a.isActive) return false;
    if (severityFilter !== "All" && a.severity !== severityFilter) return false;
    return true;
  });
  const activeCount = anomalies.filter((a) => a.isActive).length;
  const resolvedCount = anomalies.filter((a) => !a.isActive).length;
  const criticalCount = anomalies.filter(
    (a) => a.severity === AlertSeverity.Critical && a.isActive
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-6", "data-ocid": "anomalies-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Edge-Case Anomaly Detection" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "Real-time computer vision pipeline monitoring unexpected road events" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Total Detected",
          value: anomalies.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-primary" }),
          "data-ocid": "anomaly-stat-total"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Active Anomalies",
          value: activeCount,
          trend: activeCount > 3 ? "up" : "neutral",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-accent" }),
          colorClass: "text-accent",
          "data-ocid": "anomaly-stat-active"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Resolved Today",
          value: resolvedCount,
          trend: "down",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-primary" }),
          "data-ocid": "anomaly-stat-resolved"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Critical Alerts",
          value: criticalCount,
          trend: criticalCount > 0 ? "up" : "neutral",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Siren, { className: "h-4 w-4 text-destructive" }),
          colorClass: criticalCount > 0 ? "text-destructive" : void 0,
          "data-ocid": "anomaly-stat-critical"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-wrap items-center gap-2",
        "data-ocid": "anomaly-filter-bar",
        children: [
          SEVERITY_FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setSeverityFilter(f),
              className: cn(
                "rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-smooth",
                severityFilter === f ? FILTER_ACTIVE_CLASS[f] : "border-border/50 bg-muted/30 text-muted-foreground hover:border-border hover:text-foreground"
              ),
              "data-ocid": `anomaly-filter-${f.toLowerCase()}`,
              children: FILTER_LABEL[f]
            },
            f
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveOnly((v) => !v),
              className: cn(
                "flex items-center gap-1.5 rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-smooth",
                activeOnly ? "border-primary/40 bg-primary/10 text-primary" : "border-border/50 bg-muted/30 text-muted-foreground hover:border-border hover:text-foreground"
              ),
              "data-ocid": "anomaly-filter-active-toggle",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "h-1.5 w-1.5 rounded-full",
                      activeOnly ? "bg-primary" : "bg-muted-foreground"
                    )
                  }
                ),
                activeOnly ? "Active Only" : "Show All"
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-col gap-3 lg:col-span-2",
          "data-ocid": "anomaly-list",
          children: loading ? [1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 rounded-lg" }, k)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/50 py-16 text-center",
              "data-ocid": "anomaly-empty-state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-10 w-10 text-primary/40" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No anomalies match the current filters" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setSeverityFilter("All");
                      setActiveOnly(false);
                    },
                    className: "font-mono text-[10px] uppercase tracking-wider text-primary hover:underline",
                    children: "Clear filters"
                  }
                )
              ]
            }
          ) : filtered.map((anomaly) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            AnomalyCard,
            {
              anomaly,
              onResolve: handleResolve,
              resolving: resolvingId === anomaly.id
            },
            anomaly.id
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DistributionChart, { anomalies }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetectionStats, { anomalies })
      ] })
    ] })
  ] });
}
export {
  Anomalies
};
