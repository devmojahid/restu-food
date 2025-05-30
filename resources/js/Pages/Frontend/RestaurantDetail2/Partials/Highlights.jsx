import React from 'react';
import { motion } from 'framer-motion';
import {
    Leaf,
    ChefHat,
    Wine,
    Calendar,
    Award,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

// Icon mapping for highlight items
const iconMapping = {
    'LeafIcon': Leaf,
    'ChefHatIcon': ChefHat,
    'WineIcon': Wine,
    'CalendarIcon': Calendar,
    'AwardIcon': Award
};

const HighlightCard = ({ highlight, index }) => {
    // Safely get the icon component or use a default
    const IconComponent = highlight?.icon ? iconMapping[highlight.icon] || Award : Award;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl 
                     transition-all duration-300 border border-gray-100 dark:border-gray-700"
        >
            {/* Top Section with Icon and Image */}
            <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <IconComponent className="w-6 h-6" />
                </div>

                {highlight?.image && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <img
                            src={highlight.image}
                            alt={highlight.title || 'Highlight'}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                )}
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                {highlight.title || 'Highlight Feature'}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
                {highlight.description || 'No description available'}
            </p>

            {/* Optional Link */}
            {highlight.link && (
                <a
                    href={highlight.link}
                    className="inline-flex items-center text-primary hover:text-primary/80 
                           text-sm font-medium transition-colors"
                >
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
            )}
        </motion.div>
    );
};

const Highlights = ({ highlights }) => {
    // Check if we have valid data
    if (!highlights || !highlights.items || highlights.items.length === 0) {
        return null;
    }

    return (
        <div className="py-8">
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {highlights.title || 'Restaurant Highlights'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {highlights.description || 'What makes us special'}
                </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {highlights.items.map((highlight, index) => (
                    <HighlightCard
                        key={highlight.id || index}
                        highlight={highlight}
                        index={index}
                    />
                ))}
            </div>

            {/* Optional CTA Button */}
            {highlights.cta && (
                <div className="text-center mt-12">
                    <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                            const section = document.getElementById(highlights.cta.targetSection || 'about');
                            if (section) {
                                const yOffset = -80;
                                const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                        }}
                    >
                        {highlights.cta.text || 'Learn More About Us'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Highlights; 