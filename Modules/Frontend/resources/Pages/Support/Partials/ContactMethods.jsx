import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

const ContactMethods = ({ data }) => {
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
                    {data.title || 'Contact Methods'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    {data.description || 'Choose the most convenient way to reach us'}
                </p>
            </motion.div>

            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.methods?.map((method, index) => {
                    // Dynamically get the icon component
                    const IconComponent = method.icon && LucideIcons[method.icon] ?
                        LucideIcons[method.icon] :
                        LucideIcons.HelpCircle;

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
                                "text-center p-8"
                            )}
                        >
                            {/* Icon */}
                            <div className="mb-6 inline-flex items-center justify-center">
                                <div className={cn(
                                    "p-4 rounded-full",
                                    "bg-primary/10 text-primary",
                                    "group-hover:bg-primary group-hover:text-white",
                                    "transition-colors duration-300",
                                    "w-16 h-16"
                                )}>
                                    <IconComponent className="w-8 h-8" />
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                {method.title}
                            </h3>

                            {/* Value */}
                            <div className="text-primary font-medium text-lg mb-2">
                                {method.value}
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                                {method.description}
                            </p>

                            {/* Action Button */}
                            <Link
                                href={method.link || '#'}
                                target={method.link?.startsWith('http') ? '_blank' : '_self'}
                                rel={method.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                                <Button
                                    variant="outline"
                                    className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                                >
                                    {method.action || 'Contact Us'}
                                </Button>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default ContactMethods; 