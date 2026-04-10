import { c as createLucideIcon, k as useActor, u as useSimulationStore, r as reactExports, j as jsxRuntimeExports, N as Navigation, B as Button, l as RefreshCw, b as TriangleAlert, S as Skeleton, d as cn, i as Badge, m as createActor } from "./index-Cjz6nUaB.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, S as Select, d as SelectTrigger, e as SelectValue, f as SelectContent, g as SelectItem } from "./select-ZyWqcy_t.js";
import { F as FALLBACK_SEGMENTS, g as getSegments, a as getRoutes, c as computeOptimalRoute, A as ALL_DISTRICTS, C as CircleCheck } from "./trafficApi-j32R7f3i.js";
import { L as LoaderCircle, C as ChevronRight } from "./loader-circle-CqN2rNCD.js";
import { M as MapPin } from "./map-pin-C4cqLpZE.js";
import { C as Clock } from "./clock-CMKEL1lg.js";
import "./index-CGA5l0LD.js";
import "./chevron-up-C0PR9Nhi.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$3);
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
      d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
      key: "l5xja"
    }
  ],
  [
    "path",
    {
      d: "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",
      key: "ep3f8r"
    }
  ],
  ["path", { d: "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4", key: "1p4c4q" }],
  ["path", { d: "M17.599 6.5a3 3 0 0 0 .399-1.375", key: "tmeiqw" }],
  ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5", key: "105sqy" }],
  ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396", key: "ql3yin" }],
  ["path", { d: "M19.938 10.5a4 4 0 0 1 .585.396", key: "1qfode" }],
  ["path", { d: "M6 18a4 4 0 0 1-1.967-.516", key: "2e4loj" }],
  ["path", { d: "M19.967 17.484A4 4 0 0 1 18 18", key: "159ez6" }]
];
const Brain = createLucideIcon("brain", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "6", cy: "19", r: "3", key: "1kj8tv" }],
  ["path", { d: "M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15", key: "1d8sl" }],
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }]
];
const Route = createLucideIcon("route", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
];
const Wifi = createLucideIcon("wifi", __iconNode);
const CONGESTION_RED = 70;
const CONGESTION_AMBER = 35;
function congestionColor(pct) {
  if (pct >= CONGESTION_RED) return "oklch(0.62 0.24 24)";
  if (pct >= CONGESTION_AMBER) return "oklch(0.72 0.23 55)";
  return "oklch(0.62 0.25 195)";
}
function congestionLabel(pct) {
  if (pct >= CONGESTION_RED) return "Critical";
  if (pct >= CONGESTION_AMBER) return "Moderate";
  return "Clear";
}
function congestionBg(pct) {
  if (pct >= CONGESTION_RED) return "bg-destructive/70";
  if (pct >= CONGESTION_AMBER) return "bg-accent/70";
  return "bg-primary/70";
}
function congestionBadgeVariant(label) {
  if (label === "Critical")
    return "border-destructive/40 bg-destructive/15 text-destructive";
  if (label === "Moderate") return "border-accent/40 bg-accent/15 text-accent";
  return "border-primary/40 bg-primary/15 text-primary";
}
function WaypointChain({ segments }) {
  if (!segments.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-1.5 mt-3", children: segments.map((seg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded bg-primary/10 border border-primary/20 px-2 py-0.5 font-mono text-[10px] text-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-2.5 w-2.5 shrink-0" }),
      seg
    ] }),
    i < segments.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 shrink-0 text-muted-foreground" })
  ] }, seg)) });
}
function OptimalRoutePanel({ route }) {
  const avgCong = route.segments.length > 3 ? 55 : 20;
  const congLabel = congestionLabel(avgCong);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-primary/40 bg-primary/5 glow-cyan scan-line-container overflow-hidden",
      "data-ocid": "optimal-route-panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-primary/10 border-b border-primary/20 px-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-primary", children: "Optimal Route Found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: "ml-auto border-primary/50 bg-primary/20 font-mono text-[9px] text-primary",
              variant: "outline",
              children: "✓ RECOMMENDED"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-bold text-foreground", children: route.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-1.5 font-mono text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: route.fromDistrict }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: route.toDistrict })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card/60 p-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-2xl font-bold tabular-nums text-primary", children: [
                route.totalDistance.toFixed(1),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-0.5 font-mono text-[10px] font-normal text-muted-foreground", children: "km" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground", children: "Distance" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card/60 p-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-2xl font-bold tabular-nums text-accent", children: [
                Number(route.estimatedMinutes),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-0.5 font-mono text-[10px] font-normal text-muted-foreground", children: "min" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground", children: "Est. Time" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card/60 p-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn(
                    "font-mono text-sm font-bold",
                    congestionBadgeVariant(congLabel).split(" ").find((c) => c.startsWith("text-"))
                  ),
                  children: congLabel
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground", children: "Congestion" })
            ] })
          ] }),
          route.segments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1", children: "Waypoints" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(WaypointChain, { segments: route.segments })
          ] }),
          route.reasoning && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg border border-primary/20 bg-background/70 p-4 relative",
              "data-ocid": "ai-reasoning-card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-4 w-4 text-primary shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-primary font-bold", children: "AI Reasoning" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 top-0 bottom-0 w-0.5 bg-primary/40 rounded-full" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("blockquote", { className: "pl-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-sm leading-relaxed text-foreground/90 italic", children: [
                    "“",
                    route.reasoning,
                    "”"
                  ] }) })
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function AlternativeRouteCard({
  route,
  rank
}) {
  const congPct = route.segments.length > 3 ? 55 : 20 + rank * 10;
  const label = congestionLabel(congPct);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "rounded-lg border bg-card/50 p-3 flex items-start gap-3 transition-smooth hover:border-border/80",
        route.isOptimal ? "border-primary/30 bg-primary/5" : "border-border/50"
      ),
      "data-ocid": "alt-route-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono text-[10px] font-bold",
              route.isOptimal ? "bg-primary/20 text-primary" : "bg-muted/60 text-muted-foreground"
            ),
            children: rank
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "font-body text-sm font-medium truncate",
                  route.isOptimal ? "text-primary" : "text-foreground"
                ),
                children: route.name
              }
            ),
            route.isOptimal && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: "border-primary/40 bg-primary/15 font-mono text-[9px] text-primary",
                variant: "outline",
                children: "OPTIMAL"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[11px] tabular-nums text-foreground", children: [
              route.totalDistance.toFixed(1),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "km" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[11px] tabular-nums text-foreground", children: [
              Number(route.estimatedMinutes),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "min" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: cn(
                  "font-mono text-[10px] px-1.5 py-0.5 rounded border",
                  congestionBadgeVariant(label)
                ),
                children: [
                  congPct,
                  "% — ",
                  label
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function CongestionHeatmap({ segments }) {
  if (!segments.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-32 font-mono text-xs text-muted-foreground", children: "Awaiting segment data…" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "congestion-heatmap", children: segments.map((seg) => {
    const pct = Number(seg.congestionPct);
    const label = congestionLabel(pct);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground w-32 shrink-0 truncate", children: seg.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 h-4 rounded-sm bg-muted/30 overflow-hidden relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "h-full rounded-sm transition-all duration-700",
              congestionBg(pct)
            ),
            style: { width: `${Math.min(pct, 100)}%` }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "absolute right-2 top-0 bottom-0 flex items-center font-mono text-[9px] font-bold",
            style: { color: congestionColor(pct) },
            children: [
              pct,
              "%"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[10px] w-14 shrink-0 text-right",
          style: { color: congestionColor(pct) },
          children: label
        }
      )
    ] }, seg.id);
  }) });
}
function TravelTimeChart({ routes }) {
  if (!routes.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-32 font-mono text-xs text-muted-foreground", children: "No route data yet." });
  }
  const maxTime = Math.max(...routes.map((r) => Number(r.estimatedMinutes)));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", "data-ocid": "travel-time-chart", children: routes.map((route, i) => {
    const mins = Number(route.estimatedMinutes);
    const pct = maxTime > 0 ? mins / maxTime * 100 : 0;
    const isOptimal = route.isOptimal;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground w-32 shrink-0 truncate", children: route.name.length > 16 ? `${route.name.slice(0, 14)}…` : route.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 h-5 rounded-sm bg-muted/30 overflow-hidden relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "h-full rounded-sm transition-all duration-700",
              isOptimal ? "bg-primary/70" : i % 2 === 0 ? "bg-secondary/60" : "bg-muted/60"
            ),
            style: { width: `${pct}%` }
          }
        ),
        isOptimal && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "absolute left-2 top-0 bottom-0 my-auto h-3 w-3 text-primary" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: cn(
            "font-mono text-[11px] tabular-nums w-16 shrink-0 text-right",
            isOptimal ? "text-primary font-bold" : "text-muted-foreground"
          ),
          children: [
            mins,
            " min"
          ]
        }
      )
    ] }, route.id);
  }) });
}
function Routing() {
  const { actor, isFetching: actorLoading } = useActor(createActor);
  const snapshot = useSimulationStore((s) => s.snapshot);
  const lastUpdated = useSimulationStore((s) => s.lastUpdated);
  const [routes, setRoutes] = reactExports.useState([]);
  const [segments, setSegments] = reactExports.useState(FALLBACK_SEGMENTS);
  const [isLoadingRoutes, setIsLoadingRoutes] = reactExports.useState(true);
  const [fromDistrict, setFromDistrict] = reactExports.useState("");
  const [toDistrict, setToDistrict] = reactExports.useState("");
  const [computedRoute, setComputedRoute] = reactExports.useState(
    void 0
  );
  const computedRouteRef = reactExports.useRef(void 0);
  const updateComputedRoute = reactExports.useCallback((r) => {
    computedRouteRef.current = r;
    setComputedRoute(r);
  }, []);
  const [isComputing, setIsComputing] = reactExports.useState(false);
  const intervalRef = reactExports.useRef(null);
  const loadData = reactExports.useCallback(async () => {
    const [s] = await Promise.all([getSegments(actor)]);
    setSegments(s);
    if (actor) {
      try {
        const r = await getRoutes(actor);
        setRoutes(r);
      } catch {
      }
    }
    setIsLoadingRoutes(false);
  }, [actor]);
  reactExports.useEffect(() => {
    loadData();
  }, [loadData]);
  reactExports.useEffect(() => {
    if (actorLoading || !actor) return;
    intervalRef.current = setInterval(loadData, 1e4);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [actor, actorLoading, loadData]);
  reactExports.useEffect(() => {
    if (!snapshot || !computedRouteRef.current) return;
    const { fromDistrict: from, toDistrict: to } = computedRouteRef.current;
    if (!from || !to) return;
    computeOptimalRoute(actor, from, to, segments).then((r) => updateComputedRoute(r)).catch(() => {
    });
  }, [snapshot, actor, segments, updateComputedRoute]);
  const handleCompute = async () => {
    if (!fromDistrict || !toDistrict || fromDistrict === toDistrict) return;
    setIsComputing(true);
    updateComputedRoute(void 0);
    try {
      const result = await computeOptimalRoute(
        actor,
        fromDistrict,
        toDistrict,
        segments
      );
      updateComputedRoute(result);
    } catch {
      updateComputedRoute(null);
    } finally {
      setIsComputing(false);
    }
  };
  const sameDistrict = fromDistrict && toDistrict && fromDistrict === toDistrict;
  const alternativeRoutes = routes.filter(
    (r) => !computedRoute || r.id !== computedRoute.id
  );
  const formattedLastUpdate = lastUpdated ? lastUpdated.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-6", "data-ocid": "routing-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Adaptive Vehicle Rerouting Engine" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-body text-sm text-muted-foreground", children: "Graph-based pathfinding (A*/Dijkstra) with real-time congestion awareness" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        formattedLastUpdate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1.5 rounded border border-primary/20 bg-primary/5 px-3 py-1.5",
            "data-ocid": "realtime-indicator",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "h-3 w-3 text-primary pulse-glow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-primary", children: "LIVE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground ml-1", children: formattedLastUpdate })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "gap-2 border-border bg-muted font-mono text-xs text-muted-foreground hover:border-primary/40 hover:text-primary",
            "data-ocid": "refresh-routes-btn",
            onClick: loadData,
            size: "sm",
            variant: "outline",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
              "Refresh"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "route-planner-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { className: "h-4 w-4 text-primary" }),
        "Route Planner"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "From" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                onValueChange: (v) => setFromDistrict(v),
                value: fromDistrict,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      "aria-label": "Select origin district",
                      className: "border-input bg-background font-body text-sm",
                      "data-ocid": "from-district-select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select origin…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ALL_DISTRICTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "To" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                onValueChange: (v) => setToDistrict(v),
                value: toDistrict,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      "aria-label": "Select destination district",
                      className: "border-input bg-background font-body text-sm",
                      "data-ocid": "to-district-select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select destination…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ALL_DISTRICTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "gap-2 font-mono text-xs whitespace-nowrap",
              "data-ocid": "find-optimal-route-btn",
              disabled: !fromDistrict || !toDistrict || !!sameDistrict || isComputing,
              onClick: handleCompute,
              children: [
                isComputing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-3.5 w-3.5" }),
                isComputing ? "Computing…" : "Find Optimal Route"
              ]
            }
          ) })
        ] }),
        sameDistrict && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 font-mono text-[11px] text-destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
          "Origin and destination must be different districts."
        ] }),
        isComputing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", "data-ocid": "route-loading-state", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-2/5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" })
        ] }),
        !isComputing && computedRoute !== void 0 && computedRoute !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(OptimalRoutePanel, { route: computedRoute }),
        !isComputing && computedRoute === null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 font-mono text-xs text-accent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 shrink-0" }),
          "No route found between selected districts. Try a different pair."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "alt-routes-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: "Alternative Routes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto font-mono text-[10px] text-muted-foreground", children: [
          routes.length,
          " available"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoadingRoutes ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-lg" }, i)) }) : routes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-2 py-10 text-center",
          "data-ocid": "alt-routes-empty-state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { className: "h-8 w-8 text-muted-foreground/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No routes available — run a simulation tick to generate data." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: (computedRoute ? alternativeRoutes : routes).map((route, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        AlternativeRouteCard,
        {
          route,
          rank: i + 1
        },
        route.id
      )) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "border-border bg-card",
          "data-ocid": "congestion-heatmap-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
                "Congestion Heatmap"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-3 pt-1", children: [
                { cls: "bg-destructive/70", label: "Critical" },
                { cls: "bg-accent/70", label: "Moderate" },
                { cls: "bg-primary/70", label: "Clear" }
              ].map(({ cls, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: cn("h-2 w-3 rounded-sm inline-block", cls)
                      }
                    ),
                    label
                  ]
                },
                label
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CongestionHeatmap, { segments }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "border-border bg-card",
          "data-ocid": "travel-time-chart-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-primary" }),
              "Travel Time Comparison"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoadingRoutes ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-full rounded" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TravelTimeChart, { routes }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  Routing
};
