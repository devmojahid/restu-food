import React, { useState, useEffect } from 'react';
import { Card } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';
import { Badge } from '@/Components/ui/badge';
import { MapPin, Package, Truck, CheckCircle } from 'lucide-react';
import DeliveryTracker from '@/Pages/Dashboard/Delivery/Components/DeliveryTracker';

const OrderTracking = ({ order }) => {
    const [deliveryStatus, setDeliveryStatus] = useState(order.status);
    const [estimatedTime, setEstimatedTime] = useState(order.estimated_delivery_time);

    useEffect(() => {
        const channel = window.Echo.private(`order.${order.id}`);
        
        channel.listen('.location.updated', (event) => {
            if (event.metadata?.estimated_time) {
                setEstimatedTime(event.metadata.estimated_time);
            }
        });

        channel.listen('.status.updated', (event) => {
            setDeliveryStatus(event.status);
        });

        return () => {
            channel.stopListening('.location.updated');
            channel.stopListening('.status.updated');
        };
    }, [order.id]);

    const getStatusProgress = () => {
        const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered'];
        return ((statuses.indexOf(deliveryStatus) + 1) / statuses.length) * 100;
    };

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Order Status</h3>
                <Progress value={getStatusProgress()} className="mb-6" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatusStep
                        icon={Package}
                        label="Order Confirmed"
                        isCompleted={deliveryStatus !== 'pending'}
                        isActive={deliveryStatus === 'confirmed'}
                    />
                    <StatusStep
                        icon={MapPin}
                        label="Being Prepared"
                        isCompleted={['ready', 'picked_up', 'delivered'].includes(deliveryStatus)}
                        isActive={deliveryStatus === 'preparing'}
                    />
                    <StatusStep
                        icon={Truck}
                        label="Out for Delivery"
                        isCompleted={deliveryStatus === 'delivered'}
                        isActive={deliveryStatus === 'picked_up'}
                    />
                    <StatusStep
                        icon={CheckCircle}
                        label="Delivered"
                        isCompleted={deliveryStatus === 'delivered'}
                        isActive={deliveryStatus === 'delivered'}
                    />
                </div>

                {estimatedTime && (
                    <div className="mt-4 text-center">
                        <Badge variant="secondary" className="text-sm">
                            Estimated Delivery Time: {estimatedTime}
                        </Badge>
                    </div>
                )}
            </Card>

            {order.delivery && ['picked_up', 'in_transit'].includes(deliveryStatus) && (
                <DeliveryTracker
                    orderId={order.id}
                    deliveryId={order.delivery.id}
                    initialLocation={order.delivery.current_location}
                    restaurantLocation={order.restaurant.location}
                    destinationLocation={order.delivery_location}
                />
            )}
        </div>
    );
};

const StatusStep = ({ icon: Icon, label, isCompleted, isActive }) => (
    <div className={cn(
        "flex flex-col items-center text-center p-2 rounded-lg",
        isActive && "bg-primary/10",
        isCompleted && "text-primary"
    )}>
        <Icon className={cn(
            "w-6 h-6 mb-2",
            !isCompleted && !isActive && "text-muted-foreground"
        )} />
        <span className="text-sm font-medium">{label}</span>
    </div>
);

export default OrderTracking; 