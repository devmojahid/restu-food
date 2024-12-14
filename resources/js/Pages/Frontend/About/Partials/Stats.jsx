import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
    Users, 
    Building2, 
    Truck, 
    ShoppingBag,
    Star,
    Clock,
    MapPin,
    Award,
    TrendingUp,
    Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Animated counter hook
const useCounter = (end, duration = 2000) => {
    const [count, setCount] = React.useState(0);
    const countRef = useRef(null);

    useEffect(() => {
        if (countRef.current) return;
        
        const start = 0;
        const increment = end / (duration / 16);
        const startTime = performance.now();
        
        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            setCount(Math.min(Math.floor(progress * (end - start) + start), end));
            
            if (progress < 1) {
                countRef.current = requestAnimationFrame(updateCount);
            }
        };
        
        countRef.current = requestAnimationFrame(updateCount);
        
        return () => {
            if (countRef.current) {
                cancelAnimationFrame(countRef.current);
            }
        };
    }, [end, duration]);

    return count;
};

const StatCard = ({ stat, index }) => {
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { once: true, margin: "-100px" });
    const count = useCounter(parseInt(stat.value), 2000);
    
    const icons = {
        users: Users,
        building: Building2,
        truck: Truck,
        shopping: ShoppingBag,
        star: Star,
        clock: Clock,
        map: MapPin,
        award: Award,
        trending: TrendingUp,
        heart: Heart
    };

    const IconComponent = icons[stat.icon] || TrendingUp;

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                "group relative",
                "bg-white dark:bg-gray-800",
                "rounded-2xl overflow-hidden",
                "p-6 md:p-8",
                "shadow-lg hover:shadow-xl",
                "border border-gray-100 dark:border-gray-700",
                "transition-all duration-300"
            )}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                <div className="absolute inset-0" 
                    style={{
                        backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                        backgroundSize: "24px 24px"
                    }}
                />
            </div>

            {/* Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10, delay: index * 0.1 }}
                className={cn(
                    "w-16 h-16 mb-6",
                    "rounded-2xl",
                    "bg-primary/10 dark:bg-primary/20",
                    "flex items-center justify-center",
                    "text-primary",
                    "transform-gpu transition-transform duration-300",
                    "group-hover:scale-110"
                )}
            >
                <IconComponent className="w-8 h-8" />
            </motion.div>

            {/* Counter */}
            <div className="relative z-10">
                <div className="flex items-baseline space-x-1">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
                    >
                        {stat.prefix}{count.toLocaleString()}{stat.suffix}
                    </motion.div>
                    {stat.plus && (
                        <span className="text-2xl text-primary font-bold">+</span>
                    )}
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {stat.label}
                </p>
            </div>

            {/* Progress Indicator */}
            {stat.progress && (
                <div className="mt-4">
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${stat.progress}%` } : { width: 0 }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full bg-primary rounded-full"
                        />
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {stat.progress}% Growth
                    </div>
                </div>
            )}

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-primary/5 
                         rounded-full blur-2xl opacity-0 group-hover:opacity-100 
                         transition-opacity duration-500" />
        </motion.div>
    );
};

const Stats = ({ data }) => {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 
                             rounded-full blur-3xl opacity-50 dark:opacity-30" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 
                             rounded-full blur-3xl opacity-50 dark:opacity-30" />
            </div>

            <div className="container mx-auto px-4 relative">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {data.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {data.description}
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {data.stats.map((stat, index) => (
                        <StatCard 
                            key={stat.label} 
                            stat={{
                                ...stat,
                                prefix: stat.prefix || '',
                                suffix: stat.suffix || '',
                                plus: stat.plus || false
                            }} 
                            index={index}
                        />
                    ))}
                </div>

                {/* Additional Info Cards */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'Customer Satisfaction',
                            value: '98%',
                            icon: Heart,
                            color: 'text-red-500',
                            description: 'Of our customers are happy with our service'
                        },
                        {
                            title: 'Growth Rate',
                            value: '+145%',
                            icon: TrendingUp,
                            color: 'text-green-500',
                            description: 'Year over year growth in orders'
                        },
                        {
                            title: 'Service Quality',
                            value: '4.9/5',
                            icon: Star,
                            color: 'text-yellow-500',
                            description: 'Average rating from our customers'
                        }
                    ].map((info, index) => (
                        <motion.div
                            key={info.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative p-6 rounded-2xl",
                                "bg-white dark:bg-gray-800",
                                "border border-gray-100 dark:border-gray-700",
                                "text-center group",
                                "hover:shadow-lg transition-shadow duration-300"
                            )}
                        >
                            <div className={cn(
                                "inline-flex items-center justify-center",
                                "w-12 h-12 rounded-full mb-4",
                                "bg-gray-50 dark:bg-gray-700/50",
                                info.color,
                                "group-hover:scale-110",
                                "transition-transform duration-300"
                            )}>
                                <info.icon className="w-6 h-6" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {info.value}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {info.description}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats; 