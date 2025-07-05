import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, 
    Star, 
    Quote,
    ThumbsUp,
    Calendar,
    Verified,
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { format } from 'date-fns';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TestimonialCard = ({ testimonial, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={cn(
                "group relative",
                "bg-white dark:bg-gray-800",
                "rounded-2xl overflow-hidden",
                "border border-gray-100 dark:border-gray-700",
                "shadow-lg hover:shadow-xl",
                "transition-all duration-300",
                "p-6 md:p-8"
            )}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                <div className="absolute inset-0" 
                    style={{
                        backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                        backgroundSize: "24px 24px"
                    }}
                />
            </div>

            {/* Quote Icon */}
            <motion.div
                initial={false}
                animate={{
                    scale: isHovered ? 1.1 : 1,
                    rotate: isHovered ? 10 : 0
                }}
                className="absolute top-4 right-4"
            >
                <Quote className="w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
            </motion.div>

            {/* Profile Section */}
            <div className="relative flex items-center space-x-4 mb-6">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                >
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/20">
                        <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {testimonial.verified_purchase && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 
                                    rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800"
                        >
                            <Verified className="w-3 h-3 text-white" />
                        </motion.div>
                    )}
                </motion.div>
                <div>
                    <motion.h4 
                        className="font-semibold text-gray-900 dark:text-white"
                        whileHover={{ x: 3 }}
                    >
                        {testimonial.name}
                    </motion.h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                    </p>
                </div>
            </div>

            {/* Order Info */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    {testimonial.order_type}
                </Badge>
                <Badge variant="outline" className="text-gray-500 dark:text-gray-400">
                    {testimonial.restaurant}
                </Badge>
                <Badge variant="outline" className="text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {testimonial.date ? format(new Date(testimonial.date), 'MMM dd, yyyy') : 'Date not available'}
                </Badge>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between mb-4">
                <motion.div whileHover={{ scale: 1.05 }}>
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i}
                                className={cn(
                                    "w-4 h-4",
                                    i < testimonial.rating 
                                        ? "text-yellow-400 fill-yellow-400" 
                                        : "text-gray-300 dark:text-gray-600"
                                )}
                            />
                        ))}
                    </div>
                </motion.div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "flex items-center space-x-1 px-3 py-1 rounded-full",
                        "text-gray-500 hover:text-primary",
                        "transition-colors duration-200"
                    )}
                >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">{testimonial.helpful_count}</span>
                </motion.button>
            </div>

            {/* Testimonial Text */}
            <div className="relative mb-4">
                <motion.div
                    initial={false}
                    animate={{
                        opacity: isHovered ? 1 : 0.5,
                        scale: isHovered ? 1.2 : 1
                    }}
                    className="absolute -left-2 -top-2 text-6xl text-primary/5 pointer-events-none"
                >
                    "
                </motion.div>
                <p className="relative text-gray-600 dark:text-gray-300 leading-relaxed">
                    {testimonial.text}
                </p>
            </div>

            {/* Tags */}
            {testimonial.tags && testimonial.tags.length > 0 && (
                <motion.div 
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {testimonial.tags.map((tag, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Badge
                                variant="secondary"
                                className="bg-gray-100 dark:bg-gray-700/50 
                                         text-gray-600 dark:text-gray-300
                                         hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                #{tag}
                            </Badge>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

const Testimonials = ({ data }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 
                             rounded-full blur-3xl opacity-50 dark:opacity-30" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 
                             rounded-full blur-3xl opacity-50 dark:opacity-30" />
            </div>

            <div className="container mx-auto px-4 relative">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full 
                                bg-primary/10 dark:bg-primary/20 text-primary mb-6"
                    >
                        <MessageSquare className="w-8 h-8" />
                    </motion.div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {data.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {data.subtitle}
                    </p>
                </motion.div>

                {/* Testimonials Grid/Carousel */}
                {isMobile ? (
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={16}
                        slidesPerView={1.2}
                        centeredSlides={true}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                        className="!overflow-visible"
                    >
                        {data.testimonials.map((testimonial, index) => (
                            <SwiperSlide key={testimonial.id || `testimonial-${index}`}>
                                <TestimonialCard 
                                    testimonial={testimonial} 
                                    index={index}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.testimonials.map((testimonial, index) => (
                            <TestimonialCard 
                                key={testimonial.id || `testimonial-${index}`}
                                testimonial={testimonial} 
                                index={index}
                            />
                        ))}
                    </div>
                )}

                {/* View All Reviews Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Button
                        size="lg"
                        className="rounded-full"
                        onClick={() => window.location.href = '/reviews'}
                    >
                        View All Reviews
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials; 