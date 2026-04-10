import { j as jsxRuntimeExports, b as cn } from "./index-CKUeRL-6.js";
const STATUS_CONFIG = {
  // TrafficLevel
  High: {
    bg: "bg-destructive/15",
    text: "text-destructive",
    dot: "bg-destructive"
  },
  Medium: {
    bg: "bg-accent/15",
    text: "text-accent",
    dot: "bg-accent"
  },
  Low: {
    bg: "bg-primary/15",
    text: "text-primary",
    dot: "bg-primary"
  },
  NoTraffic: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground"
  },
  // AlertSeverity
  Critical: {
    bg: "bg-destructive/15",
    text: "text-destructive",
    dot: "bg-destructive"
  },
  // SystemStatus
  Operational: {
    bg: "bg-primary/15",
    text: "text-primary",
    dot: "bg-primary"
  },
  Degraded: {
    bg: "bg-accent/15",
    text: "text-accent",
    dot: "bg-accent"
  },
  Failed: {
    bg: "bg-destructive/15",
    text: "text-destructive",
    dot: "bg-destructive"
  },
  Maintenance: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground"
  },
  // IncidentStatus
  Pending: {
    bg: "bg-accent/15",
    text: "text-accent",
    dot: "bg-accent"
  },
  Validated: {
    bg: "bg-primary/15",
    text: "text-primary",
    dot: "bg-primary"
  },
  Rejected: {
    bg: "bg-destructive/15",
    text: "text-destructive",
    dot: "bg-destructive"
  },
  Resolved: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground"
  }
};
const FALLBACK = {
  bg: "bg-muted",
  text: "text-muted-foreground",
  dot: "bg-muted-foreground"
};
function StatusBadge({ status, label, className }) {
  const config = STATUS_CONFIG[status] ?? FALLBACK;
  const displayLabel = label ?? status;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
        config.bg,
        config.text,
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("h-1.5 w-1.5 rounded-full", config.dot) }),
        displayLabel
      ]
    }
  );
}
export {
  StatusBadge as S
};
