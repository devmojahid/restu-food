import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Package, Users, Clock, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';

const PopularCombos = ({ combos = [] }) => {
    // If no combos, don't render anything
    if (!combos || combos.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <Badge variant="outline" className="mb-2 text-primary border-primary">
                        <Package className="w-3 h-3 mr-1" />
                        Value Meals
                    </Badge>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Popular Combo Deals
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Get more value with our specially curated combo meals. Perfect for sharing or enjoying a complete meal experience.
                    </p>
                </div>

                {/* Combo Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {combos.map((combo, index) => (
                        <motion.div
                            key={combo.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Card className={cn(
                                "overflow-hidden h-full border-0 shadow-lg transition-all duration-300",
                                "hover:shadow-xl hover:-translate-y-1"
                            )}>
                                {/* Combo Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={combo.image}
                                        alt={combo.name}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                    />

                                    {/* Price Tag */}
                                    <div className="absolute top-0 right-0 bg-primary text-white px-4 py-2 rounded-bl-lg font-bold text-lg">
                                        ${combo.price.toFixed(2)}
                                        {combo.original_price && (
                                            <span className="text-xs text-white/80 line-through ml-2">
                                                ${combo.original_price.toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Limited Time Badge */}
                                    {combo.is_limited_time && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                            <div className="text-white text-sm font-medium flex items-center">
                                                <Tag className="w-3 h-3 mr-1" />
                                                Limited Time Offer
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Combo Info */}
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl">{combo.name}</CardTitle>
                                    <CardDescription className="line-clamp-2 h-10">
                                        {combo.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4 pb-2">
                                    {/* Quick Info Badges */}
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <Users className="w-4 h-4 mr-1" />
                                            <span>{combo.serves}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <Clock className="w-4 h-4 mr-1" />
                                            <span>Ready in 20-30 min</span>
                                        </div>
                                    </div>

                                    {/* Included Items List */}
                                    {combo.items && combo.items.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Includes:
                                            </h4>
                                            <ul className="space-y-1">
                                                {combo.items.map((item, idx) => (
                                                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                                                        <span className="inline-block w-1 h-1 rounded-full bg-primary mt-1.5 mr-2"></span>
                                                        {item.name || `Item ${idx + 1}`}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Pairing Suggestions */}
                                    {combo.popular_pairings && combo.popular_pairings.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Great with:
                                            </h4>
                                            <div className="flex flex-wrap gap-1">
                                                {combo.popular_pairings.map((pairing, idx) => (
                                                    <Badge key={idx} variant="outline" className="bg-gray-100 dark:bg-gray-800">
                                                        {pairing}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Nutritional Highlights for Healthy Choices */}
                                    {combo.nutritional_highlights && combo.nutritional_highlights.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Nutritional highlights:
                                            </h4>
                                            <div className="flex flex-wrap gap-1">
                                                {combo.nutritional_highlights.map((highlight, idx) => (
                                                    <Badge key={idx} variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                                                        {highlight}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter>
                                    <Button className="w-full rounded-lg group">
                                        <span>Order Now</span>
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* View All Combos Button */}
                <div className="text-center mt-10">
                    <Link href="/food-menu?filter=combos">
                        <Button variant="outline" size="lg" className="rounded-full">
                            View All Combo Offers
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PopularCombos; 