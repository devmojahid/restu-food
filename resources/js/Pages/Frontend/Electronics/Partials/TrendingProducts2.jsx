import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    ChevronRight, 
    Heart, 
    ShoppingBag, 
    Eye, 
    Tag, 
    ArrowUpRight,
    TrendingUp,
    ThumbsUp,
    Sparkles,
    Flame,
    Clock,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { useToast } from "@/Components/ui/use-toast";

const ProductCard = ({ product, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { toast } = useToast();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAddingToCart(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsAddingToCart(false);
            toast({
                title: "Added to cart",
                description: `${product.name} has been added to your cart.`,
            });
        }, 800);
    };

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAddingToWishlist(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsAddingToWishlist(false);
            toast({
                title: "Added to wishlist",
                description: `${product.name} has been added to your wishlist.`,
            });
        }, 800);
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toast({
            title: "Quick view",
            description: `Quick view for ${product.name}`,
        });
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
            {/* Product Image */}
            <div className="relative h-56 overflow-hidden">
                <Link href={`/products/${product.slug}`}>
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.4 }}
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {product.discount > 0 && (
                        <Badge variant="outline" className="bg-red-500 text-white border-none">
                            <Tag className="h-3 w-3 mr-1" />
                            <span>-{product.discount}%</span>
                        </Badge>
                    )}
                    
                    {product.isNew && (
                        <Badge variant="outline" className="bg-blue-500 text-white border-none">
                            <Sparkles className="h-3 w-3 mr-1" />
                            <span>New</span>
                        </Badge>
                    )}
                    
                    {product.isBestSeller && (
                        <Badge variant="outline" className="bg-amber-500 text-white border-none">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>Best Seller</span>
                        </Badge>
                    )}
                </div>

                {/* Action Buttons - Appear on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-10 w-10 rounded-full bg-white shadow-md 
                                              hover:bg-primary hover:text-white transition-colors"
                                        onClick={handleAddToWishlist}
                                        disabled={isAddingToWishlist}
                                    >
                                        {isAddingToWishlist ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <Heart className="h-5 w-5" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Add to Wishlist</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="default"
                                        className="bg-primary hover:bg-primary/90 text-white rounded-full"
                                        onClick={handleAddToCart}
                                        disabled={isAddingToCart}
                                    >
                                        {isAddingToCart ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <ShoppingBag className="h-4 w-4 mr-2" />
                                        )}
                                        <span>Add to Cart</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Add to Cart</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-10 w-10 rounded-full bg-white shadow-md 
                                              hover:bg-primary hover:text-white transition-colors"
                                        onClick={handleQuickView}
                                    >
                                        <Eye className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Quick View</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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
                <Link href={`/products/${product.slug}`}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 
                               group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>

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
            We're constantly updating our trending products. Check back soon for popular items!
        </p>
    </div>
);

const TrendingProducts = ({ data = {} }) => {
    const { 
        title = "Trending Products", 
        subtitle = "Discover our most popular products that customers are loving right now",
        categories = [],
        products = {}
    } = data;
    
    // Default categories and products if none provided
    const defaultCategories = [
        { id: 'all', name: 'All Products', icon: Sparkles },
        { id: 'popular', name: 'Popular', icon: ThumbsUp },
        { id: 'new', name: 'New Arrivals', icon: Clock },
        { id: 'sale', name: 'On Sale', icon: Tag },
        { id: 'trending', name: 'Trending', icon: TrendingUp },
        { id: 'hot', name: 'Hot Deals', icon: Flame },
    ];
    
    const displayCategories = categories.length > 0 ? categories : defaultCategories;
    
    const defaultProducts = {
        all: [
            {
                id: 1,
                name: 'Modern Ergonomic Chair',
                slug: 'modern-ergonomic-chair',
                category: 'Furniture',
                price: 149.99,
                discount: 15,
                discounted_price: 127.49,
                rating: 4.5,
                reviews_count: 128,
                image: 'https://placehold.co/600x400?text=Chair',
                isNew: false,
                isBestSeller: true
            },
            {
                id: 2,
                name: 'Wireless Bluetooth Earbuds',
                slug: 'wireless-bluetooth-earbuds',
                category: 'Electronics',
                price: 79.99,
                discount: 0,
                rating: 4.8,
                reviews_count: 256,
                image: 'https://placehold.co/600x400?text=Earbuds',
                isNew: true,
                isBestSeller: false
            },
            {
                id: 3,
                name: 'Smart Watch Series X',
                slug: 'smart-watch-series-x',
                category: 'Electronics',
                price: 199.99,
                discount: 10,
                discounted_price: 179.99,
                rating: 4.7,
                reviews_count: 198,
                image: 'https://placehold.co/600x400?text=SmartWatch',
                isNew: true,
                isBestSeller: true
            },
            {
                id: 4,
                name: 'Ultra HD 4K Monitor',
                slug: 'ultra-hd-4k-monitor',
                category: 'Electronics',
                price: 349.99,
                discount: 0,
                rating: 4.6,
                reviews_count: 87,
                image: 'https://placehold.co/600x400?text=Monitor',
                isNew: false,
                isBestSeller: false
            }
        ]
    };
    
    // Ensure all categories have product arrays
    const normalizedProducts = Object.keys(products).length > 0 ? products : defaultProducts;
    
    // Fill missing categories with all products or empty arrays
    displayCategories.forEach(category => {
        if (!normalizedProducts[category.id]) {
            normalizedProducts[category.id] = normalizedProducts.all || [];
        }
    });
    
    const [activeTab, setActiveTab] = useState(displayCategories[0]?.id || 'all');
    
    if (!displayCategories.length) {
        return <EmptyState />;
    }

    return (
        <section id="trending-products" className="py-16 bg-gray-50 dark:bg-gray-900/50">
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
                            <TrendingUp className="h-4 w-4" />
                            <span>What's Hot</span>
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
                        href="/products"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary/90 
                               font-semibold transition-colors group mt-4 md:mt-0"
                    >
                        <span>View All Products</span>
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Tabs for Categories */}
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-10">
                    <TabsList className="bg-white dark:bg-gray-800 p-1 overflow-x-auto flex flex-nowrap max-w-full">
                        {displayCategories.map(category => {
                            const Icon = category.icon || Sparkles;
                            return (
                                <TabsTrigger 
                                    key={category.id} 
                                    value={category.id}
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-2.5 whitespace-nowrap"
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    <span>{category.name}</span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                    
                    {/* Tab Contents */}
                    {displayCategories.map(category => {
                        const categoryProducts = normalizedProducts[category.id] || [];
                        
                        return (
                            <TabsContent key={category.id} value={category.id} className="mt-6">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={category.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                    >
                                        {Array.isArray(categoryProducts) && categoryProducts.length > 0 ? (
                                            categoryProducts.map((product, index) => (
                                                <ProductCard key={product.id} product={product} index={index} />
                                            ))
                                        ) : (
                                            <div className="col-span-full">
                                                <EmptyState />
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </TabsContent>
                        );
                    })}
                </Tabs>

                {/* View All - Mobile Only */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/products"
                        className="inline-flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 
                               text-primary px-6 py-3 rounded-full transition-colors"
                    >
                        <span>View All Products</span>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;