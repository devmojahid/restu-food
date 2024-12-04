import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const statusConfig = {
  pending: { 
    color: "yellow", 
    icon: Clock, 
    label: "Pending Review",
    className: "bg-yellow-100 text-yellow-800"
  },
  under_review: { 
    color: "blue", 
    icon: AlertCircle, 
    label: "Under Review",
    className: "bg-blue-100 text-blue-800"
  },
  approved: { 
    color: "green", 
    icon: CheckCircle2, 
    label: "Approved",
    className: "bg-green-100 text-green-800"
  },
  rejected: { 
    color: "red", 
    icon: XCircle, 
    label: "Rejected",
    className: "bg-red-100 text-red-800"
  },
};

const Timeline = ({ history = [] }) => {
  return (
    <div className="space-y-6">
      {history.map((item, index) => {
        const config = statusConfig[item.status] || statusConfig.pending;
        const Icon = config.icon;
        
        return (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-2.5 h-2.5 rounded-full",
                config.className
              )}>
                {Icon && (
                  <Icon className="w-4 h-4 -m-0.75" />
                )}
              </div>
              {index !== history.length - 1 && (
                <div className="w-px h-full bg-border" />
              )}
            </div>
            <div className="flex-1 pb-6">
              <p className="text-sm font-medium capitalize">
                {config.label || item.status}
              </p>
              <p className="text-sm text-muted-foreground">{item.comment}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(item.created_at), "PPp")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline; 