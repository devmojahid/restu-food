import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

const CommunitySupport = ({ data }) => {
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
                    {data.title || 'Community Support'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    {data.description || 'Connect with other users and find solutions to common problems'}
                </p>
            </motion.div>

            {/* Community Platforms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.platforms?.map((platform, index) => {
                    // Dynamically get the icon component
                    const IconComponent = platform.icon && LucideIcons[platform.icon] ?
                        LucideIcons[platform.icon] :
                        LucideIcons.Users;

                    return (
                        <motion.div
                            key={index}
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
                                "overflow-hidden",
                                "p-8"
                            )}
                        >
                            <Link
                                href={platform.link || '#'}
                                className="block h-full"
                            >
                                <div className="flex items-start">
                                    {/* Icon */}
                                    <div className="mr-5">
                                        <div className={cn(
                                            "p-4 rounded-xl",
                                            "bg-primary/10 text-primary",
                                            "group-hover:bg-primary group-hover:text-white",
                                            "transition-colors duration-300",
                                            "w-16 h-16 flex items-center justify-center"
                                        )}>
                                            <IconComponent className="w-8 h-8" />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        {/* Title */}
                                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                            {platform.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            {platform.description}
                                        </p>

                                        {/* Stats */}
                                        {platform.stats && (
                                            <div className="inline-block px-3 py-1 text-sm font-medium rounded-lg 
                                                     bg-gray-100 dark:bg-gray-700 
                                                     text-gray-700 dark:text-gray-300 mb-4">
                                                {platform.stats}
                                            </div>
                                        )}

                                        {/* View Link */}
                                        <div className="pt-2 flex items-center text-primary font-medium">
                                            <span>Join Community</span>
                                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>

                                {/* Top Right Corner Graphics */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-3xl z-0"></div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Community Benefits */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                            Why Join Our Community?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Connect with thousands of users, share experiences, and get help from our active community members.
                        </p>
                    </div>

                    <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            {
                                icon: 'Lightbulb',
                                title: 'Get fresh ideas',
                                description: 'Discover creative ways to use our products from other community members'
                            },
                            {
                                icon: 'Clock',
                                title: 'Quick solutions',
                                description: 'Often get answers to your questions faster than official support channels'
                            },
                            {
                                icon: 'Heart',
                                title: 'Share your expertise',
                                description: 'Help others and build your reputation within the community'
                            },
                            {
                                icon: 'Bell',
                                title: 'Stay updated',
                                description: 'Be the first to know about new features, tips, and platform updates'
                            }
                        ].map((benefit, index) => {
                            const BenefitIcon = LucideIcons[benefit.icon] || LucideIcons.Check;

                            return (
                                <div key={index} className="flex items-start">
                                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm mr-4">
                                        <BenefitIcon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                            {benefit.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CommunitySupport; 