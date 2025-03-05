
import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: "default" | "glass" | "outline" | "muted";
  animation?: "fade-in" | "slide-up" | "slide-down" | "slide-left" | "none";
  delay?: number;
}

const Card = ({
  title,
  description,
  icon,
  children,
  className,
  variant = "default",
  animation = "fade-in",
  delay = 0,
  ...props
}: CardProps) => {
  const baseStyles = "rounded-lg overflow-hidden transition-all duration-300";
  
  const variantStyles = {
    default: "bg-card text-card-foreground shadow-sm border",
    glass: "glassmorphism bg-opacity-40 backdrop-blur-lg border border-white/10",
    outline: "border bg-transparent",
    muted: "bg-muted/30",
  };
  
  const animationStyles = animation !== "none" ? `animate-${animation}` : "";
  const delayStyle = delay > 0 ? `animation-delay-${delay}` : "";
  
  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        animationStyles,
        delayStyle,
        className
      )}
      style={{
        animationDelay: delay > 0 ? `${delay}ms` : "",
        animationFillMode: "both",
      }}
      {...props}
    >
      <div className="p-6">
        {(title || icon) && (
          <div className="flex items-center space-x-3 mb-3">
            {icon && <div className="text-primary/80">{icon}</div>}
            {title && <h3 className="text-lg font-medium">{title}</h3>}
          </div>
        )}
        {description && <p className="text-muted-foreground text-sm mb-3">{description}</p>}
        {children}
      </div>
    </div>
  );
};

export default Card;
