import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Tag, ChevronRight, ShoppingCart, Plus } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

const SimilarItems = ({ items = [] }) => {
    // Return early if we don't have items
    if (!items || items.length === 0) {
        return (
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-6 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No Similar Items Available</h3>
                <p className="text-sm text-gray-500 mt-2">
                    We don't have any similar item suggestions at this time.
                </p>
            </div>
        );
    }

    // Item card component
    const ItemCard = ({ item, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                     transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
            <Link href={`/menu/${item.slug || '#'}`}>
                <div className="relative h-40 overflow-hidden">
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                    {item.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white 
                                    text-xs font-bold px-2 py-1 rounded-md">
                            {item.discount}% OFF
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium line-clamp-1">
                        {item.name}
                    </h3>
                    <div className="flex items-center bg-gray-50 dark:bg-gray-700 
                                  px-2 py-1 rounded text-xs">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                        <span>{item.rating || '0.0'}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500">
                        {item.restaurant_name || 'Restaurant'}
                    </p>
                    {item.preparation_time && (
                        <span className="text-xs text-gray-500">
                            {item.preparation_time} min
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-baseline">
                        <span className="font-semibold text-primary">
                            ${item.price?.toFixed(2) || '0.00'}
                        </span>
                        {item.discount > 0 && item.original_price && (
                            <span className="text-xs text-gray-500 line-through ml-2">
                                ${item.original_price?.toFixed(2)}
                            </span>
                        )}
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full" asChild>
                        <Link href={`/menu/${item.slug || '#'}`}>
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                        </Link>
                    </Button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">You Might Also Like</h2>
                <Link
                    href="/menu"
                    className="text-primary hover:underline flex items-center text-sm font-medium"
                >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.slice(0, 4).map((item, index) => (
                    <ItemCard key={item.id || index} item={item} index={index} />
                ))}
            </div>
        </div>
    );
};

export default SimilarItems; 