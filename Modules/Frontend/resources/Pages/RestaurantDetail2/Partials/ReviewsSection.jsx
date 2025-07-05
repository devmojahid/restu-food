import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    MessageSquare,
    ThumbsUp,
    Filter,
    ChevronDown,
    ChevronUp,
    Search,
    AlertCircle,
    ArrowUpRight,
    Verified,
    Calendar,
    RefreshCw,
    X,
    Send,
    Menu,
    MoreHorizontal,
    Flag,
    Share2
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/Components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Badge } from '@/Components/ui/badge';
import { Progress } from "@/Components/ui/progress";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from "@/Components/ui/use-toast";

// Star rating component
const StarRating = ({ rating }) => (
    <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                className={cn(
                    "w-4 h-4 mr-0.5",
                    star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                )}
            />
        ))}
    </div>
);

// Form for submitting a new review
const ReviewForm = ({ onSubmit, setShowForm }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [name, setName] = useState('');
    const [tempRating, setTempRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast({
                title: "Rating required",
                description: "Please select a rating before submitting",
                variant: "destructive",
            });
            return;
        }

        if (!review.trim()) {
            toast({
                title: "Review required",
                description: "Please write a review before submitting",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            onSubmit({
                rating,
                text: review,
                name: name || 'Anonymous',
                date: new Date().toISOString(),
            });

            setIsSubmitting(false);
            setRating(0);
            setReview('');
            setName('');
            setShowForm(false);

            toast({
                title: "Review submitted",
                description: "Thank you for sharing your feedback!",
            });
        }, 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-8"
        >
            <h3 className="text-xl font-semibold mb-4">Share Your Experience</h3>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Your Rating</label>
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setTempRating(star)}
                                onMouseLeave={() => setTempRating(0)}
                                onClick={() => setRating(star)}
                                className="focus:outline-none mr-1"
                            >
                                <Star
                                    className={cn(
                                        "w-8 h-8 transition-colors",
                                        (tempRating ? star <= tempRating : star <= rating)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300 dark:text-gray-600"
                                    )}
                                />
                            </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                            {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
                        </span>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Your Name (Optional)</label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Your Review</label>
                    <Textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Tell us about your experience..."
                        className="w-full h-32"
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Submit Review
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};

const ReviewsSection = ({ reviews = null }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [sortBy, setSortBy] = useState('recent');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const { toast } = useToast();

    // If reviews is null or empty, display placeholder message
    if (!reviews || !reviews.items || reviews.items.length === 0) {
        return (
            <section id="reviews" className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Reviews</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                        <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                            Be the first to share your experience with this restaurant.
                        </p>
                        <Button
                            onClick={() => setShowReviewForm(true)}
                            className="rounded-full"
                        >
                            <Star className="w-4 h-4 mr-2" />
                            Write a Review
                        </Button>
                    </div>

                    {showReviewForm && (
                        <div className="mt-8">
                            <ReviewForm
                                onSubmit={() => { }}
                                setShowForm={setShowReviewForm}
                            />
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // Calculate statistics
    const stats = {
        totalReviews: reviews.items.length,
        averageRating: reviews.averageRating || (reviews.items.reduce((acc, review) => acc + review.rating, 0) / reviews.items.length).toFixed(1),
        ratingCounts: [5, 4, 3, 2, 1].map(rating => ({
            rating,
            count: reviews.items.filter(review => review.rating === rating).length,
            percentage: (reviews.items.filter(review => review.rating === rating).length / reviews.items.length) * 100
        }))
    };

    // Filter and sort reviews
    const filteredReviews = React.useMemo(() => {
        let filtered = [...reviews.items];

        // Filter by rating
        if (activeTab !== 'all') {
            const ratingFilter = parseInt(activeTab);
            filtered = filtered.filter(review => review.rating === ratingFilter);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(review =>
                review.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                review.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort reviews
        switch (sortBy) {
            case 'recent':
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'highest':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                filtered.sort((a, b) => a.rating - b.rating);
                break;
            case 'helpful':
                filtered.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
                break;
            default:
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        return filtered;
    }, [activeTab, searchQuery, sortBy, reviews.items]);

    const handleAddReview = (newReview) => {
        // In a real application, this would make an API call
        toast({
            title: "Review submitted",
            description: "Thank you for your feedback!",
        });
    };

    const handleMarkHelpful = (reviewId) => {
        // In a real application, this would make an API call
        toast({
            description: "You marked this review as helpful",
        });
    };

    // Review card component
    const ReviewCard = ({ review }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const [isHelpful, setIsHelpful] = useState(false);

        const toggleExpand = () => {
            setIsExpanded(!isExpanded);
        };

        const markHelpful = () => {
            if (!isHelpful) {
                setIsHelpful(true);
                handleMarkHelpful(review.id);
            }
        };

        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "bg-white dark:bg-gray-800 rounded-xl p-5",
                    "border border-gray-100 dark:border-gray-700",
                    "shadow-sm hover:shadow-md transition-all"
                )}
            >
                {/* Header with user info and rating */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                        {review.avatar ? (
                            <img
                                src={review.avatar}
                                alt={review.name}
                                className="w-10 h-10 rounded-full mr-3 object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full mr-3 bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-semibold">
                                    {review.name.charAt(0)}
                                </span>
                            </div>
                        )}

                        <div>
                            <div className="flex items-center">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                    {review.name}
                                </h4>

                                {review.isVerified && (
                                    <Badge className="ml-2 bg-green-500/10 text-green-500">
                                        <Verified className="w-3 h-3 mr-1" />
                                        Verified
                                    </Badge>
                                )}
                            </div>

                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {review.date && format(new Date(review.date), 'MMM dd, yyyy')}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <StarRating rating={review.rating} />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem onClick={() => { }}>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    <span>Share Review</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { }}>
                                    <Flag className="w-4 h-4 mr-2" />
                                    <span>Report Review</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Review content */}
                <div className="mb-3">
                    <p className={cn(
                        "text-gray-700 dark:text-gray-300",
                        !isExpanded && review.text.length > 200 ? "line-clamp-3" : ""
                    )}>
                        {review.text}
                    </p>

                    {review.text.length > 200 && (
                        <button
                            onClick={toggleExpand}
                            className="text-primary hover:text-primary/90 text-sm font-medium mt-2"
                        >
                            {isExpanded ? "Show less" : "Read more"}
                        </button>
                    )}
                </div>

                {/* Photos if available */}
                {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                        {review.photos.map((photo, index) => (
                            <img
                                key={index}
                                src={photo}
                                alt={`Review photo ${index + 1}`}
                                className="w-20 h-20 rounded-lg object-cover"
                            />
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between text-sm">
                    <Button
                        variant={isHelpful ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                            "rounded-full h-8",
                            isHelpful && "bg-primary/10 text-primary hover:bg-primary/20"
                        )}
                        onClick={markHelpful}
                        disabled={isHelpful}
                    >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span>
                            {isHelpful ? "Helpful" : "Mark as helpful"}
                        </span>
                        {(review.helpfulCount > 0 || isHelpful) && (
                            <Badge className="ml-2 bg-white/10">
                                {(review.helpfulCount || 0) + (isHelpful ? 1 : 0)}
                            </Badge>
                        )}
                    </Button>

                    {review.responseFrom && (
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                            Response from owner
                        </span>
                    )}
                </div>

                {/* Owner response if available */}
                {review.responseFrom && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                    >
                        <div className="flex items-start mb-2">
                            <div className="font-medium text-sm">
                                Response from {review.responseFrom}
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {review.responseText}
                        </p>
                    </motion.div>
                )}
            </motion.div>
        );
    };

    return (
        <section id="reviews" className="py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-primary" />
                            Customer Reviews
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            {reviews.description || "See what our customers are saying about their experiences"}
                        </p>
                    </div>

                    <div className="mt-4 md:mt-0">
                        <Button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="rounded-full"
                        >
                            <Star className="w-4 h-4 mr-2" />
                            Write a Review
                        </Button>
                    </div>
                </div>

                {/* Review Form */}
                <AnimatePresence>
                    {showReviewForm && (
                        <ReviewForm
                            onSubmit={handleAddReview}
                            setShowForm={setShowReviewForm}
                        />
                    )}
                </AnimatePresence>

                {/* Rating Statistics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Average Rating */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Average Rating</h3>
                        <div className="flex items-center mb-4">
                            <div className="text-4xl font-bold text-gray-900 dark:text-white mr-3">
                                {stats.averageRating}
                            </div>
                            <div>
                                <StarRating rating={Math.round(stats.averageRating)} />
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Based on {stats.totalReviews} reviews
                                </div>
                            </div>
                        </div>

                        {reviews.externalReviews && (
                            <div className="border-t dark:border-gray-700 pt-4 mt-4">
                                <h4 className="text-sm font-medium mb-2">Also rated on:</h4>
                                <div className="flex flex-wrap gap-3">
                                    {reviews.externalReviews.map((external, index) => (
                                        <a
                                            key={index}
                                            href={external.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-sm text-primary hover:text-primary/90"
                                        >
                                            <span>{external.platform}</span>
                                            <div className="flex items-center">
                                                <Star className="w-3 h-3 fill-current" />
                                                <span>{external.rating}</span>
                                            </div>
                                            <ArrowUpRight className="w-3 h-3" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Rating Breakdown */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Rating Breakdown</h3>
                        <div className="space-y-3">
                            {stats.ratingCounts.map((item) => (
                                <div key={item.rating} className="flex items-center">
                                    <div className="w-12 text-sm text-gray-700 dark:text-gray-300">
                                        {item.rating} star
                                    </div>
                                    <div className="flex-1 mx-3">
                                        <Progress value={item.percentage} className="h-2" />
                                    </div>
                                    <div className="w-12 text-sm text-right text-gray-700 dark:text-gray-300">
                                        {item.count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review Insights */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Review Insights</h3>
                        {reviews.insights ? (
                            <div className="space-y-4">
                                {reviews.insights.map((insight, index) => (
                                    <div key={index}>
                                        <h4 className="text-sm font-medium mb-1">{insight.category}</h4>
                                        <Progress value={insight.score * 100} className="h-2 mb-1" />
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Poor</span>
                                            <span>Excellent</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400 text-sm">
                                Insights are generated after a minimum number of reviews.
                            </div>
                        )}
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Search in reviews..."
                                className="pl-10 rounded-full border-gray-200 dark:border-gray-700"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                    onClick={() => setSearchQuery('')}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="rounded-full"
                                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                                {isFiltersOpen ? (
                                    <ChevronUp className="w-4 h-4 ml-2" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 ml-2" />
                                )}
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="rounded-full">
                                        <Menu className="w-4 h-4 mr-2" />
                                        Sort: {sortBy === 'recent' ? 'Most Recent' :
                                            sortBy === 'highest' ? 'Highest Rated' :
                                                sortBy === 'lowest' ? 'Lowest Rated' :
                                                    'Most Helpful'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setSortBy('recent')}>
                                        Most Recent
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy('highest')}>
                                        Highest Rated
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy('lowest')}>
                                        Lowest Rated
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy('helpful')}>
                                        Most Helpful
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    <AnimatePresence>
                        {isFiltersOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Rating Filter (Mobile) */}
                                    <div className="md:hidden">
                                        <h4 className="text-sm font-medium mb-2">Filter by Rating</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Button
                                                variant={activeTab === 'all' ? 'default' : 'outline'}
                                                size="sm"
                                                className="rounded-full"
                                                onClick={() => setActiveTab('all')}
                                            >
                                                All
                                            </Button>
                                            {[5, 4, 3, 2, 1].map(rating => (
                                                <Button
                                                    key={rating}
                                                    variant={activeTab === rating.toString() ? 'default' : 'outline'}
                                                    size="sm"
                                                    className="rounded-full"
                                                    onClick={() => setActiveTab(rating.toString())}
                                                >
                                                    {rating} <Star className="w-3 h-3 ml-1 fill-current" />
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Other filters could go here */}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Reviews Tabs (Desktop) */}
                <div className="hidden md:block mb-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
                            <TabsTrigger
                                value="all"
                                className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                            >
                                All Reviews
                            </TabsTrigger>

                            {[5, 4, 3, 2, 1].map(rating => (
                                <TabsTrigger
                                    key={rating}
                                    value={rating.toString()}
                                    className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                                >
                                    {rating} <Star className="w-3 h-3 ml-1 fill-current" />
                                    <span className="ml-1">
                                        ({stats.ratingCounts.find(r => r.rating === rating)?.count || 0})
                                    </span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    <AnimatePresence>
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map(review => (
                                <ReviewCard key={review.id} review={review} />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm"
                            >
                                <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No Reviews Found</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                                    {searchQuery ?
                                        "No reviews match your search criteria. Try adjusting your filters." :
                                        "There are no reviews matching your selected filters."}
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setActiveTab('all');
                                        setSearchQuery('');
                                    }}
                                    className="rounded-full"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Reset Filters
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Pagination or Load More */}
                {filteredReviews.length > 0 && reviews.totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <Button
                            variant="outline"
                            className="rounded-full"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Load More Reviews
                        </Button>
                    </div>
                )}

                {/* Policy Note */}
                {reviews.reviewPolicy && (
                    <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        {reviews.reviewPolicy}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ReviewsSection; 