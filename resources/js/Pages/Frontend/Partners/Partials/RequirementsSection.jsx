import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

const RequirementsSection = ({ data }) => {
    // Ensure data has all required properties with fallbacks
    const title = data?.title || 'Requirements';
    const subtitle = data?.subtitle || 'What You Need';
    const description = data?.description || 'Here are the basic requirements to get started.';
    const requirements = data?.requirements || [];
    const image = data?.image || '/images/default-requirements.jpg';

    return (
        <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Left Side: Content */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-4"
                        >
                            <span>{subtitle}</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                        >
                            {title}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-gray-600 dark:text-gray-400 mb-8"
                        >
                            {description}
                        </motion.p>

                        <div className="space-y-6">
                            {requirements.map((req, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                                    className={cn(
                                        "p-6 rounded-xl",
                                        "bg-white dark:bg-gray-800",
                                        "border border-gray-100 dark:border-gray-700",
                                        "shadow-sm hover:shadow-md transition-all duration-300",
                                        "flex items-start"
                                    )}
                                >
                                    <CheckCircle2 className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            {req.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {req.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="lg:w-1/2"
                    >
                        <div className="relative">
                            <div className="absolute -left-4 -top-4 w-24 h-24 bg-primary/10 rounded-lg z-0" />
                            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/20 rounded-lg z-0" />

                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src={image}
                                    alt="Requirements"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default RequirementsSection; 