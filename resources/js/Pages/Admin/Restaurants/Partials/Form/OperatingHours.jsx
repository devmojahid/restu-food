
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

const DAYS = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

// Memoized time slots generation for better performance
const generateTimeSlots = () => {
  return Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const time = `${hour.toString().padStart(2, "0")}:${minute}`;
    return {
      value: time,
      label: time,
    };
  });
};

const OperatingHours = ({
  value = {},
  onChange,
  openingTime = "09:00",
  closingTime = "22:00",
  onTimeChange,
  errors = {},
}) => {
  // Memoize time slots to prevent regeneration on every render
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const handleDayToggle = (day, isOpen) => {
    const newValue = {
      ...value,
      [day]: isOpen
        ? {
          open: openingTime,
          close: closingTime,
        }
        : null,
    };
    onChange(newValue);
  };

  const handleTimeChange = (day, type, time) => {
    const newValue = {
      ...value,
      [day]: {
        ...value[day],
        [type]: time,
      },
    };
    onChange(newValue);
  };

  // Validation helper
  const isTimeValid = (openTime, closeTime) => {
    if (!openTime || !closeTime) return true;
    return openTime < closeTime;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operating Hours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Default Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="opening_time">Default Opening Time</Label>
            <Select
              value={openingTime}
              onValueChange={(time) => onTimeChange("opening_time", time)}
            >
              <SelectTrigger
                className={cn(errors.opening_time && "border-red-500")}
              >
                <SelectValue placeholder="Select opening time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.opening_time && (
              <p className="text-sm text-red-500">{errors.opening_time}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="closing_time">Default Closing Time</Label>
            <Select
              value={closingTime}
              onValueChange={(time) => onTimeChange("closing_time", time)}
            >
              <SelectTrigger
                className={cn(errors.closing_time && "border-red-500")}
              >
                <SelectValue placeholder="Select closing time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.closing_time && (
              <p className="text-sm text-red-500">{errors.closing_time}</p>
            )}
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="space-y-4">
          <Label>Daily Schedule</Label>
          <div className="space-y-4">
            {DAYS.map((day) => (
              <div
                key={day.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex items-center justify-between sm:w-[200px]">
                  <Label htmlFor={day.id} className="font-medium">
                    {day.label}
                  </Label>
                  <Switch
                    id={day.id}
                    checked={!!value[day.id]}
                    onCheckedChange={(checked) =>
                      handleDayToggle(day.id, checked)
                    }
                  />
                </div>

                {value[day.id] && (
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <Select
                      value={value[day.id]?.open}
                      onValueChange={(time) =>
                        handleTimeChange(day.id, "open", time)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Opening time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={value[day.id]?.close}
                      onValueChange={(time) =>
                        handleTimeChange(day.id, "close", time)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Closing time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OperatingHours; 