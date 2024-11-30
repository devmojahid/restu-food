import React from 'react';
import { Card } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';
import { Badge } from '@/Components/ui/badge';
import { 
  Flame, 
  Utensils, 
  Salad, 
  Coffee,
  Users
} from 'lucide-react';

const KitchenLoadMonitor = ({ load }) => {
  const getLoadColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Kitchen Load</h2>
        <Badge variant="outline" className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {load?.staff_available} Staff Active
        </Badge>
      </div>

      <div className="space-y-6">
        {Object.entries(load?.station_load || {}).map(([station, data]) => (
          <div key={station} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {getStationIcon(station)}
                <span className="ml-2 capitalize">{station}</span>
              </div>
              <span className="text-sm font-medium">
                {data.orders}/{data.capacity} Orders
              </span>
            </div>
            <Progress 
              value={data.load_percentage} 
              className={`h-2 ${getLoadColor(data.load_percentage)}`}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

const getStationIcon = (station) => {
  const icons = {
    grill: Flame,
    prep: Utensils,
    salad: Salad,
    drinks: Coffee,
  };
  const Icon = icons[station] || Utensils;
  return <Icon className="w-4 h-4" />;
};

export default KitchenLoadMonitor; 