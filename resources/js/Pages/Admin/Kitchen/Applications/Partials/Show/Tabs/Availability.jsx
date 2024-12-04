import React from "react";
import { Card } from "@/Components/ui/card";
import InfoItem from "../InfoItem";
import { Clock, Calendar, DollarSign, CheckCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/Components/ui/badge";

const Availability = ({ application }) => {
  const formatDate = (dateString) => {
    try {
      return dateString ? format(parseISO(dateString), "PPP") : "N/A";
    } catch (error) {
      return "Invalid date";
    }
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Basic Availability */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Availability Details</h3>
        <div className="space-y-4">
          <InfoItem 
            icon={Calendar} 
            label="Available From" 
            value={formatDate(application.available_from)}
          />
          <InfoItem 
            icon={DollarSign} 
            label="Expected Salary" 
            value={`$${application.expected_salary}`}
          />
          <div className="flex gap-4">
            <Badge variant={application.full_time ? "default" : "secondary"}>
              Full Time
            </Badge>
            <Badge variant={application.part_time ? "default" : "secondary"}>
              Part Time
            </Badge>
          </div>
        </div>
      </Card>

      {/* Weekly Schedule */}
      <Card className="p-6 col-span-full">
        <h3 className="text-lg font-semibold mb-4">Weekly Availability</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {daysOfWeek.map((day) => {
            const schedule = application.availability_hours?.[day];
            return (
              <div 
                key={day}
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">{day}</span>
                  {schedule ? (
                    <Badge variant="success">Available</Badge>
                  ) : (
                    <Badge variant="secondary">Unavailable</Badge>
                  )}
                </div>
                {schedule && (
                  <p className="text-sm text-muted-foreground">
                    {schedule.start} - {schedule.end}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Availability; 