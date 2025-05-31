import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Heart, ShoppingBag, Eye, Tag, TrendingUp, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';

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
                <div className="relative h-48 overflow-hidden">
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.4 }}
                    />

                    {/* Trending Badge */}
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-1 
                                rounded-full text-xs font-bold flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>Trending</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col space-y-2">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm 
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            onClick={handleAddToWishlist}
                        >
                            <Heart className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm 
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                            <Eye className="h-4 w-4 text-gray-600" />
                        </Button>
                    </div>

                    {/* Quick Add to Cart Button */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            variant="default"
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white px-4 rounded-full"
                            onClick={handleAddToCart}
                        >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            <span>Add to Cart</span>
                        </Button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-grow">
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                            {product.category}
                        </Badge>
                        <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs ml-1 text-gray-600 dark:text-gray-300">
                                {product.rating} ({product.reviews_count || 0})
                            </span>
                        </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white 
                               mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
                        {product.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-lg font-bold text-primary">
                            ${product.price.toFixed(2)}
                        </span>
                        
                        <div className="text-xs text-gray-500 flex items-center">
                            <ShoppingBag className="h-3 w-3 mr-1" />
                            {product.orders_count || 0} orders
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
            <TrendingUp className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Trending Products</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            We're constantly monitoring what's popular. Check back soon for trending products!
        </p>
    </div>
);

const TrendingProducts = ({ data = {} }) => {
    const { 
        title = "Trending Products", 
        subtitle, 
        products = [], 
        categories = [] 
    } = data;
    
    const [activeTab, setActiveTab] = useState("all");

    // Generate tabs from categories
    const tabs = [
        { id: "all", label: "All Products" },
        ...(categories?.map(category => ({
            id: category.id.toString(),
            label: category.name
        })) || [])
    ];

    // Filter products by category
    const filteredProducts = activeTab === "all" 
        ? products 
        : products.filter(product => product.category_id.toString() === activeTab);

    if (!products.length) {
        return <EmptyState />;
    }

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center space-x-2 bg-orange-500/10 text-orange-500 px-3 py-1 
                                     rounded-full text-sm font-medium mb-4"
                        >
                            <TrendingUp className="h-4 w-4" />
                            <span>Hot & Trending</span>
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
                        href="/products?sort=trending"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary/90 
                               font-semibold transition-colors group mt-4 md:mt-0"
                    >
                        <span>View All</span>
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Category Tabs */}
                {tabs.length > 1 && (
                    <div className="mb-8">
                        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="w-full max-w-full overflow-x-auto pb-px no-scrollbar">
                                <div className="flex space-x-2">
                                    {tabs.map(tab => (
                                        <TabsTrigger 
                                            key={tab.id} 
                                            value={tab.id}
                                            className="rounded-full"
                                        >
                                            {tab.label}
                                        </TabsTrigger>
                                    ))}
                                </div>
                            </TabsList>
                            
                            {/* Content */}
                            <TabsContent value={activeTab} className="mt-6">
                                {filteredProducts.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No products found in this category.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {filteredProducts.map((product, index) => (
                                            <ProductCard key={product.id} product={product} index={index} />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
                
                {/* Products Grid - shown if no tabs */}
                {tabs.length <= 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>
                )}

                {/* View All - Mobile Only */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/products?sort=trending"
                        className="inline-flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 
                               text-primary px-6 py-3 rounded-full transition-colors"
                    >
                        <span>View All Trending Products</span>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts; 