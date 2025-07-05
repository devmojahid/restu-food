import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import * as LucideIcons from 'lucide-react';

const ContactSection = ({ data }) => {
    // Handle null data
    if (!data || !data.methods || data.methods.length === 0) {
        return null;
    }

    // Get the correct icon component
    const getIconComponent = (iconName) => {
        if (!iconName || typeof iconName !== 'string') return LucideIcons.Mail;

        return LucideIcons[iconName] || LucideIcons.Mail;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-2">
                {data.title || 'Contact Us'}
            </h3>
            {data.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                    {data.description}
                </p>
            )}

            <div className="space-y-4">
                {data.methods.map((method, index) => {
                    const Icon = getIconComponent(method.icon);
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={cn(
                                "p-4 rounded-lg",
                                "border border-gray-100 dark:border-gray-700",
                                "hover:border-primary/30 dark:hover:border-primary/30 transition-all",
                                "group"
                            )}
                        >
                            <div className="flex items-center mb-3">
                                <div className="p-2 rounded-md bg-primary/10 text-primary mr-3">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                    {method.title}
                                </h4>
                            </div>

                            <div className="pl-10 space-y-2">
                                <div className="text-base font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                    {method.value}
                                </div>

                                {method.description && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {method.description}
                                    </div>
                                )}

                                {method.link && method.action && (
                                    <div className="mt-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(method.link, '_blank')}
                                            className="rounded-full"
                                        >
                                            {method.action}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default ContactSection; 