import React, { useState, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroSlide = ({ slide, index }) => {
    const { title, subtitle, image, buttonText, buttonLink, align = 'left', theme = 'dark' } = slide;
    
    const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
    const textColorSecondary = theme === 'light' ? 'text-gray-700' : 'text-gray-200';
    
    return (
        <div className="relative h-[70vh] md:h-[80vh] flex items-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover"
                />
                {/* Dark Overlay */}
                <div className={cn(
                    "absolute inset-0", 
                    theme === 'light' 
                        ? "bg-gradient-to-r from-white/70 to-white/30" 
                        : "bg-gradient-to-r from-black/70 to-black/30"
                )}></div>
            </div>
            
            {/* Content */}
            <div className="container mx-auto px-4 z-10 relative">
                <div className={cn(
                    "max-w-xl",
                    align === 'center' ? 'mx-auto text-center' : '',
                    align === 'right' ? 'ml-auto text-right' : ''
                )}>
                    <motion.h2 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={cn("text-4xl md:text-5xl lg:text-6xl font-bold mb-4", textColor)}
                    >
                        {title}
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className={cn("text-lg md:text-xl mb-8", textColorSecondary)}
                    >
                        {subtitle}
                    </motion.p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Link href={buttonLink || "#"}>
                            <Button 
                                variant="default" 
                                size="lg"
                                className="rounded-full bg-primary hover:bg-primary/90 text-white"
                            >
                                <span>{buttonText || "Shop Now"}</span>
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const EmptyState = () => (
    <div className="h-[50vh] flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Our Electronics Store
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Discover the latest technology products at competitive prices.
            </p>
            <Link href="/products">
                <Button variant="default" className="rounded-full bg-primary hover:bg-primary/90">
                    <span>Browse Products</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </div>
    </div>
);

const HeroSlider = ({ data = {} }) => {
    const { slides = [], title, subtitle } = data;
    const [activeIndex, setActiveIndex] = useState(0);
    
    const handlePrev = useCallback(() => {
        if (swiperRef.current?.swiper) {
            swiperRef.current.swiper.slidePrev();
        }
    }, []);
    
    const handleNext = useCallback(() => {
        if (swiperRef.current?.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    }, []);
    
    const handleScrollToContent = () => {
        const featuredSection = document.getElementById('featured-section');
        if (featuredSection) {
            featuredSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    const swiperRef = React.useRef(null);
    
    if (!slides.length) {
        return <EmptyState />;
    }

    return (
        <section className="relative">
            {/* Slider */}
            <Swiper
                ref={swiperRef}
                modules={[Autoplay, Navigation, Pagination, EffectFade]}
                effect="fade"
                spaceBetween={0}
                slidesPerView={1}
                pagination={{ 
                    clickable: true, 
                    dynamicBullets: true,
                    el: '.swiper-pagination-custom',
                }}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="h-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <HeroSlide slide={slide} index={index} />
                    </SwiperSlide>
                ))}
            </Swiper>
            
            {/* Custom Navigation */}
            <div className="container mx-auto px-4">
                <div className="absolute left-4 right-4 bottom-1/2 z-10 flex justify-between pointer-events-none">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm 
                                border-white/20 text-white hover:bg-white/30 pointer-events-auto"
                        onClick={handlePrev}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm 
                                border-white/20 text-white hover:bg-white/30 pointer-events-auto"
                        onClick={handleNext}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>
            </div>
            
            {/* Custom Pagination */}
            <div className="swiper-pagination-custom container mx-auto absolute bottom-8 left-0 right-0 z-10 flex justify-center"></div>
            
            {/* Scroll Down Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/10 animate-bounce"
                    onClick={handleScrollToContent}
                >
                    <ChevronDown className="h-5 w-5" />
                </Button>
            </div>
        </section>
    );
};

export default HeroSlider; 