import React from "react";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { TimePicker } from "@/Components/ui/time-picker";
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

const AvailabilitySchedule = ({ value, onChange, error }) => {
  const handleDayToggle = (day, isEnabled) => {
    const newSchedule = { ...value };
    if (isEnabled) {
      newSchedule[day] = { start: "09:00", end: "17:00", enabled: true };
    } else {
      newSchedule[day] = { start: "", end: "", enabled: false };
    }
    onChange?.(newSchedule);
  };

  const handleTimeChange = (day, type, time) => {
    const newSchedule = { ...value };
    if (!newSchedule[day]) {
      newSchedule[day] = { enabled: true, start: "", end: "" };
    }
    newSchedule[day] = {
      ...newSchedule[day],
      [type]: time,
      enabled: true,
    };
    
    // Validate time range
    if (type === 'end' && newSchedule[day].start && time) {
      const [startHours, startMinutes] = newSchedule[day].start.split(':');
      const [endHours, endMinutes] = time.split(':');
      const startTime = parseInt(startHours) * 60 + parseInt(startMinutes);
      const endTime = parseInt(endHours) * 60 + parseInt(endMinutes);
      
      if (endTime <= startTime) {
        // Set end time to start time + 1 hour
        const newEndTime = startTime + 60;
        newSchedule[day].end = `${Math.floor(newEndTime / 60).toString().padStart(2, '0')}:${(newEndTime % 60).toString().padStart(2, '0')}`;
      }
    }
    
    onChange?.(newSchedule);
  };

  return (
    <div className="space-y-4">
      {DAYS.map((day) => {
        const daySchedule = value?.[day.id] || { enabled: false, start: "", end: "" };
        
        return (
          <div
            key={day.id}
            className={cn(
              "grid grid-cols-[120px,1fr] gap-4 items-center",
              "p-3 rounded-lg",
              daySchedule?.enabled ? "bg-gray-50 dark:bg-gray-800" : "opacity-75"
            )}
          >
            <div className="flex items-center justify-between">
              <Label htmlFor={`day-${day.id}`}>{day.label}</Label>
              <Switch
                id={`day-${day.id}`}
                checked={daySchedule?.enabled}
                onCheckedChange={(checked) => handleDayToggle(day.id, checked)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TimePicker
                value={daySchedule?.start}
                onChange={(time) => handleTimeChange(day.id, "start", time)}
                disabled={!daySchedule?.enabled}
                placeholder="Start time"
              />
              <TimePicker
                value={daySchedule?.end}
                onChange={(time) => handleTimeChange(day.id, "end", time)}
                disabled={!daySchedule?.enabled}
                placeholder="End time"
              />
            </div>
          </div>
        );
      })}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default AvailabilitySchedule; 