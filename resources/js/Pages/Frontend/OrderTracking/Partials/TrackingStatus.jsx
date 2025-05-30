import React from 'react';
import { motion } from 'framer-motion';
import {
    Package,
    Clock,
    CheckCircle,
    ClipboardCheck,
    ChefHat,
    Truck,
    MapPin,
    ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/Components/ui/progress';
import { Badge } from '@/Components/ui/badge';
import { format, parseISO } from 'date-fns';

const TrackingStatus = ({ order = {}, trackingUpdates = [] }) => {
    if (!order) return null;

    // Handle null safety
    const {
        order_number = '',
        status = '',
        progress_percentage = 0,
        order_time = '',
        estimated_delivery_time = '',
        estimated_delivery_minutes = 0
    } = order;

    // Format the times properly
    const formattedOrderTime = order_time ? format(parseISO(order_time), 'MMM dd, yyyy h:mm a') : '';
    const formattedDeliveryTime = estimated_delivery_time ? format(parseISO(estimated_delivery_time), 'MMM dd, yyyy h:mm a') : '';

    // Status mapping for UI elements
    const statusConfig = {
        'pending': { label: 'Order Pending', color: 'bg-yellow-500', icon: Package },
        'confirmed': { label: 'Order Confirmed', color: 'bg-blue-500', icon: ClipboardCheck },
        'preparing': { label: 'Preparing', color: 'bg-indigo-500', icon: ChefHat },
        'ready': { label: 'Ready for Pickup', color: 'bg-orange-500', icon: ShoppingBag },
        'picked_up': { label: 'Picked Up', color: 'bg-purple-500', icon: Truck },
        'on_the_way': { label: 'On the Way', color: 'bg-primary', icon: Truck },
        'delivered': { label: 'Delivered', color: 'bg-green-500', icon: CheckCircle }
    };

    // Get current status info
    const currentStatus = statusConfig[status] || statusConfig.pending;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                            Order #{order_number}
                        </h2>
                        <Badge className={cn(
                            "ml-2",
                            status === 'delivered' ? "bg-green-500" :
                                status === 'on_the_way' ? "bg-primary" :
                                    "bg-yellow-500"
                        )}>
                            {currentStatus.label}
                        </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Placed on {formattedOrderTime}
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-5 h-5" />
                        <div>
                            <p className="text-sm">Estimated Delivery</p>
                            <p className="font-semibold">{formattedDeliveryTime}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Progress */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-700 dark:text-gray-300 font-medium">
                        Delivery Progress
                    </div>
                    <div className="text-primary font-medium">
                        {progress_percentage}%
                    </div>
                </div>
                <Progress value={progress_percentage} className="h-2" />
            </div>

            {/* Current Status */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-8">
                <div className="flex items-center space-x-4">
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        currentStatus.color,
                        "text-white"
                    )}>
                        <currentStatus.icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {currentStatus.label}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {status === 'delivered' ? (
                                'Your order has been delivered!'
                            ) : status === 'on_the_way' ? (
                                `Your order will arrive in approximately ${estimated_delivery_minutes} minutes`
                            ) : (
                                'Your order is being processed'
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Order Timeline
                </h3>

                <div className="space-y-0">
                    {trackingUpdates?.map((update, index) => {
                        const isCompleted = update.completed;
                        const isCurrent = update.current;

                        return (
                            <div
                                key={index}
                                className={cn(
                                    "relative pl-8 pb-8",
                                    index === trackingUpdates.length - 1 ? "pb-0" : "border-l-2",
                                    isCurrent ? "border-primary" : isCompleted ? "border-green-500" : "border-gray-300 dark:border-gray-700"
                                )}
                            >
                                {/* Status Dot */}
                                <div className={cn(
                                    "absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full z-10",
                                    isCurrent ? "bg-primary ring-4 ring-primary/20" :
                                        isCompleted ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"
                                )} />

                                {/* Status Content */}
                                <div className="pb-2">
                                    <div className={cn(
                                        "text-base font-medium mb-1",
                                        isCurrent ? "text-primary" :
                                            isCompleted ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
                                    )}>
                                        {update.status}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        {update.description}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-500">
                                        {update.time && format(parseISO(update.time), 'MMM dd, h:mm a')}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default TrackingStatus; 