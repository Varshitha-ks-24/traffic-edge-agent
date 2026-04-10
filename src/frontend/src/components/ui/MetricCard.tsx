import { cn } from "@/lib/utils";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  icon?: ReactNode;
  colorClass?: string;
  className?: string;
  "data-ocid"?: string;
}

const TREND_ICON = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const TREND_COLOR = {
  up: "text-destructive",
  down: "text-primary",
  neutral: "text-muted-foreground",
};

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  colorClass,
  className,
  "data-ocid": dataOcid,
}: MetricCardProps) {
  const TrendIcon = trend ? TREND_ICON[trend] : null;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 rounded-lg border border-border bg-card p-4 transition-smooth hover:border-primary/30",
        className,
      )}
      data-ocid={dataOcid}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {title}
        </span>
        {icon && (
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md bg-muted",
              colorClass,
            )}
          >
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end gap-2">
        <span
          className={cn(
            "font-display text-2xl font-bold leading-none tabular-nums text-foreground",
            colorClass,
          )}
        >
          {value}
        </span>
        {TrendIcon && (
          <span className={cn("mb-0.5", TREND_COLOR[trend!])}>
            <TrendIcon className="h-4 w-4" />
          </span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <span className="font-mono text-[10px] text-muted-foreground">
          {subtitle}
        </span>
      )}
    </div>
  );
}
