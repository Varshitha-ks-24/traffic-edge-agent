import { c as createLucideIcon, j as jsxRuntimeExports, d as cn } from "./index-Cjz6nUaB.js";
import { T as TrendingUp } from "./trending-up-BRz5CwNs.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M17 20v2", key: "1rnc9c" }],
  ["path", { d: "M17 2v2", key: "11trls" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M2 17h2", key: "7oei6x" }],
  ["path", { d: "M2 7h2", key: "asdhe0" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "M20 17h2", key: "1fpfkl" }],
  ["path", { d: "M20 7h2", key: "1o8tra" }],
  ["path", { d: "M7 20v2", key: "4gnj0m" }],
  ["path", { d: "M7 2v2", key: "1i4yhu" }],
  ["rect", { x: "4", y: "4", width: "16", height: "16", rx: "2", key: "1vbyd7" }],
  ["rect", { x: "8", y: "8", width: "8", height: "8", rx: "1", key: "z9xiuo" }]
];
const Cpu = createLucideIcon("cpu", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode);
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
  Cpu as C,
  MetricCard as M,
  TrendingDown as T
};
