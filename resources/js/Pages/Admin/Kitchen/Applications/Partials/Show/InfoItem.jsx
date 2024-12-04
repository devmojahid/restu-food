import React from "react";
import { cn } from "@/lib/utils";

const InfoItem = ({ icon: Icon, label, value, className, description }) => (
  <div className={cn(
    "flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors",
    "flex-col sm:flex-row",
    className
  )}>
    <div className="flex items-center gap-2 sm:items-start">
      <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
      <p className="text-sm font-medium sm:hidden">{label}</p>
    </div>
    <div className="flex-1 w-full sm:w-auto">
      <p className="text-sm font-medium hidden sm:block">{label}</p>
      <p className="text-sm text-muted-foreground break-words">
        {value !== undefined && value !== null && value !== '' ? value : 'N/A'}
      </p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  </div>
);

export default InfoItem; 