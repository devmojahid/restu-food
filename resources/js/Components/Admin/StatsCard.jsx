import React from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";

const StatsCard = ({ title, value = 0, icon: Icon, trend, className, description, actions }) => {
  // Ensure value is a number or default to 0
  const displayValue = isNaN(Number(value)) ? 0 : Number(value);

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {title && <p className="text-sm font-medium text-muted-foreground">{title}</p>}
            <div className="flex items-baseline">
              <h2 className="text-2xl font-bold">{displayValue}</h2>
              {trend !== undefined && trend !== null && (
                <span className={cn(
                  "ml-2 text-sm",
                  trend > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {trend > 0 ? "+" : ""}{Number(trend).toFixed(1)}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {Icon && (
            <div className={cn(
              "p-3 rounded-full",
              "bg-primary/10 text-primary"
            )}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
        {actions && (
          <div className="mt-4 flex items-center justify-end space-x-2">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard; 