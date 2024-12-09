import React from 'react';
import { Link } from '@inertiajs/react';
import { Phone, MapPin, Clock, ChevronDown } from 'lucide-react';
import CurrencySwitcher from '@/Components/CurrencySwitcher';
import { Button } from '@/Components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const TopBar = () => {
    const { theme, toggleTheme } = useTheme();
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <div className="bg-primary/95 backdrop-blur-sm text-white border-b border-primary/10">
            <div className="container mx-auto">
                {/* Mobile View */}
                {isMobile ? (
                    <div className="px-4 py-2">
                        <div className="flex items-center justify-between">
                            <a 
                                href="tel:+17189044450" 
                                className="flex items-center space-x-2 hover:text-white/90 transition group"
                            >
                                <Phone className="h-4 w-4 group-hover:animate-bounce" />
                                <span className="text-sm font-medium">+1 718-904-4450</span>
                            </a>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-white/10"
                                    onClick={toggleTheme}
                                >
                                    {theme === 'light' ? (
                                        <Sun className="h-4 w-4" />
                                    ) : (
                                        <Moon className="h-4 w-4" />
                                    )}
                                </Button>
                                <div className="relative">
                                    <CurrencySwitcher />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Existing desktop view code
                    <div className="flex flex-col md:flex-row justify-between py-2 px-4">
                        {/* Left Side - Contact Info */}
                        <div className="flex items-center justify-center md:justify-start space-x-6 py-2 md:py-0">
                            <a 
                                href="tel:+17189044450" 
                                className="flex items-center space-x-2 hover:text-white/90 transition group"
                            >
                                <Phone className="h-4 w-4 group-hover:animate-bounce" />
                                <span className="text-sm font-medium">+1 718-904-4450</span>
                            </a>
                            <div className="hidden md:flex items-center space-x-2">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm">71 Madison Ave</span>
                            </div>
                            <div className="hidden lg:flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">Open: 8:00 AM - 10:00 PM</span>
                            </div>
                        </div>

                        {/* Right Side - Quick Links & Switchers */}
                        <div className="flex items-center justify-center md:justify-end space-x-4 py-2 md:py-0 border-t md:border-t-0 border-white/10">
                            <div className="flex items-center space-x-4">
                                <Link 
                                    href="/track-order" 
                                    className="text-sm font-medium hover:text-white/90 transition"
                                >
                                    Track Order
                                </Link>
                                <div className="h-4 w-px bg-white/20" />
                                <Link 
                                    href="/about" 
                                    className="text-sm font-medium hover:text-white/90 transition"
                                >
                                    About Us
                                </Link>
                                <div className="h-4 w-px bg-white/20" />
                                <Link 
                                    href="/contact" 
                                    className="text-sm font-medium hover:text-white/90 transition"
                                >
                                    Contact
                                </Link>
                            </div>

                            <div className="h-4 w-px bg-white/20" />

                            {/* Theme Switcher */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-white/10"
                                onClick={toggleTheme}
                            >
                                {theme === 'light' ? (
                                    <Sun className="h-4 w-4" />
                                ) : (
                                    <Moon className="h-4 w-4" />
                                )}
                            </Button>

                            {/* Currency Switcher */}
                            <div className="relative">
                                <CurrencySwitcher />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopBar; 