import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const TestimonialsSection = ({ data }) => {
    // Ensure data has all required properties with fallbacks
    const title = data?.title || 'What Our Partners Say';
    const subtitle = data?.subtitle || 'Testimonials';
    const description = data?.description || 'Hear from our satisfied partners.';
    const testimonials = data?.testimonials || [];

    // Star rating component
    const StarRating = ({ rating }) => (
        <div className="flex space-x-1">
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

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-4"
                    >
                        <span>{subtitle}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        {title}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400"
                    >
                        {description}
                    </motion.p>
                </div>

                {/* Testimonials Slider */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 }
                        }}
                        className="!pb-16"
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={index}>
                                <div className={cn(
                                    "h-full p-8 rounded-2xl",
                                    "bg-white dark:bg-gray-800",
                                    "border border-gray-100 dark:border-gray-700",
                                    "shadow-sm hover:shadow-xl transition-all duration-300"
                                )}>
                                    {/* Quote Icon */}
                                    <div className="flex justify-end mb-4">
                                        <Quote className="w-8 h-8 text-primary/20" />
                                    </div>

                                    {/* Testimonial Text */}
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 h-32 overflow-y-auto">
                                        "{testimonial.text}"
                                    </p>

                                    {/* Rating */}
                                    <div className="mb-4">
                                        <StarRating rating={testimonial.rating} />
                                    </div>

                                    {/* Author */}
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {testimonial.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {testimonial.role}
                                            </div>
                                            <div className="text-xs text-gray-400 dark:text-gray-500">
                                                {testimonial.date && format(new Date(testimonial.date), 'MMM dd, yyyy')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>
        </section>
    );
};

export default TestimonialsSection; 