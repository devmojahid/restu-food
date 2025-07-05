import React from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronRight, Bookmark, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const ChefSpecialties = ({ specialties = [] }) => {
    if (!specialties || specialties.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Specialties</h2>
                <p className="text-gray-500 dark:text-gray-400">
                    No specialties have been added for this chef yet.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Signature Specialties</h2>
            
            <div className="space-y-6">
                {specialties.map((specialty, index) => (
                    <SpecialtyItem 
                        key={specialty.id || index} 
                        specialty={specialty} 
                        index={index}
                        isLast={index === specialties.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};

const SpecialtyItem = ({ specialty, index, isLast }) => {
    // Animation variants
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                delay: index * 0.1
            }
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={cn(
                "flex flex-col md:flex-row gap-4 py-4",
                !isLast && "border-b border-gray-200 dark:border-gray-700"
            )}
        >
            {/* Image */}
            <div className="w-full md:w-1/3 md:max-w-[240px] h-48 md:h-40 rounded-xl overflow-hidden">
                <img 
                    src={specialty.image || '/images/default-dish.jpg'} 
                    alt={specialty.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
            </div>
            
            {/* Content */}
            <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{specialty.name}</h3>
                    
                    {/* Rating */}
                    {specialty.rating && (
                        <div className="flex items-center">
                            <div className="flex">
                                {Array(5).fill(0).map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={cn(
                                            "w-4 h-4", 
                                            i < Math.floor(specialty.rating) 
                                                ? "text-yellow-400 fill-yellow-400" 
                                                : "text-gray-300"
                                        )} 
                                    />
                                ))}
                            </div>
                            {specialty.reviews_count && (
                                <span className="text-sm text-gray-500 ml-1">
                                    ({specialty.reviews_count})
                                </span>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Cuisine Type */}
                {specialty.cuisine && (
                    <div className="mb-2">
                        <Badge variant="outline" className="text-primary border-primary">
                            {specialty.cuisine}
                        </Badge>
                        
                        {/* Spice Level */}
                        {specialty.spice_level && (
                            <span className="ml-2 inline-flex items-center">
                                {Array(3).fill(0).map((_, i) => (
                                    <Flame 
                                        key={i} 
                                        className={cn(
                                            "w-4 h-4", 
                                            i < specialty.spice_level 
                                                ? "text-red-500" 
                                                : "text-gray-300"
                                        )} 
                                    />
                                ))}
                            </span>
                        )}
                    </div>
                )}
                
                {/* Description */}
                {specialty.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        {specialty.description}
                    </p>
                )}
                
                {/* Key Ingredients */}
                {specialty.key_ingredients && specialty.key_ingredients.length > 0 && (
                    <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-500 mb-1">Key Ingredients:</h4>
                        <div className="flex flex-wrap gap-1">
                            {specialty.key_ingredients.map((ingredient, i) => (
                                <span 
                                    key={i}
                                    className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                                >
                                    {ingredient}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Dietary Tags */}
                {specialty.dietary_tags && specialty.dietary_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {specialty.dietary_tags.map((tag, i) => (
                            <Badge 
                                key={i}
                                variant="secondary" 
                                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ChefSpecialties; 