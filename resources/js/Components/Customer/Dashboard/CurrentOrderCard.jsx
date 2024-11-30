import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { Button } from '@/Components/ui/button';
import { 
    Clock, 
    MapPin, 
    Phone,
    User,
    Package,
    ChevronRight 
} from 'lucide-react';

const CurrentOrderCard = ({ order }) => {
    const getStatusProgress = (status) => {
        switch (status) {
            case 'preparing': return 33;
            case 'ready': return 66;
            case 'on_way': return 90;
            default: return 0;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'preparing': return 'bg-yellow-100 text-yellow-800';
            case 'ready': return 'bg-blue-100 text-blue-800';
            case 'on_way': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                        <img 
                            src={order.restaurant.logo} 
                            alt={order.restaurant.name}
                            className="w-12 h-12 rounded-full"
                        />
                        <div>
                            <CardTitle className="text-lg">{order.restaurant.name}</CardTitle>
                            <p className="text-sm text-gray-500">Order #{order.id}</p>
                        </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Order Progress */}
                    <div>
                        <Progress value={getStatusProgress(order.status)} className="h-2" />
                        <div className="flex justify-between mt-2 text-sm text-gray-500">
                            <span>Order Placed</span>
                            <span>Preparing</span>
                            <span>On the Way</span>
                            <span>Delivered</span>
                        </div>
                    </div>

                    {/* Estimated Time */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Estimated Delivery</p>
                                <p className="font-medium">
                                    {new Date(order.estimated_delivery).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            Track Order
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                        <h4 className="font-medium">Order Items</h4>
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span>{item.quantity}x {item.name}</span>
                                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Driver Info (if on the way) */}
                    {order.status === 'on_way' && order.delivery.driver_name && (
                        <div className="border-t pt-4">
                            <h4 className="font-medium mb-3">Delivery Driver</h4>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{order.delivery.driver_name}</p>
                                        <p className="text-sm text-gray-500">{order.delivery.driver_phone}</p>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost">
                                    <Phone className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CurrentOrderCard; 