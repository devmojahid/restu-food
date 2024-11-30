import React from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { Button } from '@/Components/ui/button';
import { 
  ChefHat, 
  Clock, 
  Timer,
  Utensils,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Flame,
  Coffee,
  UtensilsCrossed,
  Sandwich,
  Pizza,
  Beef,
  Salad,
  IceCream
} from 'lucide-react';

const PreparationTimeline = ({ orders }) => {
  const getStationIcon = (station) => {
    const icons = {
      grill: Flame,
      hotline: UtensilsCrossed,
      coldline: Salad,
      drinks: Coffee,
      appetizers: Sandwich,
      mains: Beef,
      pizza: Pizza,
      desserts: IceCream,
      default: Utensils
    };
    return icons[station.toLowerCase()] || icons.default;
  };

  const getStationColor = (station) => {
    const colors = {
      grill: 'text-red-500 bg-red-50',
      hotline: 'text-orange-500 bg-orange-50',
      coldline: 'text-blue-500 bg-blue-50',
      drinks: 'text-purple-500 bg-purple-50',
      appetizers: 'text-green-500 bg-green-50',
      mains: 'text-amber-500 bg-amber-50',
      pizza: 'text-yellow-500 bg-yellow-50',
      desserts: 'text-pink-500 bg-pink-50',
      default: 'text-gray-500 bg-gray-50'
    };
    return colors[station.toLowerCase()] || colors.default;
  };

  const getTimeStatus = (elapsed, estimated) => {
    const percentage = (elapsed / estimated) * 100;
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const formatTime = (minutes) => {
    if (minutes < 1) return 'Just now';
    return `${minutes}m`;
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <ChefHat className="w-6 h-6 mr-2" />
          Active Preparations
        </h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {orders?.length || 0} Active
          </Badge>
        </div>
      </div>

      <div className="space-y-8">
        {orders?.map((order) => (
          <div key={order.id} className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-8 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

            <div className="relative">
              {/* Order Header */}
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 w-16 text-center">
                  <Badge variant={
                    getTimeStatus(order.elapsed_time, order.estimated_time) === 'danger' ? 'danger' :
                    getTimeStatus(order.elapsed_time, order.estimated_time) === 'warning' ? 'warning' :
                    'success'
                  }>
                    #{order.id}
                  </Badge>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Table {order.table_number}</h3>
                      <p className="text-sm text-gray-500">
                        Started {formatTime(order.elapsed_time)} ago
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Timer className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {formatTime(order.estimated_time - order.elapsed_time)} remaining
                        </span>
                      </div>
                      {order.is_priority && (
                        <Badge variant="danger" className="mt-1">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Priority
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Preparation Steps */}
              <div className="ml-16 space-y-4">
                {order.steps.map((step, index) => {
                  const StationIcon = getStationIcon(step.station);
                  const stationColor = getStationColor(step.station);
                  
                  return (
                    <div key={index} className="relative group">
                      <div className="flex items-center mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                          step.status === 'completed' ? 'bg-green-100 text-green-600' :
                          step.status === 'in_progress' ? stationColor :
                          'bg-gray-100 text-gray-600'
                        } group-hover:scale-110 transform transition-transform`}>
                          <StationIcon className="w-4 h-4" />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium flex items-center">
                                {step.name}
                                {step.is_critical && (
                                  <AlertCircle className="w-3 h-3 ml-1 text-amber-500" />
                                )}
                              </h4>
                              <p className="text-sm text-gray-500 flex items-center">
                                {step.station}
                                {step.temperature && (
                                  <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                    {step.temperature}°C
                                  </span>
                                )}
                              </p>
                            </div>
                            <Badge variant={
                              step.status === 'completed' ? 'success' :
                              step.status === 'in_progress' ? 'default' :
                              'secondary'
                            }>
                              {step.status === 'completed' ? (
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                              ) : null}
                              {step.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          {step.status === 'in_progress' && (
                            <div className="mt-2">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">Progress</span>
                                <span className="font-medium">{step.progress}%</span>
                              </div>
                              <Progress 
                                value={step.progress} 
                                className="h-1"
                                variant={step.progress < 50 ? 'warning' : 'success'}
                              />
                              {step.estimated_completion && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Est. completion: {step.estimated_completion}
                                </p>
                              )}
                            </div>
                          )}
                          {step.notes && (
                            <p className="text-sm text-gray-500 mt-1 italic">
                              Note: {step.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Enhanced Action Buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                  {order.status === 'in_progress' && (
                    <>
                      <Button variant="outline" size="sm">
                        Add Note
                      </Button>
                      <Button variant="outline" size="sm">
                        Adjust Time
                      </Button>
                      <Button variant="outline" size="sm">
                        Request Help
                      </Button>
                      <Button size="sm">
                        Mark Step Complete
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {orders?.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No active preparations</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PreparationTimeline; 