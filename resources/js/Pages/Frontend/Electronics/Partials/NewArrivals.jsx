import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Heart, ShoppingBag, Sparkles, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductCard = ({ product, index }) => {
    const handleAddToCart = (e) => {
        e.preventDefault();
        // Add to cart functionality would go here
        console.log('Adding to cart:', product);
    };

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        // Add to wishlist functionality would go here
        console.log('Adding to wishlist:', product);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl 
                     transition-all duration-300 overflow-hidden"
        >
            <Link href={`/products/${product.slug}`} className="block">
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* New Badge */}
                    <div className="absolute top-4 left-4 bg-primary text-white px-2 py-1 
                                rounded-full text-xs font-bold flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        <span>NEW</span>
                    </div>

                    {/* Date Badge */}
                    {product.release_date && (
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white 
                                     px-2 py-1 rounded-full text-xs font-medium flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{product.release_date}</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm 
                                   hover:bg-white transition-colors"
                            onClick={handleAddToWishlist}
                        >
                            <Heart className="h-4 w-4 text-gray-600" />
                        </Button>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Add to Cart Button - Appears on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            variant="default"
                            className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 transform 
                                    translate-y-8 group-hover:translate-y-0 transition-transform duration-300"
                            onClick={handleAddToCart}
                        >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            <span>Add to Cart</span>
                        </Button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 
                               group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {product.description}
                    </p>

                    {/* Price and Rating */}
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                            ${product.price.toFixed(2)}
                        </span>
                        
                        <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                                {product.rating}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const EmptyState = () => (
    <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No New Arrivals</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            We're constantly adding new products to our catalog. Check back soon for the latest arrivals!
        </p>
    </div>
);

const NewArrivals = ({ data = {} }) => {
    const { title = "New Arrivals", subtitle, products = [] } = data;
    
    if (!products.length) {
        return <EmptyState />;
    }

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 
                                     rounded-full text-sm font-medium mb-4"
                        >
                            <Sparkles className="h-4 w-4" />
                            <span>Just Launched</span>
                        </motion.div>
                        
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
                        >
                            {title}
                        </motion.h2>
                        
                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-600 dark:text-gray-400 max-w-2xl"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </div>

                    <Link
                        href="/products?sort=newest"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary/90 
                               font-semibold transition-colors group mt-4 md:mt-0"
                    >
                        <span>View All New Products</span>
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Products Display - Carousel on Mobile, Grid on Larger Screens */}
                <div className="block md:hidden"> {/* Mobile Carousel */}
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={16}
                        slidesPerView={1.2}
                        centeredSlides={false}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        className="pb-12"
                    >
                        {products.map((product, index) => (
                            <SwiperSlide key={product.id}>
                                <ProductCard product={product} index={index} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.slice(0, 8).map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>

                {/* View All - Mobile Only */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/products?sort=newest"
                        className="inline-flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 
                               text-primary px-6 py-3 rounded-full transition-colors"
                    >
                        <span>View All New Arrivals</span>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NewArrivals; 