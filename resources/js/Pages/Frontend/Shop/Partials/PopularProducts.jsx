import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Star, 
    ChevronRight,
    ShoppingBag,
    Heart,
    Eye,
    TrendingUp,
    Badge,
    Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge as UIBadge } from '@/Components/ui/badge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const ProductCard = ({ product, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative bg-white dark:bg-gray-800 rounded-xl 
                     border border-gray-200 dark:border-gray-700 
                     shadow-sm hover:shadow-md transition-all duration-300 
                     overflow-hidden"
        >
            {/* Product Image */}
            <div className="relative h-52 overflow-hidden">
                <Link href={`/shop/${product.slug}`}>
                    <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </Link>
                
                {/* Quick Action Buttons */}
                <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 
                             group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 
                                 hover:bg-primary hover:text-white shadow-sm"
                    >
                        <ShoppingBag className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 
                                 hover:bg-primary hover:text-white shadow-sm"
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 
                                 hover:bg-primary hover:text-white shadow-sm"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>

                {/* Sale Badge */}
                {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs 
                                 font-bold px-2 py-1 rounded-md">
                        {product.discount}% OFF
                    </div>
                )}
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

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star 
                            key={i} 
                            className={cn(
                                "w-3 h-3", 
                                i < Math.floor(product.rating) 
                                    ? "text-yellow-400 fill-yellow-400" 
                                    : "text-gray-300 dark:text-gray-600"
                            )} 
                        />
                    ))}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        ({product.reviews_count})
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
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
                    <Button 
                        size="sm" 
                        variant="ghost"
                        className="p-0 h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                    >
                        <ShoppingBag className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

const PopularProducts = ({ products = [] }) => {
    if (!products.length) return null;

    return (
        <section className="py-12 bg-gray-50 dark:bg-gray-900/30">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center mb-2">
                            <TrendingUp className="w-5 h-5 text-primary mr-2" />
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                Popular Products
                            </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            Our top-selling products that customers love
                        </p>
                    </div>
                    <Link 
                        href="/shop?sort=popular"
                        className="inline-flex items-center text-primary hover:text-primary/90 
                               font-medium transition-colors mt-4 md:mt-0 group"
                    >
                        <span>View All</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Mobile Swiper */}
                <div className="block md:hidden">
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={16}
                        slidesPerView={1.2}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            480: {
                                slidesPerView: 2.2,
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
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.slice(0, 4).map((product, index) => (
                        <ProductCard key={product.id || index} product={product} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularProducts; 