import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const Mission = ({ data }) => {
    return (
        <section id="mission" className="py-20 bg-white dark:bg-gray-900">
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
                </motion.div>

                {/* Mission & Vision Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Mission Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={cn(
                            "relative overflow-hidden",
                            "bg-white dark:bg-gray-800",
                            "rounded-2xl shadow-lg",
                            "group"
                        )}
                    >
                        <div className="aspect-w-16 aspect-h-9 mb-6">
                            <img
                                src={data.mission.image}
                                alt="Our Mission"
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Target className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {data.mission.title}
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {data.mission.description}
                            </p>
                        </div>
                    </motion.div>

                    {/* Vision Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={cn(
                            "relative overflow-hidden",
                            "bg-white dark:bg-gray-800",
                            "rounded-2xl shadow-lg",
                            "group"
                        )}
                    >
                        <div className="aspect-w-16 aspect-h-9 mb-6">
                            <img
                                src={data.vision.image}
                                alt="Our Vision"
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Eye className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {data.vision.title}
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {data.vision.description}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Mission; 