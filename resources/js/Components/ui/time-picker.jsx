import React, { useState, useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { cn } from "@/lib/utils";

export const TimePicker = ({ value, onChange, disabled, placeholder, className, error }) => {
  const [timeValue, setTimeValue] = useState(value || "");

  useEffect(() => {
    setTimeValue(value || "");
  }, [value]);

  const handleTimeChange = (e) => {
    const newValue = e.target.value;
    setTimeValue(newValue);
    
    // Validate time format
    const isValidTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newValue);
    if (isValidTime) {
      onChange?.(newValue);
    }
  };

  const handleBlur = () => {
    // Format time on blur if needed
    if (timeValue) {
      const [hours, minutes] = timeValue.split(':');
      const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      setTimeValue(formattedTime);
      onChange?.(formattedTime);
    }
  };

  return (
    <Input
      type="time"
      value={timeValue}
      onChange={handleTimeChange}
      onBlur={handleBlur}
      disabled={disabled}
      placeholder={placeholder}
      className={cn(
        "w-full",
        error && "border-red-500",
        className
      )}
    />
  );
}; 