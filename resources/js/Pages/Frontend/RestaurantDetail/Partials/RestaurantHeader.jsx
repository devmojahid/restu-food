import React from 'react';
import { motion } from 'framer-motion';
import {
    Phone,
    Mail,
    Globe,
    Facebook,
    Instagram,
    Twitter,
    Share2,
    Heart,
    Award,
    Clock,
    ThumbsUp,
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/Components/ui/tooltip';

const RestaurantHeader = ({ restaurant }) => {
    const {
        contactInfo,
        statistics,
    } = restaurant || {};

    const socialIcons = {
        facebook: Facebook,
        instagram: Instagram,
        twitter: Twitter,
    };

    return (
        <div className="mt-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column - Statistics Cards */}
                <div className="w-full md:w-3/4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                        {statistics && Object.entries(statistics)
                            .slice(0, 6)
                            .map(([key, value], index) => {
                                const icons = {
                                    averageRating: ThumbsUp,
                                    totalReviews: Award,
                                    satisfactionRate: ThumbsUp,
                                    averageWaitTime: Clock,
                                    totalDishes: Award,
                                    monthlyVisitors: Users,
                                };

                                const labels = {
                                    averageRating: 'Average Rating',
                                    totalReviews: 'Total Reviews',
                                    satisfactionRate: 'Satisfaction',
                                    averageWaitTime: 'Wait Time',
                                    totalDishes: 'Menu Items',
                                    monthlyVisitors: 'Monthly Visitors',
                                };

                                const IconComponent = icons[key] || Award;

                                return (
                                    <motion.div
                                        key={key}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-primary/10 rounded-full">
                                                <IconComponent className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {labels[key] || key}
                                                </p>
                                                <p className="text-lg font-semibold">
                                                    {key === 'satisfactionRate' ? `${value}%` : value}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                    </motion.div>
                </div>

                {/* Right Column - Contact and Actions */}
                <div className="w-full md:w-1/4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4">Contact Info</h3>

                        {/* Contact Details */}
                        <div className="space-y-4">
                            {contactInfo?.phone && (
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <a
                                        href={`tel:${contactInfo.phone}`}
                                        className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                                    >
                                        {contactInfo.phone}
                                    </a>
                                </div>
                            )}

                            {contactInfo?.email && (
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <a
                                        href={`mailto:${contactInfo.email}`}
                                        className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                                    >
                                        {contactInfo.email}
                                    </a>
                                </div>
                            )}

                            {contactInfo?.website && (
                                <div className="flex items-center space-x-3">
                                    <Globe className="w-4 h-4 text-gray-500" />
                                    <a
                                        href={contactInfo.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                                    >
                                        Website
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Social Media */}
                        {contactInfo?.socialMedia && (
                            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                    Follow Us
                                </p>
                                <div className="flex space-x-3">
                                    {Object.entries(contactInfo.socialMedia).map(([platform, url]) => {
                                        const SocialIcon = socialIcons[platform] || Globe;

                                        return (
                                            <TooltipProvider key={platform}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <a
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full 
                                                                    hover:bg-primary/10 hover:text-primary 
                                                                    transition-colors"
                                                        >
                                                            <SocialIcon className="w-4 h-4" />
                                                        </a>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="capitalize">{platform}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                            >
                                <Heart className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Restaurant Description */}
            <div className="mt-8">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {restaurant?.description || 'No description available.'}
                </p>
            </div>

            {/* Tags */}
            {restaurant?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {restaurant.tags.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="rounded-full"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RestaurantHeader; 