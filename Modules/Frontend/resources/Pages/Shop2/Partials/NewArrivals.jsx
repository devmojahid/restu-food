import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { 
    ChevronRight, 
    ChevronLeft,
    Sparkles,
    Star,
    ShoppingBag,
    Calendar,
    Clock
} from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const NewArrivals = ({ products = [] }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="py-12">
            <div className="container px-4 mx-auto relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                New Arrivals
                            </h2>
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
                            Check out our latest products added to our collection
                        </p>
                    </motion.div>

                    <Link 
                        href="/shop"
                        className="inline-flex items-center text-primary hover:text-primary/90 
                              font-semibold transition-colors group mt-4 md:mt-0"
                    >
                        <span>View All</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="relative">
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={16}
                        slidesPerView={isMobile ? 1.2 : 4}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
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
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 3,
                            },
                            1024: {
                                slidesPerView: 4,
                            },
                        }}
                        className="py-8"
                    >
                        {products.map((product, index) => (
                            <SwiperSlide key={product.id}>
                                <ProductCard product={product} index={index} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <div className="swiper-button-prev !hidden md:!flex !w-10 !h-10 !rounded-full bg-white dark:bg-gray-800 shadow-md !text-gray-800 dark:!text-white hover:!bg-primary hover:!text-white transition-colors after:!text-[0]">
                        <ChevronLeft className="w-5 h-5" />
                    </div>
                    <div className="swiper-button-next !hidden md:!flex !w-10 !h-10 !rounded-full bg-white dark:bg-gray-800 shadow-md !text-gray-800 dark:!text-white hover:!bg-primary hover:!text-white transition-colors after:!text-[0]">
                        <ChevronRight className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </section>
    );
};

const ProductCard = ({ product, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg 
                     transition-all duration-300 overflow-hidden border border-gray-100 
                     dark:border-gray-700 h-full flex flex-col"
        >
            <Link 
                href={`/shop/${product.slug}`}
                className="flex-1 flex flex-col"
            >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
                    <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* New Arrival Badge */}
                    <Badge className="absolute top-2 left-2 bg-primary hover:bg-primary/90">
                        New Arrival
                    </Badge>

                    {/* Release Date */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <div className="flex items-center gap-1 text-white text-xs">
                            <Calendar className="h-3 w-3" />
                            <span>Added {product.release_date || '3 days ago'}</span>
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-2 flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                            {product.category}
                        </Badge>
                        <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs ml-1 text-gray-600 dark:text-gray-400">
                                {product.rating || '4.5'}
                            </span>
                        </div>
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2 flex-1">
                        {product.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                ${product.price}
                            </span>
                            {product.discount > 0 && (
                                <span className="text-sm text-gray-500 line-through">
                                    ${(product.price * (100 + product.discount) / 100).toFixed(2)}
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Limited time</span>
                        </div>
                    </div>

                    <Button 
                        variant="secondary" 
                        className="w-full mt-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                    </Button>
                </div>
            </Link>
        </motion.div>
    );
};

export default NewArrivals; 