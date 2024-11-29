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

const RestaurantOrders = ({ orders }) => {
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b dark:border-gray-700">
              <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</th>
              <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Customer</th>
              <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
              <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
              <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
              <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className="border-b dark:border-gray-700">
                <td className="py-4 text-sm text-gray-900 dark:text-gray-300">#{order.id}</td>
                <td className="py-4 text-sm text-gray-900 dark:text-gray-300">{order.user.name}</td>
                <td className="py-4 text-sm text-gray-900 dark:text-gray-300">${order.total}</td>
                <td className="py-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="py-4 text-sm text-gray-900 dark:text-gray-300">
                  {format(new Date(order.created_at), 'MMM dd, yyyy')}
                </td>
                <td className="py-4">
                  <Link href={`/app/orders/${order.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders?.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No recent orders found
          </div>
        )}
      </div>
    </Card>
  );
};

export default RestaurantOrders; 