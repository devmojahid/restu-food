import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, MapPin, Clock, Utensils, ChevronRight, Share2, Heart, Check } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const ChefHero = ({ chef }) => {
    if (!chef) return null;
    
    return (
        <div className="relative bg-gradient-to-b from-black/90 to-black/40 pt-12 pb-8 text-white">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                style={{
                    backgroundImage: `url(${chef.cover_image || '/images/default-chef-cover.jpg'})`,
                }}
            />
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Chef Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-xl flex-shrink-0"
                    >
                        <img 
                            src={chef.image || '/images/default-chef.jpg'} 
                            alt={chef.name}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    
                    {/* Chef Info */}
                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {/* Chef Name and Verification */}
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-2 mb-2">
                                <h1 className="text-3xl md:text-4xl font-bold">
                                    {chef.name}
                                </h1>
                                {chef.verified && (
                                    <Badge 
                                        className="bg-primary/90 text-white"
                                        variant="secondary"
                                    >
                                        <Check className="w-3 h-3 mr-1" />
                                        Verified
                                    </Badge>
                                )}
                            </div>
                            
                            {/* Chef Role */}
                            <p className="text-xl text-white/90 mb-3">
                                {chef.role || 'Executive Chef'}
                            </p>
                            
                            {/* Stats Row */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 mb-4">
                                {/* Rating */}
                                <div className="flex items-center">
                                    <div className="flex">
                                        {Array(5).fill(0).map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={cn(
                                                    "w-4 h-4", 
                                                    i < Math.floor(chef.rating || 4.5) 
                                                        ? "text-yellow-400 fill-yellow-400" 
                                                        : "text-gray-400"
                                                )} 
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-white/90">
                                        {chef.rating || 4.5} ({chef.reviews_count || 0} reviews)
                                    </span>
                                </div>
                                
                                {/* Experience */}
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1.5 text-white/70" />
                                    <span>{chef.experience || '10+ years'}</span>
                                </div>
                                
                                {/* Cuisine */}
                                <div className="flex items-center">
                                    <Utensils className="w-4 h-4 mr-1.5 text-white/70" />
                                    <span>{chef.cuisine || 'Various Cuisines'}</span>
                                </div>
                                
                                {/* Location */}
                                {chef.location && (
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1.5 text-white/70" />
                                        <span>{chef.location}</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Badges/Specialties */}
                            {chef.top_specialties && chef.top_specialties.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {chef.top_specialties.map((specialty, index) => (
                                        <Badge 
                                            key={index}
                                            variant="outline" 
                                            className="bg-white/10 text-white border-white/20"
                                        >
                                            {specialty}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            
                            {/* Bio */}
                            <p className="text-white/80 max-w-3xl mb-6 line-clamp-2">
                                {chef.bio || 'An experienced chef with a passion for creating extraordinary culinary experiences.'}
                            </p>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <Button className="rounded-full">
                                    Book Chef
                                </Button>
                                <Button variant="outline" className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                                    <Heart className="w-4 h-4 mr-2" />
                                    Add to Wishlist
                                </Button>
                                <Button variant="outline" className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChefHero; 