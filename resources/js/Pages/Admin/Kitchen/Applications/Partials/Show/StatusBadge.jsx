import React from "react";
import { Badge } from "@/Components/ui/badge";
import { AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: "yellow", icon: AlertCircle, label: "Pending Review" },
    under_review: { color: "blue", icon: Clock, label: "Under Review" },
    approved: { color: "green", icon: CheckCircle2, label: "Approved" },
    rejected: { color: "red", icon: XCircle, label: "Rejected" },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant={config.color} className="gap-1.5 px-3 py-1">
      <Icon className="w-3.5 h-3.5" />
      <span className="font-medium">{config.label}</span>
    </Badge>
  );
};

export default StatusBadge; 