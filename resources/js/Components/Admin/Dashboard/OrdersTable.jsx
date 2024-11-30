import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { LoadingState } from '@/Components/ui/loading-state';

const OrdersTable = ({ orders = [] }) => {
  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState message="No orders to display" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Items</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">
                    {order.customer?.name || 'Unknown Customer'}
                  </td>
                  <td className="px-4 py-2">{order.items || 0}</td>
                  <td className="px-4 py-2">
                    ${(order.total || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <Badge variant={order.status_color || 'default'}>
                      {order.status || 'Unknown'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersTable; 