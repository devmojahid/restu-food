import React from "react";
import { format } from "date-fns";

const Timeline = ({ events }) => (
  <div className="space-y-4">
    {events.map((event, index) => (
      <div key={index} className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          {index !== events.length - 1 && (
            <div className="w-px h-full bg-border" />
          )}
        </div>
        <div className="flex-1 pb-4">
          <p className="text-sm font-medium">{event.title}</p>
          <p className="text-sm text-muted-foreground">{event.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {format(new Date(event.date), "PPP")}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default Timeline; 