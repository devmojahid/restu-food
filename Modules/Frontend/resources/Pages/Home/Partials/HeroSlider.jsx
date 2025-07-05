import React, { useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
    Autoplay,
    Pagination,
    Navigation,
    EffectCards,
    EffectCoverflow,
    EffectCreative
} from 'swiper/modules';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import useArraySafety from '@/hooks/useArraySafety';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-creative';

const HeroSlider = ({ slides = [], type = 'slider', className }) => {
    // Use our array safety hook
    const { ensureArray, isEmpty } = useArraySafety();

    // Ensure slides is an array
    const safeSlides = ensureArray(slides);

    console.log(safeSlides);

    // Safety check for null/undefined or empty slides
    if (isEmpty(safeSlides)) {
        return (
            <div className={cn("relative bg-gradient-to-r from-gray-800 to-gray-900 h-[300px] flex items-center justify-center text-white", className)}>
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Welcome to Restu Food</h2>
                    <p className="text-gray-300">Delicious meals delivered to your door</p>
                </div>
            </div>
        );
    }

    // Enhanced scroll functionality
    const handleScrollToContent = useCallback(() => {
        const contentSection = document.querySelector('#featured-restaurants');
        if (contentSection) {
            const offset = 80; // Adjust for fixed header
            const elementPosition = contentSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    // Static Hero Section
    if (type === 'hero' && safeSlides[0]) {
        const heroData = safeSlides[0];

        return (
            <div className={cn("relative h-[600px] lg:h-[700px] w-full overflow-hidden", className)}>
                {/* Background Image with Parallax Effect */}
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${heroData.image || '/images/default-hero.jpg'})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}
                />

                {/* Gradient Overlay with Enhanced Design */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md 
                                         text-white px-4 py-2 rounded-full text-sm mb-6"
                            >
                                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span>Experience the Best Food Delivery</span>
                            </motion.div>

                            {/* Title with Enhanced Animation */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight"
                            >
                                {heroData.title}
                            </motion.h1>

                            {/* Description with Gradient Text */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-lg md:text-xl text-transparent bg-clip-text 
                                         bg-gradient-to-r from-white to-white/60 mb-8 max-w-2xl"
                            >
                                {heroData.description}
                            </motion.p>

                            {/* CTA Buttons with Enhanced Hover Effects */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="flex flex-wrap gap-4"
                            >
                                <Link
                                    href={heroData.cta.link}
                                    className="group relative overflow-hidden bg-primary hover:bg-primary/90 
                                             text-white px-8 py-4 rounded-full text-lg font-semibold 
                                             transition-all duration-300 flex items-center space-x-2"
                                >
                                    <span className="relative z-10">{heroData.cta.text}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 
                                                  translate-x-full group-hover:translate-x-0 transition-transform" />
                                </Link>

                                <Link
                                    href="/about"
                                    className="group relative overflow-hidden bg-white/10 backdrop-blur-sm 
                                             hover:bg-white/20 text-white px-8 py-4 rounded-full text-lg 
                                             font-semibold transition-all duration-300"
                                >
                                    <span className="relative z-10">Learn More</span>
                                    <div className="absolute inset-0 bg-white/10 transform -skew-x-12 
                                                  translate-x-full group-hover:translate-x-0 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    onClick={handleScrollToContent}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white flex flex-col 
                             items-center space-y-2 cursor-pointer group"
                >
                    <span className="text-sm font-medium">Scroll Down</span>
                    <ChevronDown className="w-6 h-6 animate-bounce" />
                </motion.button>
            </div>
        );
    }

    // Enhanced Slider Section with Modern Design
    return (
        <div className={cn("relative group", className)}>
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectCards, EffectCoverflow, EffectCreative]}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                pagination={{
                    clickable: true,
                    renderBullet: function (index, className) {
                        return `
                            <span class="${className} !w-10 !h-2 !rounded-full !bg-white/20 
                                       !backdrop-blur-sm transition-all duration-300 
                                       hover:!bg-primary/80">
                            </span>
                        `;
                    },
                }}
                navigation={{
                    nextEl: '.custom-swiper-next',
                    prevEl: '.custom-swiper-prev',
                }}
                loop={true}
                className="h-[600px] lg:h-[700px] w-full"
            >
                {safeSlides.map((slide, index) => (
                    <SwiperSlide key={slide?.id || index} className="relative overflow-hidden">
                        {({ isActive, isNext, isPrev }) => (
                            <>
                                {/* Background Image with Zoom Effect */}
                                <motion.div
                                    initial={{ scale: 1.2 }}
                                    animate={{
                                        scale: isActive ? 1 : 1.2,
                                        opacity: isActive ? 1 : 0.8
                                    }}
                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${slide?.image || '/images/default-slide.jpg'})` }}
                                />

                                {/* Enhanced Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/90 
                                              via-black/70 to-transparent" />

                                {/* Content with Enhanced Animations */}
                                <div className="absolute inset-0 flex items-center">
                                    <div className="container mx-auto px-4">
                                        <motion.div
                                            className="max-w-3xl"
                                            initial={{ opacity: 0, x: -100 }}
                                            animate={{
                                                opacity: isActive ? 1 : 0,
                                                x: isActive ? 0 : -100
                                            }}
                                            transition={{ duration: 0.8, delay: 0.2 }}
                                        >
                                            {/* Modern Badge Design */}
                                            <div className="inline-flex items-center space-x-2 bg-white/10 
                                                          backdrop-blur-md text-white px-6 py-2 rounded-full 
                                                          text-sm mb-6 border border-white/20">
                                                <motion.span
                                                    className="inline-block w-2 h-2 rounded-full bg-primary"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                                <span className="relative">
                                                    <span className="absolute -top-8 left-0 text-xs 
                                                                   text-primary/80">Featured</span>
                                                    Slide {index + 1} of {safeSlides.length}
                                                </span>
                                            </div>

                                            {/* Enhanced Title with Split Animation */}
                                            <div className="overflow-hidden mb-6">
                                                <motion.h1
                                                    className="text-4xl md:text-6xl lg:text-7xl font-bold 
                                                             text-white leading-tight"
                                                    initial={{ y: 100 }}
                                                    animate={{ y: isActive ? 0 : 100 }}
                                                    transition={{
                                                        duration: 0.8,
                                                        delay: 0.4,
                                                        ease: "easeOut"
                                                    }}
                                                >
                                                    {slide?.title || 'Slide Title'}
                                                </motion.h1>
                                            </div>

                                            {/* Modern Description with Gradient */}
                                            <motion.p
                                                className="text-lg md:text-xl text-white/90 mb-8 
                                                         max-w-2xl leading-relaxed"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{
                                                    opacity: isActive ? 1 : 0,
                                                    y: isActive ? 0 : 20
                                                }}
                                                transition={{ duration: 0.8, delay: 0.6 }}
                                            >
                                                {slide?.description || 'Slide Description'}
                                            </motion.p>

                                            {/* Modern CTA Buttons */}
                                            <motion.div
                                                className="flex flex-wrap gap-4"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{
                                                    opacity: isActive ? 1 : 0,
                                                    y: isActive ? 0 : 20
                                                }}
                                                transition={{ duration: 0.8, delay: 0.8 }}
                                            >
                                                <Link
                                                    href={slide?.cta?.link || '/'}
                                                    className="group relative overflow-hidden bg-primary 
                                                             text-white px-8 py-4 rounded-full text-lg 
                                                             font-semibold transition-all duration-300 
                                                             flex items-center space-x-2 hover:shadow-lg 
                                                             hover:shadow-primary/30"
                                                >
                                                    <span className="relative z-10">{slide?.cta?.text || 'Learn More'}</span>
                                                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 
                                                                         transition-transform relative z-10" />
                                                    <div className="absolute inset-0 bg-gradient-to-r 
                                                                  from-primary-600 to-primary-500 opacity-0 
                                                                  group-hover:opacity-100 transition-opacity" />
                                                </Link>

                                                <Link
                                                    href="/about"
                                                    className="group relative overflow-hidden bg-white/10 
                                                             backdrop-blur-sm hover:bg-white/20 text-white 
                                                             px-8 py-4 rounded-full text-lg font-semibold 
                                                             transition-all duration-300 border 
                                                             border-white/20 hover:border-white/40"
                                                >
                                                    <span className="relative z-10">Learn More</span>
                                                </Link>
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </div>
                            </>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Modern Navigation Controls */}
            <div className="absolute inset-x-0 bottom-10 z-10 flex items-center justify-center gap-4">
                <button
                    className="custom-swiper-prev group p-3 rounded-full bg-black/20 
                              backdrop-blur-sm hover:bg-black/40 transition-all duration-300"
                >
                    <ArrowRight className="w-6 h-6 text-white rotate-180 
                                       group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                    className="custom-swiper-next group p-3 rounded-full bg-black/20 
                              backdrop-blur-sm hover:bg-black/40 transition-all duration-300"
                >
                    <ArrowRight className="w-6 h-6 text-white 
                                       group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Enhanced Stats Section with Hover Effects */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t 
                          from-black/80 to-transparent backdrop-blur-sm py-6 
                          opacity-0 group-hover:opacity-100 transition-opacity 
                          duration-500 hidden lg:block">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-4 gap-8">
                        {[
                            { label: 'Restaurants', value: '500+', icon: '🏪' },
                            { label: 'Menu Items', value: '2000+', icon: '🍽️' },
                            { label: 'Happy Customers', value: '100K+', icon: '😊' },
                            { label: 'Cities', value: '50+', icon: '🌆' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center text-white p-4 rounded-xl 
                                         hover:bg-white/10 transition-colors cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="text-3xl mb-2">{stat.icon}</div>
                                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-300">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSlider; 