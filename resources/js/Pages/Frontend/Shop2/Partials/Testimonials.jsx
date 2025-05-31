import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    ChevronLeft, 
    ChevronRight,
    Quote,
    ThumbsUp,
    User,
    MessageCircle,
    Calendar,
    ShoppingBag,
    CheckCircle
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Testimonials = ({ testimonials = [] }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container px-4 mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-12"
                >
                    <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
                        <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Read trusted reviews from our customers about their shopping experience with us
                    </p>
                </motion.div>

                {/* Testimonials Slider */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={24}
                        slidesPerView={isMobile ? 1 : 3}
                        navigation={{
                            nextEl: '.testimonial-next',
                            prevEl: '.testimonial-prev',
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                            },
                            768: {
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
                                <TestimonialCard testimonial={testimonial} index={index} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation */}
                    <div className="flex justify-center items-center mt-8 space-x-4">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="testimonial-prev rounded-full"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="testimonial-next rounded-full"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const TestimonialCard = ({ testimonial, index }) => {
    const [isHelpful, setIsHelpful] = useState(false);
    
    // Format date if available
    const formattedDate = testimonial.date 
        ? format(new Date(testimonial.date), 'MMM d, yyyy')
        : '';
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md",
                "border border-gray-100 dark:border-gray-700",
                "h-full flex flex-col relative overflow-hidden",
                "hover:shadow-lg transition-shadow"
            )}
        >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 opacity-5">
                <Quote className="h-24 w-24 text-primary transform -rotate-12" />
            </div>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                        key={star}
                        className={cn(
                            "h-4 w-4",
                            star <= testimonial.rating 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300"
                        )}
                    />
                ))}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.rating}/5
                </span>
            </div>
            
            {/* Testimonial Text */}
            <div className="relative mb-4 flex-grow">
                <p className="text-gray-700 dark:text-gray-300 italic">
                    "{testimonial.text}"
                </p>
            </div>
            
            {/* Product Badge - if available */}
            {testimonial.product && (
                <div className="mb-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <ShoppingBag className="h-3 w-3" />
                        <span>Purchased: {testimonial.product}</span>
                    </Badge>
                </div>
            )}
            
            {/* Customer Info */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center">
                    {testimonial.image ? (
                        <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-primary/20"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center">
                            <p className="font-medium text-gray-900 dark:text-white">
                                {testimonial.name}
                            </p>
                            {testimonial.verified_purchase && (
                                <CheckCircle className="h-3 w-3 text-green-500 ml-1" />
                            )}
                        </div>
                        {formattedDate && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formattedDate}
                            </p>
                        )}
                    </div>
                </div>
                
                {/* Helpful Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "text-xs flex items-center",
                        isHelpful && "text-primary"
                    )}
                    onClick={() => setIsHelpful(!isHelpful)}
                >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    <span>
                        {isHelpful 
                            ? `Helpful (${(testimonial.helpful_count || 0) + 1})` 
                            : `Helpful (${testimonial.helpful_count || 0})`
                        }
                    </span>
                </Button>
            </div>
        </motion.div>
    );
};

export default Testimonials; 