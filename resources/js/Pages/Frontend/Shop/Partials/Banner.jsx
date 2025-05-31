import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';

const Banner = ({ data = null }) => {
    if (!data) return null;

    const {
        title = 'Summer Sale Collection',
        subtitle = 'Up to 70% Off',
        description = 'Shop our summer collection and enjoy amazing discounts on selected items.',
        image = '/images/banners/shop-banner.jpg',
        button_text = 'Shop Now',
        button_link = '/shop?sort=deals',
        background_color = 'bg-blue-50 dark:bg-blue-950/30'
    } = data;

    return (
        <section className={`py-12 ${background_color}`}>
            <div className="container mx-auto px-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                        {/* Text Content */}
                        <div className="p-6 md:p-12 order-2 md:order-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <h3 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {subtitle}
                                </h3>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                    {title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
                                    {description}
                                </p>
                                <Link href={button_link}>
                                    <Button 
                                        size="lg" 
                                        className="rounded-full group hover:gap-2 transition-all duration-300"
                                    >
                                        <span>{button_text}</span>
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Image */}
                        <div className="relative h-64 md:h-full min-h-[300px] order-1 md:order-2">
                            <motion.img
                                initial={{ scale: 1.1, opacity: 0.8 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                            
                            {/* Decorative Element - Top Corner */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full z-10" />
                            
                            {/* Decorative Element - Bottom Corner */}
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-tr-full z-10" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner; 