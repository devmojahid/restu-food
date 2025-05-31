import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    ThumbsUp, 
    Filter, 
    ChevronDown, 
    Search, 
    X, 
    ArrowUpDown,
    MessageCircle, 
    Loader2, 
    User,
    Plus,
    Camera,
    Check,
    Calendar
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Progress } from '@/Components/ui/progress';
import { Badge } from '@/Components/ui/badge';
import { Textarea } from '@/Components/ui/textarea';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Separator } from '@/Components/ui/separator';
import { useToast } from '@/Components/ui/use-toast';
import { format, formatDistanceToNow } from 'date-fns';

const ReviewsSection = ({ reviews = [], productId }) => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [searchQuery, setSearchQuery] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const { toast } = useToast();
    
    // Calculate review statistics
    const stats = {
        total: reviews.length,
        averageRating: reviews.length 
            ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1) 
            : 0,
        distribution: Array.from({ length: 5 }, (_, i) => {
            const count = reviews.filter(r => r.rating === 5 - i).length;
            return {
                rating: 5 - i,
                count,
                percentage: reviews.length ? Math.round((count / reviews.length) * 100) : 0
            };
        })
    };
    
    // Filter reviews based on activeFilter and searchQuery
    const filteredReviews = reviews.filter(review => {
        // Filter by rating
        if (activeFilter !== 'all' && review.rating !== parseInt(activeFilter)) {
            return false;
        }
        
        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                review.text.toLowerCase().includes(query) ||
                review.user_name.toLowerCase().includes(query) ||
                (review.title && review.title.toLowerCase().includes(query))
            );
        }
        
        return true;
    });
    
    // Sort reviews
    const sortedReviews = [...filteredReviews].sort((a, b) => {
        switch (sortBy) {
            case 'recent':
                return new Date(b.date) - new Date(a.date);
            case 'oldest':
                return new Date(a.date) - new Date(b.date);
            case 'highest':
                return b.rating - a.rating;
            case 'lowest':
                return a.rating - b.rating;
            case 'helpful':
                return (b.helpful_count || 0) - (a.helpful_count || 0);
            default:
                return new Date(b.date) - new Date(a.date);
        }
    });
    
    // Limited reviews to display initially
    const displayedReviews = showAllReviews 
        ? sortedReviews 
        : sortedReviews.slice(0, 3);
    
    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setShowAllReviews(false);
    };
    
    const handleSortChange = (sort) => {
        setSortBy(sort);
    };
    
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setShowAllReviews(false);
    };
    
    const handleClearSearch = () => {
        setSearchQuery('');
    };
    
    const handleHelpfulClick = (reviewId) => {
        // This would normally update a database
        toast({
            title: "Thanks for your feedback!",
            description: "You've marked this review as helpful.",
        });
    };
    
    const handleSubmitReview = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Close the form and show success message
            setShowReviewForm(false);
            toast({
                title: "Review Submitted",
                description: "Thank you for your feedback! Your review will be published soon.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "There was a problem submitting your review. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Star rating input component
    const StarRatingInput = ({ rating, onChange }) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className="p-1 focus:outline-none focus:ring-0"
                    >
                        <Star
                            className={cn(
                                "w-8 h-8",
                                star <= rating 
                                    ? "text-yellow-400 fill-yellow-400" 
                                    : "text-gray-300 dark:text-gray-600"
                            )}
                        />
                    </button>
                ))}
            </div>
        );
    };
    
    // Render star rating display
    const StarRating = ({ rating }) => (
        <div className="flex">
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
    
    // Review card component
    const ReviewCard = ({ review }) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                            {review.user_image ? (
                                <img 
                                    src={review.user_image} 
                                    alt={review.user_name} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                                {review.user_name}
                            </h4>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Calendar className="w-3 h-3 mr-1" />
                                <time dateTime={review.date}>
                                    {format(new Date(review.date), 'MMM d, yyyy')}
                                </time>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <StarRating rating={review.rating} />
                        {review.verified_purchase && (
                            <Badge variant="outline" className="mt-1">
                                <Check className="w-3 h-3 mr-1" />
                                Verified Purchase
                            </Badge>
                        )}
                    </div>
                </div>
                
                {/* Review Title */}
                {review.title && (
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        {review.title}
                    </h3>
                )}
                
                {/* Review Text */}
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {review.text}
                </p>
                
                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                    <div className="mb-4">
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {review.images.map((image, index) => (
                                <div 
                                    key={index}
                                    className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden"
                                >
                                    <img 
                                        src={image} 
                                        alt={`Review image ${index + 1}`} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Review Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Was this review helpful?
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleHelpfulClick(review.id)}
                        className="text-sm"
                    >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Helpful ({review.helpful_count || 0})
                    </Button>
                </div>
            </motion.div>
        );
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                {/* Rating Summary */}
                <div className="w-full md:w-1/3">
                    <div className="text-center md:text-left mb-6">
                        <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>
                        <div className="flex items-center justify-center md:justify-start">
                            <StarRating rating={Math.round(stats.averageRating)} />
                            <span className="ml-2 text-2xl font-bold">{stats.averageRating}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Based on {stats.total} reviews
                        </p>
                    </div>
                    
                    {/* Rating Distribution */}
                    <div className="space-y-2">
                        {stats.distribution.map((item) => (
                            <div key={item.rating} className="flex items-center">
                                <button
                                    onClick={() => handleFilterChange(item.rating.toString())}
                                    className={cn(
                                        "flex items-center mr-3 text-sm hover:text-primary transition-colors",
                                        activeFilter === item.rating.toString() ? "text-primary font-medium" : "text-gray-600 dark:text-gray-400"
                                    )}
                                >
                                    {item.rating} <Star className="w-3 h-3 ml-1" />
                                </button>
                                <Progress 
                                    value={item.percentage} 
                                    className="h-2 flex-1" 
                                />
                                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400 w-10 text-right">
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    {/* Write Review Button */}
                    <div className="mt-6">
                        <Button 
                            className="w-full" 
                            onClick={() => setShowReviewForm(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Write a Review
                        </Button>
                    </div>
                </div>
                
                {/* Reviews List */}
                <div className="w-full md:w-2/3">
                    {/* Filter Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search reviews..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="pl-10"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full rounded-none"
                                    onClick={handleClearSearch}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        
                        <div className="flex gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Filter className="w-4 h-4 mr-2" />
                                        {activeFilter === 'all' ? 'All Ratings' : `${activeFilter} Stars`}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem 
                                        onClick={() => handleFilterChange('all')}
                                        className={activeFilter === 'all' ? "bg-primary/10 text-primary" : ""}
                                    >
                                        All Ratings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => handleFilterChange('5')}
                                        className={activeFilter === '5' ? "bg-primary/10 text-primary" : ""}
                                    >
                                        5 Stars
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => handleFilterChange('4')}
                                        className={activeFilter === '4' ? "bg-primary/10 text-primary" : ""}
                                    >
                                        4 Stars
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => handleFilterChange('3')}
                                        className={activeFilter === '3' ? "bg-primary/10 text-primary" : ""}
                                    >
                                        3 Stars
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => handleFilterChange('2')}
                                        className={activeFilter === '2' ? "bg-primary/10 text-primary" : ""}
                                    >
                                        2 Stars
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => handleFilterChange('1')}
                                        className={activeFilter === '1' ? "bg-primary/10 text-primary" : ""}
                                    >
                                        1 Star
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <ArrowUpDown className="w-4 h-4 mr-2" />
                                        Sort
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem 
                                        onClick={() => handleSortChange('recent')}
                                        className={sortBy === 'recent' ? "bg-primary/10 text-primary" : ""}
                                    >
                                        Most Recent
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => handleSortChange('oldest')}
                                        className={sortBy === 'oldest' ? "bg-primary/10 text-primary" : ""}
                                    >
                                        Oldest First
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => handleSortChange('highest')}
                                        className={sortBy === 'highest' ? "bg-primary/10 text-primary" : ""}
                                    >
                                        Highest Rated
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => handleSortChange('lowest')}
                                        className={sortBy === 'lowest' ? "bg-primary/10 text-primary" : ""}
                                    >
                                        Lowest Rated
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => handleSortChange('helpful')}
                                        className={sortBy === 'helpful' ? "bg-primary/10 text-primary" : ""}
                                    >
                                        Most Helpful
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    
                    {/* Reviews Display */}
                    {displayedReviews.length === 0 ? (
                        <div className="text-center py-8">
                            <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                No Reviews Found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {searchQuery || activeFilter !== 'all'
                                    ? "No reviews match your current filters."
                                    : "Be the first to review this product!"
                                }
                            </p>
                            {(searchQuery || activeFilter !== 'all') && (
                                <Button 
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setActiveFilter('all');
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <AnimatePresence>
                                {displayedReviews.map((review) => (
                                    <ReviewCard key={review.id} review={review} />
                                ))}
                            </AnimatePresence>
                            
                            {/* Load More Button */}
                            {sortedReviews.length > 3 && !showAllReviews && (
                                <div className="text-center pt-4">
                                    <Button 
                                        variant="outline"
                                        onClick={() => setShowAllReviews(true)}
                                    >
                                        Load More Reviews
                                        <ChevronDown className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Review Form Dialog */}
            <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Write a Review</DialogTitle>
                        <DialogDescription>
                            Share your experience with this product.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitReview}>
                        <div className="space-y-4 py-4">
                            {/* Rating Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Overall Rating</label>
                                <StarRatingInput 
                                    rating={5}
                                    onChange={() => {}}
                                />
                            </div>
                            
                            {/* Review Title */}
                            <div className="space-y-2">
                                <label htmlFor="review-title" className="text-sm font-medium">
                                    Review Title
                                </label>
                                <Input 
                                    id="review-title"
                                    placeholder="Summarize your experience..."
                                    required
                                />
                            </div>
                            
                            {/* Review Text */}
                            <div className="space-y-2">
                                <label htmlFor="review-text" className="text-sm font-medium">
                                    Review
                                </label>
                                <Textarea 
                                    id="review-text"
                                    placeholder="Share your thoughts about this product..."
                                    rows={5}
                                    required
                                />
                            </div>
                            
                            {/* Photo Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Add Photos (optional)
                                </label>
                                <div className="flex items-center space-x-2">
                                    <Button 
                                        type="button"
                                        variant="outline"
                                        className="h-auto p-4 border-dashed"
                                    >
                                        <div className="flex flex-col items-center">
                                            <Camera className="w-6 h-6 mb-2 text-gray-500" />
                                            <span className="text-xs text-gray-500">
                                                Add Photos
                                            </span>
                                        </div>
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500">
                                    You can upload up to 5 images (JPG, PNG, max 5MB each)
                                </p>
                            </div>
                            
                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Review"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ReviewsSection; 