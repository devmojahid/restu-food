import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { 
    Star, 
    ShoppingCart, 
    Heart, 
    Bookmark,
    ChevronRight,
    TrendingUp,
    EyeIcon,
    Award
} from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger 
} from '@/Components/ui/tooltip';

const PopularProducts = ({ products = [] }) => {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                Popular Products
                            </h2>
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
                            Discover our most popular products loved by customers
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

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.slice(0, 4).map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
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
            className="group bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md 
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
                    
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            {product.discount}% OFF
                        </Badge>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Add to wishlist</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                                        <Bookmark className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Save for later</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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
                                {product.rating} ({product.reviews_count})
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
                        
                        <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent text-primary hover:text-primary/80">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            <span className="text-xs">Add</span>
                        </Button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default PopularProducts; 