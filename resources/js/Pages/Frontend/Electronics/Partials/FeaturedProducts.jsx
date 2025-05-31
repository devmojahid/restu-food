import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Heart, ShoppingBag, Eye, Tag, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const ProductCard = ({ product, index }) => {
    const [isHovered, setIsHovered] = useState(false);

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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl 
                     transition-all duration-300 overflow-hidden h-full"
        >
            <Link href={`/products/${product.slug}`} className="block h-full flex flex-col">
                {/* Product Image */}
                <div className="relative h-56 overflow-hidden">
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.4 }}
                    />

                    {/* Discount Badge */}
                    {product.discount > 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 
                                    rounded-full text-xs font-bold flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            <span>-{product.discount}%</span>
                        </div>
                    )}

                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4 bg-primary text-white px-2 py-1 
                                rounded-full text-xs font-bold">
                        Featured
                    </div>

                    {/* Action Buttons - Appear on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex space-x-2">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-10 w-10 rounded-full bg-white shadow-md 
                                      hover:bg-primary hover:text-white transition-colors"
                                onClick={handleAddToWishlist}
                            >
                                <Heart className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="default"
                                className="bg-primary hover:bg-primary/90 text-white rounded-full"
                                onClick={handleAddToCart}
                            >
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                <span>Add to Cart</span>
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-10 w-10 rounded-full bg-white shadow-md 
                                      hover:bg-primary hover:text-white transition-colors"
                            >
                                <Eye className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Gradient Overlay - Appears on hover */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-grow">
                    {/* Category */}
                    <div className="mb-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                            {product.category}
                        </Badge>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 
                               group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star}
                                    className={cn(
                                        "h-4 w-4",
                                        star <= product.rating 
                                            ? "text-yellow-400 fill-yellow-400" 
                                            : "text-gray-300"
                                    )}
                                />
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            ({product.reviews_count || 0})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center mt-auto">
                        <span className="text-xl font-bold text-primary">
                            ${product.discounted_price ? product.discounted_price.toFixed(2) : product.price.toFixed(2)}
                        </span>

                        {product.discounted_price && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                                ${product.price.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const EmptyState = () => (
    <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Tag className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Featured Products</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            We're constantly updating our featured products. Check back soon for great deals!
        </p>
    </div>
);

const FeaturedProducts = ({ data = {} }) => {
    const { title = "Featured Products", subtitle, products = [] } = data;
    
    if (!products.length) {
        return <EmptyState />;
    }

    return (
        <section id="featured-section" className="py-16">
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
                            <ArrowUpRight className="h-4 w-4" />
                            <span>Top Picks</span>
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
                        href="/products?featured=1"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary/90 
                               font-semibold transition-colors group mt-4 md:mt-0"
                    >
                        <span>View All Featured Products</span>
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>

                {/* View All - Mobile Only */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/products?featured=1"
                        className="inline-flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 
                               text-primary px-6 py-3 rounded-full transition-colors"
                    >
                        <span>View All Featured Products</span>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts; 