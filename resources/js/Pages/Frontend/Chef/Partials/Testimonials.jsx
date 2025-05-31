import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Testimonials = ({ testimonials = [] }) => {
    if (!testimonials?.length) {
        return null;
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <div className="max-w-xl mx-auto text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            Customer Testimonials
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Hear what our customers have to say about their experiences with our talented chefs
                        </p>
                    </motion.div>
                </div>

                <div className="relative">
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{
                            nextEl: '.testimonial-next',
                            prevEl: '.testimonial-prev',
                        }}
                        pagination={{ clickable: true }}
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
                        className="!pb-14"
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={testimonial.id || index}>
                                <TestimonialCard testimonial={testimonial} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <div className="hidden md:block">
                        <Button
                            variant="outline"
                            size="icon"
                            className="testimonial-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="testimonial-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

const TestimonialCard = ({ testimonial }) => {
    if (!testimonial) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full flex flex-col relative overflow-hidden group"
        >
            {/* Quote Icon */}
            <Quote className="w-10 h-10 text-primary/10 absolute top-6 right-6 group-hover:text-primary/20 transition-colors" />

            {/* Rating */}
            <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={cn(
                            "w-4 h-4",
                            star <= (testimonial.rating || 5)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                        )}
                    />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                    {testimonial.rating || 5}.0
                </span>
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow">
                "{testimonial.text}"
            </p>

            {/* Author */}
            <div className="flex items-center mt-auto">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img
                        src={testimonial.image || '/images/default-avatar.jpg'}
                        alt={testimonial.name}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.date || 'Customer'}
                    </p>
                </div>
            </div>

            {/* Chef Reference */}
            {testimonial.chef && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        About Chef: <span className="text-primary font-medium">{testimonial.chef}</span>
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default Testimonials; 