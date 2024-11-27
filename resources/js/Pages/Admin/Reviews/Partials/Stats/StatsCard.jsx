import React from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import { Star, CheckCircle, AlertTriangle, MessageSquare } from "lucide-react";

const StatItem = ({ icon: Icon, label, value, trend, className }) => (
  <Card className={cn("hover:shadow-md transition-shadow", className)}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="flex items-baseline">
            <h2 className="text-2xl font-bold">{value}</h2>
            {trend !== undefined && trend !== null && (
              <span className={cn(
                "ml-2 text-sm",
                trend > 0 ? "text-green-600" : "text-red-600"
              )}>
                {trend > 0 ? "+" : ""}{Number(trend).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
        <div className={cn(
          "p-3 rounded-full",
          "bg-primary/10 text-primary"
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const StatsCard = ({ stats = {} }) => {
  // Ensure stats has default values
  const {
    averageRating = 0,
    approvedCount = 0,
    pendingCount = 0,
    totalCount = 0,
    ratingTrend = 0,
    approvedTrend = 0,
    totalTrend = 0,
  } = stats;

  // Format values to handle any type
  const formatNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatItem
        icon={Star}
        label="Average Rating"
        value={formatNumber(averageRating).toFixed(1)}
        trend={formatNumber(ratingTrend)}
      />
      <StatItem
        icon={CheckCircle}
        label="Approved Reviews"
        value={formatNumber(approvedCount)}
        trend={formatNumber(approvedTrend)}
      />
      <StatItem
        icon={AlertTriangle}
        label="Pending Reviews"
        value={formatNumber(pendingCount)}
      />
      <StatItem
        icon={MessageSquare}
        label="Total Reviews"
        value={formatNumber(totalCount)}
        trend={formatNumber(totalTrend)}
      />
    </div>
  );
};

export default StatsCard; 