import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const statusConfig = {
  pending: { icon: Clock, className: "text-yellow-500" },
  approved: { icon: CheckCircle, className: "text-green-500" },
  rejected: { icon: XCircle, className: "text-red-500" },
  under_review: { icon: AlertTriangle, className: "text-blue-500" },
};

const ActivityItem = ({ activity }) => {
  const StatusIcon = statusConfig[activity.status]?.icon || Clock;
  
  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-colors">
      <Avatar className="w-8 h-8">
        <AvatarImage src={activity.user?.avatar_url} alt={activity.full_name} />
        <AvatarFallback>{activity.full_name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{activity.full_name}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <StatusIcon className={cn("w-4 h-4 mr-1", statusConfig[activity.status]?.className)} />
          <span className="capitalize">{activity.status}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {format(new Date(activity.created_at), "PPp")}
        </p>
      </div>
    </div>
  );
};

const RecentActivities = ({ activities = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities; 