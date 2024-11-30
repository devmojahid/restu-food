import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { LoadingState } from '@/Components/ui/loading-state';

const RecentOrders = ({ orders = [] }) => {
  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
            <ShoppingBag className="w-12 h-12 mb-4 opacity-50" />
            <p>No orders available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Recent Orders
          </CardTitle>
          <Badge variant="secondary" className="font-normal">
            {orders.length} orders
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {order.customer?.avatar ? (
                    <img
                      src={order.customer.avatar}
                      alt={order.customer.name}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(order.customer.name)}&background=random`;
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 text-sm">
                        {order.customer?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  {order.customer?.type === 'vip' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{order.customer?.name || 'Unknown Customer'}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(order.created_at)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium">${order.total.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{order.items} items</p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  <span className="flex items-center space-x-1">
                    {getStatusIcon(order.status)}
                    <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  </span>
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {orders.length > 0 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All Orders
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders; 