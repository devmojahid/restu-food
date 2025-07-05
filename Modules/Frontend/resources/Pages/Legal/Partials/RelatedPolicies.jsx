import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

const RelatedPolicies = ({ data }) => {
    // Handle null data
    if (!data || !data.policies || data.policies.length === 0) {
        return null;
    }

    // Get the correct icon component
    const getIconComponent = (iconName) => {
        if (!iconName || typeof iconName !== 'string') return LucideIcons.FileText;

        return LucideIcons[iconName] || LucideIcons.FileText;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">
                {data.title || 'Related Policies'}
            </h3>
            {data.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                    {data.description}
                </p>
            )}

            <div className="space-y-4">
                {data.policies.map((policy, index) => {
                    const Icon = getIconComponent(policy.icon);
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Link
                                href={policy.link}
                                className={cn(
                                    "flex items-start p-4 rounded-lg transition-all group",
                                    "hover:bg-gray-50 dark:hover:bg-gray-700/50",
                                    "border border-gray-100 dark:border-gray-700"
                                )}
                            >
                                <div className="mr-4 p-2 rounded-md bg-primary/10 text-primary">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                            {policy.name}
                                        </h4>
                                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                    {policy.description && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {policy.description}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default RelatedPolicies; 