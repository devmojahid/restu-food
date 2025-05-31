import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    ChevronRight, 
    Sparkles,
    Clock,
    ShoppingBag,
    Heart,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { format, parseISO } from 'date-fns';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const ProductCard = ({ product, index }) => {
    // Calculate days since launch
    const daysSinceLaunch = product.created_at ? 
        Math.floor((new Date() - new Date(product.created_at)) / (1000 * 60 * 60 * 24)) : 0;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative bg-white dark:bg-gray-800 rounded-xl 
                     border border-gray-200 dark:border-gray-700 
                     shadow-sm hover:shadow-md transition-all duration-300 
                     overflow-hidden h-full"
        >
            {/* Product Image */}
            <div className="relative h-52 md:h-64 overflow-hidden">
                <Link href={`/shop/${product.slug}`}>
                    <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>
                
                {/* New Badge */}
                <div className="absolute top-2 left-2 bg-primary text-white text-xs 
                             font-bold px-2 py-1 rounded-md flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    New
                </div>

                {/* Days Since Launch */}
                {daysSinceLaunch <= 30 && (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs 
                                 font-medium px-2 py-1 rounded-md flex items-center backdrop-blur-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {daysSinceLaunch === 0 ? 'Just added today' : `${daysSinceLaunch} days ago`}
                    </div>
                )}

                {/* Quick Actions */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 
                             to-transparent pt-10 pb-4 px-4 translate-y-full 
                             group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <Button 
                            size="sm"
                            className="rounded-full bg-white text-gray-900 hover:bg-primary 
                                    hover:text-white transition-colors duration-300"
                        >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Add to Cart
                        </Button>
                        <Button 
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/20 text-white 
                                    hover:bg-white hover:text-primary transition-colors"
                        >
                            <Heart className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <Link href={`/shop/${product.slug}`} className="block">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white 
                                mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>
                
                {product.category && (
                    <Link 
                        href={`/shop?category=${product.category.slug}`}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary 
                                 dark:hover:text-primary mb-2 inline-block transition-colors"
                    >
                        {product.category.name}
                    </Link>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-lg font-bold text-primary">
                            ${product.price.toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                                ${(product.price * (1 + product.discount/100)).toFixed(2)}
                            </span>
                        )}
                    </div>
                    
                    {/* Time */}
                    {product.created_at && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {format(parseISO(product.created_at), 'MMM d, yyyy')}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const NewArrivals = ({ products = [] }) => {
    if (!products.length) return null;

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center mb-2">
                            <Sparkles className="w-5 h-5 text-primary mr-2" />
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                New Arrivals
                            </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            Check out our latest products fresh from the shelves
                        </p>
                    </div>
                    <Link 
                        href="/shop?sort=newest"
                        className="inline-flex items-center text-primary hover:text-primary/90 
                               font-medium transition-colors mt-4 md:mt-0 group"
                    >
                        <span>View All</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Products Slider */}
                <div className="relative">
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={20}
                        slidesPerView={1.2}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            480: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 3,
                            },
                            1024: {
                                slidesPerView: 4,
                            },
                        }}
                        className="!overflow-visible"
                    >
                        {products.map((product, index) => (
                            <SwiperSlide key={product.id || index}>
                                <ProductCard product={product} index={index} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <div className="hidden md:block">
                        <button className="swiper-button-prev absolute top-1/2 -left-4 z-10 transform -translate-y-1/2
                                      w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md 
                                      flex items-center justify-center group focus:outline-none">
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 
                                          group-hover:text-primary transition-colors" />
                        </button>
                        <button className="swiper-button-next absolute top-1/2 -right-4 z-10 transform -translate-y-1/2
                                      w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md 
                                      flex items-center justify-center group focus:outline-none">
                            <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-400 
                                           group-hover:text-primary transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewArrivals; 