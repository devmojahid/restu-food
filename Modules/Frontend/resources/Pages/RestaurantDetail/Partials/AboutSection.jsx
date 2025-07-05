import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Award, Clock, Users, Utensils, History, LightbulbIcon, Milestone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';

const AboutSection = ({ about }) => {
    if (!about) {
        return (
            <div className="py-8 text-center">
                <p className="text-gray-500">About information not available</p>
            </div>
        );
    }

    const {
        title = 'About Us',
        mission = '',
        history = '',
        philosophy = '',
        milestones = [],
        images = []
    } = about;

    return (
        <div className="space-y-12">
            {/* Title */}
            <div className="text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-4"
                >
                    {title}
                </motion.h2>
                <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            {/* Mission & Philosophy Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
                >
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                            <Award className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">Our Mission</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {mission}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
                >
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                            <LightbulbIcon className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">Our Philosophy</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {philosophy}
                    </p>
                </motion.div>
            </div>

            {/* History & Images Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 lg:col-span-2"
                >
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                            <History className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">Our History</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {history}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
                >
                    <h3 className="text-xl font-semibold mb-4">Gallery</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {images.length > 0 ? (
                            images.slice(0, 4).map((image, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg overflow-hidden aspect-square"
                                >
                                    <img
                                        src={image}
                                        alt={`About ${index + 1}`}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-8 text-gray-500">
                                No images available
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Milestones Timeline */}
            {milestones.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
                >
                    <h3 className="text-xl font-semibold mb-6 text-center">Our Journey</h3>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-4 md:left-1/2 h-full w-0.5 bg-primary/20 transform -translate-x-1/2"></div>

                        {/* Timeline Events */}
                        <div className="space-y-8">
                            {milestones.map((milestone, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "relative flex items-center",
                                        "md:even:flex-row-reverse"
                                    )}
                                >
                                    {/* Year Circle */}
                                    <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center transform -translate-x-1/2 z-10">
                                        <span className="text-white text-xs font-bold">{milestone.year.toString().substring(2)}</span>
                                    </div>

                                    {/* Content */}
                                    <div className={cn(
                                        "ml-12 md:ml-0 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4",
                                        "md:w-[calc(50%-2rem)]",
                                        index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                                    )}>
                                        <div className="flex items-center mb-2">
                                            <Badge variant="outline" className="mr-2">{milestone.year}</Badge>
                                            <h4 className="font-medium">{milestone.event}</h4>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AboutSection; 