import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Clock } from "lucide-react";

const DAYS = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const OperatingSchedule = ({ hours = {}, openingTime, closingTime }) => {
  const formatTime = (time) => {
    if (!time) return "";
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Default Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Opening Time</span>
              <p className="font-medium">{formatTime(openingTime)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Closing Time</span>
              <p className="font-medium">{formatTime(closingTime)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DAYS.map((day) => {
              const schedule = hours?.[day.id];
              const isOpen = !!schedule;

              return (
                <div
                  key={day.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    <span className="font-medium w-32">{day.label}</span>
                    <Badge variant={isOpen ? "success" : "secondary"}>
                      {isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>
                  {isOpen && (
                    <div className="text-sm">
                      <span>{formatTime(schedule.open)}</span>
                      <span className="mx-2">-</span>
                      <span>{formatTime(schedule.close)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {Object.keys(hours || {}).length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No custom operating hours defined.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OperatingSchedule; 