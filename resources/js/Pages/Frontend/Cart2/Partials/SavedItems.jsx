import React from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Bookmark } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

const SavedItems = ({ items = [], onMoveToCart }) => {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Saved for Later</h2>
                <span className="text-sm text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                    <SavedItemCard
                        key={item.id}
                        item={item}
                        onMoveToCart={onMoveToCart}
                    />
                ))}
            </div>
        </motion.div>
    );
};

const SavedItemCard = ({ item, onMoveToCart }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
                "flex gap-3 p-3",
                "border border-gray-100 dark:border-gray-700 rounded-xl",
                "hover:border-primary/30 dark:hover:border-primary/30",
                "transition-all duration-300",
                "group"
            )}
        >
            {/* Item Image */}
            <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {item.discount > 0 && (
                    <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {item.discount}%
                    </div>
                )}
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-col h-full justify-between">
                    <div>
                        <Link
                            href={`/menu/${item.slug}`}
                            className="font-medium line-clamp-1 hover:text-primary transition-colors"
                        >
                            {item.name}
                        </Link>

                        <div className="flex items-center text-sm text-gray-500">
                            <Link
                                href={`/restaurants/${item.restaurant.slug}`}
                                className="line-clamp-1 hover:text-primary transition-colors"
                            >
                                {item.restaurant.name}
                            </Link>
                        </div>

                        <div className="mt-1 flex items-center">
                            <span className="font-semibold">
                                ${(item.price * (1 - (item.discount || 0) / 100)).toFixed(2)}
                            </span>

                            {item.discount > 0 && (
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                    ${item.price.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => onMoveToCart(item.id)}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Move to Cart
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default SavedItems; 