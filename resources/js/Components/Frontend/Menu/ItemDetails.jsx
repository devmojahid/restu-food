import React from 'react';
import { motion } from 'framer-motion';
import { 
    Star, 
    Clock, 
    ShieldCheck,
    Leaf,
    Tag,
    AlertCircle
} from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';

const ItemDetails = ({ item }) => {
    return (
        <div className="space-y-6">
            {/* Categories and Badges */}
            <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="text-sm">
                    {item.category}
                </Badge>
                {item.is_popular && (
                    <Badge variant="default" className="bg-orange-500">
                        Popular Choice
                    </Badge>
                )}
                {item.is_vegetarian && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                        <Leaf className="w-3 h-3 mr-1" />
                        Vegetarian
                    </Badge>
                )}
            </div>

            {/* Title and Rating */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {item.name}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="font-medium">{item.rating}</span>
                        <span className="text-gray-600">
                            ({item.reviews_count} reviews)
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span>{item.preparation_time} mins</span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.description}
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                    {
                        icon: ShieldCheck,
                        label: 'Quality Assured',
                        description: 'Fresh ingredients'
                    },
                    {
                        icon: Tag,
                        label: 'Best Price',
                        description: 'Value for money'
                    },
                    {
                        icon: Clock,
                        label: 'Quick Prep',
                        description: `${item.preparation_time} mins`
                    }
                ].map((feature) => (
                    <motion.div
                        key={feature.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                    >
                        <feature.icon className="w-6 h-6 text-primary mb-2" />
                        <h3 className="font-medium text-gray-900 dark:text-white">
                            {feature.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Allergen Info */}
            {item.allergens?.length > 0 && (
                <div className="flex items-start gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                            Allergen Information
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Contains: {item.allergens.join(', ')}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetails; 