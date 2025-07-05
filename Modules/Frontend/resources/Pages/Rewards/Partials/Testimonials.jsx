import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";

const Testimonials = ({ data = {} }) => {
    const {
        title = 'What Our Members Say',
        description = 'Hear from people who are earning and enjoying rewards every day.',
        testimonials = []
    } = data;

    // Ensure testimonials is an array
    const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];

    // Default testimonials if none provided
    const defaultTestimonials = [
        {
            id: 1,
            name: 'Jennifer Parker',
            location: 'New York, NY',
            avatar: '/images/avatar-1.jpg',
            rating: 5,
            text: 'I love the rewards program! I\'ve saved so much money on delivery fees and have enjoyed free appetizers with my orders. The points add up quickly.',
            memberSince: '2021-03-15',
            memberTier: 'Gold'
        },
        {
            id: 2,
            name: 'Michael Johnson',
            location: 'Chicago, IL',
            avatar: '/images/avatar-2.jpg',
            rating: 5,
            text: 'The birthday bonus was a great surprise! I got 500 points just for having a birthday. I used those points for a free meal and it made my day special.',
            memberSince: '2022-01-10',
            memberTier: 'Silver'
        },
        {
            id: 3,
            name: 'Sarah Williams',
            location: 'Los Angeles, CA',
            avatar: '/images/avatar-3.jpg',
            rating: 4,
            text: 'I\'ve been a member for over a year and have already redeemed multiple rewards. The points system is straightforward and the rewards are actually useful.',
            memberSince: '2021-06-22',
            memberTier: 'Platinum'
        },
        {
            id: 4,
            name: 'David Chen',
            location: 'Seattle, WA',
            avatar: '/images/avatar-4.jpg',
            rating: 5,
            text: 'Referring friends to the rewards program has been great. I get points for each referral, and my friends get to enjoy the benefits too. It\'s a win-win!',
            memberSince: '2022-02-05',
            memberTier: 'Bronze'
        },
        {
            id: 5,
            name: 'Amanda Rodriguez',
            location: 'Miami, FL',
            avatar: '/images/avatar-5.jpg',
            rating: 5,
            text: 'The weekend bonus points promotion is my favorite. I order most of my meals on weekends anyway, so getting double points is an awesome perk!',
            memberSince: '2021-11-30',
            memberTier: 'Gold'
        }
    ];

    // Use provided testimonials or fallback to defaults
    const displayTestimonials = safeTestimonials.length > 0 ? safeTestimonials : defaultTestimonials;

    // State for carousel
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const intervalRef = useRef(null);

    // Function to handle next/prev slide
    const goToSlide = (index) => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setActiveIndex(index);

        // Reset transition state after animation completes
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };

    // Function to go to next slide
    const nextSlide = () => {
        const newIndex = (activeIndex + 1) % displayTestimonials.length;
        goToSlide(newIndex);
    };

    // Function to go to previous slide
    const prevSlide = () => {
        const newIndex = (activeIndex - 1 + displayTestimonials.length) % displayTestimonials.length;
        goToSlide(newIndex);
    };

    // Auto-rotate testimonials
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            nextSlide();
        }, 6000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [activeIndex, displayTestimonials.length]);

    // Reset interval when user interacts
    const resetInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                nextSlide();
            }, 6000);
        }
    };

    // Helper function to render stars
    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                className={cn(
                    "w-4 h-4",
                    index < rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                )}
            />
        ));
    };

    // Format date to readable string
    const formatDate = (dateString) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long'
            }).format(date);
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    // Get tier color
    const getTierColor = (tier) => {
        const tierColors = {
            'Bronze': 'text-amber-700',
            'Silver': 'text-gray-400',
            'Gold': 'text-yellow-500',
            'Platinum': 'text-indigo-500'
        };

        return tierColors[tier] || 'text-primary';
    };

    return (
        <section className="py-16 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 opacity-50">
                    <Quote className="text-gray-200 dark:text-gray-800 w-32 h-32 md:w-48 md:h-48" />
                </div>
                <div className="absolute bottom-0 left-0 opacity-50">
                    <Quote className="text-gray-200 dark:text-gray-800 w-32 h-32 md:w-48 md:h-48 rotate-180" />
                </div>
            </div>

            <div className="container mx-auto px-4 relative">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center rounded-full px-4 py-1 mb-4 
                                 bg-primary/10 text-primary text-sm font-medium"
                    >
                        Testimonials
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400"
                    >
                        {description}
                    </motion.p>
                </div>

                {/* Testimonial Carousel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="max-w-4xl mx-auto relative"
                >
                    {/* Navigation Buttons */}
                    <div className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 z-10">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 shadow-md"
                            onClick={() => { prevSlide(); resetInterval(); }}
                            disabled={isTransitioning}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 z-10">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 shadow-md"
                            onClick={() => { nextSlide(); resetInterval(); }}
                            disabled={isTransitioning}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Testimonial Cards */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                        >
                            {displayTestimonials.map((testimonial, index) => (
                                <div
                                    key={testimonial.id || index}
                                    className="w-full flex-shrink-0 px-4"
                                >
                                    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
                                        <CardHeader className="pb-0">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                                        {testimonial.avatar ? (
                                                            <img
                                                                src={testimonial.avatar}
                                                                alt={testimonial.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.parentNode.classList.add('bg-primary/20');
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary">
                                                                {testimonial.name.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                                                        <CardDescription>
                                                            {testimonial.location}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="flex">
                                                        {renderStars(testimonial.rating)}
                                                    </div>
                                                    {testimonial.memberTier && (
                                                        <span className={cn(
                                                            "text-sm font-medium mt-1",
                                                            getTierColor(testimonial.memberTier)
                                                        )}>
                                                            {testimonial.memberTier} Member
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-6 relative">
                                            {/* Quote Icon */}
                                            <div className="absolute top-4 left-0 text-primary/10">
                                                <Quote className="h-8 w-8" />
                                            </div>
                                            <div className="pl-6">
                                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                    "{testimonial.text}"
                                                </p>
                                                {testimonial.memberSince && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                        Member since {formatDate(testimonial.memberSince)}
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {displayTestimonials.map((_, index) => (
                            <button
                                key={index}
                                className={cn(
                                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                                    index === activeIndex
                                        ? "bg-primary w-6"
                                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                                )}
                                onClick={() => { goToSlide(index); resetInterval(); }}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <Button asChild>
                        <Link href="/rewards/register">Join Our Rewards Program</Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials; 