import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSimulationStore } from "@/lib/simulationStore";
import { RefreshCw, RotateCcw, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const [now, setNow] = useState(new Date());
  const [ticking, setTicking] = useState(false);
  const [resetting, setResetting] = useState(false);
  const { tick, resetSim, isLoading, lastUpdated } = useSimulationStore();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleTick = async () => {
    setTicking(true);
    try {
      await tick();
    } finally {
      setTicking(false);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await resetSim();
    } finally {
      setResetting(false);
    }
  };

  const timeStr = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <header
      className="flex h-14 items-center justify-between border-b border-border bg-card px-4 shadow-sm"
      data-ocid="main-header"
    >
      {/* Left: time */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="font-mono text-sm font-semibold text-foreground tabular-nums">
            {timeStr}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {dateStr}
          </span>
        </div>

        {/* Simulation status */}
        <Badge
          variant="outline"
          className="border-primary/40 bg-primary/10 font-mono text-[10px] text-primary"
          data-ocid="sim-status-badge"
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <RefreshCw className="h-2.5 w-2.5 animate-spin" />
              PROCESSING
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary pulse-glow" />
              SIM ACTIVE
            </span>
          )}
        </Badge>

        {lastUpdated && (
          <span className="hidden font-mono text-[10px] text-muted-foreground md:block">
            LAST UPDATE:{" "}
            {lastUpdated.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        )}
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleTick}
          disabled={ticking || isLoading}
          className="h-8 gap-1.5 border-primary/40 bg-primary/10 font-mono text-xs text-primary hover:bg-primary/20"
          data-ocid="btn-tick-simulation"
        >
          <Zap className="h-3.5 w-3.5" />
          TICK
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={resetting || isLoading}
          className="h-8 gap-1.5 border-border font-mono text-xs text-muted-foreground hover:border-destructive/50 hover:text-destructive"
          data-ocid="btn-reset-simulation"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          RESET
        </Button>
      </div>
    </header>
  );
}
