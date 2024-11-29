import React from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';

const OrderStatusBadge = ({ status }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <Badge className={`${statusColors[status.toLowerCase()]} px-2 py-1`}>
      {status}
    </Badge>
  );
};

const RecentOrders = ({ orders }) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">Recent Orders</h2>
        <Link href="/app/orders">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
            <div>
              <div className="flex items-center space-x-3">
                <span className="font-medium dark:text-white">#{order.id}</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {order.user.name} • {order.restaurant.name}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium dark:text-white">${order.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(order.created_at), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        ))}

        {orders?.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No recent orders found
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentOrders; 