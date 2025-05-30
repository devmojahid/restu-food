import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    Play,
    Pause,
    MapPin,
    Clock,
    Utensils,
    ChevronDown,
    Award,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Globe,
    DollarSign,
    Share2,
    Bookmark,
    Heart,
    Phone,
    Mail
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';

const Hero = ({ hero = null, restaurant = null }) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const videoRef = useRef(null);

    // Ensure we have the necessary data, otherwise show a fallback
    if (!restaurant || !hero) {
        return (
            <div className="relative min-h-[500px] bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
                <div className="relative container mx-auto px-4 py-24 text-center text-white">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Restaurant Details</h1>
                    <p className="text-lg opacity-80">Loading restaurant information...</p>
                </div>
            </div>
        );
    }

    // Handle scroll to content
    const handleScrollToContent = () => {
        const highlightsSection = document.getElementById('highlights') || document.getElementById('menu');
        if (highlightsSection) {
            const yOffset = -80;
            const y = highlightsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // Handle video playback
    const toggleVideo = () => {
        if (videoRef.current) {
            if (isVideoPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsVideoPlaying(!isVideoPlaying);
        }
    };

    // Social media icons based on provided links
    const getSocialIcon = (platform) => {
        switch (platform) {
            case 'facebook': return <Facebook className="w-5 h-5" />;
            case 'twitter': return <Twitter className="w-5 h-5" />;
            case 'instagram': return <Instagram className="w-5 h-5" />;
            case 'youtube': return <Youtube className="w-5 h-5" />;
            default: return <Globe className="w-5 h-5" />;
        }
    };

    // Convert price range to dollar signs
    const renderPriceRange = (priceRange) => {
        if (!priceRange) return null;

        const dollarSigns = priceRange.length;
        return (
            <span className="flex items-center text-gray-200">
                {Array(dollarSigns).fill().map((_, i) => (
                    <DollarSign key={i} className="w-4 h-4 fill-current" />
                ))}
            </span>
        );
    };

    return (
        <div className="relative min-h-[600px] lg:min-h-[80vh] overflow-hidden">
            {/* Background Media (Image or Video) */}
            {hero.videoBackground?.enabled && hero.videoBackground?.url ? (
                <div className="absolute inset-0 bg-black">
                    <video
                        ref={videoRef}
                        src={hero.videoBackground.url}
                        poster={hero.videoBackground.thumbnailUrl || restaurant.coverImage}
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                        muted
                        loop
                        playsInline
                    />
                    {/* Video Controls */}
                    <button
                        onClick={toggleVideo}
                        className="absolute bottom-6 right-6 z-10 bg-black/50 p-3 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                    >
                        {isVideoPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                        ) : (
                            <Play className="w-5 h-5 text-white" />
                        )}
                    </button>
                </div>
            ) : (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${restaurant.coverImage || hero.backgroundImage})` }}
                />
            )}

            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/20 backdrop-blur-[2px]" />

            {/* Breadcrumbs */}
            <div className="absolute top-0 left-0 right-0 p-4 z-10">
                <div className="container mx-auto">
                    <nav className="flex items-center space-x-2 text-sm text-white/80">
                        {hero.breadcrumbs?.map((item, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <span>/</span>}
                                {item.link ? (
                                    <a href={item.link} className="hover:text-white transition-colors">
                                        {item.label}
                                    </a>
                                ) : (
                                    <span className="text-white">{item.label}</span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative container mx-auto px-4 py-20 lg:py-32 flex flex-col md:flex-row items-center md:items-end gap-8">
                {/* Restaurant Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-4 border-white shadow-xl bg-white">
                        <img
                            src={restaurant.logoUrl || restaurant.profileImage}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {restaurant.isVerified && (
                        <div className="absolute -bottom-3 -right-3 bg-primary text-white p-2 rounded-full border-2 border-white">
                            <Award className="w-5 h-5" />
                        </div>
                    )}
                </motion.div>

                {/* Restaurant Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex-1 text-white"
                >
                    {/* Title and Badges */}
                    <div className="mb-4 flex flex-wrap items-start gap-3">
                        <h1 className="text-3xl md:text-5xl font-bold mr-3">{restaurant.name}</h1>

                        {/* Price Range */}
                        {restaurant.priceRange && (
                            <div className="mt-2">
                                {renderPriceRange(restaurant.priceRange)}
                            </div>
                        )}

                        {/* Open/Closed Status */}
                        <Badge className={cn(
                            "mt-2",
                            restaurant.isOpen ? "bg-green-500" : "bg-red-500",
                            "text-white"
                        )}>
                            {restaurant.isOpen ? "Open Now" : "Closed"}
                        </Badge>
                    </div>

                    {/* Rating and Meta Info */}
                    <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                        {/* Rating */}
                        <div className="flex items-center">
                            <div className="flex items-center mr-2">
                                {Array(5).fill().map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "w-5 h-5 mr-0.5",
                                            i < Math.floor(restaurant.rating)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-400"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="font-medium">{restaurant.rating?.toFixed(1)}</span>
                            <span className="ml-1 text-gray-300">({restaurant.reviewsCount} reviews)</span>
                        </div>

                        {/* Cuisine Types */}
                        {restaurant.cuisineTypes?.length > 0 && (
                            <div className="flex items-center">
                                <Utensils className="w-5 h-5 mr-2 text-gray-300" />
                                <span>{restaurant.cuisineTypes.join(', ')}</span>
                            </div>
                        )}

                        {/* Distance */}
                        {restaurant.distance && (
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-gray-300" />
                                <span>{restaurant.distance} km away</span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-lg text-gray-200 mb-6 max-w-3xl">
                        {restaurant.description}
                    </p>

                    {/* Tags */}
                    {restaurant.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {restaurant.tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Social Links and Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Social Media Links */}
                        {restaurant.contactInfo?.socialMedia && (
                            <div className="flex items-center space-x-2">
                                {Object.entries(restaurant.contactInfo.socialMedia).map(([platform, url]) => (
                                    <TooltipProvider key={platform}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                                                >
                                                    {getSocialIcon(platform)}
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Visit {platform}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        )}

                        {/* Contact Buttons */}
                        <div className="flex items-center space-x-2">
                            {restaurant.contactInfo?.phone && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a
                                                href={`tel:${restaurant.contactInfo.phone}`}
                                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                                            >
                                                <Phone className="w-5 h-5" />
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Call restaurant</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}

                            {restaurant.contactInfo?.email && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a
                                                href={`mailto:${restaurant.contactInfo.email}`}
                                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                                            >
                                                <Mail className="w-5 h-5" />
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Email restaurant</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 ml-auto">
                            <Button variant="outline" className="text-white border-white hover:bg-white/20">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>

                            <Button variant="outline" className="text-white border-white hover:bg-white/20">
                                <Heart className="w-4 h-4 mr-2" />
                                Favorite
                            </Button>

                            {hero.callToAction?.primaryText && (
                                <Button className="bg-primary hover:bg-primary/90">
                                    {hero.callToAction.primaryText}
                                </Button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Badges */}
            {restaurant.badges?.length > 0 && (
                <div className="absolute left-4 top-4 md:left-12 md:top-12 flex flex-col gap-2 z-10">
                    {restaurant.badges.map((badge, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                        >
                            <Badge
                                className="bg-primary/80 backdrop-blur-sm text-white px-3 py-1.5 text-sm"
                            >
                                {badge}
                            </Badge>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Scroll Indicator */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                onClick={handleScrollToContent}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white flex flex-col 
                         items-center space-y-2 cursor-pointer group z-10"
            >
                <span className="text-sm font-medium">Explore</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
            </motion.button>
        </div>
    );
};

export default Hero; 