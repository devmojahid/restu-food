import React from "react";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";

const DAYS = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return { value: `${hour}:00`, label: `${hour}:00` };
});

const AvailabilitySchedule = ({ value, onChange, error }) => {
  const handleDayChange = (day, isAvailable) => {
    const newSchedule = { ...value };
    if (isAvailable) {
      newSchedule[day] = { start: "09:00", end: "17:00" };
    } else {
      delete newSchedule[day];
    }
    onChange(newSchedule);
  };

  const handleTimeChange = (day, type, time) => {
    const newSchedule = { ...value };
    newSchedule[day] = { ...newSchedule[day], [type]: time };
    onChange(newSchedule);
  };

  return (
    <div className="space-y-4">
      {DAYS.map((day) => (
        <Card key={day.id} className={cn(
          "transition-colors",
          value[day.id] ? "border-primary/50" : "border-border"
        )}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor={`day-${day.id}`} className="font-medium">
                {day.label}
              </Label>
              <Switch
                id={`day-${day.id}`}
                checked={!!value[day.id]}
                onCheckedChange={(checked) => handleDayChange(day.id, checked)}
              />
            </div>

            {value[day.id] && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Start Time</Label>
                  <Select
                    value={value[day.id].start}
                    onValueChange={(time) => handleTimeChange(day.id, "start", time)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {HOURS.map((hour) => (
                        <SelectItem key={hour.value} value={hour.value}>
                          {hour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">End Time</Label>
                  <Select
                    value={value[day.id].end}
                    onValueChange={(time) => handleTimeChange(day.id, "end", time)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      {HOURS.map((hour) => (
                        <SelectItem 
                          key={hour.value} 
                          value={hour.value}
                          disabled={hour.value <= value[day.id].start}
                        >
                          {hour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default AvailabilitySchedule; 