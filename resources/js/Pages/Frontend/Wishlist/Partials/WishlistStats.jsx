import React from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    DollarSign,
    Clock,
    Tag,
    TrendingDown,
    BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';

const WishlistStats = ({ stats = {} }) => {
    // Default stats if not provided
    const {
        total_items = 0,
        total_value = 0,
        most_saved_category = 'N/A',
        avg_item_price = 0,
        price_drops = 0,
        saved_days = 0
    } = stats;

    // Stats to display
    const statsItems = [
        {
            label: 'Total Items',
            value: total_items,
            icon: ShoppingBag,
            color: 'bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400'
        },
        {
            label: 'Total Value',
            value: formatCurrency(total_value),
            icon: DollarSign,
            color: 'bg-green-50 text-green-500 dark:bg-green-900/20 dark:text-green-400'
        },
        {
            label: 'Favorite Category',
            value: most_saved_category,
            icon: Tag,
            color: 'bg-purple-50 text-purple-500 dark:bg-purple-900/20 dark:text-purple-400'
        },
        {
            label: 'Avg. Price',
            value: formatCurrency(avg_item_price),
            icon: BarChart3,
            color: 'bg-orange-50 text-orange-500 dark:bg-orange-900/20 dark:text-orange-400'
        },
        {
            label: 'Price Drops',
            value: price_drops,
            icon: TrendingDown,
            color: 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400'
        },
        {
            label: 'Days Saved',
            value: saved_days,
            icon: Clock,
            color: 'bg-indigo-50 text-indigo-500 dark:bg-indigo-900/20 dark:text-indigo-400'
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Wishlist Stats
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {statsItems.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-start">
                            <div className={cn(
                                "p-2 rounded-lg",
                                stat.color
                            )}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                            <div className="ml-3">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {stat.label}
                                </p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Additional Help Text */}
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                We'll notify you when items in your wishlist go on sale or have price changes.
            </p>
        </div>
    );
};

export default WishlistStats; 