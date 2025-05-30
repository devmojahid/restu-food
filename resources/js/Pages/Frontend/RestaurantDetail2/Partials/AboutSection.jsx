import React from 'react';
import { motion } from 'framer-motion';
import {
    Info,
    Users,
    Calendar,
    Award,
    ChevronRight,
    History,
    Globe,
    Gift,
    ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const AboutSection = ({ about = null }) => {
    // If about is null or empty, display placeholder message
    if (!about) {
        return (
            <section id="about" className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">About</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                        <Info className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">About Information Not Available</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            We're currently updating the information about this restaurant. Please check back later.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="about" className="py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                            <Info className="w-6 h-6 text-primary" />
                            {about.title || "About Us"}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            {about.subtitle || "Learn more about our story, team, and culinary philosophy"}
                        </p>
                    </div>

                    {about.fullStoryLink && (
                        <a
                            href={about.fullStoryLink}
                            className="inline-flex items-center gap-2 mt-4 md:mt-0 text-primary hover:text-primary/90 font-medium transition-colors"
                        >
                            <span>Read Full Story</span>
                            <ChevronRight className="w-4 h-4" />
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
                            {/* Main Image */}
                            {about.mainImage && (
                                <div className="h-64 md:h-80 overflow-hidden">
                                    <img
                                        src={about.mainImage}
                                        alt={about.title || "About our restaurant"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6 md:p-8">
                                <h3 className="text-xl font-semibold mb-4">
                                    {about.storyTitle || "Our Story"}
                                </h3>

                                <div className="prose prose-lg dark:prose-invert max-w-none">
                                    <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {about.story || "Story content goes here"}
                                    </p>

                                    {about.paragraphs && about.paragraphs.map((paragraph, index) => (
                                        <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                {/* Quote if available */}
                                {about.quote && (
                                    <blockquote className="my-6 p-4 border-l-4 border-primary bg-primary/5 italic text-gray-700 dark:text-gray-300">
                                        "{about.quote}"
                                        {about.quoteAuthor && (
                                            <footer className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                — {about.quoteAuthor}
                                                {about.quoteRole && (
                                                    <span className="font-normal">, {about.quoteRole}</span>
                                                )}
                                            </footer>
                                        )}
                                    </blockquote>
                                )}

                                {/* Mission & Vision */}
                                {(about.mission || about.vision) && (
                                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {about.mission && (
                                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                                                <h4 className="font-semibold mb-2 text-primary">Our Mission</h4>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {about.mission}
                                                </p>
                                            </div>
                                        )}

                                        {about.vision && (
                                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                                                <h4 className="font-semibold mb-2 text-primary">Our Vision</h4>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {about.vision}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Values */}
                                {about.values && about.values.length > 0 && (
                                    <div className="mt-8">
                                        <h4 className="font-semibold mb-4">Our Values</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {about.values.map((value, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-700/20"
                                                >
                                                    {value.icon && (
                                                        <div className="mr-3 text-primary">
                                                            <value.icon className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h5 className="font-medium">{value.title}</h5>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {value.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Awards and Recognition in content area if available */}
                                {about.awards && about.awards.length > 0 && (
                                    <div className="mt-8">
                                        <h4 className="font-semibold mb-4">Awards & Recognition</h4>
                                        <div className="space-y-3">
                                            {about.awards.map((award, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/20"
                                                >
                                                    <Award className="w-5 h-5 text-yellow-500 mr-3" />
                                                    <div>
                                                        <h5 className="font-medium">{award.title}</h5>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {award.year}
                                                            {award.issuer && ` • ${award.issuer}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* CTA if available */}
                                {about.cta && (
                                    <div className="mt-8 flex justify-center">
                                        <a
                                            href={about.cta.link}
                                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full transition-colors"
                                        >
                                            <span>{about.cta.text}</span>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <div className="space-y-6">
                            {/* Team Section */}
                            {about.team && about.team.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <Users className="w-5 h-5 text-primary mr-2" />
                                        Our Team
                                    </h3>

                                    <div className="space-y-4">
                                        {about.team.map((member, index) => (
                                            <div key={index} className="flex items-center">
                                                {member.image ? (
                                                    <img
                                                        src={member.image}
                                                        alt={member.name}
                                                        className="w-12 h-12 rounded-full object-cover mr-3"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                                        <span className="text-primary font-semibold">
                                                            {member.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}

                                                <div>
                                                    <h4 className="font-medium">{member.name}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {member.role}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Key Facts */}
                            {about.keyFacts && about.keyFacts.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Key Facts
                                    </h3>

                                    <div className="space-y-3">
                                        {about.keyFacts.map((fact, index) => (
                                            <div key={index} className="flex items-start">
                                                <div className="mt-1 mr-3 text-primary">
                                                    {fact.icon === 'calendar' && <Calendar className="w-5 h-5" />}
                                                    {fact.icon === 'globe' && <Globe className="w-5 h-5" />}
                                                    {fact.icon === 'history' && <History className="w-5 h-5" />}
                                                    {fact.icon === 'gift' && <Gift className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h5 className="font-medium">{fact.label}</h5>
                                                    <p className="text-gray-700 dark:text-gray-300">
                                                        {fact.value}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Specialties */}
                            {about.specialties && about.specialties.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Our Specialties
                                    </h3>

                                    <div className="flex flex-wrap gap-2">
                                        {about.specialties.map((specialty, index) => (
                                            <Badge key={index} className="bg-primary/10 text-primary hover:bg-primary/20">
                                                {specialty}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Press Features */}
                            {about.press && about.press.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Press & Media
                                    </h3>

                                    <div className="space-y-3">
                                        {about.press.map((item, index) => (
                                            <a
                                                key={index}
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                            >
                                                {item.logo ? (
                                                    <img
                                                        src={item.logo}
                                                        alt={item.publication}
                                                        className="w-8 h-8 object-contain mr-3"
                                                    />
                                                ) : (
                                                    <Globe className="w-5 h-5 text-primary mr-3" />
                                                )}

                                                <div>
                                                    <h5 className="font-medium text-primary hover:underline">
                                                        {item.title}
                                                    </h5>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {item.publication}
                                                        {item.date && ` • ${item.date}`}
                                                    </p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection; 