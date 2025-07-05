import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    ThumbsUp,
    Flag, 
    Calendar,
    Quote,
    User,
    ChevronDown,
    MessageSquare,
    Verified,
    Filter,
    ArrowUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu';

const ChefTestimonials = ({ testimonials = [] }) => {
    const [sortBy, setSortBy] = useState('recent');
    const [filterRating, setFilterRating] = useState('all');
    const [expandedReviews, setExpandedReviews] = useState([]);
    
    if (!testimonials || testimonials.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                <div className="flex justify-center mb-4">
                    <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                    No reviews have been added for this chef yet.
                </p>
            </div>
        );
    }

    // Apply sorting
    const sortedTestimonials = [...testimonials].sort((a, b) => {
        if (sortBy === 'recent') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'rating') {
            return b.rating - a.rating;
        } else if (sortBy === 'helpful') {
            return b.helpful_count - a.helpful_count;
        }
        return 0;
    });
    
    // Apply filtering
    const filteredTestimonials = filterRating === 'all' 
        ? sortedTestimonials 
        : sortedTestimonials.filter(t => t.rating === parseInt(filterRating));
    
    // Calculate average rating
    const averageRating = testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length;
    
    // Rating counts
    const ratingCounts = testimonials.reduce((acc, t) => {
        acc[t.rating] = (acc[t.rating] || 0) + 1;
        return acc;
    }, {});
    
    // Toggle expanded state for a review
    const toggleExpanded = (id) => {
        setExpandedReviews(prev => 
            prev.includes(id) 
                ? prev.filter(reviewId => reviewId !== id) 
                : [...prev, id]
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Client Reviews</h2>
            
            {/* Rating Summary */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                {/* Average Rating */}
                <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-1">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="flex justify-center mb-1">
                        {Array(5).fill(0).map((_, i) => (
                            <Star 
                                key={i} 
                                className={cn(
                                    "w-5 h-5", 
                                    i < Math.floor(averageRating) 
                                        ? "text-yellow-400 fill-yellow-400" 
                                        : "text-gray-300"
                                )} 
                            />
                        ))}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Based on {testimonials.length} reviews
                    </div>
                </div>
                
                {/* Rating Breakdown */}
                <div className="flex-1">
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className="flex items-center gap-2">
                                <div className="flex items-center min-w-[60px]">
                                    <span className="font-medium">{rating}</span>
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 ml-1" />
                                </div>
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary rounded-full"
                                        style={{ 
                                            width: `${((ratingCounts[rating] || 0) / testimonials.length) * 100}%` 
                                        }}
                                    />
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 min-w-[40px]">
                                    {ratingCounts[rating] || 0}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Filters and Sorting */}
            <div className="flex flex-wrap justify-between gap-4 mb-6">
                {/* Filter by Rating */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Filter:</span>
                    <div className="flex flex-wrap gap-2">
                        <Button 
                            variant={filterRating === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterRating('all')}
                            className="rounded-full text-xs"
                        >
                            All
                        </Button>
                        {[5, 4, 3, 2, 1].map(rating => (
                            <Button 
                                key={rating}
                                variant={filterRating === rating.toString() ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterRating(rating.toString())}
                                className="rounded-full text-xs"
                            >
                                {rating} <Star className="w-3 h-3 ml-1" />
                            </Button>
                        ))}
                    </div>
                </div>
                
                {/* Sort Options */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="rounded-full"
                        >
                            <ArrowUpDown className="w-4 h-4 mr-2" />
                            <span>Sort By</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                            onClick={() => setSortBy('recent')}
                            className={cn(sortBy === 'recent' && "bg-primary/10 text-primary")}
                        >
                            Most Recent
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => setSortBy('rating')}
                            className={cn(sortBy === 'rating' && "bg-primary/10 text-primary")}
                        >
                            Highest Rated
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => setSortBy('helpful')}
                            className={cn(sortBy === 'helpful' && "bg-primary/10 text-primary")}
                        >
                            Most Helpful
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            
            {/* Reviews List */}
            <div className="space-y-6">
                {filteredTestimonials.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                        No reviews match your selected filters.
                    </div>
                ) : (
                    filteredTestimonials.map((testimonial, index) => (
                        <TestimonialItem 
                            key={testimonial.id || index} 
                            testimonial={testimonial} 
                            index={index}
                            isExpanded={expandedReviews.includes(testimonial.id)}
                            toggleExpanded={() => toggleExpanded(testimonial.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const TestimonialItem = ({ testimonial, index, isExpanded, toggleExpanded }) => {
    const [helpfulCount, setHelpfulCount] = useState(testimonial.helpful_count || 0);
    const [hasVoted, setHasVoted] = useState(false);
    
    const isLongText = testimonial.text && testimonial.text.length > 300;
    const displayText = isExpanded || !isLongText 
        ? testimonial.text 
        : `${testimonial.text.substring(0, 300)}...`;
    
    const handleHelpfulClick = () => {
        if (!hasVoted) {
            setHelpfulCount(prev => prev + 1);
            setHasVoted(true);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>
                            <User className="w-5 h-5 text-gray-400" />
                        </AvatarFallback>
                    </Avatar>
                    
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-medium">{testimonial.name}</h4>
                            {testimonial.verified && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    <Verified className="w-3 h-3 mr-1" />
                                    Verified
                                </Badge>
                            )}
                        </div>
                        
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {testimonial.date}
                        </div>
                    </div>
                </div>
                
                <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                        <Star 
                            key={i} 
                            className={cn(
                                "w-4 h-4", 
                                i < testimonial.rating 
                                    ? "text-yellow-400 fill-yellow-400" 
                                    : "text-gray-300"
                            )} 
                        />
                    ))}
                </div>
            </div>
            
            {/* Review Text */}
            <div className="relative mb-4 pl-6">
                <Quote className="absolute left-0 top-0 w-4 h-4 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-600 dark:text-gray-300">
                    {displayText}
                </p>
                
                {isLongText && (
                    <Button 
                        variant="link" 
                        className="p-0 h-auto text-primary mt-2"
                        onClick={toggleExpanded}
                    >
                        {isExpanded ? 'Show less' : 'Read more'}
                        <ChevronDown className={cn(
                            "w-4 h-4 ml-1 transition-transform",
                            isExpanded && "rotate-180"
                        )} />
                    </Button>
                )}
            </div>
            
            {/* Review details - event type, location, etc */}
            {testimonial.event_type && (
                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-gray-600 dark:text-gray-300">
                        {testimonial.event_type}
                    </Badge>
                    
                    {testimonial.location && (
                        <Badge variant="outline" className="text-gray-600 dark:text-gray-300">
                            {testimonial.location}
                        </Badge>
                    )}
                </div>
            )}
            
            {/* Actions */}
            <div className="flex items-center justify-between">
                <Button 
                    variant="ghost" 
                    size="sm"
                    className={cn(
                        "text-gray-500 dark:text-gray-400",
                        hasVoted && "text-primary"
                    )}
                    onClick={handleHelpfulClick}
                    disabled={hasVoted}
                >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Helpful ({helpfulCount})
                </Button>
                
                <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-500 dark:text-gray-400"
                >
                    <Flag className="w-4 h-4 mr-1" />
                    Report
                </Button>
            </div>
        </motion.div>
    );
};

export default ChefTestimonials; 