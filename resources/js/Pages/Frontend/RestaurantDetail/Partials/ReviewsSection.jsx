import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, Check, Image as ImageIcon, Filter, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import { Badge } from '@/Components/ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/Components/ui/collapsible';
import { ScrollArea } from '@/Components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

const ReviewsSection = ({ reviews }) => {
    const [sortOption, setSortOption] = useState('recent');
    const [filterRating, setFilterRating] = useState(0);
    const [expandedReviews, setExpandedReviews] = useState({});

    const toggleExpandReview = (reviewId) => {
        setExpandedReviews(prev => ({
            ...prev,
            [reviewId]: !prev[reviewId]
        }));
    };

    const summary = reviews?.summary || {
        average_rating: 0,
        total_reviews: 0,
        rating_breakdown: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
        },
        category_ratings: {
            food: 0,
            service: 0,
            ambience: 0,
            value: 0
        }
    };

    const filterReviews = (items) => {
        if (!items) return [];

        let filtered = [...items];

        // Filter by rating
        if (filterRating > 0) {
            filtered = filtered.filter(review => review.rating === filterRating);
        }

        // Sort reviews
        filtered.sort((a, b) => {
            switch (sortOption) {
                case 'recent':
                    return new Date(b.date) - new Date(a.date);
                case 'highest':
                    return b.rating - a.rating;
                case 'lowest':
                    return a.rating - b.rating;
                case 'likes':
                    return (b.likes || 0) - (a.likes || 0);
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });

        return filtered;
    };

    const filteredReviews = filterReviews(reviews?.reviews);
    const totalFiltered = filteredReviews.length;

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={cn(
                    "w-4 h-4",
                    i < rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                )}
            />
        ));
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Customer Reviews
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Read what our customers have to say about their dining experiences
                    </p>
                </div>
            </div>

            {/* Reviews Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 mb-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Side - Overall Rating */}
                    <div className="md:w-1/3 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 pb-6 md:pb-0 md:pr-8">
                        <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                            {summary.average_rating.toFixed(1)}
                        </div>
                        <div className="flex items-center mb-2">
                            {renderStars(Math.round(summary.average_rating))}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Based on {summary.total_reviews} reviews
                        </p>
                    </div>

                    {/* Middle - Rating Breakdown */}
                    <div className="md:w-1/3 space-y-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 pb-6 md:pb-0 md:pr-8">
                        {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "flex items-center h-6 px-2 py-0 text-xs",
                                        filterRating === rating ? "bg-primary/10 text-primary" : ""
                                    )}
                                    onClick={() => setFilterRating(filterRating === rating ? 0 : rating)}
                                >
                                    {rating} {rating === 1 ? 'star' : 'stars'}
                                </Button>
                                <Progress
                                    value={summary.rating_breakdown[rating] || 0}
                                    className="h-2 flex-1"
                                />
                                <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[32px] text-right">
                                    {summary.rating_breakdown[rating] || 0}%
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Right - Category Ratings */}
                    <div className="md:w-1/3 space-y-3">
                        {Object.entries(summary.category_ratings).map(([category, rating]) => (
                            <div key={category} className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                        {category}
                                    </span>
                                    <div className="flex items-center">
                                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {rating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                                <Progress
                                    value={(rating / 5) * 100}
                                    className="h-1"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filter and Sort */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                {/* Filter Button */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            "flex items-center gap-1",
                            filterRating > 0 ? "bg-primary/10 border-primary/20 text-primary" : ""
                        )}
                        onClick={() => setFilterRating(0)}
                    >
                        <Filter className="h-4 w-4 mr-1" />
                        <span>Filter</span>
                        {filterRating > 0 && (
                            <>
                                <Badge
                                    variant="secondary"
                                    className="ml-1 bg-primary text-white h-5 w-5 p-0 flex items-center justify-center rounded-full"
                                >
                                    1
                                </Badge>
                                <X
                                    className="h-3.5 w-3.5 ml-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFilterRating(0);
                                    }}
                                />
                            </>
                        )}
                    </Button>

                    {filterRating > 0 && (
                        <Badge
                            variant="outline"
                            className="bg-primary/10 border-primary/20 text-primary"
                        >
                            {filterRating} Stars
                            <X
                                className="h-3.5 w-3.5 ml-1 cursor-pointer"
                                onClick={() => setFilterRating(0)}
                            />
                        </Badge>
                    )}
                </div>

                {/* Sort Dropdown */}
                <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="highest">Highest Rating</SelectItem>
                        <SelectItem value="lowest">Lowest Rating</SelectItem>
                        <SelectItem value="likes">Most Helpful</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Reviews List */}
            {filteredReviews.length > 0 ? (
                <div className="space-y-6">
                    {filteredReviews.map((review) => {
                        const isExpanded = expandedReviews[review.id];

                        return (
                            <div
                                key={review.id}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700"
                            >
                                <div className="flex items-start gap-4">
                                    {/* User Avatar */}
                                    {review.user?.avatar && (
                                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                            <img
                                                src={review.user.avatar}
                                                alt={review.user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        {/* User Info and Rating */}
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                                            <div>
                                                <div className="flex items-center">
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {review.user?.name || 'Anonymous'}
                                                    </h4>
                                                    {review.user?.is_verified && (
                                                        <Badge
                                                            variant="outline"
                                                            className="ml-2 bg-green-500/10 text-green-600 border-green-200 dark:border-green-900"
                                                        >
                                                            <Check className="w-3 h-3 mr-1" />
                                                            Verified
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {review.user?.reviews_count
                                                        ? `${review.user.reviews_count} reviews`
                                                        : 'First review'}
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex mr-2">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(review.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Review Title */}
                                        {review.title && (
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                {review.title}
                                            </h3>
                                        )}

                                        {/* Review Text */}
                                        <p className={cn(
                                            "text-gray-600 dark:text-gray-300 mb-4",
                                            review.comment?.length > 150 && !isExpanded ? "line-clamp-3" : ""
                                        )}>
                                            {review.comment}
                                        </p>

                                        {/* Read More Button */}
                                        {review.comment?.length > 150 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mb-4 text-primary hover:text-primary/80 hover:bg-primary/10 h-8 px-3 py-1"
                                                onClick={() => toggleExpandReview(review.id)}
                                            >
                                                {isExpanded ? 'Show less' : 'Read more'}
                                            </Button>
                                        )}

                                        {/* Review Images */}
                                        {review.images && review.images.length > 0 && (
                                            <div className="flex space-x-2 mb-4">
                                                <ScrollArea className="whitespace-nowrap">
                                                    <div className="flex space-x-2 pb-2">
                                                        {review.images.map((image, index) => (
                                                            <div
                                                                key={index}
                                                                className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0"
                                                            >
                                                                <img
                                                                    src={image}
                                                                    alt={`Review image ${index + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                            </div>
                                        )}

                                        {/* Visit Type and Rating Details */}
                                        <Collapsible className="mt-2">
                                            <div className="flex items-center justify-between">
                                                {review.visit_type && (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900"
                                                    >
                                                        {review.visit_type}
                                                    </Badge>
                                                )}

                                                <div className="flex items-center space-x-3">
                                                    {/* Like Button */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-500 hover:text-primary"
                                                    >
                                                        <ThumbsUp className="w-4 h-4 mr-1" />
                                                        Helpful {review.likes ? `(${review.likes})` : ''}
                                                    </Button>

                                                    {/* Detailed Ratings Toggle */}
                                                    {review.category_ratings && (
                                                        <CollapsibleTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-gray-500 hover:text-primary"
                                                            >
                                                                Details
                                                                <ChevronDown className="w-4 h-4 ml-1" />
                                                            </Button>
                                                        </CollapsibleTrigger>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Detailed Category Ratings */}
                                            {review.category_ratings && (
                                                <CollapsibleContent className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {Object.entries(review.category_ratings).map(([category, rating]) => (
                                                            <div key={category}>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-1">
                                                                    {category}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    {renderStars(rating)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CollapsibleContent>
                                            )}
                                        </Collapsible>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Star className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        No reviews found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                        {filterRating > 0
                            ? `There are no ${filterRating}-star reviews yet. Try adjusting your filters.`
                            : 'Be the first to leave a review!'}
                    </p>
                    {filterRating > 0 && (
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setFilterRating(0)}
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            )}

            {/* Review Count */}
            {filteredReviews.length > 0 && (
                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Showing {totalFiltered} of {summary.total_reviews} reviews
                    {filterRating > 0 && ` (filtered by ${filterRating} stars)`}
                </div>
            )}
        </div>
    );
};

export default ReviewsSection; 