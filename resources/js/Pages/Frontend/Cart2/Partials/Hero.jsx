import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronDown, Shield, Clock, CreditCard, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = ({ data = {} }) => {
    const {
        title = 'Your Shopping Cart',
        subtitle = 'Review & Checkout',
        description = 'Review your items, apply promo codes, and complete your purchase',
        image = '/images/hero/cart-hero.jpg',
        stats = []
    } = data;

    const handleScrollToContent = () => {
        const contentSection = document.querySelector('#cart-items');
        if (contentSection) {
            const offset = 80;
            const elementPosition = contentSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const defaultStats = [
        { icon: Shield, label: 'Secure Checkout', value: '100%' },
        { icon: Clock, label: 'Delivery Time', value: '30-45 min' },
        { icon: CreditCard, label: 'Payment Methods', value: '5+' },
        { icon: Users, label: 'Happy Customers', value: '10K+' }
    ];

    const displayStats = stats?.length > 0 ? stats : defaultStats;

    return (
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            />

            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-transparent backdrop-blur-[2px]" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md 
                                     text-white px-4 py-2 rounded-full text-sm mb-6"
                        >
                            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span>{subtitle}</span>
                        </motion.div>

                        {/* Title with Enhanced Animation */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight"
                        >
                            {title}
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
                        >
                            {description}
                        </motion.p>

                        {/* Stats Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            {displayStats.map((stat, index) => {
                                const Icon = stat.icon || ShoppingBag;
                                return (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                                        className={cn(
                                            "flex flex-col items-center justify-center",
                                            "bg-white/10 backdrop-blur-md",
                                            "border border-white/20",
                                            "rounded-xl p-4",
                                            "hover:bg-white/20 transition-colors"
                                        )}
                                    >
                                        <Icon className="w-6 h-6 text-primary mb-2" />
                                        <span className="text-xl font-bold text-white">{stat.value}</span>
                                        <span className="text-xs text-white/70">{stat.label}</span>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                onClick={handleScrollToContent}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white flex flex-col 
                         items-center space-y-2 cursor-pointer"
            >
                <span className="text-sm font-medium">View Cart</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
            </motion.button>
        </div>
    );
};

export default Hero; 