import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Award, 
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
import { Autoplay, Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { cn } from '@/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const FeaturedProducts = ({ products = [] }) => {
    if (!products?.length) return null;
    
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-3"
                    >
                        <Award className="w-4 h-4 mr-1.5" />
                        Featured Selection
                    </motion.div>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3"
                    >
                        Curated Premium Products
                    </motion.h2>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    >
                        Discover our handpicked selection of premium quality products, carefully curated by our expert team.
                    </motion.p>
                </div>
                
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="overflow-visible"
                    >
                        <Swiper
                            effect="coverflow"
                            grabCursor={true}
                            centeredSlides={true}
                            coverflowEffect={{
                                rotate: 0,
                                stretch: 0,
                                depth: 100,
                                modifier: 1,
                                slideShadows: false,
                            }}
                            initialSlide={1}
                            slidesPerView="auto"
                            spaceBetween={30}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                            }}
                            navigation={{
                                nextEl: '.swiper-button-next-featured',
                                prevEl: '.swiper-button-prev-featured',
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            breakpoints={{
                                320: {
                                    slidesPerView: 1,
                                    effect: 'slide',
                                },
                                640: {
                                    slidesPerView: 1.5,
                                    effect: 'coverflow',
                                },
                                768: {
                                    slidesPerView: 2,
                                    effect: 'coverflow',
                                },
                                1024: {
                                    slidesPerView: 2.5,
                                    effect: 'coverflow',
                                },
                                1280: {
                                    slidesPerView: 3,
                                    effect: 'coverflow',
                                },
                            }}
                            modules={[Autoplay, Navigation, Pagination, EffectCoverflow]}
                            className="featured-products-swiper py-12 overflow-visible"
                        >
                            {products.map((product, index) => (
                                <SwiperSlide key={product.id} className="max-w-md">
                                    <FeaturedProductCard product={product} index={index} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        
                        <div className="swiper-button-prev-featured absolute top-1/2 -translate-y-1/2 left-0 z-10 -ml-4 lg:-ml-6">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-10 w-10 rounded-full shadow-lg bg-white dark:bg-gray-800 opacity-80 hover:opacity-100"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        </div>
                        
                        <div className="swiper-button-next-featured absolute top-1/2 -translate-y-1/2 right-0 z-10 -mr-4 lg:-mr-6">
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
                
                <div className="mt-10 text-center">
                    <Link
                        href="/shop2?featured=true"
                        className="inline-flex items-center text-primary hover:underline text-lg font-medium"
                    >
                        View All Featured Products
                        <ChevronRight className="w-5 h-5 ml-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

const FeaturedProductCard = ({ product, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
        >
            <div className="absolute left-0 right-0 top-0 h-1/2 bg-gradient-to-b from-primary/10 to-transparent rounded-t-xl pointer-events-none"></div>
            
            <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                    <Badge variant="secondary" className="bg-primary text-white px-2 py-1 text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                    </Badge>
                    
                    {product.is_new && (
                        <Badge variant="secondary" className="bg-blue-500 text-white px-2 py-1 text-xs">
                            New
                        </Badge>
                    )}
                    
                    {product.is_bestseller && (
                        <Badge variant="secondary" className="bg-amber-500 text-white px-2 py-1 text-xs">
                            Bestseller
                        </Badge>
                    )}
                    
                    {product.on_sale && (
                        <Badge variant="secondary" className="bg-red-500 text-white px-2 py-1 text-xs">
                            <BadgePercent className="w-3 h-3 mr-1" />
                            {product.discount_percentage}% Off
                        </Badge>
                    )}
                </div>
                
                {/* Quick Actions */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-primary hover:text-white transition-colors"
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                    
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-primary hover:text-white transition-colors"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
                
                {/* Product Image */}
                <div className="relative overflow-hidden pt-[80%]">
                    <Link href={`/shop/${product.slug}`}>
                        <img
                            src={product.image || '/images/placeholder.png'}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                    </Link>
                </div>
                
                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm text-primary font-medium">
                            {product.category}
                        </span>
                        
                        <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-sm font-medium">
                                {product.rating.toFixed(1)}
                            </span>
                        </div>
                    </div>
                    
                    <Link href={`/shop/${product.slug}`} className="mb-2 hover:text-primary transition-colors">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                            {product.name}
                        </h3>
                    </Link>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {product.description}
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-baseline mb-5">
                        {product.on_sale ? (
                            <>
                                <span className="text-2xl font-bold text-primary mr-2">
                                    ${product.sale_price.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    ${product.price.toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                ${product.price.toFixed(2)}
                            </span>
                        )}
                    </div>
                    
                    {/* Add to Cart Button */}
                    <div className="mt-auto">
                        <Button 
                            className="w-full"
                            variant={product.in_stock ? "default" : "outline"}
                            disabled={!product.in_stock}
                            size="lg"
                        >
                            {product.in_stock ? (
                                <>
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    Add to Cart
                                </>
                            ) : (
                                "Out of Stock"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default FeaturedProducts; 