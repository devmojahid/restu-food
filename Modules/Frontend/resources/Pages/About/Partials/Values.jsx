import React from 'react';
import { motion } from 'framer-motion';
import { 
    Star, 
    Rocket, 
    Users, 
    Leaf,
    Shield,
    Heart,
    Target,
    Zap,
    Award,
    RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ValueCard = ({ value, index }) => {
    const icons = {
        Quality: Star,
        Innovation: Rocket,
        Community: Users,
        Sustainability: Leaf,
        Security: Shield,
        Care: Heart,
        Excellence: Target,
        Speed: Zap,
        Recognition: Award,
        Growth: RefreshCw
    };

    const IconComponent = icons[value.icon] || Star;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
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
                        backgroundSize: "32px 32px"
                    }}
                />
            </div>

            {/* Icon */}
            <div className="relative">
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                        "w-14 h-14 mb-6",
                        "rounded-xl",
                        "bg-primary/10 dark:bg-primary/20",
                        "flex items-center justify-center",
                        "text-primary",
                        "transform-gpu transition-transform duration-300",
                        "group-hover:shadow-lg group-hover:shadow-primary/20"
                    )}
                >
                    <IconComponent className="w-7 h-7" />
                </motion.div>

                {/* Content */}
                <div className="relative space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {value.description}
                    </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-primary/5 
                             rounded-full blur-2xl opacity-0 group-hover:opacity-100 
                             transition-opacity duration-500" />
            </div>

            {/* Bottom Decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r 
                         from-transparent via-primary/20 to-transparent 
                         transform scale-x-0 group-hover:scale-x-100 
                         transition-transform duration-500" />
        </motion.div>
    );
};

const Values = ({ data }) => {
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
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full 
                                bg-primary/10 dark:bg-primary/20 text-primary mb-6"
                    >
                        <Target className="w-8 h-8" />
                    </motion.div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {data.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {data.subtitle}
                    </p>
                </motion.div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {data.values.map((value, index) => (
                        <ValueCard 
                            key={value.title} 
                            value={value} 
                            index={index}
                        />
                    ))}
                </div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {[
                        {
                            label: 'Customer Satisfaction',
                            value: '98%',
                            icon: Heart,
                            color: 'text-red-500'
                        },
                        {
                            label: 'Service Quality',
                            value: '4.9/5',
                            icon: Star,
                            color: 'text-yellow-500'
                        },
                        {
                            label: 'Team Members',
                            value: '200+',
                            icon: Users,
                            color: 'text-blue-500'
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative p-6 rounded-2xl",
                                "bg-white dark:bg-gray-800",
                                "border border-gray-100 dark:border-gray-700",
                                "text-center",
                                "group hover:shadow-lg",
                                "transition-all duration-300"
                            )}
                        >
                            <div className={cn(
                                "inline-flex items-center justify-center",
                                "w-12 h-12 rounded-full mb-4",
                                "bg-gray-50 dark:bg-gray-700/50",
                                stat.color,
                                "group-hover:scale-110",
                                "transition-transform duration-300"
                            )}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Values; 