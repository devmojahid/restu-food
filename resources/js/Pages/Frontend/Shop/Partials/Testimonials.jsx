import React from 'react';
import { motion } from 'framer-motion';
import { 
    MessageSquare, 
    Star, 
    User,
    Quote,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { formatDistanceToNow } from 'date-fns';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TestimonialCard = ({ testimonial, index }) => {
    const { name, image, role, rating, text, date, verified } = testimonial;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8 h-full
                     border border-gray-100 dark:border-gray-700
                     flex flex-col relative overflow-hidden group"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" 
                    style={{
                        backgroundImage: "radial-gradient(circle at 10px 10px, currentColor 2px, transparent 0)",
                        backgroundSize: "40px 40px"
                    }}
                />
            </div>
            
            {/* Quote Icon */}
            <Quote className="absolute top-6 right-6 w-10 h-10 text-gray-200 dark:text-gray-700" />

            {/* Rating */}
            <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        className={cn(
                            "w-4 h-4", 
                            i < Math.floor(rating) 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300 dark:text-gray-600"
                        )} 
                    />
                ))}
            </div>

            {/* Testimonial Text */}
            <div className="mb-6 flex-grow">
                <p className="text-gray-600 dark:text-gray-300 italic relative z-10 leading-relaxed">
                    "{text}"
                </p>
            </div>

            {/* Author Info */}
            <div className="flex items-center mt-auto">
                <div className="flex-shrink-0 mr-4">
                    {image ? (
                        <img 
                            src={image} 
                            alt={name} 
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                        </div>
                    )}
                </div>
                <div>
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                        {name}
                        {verified && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                Verified
                            </span>
                        )}
                    </h4>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center flex-wrap gap-2">
                        <span>{role}</span>
                        {date && (
                            <>
                                <span className="inline-block w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
                                <span>{formatDistanceToNow(new Date(date), { addSuffix: true })}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Testimonials Yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
            We're waiting for our first customer reviews. Be the first to share your experience!
        </p>
    </div>
);

const Testimonials = ({ testimonials = [] }) => {
    if (!testimonials.length) return <EmptyState />;

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <div className="flex items-center mb-2">
                            <MessageSquare className="w-5 h-5 text-primary mr-2" />
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                Customer Testimonials
                            </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Read what our satisfied customers have to say about their shopping experience
                        </p>
                    </div>
                </div>

                {/* Testimonials Slider */}
                <div className="relative">
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        pagination={{
                            clickable: true,
                            el: '.testimonials-pagination',
                            bulletClass: 'inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700 mx-1 transition-all cursor-pointer',
                            bulletActiveClass: '!w-6 !bg-primary'
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

                    {/* Custom Navigation Buttons */}
                    <div className="hidden md:block">
                        <button className="swiper-button-prev absolute top-1/2 -left-4 z-10 transform -translate-y-1/2
                                      w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md 
                                      flex items-center justify-center group focus:outline-none">
                            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 
                                           group-hover:text-primary transition-colors" />
                        </button>
                        <button className="swiper-button-next absolute top-1/2 -right-4 z-10 transform -translate-y-1/2
                                      w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md 
                                      flex items-center justify-center group focus:outline-none">
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 
                                            group-hover:text-primary transition-colors" />
                        </button>
                    </div>

                    {/* Custom Pagination */}
                    <div className="testimonials-pagination flex justify-center items-center mt-6"></div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials; 