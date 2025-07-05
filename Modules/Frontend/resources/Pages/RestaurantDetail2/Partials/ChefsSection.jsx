import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ChefHat,
    Star,
    Award,
    Quote,
    Link,
    Instagram,
    Twitter,
    Facebook,
    Linkedin,
    Globe,
    ArrowUpRight,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const ChefsSection = ({ chefs = null }) => {
    const [activeChef, setActiveChef] = useState(null);

    // If chefs is null or empty, display placeholder message
    if (!chefs || chefs.length === 0) {
        return (
            <section id="chefs" className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Chefs</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                        <ChefHat className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Chef Information Not Available</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            We're currently updating information about our culinary team. Please check back later.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // View chef details
    const handleViewChef = (chef) => {
        setActiveChef(chef);
    };

    return (
        <section id="chefs" className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
                        <ChefHat className="w-6 h-6 text-primary" />
                        Meet Our Culinary Team
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        The talented chefs behind our exceptional cuisine, bringing passion and creativity to every dish
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {chefs.map((chef, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md group"
                        >
                            {/* Chef Image */}
                            <div className="relative h-64 overflow-hidden">
                                {chef.image ? (
                                    <img
                                        src={chef.image}
                                        alt={chef.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <ChefHat className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}

                                {/* Expertise Badge */}
                                {chef.expertise && (
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-primary text-white px-3 py-1">
                                            {chef.expertise}
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Chef Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-1">{chef.name}</h3>
                                <p className="text-primary font-medium mb-3">{chef.role}</p>

                                {/* Short Bio */}
                                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                    {chef.shortBio}
                                </p>

                                {/* Specialties */}
                                {chef.specialties && chef.specialties.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium mb-2">Specialties:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {chef.specialties.map((specialty, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="outline"
                                                    className="bg-primary/10 text-primary hover:bg-primary/20"
                                                >
                                                    {specialty}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Social Links */}
                                {chef.socialLinks && (
                                    <div className="flex space-x-3 mb-4">
                                        {chef.socialLinks.instagram && (
                                            <a
                                                href={chef.socialLinks.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                                                aria-label={`${chef.name}'s Instagram`}
                                            >
                                                <Instagram className="w-5 h-5" />
                                            </a>
                                        )}
                                        {chef.socialLinks.twitter && (
                                            <a
                                                href={chef.socialLinks.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                                                aria-label={`${chef.name}'s Twitter`}
                                            >
                                                <Twitter className="w-5 h-5" />
                                            </a>
                                        )}
                                        {chef.socialLinks.facebook && (
                                            <a
                                                href={chef.socialLinks.facebook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                                                aria-label={`${chef.name}'s Facebook`}
                                            >
                                                <Facebook className="w-5 h-5" />
                                            </a>
                                        )}
                                        {chef.socialLinks.linkedin && (
                                            <a
                                                href={chef.socialLinks.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                                                aria-label={`${chef.name}'s LinkedIn`}
                                            >
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                        {chef.socialLinks.website && (
                                            <a
                                                href={chef.socialLinks.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                                                aria-label={`${chef.name}'s Website`}
                                            >
                                                <Globe className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                )}

                                {/* View Profile Button */}
                                <Button
                                    variant="outline"
                                    className="w-full group"
                                    onClick={() => handleViewChef(chef)}
                                >
                                    <span>View Profile</span>
                                    <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* More Chefs Link */}
                {chefs.moreLink && (
                    <div className="text-center mt-10">
                        <a
                            href={chefs.moreLink}
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/90 font-medium transition-colors"
                        >
                            <span>Meet Our Full Culinary Team</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>
                )}

                {/* Chef Detail Modal */}
                {activeChef && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div
                            className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                {/* Header Image */}
                                {activeChef.headerImage ? (
                                    <div className="h-40 md:h-56 overflow-hidden">
                                        <img
                                            src={activeChef.headerImage}
                                            alt={`${activeChef.name} background`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-24 bg-primary/10" />
                                )}

                                {/* Close Button */}
                                <button
                                    className="absolute top-4 right-4 bg-black bg-opacity-30 text-white rounded-full p-2 hover:bg-opacity-50 transition-colors"
                                    onClick={() => setActiveChef(null)}
                                    aria-label="Close chef profile"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Chef Avatar */}
                                <div className="absolute bottom-0 left-8 transform translate-y-1/2">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden">
                                        {activeChef.image ? (
                                            <img
                                                src={activeChef.image}
                                                alt={activeChef.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <ChefHat className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 pt-16 md:pt-20">
                                <div className="flex flex-wrap justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">{activeChef.name}</h3>
                                        <p className="text-primary font-medium">{activeChef.role}</p>
                                    </div>

                                    {/* Achievements/Awards */}
                                    {activeChef.awards && activeChef.awards.length > 0 && (
                                        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                                            {activeChef.awards.map((award, idx) => (
                                                <Badge
                                                    key={idx}
                                                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500 flex items-center gap-1"
                                                >
                                                    <Award className="w-3 h-3" />
                                                    {award}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Bio */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold mb-3">About</h4>
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        {activeChef.fullBio ? (
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {activeChef.fullBio}
                                            </p>
                                        ) : (
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {activeChef.shortBio}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Experience & Education */}
                                    <div>
                                        {/* Experience */}
                                        {activeChef.experience && activeChef.experience.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-lg font-semibold mb-3">Experience</h4>
                                                <div className="space-y-4">
                                                    {activeChef.experience.map((exp, idx) => (
                                                        <div key={idx} className="border-l-2 border-primary pl-4">
                                                            <h5 className="font-medium">{exp.role}</h5>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {exp.place}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                                {exp.period}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Education */}
                                        {activeChef.education && activeChef.education.length > 0 && (
                                            <div>
                                                <h4 className="text-lg font-semibold mb-3">Education</h4>
                                                <div className="space-y-4">
                                                    {activeChef.education.map((edu, idx) => (
                                                        <div key={idx} className="border-l-2 border-primary pl-4">
                                                            <h5 className="font-medium">{edu.degree}</h5>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {edu.institution}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                                {edu.year}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        {/* Signature Dishes */}
                                        {activeChef.signatureDishes && activeChef.signatureDishes.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-lg font-semibold mb-3">Signature Dishes</h4>
                                                <div className="space-y-2">
                                                    {activeChef.signatureDishes.map((dish, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 flex items-start"
                                                        >
                                                            {dish.image ? (
                                                                <img
                                                                    src={dish.image}
                                                                    alt={dish.name}
                                                                    className="w-12 h-12 object-cover rounded-md mr-3"
                                                                />
                                                            ) : (
                                                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md mr-3 flex items-center justify-center">
                                                                    <AlertCircle className="w-6 h-6 text-gray-400" />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <h5 className="font-medium">{dish.name}</h5>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {dish.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Philosophy/Quote */}
                                        {activeChef.philosophy && (
                                            <div className="mb-6">
                                                <h4 className="text-lg font-semibold mb-3">Culinary Philosophy</h4>
                                                <blockquote className="p-4 border-l-4 border-primary bg-primary/5 italic text-gray-700 dark:text-gray-300">
                                                    <Quote className="w-5 h-5 text-primary mb-2" />
                                                    "{activeChef.philosophy}"
                                                </blockquote>
                                            </div>
                                        )}

                                        {/* Contact or Social */}
                                        {activeChef.socialLinks && (
                                            <div>
                                                <h4 className="text-lg font-semibold mb-3">Connect</h4>
                                                <div className="flex space-x-4">
                                                    {activeChef.socialLinks.instagram && (
                                                        <a
                                                            href={activeChef.socialLinks.instagram}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                                                            aria-label={`${activeChef.name}'s Instagram`}
                                                        >
                                                            <Instagram className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                    {activeChef.socialLinks.twitter && (
                                                        <a
                                                            href={activeChef.socialLinks.twitter}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                                                            aria-label={`${activeChef.name}'s Twitter`}
                                                        >
                                                            <Twitter className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                    {activeChef.socialLinks.facebook && (
                                                        <a
                                                            href={activeChef.socialLinks.facebook}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                                                            aria-label={`${activeChef.name}'s Facebook`}
                                                        >
                                                            <Facebook className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                    {activeChef.socialLinks.linkedin && (
                                                        <a
                                                            href={activeChef.socialLinks.linkedin}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                                                            aria-label={`${activeChef.name}'s LinkedIn`}
                                                        >
                                                            <Linkedin className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                    {activeChef.socialLinks.website && (
                                                        <a
                                                            href={activeChef.socialLinks.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                                                            aria-label={`${activeChef.name}'s Website`}
                                                        >
                                                            <Globe className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Close Button */}
                                <div className="mt-8 flex justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => setActiveChef(null)}
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ChefsSection; 