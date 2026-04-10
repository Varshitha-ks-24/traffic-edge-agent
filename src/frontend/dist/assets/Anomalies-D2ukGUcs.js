import { c as createLucideIcon, u as useSimulationStore, r as reactExports, d as AlertSeverity, f as ue, j as jsxRuntimeExports, S as Skeleton, T as TriangleAlert, A as Activity, g as Siren, e as AnomalyType, B as Button, b as cn, h as Badge } from "./index-CKUeRL-6.js";
import { M as MetricCard, C as Cpu } from "./MetricCard-pndPVz0P.js";
import { S as StatusBadge } from "./StatusBadge-nV5UBj9_.js";
import { r as resolveAnomaly, C as CircleCheck } from "./trafficApi-CXc-JXmD.js";
import { M as MapPin } from "./map-pin-DDftYN2Q.js";
import { C as ChevronUp, a as ChevronDown } from "./chevron-up-DwSqudtc.js";
import { S as ShieldCheck } from "./shield-check-BhM2Xa22.js";
import { P as PawPrint, C as Car } from "./paw-print-CjunfZ_C.js";
import { U as User } from "./user-VULDEvfq.js";
import "./trending-up-OFm7dv7r.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
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
const Package = createLucideIcon("package", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode$1);
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
const SEVERITY_FILTERS = [
  "All",
  AlertSeverity.Critical,
  AlertSeverity.High,
  AlertSeverity.Medium,
  AlertSeverity.Low
];
const TYPE_FILTERS = [
  "All",
  AnomalyType.Accident,
  AnomalyType.EmergencyVehicle,
  AnomalyType.Pedestrian,
  AnomalyType.Animal,
  AnomalyType.Obstacle,
  AnomalyType.VehicleBreakdown
];
const TYPE_LABEL = {
  [AnomalyType.Accident]: "Accident",
  [AnomalyType.EmergencyVehicle]: "Emergency",
  [AnomalyType.Pedestrian]: "Pedestrian",
  [AnomalyType.Animal]: "Animal",
  [AnomalyType.Obstacle]: "Obstacle",
  [AnomalyType.VehicleBreakdown]: "Breakdown"
};
const SEVERITY_ORDER = {
  [AlertSeverity.Critical]: 0,
  [AlertSeverity.High]: 1,
  [AlertSeverity.Medium]: 2,
  [AlertSeverity.Low]: 3
};
const SEVERITY_BAR = {
  [AlertSeverity.Critical]: "bg-destructive",
  [AlertSeverity.High]: "bg-accent",
  [AlertSeverity.Medium]: "bg-primary",
  [AlertSeverity.Low]: "bg-muted-foreground"
};
const TYPE_BAR_COLOR = {
  [AnomalyType.Accident]: "bg-destructive",
  [AnomalyType.EmergencyVehicle]: "bg-accent",
  [AnomalyType.Pedestrian]: "bg-primary",
  [AnomalyType.Animal]: "bg-[oklch(0.7_0.15_145)]",
  [AnomalyType.Obstacle]: "bg-[oklch(0.65_0.18_30)]",
  [AnomalyType.VehicleBreakdown]: "bg-muted-foreground"
};
const TYPE_TEXT_COLOR = {
  [AnomalyType.Accident]: "text-destructive",
  [AnomalyType.EmergencyVehicle]: "text-accent",
  [AnomalyType.Pedestrian]: "text-primary",
  [AnomalyType.Animal]: "text-[oklch(0.7_0.15_145)]",
  [AnomalyType.Obstacle]: "text-[oklch(0.65_0.18_30)]",
  [AnomalyType.VehicleBreakdown]: "text-muted-foreground"
};
function AnomalyTypeIcon({
  type,
  className
}) {
  const cls = cn("h-4 w-4", className);
  switch (type) {
    case AnomalyType.Accident:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: cls });
    case AnomalyType.EmergencyVehicle:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Siren, { className: cls });
    case AnomalyType.Pedestrian:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: cls });
    case AnomalyType.Animal:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(PawPrint, { className: cls });
    case AnomalyType.Obstacle:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: cls });
    case AnomalyType.VehicleBreakdown:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: cls });
  }
}
function timeAgo(ns) {
  const ms = Number(ns) / 1e6;
  const secs = Math.floor((Date.now() - ms) / 1e3);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}
