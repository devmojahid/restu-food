import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const Locations = ({ data }) => {
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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.locations.map((location, index) => (
                        <motion.div
                            key={location.city}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                                "relative p-6 rounded-2xl",
                                "bg-white dark:bg-gray-800",
                                "border border-gray-200 dark:border-gray-700",
                                "hover:border-primary dark:hover:border-primary",
                                "transition-all duration-300",
                                "group shadow-sm hover:shadow-md"
                            )}
                        >
                            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6">
                                <img 
                                    src={location.image} 
                                    alt={location.city}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                {location.city}
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-primary mt-1" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {location.address}
                                    </span>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Phone className="w-5 h-5 text-primary mt-1" />
                                    <a 
                                        href={`tel:${location.phone}`}
                                        className="text-gray-600 dark:text-gray-400 hover:text-primary"
                                    >
                                        {location.phone}
                                    </a>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Mail className="w-5 h-5 text-primary mt-1" />
                                    <a 
                                        href={`mailto:${location.email}`}
                                        className="text-gray-600 dark:text-gray-400 hover:text-primary"
                                    >
                                        {location.email}
                                    </a>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Clock className="w-5 h-5 text-primary mt-1" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {location.hours}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Locations; 