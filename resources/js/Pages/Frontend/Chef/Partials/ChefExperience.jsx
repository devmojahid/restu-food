import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const ChefExperience = ({ experience = [] }) => {
    if (!experience || experience.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Experience</h2>
                <p className="text-gray-500 dark:text-gray-400">
                    No experience information has been added for this chef yet.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Professional Experience</h2>
            
            <div className="relative pl-8 before:absolute before:left-[11px] before:top-3 before:bottom-10 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
                {experience.map((item, index) => (
                    <ExperienceItem 
                        key={item.id || index} 
                        item={item} 
                        index={index}
                        isLast={index === experience.length - 1}
                    />
                ))}
            </div>
            
            {/* Resume Button */}
            {experience.length > 0 && experience[0].resume_link && (
                <div className="mt-8 text-center">
                    <Button 
                        asChild
                        className="rounded-full"
                    >
                        <a 
                            href={experience[0].resume_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Full Resume
                        </a>
                    </Button>
                </div>
            )}
        </div>
    );
};

const ExperienceItem = ({ item, index, isLast }) => {
    // Animation variants for staggered entries
    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
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
                "relative mb-8",
                isLast && "mb-0"
            )}
        >
            {/* Timeline Dot */}
            <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Briefcase className="w-3 h-3 text-white" />
            </div>
            
            {/* Content */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 ml-2 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                    <h3 className="text-lg font-semibold">{item.title || 'Unknown Position'}</h3>
                    
                    {/* Current Position Badge */}
                    {item.is_current && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Current
                        </Badge>
                    )}
                </div>
                
                {/* Company/Restaurant */}
                <div className="flex items-center text-primary font-medium mb-2">
                    {item.company || 'Unknown Restaurant'}
                    
                    {item.company_url && (
                        <a 
                            href={item.company_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-1 text-gray-500 hover:text-primary"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    )}
                </div>
                
                {/* Date and Location */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                            {item.start_date} 
                            {item.end_date ? ` - ${item.end_date}` : ' - Present'}
                        </span>
                    </div>
                    
                    {item.location && (
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{item.location}</span>
                        </div>
                    )}
                </div>
                
                {/* Description */}
                {item.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {item.description}
                    </p>
                )}
                
                {/* Achievements/Highlights */}
                {item.highlights && item.highlights.length > 0 && (
                    <div className="mb-3">
                        <h4 className="text-sm font-semibold mb-2">Highlights:</h4>
                        <ul className="space-y-1 text-gray-600 dark:text-gray-300 list-disc pl-5">
                            {item.highlights.map((highlight, idx) => (
                                <li key={idx}>{highlight}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {/* Skills */}
                {item.skills && item.skills.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Skills Applied:</h4>
                        <div className="flex flex-wrap gap-2">
                            {item.skills.map((skill, idx) => (
                                <Badge 
                                    key={idx}
                                    variant="secondary" 
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ChefExperience; 