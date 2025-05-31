import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Clock, 
    ShoppingBag, 
    Percent,
    ChevronRight,
    Star,
    Heart,
    Share2,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import { Badge } from '@/Components/ui/badge';

const Countdown = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!endTime) {
            setIsExpired(true);
            return;
        }

        const endDate = new Date(endTime).getTime();
        
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = endDate - now;
            
            if (difference <= 0) {
                setIsExpired(true);
                return {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                };
            }
            
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000)
            };
        };
        
        setTimeLeft(calculateTimeLeft());
        
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        
        return () => clearInterval(timer);
    }, [endTime]);
    
    if (isExpired) {
        return (
            <div className="flex items-center text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>This deal has expired!</span>
            </div>
        );
    }
    
    return (
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
            ].map((item) => (
                <div 
                    key={item.label}
                    className="bg-primary/10 dark:bg-primary/20 rounded-xl p-3 text-center w-20"
                >
                    <div className="text-2xl font-bold text-primary">
                        {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                        {item.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                    key={star} 
                    className={cn(
                        "w-4 h-4", 
                        star <= rating 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-300 dark:text-gray-600"
                    )} 
                />
            ))}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                ({rating.toFixed(1)})
            </span>
        </div>
    );
};

const DealOfTheDay = ({ product = null }) => {
    if (!product) return null;

    // Calculate sale percentage
    const salePercent = product.discount || 0;
    
    // Calculate original price
    const originalPrice = product.price * (1 + product.discount / 100);
    
    // Calculate stock percentage (for demo purposes)
    const stockPercentage = product.stock_percentage || 65;
    
    return (
        <section className="py-12 bg-gray-50 dark:bg-gray-900/30">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center mb-2">
                            <Percent className="w-5 h-5 text-primary mr-2" />
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                Deal of the Day
                            </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            Limited time offer - grab it before it's gone!
                        </p>
                    </div>
                    <Link 
                        href="/shop?sort=deals"
                        className="inline-flex items-center text-primary hover:text-primary/90 
                               font-medium transition-colors mt-4 md:mt-0 group"
                    >
                        <span>View More Deals</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Product Image */}
                        <div className="relative h-72 md:h-full">
                            <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            
                            {/* Sale Badge */}
                            {salePercent > 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white text-lg 
                                             font-bold px-3 py-2 rounded-full">
                                    {salePercent}% OFF
                                </div>
                            )}
                            
                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex flex-col space-y-2">
                                <Button 
                                    variant="secondary" 
                                    size="icon" 
                                    className="h-10 w-10 rounded-full bg-white/90 dark:bg-gray-800/90 
                                             hover:bg-primary hover:text-white shadow-sm"
                                >
                                    <Heart className="h-5 w-5" />
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    size="icon" 
                                    className="h-10 w-10 rounded-full bg-white/90 dark:bg-gray-800/90 
                                             hover:bg-primary hover:text-white shadow-sm"
                                >
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        
                        {/* Product Details */}
                        <div className="p-6 md:p-8 flex flex-col">
                            <div className="mb-4">
                                {product.category && (
                                    <Link 
                                        href={`/shop?category=${product.category.slug}`}
                                        className="text-sm text-primary hover:text-primary/90 
                                               transition-colors mb-2 inline-block"
                                    >
                                        {product.category.name}
                                    </Link>
                                )}
                                
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                    {product.name}
                                </h3>
                                
                                <div className="mb-4">
                                    <StarRating rating={product.rating || 4.5} />
                                </div>
                                
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {product.description}
                                </p>
                            </div>
                            
                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className="text-3xl font-bold text-primary">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    {salePercent > 0 && (
                                        <span className="text-xl text-gray-500 line-through">
                                            ${originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Stock Progress */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Available Stock</span>
                                        <span className="font-medium">{stockPercentage}%</span>
                                    </div>
                                    <Progress value={stockPercentage} className="h-2" />
                                </div>
                                
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Hurry up! Limited time offer.
                                </div>
                            </div>
                            
                            {/* Countdown Timer */}
                            <div className="mb-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>Offer ends in:</span>
                                </p>
                                <Countdown endTime={product.deal_ends_at} />
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="mt-auto space-y-3">
                                <Button className="w-full rounded-full">
                                    <ShoppingBag className="w-5 h-5 mr-2" />
                                    Add to Cart
                                </Button>
                                <Link 
                                    href={`/shop/${product.slug}`}
                                    className="inline-flex items-center justify-center w-full text-primary
                                           hover:text-primary/90 font-medium transition-colors group"
                                >
                                    <span>View Full Details</span>
                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DealOfTheDay; 