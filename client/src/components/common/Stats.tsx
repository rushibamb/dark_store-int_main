
import React from "react";
import { cn } from "@/lib/utils";
import Card from "./Card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  change?: number;
  changeText?: string;
  changeType?: "increase" | "decrease" | "neutral";
  variant?: "default" | "glass" | "outline" | "muted";
  animation?: "fade-in" | "slide-up" | "slide-down" | "slide-left" | "none";
  delay?: number;
}

const StatsCard = ({
  title,
  value,
  description,
  icon,
  change,
  changeText,
  changeType = "neutral",
  variant = "default",
  animation = "fade-in",
  delay = 0,
}: StatsCardProps) => {
  return (
    <Card
      variant={variant}
      animation={animation}
      delay={delay}
      className="h-full"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold">{value}</p>
          </div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
          
          {(change !== undefined || changeText) && (
            <div className="mt-2">
              <div
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  {
                    "bg-success/10 text-success": changeType === "increase",
                    "bg-destructive/10 text-destructive": changeType === "decrease",
                    "bg-muted text-muted-foreground": changeType === "neutral",
                  }
                )}
              >
                {changeType === "increase" && <ArrowUpIcon className="mr-1 h-3 w-3" />}
                {changeType === "decrease" && <ArrowDownIcon className="mr-1 h-3 w-3" />}
                {change !== undefined && <span>{change}%</span>}
                {changeText && <span>{change !== undefined ? ` ${changeText}` : changeText}</span>}
              </div>
            </div>
          )}
        </div>
        {icon && <div className="p-2">{icon}</div>}
      </div>
    </Card>
  );
};

export default StatsCard;
