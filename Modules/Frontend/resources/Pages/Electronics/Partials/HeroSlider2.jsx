import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
    Autoplay,
    Pagination,
    Navigation,
    EffectFade,
    EffectCoverflow,
    EffectCreative,
    Thumbs,
    Controller
} from 'swiper/modules';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowRight, 
    ChevronDown, 
    ArrowUpRight, 
    Search, 
    ShoppingBag, 
    Menu, 
    ChevronRight,
    Star,
    Clock,
    Calendar,
    MapPin,
    Tag,
    Play,
    Pause,
    XCircle,
    ChevronLeft,
    Bookmark,
    Heart,
    Share2,
    TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useArraySafety from '@/Hooks/useArraySafety';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/Components/ui/drawer";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Separator } from "@/Components/ui/separator";
import { Progress } from "@/Components/ui/progress";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-creative';
import 'swiper/css/thumbs';

// Video overlay component
const VideoOverlay = ({ videoUrl, onClose }) => {
    if (!videoUrl) return null;
    
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        >
            <button 
                onClick={onClose}
                className="absolute top-5 right-5 text-white z-10"
                aria-label="Close video"
            >
                <XCircle className="w-8 h-8" />
            </button>
            <div className="relative w-full max-w-4xl aspect-video">
                <iframe 
                    src={videoUrl + "?autoplay=1"} 
                    className="absolute inset-0 w-full h-full"
                    title="Promotional video"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                />
            </div>
        </motion.div>
    );
};

