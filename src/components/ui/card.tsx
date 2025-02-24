import * as React from "react";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'default' | 'large';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg",
        variant === 'elevated' && "shadow-lg",
        variant === 'bordered' && "border",
        padding === 'default' && "p-4",
        padding === 'large' && "p-6",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export { Card, CardContent };
