import React from 'react';
import { motion } from 'framer-motion';
import { Star, Plus } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';

const RecommendedItems = ({ items = [] }) => {
    if (!items || items.length === 0) {
        return null;
    }

    // Animation variants for the container
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // Animation variants for each item
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const addToCart = (item) => {
        // In a real app, this would dispatch an action to add the item to the cart
        // For this demo, we'll just show an alert
        alert(`Added ${item.name} to cart`);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Recommended for You</h2>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {items.map((item, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-w-1 aspect-h-1 w-full relative">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-48 w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">No image</span>
                                    </div>
                                )}

                                {item.is_vegetarian && (
                                    <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
                                        Veg
                                    </Badge>
                                )}
                            </div>

                            <CardContent className="pt-4 flex-grow">
                                <div className="mb-1 flex items-center justify-between">
                                    <h3 className="font-medium text-lg leading-tight line-clamp-1">{item.name}</h3>
                                    <span className="font-semibold text-primary">${item.price.toFixed(2)}</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>

                                {(item.rating !== undefined) && (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <div className="flex items-center text-yellow-500 mr-1">
                                            <Star className="h-3.5 w-3.5 fill-current" />
                                        </div>
                                        <span>{item.rating}</span>
                                        {item.reviews_count !== undefined && (
                                            <span className="text-gray-400 text-xs ml-1">
                                                ({item.reviews_count} reviews)
                                            </span>
                                        )}
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="pt-0">
                                <Button
                                    onClick={() => addToCart(item)}
                                    className="w-full"
                                    variant="outline"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add to Order
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default RecommendedItems; 