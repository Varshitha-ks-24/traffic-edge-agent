import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, q as createSlot, d as cn, u as useSimulationStore, I as IncidentStatus, F as FileText, B as Button, S as Skeleton, g as ue, h as Siren, b as TriangleAlert, e as AlertSeverity, f as AnomalyType } from "./index-Cjz6nUaB.js";
import { S as StatusBadge } from "./StatusBadge-BMd-Wgia.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, S as Select, d as SelectTrigger, e as SelectValue, f as SelectContent, g as SelectItem } from "./select-ZyWqcy_t.js";
import { F as FALLBACK_SEGMENTS, C as CircleCheck, f as reportIncident } from "./trafficApi-j32R7f3i.js";
import { C as Clock } from "./clock-CMKEL1lg.js";
import { L as LoaderCircle, C as ChevronRight } from "./loader-circle-CqN2rNCD.js";
import { U as User } from "./user-r3fQtufJ.js";
import { a as ChevronDown } from "./chevron-up-C0PR9Nhi.js";
import { T as TrendingUp } from "./trending-up-BRz5CwNs.js";
import { C as CircleX } from "./circle-x-B0UhIhAC.js";
import "./index-CGA5l0LD.js";
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
      d: "M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z",
      key: "x6xyqk"
    }
  ],
  ["path", { d: "M8 14v.5", key: "1nzgdb" }],
  ["path", { d: "M16 14v.5", key: "1lajdz" }],
  ["path", { d: "M11.25 16.25h1.5L12 17l-.75-.75Z", key: "12kq1m" }]
];
const Cat = createLucideIcon("cat", __iconNode$2);
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
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode);
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
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
var Root$1 = Label$1;
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root$1,
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
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = reactExports.createContext(defaultContext);
    BaseContext.displayName = rootComponentName + "Context";
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      var _a;
      const { scope, children, ...context } = props;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const value = reactExports.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      var _a;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const context = reactExports.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return reactExports.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = (scope == null ? void 0 : scope[scopeName]) || scopeContexts;
      return reactExports.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return reactExports.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;
    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
    }
    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, "Progress"));
    }
    const value = isValidValueNumber(valueProp, max) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : void 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressProvider, { scope: __scopeProgress, value, max, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "aria-valuemax": max,
        "aria-valuemin": 0,
        "aria-valuenow": isNumber(value) ? value : void 0,
        "aria-valuetext": valueLabel,
        role: "progressbar",
        "data-state": getProgressState(value, max),
        "data-value": value ?? void 0,
        "data-max": max,
        ...progressProps,
        ref: forwardedRef
      }
    ) });
  }
);
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = "ProgressIndicator";
var ProgressIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": getProgressState(context.value, context.max),
        "data-value": context.value ?? void 0,
        "data-max": context.max,
        ...indicatorProps,
        ref: forwardedRef
      }
    );
  }
);
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(value, max) {
  return `${Math.round(value / max * 100)}%`;
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
  return typeof value === "number";
}
function isValidMaxNumber(max) {
  return isNumber(max) && !isNaN(max) && max > 0;
}
function isValidValueNumber(value, max) {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root = Progress$1;
var Indicator = ProgressIndicator;
function Progress({
  className,
  value,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "progress",
      className: cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "progress-indicator",
          className: "bg-primary h-full w-full flex-1 transition-all",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
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
  "Accident",
  "Pedestrian",
  "Animal",
  "Obstacle",
  "Breakdown",
  "Emergency"
];
const TYPE_META = {
  Accident: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
    color: "text-destructive"
  },
  Pedestrian: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5" }),
    color: "text-accent"
  },
  Animal: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Cat, { className: "h-3.5 w-3.5" }),
    color: "text-accent"
  },
  Obstacle: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-3.5 w-3.5" }),
    color: "text-accent"
  },
  Breakdown: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
    color: "text-muted-foreground"
  },
  Emergency: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Siren, { className: "h-3.5 w-3.5" }),
    color: "text-destructive"
  }
};
function formatTs(ts) {
  const ms = Number(ts) / 1e6;
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function formatDate(ts) {
  const ms = Number(ts) / 1e6;
  return new Date(ms).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function getScoreTier(score) {
  if (score > 80)
    return {
      label: "Confirmed",
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/30",
      barColor: "bg-primary"
    };
  if (score >= 60)
    return {
      label: "Likely",
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/30",
      barColor: "bg-primary"
    };
  if (score >= 30)
    return {
      label: "Plausible",
      color: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/30",
      barColor: "bg-accent"
    };
  return {
    label: "Insufficient",
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    barColor: "bg-destructive"
  };
}
function getTypeIcon(type) {
  const meta = TYPE_META[type];
  return meta ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: meta.color, children: meta.icon }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5 text-muted-foreground" });
}
function incidentTypeToAnomalyType(incidentType) {
  const map = {
    Accident: AnomalyType.Accident,
    Pedestrian: AnomalyType.Pedestrian,
    Animal: AnomalyType.Animal,
    Obstacle: AnomalyType.Obstacle,
    Breakdown: AnomalyType.VehicleBreakdown,
    Emergency: AnomalyType.EmergencyVehicle
  };
  return map[incidentType] ?? AnomalyType.Obstacle;
}
function incidentTypeToSeverity(incidentType) {
  if (incidentType === "Accident" || incidentType === "Emergency")
    return AlertSeverity.High;
  if (incidentType === "Obstacle" || incidentType === "Breakdown")
    return AlertSeverity.Medium;
  return AlertSeverity.Low;
}
function incidentToAnomaly(incident) {
  return {
    id: `incident-${incident.id}`,
    segmentId: incident.segmentId,
    anomalyType: incidentTypeToAnomalyType(incident.incidentType),
    detectedAt: incident.reportedAt,
    description: incident.reporterNote || `${incident.incidentType} reported on ${incident.segmentId}`,
    isActive: true,
    reasoning: `User-reported incident: ${incident.incidentType} on ${incident.segmentId}. ${incident.reporterNote}`,
    severity: incidentTypeToSeverity(incident.incidentType)
  };
}
function StatCard({
  label,
  value,
  icon,
  colorClass,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: "border-border bg-card glow-cyan",
      "data-ocid": `stat-${ocid}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10", children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: cn(
                "font-mono text-xl font-bold tabular-nums",
                colorClass ?? "text-foreground"
              ),
              children: value
            }
          )
        ] })
      ] })
    }
  );
}
function ValidationScorePanel({ incident }) {
  const score = Number(incident.validationScore);
  const tier = getScoreTier(score);
  const breakdown = [
    {
      label: "Location Consistency",
      pct: Math.min(100, score + Math.round(Math.sin(score) * 12))
    },
    {
      label: "Timing Pattern",
      pct: Math.min(100, score + Math.round(Math.cos(score * 0.5) * 10))
    },
    {
      label: "Sensor Corroboration",
      pct: Math.min(100, Math.max(0, score - 5 + Math.round(score * 0.1)))
    },
    {
      label: "Reporter Confidence",
      pct: Math.min(100, score + Math.round(score * 0.05))
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "mt-4 rounded-lg border p-4 transition-smooth",
        tier.bg,
        tier.border
      ),
      "data-ocid": "validation-score-panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "AI Validation Result" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn("flex items-center gap-2 rounded px-2 py-0.5", tier.bg),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "font-mono text-2xl font-black tabular-nums",
                      tier.color
                    ),
                    children: score
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: cn(
                        "font-mono text-xs font-bold leading-none",
                        tier.color
                      ),
                      children: tier.label
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-muted-foreground", children: "/ 100" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 h-2 w-full overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "h-full rounded-full transition-all duration-700",
              tier.barColor
            ),
            style: { width: `${score}%` }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: breakdown.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-36 shrink-0 font-mono text-[10px] text-muted-foreground", children: b.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 flex-1 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "h-full rounded-full",
                tier.barColor,
                "opacity-70"
              ),
              style: { width: `${b.pct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "w-8 text-right font-mono text-[10px] tabular-nums",
                tier.color
              ),
              children: b.pct
            }
          )
        ] }, b.label)) }),
        incident.reporterNote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 border-t border-border/40 pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Validation Reasoning" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-mono text-xs leading-relaxed text-foreground", children: score > 80 ? `Report confirmed: ${incident.reporterNote} — All sensor signals consistent with reported incident. Auto-validated.` : score >= 60 ? `Likely valid: ${incident.reporterNote} — Sensor data partially corroborates report. Flagged for priority review.` : score >= 30 ? `Plausible report: ${incident.reporterNote} — Insufficient corroborating signals. Queued for manual verification.` : `Insufficient evidence: ${incident.reporterNote} — No corroborating sensor data found. Report auto-rejected.` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex gap-1 border-t border-border/40 pt-3", children: [
          {
            range: "<30",
            label: "Insufficient",
            c: "bg-destructive/20 text-destructive"
          },
          { range: "30–60", label: "Plausible", c: "bg-accent/20 text-accent" },
          {
            range: "60–80",
            label: "Likely",
            c: "bg-emerald-400/20 text-emerald-400"
          },
          { range: ">80", label: "Confirmed", c: "bg-primary/20 text-primary" }
        ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "flex flex-1 flex-col items-center rounded px-1 py-1.5",
              t.c,
              score > 80 && t.range === ">80" ? "ring-1 ring-primary" : "",
              score >= 60 && score <= 80 && t.range === "60–80" ? "ring-1 ring-emerald-400" : "",
              score >= 30 && score < 60 && t.range === "30–60" ? "ring-1 ring-accent" : "",
              score < 30 && t.range === "<30" ? "ring-1 ring-destructive" : ""
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] font-bold", children: t.range }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px] opacity-80", children: t.label })
            ]
          },
          t.range
        )) })
      ]
    }
  );
}
function StatusTimeline({ incident }) {
  const steps = [
    {
      status: "Submitted",
      ts: incident.reportedAt,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3 w-3" }),
      active: true,
      desc: "Report received by the AI validation pipeline."
    },
    {
      status: "AI Processing",
      ts: BigInt(Number(incident.reportedAt) + 5e8),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }),
      active: true,
      desc: `Validation score computed: ${Number(incident.validationScore)}/100.`
    },
    {
      status: incident.status === IncidentStatus.Validated ? "Validated" : incident.status === IncidentStatus.Rejected ? "Rejected" : incident.status === IncidentStatus.Resolved ? "Validated" : "Pending Review",
      ts: incident.validatedAt ?? BigInt(Number(incident.reportedAt) + 15e8),
      icon: incident.status === IncidentStatus.Rejected ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }) : incident.status === IncidentStatus.Pending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
      active: incident.status !== IncidentStatus.Pending,
      desc: incident.status === IncidentStatus.Validated ? "Report verified and integrated into traffic AI decision pipeline." : incident.status === IncidentStatus.Rejected ? "Insufficient corroborating evidence. Report auto-rejected." : incident.status === IncidentStatus.Resolved ? "Incident confirmed and marked as resolved." : "Awaiting additional sensor data or manual reviewer."
    },
    ...incident.status === IncidentStatus.Resolved ? [
      {
        status: "Resolved",
        ts: BigInt(
          Number(incident.validatedAt ?? incident.reportedAt) + 3e9
        ),
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
        active: true,
        desc: "Incident cleared. Traffic conditions returned to normal."
      }
    ] : []
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-1 space-y-1 pl-1", "data-ocid": "incident-timeline", children: steps.map((step, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-smooth",
            step.active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          ),
          children: step.icon
        }
      ),
      idx < steps.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: cn(
            "mt-0.5 w-px flex-1 transition-smooth",
            step.active ? "bg-primary/30" : "bg-border"
          ),
          style: { minHeight: "16px" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-2 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "font-mono text-xs font-semibold",
              step.active ? "text-foreground" : "text-muted-foreground"
            ),
            children: step.status
          }
        ),
        step.active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] text-muted-foreground", children: formatTs(step.ts) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 font-mono text-[10px] leading-relaxed text-muted-foreground", children: step.desc })
    ] })
  ] }, step.status)) });
}
function IncidentRow({
  incident,
  segmentName
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const score = Number(incident.validationScore);
  const tier = getScoreTier(score);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        className: cn(
          "border-b border-border/40 transition-colors hover:bg-muted/20",
          expanded && "bg-muted/10"
        ),
        "data-ocid": `incident-row-${incident.id}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 pr-3 pl-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setExpanded((v) => !v),
              className: "flex items-center justify-center rounded p-0.5 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
              "aria-label": expanded ? "Collapse incident details" : "Expand incident details",
              children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 text-muted-foreground" })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 font-mono text-xs text-foreground", children: [
            getTypeIcon(incident.incidentType),
            incident.incidentType
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 pr-4 font-mono text-[10px] text-foreground", children: segmentName || incident.segmentId }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "max-w-[180px] py-2.5 pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-1 font-mono text-[10px] text-muted-foreground", children: incident.reporterNote || "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap py-2.5 pr-4 font-mono text-[10px] text-muted-foreground", children: formatDate(incident.reportedAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-16 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn("h-full rounded-full", tier.barColor),
                style: { width: `${score}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "w-6 font-mono text-[10px] font-bold tabular-nums",
                  tier.color
                ),
                children: score
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "hidden font-mono text-[9px] sm:inline",
                  tier.color
                ),
                children: tier.label
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: incident.status }) })
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/40 bg-muted/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-8 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Status Timeline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusTimeline, { incident })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Validation Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn("rounded-lg border p-3", tier.bg, tier.border),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: cn(
                      "font-mono text-2xl font-black tabular-nums",
                      tier.color
                    ),
                    children: [
                      score,
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-sm font-normal text-muted-foreground", children: "/ 100" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "rounded px-2 py-0.5 font-mono text-xs font-bold",
                      tier.bg,
                      tier.color
                    ),
                    children: tier.label
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: score, className: "h-1.5 mb-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] leading-relaxed text-muted-foreground", children: score > 80 ? "All sensor signals confirm this report. Automatically validated and integrated into the decision pipeline." : score >= 60 ? "Multiple corroborating signals found. Flagged as likely valid, pending final review." : score >= 30 ? "Partial signal match. Insufficient for auto-validation — queued for manual review." : "No corroborating sensor data. Auto-rejected from the AI pipeline." })
            ]
          }
        )
      ] })
    ] }) }) })
  ] });
}
function Incidents() {
  const {
    actor,
    snapshot,
    addAnomalyToSnapshot,
    incidents,
    addIncident,
    setIncidents
  } = useSimulationStore();
  const segments = (snapshot == null ? void 0 : snapshot.segments) && snapshot.segments.length > 0 ? snapshot.segments : FALLBACK_SEGMENTS;
  const [loadingIncidents, setLoadingIncidents] = reactExports.useState(false);
  const [segmentId, setSegmentId] = reactExports.useState("");
  const [incidentType, setIncidentType] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [formErrors, setFormErrors] = reactExports.useState({});
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [submittedIncident, setSubmittedIncident] = reactExports.useState(
    null
  );
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
  }, [actor, setIncidents]);
  reactExports.useEffect(() => {
    fetchIncidents();
    intervalRef.current = setInterval(fetchIncidents, 1e4);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchIncidents]);
  function validateForm() {
    const errors = {};
    if (!segmentId) errors.segmentId = "Please select a road segment.";
    if (!incidentType) errors.incidentType = "Please select an incident type.";
    if (description.trim().length < 10)
      errors.description = "Description must be at least 10 characters.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    setSubmittedIncident(null);
    const fallbackAnomaly = {
      id: `incident-fallback-${Date.now()}`,
      segmentId,
      anomalyType: incidentTypeToAnomalyType(incidentType),
      detectedAt: BigInt(Date.now() * 1e6),
      description: description.trim() || `${incidentType} reported on ${segmentId}`,
      isActive: true,
      reasoning: `User-reported incident: ${incidentType} on ${segmentId}. ${description.trim()}`,
      severity: incidentTypeToSeverity(incidentType)
    };
    if (!actor) {
      const fallbackIncident = {
        id: `local-${Date.now()}`,
        segmentId,
        incidentType,
        reporterNote: description.trim(),
        status: IncidentStatus.Pending,
        reportedAt: BigInt(Date.now() * 1e6),
        validationScore: BigInt(Math.floor(Math.random() * 40) + 40),
        validatedAt: void 0
      };
      addIncident(fallbackIncident);
      addAnomalyToSnapshot(fallbackAnomaly);
      ue.success("Incident report submitted", {
        description: `${incidentType} on ${segmentId} — Added to anomaly detection feed.`
      });
      setSegmentId("");
      setIncidentType("");
      setDescription("");
      setFormErrors({});
      setSubmitting(false);
      return;
    }
    try {
      const result = await reportIncident(
        actor,
        segmentId,
        incidentType,
        description.trim()
      );
      setSubmittedIncident(result);
      addIncident(result);
      addAnomalyToSnapshot(incidentToAnomaly(result));
      const score = Number(result.validationScore);
      const tier = getScoreTier(score);
      ue.success("Incident report submitted", {
        description: `${incidentType} on ${segmentId} — Score: ${score}/100 (${tier.label}). Added to anomaly detection feed.`
      });
      setSegmentId("");
      setIncidentType("");
      setDescription("");
      setFormErrors({});
      fetchIncidents();
    } catch (err) {
      const offlineIncident = {
        id: `offline-${Date.now()}`,
        segmentId,
        incidentType,
        reporterNote: description.trim(),
        status: IncidentStatus.Pending,
        reportedAt: BigInt(Date.now() * 1e6),
        validationScore: BigInt(Math.floor(Math.random() * 40) + 40),
        validatedAt: void 0
      };
      addIncident(offlineIncident);
      addAnomalyToSnapshot(fallbackAnomaly);
      ue.success("Incident report submitted", {
        description: `${incidentType} on ${segmentId} — Added to anomaly detection feed (offline mode).`
      });
      setSegmentId("");
      setIncidentType("");
      setDescription("");
      setFormErrors({});
      const msg = err instanceof Error ? err.message : "Submission failed";
      console.warn("[Incidents] reportIncident backend error:", msg);
    } finally {
      setSubmitting(false);
    }
  }
  const total = incidents.length;
  const pendingCount = incidents.filter(
    (i) => i.status === IncidentStatus.Pending
  ).length;
  const validatedCount = incidents.filter(
    (i) => i.status === IncidentStatus.Validated
  ).length;
  const resolvedCount = incidents.filter(
    (i) => i.status === IncidentStatus.Resolved
  ).length;
  const segmentMap = new Map(
    segments.map((s) => [s.id, `${s.name} — ${s.district}`])
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-6", "data-ocid": "incidents-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Human-in-the-Loop Incident Reporting" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-mono text-xs text-muted-foreground", children: "Crowd-sourced incident validation integrated into the AI decision pipeline" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Reported",
          value: total,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-primary" }),
          ocid: "total"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Pending",
          value: pendingCount,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-accent" }),
          colorClass: pendingCount > 0 ? "text-accent" : "text-muted-foreground",
          ocid: "pending"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Validated",
          value: validatedCount,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-primary" }),
          colorClass: "text-primary",
          ocid: "validated"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Resolved",
          value: resolvedCount,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-muted-foreground" }),
          colorClass: "text-muted-foreground",
          ocid: "resolved"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "report-form-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-widest text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 text-primary" }),
          "Submit Incident Report"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", noValidate: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: [
              "Road Segment ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: segmentId,
                onValueChange: (v) => {
                  setSegmentId(v);
                  setFormErrors((prev) => ({
                    ...prev,
                    segmentId: void 0
                  }));
                },
                "data-ocid": "select-segment",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: cn(
                        "border-input bg-background font-mono text-xs transition-smooth focus:ring-1 focus:ring-primary",
                        formErrors.segmentId && "border-destructive"
                      ),
                      "data-ocid": "select-segment-trigger",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select road segment…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: segments.map((seg) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: seg.id, children: [
                    seg.name,
                    " — ",
                    seg.district
                  ] }, seg.id)) })
                ]
              }
            ),
            formErrors.segmentId && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-mono text-[10px] text-destructive",
                "data-ocid": "err-segment",
                children: formErrors.segmentId
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: [
              "Incident Type ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: incidentType,
                onValueChange: (v) => {
                  setIncidentType(v);
                  setFormErrors((prev) => ({
                    ...prev,
                    incidentType: void 0
                  }));
                },
                "data-ocid": "select-incident-type",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: cn(
                        "border-input bg-background font-mono text-xs transition-smooth focus:ring-1 focus:ring-primary",
                        formErrors.incidentType && "border-destructive"
                      ),
                      "data-ocid": "select-type-trigger",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select incident type…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: INCIDENT_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    TYPE_META[t].icon,
                    t
                  ] }) }, t)) })
                ]
              }
            ),
            formErrors.incidentType && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-mono text-[10px] text-destructive",
                "data-ocid": "err-type",
                children: formErrors.incidentType
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: [
              "Description ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: description,
                onChange: (e) => {
                  setDescription(e.target.value);
                  if (e.target.value.trim().length >= 10) {
                    setFormErrors((prev) => ({
                      ...prev,
                      description: void 0
                    }));
                  }
                },
                placeholder: "Describe what you observed (min. 10 characters)…",
                className: cn(
                  "min-h-[90px] resize-none border-input bg-background font-mono text-xs transition-smooth focus:ring-1 focus:ring-primary",
                  formErrors.description && "border-destructive"
                ),
                "data-ocid": "input-description"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: formErrors.description ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-mono text-[10px] text-destructive",
                "data-ocid": "err-desc",
                children: formErrors.description
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [
              description.trim().length,
              " chars (min 10)"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: submitting,
              className: "w-full",
              "data-ocid": "btn-submit-report",
              children: submitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                "Submitting…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "mr-2 h-4 w-4" }),
                "Report Incident"
              ] })
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        submittedIncident ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "border-border bg-card",
            "data-ocid": "submission-result-card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-widest text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-primary" }),
                "Submission Result"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-start justify-between gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs font-semibold text-foreground", children: submittedIncident.incidentType }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-muted-foreground", children: [
                      "Segment:",
                      " ",
                      segmentMap.get(submittedIncident.segmentId) ?? submittedIncident.segmentId
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: submittedIncident.status })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ValidationScorePanel, { incident: submittedIncident }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "mt-3 w-full font-mono text-xs text-muted-foreground",
                    onClick: () => setSubmittedIncident(null),
                    children: "Dismiss"
                  }
                )
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/20 bg-primary/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-widest text-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4" }),
            "AI Validation Engine"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs leading-relaxed text-muted-foreground", children: [
              "Each report is scored 0–100 based on",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "location consistency" }),
              ",",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "timing patterns" }),
              ",",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "sensor corroboration" }),
              ", and ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "reporter history" }),
              "."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [
              {
                range: ">80",
                label: "Confirmed",
                c: "bg-primary/15 text-primary border-primary/20"
              },
              {
                range: "60–80",
                label: "Likely",
                c: "bg-emerald-400/15 text-emerald-400 border-emerald-400/20"
              },
              {
                range: "30–60",
                label: "Plausible",
                c: "bg-accent/15 text-accent border-accent/20"
              },
              {
                range: "<30",
                label: "Insufficient",
                c: "bg-destructive/15 text-destructive border-destructive/20"
              }
            ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "flex items-center justify-between rounded border px-2 py-1.5",
                  t.c
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold", children: t.range }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] opacity-80", children: t.label })
                ]
              },
              t.range
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-mono text-sm font-semibold uppercase tracking-widest text-foreground", children: "Pipeline Status" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: [
            {
              label: "Confirmed (>80)",
              count: incidents.filter((i) => Number(i.validationScore) > 80).length,
              color: "text-primary"
            },
            {
              label: "Likely (60–80)",
              count: incidents.filter(
                (i) => Number(i.validationScore) >= 60 && Number(i.validationScore) <= 80
              ).length,
              color: "text-emerald-400"
            },
            {
              label: "Plausible (30–60)",
              count: incidents.filter(
                (i) => Number(i.validationScore) >= 30 && Number(i.validationScore) < 60
              ).length,
              color: "text-accent"
            },
            {
              label: "Insufficient (<30)",
              count: incidents.filter((i) => Number(i.validationScore) < 30).length,
              color: "text-destructive"
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
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "incidents-table-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-mono text-sm font-semibold uppercase tracking-widest text-foreground", children: "Incident Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: loadingIncidents ? "Refreshing…" : "Auto-refresh every 10s" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: loadingIncidents && incidents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-4", children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded" }, k)) }) : incidents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-3 py-12",
          "data-ocid": "incidents-empty-state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-10 w-10 text-muted-foreground/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No incidents reported yet — use the form above to submit one." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", "data-ocid": "incidents-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-6 pb-2 pl-4" }),
          [
            "Type",
            "Segment",
            "Description",
            "Reported At",
            "Val. Score",
            "Status"
          ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: "pb-2 pr-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground first:pl-4",
              children: h
            },
            h
          ))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: incidents.map((inc) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          IncidentRow,
          {
            incident: inc,
            segmentName: segmentMap.get(inc.segmentId) ?? ""
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
