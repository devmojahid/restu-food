import React from "react";
import { Card } from "@/Components/ui/card";
import Timeline from "../Timeline";
import { format, parseISO } from "date-fns";

const History = ({ application }) => {
  // Create timeline events from status history and other relevant data
  const createTimelineEvents = () => {
    const events = [
      {
        title: "Application Submitted",
        description: "Initial application submission",
        date: application.created_at,
      }
    ];

    // Add status history events
    if (application.statusHistory?.length > 0) {
      application.statusHistory.forEach(history => {
        events.push({
          title: `Status Updated to ${history.status}`,
          description: history.comment,
          date: history.created_at,
        });
      });
    }

    // Add verification events
    Object.entries(application.verificationStatus || {}).forEach(([key, value]) => {
      if (value) {
        events.push({
          title: `${key.charAt(0).toUpperCase() + key.slice(1)} Verified`,
          description: `${key} verification completed`,
          date: application.updated_at, // Use actual verification date if available
        });
      }
    });

    // Sort events by date
    return events.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Application Timeline</h3>
        <Timeline events={createTimelineEvents()} />
      </Card>
    </div>
  );
};

export default History; 