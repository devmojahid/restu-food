import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HeroSlider = ({ slides }) => {
    return (
        <div className="relative">
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                effect="fade"
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    renderBullet: function (index, className) {
                        return `<span class="${className} w-3 h-3"></span>`;
                    },
                }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                className="h-[600px] lg:h-[700px] w-full"
            >
                {slides?.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div 
                            className="relative h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
                            
                            {/* Content */}
                            <div className="absolute inset-0 flex items-center">
                                <div className="container mx-auto px-4">
                                    <div className="max-w-3xl">
                                        <motion.span
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6 }}
                                            className="inline-block bg-primary/90 text-white px-4 py-2 rounded-full text-sm mb-6"
                                        >
                                            #1 Food Delivery Service
                                        </motion.span>
                                        
                                        <motion.h1 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight"
                                        >
                                            {slide.title}
                                        </motion.h1>
                                        
                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.4 }}
                                            className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl"
                                        >
                                            {slide.description}
                                        </motion.p>
                                        
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.6 }}
                                            className="flex flex-wrap gap-4"
                                        >
                                            <Link
                                                href={slide.cta.link}
                                                className="group bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2"
                                            >
                                                <span>{slide.cta.text}</span>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                            
                                            <Link
                                                href="/about"
                                                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
                                            >
                                                Learn More
                                            </Link>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <div className="swiper-button-prev !text-white after:!text-2xl"></div>
            <div className="swiper-button-next !text-white after:!text-2xl"></div>

            {/* Stats Section */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm py-6 hidden lg:block">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-4 gap-8">
                        {[
                            { label: 'Restaurants', value: '500+' },
                            { label: 'Menu Items', value: '2000+' },
                            { label: 'Happy Customers', value: '100K+' },
                            { label: 'Cities', value: '50+' },
                        ].map((stat, index) => (
                            <div key={index} className="text-center text-white">
                                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-300">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSlider; 