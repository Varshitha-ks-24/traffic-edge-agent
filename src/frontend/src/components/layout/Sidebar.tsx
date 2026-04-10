import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  FileText,
  LayoutDashboard,
  Navigation,
  Radio,
  Siren,
} from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/anomalies", label: "Anomaly Detection", icon: AlertTriangle },
  { to: "/routing", label: "Adaptive Routing", icon: Navigation },
  { to: "/emergency", label: "Emergency Response", icon: Siren },
  { to: "/incidents", label: "Incident Reports", icon: FileText },
  { to: "/monitor", label: "System Health", icon: Activity },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-card">
      {/* Logo / brand */}
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Radio className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display text-sm font-bold tracking-widest text-foreground">
              AETA
            </p>
            <p className="font-mono text-[9px] leading-tight text-muted-foreground">
              AUTONOMOUS TRAFFIC AGENT
            </p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-2 py-3" data-ocid="sidebar-nav">
        <ul className="space-y-0.5">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground"
                activeProps={{
                  className:
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-primary bg-primary/10 border-l-2 border-primary transition-smooth",
                }}
                inactiveProps={{
                  className:
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground",
                }}
                data-ocid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* System online indicator */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            SYSTEM ONLINE
          </span>
        </div>
      </div>
    </aside>
  );
}
