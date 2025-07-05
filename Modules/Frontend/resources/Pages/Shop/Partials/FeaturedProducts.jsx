import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Star, ShoppingBag, Heart, Eye, Badge, Tag, Flame } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge as UIBadge } from '@/Components/ui/badge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { cn } from '@/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const ProductCard = ({ product, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md 
                     hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
        >
            {/* Sale badge */}
            {product.on_sale && (
                <div className="absolute top-4 left-4 z-10">
                    <UIBadge variant="destructive" className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {product.discount_percentage}% OFF
                    </UIBadge>
                </div>
            )}
            
            {/* Bestseller badge */}
            {product.is_bestseller && !product.on_sale && (
                <div className="absolute top-4 left-4 z-10">
                    <UIBadge variant="default" className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        Bestseller
                    </UIBadge>
                </div>
            )}
            
            {/* New badge */}
            {product.is_new && !product.is_bestseller && !product.on_sale && (
                <div className="absolute top-4 left-4 z-10">
                    <UIBadge variant="secondary" className="flex items-center gap-1">
                        <Badge className="w-3 h-3" />
                        New
                    </UIBadge>
                </div>
            )}
            
            {/* Product image */}
            <Link href={`/shop/${product.slug}`} className="block relative overflow-hidden pt-[100%]">
                <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transform 
                             group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Quick action buttons */}
                <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 
                              group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full shadow-md bg-white dark:bg-gray-800 
                                 hover:bg-primary hover:text-white"
                    >
                        <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full shadow-md bg-white dark:bg-gray-800
                                 hover:bg-primary hover:text-white"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>
                
                {/* Add to cart button (appears on hover) */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full 
                              group-hover:translate-y-0 transition-transform">
                    <Button
                        variant="default"
                        className="w-full rounded-none py-6 flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                    </Button>
                </div>
            </Link>
            
            {/* Product details */}
            <div className="p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {product.category}
                </div>
                <Link href={`/shop/${product.slug}`} className="block">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white
                                 mb-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center mb-3">
                    <div className="flex items-center text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                        ({product.reviews_count} reviews)
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {product.on_sale ? (
                            <>
                                <span className="text-xl font-bold text-primary">
                                    ${product.sale_price}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    ${product.price}
                                </span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-primary">
                                ${product.price}
                            </span>
                        )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {product.in_stock ? (
                            <span className="text-green-600 dark:text-green-400">In Stock</span>
                        ) : (
                            <span className="text-red-600 dark:text-red-400">Out of Stock</span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const FeaturedProducts = ({ products }) => {
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);
    
    return (
        <section id="shop-content" className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
                        >
                            Featured Products
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-600 dark:text-gray-400 max-w-2xl"
                        >
                            Discover our handpicked selection of premium products
                        </motion.p>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <Button
                            ref={prevButtonRef}
                            variant="outline"
                            size="icon"
                            className="rounded-full hover:bg-primary hover:text-white"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                            ref={nextButtonRef}
                            variant="outline"
                            size="icon"
                            className="rounded-full hover:bg-primary hover:text-white"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                        <Link 
                            href="/shop" 
                            className="hidden md:inline-flex items-center text-primary hover:text-primary/90 
                                   font-medium transition-colors"
                        >
                            <span>View All</span>
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </div>
                
                <Swiper
                    modules={[Autoplay, Navigation]}
                    spaceBetween={24}
                    slidesPerView={1}
                    navigation={{
                        prevEl: prevButtonRef.current,
                        nextEl: nextButtonRef.current,
                    }}
                    onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevButtonRef.current;
                        swiper.params.navigation.nextEl = nextButtonRef.current;
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
                        1280: {
                            slidesPerView: 4,
                        },
                    }}
                    className="mt-8"
                >
                    {products.map((product, index) => (
                        <SwiperSlide key={product.id}>
                            <ProductCard product={product} index={index} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                
                <div className="mt-8 text-center md:hidden">
                    <Link 
                        href="/shop"
                        className="inline-flex items-center text-primary hover:text-primary/90 
                               font-medium transition-colors"
                    >
                        <span>View All Products</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts; 