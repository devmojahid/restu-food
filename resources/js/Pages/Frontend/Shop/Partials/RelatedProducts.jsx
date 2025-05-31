import React from 'react';
import { motion } from 'framer-motion';
import { 
    Heart, 
    ShoppingBag, 
    Star, 
    Eye,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RelatedProducts = ({ products = [] }) => {
    const { toast } = useToast();
    
    // Skip rendering if no products are provided
    if (!products || products.length === 0) return null;
    
    const handleAddToCart = (product) => {
        toast({
            title: "Added to Cart",
            description: (
                <div className="flex items-center gap-2">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                    <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">Added to your cart</p>
                    </div>
                </div>
            ),
        });
    };
    
    const handleWishlistToggle = (product) => {
        toast({
            title: "Added to Wishlist",
            description: `${product.name} has been added to your wishlist`,
        });
    };
    
    // Product card component
    const ProductCard = ({ product }) => {
        const formattedPrice = (price) => {
            return parseFloat(price).toFixed(2);
        };
        
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col"
            >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                    <Link href={`/shop/${product.slug}`}>
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>
                    
                    {/* Product Badges */}
                    <div className="absolute top-2 left-2 flex flex-col space-y-1">
                        {product.on_sale && (
                            <Badge variant="destructive">
                                {product.discount_percentage}% OFF
                            </Badge>
                        )}
                        {product.is_new && (
                            <Badge variant="default" className="bg-blue-500">
                                New
                            </Badge>
                        )}
                        {product.is_bestseller && (
                            <Badge variant="default" className="bg-amber-500">
                                Bestseller
                            </Badge>
                        )}
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full shadow-md"
                            onClick={() => handleWishlistToggle(product)}
                        >
                            <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full shadow-md"
                            asChild
                        >
                            <Link href={`/shop/${product.slug}`}>
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
                
                {/* Product Content */}
                <div className="p-4 flex-1 flex flex-col">
                    {/* Category */}
                    <Link 
                        href={`/shop?category=${encodeURIComponent(product.category)}`}
                        className="text-xs text-primary hover:underline mb-1"
                    >
                        {product.category}
                    </Link>
                    
                    {/* Product Name */}
                    <Link 
                        href={`/shop/${product.slug}`}
                        className="text-lg font-semibold mb-2 hover:text-primary transition-colors line-clamp-2"
                    >
                        {product.name}
                    </Link>
                    
                    {/* Rating */}
                    {product.rating && (
                        <div className="flex items-center mb-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={cn(
                                            "w-4 h-4",
                                            star <= product.rating 
                                                ? "text-yellow-400 fill-yellow-400" 
                                                : "text-gray-300 dark:text-gray-600"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                ({product.reviews_count || 0})
                            </span>
                        </div>
                    )}
                    
                    {/* Price */}
                    <div className="flex items-center space-x-2 mt-auto">
                        <span className="text-lg font-semibold">
                            ${formattedPrice(product.on_sale ? (product.sale_price || product.price * (1 - product.discount_percentage / 100)) : product.price)}
                        </span>
                        
                        {product.on_sale && (
                            <span className="text-sm text-gray-500 line-through">
                                ${formattedPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>
                
                {/* Add to Cart Button */}
                <div className="p-4 pt-0">
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.in_stock}
                    >
                        {product.in_stock ? (
                            <>
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Add to Cart
                            </>
                        ) : (
                            "Out of Stock"
                        )}
                    </Button>
                </div>
            </motion.div>
        );
    };
    
    return (
        <div className="relative">
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={1}
                navigation={{
                    nextEl: '.related-next',
                    prevEl: '.related-prev',
                }}
                pagination={{
                    clickable: true,
                    el: '.related-pagination',
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
                className="pb-12"
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id}>
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
                
                {/* Custom navigation buttons */}
                <Button 
                    variant="outline" 
                    size="icon"
                    className="related-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 shadow-sm -translate-x-1/2 hidden md:flex"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button 
                    variant="outline" 
                    size="icon"
                    className="related-next absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 shadow-sm translate-x-1/2 hidden md:flex"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </Swiper>
            
            {/* Pagination dots */}
            <div className="related-pagination flex justify-center"></div>
        </div>
    );
};

export default RelatedProducts; 