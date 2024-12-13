import React from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { format } from 'date-fns';
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    MapPin,
    ChefHat,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const OrderTimeline = ({ order }) => {
    const getStatusIcon = (status) => {
        const icons = {
            pending: Clock,
            confirmed: Package,
            preparing: ChefHat,
            ready: MapPin,
            picked_up: Truck,
            delivered: CheckCircle,
            cancelled: AlertCircle
        };
        return icons[status] || Clock;
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'text-gray-500',
            confirmed: 'text-blue-500',
            preparing: 'text-yellow-500',
            ready: 'text-purple-500',
            picked_up: 'text-orange-500',
            delivered: 'text-green-500',
            cancelled: 'text-red-500'
        };
        return colors[status] || 'text-gray-500';
    };

    const timelineEvents = [
        {
            status: 'confirmed',
            title: 'Order Confirmed',
            time: order.confirmed_at,
            description: 'Your order has been confirmed by the restaurant'
        },
        {
            status: 'preparing',
            title: 'Preparing Order',
            time: order.preparing_at,
            description: 'The restaurant is preparing your food'
        },
        {
            status: 'ready',
            title: 'Ready for Pickup',
            time: order.ready_at,
            description: 'Your order is ready for pickup by delivery driver'
        },
        {
            status: 'picked_up',
            title: 'Out for Delivery',
            time: order.picked_up_at,
            description: 'Driver has picked up your order'
        },
        {
            status: 'delivered',
            title: 'Delivered',
            time: order.delivered_at,
            description: 'Your order has been delivered'
        }
    ].filter(event => event.time);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Order Progress</h3>
                <Badge variant={
                    order.status === 'delivered' ? 'success' :
                    order.status === 'cancelled' ? 'destructive' :
                    'secondary'
                }>
                    {order.status}
                </Badge>
            </div>

            <div className="relative space-y-8">
                {/* Progress Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

                {timelineEvents.map((event, index) => {
                    const Icon = getStatusIcon(event.status);
                    const isActive = order.status === event.status;
                    const isPast = timelineEvents.findIndex(e => e.status === order.status) >= index;

                    return (
                        <div key={event.status} className="relative flex items-start gap-4">
                            <div className={cn(
                                "relative z-10 flex items-center justify-center w-12 h-12 rounded-full",
                                isPast ? "bg-primary text-primary-foreground" : "bg-gray-100",
                                isActive && "ring-2 ring-primary ring-offset-2"
                            )}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 pt-2">
                                <h4 className="font-medium">{event.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                    {event.description}
                                </p>
                                {event.time && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {format(new Date(event.time), 'MMM dd, yyyy HH:mm')}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {order.notes && (
                <Card className="p-4 mt-6">
                    <h4 className="font-medium mb-2">Delivery Notes</h4>
                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                </Card>
            )}
        </div>
    );
};

export default OrderTimeline; 