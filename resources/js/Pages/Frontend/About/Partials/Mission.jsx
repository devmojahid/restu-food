import React from 'react';
import { motion } from 'framer-motion';
import { 
    Target, 
    Eye, 
    ArrowRight, 
    Star, 
    Shield, 
    Heart,
    Users,
    Globe,
    TrendingUp,
    Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Card = ({ type, data, icon: Icon, tags, metrics }) => (
    <motion.div
        initial={{ opacity: 0, x: type === 'mission' ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="group relative h-full"
    >
        <div className={cn(
            "relative h-full overflow-hidden",
            "bg-white dark:bg-gray-800",
            "rounded-2xl shadow-lg",
            "border border-gray-100 dark:border-gray-700",
            "transition-all duration-300",
            "hover:shadow-xl hover:scale-[1.02]",
            "flex flex-col",
            "group"
        )}>
            {/* Image Container with Parallax Effect */}
            <div className="relative aspect-video overflow-hidden">
                <motion.img
                    src={data.image}
                    alt={data.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                
                {/* Floating Tags */}
                <motion.div 
                    className="absolute top-4 right-4 flex flex-wrap justify-end gap-2 max-w-[75%]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    {tags.map((tag, index) => (
                        <span 
                            key={tag}
                            className="px-3 py-1 rounded-full text-xs font-medium 
                                   bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
                                   text-primary whitespace-nowrap"
                        >
                            {tag}
                        </span>
                    ))}
                </motion.div>

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg">
                            <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                            {data.title}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col">
                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 flex-1">
                    {data.description}
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "p-4 rounded-xl",
                                "bg-gray-50 dark:bg-gray-700/30",
                                "group/metric hover:bg-primary/5",
                                "transition-colors duration-300"
                            )}
                        >
                            <div className="flex items-center space-x-3">
                                <metric.icon className="w-5 h-5 text-primary" />
                                <div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                                        {metric.value}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {metric.label}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 border-2 border-primary scale-105 opacity-0 
                         rounded-2xl transition-opacity duration-300 group-hover:opacity-100" />
        </div>
    </motion.div>
);

const Mission = ({ data }) => {
    const missionMetrics = [
        { icon: Star, value: '98%', label: 'Success Rate' },
        { icon: Users, value: '1M+', label: 'Happy Customers' },
        { icon: Globe, value: '50+', label: 'Countries' },
        { icon: Award, value: '25+', label: 'Awards' }
    ];

    const visionMetrics = [
        { icon: TrendingUp, value: '100M+', label: 'Users by 2025' },
        { icon: Globe, value: '200+', label: 'Cities' },
        { icon: Shield, value: '24/7', label: 'Availability' },
        { icon: Heart, value: '100%', label: 'Satisfaction' }
    ];

    return (
        <section id="mission" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
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
                </motion.div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    <Card 
                        type="mission"
                        data={data.mission}
                        icon={Target}
                        tags={['Innovation', 'Excellence', 'Growth']}
                        metrics={missionMetrics}
                    />
                    <Card 
                        type="vision"
                        data={data.vision}
                        icon={Eye}
                        tags={['Future', 'Impact', 'Scale']}
                        metrics={visionMetrics}
                    />
                </div>
            </div>
        </section>
    );
};

export default Mission; 