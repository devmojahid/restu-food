import React from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { format } from 'date-fns';
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    MapPin,
    ChefHat,
    AlertCircle,
    User,
    Store,
    CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const EnhancedOrderTimeline = ({ order, deliveryData }) => {
    const getStatusIcon = (type) => {
        const icons = {
            order_placed: Package,
            payment_confirmed: CreditCard,
            order_confirmed: Store,
            preparing: ChefHat,
            ready: MapPin,
            picked_up: Truck,
            delivered: CheckCircle,
            cancelled: AlertCircle,
            driver_assigned: User
        };
        return icons[type] || Clock;
    };

    const timelineEvents = [
        {
            type: 'order_placed',
            title: 'Order Placed',
            time: order.created_at,
            description: 'Your order has been received',
            metadata: {
                order_number: order.order_number,
                items_count: order.items?.length || 0
            }
        },
        {
            type: 'payment_confirmed',
            title: 'Payment Confirmed',
            time: order.payment_confirmed_at,
            description: `Payment of ${order.total} confirmed`,
            metadata: {
                method: order.payment_method,
                transaction_id: order.transaction_id
            }
        },
        {
            type: 'order_confirmed',
            title: 'Order Confirmed',
            time: order.confirmed_at,
            description: 'Restaurant has confirmed your order',
            metadata: {
                restaurant: order.restaurant?.name,
                estimated_prep_time: '25 mins'
            }
        },
        {
            type: 'preparing',
            title: 'Preparing Order',
            time: order.preparing_at,
            description: 'Your food is being prepared',
            metadata: {
                chef_name: 'Chef John',
                started_at: order.preparing_at
            }
        },
        {
            type: 'driver_assigned',
            title: 'Driver Assigned',
            time: order.driver_assigned_at,
            description: 'A driver has been assigned to your order',
            metadata: {
                driver_name: order.delivery?.driver?.name,
                vehicle_type: 'Motorcycle'
            }
        },
        {
            type: 'picked_up',
            title: 'Order Picked Up',
            time: order.picked_up_at,
            description: 'Driver has picked up your order',
            metadata: {
                estimated_delivery: order.estimated_delivery_time
            }
        },
        {
            type: 'delivered',
            title: 'Order Delivered',
            time: order.delivered_at,
            description: 'Your order has been delivered',
            metadata: {
                delivery_time: order.delivered_at,
                signature_required: false
            }
        }
    ].filter(event => event.time);

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold">Order Timeline</h3>
                    <p className="text-sm text-muted-foreground">
                        Order #{order.order_number}
                    </p>
                </div>
                <Badge variant={
                    order.status === 'delivered' ? 'success' :
                    order.status === 'cancelled' ? 'destructive' :
                    'secondary'
                }>
                    {order.status}
                </Badge>
            </div>

            <ScrollArea className="h-[500px] pr-4">
                <div className="relative space-y-6">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />

                    {timelineEvents.map((event, index) => {
                        const Icon = getStatusIcon(event.type);
                        const isActive = order.status === event.type;
                        const isPast = timelineEvents.findIndex(e => e.type === order.status) >= index;

                        return (
                            <div key={event.type} className="relative flex items-start gap-4">
                                <div className={cn(
                                    "relative z-10 flex items-center justify-center w-12 h-12 rounded-full",
                                    isPast ? "bg-primary text-primary-foreground" : "bg-muted",
                                    isActive && "ring-2 ring-primary ring-offset-2"
                                )}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 pt-1">
                                    <h4 className="font-medium">{event.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {event.description}
                                    </p>
                                    {event.time && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {format(new Date(event.time), 'MMM dd, yyyy HH:mm')}
                                        </p>
                                    )}
                                    {event.metadata && (
                                        <div className="mt-2 space-y-1">
                                            {Object.entries(event.metadata).map(([key, value]) => (
                                                <div key={key} className="flex items-center text-sm">
                                                    <span className="text-muted-foreground capitalize">
                                                        {key.replace(/_/g, ' ')}:
                                                    </span>
                                                    <span className="ml-2 font-medium">
                                                        {value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </Card>
    );
};

export default EnhancedOrderTimeline; 