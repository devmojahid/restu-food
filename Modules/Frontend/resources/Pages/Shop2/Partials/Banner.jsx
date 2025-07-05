import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronRight, ExternalLink } from 'lucide-react';

const Banner = ({ banner = null }) => {
    if (!banner) {
        return null;
    }
    
    // Default banner if none provided
    const defaultBanner = {
        title: "Limited Time Offer",
        subtitle: "Special discount on all products",
        description: "Get exclusive deals on our premium collection. Limited stock available!",
        cta: {
            text: "Shop Now",
            link: "/shop"
        },
        image: "/images/banners/default-banner.jpg",
        backgroundColor: "bg-indigo-900",
        textColor: "text-white"
    };
    
    // Merge with defaults for safety
    const bannerData = { ...defaultBanner, ...banner };
    
    return (
        <section className="py-12">
            <div className="container px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className={`rounded-2xl overflow-hidden relative shadow-xl ${bannerData.backgroundColor || 'bg-indigo-900'}`}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center">
                        {/* Content */}
                        <div className="p-8 md:p-12 lg:p-16 md:w-3/5 relative z-10">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                {bannerData.subtitle && (
                                    <p className={`text-sm md:text-base font-medium mb-3 ${bannerData.textColor || 'text-white'} opacity-80`}>
                                        {bannerData.subtitle}
                                    </p>
                                )}
                                
                                <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight ${bannerData.textColor || 'text-white'}`}>
                                    {bannerData.title}
                                </h2>
                                
                                <p className={`text-base md:text-lg mb-8 max-w-lg ${bannerData.textColor || 'text-white'} opacity-90`}>
                                    {bannerData.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-4">
                                    <Link href={bannerData.cta.link}>
                                        <Button
                                            size="lg"
                                            className="bg-white text-indigo-900 hover:bg-gray-100 group"
                                        >
                                            {bannerData.cta.text}
                                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    
                                    {bannerData.secondaryCta && (
                                        <Link href={bannerData.secondaryCta.link}>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="border-white/40 text-white hover:bg-white/10"
                                            >
                                                {bannerData.secondaryCta.text}
                                                <ExternalLink className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                        
                        {/* Image */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="md:w-2/5 relative"
                        >
                            {/* Circular Highlight */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-3/4 h-3/4 rounded-full bg-white/10 backdrop-blur-sm"></div>
                            </div>
                            
                            <img 
                                src={bannerData.image} 
                                alt={bannerData.title}
                                className="w-full h-auto object-cover md:h-full max-h-[300px] md:max-h-none"
                                style={{ objectFit: "contain" }}
                            />
                        </motion.div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </motion.div>
            </div>
        </section>
    );
};

export default Banner; 