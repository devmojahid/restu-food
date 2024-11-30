import React from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { 
  ShoppingBag, 
  MapPin, 
  Clock,
  ArrowRight
} from 'lucide-react';

const CustomerOrders = ({ orders }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <Link href="/orders">
          <Button variant="outline">View All Orders</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">{order.restaurant.name}</p>
                </div>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>

            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {order.delivery_address}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {format(new Date(order.created_at), 'MMM dd, HH:mm')}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="font-medium">${order.total.toFixed(2)}</span>
              <Link href={`/orders/${order.id}`}>
                <Button variant="ghost" size="sm">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        ))}

        {orders?.length === 0 && (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders yet</p>
            <Link href="/restaurants">
              <Button variant="link" className="mt-2">
                Start Ordering
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CustomerOrders; 