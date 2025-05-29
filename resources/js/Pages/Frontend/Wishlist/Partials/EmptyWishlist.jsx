import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';

const EmptyWishlist = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl"
        >
            {/* Animated Icon */}
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
                className="relative w-24 h-24 mb-6"
            >
                <div className="absolute inset-0 bg-pink-100 dark:bg-pink-900/30 rounded-full opacity-50 animate-ping" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Heart className="w-12 h-12 text-pink-500" strokeWidth={1.5} />
                </div>
            </motion.div>

            {/* Title and description */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Your wishlist is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
                Save your favorite dishes and restaurants for later,
                track price changes, and quickly add items to your cart.
            </p>

            {/* Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
                {[
                    {
                        icon: Search,
                        title: 'Explore Restaurants',
                        description: 'Discover new places to eat',
                        link: '/restaurants',
                        color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
                    },
                    {
                        icon: ShoppingBag,
                        title: 'View Cart',
                        description: 'Check your current order',
                        link: '/cart',
                        color: 'bg-green-50 dark:bg-green-900/20 text-green-500'
                    },
                    {
                        icon: Heart,
                        title: 'Popular Dishes',
                        description: 'See what others love',
                        link: '/menu?sort=popular',
                        color: 'bg-pink-50 dark:bg-pink-900/20 text-pink-500'
                    },
                ].map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (index * 0.1) }}
                        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center mb-3 mx-auto",
                            item.color
                        )}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-semibold mb-1 text-gray-900 dark:text-white">
                            {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            {item.description}
                        </p>
                        <Link href={item.link} className="text-xs text-primary hover:underline">
                            Explore
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* CTA button */}
            <Link href="/menu">
                <Button className="rounded-full">
                    <Search className="w-4 h-4 mr-2" />
                    Browse Menu
                    <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </Link>
        </motion.div>
    );
};

// Helper function to conditionally apply classes
const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};

export default EmptyWishlist; 