import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules';
import { 
    ArrowLeft, 
    ArrowRight, 
    ZoomIn, 
    Heart, 
    Share2, 
    ChevronLeft, 
    ChevronRight,
    Maximize
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

const ProductGallery = ({ product }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    
    // Default image if no images are provided
    const defaultImage = product.image || '/images/shop/products/placeholder.jpg';
    
    // Ensure we have an array of images
    const images = product.images?.length > 0 
        ? product.images 
        : [defaultImage];
    
    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.activeIndex);
    };
    
    const handleFullScreenToggle = () => {
        setIsFullScreen(!isFullScreen);
    };
    
    return (
        <>
            <div className="relative">
                {/* Main gallery */}
                <div className="mb-4 rounded-xl overflow-hidden">
                    <Swiper
                        modules={[Navigation, Pagination, Thumbs, Zoom]}
                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                        navigation={{
                            nextEl: '.gallery-next',
                            prevEl: '.gallery-prev',
                        }}
                        pagination={{
                            clickable: true,
                            el: '.gallery-pagination',
                        }}
                        zoom={true}
                        onSlideChange={handleSlideChange}
                        loop={images.length > 1}
                        className="aspect-square bg-gray-100 dark:bg-gray-800/50 rounded-xl"
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index} className="flex items-center justify-center">
                                <div className="swiper-zoom-container">
                                    <img 
                                        src={image} 
                                        alt={`${product.name} - Image ${index + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                        
                        {/* Custom navigation buttons */}
                        <div className="absolute inset-0 flex items-center justify-between pointer-events-none z-10 px-4">
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="gallery-prev h-10 w-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 shadow-sm pointer-events-auto"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="gallery-next h-10 w-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 shadow-sm pointer-events-auto"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="absolute top-4 right-4 z-10 flex space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 shadow-sm"
                                            onClick={handleFullScreenToggle}
                                        >
                                            <Maximize className="h-5 w-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>View fullscreen</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </Swiper>
                </div>
                
                {/* Pagination dots (visible on mobile) */}
                <div className="gallery-pagination flex justify-center mb-4 lg:hidden"></div>
                
                {/* Thumbnails (visible on desktop) */}
                {images.length > 1 && (
                    <div className="hidden lg:block">
                        <Swiper
                            modules={[Thumbs]}
                            watchSlidesProgress
                            onSwiper={setThumbsSwiper}
                            slidesPerView={4}
                            spaceBetween={10}
                            className="thumbnails-swiper"
                        >
                            {images.map((image, index) => (
                                <SwiperSlide key={index} className="cursor-pointer">
                                    <div className={cn(
                                        "h-20 rounded-md overflow-hidden border-2",
                                        activeIndex === index 
                                            ? "border-primary" 
                                            : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                                    )}>
                                        <img 
                                            src={image} 
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
                
                {/* Product badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                    {product.on_sale && (
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {product.discount_percentage}% OFF
                        </div>
                    )}
                    {product.is_new && (
                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            New
                        </div>
                    )}
                    {product.is_bestseller && (
                        <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Bestseller
                        </div>
                    )}
                </div>
            </div>
            
            {/* Fullscreen dialog */}
            <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
                <DialogContent className="max-w-5xl w-[90vw] h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{product.name}</DialogTitle>
                    </DialogHeader>
                    <div className="relative flex-1 h-full">
                        <Swiper
                            modules={[Navigation, Pagination, Zoom]}
                            navigation
                            pagination={{ clickable: true }}
                            zoom={{ maxRatio: 3 }}
                            initialSlide={activeIndex}
                            className="h-full"
                        >
                            {images.map((image, index) => (
                                <SwiperSlide key={index} className="flex items-center justify-center">
                                    <div className="swiper-zoom-container h-full">
                                        <img 
                                            src={image} 
                                            alt={`${product.name} - Image ${index + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-500">
                            <p>Click and drag to zoom, double-click to reset</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ProductGallery; 