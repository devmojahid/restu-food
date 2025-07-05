import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Trophy, Users, Gift, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';

const Hero = ({ data = {} }) => {
    const {
        title = 'Loyalty Rewards Program',
        subtitle = 'Earn points with every order',
        description = 'Join our rewards program and earn points with every order',
        image = '/images/default-hero.jpg',
        cta = { text: 'Start Earning', link: '/rewards/register' },
        stats = []
    } = data;

    // Safe stats handling
    const safeStats = Array.isArray(stats) ? stats : [];

    // Default stats if none provided
    const defaultStats = [
        { label: 'Points Earned', value: '10M+', icon: 'Trophy' },
        { label: 'Members', value: '500K+', icon: 'Users' },
        { label: 'Rewards Redeemed', value: '250K+', icon: 'Gift' },
        { label: 'Avg. Savings', value: '15%', icon: 'Percent' }
    ];

    // Use provided stats or fallback to defaults
    const displayStats = safeStats.length > 0 ? safeStats : defaultStats;

    // Enhanced scroll functionality
    const handleScrollToContent = useCallback(() => {
        const contentSection = document.querySelector('#rewards-program');
        if (contentSection) {
            const offset = 80; // Adjust for fixed header
            const elementPosition = contentSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    // Helper function to get icon component based on icon name string
    const getIconComponent = (iconName) => {
        const icons = {
            'Trophy': Trophy,
            'Users': Users,
            'Gift': Gift,
            'Percent': Percent
        };

        const IconComponent = icons[iconName] || Trophy;
        return <IconComponent className="w-6 h-6" />;
    };

    return (
        <div className="relative h-[600px] lg:h-[700px] w-full overflow-hidden">
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

            {/* Gradient Overlay with Enhanced Design */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md 
                                     text-white px-4 py-2 rounded-full text-sm mb-6"
                        >
                            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span>{subtitle}</span>
                        </motion.div>

                        {/* Title with Enhanced Animation */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight"
                        >
                            {title}
                        </motion.h1>

                        {/* Description with Gradient Text */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-lg md:text-xl text-transparent bg-clip-text 
                                     bg-gradient-to-r from-white to-white/60 mb-8 max-w-2xl"
                        >
                            {description}
                        </motion.p>

                        {/* CTA Buttons with Enhanced Hover Effects */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Button
                                asChild
                                className="group relative overflow-hidden bg-primary hover:bg-primary/90 
                                         text-white px-8 py-6 rounded-full text-lg font-semibold 
                                         transition-all duration-300 flex items-center space-x-2"
                            >
                                <a href={cta.link}>
                                    <span className="relative z-10">{cta.text}</span>
                                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 
                                                  translate-x-full group-hover:translate-x-0 transition-transform" />
                                </a>
                            </Button>

                            <Button
                                variant="outline"
                                className="group relative overflow-hidden bg-white/10 backdrop-blur-sm 
                                         hover:bg-white/20 text-white px-8 py-6 rounded-full text-lg 
                                         font-semibold transition-all duration-300"
                                onClick={handleScrollToContent}
                            >
                                <span className="relative z-10">Learn More</span>
                                <div className="absolute inset-0 bg-white/10 transform -skew-x-12 
                                              translate-x-full group-hover:translate-x-0 transition-transform" />
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="absolute bottom-10 left-0 right-0">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {displayStats.map((stat, index) => {
                            const Icon = typeof stat.icon === 'string'
                                ? () => getIconComponent(stat.icon)
                                : stat.icon || Trophy;

                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.8 + (index * 0.1) }
                                    }}
                                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 
                                             border border-white/20 text-white text-center"
                                >
                                    <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-white/20 
                                                   flex items-center justify-center">
                                        <Icon />
                                    </div>
                                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                    <div className="text-sm text-gray-300">{stat.label}</div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                onClick={handleScrollToContent}
                className="absolute bottom-28 md:bottom-40 left-1/2 -translate-x-1/2 text-white flex flex-col 
                         items-center space-y-2 cursor-pointer group"
            >
                <span className="text-sm font-medium">Scroll Down</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
            </motion.button>
        </div>
    );
};

export default Hero; 