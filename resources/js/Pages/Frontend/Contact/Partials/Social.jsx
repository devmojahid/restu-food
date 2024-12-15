import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

const Social = ({ data }) => {
    const getIcon = (iconName) => {
        const icons = {
            Facebook,
            Twitter,
            Instagram,
            Linkedin
        };
        return icons[iconName];
    };

    return (
        <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
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
                        {data.description}
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                    {data.platforms.map((platform, index) => {
                        const Icon = getIcon(platform.icon);
                        
                        return (
                            <motion.a
                                key={platform.name}
                                href={platform.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "relative p-6 rounded-2xl",
                                    "bg-white dark:bg-gray-800",
                                    "border border-gray-200 dark:border-gray-700",
                                    "hover:border-primary dark:hover:border-primary",
                                    "transition-all duration-300",
                                    "text-center group",
                                    "shadow-sm hover:shadow-md"
                                )}
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 
                                            rounded-full bg-primary/10 text-primary 
                                            group-hover:bg-primary group-hover:text-white
                                            transition-colors duration-300">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {platform.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {platform.followers} Followers
                                </p>
                            </motion.a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Social; 