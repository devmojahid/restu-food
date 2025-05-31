import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Star, 
    ChevronRight, 
    Heart, 
    ShoppingBag, 
    Check, 
    Clock, 
    Award,
    Truck,
    ShieldCheck,
    ArrowRight,
    Minus,
    Plus,
    Loader2,
    ThumbsUp,
    Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { useToast } from "@/Components/ui/use-toast";

// Countdown timer component
const CountdownTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState({});

    // Calculate time left function
    const calculateTimeLeft = () => {
        const difference = new Date(endTime) - new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        return () => clearTimeout(timer);
    }, [timeLeft, endTime]);

    return (
        <div className="flex justify-center md:justify-start space-x-4 mt-6">
            {['days', 'hours', 'minutes', 'seconds'].map(interval => (
                <div key={interval} className="flex flex-col items-center">
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl w-16 h-16 flex items-center justify-center mb-2">
                        <span className="text-2xl font-bold text-primary">
                            {timeLeft[interval] !== undefined ? timeLeft[interval] : 0}
                        </span>
                    </div>
                    <span className="text-xs uppercase text-gray-500 dark:text-gray-400">
                        {interval}
                    </span>
                </div>
            ))}
        </div>
    );
};

// Product Quantity selector component
const ProductQuantity = ({ quantity = 1, setQuantity, stock = 50 }) => {
    const handleIncrement = () => {
        if (quantity < stock) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 rounded-full"
                onClick={handleDecrement}
                disabled={quantity <= 1}
            >
                <Minus className="h-4 w-4" />
            </Button>
            
            <div className="w-12 text-center font-medium">
                {quantity}
            </div>
            
            <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 rounded-full"
                onClick={handleIncrement}
                disabled={quantity >= stock}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
};

const DealOfTheDay = ({ data = {} }) => {
    const { 
        title = "Deal of the Day", 
        product = null,
        endDate = new Date(Date.now() + 86400000).toISOString() // Default to 24 hours from now
    } = data;
    
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
    const { toast } = useToast();
    
    // Default product if none provided
    const defaultProduct = {
        id: 1,
        name: "Premium Wireless Noise-Cancelling Headphones",
        slug: "premium-wireless-headphones",
        description: "Experience crystal clear sound with our top-of-the-line noise-cancelling headphones. Perfect for travel, work, or relaxation.",
        price: 299.99,
        discount: 20,
        discounted_price: 239.99,
        rating: 4.8,
        reviews_count: 356,
        stock: 38,
        sold: 162,
        image: "https://placehold.co/800x600?text=Headphones",
        gallery: [
            "https://placehold.co/800x600?text=Headphones1",
            "https://placehold.co/800x600?text=Headphones2",
            "https://placehold.co/800x600?text=Headphones3"
        ],
        features: [
            "Active Noise Cancellation",
            "40-hour Battery Life",
            "Bluetooth 5.0 Connectivity",
            "Built-in Microphone",
            "Comfortable Over-ear Design"
        ],
        category: "Electronics"
    };
    
    const productData = product || defaultProduct;
    
    const handleAddToCart = () => {
        setIsAddingToCart(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsAddingToCart(false);
            toast({
                title: "Added to cart",
                description: `${productData.name} (${quantity}) has been added to your cart.`,
            });
        }, 1000);
    };
    
    const handleAddToWishlist = () => {
        setIsAddingToWishlist(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsAddingToWishlist(false);
            toast({
                title: "Added to wishlist",
                description: `${productData.name} has been added to your wishlist.`,
            });
        }, 800);
    };
    
    // Calculate stock percentage
    const stockPercentage = Math.round((productData.sold / (productData.sold + productData.stock)) * 100);

    return (
        <section id="deal-of-the-day" className="py-16 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-start justify-between mb-8">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 
                                     rounded-full text-sm font-medium mb-4"
                        >
                            <Clock className="h-4 w-4" />
                            <span>Limited Time Offer</span>
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
                    </div>
                    
                    <Link
                        href="/deals"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary/90 
                               font-semibold transition-colors group mt-4 md:mt-0"
                    >
                        <span>View All Deals</span>
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    {/* Product Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl aspect-[4/3]">
                            <img 
                                src={productData.image} 
                                alt={productData.name} 
                                className="w-full h-full object-contain p-6"
                            />
                            
                            {/* Discount Badge */}
                            {productData.discount > 0 && (
                                <div className="absolute top-6 left-6 bg-red-500 text-white font-bold 
                                            px-4 py-2 rounded-full flex items-center space-x-1 shadow-lg
                                            animate-pulse">
                                    <Tag className="h-4 w-4" />
                                    <span>-{productData.discount}% OFF</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Product Gallery Thumbnails */}
                        {productData.gallery && productData.gallery.length > 0 && (
                            <div className="flex justify-center mt-4 space-x-2">
                                {productData.gallery.map((image, index) => (
                                    <div 
                                        key={index} 
                                        className="w-16 h-16 rounded-lg overflow-hidden border-2 border-primary cursor-pointer hover:opacity-80 transition-opacity"
                                    >
                                        <img src={image} alt={`${productData.name} - ${index + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                    
                    {/* Product Details Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
                    >
                        <Badge variant="outline" className="bg-primary/10 text-primary mb-4">
                            {productData.category}
                        </Badge>
                        
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {productData.name}
                        </h3>
                        
                        <div className="flex items-center mb-4">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                        key={star}
                                        className={cn(
                                            "h-4 w-4",
                                            star <= productData.rating 
                                                ? "text-yellow-400 fill-yellow-400" 
                                                : "text-gray-300"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                ({productData.reviews_count} reviews)
                            </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {productData.description}
                        </p>
                        
                        {/* Price Section */}
                        <div className="flex items-baseline mb-6">
                            <span className="text-3xl font-bold text-primary mr-2">
                                ${productData.discounted_price ? productData.discounted_price.toFixed(2) : productData.price.toFixed(2)}
                            </span>
                            
                            {productData.discounted_price && (
                                <span className="text-xl text-gray-500 line-through">
                                    ${productData.price.toFixed(2)}
                                </span>
                            )}
                            
                            {productData.discount > 0 && (
                                <Badge className="ml-auto bg-red-500 text-white">
                                    {productData.discount}% OFF
                                </Badge>
                            )}
                        </div>
                        
                        {/* Countdown Timer */}
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Offer Ends In:
                            </h4>
                            <CountdownTimer endTime={endDate} />
                        </div>
                        
                        {/* Stock Progress */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Available: <span className="font-medium">{productData.stock}</span>
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Sold: <span className="font-medium">{productData.sold}</span>
                                </span>
                            </div>
                            <Progress value={stockPercentage} className="h-2" />
                        </div>
                        
                        {/* Features List */}
                        {productData.features && productData.features.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Key Features:
                                </h4>
                                <ul className="space-y-1">
                                    {productData.features.map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <Check className="h-4 w-4 text-green-500 mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {/* Product Actions */}
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                            <div className="flex-shrink-0">
                                <ProductQuantity 
                                    quantity={quantity} 
                                    setQuantity={setQuantity} 
                                    stock={productData.stock}
                                />
                            </div>
                            
                            <Button
                                className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-full"
                                size="lg"
                                onClick={handleAddToCart}
                                disabled={isAddingToCart || productData.stock === 0}
                            >
                                {isAddingToCart ? (
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                ) : (
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                )}
                                {productData.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 rounded-full"
                                onClick={handleAddToWishlist}
                                disabled={isAddingToWishlist}
                            >
                                {isAddingToWishlist ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Heart className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                        
                        {/* Shipping Info */}
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Truck className="h-4 w-4 mr-1 text-primary" />
                                <span>Free Shipping</span>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <ShieldCheck className="h-4 w-4 mr-1 text-primary" />
                                <span>Secure Payment</span>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <ThumbsUp className="h-4 w-4 mr-1 text-primary" />
                                <span>Quality Guarantee</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
                
                {/* CTA Button - View More Deals */}
                <div className="text-center mt-12">
                    <Link
                        href="/deals"
                        className="inline-flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 
                               text-primary px-8 py-4 rounded-full transition-colors group"
                    >
                        <span>View More Daily Deals</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default DealOfTheDay; 