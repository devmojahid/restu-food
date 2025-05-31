import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Clock, 
    ChevronRight, 
    ChevronLeft,
    Star,
    ShoppingBag,
    Heart,
    Eye,
    BadgePercent
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const RecentlyViewed = ({ products = [] }) => {
    if (!products?.length) return null;
    
    return (
        <section className="py-16 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-between mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center"
                    >
                        <Clock className="w-6 h-6 mr-2 text-primary" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recently Viewed</h2>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Button variant="ghost" className="text-primary hover:text-primary">
                            Clear History
                        </Button>
                    </motion.div>
                </div>
                
                <div className="relative mt-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Swiper
                            slidesPerView={1.2}
                            spaceBetween={16}
                            autoplay={{
                                delay: 6000,
                                disableOnInteraction: false,
                            }}
                            navigation={{
                                nextEl: '.swiper-button-next-recent',
                                prevEl: '.swiper-button-prev-recent',
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 24,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 30,
                                },
                            }}
                            modules={[Autoplay, Navigation]}
                            className="recent-products-swiper"
                        >
                            {products.map((product, index) => (
                                <SwiperSlide key={product.id}>
                                    <RecentProductCard product={product} index={index} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        
                        <div className="swiper-button-prev-recent absolute top-1/2 -translate-y-1/2 left-0 z-10 -ml-4 lg:-ml-6">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-10 w-10 rounded-full shadow-lg bg-white dark:bg-gray-800 opacity-80 hover:opacity-100"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        </div>
                        
                        <div className="swiper-button-next-recent absolute top-1/2 -translate-y-1/2 right-0 z-10 -mr-4 lg:-mr-6">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-10 w-10 rounded-full shadow-lg bg-white dark:bg-gray-800 opacity-80 hover:opacity-100"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const RecentProductCard = ({ product, index }) => {
    const timeAgo = product.viewed_at ? formatDistanceToNow(new Date(product.viewed_at), { addSuffix: true }) : '';
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
        >
            <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                {/* Viewed time badge */}
                {timeAgo && (
                    <div className="absolute top-4 right-4 z-10">
                        <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-normal px-2 py-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {timeAgo}
                        </Badge>
                    </div>
                )}
                
                {/* Discount Badge */}
                {product.on_sale && (
                    <div className="absolute top-4 left-4 z-10">
                        <Badge variant="secondary" className="bg-red-500 text-white px-2 py-1 text-xs">
                            <BadgePercent className="w-3 h-3 mr-1" />
                            {product.discount_percentage}% Off
                        </Badge>
                    </div>
                )}
                
                {/* Product Image */}
                <div className="relative overflow-hidden pt-[80%]">
                    <Link href={`/shop/${product.slug}`}>
                        <img
                            src={product.image || '/images/placeholder.png'}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                    </Link>
                    
                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-10 w-10 rounded-full bg-white hover:bg-primary hover:text-white transition-colors"
                        >
                            <ShoppingBag className="h-5 w-5" />
                        </Button>
                        
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-10 w-10 rounded-full bg-white hover:bg-primary hover:text-white transition-colors"
                        >
                            <Heart className="h-5 w-5" />
                        </Button>
                        
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-10 w-10 rounded-full bg-white hover:bg-primary hover:text-white transition-colors"
                        >
                            <Eye className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {product.category}
                        </span>
                    </div>
                    
                    <Link href={`/shop/${product.slug}`} className="mb-1 hover:text-primary transition-colors">
                        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug">
                            {product.name}
                        </h3>
                    </Link>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-2">
                        <div className="flex items-center mr-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "w-3.5 h-3.5",
                                        i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                    )}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({product.reviews_count})
                        </span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-baseline mt-auto">
                        {product.on_sale ? (
                            <>
                                <span className="text-lg font-bold text-primary mr-2">
                                    ${product.sale_price.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    ${product.price.toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                ${product.price.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default RecentlyViewed; 