import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Search, 
    ShoppingBag, 
    ArrowRight, 
    Store, 
    Users, 
    Globe,
    ChevronDown,
    X
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';

const Hero = ({ data, stats = [] }) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            window.location.href = `/shop2?search=${encodeURIComponent(searchValue)}`;
        }
    };
    
    const getIconByName = (iconName) => {
        switch (iconName) {
            case 'ShoppingBag': return ShoppingBag;
            case 'Store': return Store;
            case 'Users': return Users;
            case 'Globe': return Globe;
            default: return ShoppingBag;
        }
    };
    
    return (
        <div className="relative overflow-hidden">
            {/* Mobile Search Bar (Fixed) */}
            {isMobileSearchOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center p-4 md:hidden">
                    <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Search Products</h3>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setIsMobileSearchOpen(false)}
                                className="rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input 
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="pl-10 py-6 text-lg rounded-xl"
                                    autoFocus
                                />
                            </div>
                            <Button type="submit" className="w-full py-6">Search</Button>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Background Pattern */}
            {data?.background_pattern && (
                <div className="absolute inset-0 opacity-50 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-primary/20 to-transparent" />
                    <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                    <svg
                        className="absolute inset-0 w-full h-full opacity-5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                    >
                        <defs>
                            <pattern
                                id="grid-pattern"
                                width="40"
                                height="40"
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d="M 40 0 L 0 0 0 40"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                    </svg>
                </div>
            )}
            
            {/* Hero Content */}
            <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
                <div className="max-w-3xl mx-auto md:mx-0">
                    {/* Mobile search button */}
                    <div className="flex md:hidden justify-center mb-6">
                        <Button 
                            variant="outline"
                            size="lg"
                            className="w-full rounded-full flex items-center justify-between"
                            onClick={() => setIsMobileSearchOpen(true)}
                        >
                            <div className="flex items-center">
                                <Search className="w-5 h-5 mr-2" />
                                <span>Search products...</span>
                            </div>
                            <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                    
                    {/* Hero Title and Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center md:text-left mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
                            {data?.title || 'Shop Premium Products'}
                        </h1>
                        <h2 className="text-xl md:text-2xl font-medium text-primary mb-4">
                            {data?.subtitle || 'Quality Selection'}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 md:pr-12">
                            {data?.description || 'Find the perfect products for your needs with our comprehensive collection.'}
                        </p>
                    </motion.div>
                    
                    {/* Desktop Search Form */}
                    <div className="hidden md:block mb-8">
                        <form onSubmit={handleSearch} className="relative max-w-xl">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className={cn(
                                    "flex items-center overflow-hidden",
                                    "bg-white dark:bg-gray-800 rounded-full shadow-lg",
                                    searchFocused && "ring-2 ring-primary"
                                )}
                            >
                                <Search className="ml-5 w-5 h-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search for products..."
                                    className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-r-none py-6"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                />
                                <Button 
                                    type="submit"
                                    className="rounded-l-none h-full px-6"
                                >
                                    Search
                                </Button>
                            </motion.div>
                        </form>
                    </div>
                    
                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex justify-center md:justify-start"
                    >
                        <a 
                            href={data?.cta?.link || '#products'} 
                            className="group inline-flex items-center bg-primary hover:bg-primary/90 
                                     text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-lg 
                                     font-semibold transition-colors"
                        >
                            <span>{data?.cta?.text || 'Explore Products'}</span>
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                </div>
            </div>
            
            {/* Stats Bar */}
            {data?.stats && data.stats.length > 0 && (
                <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-4 md:py-0">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {data.stats.map((stat, index) => {
                                const Icon = getIconByName(stat.icon);
                                return (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                                        className="flex flex-col items-center py-2 md:py-6 border-r last:border-r-0 dark:border-gray-700"
                                    >
                                        <div className="flex items-center mb-1 text-primary">
                                            <Icon className="w-5 h-5 mr-2" />
                                            <span className="text-xl font-bold">{stat.value}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hero; 