import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Hero = ({ data = {} }) => {
    const { title, subtitle, description, image, animation, stats } = data;

    return (
        <div
            className={cn(
                "bg-primary-50 relative overflow-hidden",
                image ? "py-16 md:py-24" : "py-12 md:py-16"
            )}
        >
            {/* Background image */}
            {image && (
                <div className="absolute inset-0 z-0 opacity-15">
                    <img
                        src={image}
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-700/30 to-primary-900/30"></div>
                </div>
            )}

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl">
                    {subtitle && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                                {subtitle}
                            </span>
                        </motion.div>
                    )}

                    <motion.h1
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {title || 'Express Checkout'}
                    </motion.h1>

                    {description && (
                        <motion.p
                            className="mt-4 text-lg text-gray-600 md:pr-16 max-w-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {description}
                        </motion.p>
                    )}

                    {stats && stats.length > 0 && (
                        <motion.div
                            className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center sm:items-start"
                                >
                                    <div className="flex flex-row items-center gap-2 mb-2">
                                        {stat.icon === 'lock' && (
                                            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        )}
                                        {stat.icon === 'truck' && (
                                            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                            </svg>
                                        )}
                                        {stat.icon === 'star' && (
                                            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        )}
                                        <span className="font-bold text-2xl text-primary-800">
                                            {stat.value}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-600">{stat.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hero; 