import React from 'react';
import { motion } from 'framer-motion';
import { 
    ShoppingBag, 
    Star, 
    Truck, 
    CheckCircle, 
    MessageCircle,
    Clock,
    Activity,
    Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Stats = ({ data }) => {
    if (!data) return null;
    
    const statItems = [
        {
            label: 'Products',
            value: data.total_products?.toLocaleString() || '1,500+',
            icon: ShoppingBag,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            label: 'In Stock Items',
            value: data.products_in_stock?.toLocaleString() || '1,350+',
            icon: CheckCircle,
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            label: 'Average Rating',
            value: data.average_rating || '4.7',
            icon: Star,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        },
        {
            label: 'Customer Reviews',
            value: data.total_reviews?.toLocaleString() || '15,000+',
            icon: MessageCircle,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        },
    ];
    
    const deliveryItems = data.delivery_options ? [
        {
            name: data.delivery_options.standard?.name || 'Standard Delivery',
            time: data.delivery_options.standard?.time || '2-4 days',
            price: data.delivery_options.standard?.price || 4.99,
            icon: Truck,
            color: 'text-gray-500',
        },
        {
            name: data.delivery_options.express?.name || 'Express Delivery',
            time: data.delivery_options.express?.time || '1-2 days',
            price: data.delivery_options.express?.price || 9.99,
            icon: Activity,
            color: 'text-blue-500',
        },
        {
            name: data.delivery_options.same_day?.name || 'Same Day Delivery',
            time: data.delivery_options.same_day?.time || 'Today',
            price: data.delivery_options.same_day?.price || 14.99,
            icon: Clock,
            color: 'text-green-500',
        },
    ] : [];
    
    return (
        <section className="py-8 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <div className="container mx-auto px-4">
                <div className="mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                            <Award className="w-6 h-6 mr-2 text-primary" />
                            Shop Statistics
                        </h2>
                        
                        {data.delivery_options?.free_threshold && (
                            <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                Free Shipping on Orders Over ${data.delivery_options.free_threshold}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={cn(
                                "relative p-6 rounded-xl overflow-hidden",
                                "border border-gray-100 dark:border-gray-700",
                                item.bgColor
                            )}
                        >
                            <div className="absolute top-2 right-2 opacity-10">
                                <item.icon className="w-16 h-16" />
                            </div>
                            <div className="relative">
                                <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    {item.label}
                                </h3>
                                <div className="flex items-baseline">
                                    <span className={cn("text-2xl font-bold mr-1", item.color)}>
                                        {item.value}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                {deliveryItems.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {deliveryItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                                className="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700"
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center mr-4",
                                    "bg-white dark:bg-gray-700 shadow-sm"
                                )}>
                                    <item.icon className={cn("w-5 h-5", item.color)} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        {item.name}
                                    </h3>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {item.time}
                                        </span>
                                        <span className="text-sm font-medium">
                                            ${item.price.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Stats; 