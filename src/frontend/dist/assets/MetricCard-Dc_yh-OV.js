import { c as createLucideIcon, j as jsxRuntimeExports, a as cn } from "./index-B2saiLCY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
const TREND_ICON = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus
};
const TREND_COLOR = {
  up: "text-destructive",
  down: "text-primary",
  neutral: "text-muted-foreground"
};
function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  colorClass,
  className,
  "data-ocid": dataOcid
}) {
  const TrendIcon = trend ? TREND_ICON[trend] : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "relative flex flex-col gap-2 rounded-lg border border-border bg-card p-4 transition-smooth hover:border-primary/30",
        className
      ),
      "data-ocid": dataOcid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: title }),
          icon && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "flex h-7 w-7 items-center justify-center rounded-md bg-muted",
                colorClass
              ),
              children: icon
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "font-display text-2xl font-bold leading-none tabular-nums text-foreground",
                colorClass
              ),
              children: value
            }
          ),
          TrendIcon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("mb-0.5", TREND_COLOR[trend]), children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendIcon, { className: "h-4 w-4" }) })
        ] }),
        subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: subtitle })
      ]
    }
  );
}
export {
  MetricCard as M
};
