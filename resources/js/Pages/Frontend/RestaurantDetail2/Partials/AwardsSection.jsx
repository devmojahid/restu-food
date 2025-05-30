import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal, Star, Crown, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

// Icon mapping for awards
const iconMapping = {
    'MichelinIcon': Star,
    'JamesBeardIcon': Award,
    'WineSpectatorIcon': Trophy,
    'WorldsBestIcon': Crown,
    'AwardIcon': Medal
};

const AwardCard = ({ award, index }) => {
    // Safely get the icon component or use a default
    const IconComponent = award?.icon ? iconMapping[award.icon] || Award : Award;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md 
                     border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all"
        >
            {/* Award Icon */}
            <div className="mb-4 text-primary">
                <IconComponent className="w-10 h-10" />
            </div>

            {/* Award Image (if available) */}
            {award?.image && (
                <div className="relative w-16 h-16 mb-4 rounded-full overflow-hidden 
                              border-2 border-primary/20 shadow-md">
                    <img
                        src={award.image}
                        alt={award.name || 'Award'}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Award Name */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-1">
                {award?.name || 'Award'}
            </h3>

            {/* Award Year */}
            {award?.year && (
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                    {award.year}
                </div>
            )}

            {/* Award Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {award?.description || 'Recognition for excellence'}
            </p>
        </motion.div>
    );
};

const AwardsSection = ({ awards }) => {
    // Check if we have valid data
    if (!awards || !awards.awards || awards.awards.length === 0) {
        return null;
    }

    const awardsList = awards.awards;

    return (
        <div className="py-16 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute -right-20 top-0 text-primary/5 transform rotate-12">
                <Trophy className="w-64 h-64" />
            </div>
            <div className="absolute -left-20 bottom-0 text-primary/5 transform -rotate-12">
                <Medal className="w-64 h-64" />
            </div>

            {/* Section Header */}
            <div className="text-center mb-12 relative z-10">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {awards.title || 'Awards & Recognition'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {awards.description || 'Our commitment to excellence has been recognized by industry experts'}
                </p>
            </div>

            {/* Awards Grid */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {awardsList.map((award, index) => (
                        <AwardCard
                            key={award?.id || index}
                            award={award}
                            index={index}
                        />
                    ))}
                </div>

                {/* Certification Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center justify-center mt-12 mb-4"
                >
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 
                                 border border-primary/20 text-primary">
                        <BadgeCheck className="w-5 h-5 mr-2" />
                        <span className="font-medium">Verified Excellence</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AwardsSection; 