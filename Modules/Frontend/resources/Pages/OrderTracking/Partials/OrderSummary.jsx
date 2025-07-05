import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, Info, Check, AlertTriangle, Ban } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';

const OrderSummary = ({ order = null, items = [] }) => {
    // Return early if we don't have order data
    if (!order) {
        return (
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-6 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No Order Details Available</h3>
                <p className="text-sm text-gray-500 mt-2">Order information could not be found.</p>
            </div>
        );
    }

    // Helper function to determine status color
    const getStatusColor = (status) => {
        const statusColors = {
            'processing': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            'preparing': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            'ready': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
            'on_the_way': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
            'delivered': 'bg-green-500/10 text-green-500 border-green-500/20',
            'cancelled': 'bg-red-500/10 text-red-500 border-red-500/20',
        };

        return statusColors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    };

    // Helper function to get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return Check;
            case 'cancelled': return Ban;
            case 'processing': return Clock;
            default: return Info;
        }
    };

    const StatusIcon = getStatusIcon(order.status);
    const statusColor = getStatusColor(order.status);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Order Summary</h2>
                    <Badge className={cn("px-3 py-1 flex items-center gap-1", statusColor)}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span className="capitalize">{order.status?.replace('_', ' ') || 'Unknown'}</span>
                    </Badge>
                </div>

                {/* Order Info */}
                <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                        <span>Order ID:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-200">{order.order_number}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Placed on:</span>
                        <span>{order.placed_at}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Estimated delivery:</span>
                        <span>{order.estimated_delivery_time}</span>
                    </div>
                </div>

                {/* Order Items */}
                <div className="border-t dark:border-gray-700 pt-4 mb-4">
                    <h3 className="font-medium mb-3">Items</h3>
                    <div className="space-y-3">
                        {items?.length > 0 ? (
                            items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity} x ${item.price}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-medium">
                                        ${(item.quantity * item.price).toFixed(2)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-3">No items to display</p>
                        )}
                    </div>
                </div>

                {/* Price Summary */}
                <div className="border-t dark:border-gray-700 pt-4">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${order.subtotal || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span>${order.delivery_fee || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>${order.tax || '0.00'}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-${order.discount || '0.00'}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-semibold text-base pt-2 border-t dark:border-gray-700">
                            <span>Total</span>
                            <span>${order.total || '0.00'}</span>
                        </div>
                    </div>
                </div>

                {/* Special Instructions */}
                {order.special_instructions && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                        <h4 className="text-sm font-medium mb-1">Special Instructions:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.special_instructions}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default OrderSummary; 