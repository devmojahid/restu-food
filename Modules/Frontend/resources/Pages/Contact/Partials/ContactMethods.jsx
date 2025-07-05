import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

const ContactMethods = ({ data }) => {
    const getIcon = (iconName) => {
        const icons = {
            Phone,
            Mail,
            MessageCircle
        };
        return icons[iconName];
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8 w-full overflow-hidden"
        >
            <div className="px-4 md:px-0">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    {data.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {data.description}
                </p>
            </div>

            <div className="grid gap-6 w-full px-4 md:px-0">
                {data.methods.map((method, index) => {
                    const Icon = getIcon(method.icon);
                    
                    return (
                        <motion.div
                            key={method.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative p-6 rounded-2xl",
                                "bg-white dark:bg-gray-900/50",
                                "border border-gray-200 dark:border-gray-800",
                                "hover:border-primary/50 dark:hover:border-primary/50",
                                "hover:shadow-lg dark:hover:shadow-primary/5",
                                "backdrop-blur-sm",
                                "transition-all duration-300",
                                "group"
                            )}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                                <div className={cn(
                                    "p-3 rounded-xl",
                                    "bg-primary/10 dark:bg-primary/5",
                                    "text-primary dark:text-primary/90",
                                    "group-hover:bg-primary group-hover:text-white",
                                    "transition-all duration-300",
                                    "w-fit"
                                )}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        {method.title}
                                    </h3>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {method.value}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        {method.description}
                                    </p>
                                    <Button 
                                        variant="outline"
                                        asChild
                                        className="w-full md:w-auto"
                                    >
                                        <a 
                                            href={method.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center space-x-2"
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{method.action}</span>
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default ContactMethods; 