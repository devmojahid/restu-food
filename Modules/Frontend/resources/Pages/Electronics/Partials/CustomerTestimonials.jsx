import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TestimonialCard = ({ testimonial, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 h-full 
                     border border-gray-100 dark:border-gray-700 relative"
        >
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 text-gray-200 dark:text-gray-700">
                <Quote className="h-10 w-10" />
            </div>

            {/* Rating */}
            <div className="mb-4 flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                        key={star}
                        className={cn(
                            "h-4 w-4 mr-1",
                            star <= testimonial.rating 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300 dark:text-gray-600"
                        )}
                    />
                ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-4">
                "{testimonial.text}"
            </p>

            {/* Customer Info */}
            <div className="flex items-center mt-auto">
                {testimonial.image ? (
                    <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                )}
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.title || 'Verified Customer'}
                    </p>
                </div>
                
                {testimonial.verified && (
                    <div className="ml-auto bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 
                                 text-xs font-medium px-2 py-1 rounded-full">
                        Verified
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const EmptyState = () => (
    <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Testimonials Yet</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            We're collecting customer feedback. Check back soon to see what others are saying about us!
        </p>
    </div>
);

const CustomerTestimonials = ({ data = {} }) => {
    const { title = "What Our Customers Say", subtitle, testimonials = [] } = data;
    
    if (!testimonials.length) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <EmptyState />
                </div>
            </section>
        );
    }

    // Stats calculation
    const averageRating = testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length;
    const verifiedCount = testimonials.filter(t => t.verified).length;
    const fiveStarCount = testimonials.filter(t => t.rating === 5).length;
    const fiveStarPercentage = (fiveStarCount / testimonials.length) * 100;
    
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center space-x-2 bg-purple-500/10 text-purple-500 px-3 py-1 
                                 rounded-full text-sm font-medium mb-4"
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span>Customer Reviews</span>
                    </motion.div>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
                    >
                        {title}
                    </motion.h2>
                    
                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>
                
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm 
                                 border border-gray-100 dark:border-gray-700 text-center"
                    >
                        <div className="text-3xl font-bold text-primary mb-1">
                            {averageRating.toFixed(1)}
                        </div>
                        <div className="flex items-center justify-center mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star}
                                    className={cn(
                                        "h-4 w-4",
                                        star <= Math.round(averageRating) 
                                            ? "text-yellow-400 fill-yellow-400" 
                                            : "text-gray-300"
                                    )}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Average Rating
                        </p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm 
                                 border border-gray-100 dark:border-gray-700 text-center"
                    >
                        <div className="text-3xl font-bold text-primary mb-2">
                            {testimonials.length}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Total Reviews
                        </p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm 
                                 border border-gray-100 dark:border-gray-700 text-center"
                    >
                        <div className="text-3xl font-bold text-primary mb-2">
                            {verifiedCount}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Verified Customers
                        </p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm 
                                 border border-gray-100 dark:border-gray-700 text-center"
                    >
                        <div className="text-3xl font-bold text-primary mb-2">
                            {fiveStarPercentage.toFixed(0)}%
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            5-Star Reviews
                        </p>
                    </motion.div>
                </div>

                {/* Testimonials Carousel */}
                <div className="mb-8">
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={24}
                        slidesPerView={1}
                        pagination={{ 
                            clickable: true,
                            dynamicBullets: true
                        }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        className="pb-12"
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={testimonial.id || index}>
                                <div className="h-full">
                                    <TestimonialCard testimonial={testimonial} index={index} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default CustomerTestimonials; 