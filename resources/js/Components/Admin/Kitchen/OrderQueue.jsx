import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useOrderUpdates } from '@/hooks/useOrderUpdates';
import { usePage } from '@inertiajs/react';

const OrderQueue = ({ initialOrders = [] }) => {
    const [orders, setOrders] = useState(initialOrders);
    const { auth } = usePage().props;
    useOrderUpdates();

    useEffect(() => {
        if (auth.user?.restaurant_id) {
            // Listen for kitchen-specific updates
            window.Echo.private(`kitchen.${auth.user.restaurant_id}`)
                .listen('KitchenOrderStatusUpdated', (e) => {
                    setOrders(currentOrders => 
                        currentOrders.map(order => 
                            order.id === e.order.id 
                                ? { ...order, status: e.status }
                                : order
                        )
                    );
                });

            // Listen for new orders
            window.Echo.private(`restaurant.${auth.user.restaurant_id}`)
                .listen('NewOrder', (e) => {
                    setOrders(currentOrders => [e.order, ...currentOrders]);
                });
        }

        return () => {
            if (auth.user?.restaurant_id) {
                window.Echo.leave(`kitchen.${auth.user.restaurant_id}`);
                window.Echo.leave(`restaurant.${auth.user.restaurant_id}`);
            }
        };
    }, [auth.user]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await axios.put(`/app/kitchen/orders/${orderId}/status`, {
                status: newStatus
            });

            if (response.data.success) {
                setOrders(currentOrders =>
                    currentOrders.map(order =>
                        order.id === orderId
                            ? { ...order, status: newStatus }
                            : order
                    )
                );
            }
        } catch (error) {
            console.error('Failed to update order status:', error);
            toast.error('Failed to update order status');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
            preparing: { color: 'bg-blue-100 text-blue-800', icon: Clock },
            completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge className={config.color}>
                <Icon className="w-4 h-4 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold">Kitchen Order Queue</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div 
                            key={order.id}
                            className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-medium">Order #{order.id}</h4>
                                    <p className="text-sm text-gray-500">
                                        {order.customer?.name}
                                    </p>
                                </div>
                                {getStatusBadge(order.status)}
                            </div>
                            
                            <div className="space-y-2 mb-4">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span>{item.quantity}x {item.product?.name}</span>
                                        {item.special_instructions && (
                                            <span className="text-amber-600">
                                                {item.special_instructions}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        Est. completion: {new Date(order.estimated_delivery_time).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    {order.status === 'pending' && (
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => handleStatusChange(order.id, 'preparing')}
                                        >
                                            Start Preparing
                                        </Button>
                                    )}
                                    {order.status === 'preparing' && (
                                        <Button 
                                            size="sm"
                                            onClick={() => handleStatusChange(order.id, 'completed')}
                                        >
                                            Mark Completed
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderQueue; 