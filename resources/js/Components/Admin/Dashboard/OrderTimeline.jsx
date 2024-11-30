import React from 'react';
import { Card } from '@/Components/ui/card';
import { format } from 'date-fns';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Bike,
  ChefHat
} from 'lucide-react';
import Badge from '@/Components/ui/badge';

const OrderTimeline = ({ orders }) => {
  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      processing: ChefHat,
      delivering: Bike,
      completed: CheckCircle2,
      cancelled: XCircle,
    };
    return icons[status.toLowerCase()] || ShoppingBag;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-500',
      processing: 'text-blue-500',
      delivering: 'text-purple-500',
      completed: 'text-green-500',
      cancelled: 'text-red-500',
    };
    return colors[status.toLowerCase()] || 'text-gray-500';
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Order Timeline</h2>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-6">
          {orders?.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            const statusColor = getStatusColor(order.status);

            return (
              <div key={order.id} className="relative flex items-start ml-8">
                {/* Timeline dot */}
                <div className={`absolute -left-10 p-1 rounded-full bg-white dark:bg-gray-800 ${statusColor}`}>
                  <StatusIcon className="w-5 h-5" />
                </div>

                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.restaurant.name}
                      </p>
                    </div>
                    <span className={`text-sm ${statusColor}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {order.items?.map((item) => (
                      <div key={item.id}>
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex justify-between items-center text-sm">
                    <span className="font-medium">
                      Total: ${order.total.toFixed(2)}
                    </span>
                    <span className="text-gray-500">
                      {format(new Date(order.created_at), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default OrderTimeline; 