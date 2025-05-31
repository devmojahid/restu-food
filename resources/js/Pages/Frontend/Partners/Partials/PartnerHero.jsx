import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';

const PartnerHero = ({ data }) => {
    // Ensure data has all required properties with fallbacks
    const title = data?.title || 'Join Our Platform';
    const subtitle = data?.subtitle || 'Partnership Opportunities';
    const description = data?.description || 'Discover exciting opportunities to partner with us.';
    const image = data?.image || '/images/default-hero.jpg';
    const cta = data?.cta || { text: 'Apply Now', link: '#apply' };
    const stats = data?.stats || [];

    const handleScrollToContent = () => {
        const contentSection = document.querySelector('#how-it-works');
        if (contentSection) {
            const offset = 80;
            const elementPosition = contentSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden pt-20 md:pt-0">
            {/* Background Image with Parallax Effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            />

            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent dark:from-black/95 dark:via-black/80 dark:to-black/50" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm mb-6"
                        >
                            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span>{subtitle}</span>
                        </motion.div>

                        {/* Title with Enhanced Animation */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight"
                        >
                            {title}
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
                        >
                            {description}
                        </motion.p>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mb-12"
                        >
                            <Button
                                size="lg"
                                className="rounded-full bg-primary hover:bg-primary/90 text-white px-8"
                                asChild
                            >
                                <a href={cta.link}>{cta.text}</a>
                            </Button>
                        </motion.div>

                        {/* Stats Grid */}
                        {stats.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                                        className={cn(
                                            "text-center p-3 md:p-4 rounded-xl",
                                            "bg-white/5 backdrop-blur-md border border-white/10",
                                            "hover:bg-white/10 transition-all duration-300",
                                            "group"
                                        )}
                                    >
                                        <div className="text-2xl md:text-4xl font-bold text-white group-hover:text-primary transition-colors">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs md:text-sm text-white/70 group-hover:text-white/90 transition-colors">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                onClick={handleScrollToContent}
                className="absolute left-1/2 -translate-x-1/2 bottom-8 text-white flex flex-col items-center space-y-2 cursor-pointer group"
            >
                <span className="text-sm font-medium">Learn More</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
            </motion.button>
        </div>
    );
};

export default PartnerHero; 