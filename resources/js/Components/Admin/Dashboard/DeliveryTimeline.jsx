import React from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { 
  Bike, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle,
  DollarSign,
  Star,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';

const DeliveryTimeline = ({ deliveries }) => {
  const getStatusIcon = (status) => {
    const icons = {
      picked_up: Bike,
      delivered: CheckCircle2,
      cancelled: XCircle,
      default: Clock
    };
    return icons[status] || icons.default;
  };

  const getStatusColor = (status) => {
    const colors = {
      picked_up: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.default;
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Clock className="w-6 h-6 mr-2" />
          Delivery History
        </h2>
        <Badge variant="outline">
          {deliveries?.length || 0} Completed
        </Badge>
      </div>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-8">
          {deliveries?.map((delivery, index) => {
            const StatusIcon = getStatusIcon(delivery.status);
            return (
              <div key={delivery.id} className="relative">
                <div className="flex items-start ml-16">
                  {/* Timeline dot */}
                  <div className={`absolute -left-2 p-2 rounded-full ${getStatusColor(delivery.status)}`}>
                    <StatusIcon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">Order #{delivery.order_id}</h3>
                          <Badge variant={delivery.status === 'delivered' ? 'success' : 'default'}>
                            {delivery.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {delivery.restaurant.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{format(new Date(delivery.completed_at), 'HH:mm')}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-green-600 mt-1">
                          <DollarSign className="w-4 h-4" />
                          <span>${delivery.earnings}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm">{delivery.delivery_address}</p>
                          <p className="text-xs text-gray-500">
                            {delivery.distance} km • {delivery.duration} mins
                          </p>
                        </div>
                      </div>

                      {delivery.customer_rating && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {delivery.customer_rating}
                          </span>
                          {delivery.customer_feedback && (
                            <span className="text-sm text-gray-500">
                              "{delivery.customer_feedback}"
                            </span>
                          )}
                        </div>
                      )}

                      {delivery.notes && (
                        <div className="flex items-start space-x-2 mt-2">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            {delivery.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Delivery Metrics */}
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Pickup Time</p>
                        <p className="text-sm font-medium">
                          {delivery.pickup_duration} mins
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Delivery Time</p>
                        <p className="text-sm font-medium">
                          {delivery.delivery_duration} mins
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Time</p>
                        <p className="text-sm font-medium">
                          {delivery.total_duration} mins
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {(!deliveries || deliveries.length === 0) && (
            <div className="text-center py-12">
              <Bike className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No delivery history</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DeliveryTimeline; 