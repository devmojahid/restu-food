import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Clock } from "lucide-react";

const TimePicker = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="relative">
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <div className="relative">
        <Input
          type="time"
          className={cn(
            "pl-10",
            error && "border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

TimePicker.displayName = "TimePicker";

export { TimePicker }; 