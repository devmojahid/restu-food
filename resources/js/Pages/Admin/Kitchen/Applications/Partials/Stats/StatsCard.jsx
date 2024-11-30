import React from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import { ChefHat, CheckCircle, Clock, XCircle } from "lucide-react";

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
                {trend > 0 ? "+" : ""}{trend}%
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
  const {
    totalApplications = 0,
    pendingApplications = 0,
    approvedApplications = 0,
    rejectedApplications = 0,
    applicationTrend = 0,
  } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatItem
        icon={ChefHat}
        label="Total Applications"
        value={totalApplications}
        trend={applicationTrend}
      />
      <StatItem
        icon={Clock}
        label="Pending Review"
        value={pendingApplications}
      />
      <StatItem
        icon={CheckCircle}
        label="Approved"
        value={approvedApplications}
      />
      <StatItem
        icon={XCircle}
        label="Rejected"
        value={rejectedApplications}
      />
    </div>
  );
};

export default StatsCard; 