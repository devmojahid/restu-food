import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const PopularCuisines = ({ cuisines = [] }) => {
    // No cuisines to display
    if (!cuisines?.length) {
        return null;
    }

    // Animation variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold">Popular Cuisines</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Explore foods by your favorite cuisine types</p>
                    </div>
                    <Link href="/cuisines" className="mt-4 md:mt-0">
                        <Button variant="outline" className="flex items-center gap-2">
                            View All Cuisines
                            <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>

                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {cuisines.map((cuisine) => (
                        <motion.div key={cuisine.id} variants={itemVariants}>
                            <Card className="overflow-hidden h-full group cursor-pointer hover:shadow-lg transition-shadow">
                                <Link href={`/cuisines/${cuisine.id}`} className="block h-full">
                                    <div className="relative h-40 overflow-hidden">
                                        {cuisine.image ? (
                                            <img
                                                src={cuisine.image}
                                                alt={cuisine.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400">{cuisine.name}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-white">{cuisine.name}</h3>
                                                <Badge variant="secondary" className="bg-white/20 text-white mt-2">
                                                    {cuisine.restaurant_count || 0} restaurants
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-medium mb-2">Popular Dishes:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {cuisine.popular_dishes?.map((dish, index) => (
                                                <Badge key={index} variant="outline">
                                                    {dish}
                                                </Badge>
                                            )) || <p className="text-gray-500 text-sm">No popular dishes found</p>}
                                        </div>
                                    </div>
                                </Link>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default PopularCuisines; 