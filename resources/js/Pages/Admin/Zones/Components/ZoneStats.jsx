import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { MapPin, Activity, Map } from "lucide-react";

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="flex items-center space-x-4">
    <div className="p-2 bg-primary/10 rounded-full">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </div>
);

const ZoneStats = ({ stats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Zone Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <StatCard
          title="Total Zones"
          value={stats.total}
          icon={MapPin}
        />
        <StatCard
          title="Active Zones"
          value={stats.active}
          icon={Activity}
        />
        <StatCard
          title="Coverage Area"
          value={stats.coverage_area}
          icon={Map}
        />
      </CardContent>
    </Card>
  );
};

export default ZoneStats; 