import React from 'react';
import { motion } from 'framer-motion';
import { History, ChevronRight, Calendar, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const Story = ({ data }) => {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
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
                        {data.subtitle}
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Timeline Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-200 dark:bg-gray-800" />

                    {/* Timeline Items */}
                    <div className="space-y-16">
                        {data.timeline.map((item, index) => (
                            <motion.div
                                key={item.year}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.2 }}
                                className={cn(
                                    "relative flex items-center",
                                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                                )}
                            >
                                {/* Content */}
                                <div className="w-1/2 pr-8">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className={cn(
                                            "bg-white dark:bg-gray-800",
                                            "p-6 rounded-2xl shadow-lg",
                                            "border border-gray-100 dark:border-gray-700",
                                            "relative"
                                        )}
                                    >
                                        {/* Year Badge */}
                                        <div className="absolute -top-4 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                                            {item.year}
                                        </div>

                                        <div className="pt-2">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {item.description}
                                            </p>
                                        </div>

                                        {/* Image */}
                                        <div className="mt-4 aspect-video rounded-lg overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Timeline Point */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        <History className="w-6 h-6 text-white" />
                                    </motion.div>
                                </div>

                                {/* Empty Space for Alternating Layout */}
                                <div className="w-1/2" />
                            </motion.div>
                        ))}
                    </div>
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
                            icon: Calendar,
                            label: 'Years of Excellence',
                            value: '6+'
                        },
                        {
                            icon: Award,
                            label: 'Industry Awards',
                            value: '15+'
                        },
                        {
                            icon: ChevronRight,
                            label: 'Major Milestones',
                            value: '20+'
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "text-center p-6 rounded-2xl",
                                "bg-white dark:bg-gray-800",
                                "border border-gray-100 dark:border-gray-700",
                                "shadow-lg"
                            )}
                        >
                            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
                                <stat.icon className="w-6 h-6 text-primary" />
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

export default Story; 