// Search Overlay component
const SearchOverlay = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef(null);
    
    // Focus input when overlay opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle search submission
        console.log('Searching for:', searchTerm);
        // Would typically redirect to search results page
    };
    
    if (!isOpen) return null;
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 pt-20 px-4"
        >
            <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
                <form onSubmit={handleSubmit} className="p-1">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for food, restaurants, dishes..."
                            className="pl-12 pr-12 py-6 w-full text-lg border-none focus:ring-0"
                        />
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>
                </form>
                
                {searchTerm && (
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Popular Searches</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Pizza', 'Burger', 'Sushi', 'Italian', 'Vegetarian'].map((term) => (
                                <Badge key={term} variant="outline" className="cursor-pointer hover:bg-primary/10">
                                    {term}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Promotion banner component that can be shown inside or above the slider
const PromoBanner = ({ data, position = 'top' }) => {
    if (!data) return null;
    
    const { title, discount, code, endDate, link } = data;
    
    return (
        <div className={cn(
            "w-full bg-primary/90 text-white py-2 px-4 backdrop-blur-sm",
            position === 'top' ? 'relative' : 'absolute top-0 left-0 right-0 z-10'
        )}>
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-white/80" />
                    <span className="text-sm font-medium">
                        {title}: <span className="font-bold">{discount}% OFF</span> with code <span className="font-mono bg-white/20 px-2 py-0.5 rounded">{code}</span>
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-xs hidden md:block">
                        <span>Ends in: </span>
                        <span className="font-mono">{endDate}</span>
                    </div>
                    <Link href={link} className="text-xs underline hover:text-white/80">
                        Shop Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Hero search component for finding restaurants or dishes
const HeroSearch = ({ className }) => {
    const [searchType, setSearchType] = useState('restaurants');
    const [location, setLocation] = useState('');
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    
    const handleSearch = (e) => {
        e.preventDefault();
        setIsSearching(true);
        
        // Simulate search delay
        setTimeout(() => {
            setIsSearching(false);
            // Redirect would happen here in a real implementation
            console.log('Searching for:', query, 'in', location, 'type:', searchType);
        }, 1000);
    };
    
    return (
        <div className={cn("bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg", className)}>
            <form onSubmit={handleSearch}>
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <Button
                            type="button"
                            variant={searchType === 'restaurants' ? 'default' : 'ghost'}
                            className={cn(
                                "flex-1 rounded-lg",
                                searchType === 'restaurants' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300'
                            )}
                            onClick={() => setSearchType('restaurants')}
                        >
                            Restaurants
                        </Button>
                        <Button
                            type="button"
                            variant={searchType === 'dishes' ? 'default' : 'ghost'}
                            className={cn(
                                "flex-1 rounded-lg",
                                searchType === 'dishes' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300'
                            )}
                            onClick={() => setSearchType('dishes')}
                        >
                            Dishes
                        </Button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Your location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                type="text"
                                placeholder={`Search for ${searchType}`}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        
                        <Button 
                            type="submit" 
                            className="bg-primary hover:bg-primary/90"
                            disabled={isSearching}
                        >
                            {isSearching ? (
                                <>
                                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

// QuickLinks component for direct navigation
const QuickLinks = ({ className }) => {
    const links = [
        { name: 'Near Me', icon: MapPin, url: '/restaurants?filter=nearby' },
        { name: 'Top Rated', icon: Star, url: '/restaurants?filter=top-rated' },
        { name: 'Fast Delivery', icon: Clock, url: '/restaurants?filter=fast-delivery' },
        { name: 'Special Offers', icon: Tag, url: '/restaurants?filter=offers' },
    ];
    
    return (
        <div className={cn("flex flex-wrap justify-center gap-2 md:gap-4", className)}>
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url}
                    className="flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm 
                           hover:bg-primary hover:text-white px-4 py-2 rounded-full 
                           shadow-md transition-colors duration-300 text-sm md:text-base"
                >
                    <link.icon className="h-4 w-4 mr-2" />
                    <span>{link.name}</span>
                </Link>
            ))}
        </div>
    );
};

// Stats component to display key statistics
const Stats = ({ className }) => {
    const stats = [
        { value: '5000+', label: 'Restaurants' },
        { value: '25k+', label: 'Food Items' },
        { value: '500k+', label: 'Customers' },
        { value: '98%', label: 'Satisfaction' },
    ];
    
    return (
        <div className={cn("flex flex-wrap justify-center gap-6", className)}>
            {stats.map((stat, index) => (
                <div 
                    key={index} 
                    className="flex flex-col items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm 
                           rounded-lg shadow-md px-6 py-3"
                >
                    <span className="text-xl md:text-2xl font-bold text-primary">{stat.value}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
                </div>
            ))}
        </div>
    );
};

// Promotional badge component
const PromoBadge = ({ data, className }) => {
    const { title, discount, code, endDate, link } = data;
    
    return (
        <div className={cn(
            "bg-gradient-to-r from-primary/90 to-primary/80 text-white py-3 px-6 rounded-full shadow-lg backdrop-blur-sm",
            className
        )}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    <span className="font-medium">{title}:</span>
                    <span className="font-bold mx-2">{discount}% OFF</span>
                    <span className="hidden sm:inline">with code</span>
                    <span className="bg-white text-primary font-bold mx-2 px-2 py-1 rounded">
                        {code}
                    </span>
                </div>
                
                <div className="flex items-center">
                    <span className="text-sm mr-3">
                        Ends: {endDate}
                    </span>
                    <Link href={link} className="bg-white text-primary px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                        Get Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Video modal component
const VideoModal = ({ slide }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <>
            <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white transition-colors"
                onClick={() => setIsOpen(true)}
            >
                <Play className="h-6 w-6" />
            </Button>
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black">
                    <div className="relative aspect-video">
                        <iframe
                            src={`${slide.videoUrl}?autoplay=1`}
                            className="absolute top-0 left-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <DialogFooter className="p-4 bg-gray-900 text-white">
                        <h3 className="text-lg font-semibold">{slide.title}</h3>
                        <DialogClose asChild>
                            <Button variant="ghost" className="text-white">
                                <XCircle className="h-5 w-5 mr-2" />
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

// Main component
const HeroSlider = ({ 
    slides = [], 
    type = 'slider',
    effect = 'slide',
    autoplay = true,
    showSearch = false,
    showQuickLinks = false,
    showStats = false,
    showPromo = false,
    promoData = {},
    className,
    ...props
}) => {
     // FIX 1: Properly use the useArraySafety hook
     const { ensureArray } = useArraySafety();
     const safeSlides = ensureArray(slides, []);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const progressIntervalRef = useRef(null);
    const durationPerSlide = 5000; // 5 seconds per slide
    
    // Handle pagination with progress bar
    useEffect(() => {
        if (autoplay && !isPaused && type === 'slider') {
            progressIntervalRef.current = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        return 0;
                    }
                    return prev + 1;
                });
            }, durationPerSlide / 100);
        }
        
        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [autoplay, isPaused, type]);
    
    // Reset progress when slide changes
    useEffect(() => {
        setProgress(0);
    }, [currentIndex]);
    
    // Handle slide change
    const handleSlideChange = (swiper) => {
        setCurrentIndex(swiper.activeIndex);
    };
    
    // Toggle autoplay
    const toggleAutoplay = () => {
        setIsPaused(!isPaused);
    };
    
    // Get slider effect
    const getSliderEffect = () => {
        switch (effect) {
            case 'fade':
                return EffectFade;
            case 'coverflow':
                return EffectCoverflow;
            case 'creative':
                return EffectCreative;
            default:
                return null;
        }
    };
    
    // Get slider effect params
    const getSliderEffectParams = () => {
        switch (effect) {
            case 'fade':
                return {
                    fadeEffect: {
                        crossFade: true
                    }
                };
            case 'coverflow':
                return {
                    coverflowEffect: {
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true
                    }
                };
            case 'creative':
                return {
                    creativeEffect: {
                        prev: {
                            shadow: true,
                            translate: [0, 0, -400],
                        },
                        next: {
                            translate: ['100%', 0, 0],
                        },
                    }
                };
            default:
                return {};
        }
    };
    
    // If we have no slides, return nothing
    if (safeSlides.length === 0) {
        return null;
    }
    
    // If we want a static hero (single slide), display the first slide only
    if (type === 'hero' && safeSlides.length > 0) {
        const heroSlide = safeSlides[0];
        
        return (
            <div className={cn("relative w-full", className)}>
                {/* Hero image */}
                <div className="relative h-[70vh] overflow-hidden">
                    <img
                        src={heroSlide.image}
                        alt={heroSlide.title}
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-4">
                            <div className="max-w-2xl">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                                >
                                    {heroSlide.title}
                                </motion.h1>
                                
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-lg md:text-xl text-white/90 mb-8"
                                >
                                    {heroSlide.description}
                                </motion.p>
                                
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="flex flex-wrap gap-4"
                                >
                                    {heroSlide.cta && (
                                        <Link
                                            href={heroSlide.cta.link}
                                            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-medium inline-flex items-center transition-colors duration-300"
                                        >
                                            {heroSlide.cta.text}
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    )}
                                    
                                    {heroSlide.secondaryCta && (
                                        <Link
                                            href={heroSlide.secondaryCta.link}
                                            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-full font-medium inline-flex items-center transition-colors duration-300"
                                        >
                                            {heroSlide.secondaryCta.text}
                                            <ArrowUpRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    )}
                                    
                                    {heroSlide.videoUrl && (
                                        <VideoModal slide={heroSlide} />
                                    )}
                                </motion.div>
                                
                                {/* Show search bar */}
                                {showSearch && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.6 }}
                                        className="mt-8 max-w-xl"
                                    >
                                        <HeroSearch />
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Stats section */}
                    {showStats && (
                        <div className="absolute bottom-8 left-0 right-0 px-4">
                            <div className="container mx-auto">
                                <Stats />
                            </div>
                        </div>
                    )}
                    
                    {/* Quick links */}
                    {showQuickLinks && (
                        <div className="absolute top-6 right-6">
                            <QuickLinks className="flex-col space-y-2" />
                        </div>
                    )}
                </div>
                
                {/* Promo badge */}
                {showPromo && Object.keys(promoData).length > 0 && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-4xl px-4">
                        <PromoBadge data={promoData} />
                    </div>
                )}
            </div>
        );
    }
    
    // Default slider mode
    return (
        <div className={cn("relative w-full", className)}>
            {/* Promo badge */}
            {showPromo && Object.keys(promoData).length > 0 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-4xl px-4">
                    <PromoBadge data={promoData} />
                </div>
            )}
            
            {/* Main slider */}
            <Swiper
                modules={[
                    Autoplay,
                    Pagination,
                    Navigation,
                    Thumbs,
                    Controller,
                    getSliderEffect()
                ].filter(Boolean)}
                slidesPerView={1}
                effect={['fade', 'coverflow', 'creative'].includes(effect) ? effect : undefined}
                {...getSliderEffectParams()}
                thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                loop={true}
                autoplay={autoplay && !isPaused ? {
                    delay: durationPerSlide,
                    disableOnInteraction: false
                } : false}
                pagination={{
                    clickable: true,
                    dynamicBullets: true
                }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                onSlideChange={handleSlideChange}
                className="h-[70vh]"
                {...props}
            >
                {safeSlides?.map((slide, index) => (
                    <SwiperSlide key={slide.id || index}>
                        <div className="relative h-full w-full">
                            {/* Slide background image */}
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="h-full w-full object-cover"
                            />
                            
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                            
                            {/* Content */}
                            <div className="absolute inset-0 flex items-center">
                                <div className="container mx-auto px-4">
                                    <div className="max-w-2xl">
                                        <motion.span
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="inline-block bg-primary/90 text-white text-sm font-medium px-3 py-1 rounded-full mb-4"
                                        >
                                            {slide.badge || 'Featured'}
                                        </motion.span>
                                        
                                        <motion.h2
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.1 }}
                                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
                                        >
                                            {slide.title}
                                        </motion.h2>
                                        
                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            className="text-lg text-white/90 mb-8"
                                        >
                                            {slide.description}
                                        </motion.p>
                                        
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                            className="flex flex-wrap gap-4"
                                        >
                                            {slide.cta && (
                                                <Link
                                                    href={slide.cta.link}
                                                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-medium inline-flex items-center transition-colors duration-300"
                                                >
                                                    {slide.cta.text}
                                                    <ArrowRight className="ml-2 h-5 w-5" />
                                                </Link>
                                            )}
                                            
                                            {slide.secondaryCta && (
                                                <Link
                                                    href={slide.secondaryCta.link}
                                                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-full font-medium inline-flex items-center transition-colors duration-300"
                                                >
                                                    {slide.secondaryCta.text}
                                                    <ChevronRight className="ml-2 h-5 w-5" />
                                                </Link>
                                            )}
                                            
                                            {slide.videoUrl && (
                                                <VideoModal slide={slide} />
                                            )}
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                
                {/* Custom navigation buttons */}
                <div className="swiper-button-prev custom-swiper-button-prev !left-4 !text-white after:!text-[0] bg-black/20 hover:bg-black/40 backdrop-blur-sm !w-10 !h-10 rounded-full grid place-items-center">
                    <ChevronLeft className="h-6 w-6" />
                </div>
                <div className="swiper-button-next custom-swiper-button-next !right-4 !text-white after:!text-[0] bg-black/20 hover:bg-black/40 backdrop-blur-sm !w-10 !h-10 rounded-full grid place-items-center">
                    <ChevronRight className="h-6 w-6" />
                </div>
                
                {/* Autoplay control */}
                <div className="absolute bottom-4 left-4 z-10">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white transition-colors"
                        onClick={toggleAutoplay}
                    >
                        {isPaused ? (
                            <Play className="h-5 w-5" />
                        ) : (
                            <Pause className="h-5 w-5" />
                        )}
                    </Button>
                </div>
                
                {/* Slide counter */}
                <div className="absolute bottom-4 right-4 z-10 bg-black/20 backdrop-blur-sm text-white rounded-full px-3 py-1 text-sm">
                    {currentIndex + 1} / {safeSlides?.length}
                </div>
                
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 z-10">
                    <Progress value={progress} className="h-1 rounded-none bg-white/20" indicatorClassName="bg-primary" />
                </div>
            </Swiper>
            
            {/* Show thumbnail navigation for multiple slides */}
            {safeSlides?.length > 1 && (
                <div className="container mx-auto px-4 mt-4">
                    <Swiper
                        modules={[Thumbs]}
                        watchSlidesProgress
                        slidesPerView={4}
                        spaceBetween={10}
                        className="thumbs-swiper h-20"
                        onSwiper={setThumbsSwiper}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                            },
                            640: {
                                slidesPerView: 3,
                            },
                            768: {
                                slidesPerView: 4,
                            },
                            1024: {
                                slidesPerView: 5,
                            },
                        }}
                    >
                        {safeSlides?.map((slide, index) => (
                            <SwiperSlide key={`thumb-${slide.id || index}`} className="cursor-pointer">
                                <div className={cn(
                                    "relative h-full rounded-lg overflow-hidden border-2",
                                    currentIndex === index ? "border-primary" : "border-transparent"
                                )}>
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/30"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white text-xs font-medium text-center px-2">
                                            {slide.title}
                                        </span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
            
            {/* Additional elements for enhanced functionality */}
            <div className="container mx-auto px-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Search component */}
                    {showSearch && (
                        <div className="md:col-span-3">
                            <HeroSearch />
                        </div>
                    )}
                    
                    {/* Quick links */}
                    {showQuickLinks && (
                        <div className="md:col-span-3 flex justify-center">
                            <QuickLinks />
                        </div>
                    )}
                    
                    {/* Stats section */}
                    {showStats && (
                        <div className="md:col-span-3 flex justify-center mt-4">
                            <Stats />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeroSlider; 