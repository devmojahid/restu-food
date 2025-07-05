import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Clock, ShoppingBag, Check, Star, 
    ChevronRight, Plus, Minus, Heart, 
    Flame, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';

const CountdownTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const end = new Date(endTime);
            const difference = end - now;
            
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };
        
        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        
        return () => clearInterval(timer);
    }, [endTime]);
    
    return (
        <div className="flex space-x-2 sm:space-x-4">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                    <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {value.toString().padStart(2, '0')}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                        {unit}
                    </span>
                </div>
            ))}
        </div>
    );
};

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
                className="h-8 w-8 rounded-md"
                onClick={handleDecrement}
                disabled={quantity <= 1}
            >
                <Minus className="h-4 w-4" />
            </Button>
            
            <div className="h-8 w-12 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <span className="text-sm">{quantity}</span>
            </div>
            
            <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-md"
                onClick={handleIncrement}
                disabled={quantity >= stock}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
};

const DealOfTheDay = ({ data = {} }) => {
    const { title = "Deal of the Day", product = null, endTime = null } = data;
    const [quantity, setQuantity] = useState(1);
    
    // If no product, show empty state
    if (!product) {
        return (
            <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Flame className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        No deal available at the moment. Please check back later for amazing offers!
                    </p>
                </div>
            </section>
        );
    }

    // Default end time if not provided
    const defaultEndTime = new Date();
    defaultEndTime.setDate(defaultEndTime.getDate() + 1);
    
    // Calculate discount percentage
    const discountPercentage = product.discount || 0;
    const originalPrice = product.price;
    const discountedPrice = originalPrice - (originalPrice * (discountPercentage / 100));
    
    // Calculate stock percentage
    const stockPercentage = (product.stock_quantity / product.initial_stock) * 100;
    
    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
                    {/* Product Image */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl overflow-hidden"
                        >
                            {/* Discount Badge */}
                            <div className="absolute top-6 left-6 z-10">
                                <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-1">
                                    <Flame className="h-4 w-4" />
                                    <span className="font-bold">{discountPercentage}% OFF</span>
                                </div>
                            </div>
                            
                            {/* Image */}
                            <div className="relative h-80 flex items-center justify-center">
                                <motion.img
                                    src={product.image}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain"
                                    initial={{ y: 20 }}
                                    whileInView={{ y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ 
                                        duration: 1,
                                        type: "spring",
                                        bounce: 0.4
                                    }}
                                />
                                
                                {/* Animated Glow Effect */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl"
                                        animate={{ 
                                            scale: [1, 1.05, 1],
                                            opacity: [0.5, 0.8, 0.5]
                                        }}
                                        transition={{ 
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                </div>
                            </div>
                            
                            {/* Features List */}
                            {product.key_features && (
                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    {product.key_features.slice(0, 4).map((feature, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className="mt-0.5 bg-primary/10 text-primary p-1 rounded-full">
                                                <Check className="h-3 w-3" />
                                            </div>
                                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            {/* Badge & Title */}
                            <div>
                                <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 
                                             rounded-full text-sm font-medium mb-4">
                                    <Zap className="h-4 w-4" />
                                    <span>{title}</span>
                                </div>
                                
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                    {product.name}
                                </h2>
                                
                                {/* Rating */}
                                <div className="flex items-center mt-3">
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                                key={star}
                                                className={cn(
                                                    "h-5 w-5",
                                                    star <= product.rating 
                                                        ? "text-yellow-400 fill-yellow-400" 
                                                        : "text-gray-300"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                        ({product.reviews_count} reviews)
                                    </span>
                                </div>
                            </div>
                            
                            {/* Price */}
                            <div className="flex items-center space-x-3">
                                <span className="text-3xl font-bold text-primary">
                                    ${discountedPrice.toFixed(2)}
                                </span>
                                {discountPercentage > 0 && (
                                    <span className="text-lg text-gray-500 line-through">
                                        ${originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            
                            {/* Description */}
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {product.description}
                            </p>
                            
                            {/* Stock Status */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Availability: <span className="text-primary font-medium">In Stock</span>
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Sold: {product.initial_stock - product.stock_quantity} / {product.initial_stock}
                                    </span>
                                </div>
                                <Progress value={stockPercentage} className="h-2" />
                            </div>
                            
                            {/* Countdown Timer */}
                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>Offer ends in:</span>
                                </div>
                                <CountdownTimer endTime={endTime || defaultEndTime} />
                            </div>
                            
                            {/* Add to Cart Section */}
                            <div className="pt-6 space-y-4">
                                <div className="flex flex-wrap items-center gap-4">
                                    <ProductQuantity 
                                        quantity={quantity} 
                                        setQuantity={setQuantity}
                                        stock={product.stock_quantity} 
                                    />
                                    
                                    <Button
                                        variant="default"
                                        size="lg"
                                        className="rounded-full bg-primary hover:bg-primary/90 px-8"
                                    >
                                        <ShoppingBag className="h-5 w-5 mr-2" />
                                        <span>Add to Cart</span>
                                    </Button>
                                    
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full h-10 w-10"
                                    >
                                        <Heart className="h-5 w-5 text-gray-600" />
                                    </Button>
                                </div>
                                
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="inline-flex items-center text-primary hover:text-primary/90 font-medium"
                                >
                                    <span>View Full Details</span>
                                    <ChevronRight className="h-5 w-5" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DealOfTheDay; 