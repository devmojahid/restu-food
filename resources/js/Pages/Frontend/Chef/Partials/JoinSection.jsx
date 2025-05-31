import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ChevronRight, CheckCircle, Utensils, Users, Award, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';

const JoinSection = ({ data = {} }) => {
    const defaultData = {
        title: "Join Our Team of Talented Chefs",
        description: "Are you passionate about creating extraordinary culinary experiences? Join our team of talented chefs and take your career to the next level.",
        image: "/images/chef-team.jpg",
        benefits: [
            { icon: Utensils, text: "Work with world-class ingredients" },
            { icon: Users, text: "Collaborate with passionate professionals" },
            { icon: Award, text: "Opportunities for career advancement" },
            { icon: Clock, text: "Flexible scheduling options" }
        ],
        cta: {
            text: "Apply Now",
            link: "/careers/chef"
        }
    };

    // Merge default data with provided data
    const sectionData = { ...defaultData, ...data };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="bg-gradient-to-r from-primary/90 to-primary-600 rounded-3xl overflow-hidden shadow-xl">
                    <div className="flex flex-col lg:flex-row">
                        {/* Image Section */}
                        <div className="lg:w-1/2 relative">
                            {/* Background image with overlay */}
                            <div 
                                className="h-64 lg:h-full bg-cover bg-center"
                                style={{ 
                                    backgroundImage: `url(${sectionData.image})`,
                                    filter: 'brightness(0.85)'
                                }}
                            />
                            
                            {/* Text overlay on the image (mobile only) */}
                            <div className="absolute inset-0 flex items-center justify-center lg:hidden">
                                <div className="text-white text-center px-6">
                                    <motion.h2 
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="text-3xl font-bold mb-2"
                                    >
                                        {sectionData.title}
                                    </motion.h2>
                                </div>
                            </div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="lg:w-1/2 p-8 lg:p-12 text-white">
                            {/* Title (desktop only) */}
                            <div className="hidden lg:block">
                                <motion.h2 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-3xl md:text-4xl font-bold mb-4"
                                >
                                    {sectionData.title}
                                </motion.h2>
                            </div>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-white/90 mb-8 text-lg"
                            >
                                {sectionData.description}
                            </motion.p>
                            
                            {/* Benefits */}
                            <div className="space-y-4 mb-8">
                                {sectionData.benefits.map((benefit, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 + (index * 0.1) }}
                                        className="flex items-center"
                                    >
                                        <CheckCircle className="w-5 h-5 mr-3 text-white" />
                                        <span className="text-white/90">{benefit.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                            
                            {/* Call to Action */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                            >
                                <Link href={sectionData.cta.link}>
                                    <Button 
                                        size="lg" 
                                        className="bg-white text-primary hover:bg-white/90 rounded-full group"
                                    >
                                        {sectionData.cta.text}
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JoinSection; 