function formatTs(ns) {
  const ms = Number(ns) / 1e6;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
}
function cvConfidence(severity) {
  const map = {
    [AlertSeverity.Critical]: 97,
    [AlertSeverity.High]: 88,
    [AlertSeverity.Medium]: 74,
    [AlertSeverity.Low]: 61
  };
  return map[severity] ?? 70;
}
function affectedVehicles(severity) {
  const map = {
    [AlertSeverity.Critical]: 42,
    [AlertSeverity.High]: 28,
    [AlertSeverity.Medium]: 14,
    [AlertSeverity.Low]: 6
  };
  return map[severity] ?? 10;
}
function LiveBadge() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded border border-destructive/40 bg-destructive/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-destructive", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2 w-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-destructive" })
    ] }),
    "LIVE"
  ] });
}
function FilterToggleGroup({
  options,
  value,
  onChange,
  labelFn,
  activeClassFn,
  dataOcidPrefix = "filter"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: options.map((opt) => {
    const isActive = value === opt;
    const activeClass = activeClassFn ? activeClassFn(opt) : "border-primary bg-primary/20 text-primary";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange(opt),
        className: cn(
          "rounded border px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider transition-smooth",
          isActive ? activeClass : "border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
        ),
        "data-ocid": `${dataOcidPrefix}-${opt.toLowerCase()}`,
        children: labelFn ? labelFn(opt) : opt
      },
      opt
    );
  }) });
}
function TypeBarChart({ anomalies }) {
  const types = Object.values(AnomalyType);
  const counts = types.map((t) => ({
    type: t,
    count: anomalies.filter((a) => a.anomalyType === t).length
  }));
  const max = Math.max(...counts.map((c) => c.count), 1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Anomaly Distribution by Type" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: counts.map(({ type, count }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "flex w-28 shrink-0 items-center gap-1.5",
            TYPE_TEXT_COLOR[type]
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnomalyTypeIcon, { type, className: "h-3 w-3 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-mono text-[11px] font-medium", children: TYPE_LABEL[type] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-4 flex-1 overflow-hidden rounded bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: cn(
            "h-full rounded transition-all duration-500",
            TYPE_BAR_COLOR[type]
          ),
          style: {
            width: `${count / max * 100}%`,
            minWidth: count > 0 ? "4px" : "0"
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 shrink-0 text-right font-mono text-xs text-muted-foreground", children: count })
    ] }, type)) })
  ] });
}
function AnomalyCard({
  anomaly,
  segmentName,
  segmentDistrict,
  onResolve,
  resolving
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const isCritical = anomaly.severity === AlertSeverity.Critical;
  const confidence = cvConfidence(anomaly.severity);
  const vehicles = affectedVehicles(anomaly.severity);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "relative overflow-hidden rounded-lg border bg-card transition-smooth hover:border-primary/30",
        isCritical ? "border-destructive/40 glow-red" : "border-border",
        !anomaly.isActive && "opacity-60"
      ),
      "data-ocid": `anomaly-card-${anomaly.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "absolute inset-y-0 left-0 w-0.5",
              SEVERITY_BAR[anomaly.severity]
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-2 p-4 pl-4.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
              anomaly.isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2.5 w-2.5 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-60" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted/60",
                    TYPE_TEXT_COLOR[anomaly.anomalyType]
                  ),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnomalyTypeIcon, { type: anomaly.anomalyType })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-semibold text-foreground", children: TYPE_LABEL[anomaly.anomalyType] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: anomaly.severity }),
              !anomaly.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "font-mono text-[10px] border-muted text-muted-foreground",
                  children: "RESOLVED"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-0.5 font-mono text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
              segmentName
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: segmentDistrict }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-3 w-3" }),
              timeAgo(anomaly.detectedAt)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto font-mono text-[10px] text-muted-foreground/70", children: formatTs(anomaly.detectedAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-snug text-foreground/90", children: anomaly.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/50 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors duration-200 hover:text-primary",
                onClick: () => setExpanded((v) => !v),
                "aria-expanded": expanded,
                "data-ocid": `anomaly-expand-${anomaly.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-3 w-3" }),
                    "Detection Details & AI Reasoning"
                  ] }),
                  expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" })
                ]
              }
            ),
            expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "AI Reasoning" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded bg-muted/50 px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground", children: anomaly.reasoning })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-muted/20 p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-3 w-3 text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground", children: "CV Model Confidence" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xl font-bold text-primary", children: [
                    confidence,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-1.5 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full bg-primary transition-all duration-700",
                      style: { width: `${confidence}%` }
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-muted/20 p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3 text-accent" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground", children: "Affected Vehicles" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xl font-bold text-accent", children: [
                    "~",
                    vehicles
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 rounded-md border border-border bg-muted/20 p-3 sm:col-span-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground", children: "Anomaly ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "break-all font-mono text-[10px] text-foreground/60", children: anomaly.id })
                ] })
              ] }),
              anomaly.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "gap-2 border-primary/40 font-mono text-[11px] uppercase tracking-wider text-primary hover:bg-primary/10",
                  disabled: resolving,
                  onClick: () => onResolve(anomaly.id),
                  "data-ocid": `anomaly-resolve-${anomaly.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
                    resolving ? "Resolving…" : "Mark Resolved"
                  ]
                }
              ) })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function Anomalies() {
  const { snapshot, isLoading, actor, fetchSnapshot } = useSimulationStore();
  const [severityFilter, setSeverityFilter] = reactExports.useState("All");
  const [typeFilter, setTypeFilter] = reactExports.useState("All");
  const [resolvingIds, setResolvingIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const prevCriticalIds = reactExports.useRef(/* @__PURE__ */ new Set());
  const segmentMap = reactExports.useMemo(() => {
    const map = {};
    for (const seg of (snapshot == null ? void 0 : snapshot.segments) ?? []) {
      map[seg.id] = { name: seg.name, district: seg.district };
    }
    return map;
  }, [snapshot]);
  const allAnomalies = reactExports.useMemo(
    () => (snapshot == null ? void 0 : snapshot.activeAnomalies) ?? [],
    [snapshot]
  );
  reactExports.useEffect(() => {
    const newCriticals = allAnomalies.filter(
      (a) => a.severity === AlertSeverity.Critical && a.isActive && !prevCriticalIds.current.has(a.id)
    );
    for (const a of newCriticals) {
      ue.error(`Critical: ${a.description}`, { duration: 6e3, icon: "🚨" });
    }
    prevCriticalIds.current = new Set(
      allAnomalies.filter((a) => a.severity === AlertSeverity.Critical && a.isActive).map((a) => a.id)
    );
  }, [allAnomalies]);
  const activeCount = allAnomalies.filter((a) => a.isActive).length;
  const criticalCount = allAnomalies.filter(
    (a) => a.isActive && a.severity === AlertSeverity.Critical
  ).length;
  const resolvedCount = allAnomalies.filter((a) => !a.isActive).length;
  const filtered = reactExports.useMemo(() => {
    return allAnomalies.filter((a) => {
      const svOk = severityFilter === "All" || a.severity === severityFilter;
      const tpOk = typeFilter === "All" || a.anomalyType === typeFilter;
      return svOk && tpOk;
    }).sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  }, [allAnomalies, severityFilter, typeFilter]);
  const handleResolve = reactExports.useCallback(
    async (id) => {
      if (!actor) return;
      setResolvingIds((prev) => new Set(prev).add(id));
      try {
        await resolveAnomaly(actor, id);
        ue.success("Anomaly marked as resolved");
        await fetchSnapshot();
      } catch {
        ue.error("Failed to resolve anomaly");
      } finally {
        setResolvingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [actor, fetchSnapshot]
  );
  const severityActiveClass = (v) => {
    const map = {
      All: "border-border bg-secondary text-foreground",
      [AlertSeverity.Critical]: "border-destructive/50 bg-destructive/15 text-destructive",
      [AlertSeverity.High]: "border-accent/50 bg-accent/15 text-accent",
      [AlertSeverity.Medium]: "border-primary/50 bg-primary/15 text-primary",
      [AlertSeverity.Low]: "border-muted-foreground/50 bg-muted text-muted-foreground"
    };
    return map[v] ?? "border-primary bg-primary/20 text-primary";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-6", "data-ocid": "anomalies-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Edge-Case Anomaly Detection" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LiveBadge, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 font-mono text-xs text-muted-foreground", children: "Real-time computer vision pipeline monitoring unexpected road events" })
    ] }) }),
    isLoading && !snapshot ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-lg" }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
        "data-ocid": "anomaly-metrics",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricCard,
            {
              title: "Total Anomalies",
              value: allAnomalies.length,
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-muted-foreground" }),
              "data-ocid": "anomaly-stat-total"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricCard,
            {
              title: "Active",
              value: activeCount,
              trend: activeCount > 3 ? "up" : "neutral",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-primary" }),
              colorClass: "text-primary",
              className: "glow-cyan",
              "data-ocid": "anomaly-stat-active"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricCard,
            {
              title: "Critical",
              value: criticalCount,
              trend: criticalCount > 0 ? "up" : "neutral",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Siren, { className: "h-4 w-4 text-destructive" }),
              colorClass: criticalCount > 0 ? "text-destructive" : void 0,
              className: criticalCount > 0 ? "glow-red" : "",
              "data-ocid": "anomaly-stat-critical"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricCard,
            {
              title: "Resolved Today",
              value: resolvedCount,
              trend: "down",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-accent" }),
              colorClass: "text-accent",
              "data-ocid": "anomaly-stat-resolved"
            }
          )
        ]
      }
    ),
    snapshot && /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBarChart, { anomalies: allAnomalies }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col gap-3 rounded-lg border border-border bg-card p-4",
        "data-ocid": "anomaly-filter-bar",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground", children: "Filter by Severity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FilterToggleGroup,
              {
                options: SEVERITY_FILTERS,
                value: severityFilter,
                onChange: setSeverityFilter,
                labelFn: (v) => v === "All" ? "All" : v,
                activeClassFn: severityActiveClass,
                dataOcidPrefix: "severity-filter"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground", children: "Filter by Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FilterToggleGroup,
              {
                options: TYPE_FILTERS,
                value: typeFilter,
                onChange: setTypeFilter,
                labelFn: (v) => v === "All" ? "All" : TYPE_LABEL[v],
                dataOcidPrefix: "type-filter"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", "data-ocid": "anomaly-list", children: isLoading && !snapshot ? [1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 rounded-lg" }, k)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-card/50 py-16 text-center",
        "data-ocid": "anomaly-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-7 w-7 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: "No active anomalies" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: severityFilter !== "All" || typeFilter !== "All" ? "No anomalies match the current filters." : "All systems operating normally." })
          ] }),
          (severityFilter !== "All" || typeFilter !== "All") && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "font-mono text-[11px]",
              onClick: () => {
                setSeverityFilter("All");
                setTypeFilter("All");
              },
              "data-ocid": "clear-filters-btn",
              children: "Clear Filters"
            }
          )
        ]
      }
    ) : filtered.map((anomaly) => {
      const seg = segmentMap[anomaly.segmentId];
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        AnomalyCard,
        {
          anomaly,
          segmentName: (seg == null ? void 0 : seg.name) ?? anomaly.segmentId,
          segmentDistrict: (seg == null ? void 0 : seg.district) ?? "—",
          onResolve: handleResolve,
          resolving: resolvingIds.has(anomaly.id)
        },
        anomaly.id
      );
    }) }),
    filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-muted-foreground", children: [
      "Showing ",
      filtered.length,
      " of ",
      allAnomalies.length,
      " anomalies"
    ] })
  ] });
}
export {
  Anomalies
};
