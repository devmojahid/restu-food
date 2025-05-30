import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

const ResourcesSection = ({ data }) => {
    // If no data is provided, return null
    if (!data) return null;

    return (
        <div className="py-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    {data.title || 'Support Resources'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    {data.description || 'Helpful guides and documentation to get you started'}
                </p>
            </motion.div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.resources?.map((resource, index) => {
                    // Dynamically get the icon component
                    const IconComponent = resource.icon && LucideIcons[resource.icon] ?
                        LucideIcons[resource.icon] :
                        LucideIcons.FileText;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "group",
                                "bg-white dark:bg-gray-800",
                                "rounded-2xl shadow-md hover:shadow-xl",
                                "border border-gray-100 dark:border-gray-700",
                                "hover:border-primary/50 dark:hover:border-primary/50",
                                "transition-all duration-300",
                                "overflow-hidden",
                                "p-6"
                            )}
                        >
                            <Link
                                href={resource.link || '#'}
                                className="block h-full"
                            >
                                {/* Icon */}
                                <div className="mb-4">
                                    <div className={cn(
                                        "p-3 rounded-xl inline-flex",
                                        "bg-primary/10 text-primary",
                                        "group-hover:bg-primary group-hover:text-white",
                                        "transition-colors duration-300"
                                    )}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                    {resource.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {resource.description}
                                </p>

                                {/* Tags */}
                                {resource.tags?.length > 0 && (
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {resource.tags.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="inline-block px-3 py-1 text-xs rounded-full 
                                                        bg-gray-100 dark:bg-gray-700 
                                                        text-gray-700 dark:text-gray-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* View Link */}
                                <div className="mt-auto pt-2 flex items-center text-primary font-medium">
                                    <span>View Resource</span>
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResourcesSection; 