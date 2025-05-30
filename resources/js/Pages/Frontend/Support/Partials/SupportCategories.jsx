import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

// Dynamic icon import
import * as LucideIcons from 'lucide-react';

const SupportCategories = ({ data }) => {
    // Fallback for null data
    if (!data) return null;

    return (
        <div id="support-categories" className="py-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    {data.title || 'How Can We Help?'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    {data.description || 'Select a category to find the help you need'}
                </p>
            </motion.div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {data.categories?.map((category, index) => {
                    // Dynamically get the icon component
                    const IconComponent = category.icon && LucideIcons[category.icon] ?
                        LucideIcons[category.icon] :
                        LucideIcons.HelpCircle;

                    return (
                        <motion.div
                            key={category.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "group relative",
                                "bg-white dark:bg-gray-800",
                                "rounded-2xl shadow-md hover:shadow-xl",
                                "border border-gray-100 dark:border-gray-700",
                                "hover:border-primary/50 dark:hover:border-primary/50",
                                "transition-all duration-300",
                                "overflow-hidden"
                            )}
                        >
                            <Link
                                href={category.link || '#'}
                                className="block p-6"
                            >
                                {/* Enhanced Icon Display */}
                                <div className="flex items-center mb-4">
                                    <div className={cn(
                                        "p-3 rounded-xl mr-4 text-white",
                                        "bg-gradient-to-br from-primary to-primary-600",
                                        "group-hover:scale-110 transition-transform duration-300"
                                    )}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                        {category.title}
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {category.description}
                                </p>

                                {/* Popular Topics */}
                                {category.popularTopics?.length > 0 && (
                                    <div className="space-y-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-2">
                                            Popular Topics
                                        </h4>
                                        <ul className="space-y-1">
                                            {category.popularTopics.map((topic, topicIndex) => (
                                                <li key={topicIndex}>
                                                    <Link
                                                        href={topic.link || '#'}
                                                        className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-primary group"
                                                    >
                                                        <ChevronRight className="w-4 h-4 text-gray-400 mr-1 group-hover:text-primary transition-colors" />
                                                        <span>{topic.title}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* View All Link */}
                                <div className="mt-6 flex justify-end">
                                    <span className="inline-flex items-center text-primary font-medium text-sm">
                                        Browse Category
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default SupportCategories; 