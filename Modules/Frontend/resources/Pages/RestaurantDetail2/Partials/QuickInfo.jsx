import React, { useState, useEffect } from 'react';
import {
    Clock,
    Phone,
    MapPin,
    Info,
    Menu,
    Calendar,
    Users,
    Camera,
    Star,
    MessageSquare,
    ChevronDown,
    ChevronUp,
    UserCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const QuickInfo = ({ restaurant }) => {
    const [isSticky, setIsSticky] = useState(false);
    const [activeSection, setActiveSection] = useState('menu');
    const [showHours, setShowHours] = useState(false);

    // Ensure we have restaurant data
    if (!restaurant) return null;

    // Navigation sections
    const sections = [
        { id: 'menu', label: 'Menu', icon: Menu },
        { id: 'gallery', label: 'Gallery', icon: Camera },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'about', label: 'About', icon: Info },
        { id: 'location', label: 'Location', icon: MapPin },
        { id: 'chefs', label: 'Chefs', icon: UserCircle2 },
        { id: 'booking', label: 'Reservations', icon: Calendar },
    ];

    // Handle scroll event to make the bar sticky
    useEffect(() => {
        const handleScroll = () => {
            const heroSection = document.getElementById('hero');
            if (heroSection) {
                const heroBottom = heroSection.getBoundingClientRect().bottom;
                setIsSticky(heroBottom <= 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle scroll spy to highlight active section
    useEffect(() => {
        const handleScrollSpy = () => {
            // Get all section elements
            const sectionElements = sections.map(section =>
                document.getElementById(section.id)
            ).filter(Boolean);

            // Find the section that is currently visible
            for (let i = sectionElements.length - 1; i >= 0; i--) {
                const section = sectionElements[i];
                const rect = section.getBoundingClientRect();

                if (rect.top <= 100) {
                    setActiveSection(section.id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScrollSpy);
        return () => window.removeEventListener('scroll', handleScrollSpy);
    }, [sections]);

    // Scroll to section
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const yOffset = -80;
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveSection(sectionId);
        }
    };

    return (
        <div className={cn(
            "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-20",
            "transition-all duration-200",
            isSticky && "sticky top-0 shadow-md"
        )}>
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-between py-3">
                    {/* Left: Quick Contact Info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        {/* Hours */}
                        <div className="relative">
                            <button
                                onClick={() => setShowHours(!showHours)}
                                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                <Clock className="w-4 h-4 mr-1.5" />
                                <span>Hours</span>
                                {showHours ? (
                                    <ChevronUp className="w-4 h-4 ml-1" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                )}
                            </button>

                            <AnimatePresence>
                                {showHours && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 
                                                 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 
                                                 p-4 z-30"
                                    >
                                        <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Opening Hours</h4>
                                        <div className="space-y-1.5">
                                            {restaurant.openingHours ? (
                                                Object.entries(restaurant.openingHours).map(([day, hours]) => (
                                                    <div key={day} className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">{day}</span>
                                                        <span className="text-gray-900 dark:text-white">{hours}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-gray-600 dark:text-gray-400">
                                                    Hours not available
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Phone */}
                        {restaurant.contactInfo?.phone && (
                            <a
                                href={`tel:${restaurant.contactInfo.phone}`}
                                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                <Phone className="w-4 h-4 mr-1.5" />
                                <span>{restaurant.contactInfo.phone}</span>
                            </a>
                        )}

                        {/* Address - Shortened */}
                        {restaurant.address && (
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                                <span className="truncate max-w-[200px]">
                                    {typeof restaurant.address === 'string'
                                        ? restaurant.address
                                        : restaurant.address.formatted || 'View location'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right: Navigation Tabs */}
                    <nav className="hidden md:flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-hide">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <Button
                                    key={section.id}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => scrollToSection(section.id)}
                                    className={cn(
                                        "flex items-center space-x-1 rounded-full px-3 py-1.5",
                                        activeSection === section.id
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{section.label}</span>
                                </Button>
                            );
                        })}
                    </nav>

                    {/* Mobile Navigation */}
                    <div className="md:hidden flex items-center">
                        <select
                            value={activeSection}
                            onChange={(e) => scrollToSection(e.target.value)}
                            className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-full 
                                     px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none 
                                     focus:ring-2 focus:ring-primary/20"
                        >
                            {sections.map(section => (
                                <option key={section.id} value={section.id}>
                                    {section.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickInfo; 