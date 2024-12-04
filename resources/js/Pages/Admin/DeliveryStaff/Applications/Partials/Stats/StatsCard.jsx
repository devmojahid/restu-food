import React from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import { Truck, CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";

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
    total_applications = 0,
    pending_applications = 0,
    approved_applications = 0,
    rejected_applications = 0,
    under_review = 0,
  } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <StatItem
        icon={Truck}
        label="Total Applications"
        value={total_applications}
      />
      <StatItem
        icon={Clock}
        label="Pending Review"
        value={pending_applications}
      />
      <StatItem
        icon={AlertTriangle}
        label="Under Review"
        value={under_review}
      />
      <StatItem
        icon={CheckCircle}
        label="Approved"
        value={approved_applications}
      />
      <StatItem
        icon={XCircle}
        label="Rejected"
        value={rejected_applications}
      />
    </div>
  );
};

export default StatsCard; 