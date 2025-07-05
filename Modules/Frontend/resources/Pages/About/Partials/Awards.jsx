import React from 'react';
import { motion } from 'framer-motion';
import { 
    Award, 
    Trophy, 
    Medal, 
    Star,
    Calendar,
    ExternalLink,
    ArrowUpRight,
    Building2,
    Globe,
    BadgeCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const AwardCard = ({ award, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={cn(
                "group relative",
                "bg-white dark:bg-gray-800",
                "rounded-2xl overflow-hidden",
                "border border-gray-100 dark:border-gray-700",
                "shadow-lg hover:shadow-xl",
                "transition-all duration-300"
            )}
        >
            {/* Award Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={award.image}
                    alt={award.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Year Badge */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <Badge 
                        variant="secondary" 
                        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                    >
                        <Calendar className="w-3 h-3 mr-1" />
                        {award.year}
                    </Badge>
                </div>

                {/* Organization Logo */}
                <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 p-2 shadow-lg">
                        <img
                            src={`/images/organizations/${award.organization.toLowerCase().replace(/\s+/g, '-')}.png`}
                            alt={award.organization}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {award.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {award.organization}
                        </p>
                    </div>
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 
                                flex items-center justify-center text-primary"
                    >
                        <Trophy className="w-5 h-5" />
                    </motion.div>
                </div>

                {/* Categories/Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {award.categories?.map((category) => (
                        <Badge 
                            key={category} 
                            variant="secondary"
                            className="bg-gray-100 dark:bg-gray-700/50"
                        >
                            {category}
                        </Badge>
                    ))}
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {award.description}
                </p>

                {/* Stats/Highlights */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {award.highlights?.map((highlight, idx) => (
                        <div 
                            key={idx}
                            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30"
                        >
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {highlight.value}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {highlight.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Button */}
                <Button
                    variant="outline"
                    className="w-full group"
                    onClick={() => window.open(award.link, '_blank')}
                >
                    <span>View Award Details</span>
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-primary/5 
                         rounded-full blur-2xl opacity-0 group-hover:opacity-100 
                         transition-opacity duration-500" />
        </motion.div>
    );
};

const Awards = ({ data }) => {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 
                             rounded-full blur-3xl opacity-50 dark:opacity-30" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 
                             rounded-full blur-3xl opacity-50 dark:opacity-30" />
            </div>

            <div className="container mx-auto px-4 relative">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full 
                                bg-primary/10 dark:bg-primary/20 text-primary mb-6"
                    >
                        <Award className="w-8 h-8" />
                    </motion.div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {data.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {data.subtitle}
                    </p>
                </motion.div>

                {/* Awards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.awards.map((award, index) => (
                        <AwardCard 
                            key={award.title} 
                            award={award} 
                            index={index}
                        />
                    ))}
                </div>

                {/* Recognition Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8"
                >
                    {[
                        {
                            icon: Trophy,
                            value: '25+',
                            label: 'Industry Awards',
                            color: 'text-yellow-500'
                        },
                        {
                            icon: Building2,
                            value: '100+',
                            label: 'Partner Organizations',
                            color: 'text-blue-500'
                        },
                        {
                            icon: Globe,
                            value: '15+',
                            label: 'Countries Recognized',
                            color: 'text-green-500'
                        },
                        {
                            icon: BadgeCheck,
                            value: '5+',
                            label: 'Years of Excellence',
                            color: 'text-purple-500'
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative p-6 rounded-2xl",
                                "bg-white dark:bg-gray-800",
                                "border border-gray-100 dark:border-gray-700",
                                "text-center group",
                                "hover:shadow-lg transition-shadow duration-300"
                            )}
                        >
                            <div className={cn(
                                "inline-flex items-center justify-center",
                                "w-12 h-12 rounded-full mb-4",
                                "bg-gray-50 dark:bg-gray-700/50",
                                stat.color,
                                "group-hover:scale-110",
                                "transition-transform duration-300"
                            )}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Awards; 