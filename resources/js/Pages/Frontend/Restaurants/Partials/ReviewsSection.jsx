import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, Image as ImageIcon, Filter, ChevronDown, MessageSquareOff } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import NoData from '@/Components/ui/no-data';

const ReviewsSection = ({ reviews = [] }) => {
    const [filter, setFilter] = useState('all');
    const [showImages, setShowImages] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [page, setPage] = useState(1);
    const perPage = 5;

    // Ensure reviews is an array and has valid items
    const reviewsList = Array.isArray(reviews) ? reviews : [];

    // Calculate review statistics safely
    const stats = {
        total: reviewsList.length,
        average: reviewsList.length > 0 
            ? (reviewsList.reduce((acc, review) => acc + (review?.rating || 0), 0) / reviewsList.length).toFixed(1)
            : '0.0',
        ratings: {
            5: reviewsList.filter(review => review?.rating === 5).length,
            4: reviewsList.filter(review => review?.rating === 4).length,
            3: reviewsList.filter(review => review?.rating === 3).length,
            2: reviewsList.filter(review => review?.rating === 2).length,
            1: reviewsList.filter(review => review?.rating === 1).length,
        }
    };

    // Filter reviews safely
    const filteredReviews = reviewsList.filter(review => {
        if (!review) return false;
        if (filter === 'all') return true;
        return review.rating === parseInt(filter);
    });

    // Paginate reviews
    const paginatedReviews = filteredReviews.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(filteredReviews.length / perPage);

    const filterOptions = [
        { value: 'all', label: 'All Reviews' },
        { value: 'positive', label: '4★ & above' },
        { value: 'critical', label: '3★ & below' },
        { value: 'with_photos', label: 'With Photos' },
    ];

    const ratingPercentages = Object.entries(stats.ratings)
        .map(([stars, count]) => ({
            stars: parseInt(stars),
            percentage: (count / stats.total) * 100
        }))
        .sort((a, b) => b.stars - a.stars);

    if (reviewsList.length === 0) {
        return (
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                        Reviews
                    </h2>
                    <NoData
                        icon={MessageSquareOff}
                        title="No Reviews Yet"
                        description="Be the first one to review this restaurant and help others make their choice!"
                    >
                        <Button 
                            variant="default"
                            onClick={() => {/* Add your review logic */}}
                        >
                            Write a Review
                        </Button>
                    </NoData>
                </div>
            </section>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
        >
            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Overall Rating */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {stats.average}
                        </div>
                        <div className="flex justify-center items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "w-5 h-5",
                                        i < Math.round(stats.average)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300 dark:text-gray-600"
                                    )}
                                />
                            ))}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Based on {stats.total} reviews
                        </div>
                    </div>
                    <div className="space-y-3">
                        {ratingPercentages.map(({ stars, percentage }) => (
                            <div key={stars} className="flex items-center gap-2">
                                <div className="w-12 text-sm text-gray-600 dark:text-gray-400">
                                    {stars} stars
                                </div>
                                <Progress value={percentage} className="h-2" />
                                <div className="w-12 text-sm text-gray-600 dark:text-gray-400 text-right">
                                    {percentage.toFixed(0)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rating Breakdown */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Rating Breakdown
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(stats.ratings).map(([aspect, rating]) => (
                            <div key={aspect} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                                        {aspect} stars
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {rating}
                                    </span>
                                </div>
                                <Progress value={rating * 20} className="h-1" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                    <Button
                        key={option.value}
                        variant={filter === option.value ? "default" : "outline"}
                        onClick={() => setFilter(option.value)}
                        className="flex items-center gap-2"
                    >
                        {option.label}
                    </Button>
                ))}
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {paginatedReviews.map((review) => (
                    <motion.div
                        key={review.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                    >
                        {/* Review Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={review.user.avatar}
                                    alt={review.user.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {review.user.name}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {review.created_at} • {review.user.reviews_count} reviews
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "w-4 h-4",
                                            i < review.rating
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300 dark:text-gray-600"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Review Content */}
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {review.comment}
                        </p>

                        {/* Review Images */}
                        {review.images.length > 0 && (
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                                {review.images.map((image, index) => (
                                    <Dialog key={index}>
                                        <DialogTrigger asChild>
                                            <button className="flex-none">
                                                <img
                                                    src={image}
                                                    alt={`Review photo ${index + 1}`}
                                                    className="w-20 h-20 object-cover rounded-lg hover:opacity-90 transition-opacity"
                                                />
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl">
                                            <img
                                                src={image}
                                                alt={`Review photo ${index + 1}`}
                                                className="w-full h-full object-contain"
                                            />
                                        </DialogContent>
                                    </Dialog>
                                ))}
                            </div>
                        )}

                        {/* Review Actions */}
                        <div className="flex items-center gap-4 text-sm">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ThumbsUp className="w-4 h-4" />
                                Helpful
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Share
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Load More Button */}
            {totalPages > 1 && (
                <div className="text-center">
                    <Button variant="outline" className="gap-2" onClick={() => setPage(page + 1)}>
                        Load More Reviews
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

export default ReviewsSection; 