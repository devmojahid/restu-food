import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { 
    Clock, 
    ShoppingCart, 
    Percent, 
    Star, 
    TrendingUp,
    TimerOff,
    Flame,
    Zap,
    Megaphone
} from 'lucide-react';

const DealOfTheDay = ({ deal = null }) => {
    const [timeRemaining, setTimeRemaining] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    
    useEffect(() => {
        if (!deal) return;
        
        // Set initial time remaining
        const calculateTimeRemaining = () => {
            const now = new Date();
            const endTime = deal.end_time ? new Date(deal.end_time) : new Date(now.getTime() + 24 * 60 * 60 * 1000);
            const diff = endTime - now;
            
            if (diff <= 0) {
                // Deal has ended
                return { hours: 0, minutes: 0, seconds: 0 };
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            return { hours, minutes, seconds };
        };
        
        // Update timer immediately
        setTimeRemaining(calculateTimeRemaining());
        
        // Set up interval to update timer
        const timerId = setInterval(() => {
            const remaining = calculateTimeRemaining();
            setTimeRemaining(remaining);
            
            if (remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
                clearInterval(timerId);
            }
        }, 1000);
        
        return () => clearInterval(timerId);
    }, [deal]);
    
    if (!deal) {
        return null;
    }
    
    const { hours, minutes, seconds } = timeRemaining;
    const isExpired = hours === 0 && minutes === 0 && seconds === 0;
    
    return (
        <section className="py-12 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Left Column - Product Image */}
                    <motion.div 
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full opacity-30"></div>
                            
                            {/* Main Image */}
                            <div className="relative overflow-hidden rounded-xl">
                                <img 
                                    src={deal.image} 
                                    alt={deal.name} 
                                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                />
                                
                                {/* Sale Badge */}
                                <div className="absolute top-4 right-4 bg-red-600 text-white font-bold text-xl p-3 rounded-full 
                                              flex items-center justify-center animate-pulse">
                                    <Percent className="mr-1 h-5 w-5" />
                                    <span>{deal.discount}%</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Right Column - Product Info */}
                    <motion.div 
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <div className="flex items-center mb-2">
                                    <Zap className="w-6 h-6 text-yellow-400 mr-2" />
                                    <h2 className="text-2xl font-bold">Deal of the Day</h2>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold mb-2">{deal.name}</h3>
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex items-center">
                                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                        <span className="ml-1 font-medium">{deal.rating} ({deal.reviews_count} reviews)</span>
                                    </div>
                                    <div className="flex items-center">
                                        <TrendingUp className="h-5 w-5 text-green-400" />
                                        <span className="ml-1">{deal.sold_count}+ sold</span>
                                    </div>
                                </div>
                                <p className="text-gray-300">{deal.description}</p>
                            </div>
                            
                            {/* Timer */}
                            <div className="bg-black/30 rounded-xl p-5">
                                <h4 className="text-lg font-semibold mb-3 flex items-center">
                                    <Clock className="mr-2 h-5 w-5 text-primary" />
                                    {isExpired ? "Offer Expired" : "Hurry Up! Offer Ends In:"}
                                </h4>
                                
                                {isExpired ? (
                                    <div className="flex items-center justify-center py-4">
                                        <TimerOff className="h-12 w-12 text-red-400 mr-3" />
                                        <span className="text-xl font-medium">This deal has ended</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        <div className="bg-gray-800 rounded-lg p-3">
                                            <div className="text-3xl font-bold text-white">{hours.toString().padStart(2, '0')}</div>
                                            <div className="text-xs text-gray-400 uppercase">Hours</div>
                                        </div>
                                        <div className="bg-gray-800 rounded-lg p-3">
                                            <div className="text-3xl font-bold text-white">{minutes.toString().padStart(2, '0')}</div>
                                            <div className="text-xs text-gray-400 uppercase">Minutes</div>
                                        </div>
                                        <div className="bg-gray-800 rounded-lg p-3">
                                            <div className="text-3xl font-bold text-white">{seconds.toString().padStart(2, '0')}</div>
                                            <div className="text-xs text-gray-400 uppercase">Seconds</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Stock Progress */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm flex items-center">
                                        <Flame className="h-4 w-4 text-orange-500 mr-1" />
                                        {deal.stock_sold}% Sold
                                    </span>
                                    <span className="text-sm">Stock: {deal.stock_available}</span>
                                </div>
                                <Progress value={deal.stock_sold} className="h-2" />
                            </div>
                            
                            {/* Price */}
                            <div className="flex items-end space-x-3">
                                <div className="text-3xl font-bold text-white">${deal.discounted_price}</div>
                                <div className="text-lg text-gray-400 line-through">${deal.original_price}</div>
                                <div className="text-green-500 font-medium">Save ${(deal.original_price - deal.discounted_price).toFixed(2)}</div>
                            </div>
                            
                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-white"
                                    disabled={isExpired}
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Add to Cart
                                </Button>
                                <Link href={`/shop/${deal.slug}`}>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-white/20 text-white hover:bg-white/10"
                                    >
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                            
                            {/* Features */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {deal.features?.map((feature, index) => (
                                    <div key={index} className="flex items-center">
                                        <Megaphone className="h-4 w-4 text-primary mr-2" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default DealOfTheDay; 