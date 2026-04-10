import { c as createLucideIcon, g as useActor, r as reactExports, j as jsxRuntimeExports, e as Siren, A as Activity, Z as Zap, S as Skeleton, B as Button, a as cn, k as createActor } from "./index-B2saiLCY.js";
import { M as MetricCard } from "./MetricCard-Dc_yh-OV.js";
import { R as ResponsiveContainer, C as Cell, T as Tooltip, o as Legend, S as StatusBadge } from "./generateCategoricalChart-BlZ_UpE5.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, S as Select, d as SelectTrigger, e as SelectValue, f as SelectContent, g as SelectItem } from "./select-DV-QCRQR.js";
import { d as getEmergencyAlerts, b as getSegments, e as acknowledgeEmergency, t as triggerEmergencySimulation } from "./trafficApi-Cx6Z_Vgx.js";
import { u as ue } from "./index-CaOJaaq8.js";
import { C as Clock, a as CircleCheck } from "./clock-r8C7qKsq.js";
import { P as PieChart, a as Pie } from "./PieChart-B-GvIRzw.js";
import "./chevron-up-Cp4dxTJd.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 16h.01", key: "1drbdi" }],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  [
    "path",
    {
      d: "M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z",
      key: "1fd625"
    }
  ]
];
const OctagonAlert = createLucideIcon("octagon-alert", __iconNode);
const INTERSECTIONS = [
  { id: "I-01", label: "Main & 1st" },
  { id: "I-02", label: "Park & Oak" },
  { id: "I-03", label: "River & 5th" },
  { id: "I-04", label: "Central Blvd" }
];
function SignalHead({
  lights,
  label,
  priority
}) {
  const colorMap = {
    red: "bg-destructive",
    amber: "bg-accent",
    green: "bg-primary"
  };
  const dimMap = {
    red: "bg-destructive/20",
    amber: "bg-accent/20",
    green: "bg-primary/20"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3 transition-smooth",
        priority && "border-primary/60 ring-1 ring-primary/30"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-1 rounded-md bg-muted/60 p-1.5", children: lights.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "h-4 w-4 rounded-full",
              l.active ? colorMap[l.color] : dimMap[l.color],
              l.active && l.color === "green" && "shadow-[0_0_8px_2px_oklch(0.62_0.25_195_/_0.5)]",
              l.active && l.color === "red" && "shadow-[0_0_8px_2px_oklch(0.62_0.24_24_/_0.5)]"
            )
          },
          l.color
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-center font-mono text-[9px] text-muted-foreground", children: label }),
        priority && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-primary/15 px-1 py-0.5 font-mono text-[8px] font-bold uppercase text-primary", children: "PRIORITY" })
      ]
    }
  );
}
function TrafficSignalGrid({ hasEmergency }) {
  const [priorityIdx, setPriorityIdx] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!hasEmergency) return;
    const id = setInterval(() => {
      setPriorityIdx((p) => (p + 1) % INTERSECTIONS.length);
    }, 1500);
    return () => clearInterval(id);
  }, [hasEmergency]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "border-b border-border pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-accent" }),
      "Adaptive Signal Control",
      hasEmergency && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto flex items-center gap-1 rounded bg-destructive/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-ping rounded-full bg-destructive" }),
        "EMERGENCY MODE"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-3", children: INTERSECTIONS.map((inter, idx) => {
        const isPriority = hasEmergency && idx === priorityIdx;
        const isCleared = hasEmergency && idx !== priorityIdx;
        const lights = isPriority ? [
          { color: "red", active: false },
          { color: "amber", active: false },
          { color: "green", active: true }
        ] : isCleared ? [
          { color: "red", active: true },
          { color: "amber", active: false },
          { color: "green", active: false }
        ] : [
          { color: "red", active: false },
          { color: "amber", active: true },
          { color: "green", active: false }
        ];
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          SignalHead,
          {
            lights,
            label: inter.label,
            priority: isPriority
          },
          inter.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 font-mono text-[10px] text-muted-foreground", children: hasEmergency ? "Emergency corridor cleared — all cross-traffic halted. Priority path illuminated." : "Normal operation — adaptive timing active across all intersections." })
    ] })
  ] });
}
const VEHICLE_ICONS = {
  Ambulance: "🚑",
  "Fire Truck": "🚒",
  Police: "🚓",
  Hazmat: "☢️"
};
function EmergencyAlertCard({
  alert,
  onAcknowledge,
  acknowledging
}) {
  const priority = Number(alert.priority);
  const pct = Math.min(100, priority / 10 * 100);
  const barColor = priority >= 8 ? "bg-destructive" : priority >= 5 ? "bg-accent" : "bg-primary";
  const ts = Number(alert.triggeredAt);
  const triggeredDate = new Date(ts > 1e12 ? ts / 1e6 : ts * 1e3);
  const timeStr = Number.isNaN(triggeredDate.getTime()) ? "—" : triggeredDate.toLocaleTimeString();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-lg border border-destructive/40 bg-destructive/10 p-4",
      "data-ocid": "emergency-alert-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20 text-xl", children: VEHICLE_ICONS[alert.vehicleType] ?? "🚨" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Siren, { className: "h-3.5 w-3.5 text-destructive" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold text-foreground", children: alert.vehicleType }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: "Critical" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 font-mono text-[11px] text-muted-foreground", children: [
                "Segment:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: alert.segmentId }),
                " · Triggered: ",
                timeStr
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "border-primary/40 text-primary hover:bg-primary/10",
              onClick: () => onAcknowledge(alert.id),
              disabled: acknowledging,
              "data-ocid": "emergency-acknowledge-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-1.5 h-3.5 w-3.5" }),
                acknowledging ? "Acknowledging…" : "Acknowledge"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-foreground/80", children: alert.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Priority Level" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[11px] font-bold text-foreground", children: [
              priority,
              "/10"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn("h-full rounded-full transition-all", barColor),
              style: { width: `${pct}%` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-md border border-border bg-muted/50 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground", children: "Recommended Action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground", children: alert.recommendedAction })
        ] })
      ]
    }
  );
}
const PIE_COLORS = [
  "oklch(0.62 0.25 195)",
  "oklch(0.72 0.23 55)",
  "oklch(0.62 0.24 24)",
  "oklch(0.68 0.18 110)",
  "oklch(0.55 0.15 280)"
];
function Emergency() {
  const { actor, isFetching } = useActor(createActor);
  const [alerts, setAlerts] = reactExports.useState([]);
  const [segments, setSegments] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [acknowledging, setAcknowledging] = reactExports.useState(null);
  const [selectedSegment, setSelectedSegment] = reactExports.useState("");
  const [vehicleType, setVehicleType] = reactExports.useState("Ambulance");
  const [triggering, setTriggering] = reactExports.useState(false);
  const [lastTriggered, setLastTriggered] = reactExports.useState(
    null
  );
  const prevAlertIds = reactExports.useRef(/* @__PURE__ */ new Set());
  const fetchAlerts = reactExports.useCallback(async () => {
    if (!actor) return;
    try {
      const [allAlerts, segs] = await Promise.all([
        getEmergencyAlerts(actor, false),
        getSegments(actor)
      ]);
      for (const a of allAlerts.filter(
        (a2) => a2.isActive && !prevAlertIds.current.has(a2.id)
      )) {
        ue.error(`🚨 Emergency: ${a.vehicleType} on ${a.segmentId}`, {
          description: a.description,
          duration: 6e3
        });
      }
      prevAlertIds.current = new Set(allAlerts.map((a) => a.id));
      setAlerts(allAlerts);
      setSegments(segs);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [actor]);
  reactExports.useEffect(() => {
    if (!actor || isFetching) return;
    fetchAlerts();
    const id = setInterval(fetchAlerts, 5e3);
    return () => clearInterval(id);
  }, [actor, isFetching, fetchAlerts]);
  const handleAcknowledge = reactExports.useCallback(
    async (alertId) => {
      if (!actor) return;
      setAcknowledging(alertId);
      try {
        await acknowledgeEmergency(actor, alertId);
        ue.success("Emergency acknowledged");
        await fetchAlerts();
      } catch {
        ue.error("Failed to acknowledge emergency");
      } finally {
        setAcknowledging(null);
      }
    },
    [actor, fetchAlerts]
  );
  const handleTrigger = reactExports.useCallback(async () => {
    if (!actor || !selectedSegment) {
      ue.error("Select a segment first");
      return;
    }
    setTriggering(true);
    setLastTriggered(null);
    try {
      const result = await triggerEmergencySimulation(
        actor,
        selectedSegment,
        vehicleType
      );
      setLastTriggered(result);
      ue.success(`Emergency simulation triggered: ${result.vehicleType}`);
      await fetchAlerts();
    } catch {
      ue.error("Failed to trigger emergency simulation");
    } finally {
      setTriggering(false);
    }
  }, [actor, selectedSegment, vehicleType, fetchAlerts]);
  const activeAlerts = alerts.filter((a) => a.isActive);
  const resolvedAlerts = alerts.filter((a) => !a.isActive);
  const hasEmergency = activeAlerts.length > 0;
  const typeCounts = alerts.reduce((acc, a) => {
    acc[a.vehicleType] = (acc[a.vehicleType] ?? 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(typeCounts).map(([name, value]) => ({
    name,
    value
  }));
  const signalAdjustments = activeAlerts.length * 4 + resolvedAlerts.length * 2;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-6", "data-ocid": "emergency-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Emergency Detection & Priority Response" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-mono text-xs text-muted-foreground", children: "AI-powered detection of emergency vehicles, accidents, and hazardous scenarios" })
    ] }),
    hasEmergency && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 rounded-lg border border-destructive/60 bg-destructive/10 px-4 py-3",
        "data-ocid": "emergency-active-banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Siren, { className: "h-5 w-5 animate-pulse text-destructive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "pulse-glow font-mono text-sm font-bold uppercase tracking-widest text-destructive", children: [
            "⚠ EMERGENCY ACTIVE — ",
            activeAlerts.length,
            " incident",
            activeAlerts.length !== 1 ? "s" : "",
            " in progress"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Active Emergencies",
          value: loading ? "—" : activeAlerts.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonAlert, { className: "h-4 w-4 text-destructive" }),
          colorClass: hasEmergency ? "text-destructive" : void 0,
          "data-ocid": "metric-active-emergencies"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Total This Session",
          value: loading ? "—" : alerts.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-primary" }),
          "data-ocid": "metric-total-emergencies"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Avg Response Time",
          value: "2.3 min",
          subtitle: "simulated estimate",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-accent" }),
          "data-ocid": "metric-avg-response"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Signal Adjustments",
          value: loading ? "—" : signalAdjustments,
          subtitle: "intersections reconfigured",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-accent" }),
          "data-ocid": "metric-signal-adjustments"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "active-emergencies-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground", children: "Active Emergency Alerts" }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-lg" })
      ] }) : activeAlerts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card py-10",
          "data-ocid": "empty-active-emergencies",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-8 w-8 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground", children: "No active emergencies — all clear" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: activeAlerts.map((alert) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmergencyAlertCard,
        {
          alert,
          onAcknowledge: handleAcknowledge,
          acknowledging: acknowledging === alert.id
        },
        alert.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "trigger-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "border-b border-border pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Siren, { className: "h-4 w-4 text-destructive" }),
          "Trigger Emergency Simulation"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "segment-select",
                className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                children: "Segment"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: selectedSegment,
                onValueChange: setSelectedSegment,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      id: "segment-select",
                      className: "border-input bg-background font-mono text-xs",
                      "data-ocid": "trigger-segment-select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select segment…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    segments.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      SelectItem,
                      {
                        value: s.id,
                        className: "font-mono text-xs",
                        children: [
                          s.name,
                          " — ",
                          s.district
                        ]
                      },
                      s.id
                    )),
                    segments.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__loading", disabled: true, children: "Loading segments…" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "vehicle-select",
                className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                children: "Vehicle Type"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: vehicleType, onValueChange: setVehicleType, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  id: "vehicle-select",
                  className: "border-input bg-background font-mono text-xs",
                  "data-ocid": "trigger-vehicle-select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["Ambulance", "Fire Truck", "Police", "Hazmat"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: v, className: "font-mono text-xs", children: v }, v)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "w-full",
              variant: "destructive",
              onClick: handleTrigger,
              disabled: triggering || !selectedSegment,
              "data-ocid": "trigger-emergency-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Siren, { className: "mr-2 h-4 w-4" }),
                triggering ? "Triggering…" : "Trigger Emergency"
              ]
            }
          ),
          lastTriggered && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-md border border-primary/30 bg-primary/10 p-3",
              "data-ocid": "trigger-confirmation",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 font-mono text-[9px] uppercase tracking-widest text-primary", children: "Simulation Triggered" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "ID:" }),
                  " ",
                  lastTriggered.id
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Vehicle:" }),
                  " ",
                  lastTriggered.vehicleType,
                  " · Priority",
                  " ",
                  String(lastTriggered.priority),
                  "/10"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-foreground/80", children: lastTriggered.recommendedAction })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TrafficSignalGrid, { hasEmergency })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "border-b border-border pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: "Emergency Type Breakdown" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", children: pieData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-8 text-center font-mono text-xs text-muted-foreground", children: "No data yet — trigger a simulation to populate" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Pie,
            {
              data: pieData,
              cx: "50%",
              cy: "50%",
              innerRadius: 55,
              outerRadius: 80,
              paddingAngle: 3,
              dataKey: "value",
              children: pieData.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Cell,
                {
                  fill: PIE_COLORS[index % PIE_COLORS.length]
                },
                entry.name
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Tooltip,
            {
              contentStyle: {
                background: "oklch(0.12 0 0)",
                border: "1px solid oklch(0.22 0 0)",
                borderRadius: "6px",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "11px"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Legend,
            {
              iconType: "circle",
              iconSize: 8,
              wrapperStyle: {
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "10px"
              }
            }
          )
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "border-b border-border pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: "Response Statistics" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4 pt-4", children: [
          {
            label: "Active Incidents",
            value: activeAlerts.length,
            color: "text-destructive"
          },
          {
            label: "Resolved",
            value: resolvedAlerts.length,
            color: "text-primary"
          },
          {
            label: "Signal Adjustments",
            value: signalAdjustments,
            color: "text-accent"
          },
          {
            label: "Avg Response Time",
            value: "2.3 min",
            color: "text-foreground"
          }
        ].map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: row.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn("font-display text-lg font-bold", row.color),
                  children: row.value
                }
              )
            ]
          },
          row.label
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "emergency-log-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground", children: "Emergency Log" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/40", children: [
          "ID",
          "Type",
          "Segment",
          "Priority",
          "Triggered At",
          "Status",
          "Action"
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "px-4 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest text-muted-foreground",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? ["r0", "r1", "r2"].map((rk) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: ["c0", "c1", "c2", "c3", "c4", "c5", "c6"].map((ck) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16" }) }, ck)) }, rk)) : alerts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 7,
            className: "px-4 py-8 text-center font-mono text-xs text-muted-foreground",
            "data-ocid": "empty-log",
            children: "No emergency records yet"
          }
        ) }) : alerts.map((alert) => {
          const ts = Number(alert.triggeredAt);
          const d = new Date(ts > 1e12 ? ts / 1e6 : ts * 1e3);
          const timeStr = Number.isNaN(d.getTime()) ? "—" : d.toLocaleTimeString();
          const prio = Number(alert.priority);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border transition-colors hover:bg-muted/30",
              "data-ocid": "emergency-log-row",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 font-mono text-[10px] text-muted-foreground", children: [
                  alert.id.slice(0, 8),
                  "…"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium text-foreground", children: alert.vehicleType }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-[10px] text-muted-foreground", children: alert.segmentId }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-mono tabular-nums", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: prio >= 8 ? "text-destructive" : prio >= 5 ? "text-accent" : "text-primary",
                    children: [
                      String(alert.priority),
                      "/10"
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-[10px] text-muted-foreground", children: timeStr }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatusBadge,
                  {
                    status: alert.isActive ? "Critical" : "Resolved",
                    label: alert.isActive ? "Active" : "Resolved"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "max-w-[180px] truncate px-4 py-2.5 text-[10px] text-muted-foreground", children: alert.recommendedAction })
              ]
            },
            alert.id
          );
        }) })
      ] }) }) })
    ] })
  ] });
}
export {
  Emergency
};
