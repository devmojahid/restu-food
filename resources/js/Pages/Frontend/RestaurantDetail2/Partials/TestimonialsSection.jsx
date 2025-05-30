import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    Quote,
    ChevronLeft,
    ChevronRight,
    ThumbsUp,
    Calendar,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const StarRating = ({ rating }) => {
    return (
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
};

const TestimonialCard = ({ testimonial, isActive }) => {
    // Format date if it exists and is a valid date string
    let formattedDate = '';
    try {
        if (testimonial?.date) {
            formattedDate = format(parseISO(testimonial.date), 'MMM dd, yyyy');
        }
    } catch (error) {
        formattedDate = testimonial?.date || '';
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: isActive ? 1 : 0.7,
                scale: isActive ? 1 : 0.9,
                y: isActive ? 0 : 20
            }}
            transition={{ duration: 0.5 }}
            className={cn(
                "bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg",
                "border border-gray-100 dark:border-gray-700",
                "transition-all duration-300",
                "relative overflow-hidden",
                isActive ? "z-10" : "z-0"
            )}
        >
            {/* Background Pattern */}
            <div className="absolute -top-6 -right-6 text-8xl text-primary/5 pointer-events-none">
                <Quote />
            </div>

            {/* Profile Section */}
            <div className="relative flex items-center mb-6">
                {testimonial?.image ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 ring-2 ring-primary/20">
                        <img
                            src={testimonial.image}
                            alt={testimonial.name || 'Customer'}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <MessageSquare className="w-8 h-8 text-primary" />
                    </div>
                )}

                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial?.name || 'Anonymous Customer'}
                    </h4>
                    {testimonial?.role && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.role}
                        </p>
                    )}
                    {testimonial?.rating && (
                        <div className="mt-1">
                            <StarRating rating={testimonial.rating} />
                        </div>
                    )}
                </div>

                {formattedDate && (
                    <div className="ml-auto text-right">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formattedDate}
                        </div>
                    </div>
                )}
            </div>

            {/* Testimonial Text */}
            <blockquote className="relative text-gray-700 dark:text-gray-300 mb-4">
                {testimonial?.comment || 'No comment provided.'}
            </blockquote>

            {/* Footer */}
            <div className="flex items-center justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-primary"
                >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    <span>Helpful</span>
                </Button>
            </div>
        </motion.div>
    );
};

const TestimonialsSection = ({ testimonials }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Check if we have valid data
    if (!testimonials || !testimonials.testimonials || testimonials.testimonials.length === 0) {
        return null;
    }

    const testimonialsList = testimonials.testimonials;

    // For desktop/tablet view: use custom navigation
    const handlePrev = () => {
        setActiveIndex((prev) =>
            prev === 0 ? testimonialsList.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setActiveIndex((prev) =>
            prev === testimonialsList.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <div className="py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {testimonials.title || 'What Our Guests Say'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {testimonials.description || 'Hear from our satisfied customers'}
                </p>
            </div>

            {/* Desktop View: Showcase Style */}
            <div className="hidden md:block container mx-auto px-4">
                <div className="relative">
                    <div className="max-w-4xl mx-auto">
                        <AnimatePresence mode="wait">
                            <TestimonialCard
                                key={testimonialsList[activeIndex]?.id || activeIndex}
                                testimonial={testimonialsList[activeIndex]}
                                isActive={true}
                            />
                        </AnimatePresence>
                    </div>

                    {/* Navigation Controls */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full bg-white dark:bg-gray-800 shadow-md -ml-4"
                            onClick={handlePrev}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full bg-white dark:bg-gray-800 shadow-md -mr-4"
                            onClick={handleNext}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {testimonialsList.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all",
                                    activeIndex === index
                                        ? "bg-primary w-8"
                                        : "bg-gray-300 dark:bg-gray-600"
                                )}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile View: Carousel */}
            <div className="md:hidden px-4">
                <Swiper
                    modules={[Pagination, Navigation, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    className="pb-12"
                >
                    {testimonialsList.map((testimonial, index) => (
                        <SwiperSlide key={testimonial?.id || index}>
                            <TestimonialCard testimonial={testimonial} isActive={true} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default TestimonialsSection; 