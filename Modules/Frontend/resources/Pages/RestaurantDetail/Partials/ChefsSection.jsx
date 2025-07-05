import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Award, UtensilsCrossed, ExternalLink, Instagram, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';

const ChefsSection = ({ chefs = [] }) => {
    if (!chefs.length) {
        return null;
    }

    return (
        <section className="py-16">
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center mb-4"
                >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <ChefHat className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">Meet Our Chefs</h2>
                </motion.div>
                <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                >
                    The culinary masters behind our exceptional dining experience
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {chefs.map((chef, index) => (
                    <ChefCard
                        key={index}
                        chef={chef}
                        index={index}
                    />
                ))}
            </div>
        </section>
    );
};

const ChefCard = ({ chef, index }) => {
    const {
        name,
        position,
        image,
        bio,
        awards = [],
        signature_dish,
        social_links = {}
    } = chef;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden 
                     hover:shadow-xl transition-all duration-300 h-full"
        >
            {/* Chef Image with Overlay */}
            <div className="relative h-72 overflow-hidden">
                <img
                    src={image || '/images/chefs/placeholder.jpg'}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 
                           group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80"></div>

                {/* Position Badge */}
                <div className="absolute top-4 left-4">
                    <Badge className="bg-primary/90 text-white">{position}</Badge>
                </div>

                {/* Social Links */}
                {social_links && Object.keys(social_links).length > 0 && (
                    <div className="absolute top-4 right-4 flex space-x-2">
                        {social_links.instagram && (
                            <a
                                href={social_links.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center 
                                       justify-center hover:bg-white/40 transition-colors"
                            >
                                <Instagram className="w-4 h-4 text-white" />
                            </a>
                        )}
                        {social_links.twitter && (
                            <a
                                href={social_links.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center 
                                       justify-center hover:bg-white/40 transition-colors"
                            >
                                <Twitter className="w-4 h-4 text-white" />
                            </a>
                        )}
                    </div>
                )}

                {/* Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Bio */}
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-4">
                    {bio}
                </p>

                {/* Awards */}
                {awards && awards.length > 0 && (
                    <div>
                        <div className="flex items-center mb-2">
                            <Award className="w-4 h-4 text-yellow-500 mr-2" />
                            <h4 className="text-sm font-medium">Awards & Recognition</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {awards.map((award, i) => (
                                <Badge
                                    key={i}
                                    variant="outline"
                                    className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                                >
                                    {award}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Signature Dish */}
                {signature_dish && (
                    <div>
                        <div className="flex items-center mb-2">
                            <UtensilsCrossed className="w-4 h-4 text-primary mr-2" />
                            <h4 className="text-sm font-medium">Signature Dish</h4>
                        </div>
                        <p className="text-sm italic text-gray-600 dark:text-gray-400">
                            "{signature_dish}"
                        </p>
                    </div>
                )}

                {/* Read More Button */}
                <Button
                    variant="ghost"
                    className="w-full mt-4 group"
                >
                    <span>Read Full Bio</span>
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </motion.div>
    );
};

export default ChefsSection; 