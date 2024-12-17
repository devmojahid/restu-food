import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    ThumbsUp, 
    MessageCircle, 
    Filter,
    ChevronDown,
    User,
    Calendar,
    Flag,
    Camera,
    Smile,
    Send
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Progress } from '@/Components/ui/progress';
import { Textarea } from '@/Components/ui/textarea';
import { ScrollArea } from '@/Components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/Components/ui/use-toast';
import { useForm } from '@inertiajs/react';

const ReviewsSection = ({ reviews = [], itemId }) => {
    const [filter, setFilter] = useState('all');
    const [showReplyForm, setShowReplyForm] = useState(null);
    const { toast } = useToast();
    const [expandedReviews, setExpandedReviews] = useState(new Set());

    const { data, setData, post, processing, reset } = useForm({
        rating: 5,
        comment: '',
        images: [],
    });

    // Calculate review statistics
    const stats = {
        average: reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length || 0,
        total: reviews.length,
        breakdown: Array.from({ length: 5 }, (_, i) => ({
            stars: 5 - i,
            count: reviews.filter(r => r.rating === 5 - i).length,
            percentage: (reviews.filter(r => r.rating === 5 - i).length / reviews.length) * 100 || 0
        }))
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        post(route('menu.reviews.store', itemId), {
            onSuccess: () => {
                toast({
                    title: "Review Submitted",
                    description: "Thank you for your feedback!",
                });
                reset();
            },
        });
    };

    const handleHelpful = (reviewId) => {
        // Implement helpful functionality
        toast({
            title: "Marked as Helpful",
            description: "Thank you for your feedback!",
        });
    };

    const handleReply = (reviewId, reply) => {
        // Implement reply functionality
        setShowReplyForm(null);
        toast({
            title: "Reply Posted",
            description: "Your reply has been posted successfully.",
        });
    };

    const toggleExpanded = (reviewId) => {
        setExpandedReviews(prev => {
            const next = new Set(prev);
            if (next.has(reviewId)) {
                next.delete(reviewId);
            } else {
                next.add(reviewId);
            }
            return next;
        });
    };

    return (
        <section className="py-12 border-t dark:border-gray-800">
            <div className="container px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-12">
                    {/* Rating Overview */}
                    <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            Customer Reviews
                        </h2>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                {stats.average.toFixed(1)}
                            </div>
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
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
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Based on {stats.total} reviews
                                </p>
                            </div>
                        </div>
                        
                        {/* Rating Breakdown */}
                        <div className="space-y-3">
                            {stats.breakdown.map((stat) => (
                                <div key={stat.stars} className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 w-24">
                                        <span className="text-sm font-medium">
                                            {stat.stars}
                                        </span>
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    </div>
                                    <Progress value={stat.percentage} className="flex-1" />
                                    <div className="w-16 text-sm text-gray-500">
                                        {stat.count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Write Review Form */}
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            {/* Rating Selection */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setData('rating', i + 1)}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={cn(
                                                "w-6 h-6 transition-colors",
                                                i < data.rating
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-300 dark:text-gray-600"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Review Text */}
                            <Textarea
                                placeholder="Share your experience..."
                                value={data.comment}
                                onChange={e => setData('comment', e.target.value)}
                                rows={4}
                            />

                            {/* Image Upload */}
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById('review-images').click()}
                                >
                                    <Camera className="w-4 h-4 mr-2" />
                                    Add Photos
                                </Button>
                                <input
                                    id="review-images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => setData('images', Array.from(e.target.files))}
                                />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={processing}
                            >
                                Submit Review
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {/* Filter Controls */}
                    <div className="flex items-center justify-between">
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter reviews" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Reviews</SelectItem>
                                <SelectItem value="positive">Positive Only</SelectItem>
                                <SelectItem value="critical">Critical Reviews</SelectItem>
                                <SelectItem value="with_photos">With Photos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reviews */}
                    <ScrollArea className="h-[600px] pr-6">
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                                >
                                    {/* Review Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={review.user.avatar} />
                                                <AvatarFallback>
                                                    {review.user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-semibold">
                                                    {review.user.name}
                                                </h4>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={cn(
                                                        "w-4 h-4",
                                                        i < review.rating
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Review Content */}
                                    <div className="space-y-4">
                                        <p className={cn(
                                            "text-gray-700 dark:text-gray-300",
                                            !expandedReviews.has(review.id) && "line-clamp-3"
                                        )}>
                                            {review.comment}
                                        </p>
                                        
                                        {review.comment.length > 250 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleExpanded(review.id)}
                                            >
                                                {expandedReviews.has(review.id) ? 'Show less' : 'Read more'}
                                            </Button>
                                        )}

                                        {/* Review Images */}
                                        {review.images?.length > 0 && (
                                            <div className="flex gap-2 overflow-x-auto py-2">
                                                {review.images.map((image, i) => (
                                                    <img
                                                        key={i}
                                                        src={image}
                                                        alt={`Review image ${i + 1}`}
                                                        className="w-24 h-24 object-cover rounded-lg"
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Review Actions */}
                                        <div className="flex items-center gap-4 pt-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleHelpful(review.id)}
                                            >
                                                <ThumbsUp className="w-4 h-4 mr-2" />
                                                Helpful ({review.helpful_count})
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowReplyForm(review.id)}
                                            >
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                Reply
                                            </Button>
                                        </div>

                                        {/* Reply Form */}
                                        <AnimatePresence>
                                            {showReplyForm === review.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="pt-4"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Textarea
                                                            placeholder="Write your reply..."
                                                            className="flex-1"
                                                            rows={2}
                                                        />
                                                        <Button
                                                            onClick={() => handleReply(review.id)}
                                                            size="sm"
                                                        >
                                                            <Send className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection; 