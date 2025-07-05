import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    ChevronLeft, 
    ChevronRight,
    Quote,
    Calendar,
    ThumbsUp,
    Filter,
    ArrowUpDown,
    Search,
    Verified,
    ShoppingBag,
    Clock,
    Award,
    MapPin,
    MessageSquare,
    AlertCircle,
    Loader2,
    RefreshCw,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { format } from 'date-fns';
import { Badge } from "@/Components/ui/badge";

// Enhanced No Testimonials Component
const NoTestimonials = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center justify-center p-8 text-center"
    >
        <div className="relative mb-6">
            <motion.div
                animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center"
            >
                <MessageSquare className="w-12 h-12 text-primary" />
            </motion.div>
            <motion.div
                animate={{ 
                    scale: [1, 0.9, 1],
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                    duration: 2,
                    repeat: Infinity
                }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center"
            >
                <Star className="w-4 h-4 text-yellow-400" />
            </motion.div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            No Testimonials Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
            We haven't found any testimonials matching your criteria. Try adjusting your filters or check back later for new reviews.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <AlertCircle className="w-4 h-4" />
            <span>Try broadening your search or removing some filters</span>
        </div>
    </motion.div>
);

const CustomerTestimonials = ({ testimonials: initialTestimonials }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [testimonials, setTestimonials] = useState(initialTestimonials);
    const [sortBy, setSortBy] = useState('recent');
    const [filterRating, setFilterRating] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [displayCount, setDisplayCount] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loadMoreRef = useRef(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Calculate statistics
    const stats = {
        totalReviews: initialTestimonials.length,
        averageRating: (initialTestimonials.reduce((acc, t) => acc + t.rating, 0) / initialTestimonials.length).toFixed(1),
        verifiedPurchases: initialTestimonials.filter(t => t.verified_purchase).length,
        totalHelpful: initialTestimonials.reduce((acc, t) => acc + t.helpful_count, 0)
    };

    // Enhanced animation variants
    const fadeInScale = {
        initial: { 
            opacity: 0,
            scale: 0.95,
            y: 20
        },
        animate: { 
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: -20,
            transition: {
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    // Statistics Section Component
    const StatisticsSection = () => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
            {[
                {
                    label: "Total Reviews",
                    value: stats.totalReviews,
                    icon: MessageSquare,
                    color: "text-blue-500"
                },
                {
                    label: "Average Rating",
                    value: stats.averageRating,
                    icon: Star,
                    color: "text-yellow-500"
                },
                {
                    label: "Verified Purchases",
                    value: stats.verifiedPurchases,
                    icon: Verified,
                    color: "text-green-500"
                },
                {
                    label: "Helpful Votes",
                    value: stats.totalHelpful,
                    icon: ThumbsUp,
                    color: "text-purple-500"
                }
            ].map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: index * 0.1 }
                    }}
                    className={cn(
                        "p-4 rounded-xl",
                        "bg-white dark:bg-gray-800",
                        "border border-gray-100 dark:border-gray-700",
                        "shadow-sm hover:shadow-md transition-shadow"
                    )}
                >
                    <div className="flex items-center space-x-2 mb-2">
                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                        <h4 className="font-medium text-gray-600 dark:text-gray-300">
                            {stat.label}
                        </h4>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                    </p>
                </motion.div>
            ))}
        </motion.div>
    );

    // Enhanced Filters Section
    const FiltersSection = () => (
        <motion.div 
            initial={false}
            animate={{ height: isFiltersVisible ? "auto" : 0 }}
            className="overflow-hidden mb-6"
        >
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                            Sort By
                        </label>
                        <Select value={sortBy} onValueChange={handleSort}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Most Recent</SelectItem>
                                <SelectItem value="rating">Highest Rating</SelectItem>
                                <SelectItem value="helpful">Most Helpful</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                            Filter Rating
                        </label>
                        <Select value={filterRating} onValueChange={handleFilter}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Ratings</SelectItem>
                                {[5, 4, 3, 2, 1].map(rating => (
                                    <SelectItem key={rating} value={rating.toString()}>
                                        {rating} Stars
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                            Search Reviews
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by keyword..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    // Handle sorting
    const handleSort = useCallback((value) => {
        setSortBy(value);
        let sorted = [...testimonials];
        
        switch (value) {
            case 'recent':
                sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'helpful':
                sorted.sort((a, b) => b.helpful_count - a.helpful_count);
                break;
        }
        
        setTestimonials(sorted);
    }, [testimonials]);

    // Handle filtering
    const handleFilter = useCallback((value) => {
        setFilterRating(value);
        if (value === 'all') {
            setTestimonials(initialTestimonials);
        } else {
            const filtered = initialTestimonials.filter(
                t => t.rating === parseInt(value)
            );
            setTestimonials(filtered);
        }
    }, [initialTestimonials]);

    // Handle search
    const handleSearch = useCallback((value) => {
        setSearchQuery(value);
        if (!value.trim()) {
            setTestimonials(initialTestimonials);
            return;
        }
        
        const filtered = initialTestimonials.filter(t => 
            t.text.toLowerCase().includes(value.toLowerCase()) ||
            t.name.toLowerCase().includes(value.toLowerCase())
        );
        setTestimonials(filtered);
    }, [initialTestimonials]);

    // Render star rating
    const StarRating = ({ rating }) => (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={cn(
                        "w-4 h-4",
                        star <= rating 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-300 dark:text-gray-600"
                    )}
                />
            ))}
        </div>
    );

    // Enhanced TestimonialCard Component
    const TestimonialCard = ({ testimonial }) => {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <motion.div
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={{ y: -5 }}
                className={cn(
                    "relative p-6 md:p-8",
                    "bg-white dark:bg-gray-800",
                    "rounded-2xl",
                    "border border-gray-100 dark:border-gray-700",
                    "shadow-sm hover:shadow-xl",
                    "transition-all duration-300",
                    "group overflow-hidden"
                )}
            >
                {/* Background Pattern */}
                <motion.div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    initial={false}
                    animate={{
                        scale: isHovered ? 1.1 : 1,
                        opacity: isHovered ? 0.1 : 0.05
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                    <div className="absolute inset-0" 
                        style={{
                            backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                            backgroundSize: "24px 24px"
                        }}
                    />
                </motion.div>

                {/* Quote Icon */}
                <motion.div
                    initial={false}
                    animate={{
                        scale: isHovered ? 1.1 : 1,
                        rotate: isHovered ? 10 : 0
                    }}
                    className="absolute top-4 right-4"
                >
                    <Quote className="w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                </motion.div>
                
                {/* Profile Section */}
                <div className="relative flex items-center space-x-4 mb-6">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative"
                    >
                        <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/20">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {testimonial.verified_purchase && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 
                                        rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800"
                            >
                                <Verified className="w-3 h-3 text-white" />
                            </motion.div>
                        )}
                    </motion.div>
                    <div>
                        <motion.h4 
                            className="font-semibold text-gray-900 dark:text-white"
                            whileHover={{ x: 3 }}
                        >
                            {testimonial.name}
                        </motion.h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.role}
                        </p>
                    </div>
                </div>

                {/* Order Info */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        {testimonial.order_type}
                    </Badge>
                    <Badge variant="outline" className="text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3 h-3 mr-1" />
                        {testimonial.restaurant}
                    </Badge>
                    <Badge variant="outline" className="text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(testimonial.date), 'MMM dd, yyyy')}
                    </Badge>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between mb-4">
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <StarRating rating={testimonial.rating} />
                    </motion.div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "flex items-center space-x-1 px-3 py-1 rounded-full",
                            "text-gray-500 hover:text-primary",
                            "transition-colors duration-200"
                        )}
                    >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{testimonial.helpful_count}</span>
                    </motion.button>
                </div>

                {/* Testimonial Text */}
                <div className="relative mb-4">
                    <motion.div
                        initial={false}
                        animate={{
                            opacity: isHovered ? 1 : 0.5,
                            scale: isHovered ? 1.2 : 1
                        }}
                        className="absolute -left-2 -top-2 text-6xl text-primary/5 pointer-events-none"
                    >
                        "
                    </motion.div>
                    <p className="relative text-gray-600 dark:text-gray-300 leading-relaxed">
                        {testimonial.text}
                    </p>
                </div>

                {/* Tags */}
                {testimonial.tags && testimonial.tags.length > 0 && (
                    <motion.div 
                        className="flex flex-wrap gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {testimonial.tags.map((tag, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Badge
                                    variant="secondary"
                                    className="bg-gray-100 dark:bg-gray-700 
                                             text-gray-600 dark:text-gray-300
                                             hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    #{tag}
                                </Badge>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        );
    };

    // Controls for carousel
    const Controls = () => (
        <div className="flex items-center justify-center space-x-2 mt-6">
            <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setCurrentIndex(prev => 
                    prev === 0 ? testimonials.length - 1 : prev - 1
                )}
            >
                <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            currentIndex === index
                                ? "bg-primary w-6"
                                : "bg-gray-300 dark:bg-gray-600"
                        )}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
            <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setCurrentIndex(prev => 
                    prev === testimonials.length - 1 ? 0 : prev + 1
                )}
            >
                <ChevronRight className="w-5 h-5" />
            </Button>
        </div>
    );

    // Calculate if there are more items to load
    useEffect(() => {
        setHasMore(displayCount < testimonials.length);
    }, [displayCount, testimonials]);

    // Handle load more with animation
    const handleLoadMore = useCallback(async () => {
        setIsLoading(true);
        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
        setDisplayCount(prev => Math.min(prev + 6, testimonials.length));
        setIsLoading(false);
    }, [testimonials.length]);

    // Enhanced LoadMore Component
    const LoadMore = () => {
        if (!hasMore && displayCount > 6) return null;

        return (
            <div className="mt-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {hasMore ? (
                        <div className="space-y-4">
                            <Button
                                ref={loadMoreRef}
                                onClick={handleLoadMore}
                                disabled={isLoading}
                                variant="outline"
                                size="lg"
                                className={cn(
                                    "relative group px-8",
                                    "hover:bg-primary hover:text-white",
                                    "transition-all duration-300"
                                )}
                            >
                                <motion.div
                                    animate={isLoading ? { rotate: 360 } : {}}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-3 top-1/2 -translate-y-1/2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5" />
                                    ) : (
                                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                    )}
                                </motion.div>
                                <span className="ml-6">
                                    {isLoading ? 'Loading more reviews...' : 'Load More Reviews'}
                                </span>
                                <ChevronDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform duration-300" />
                            </Button>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {displayCount} of {testimonials.length} reviews
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <Award className="w-8 h-8 text-primary" />
                            </div>
                            <div className="text-center">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    You've Seen It All!
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    You've viewed all {testimonials.length} reviews
                                </p>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        );
    };

    return (
        <section className="py-12 px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Customer Reviews
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            See what our customers are saying about their experiences
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                            className="w-full md:w-auto"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            {isFiltersVisible ? "Hide Filters" : "Show Filters"}
                        </Button>
                    </div>
                </div>

                {/* Statistics */}
                <StatisticsSection />

                {/* Filters */}
                <FiltersSection />
            </div>

            {/* Testimonials Grid with Pagination */}
            <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {testimonials.length > 0 ? (
                        <>
                            <motion.div
                                key="testimonials-grid"
                                variants={fadeInScale}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {testimonials.slice(0, displayCount).map((testimonial, index) => (
                                    <motion.div
                                        key={testimonial.id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ 
                                            opacity: 1,
                                            y: 0,
                                            transition: { delay: index * 0.1 }
                                        }}
                                    >
                                        <TestimonialCard testimonial={testimonial} />
                                    </motion.div>
                                ))}
                            </motion.div>
                            <LoadMore />
                        </>
                    ) : (
                        <motion.div
                            key="no-testimonials"
                            variants={fadeInScale}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <NoTestimonials />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default CustomerTestimonials; 