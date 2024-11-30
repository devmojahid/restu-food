import React from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import { 
  Bike, 
  MapPin, 
  Clock, 
  Phone,
  Navigation,
  User,
  DollarSign
} from 'lucide-react';

const ActiveDeliveries = ({ deliveries, onStatusChange, currentLocation }) => {
  const getStatusColor = (status) => {
    const colors = {
      assigned: 'warning',
      picked_up: 'default',
      delivered: 'success',
      delayed: 'danger'
    };
    return colors[status] || 'default';
  };

  const calculateETA = (delivery) => {
    // Add your ETA calculation logic here
    return '15 mins';
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Bike className="w-6 h-6 mr-2" />
          Active Deliveries
        </h2>
        <Badge variant="outline">
          {deliveries?.length || 0} Active
        </Badge>
      </div>

      <div className="space-y-4">
        {deliveries?.map((delivery) => (
          <div 
            key={delivery.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">Order #{delivery.order_id}</h3>
                  <Badge variant={getStatusColor(delivery.status)}>
                    {delivery.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {delivery.restaurant.name}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`tel:${delivery.customer.phone}`)}
              >
                <Phone className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium">Delivery Address</p>
                  <p className="text-sm text-gray-500">{delivery.delivery_address}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>ETA: {calculateETA(delivery)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>${delivery.total}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${delivery.delivery_address}`)}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Navigate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {/* Add customer contact logic */}}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Customer
                  </Button>
                </div>
                {delivery.status === 'assigned' && (
                  <Button
                    size="sm"
                    onClick={() => onStatusChange(delivery.id, 'picked_up')}
                  >
                    Pick Up
                  </Button>
                )}
                {delivery.status === 'picked_up' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => onStatusChange(delivery.id, 'delivered')}
                  >
                    Mark Delivered
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {(!deliveries || deliveries.length === 0) && (
          <div className="text-center py-12">
            <Bike className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No active deliveries</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActiveDeliveries; 