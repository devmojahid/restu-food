import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, MessageSquare, TrendingUp } from 'lucide-react';

const Hero = ({ stats }) => {
    const statItems = [
        {
            icon: FileText,
            label: 'Articles',
            value: stats.total_posts,
            color: 'text-blue-600'
        },
        {
            icon: Users,
            label: 'Authors',
            value: stats.total_authors,
            color: 'text-green-600'
        },
        {
            icon: MessageSquare,
            label: 'Comments',
            value: stats.total_comments,
            color: 'text-purple-600'
        },
        {
            icon: TrendingUp,
            label: 'Monthly Readers',
            value: stats.monthly_readers,
            color: 'text-orange-600'
        }
    ];

    return (
        <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Discover Our Latest Articles
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 dark:text-gray-400"
                    >
                        Explore expert insights, cooking tips, and culinary adventures
                    </motion.p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {statItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm"
                        >
                            <div className="flex justify-center mb-4">
                                <item.icon className={`w-8 h-8 ${item.color}`} />
                            </div>
                            <h3 className="text-3xl font-bold mb-2">
                                {typeof item.value === 'number' 
                                    ? item.value.toLocaleString()
                                    : item.value}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {item.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
            </div>
        </section>
    );
};

export default Hero; 