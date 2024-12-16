import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import { motion } from 'framer-motion';
import { 
    Star, 
    Clock, 
    Info, 
    Heart,
    Share2,
    Minus,
    Plus,
    ChevronRight,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { 
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import RelatedItems from './Partials/RelatedItems';
import ReviewsSection from './Partials/ReviewsSection';
import { useToast } from '@/Components/ui/use-toast';

const Show = ({ item, relatedItems, reviews }) => {
    const { addToCart } = useCart();
    const { toast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariations, setSelectedVariations] = useState({});
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    const handleVariationChange = (name, option) => {
        setSelectedVariations(prev => ({
            ...prev,
            [name]: option
        }));
    };

    const handleAddonToggle = (addon) => {
        setSelectedAddons(prev => {
            const exists = prev.find(a => a.name === addon.name);
            if (exists) {
                return prev.filter(a => a.name !== addon.name);
            }
            return [...prev, addon];
        });
    };

    const calculateTotalPrice = () => {
        let total = item.price * quantity;
        
        // Add variation costs
        Object.values(selectedVariations).forEach(variation => {
            if (variation.price) {
                total += variation.price * quantity;
            }
        });

        // Add addon costs
        selectedAddons.forEach(addon => {
            total += addon.price * quantity;
        });

        return total.toFixed(2);
    };

    const handleAddToCart = () => {
        const cartItem = {
            ...item,
            quantity,
            variations: selectedVariations,
            addons: selectedAddons,
            total_price: calculateTotalPrice()
        };

        addToCart(cartItem);
        toast({
            title: "Added to Cart",
            description: `${quantity}x ${item.name} added to your cart`,
            variant: "success"
        });
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: item.name,
                text: item.description,
                url: window.location.href
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast({
            title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
            description: `${item.name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist`,
            variant: "success"
        });
    };

    return (
        <Layout>
            <Head title={item.name} />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Image and Gallery */}
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative rounded-2xl overflow-hidden"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full aspect-[4/3] object-cover"
                            />
                            {item.is_popular && (
                                <Badge className="absolute top-4 left-4 bg-primary">
                                    Popular
                                </Badge>
                            )}
                        </motion.div>

                        {/* Image Gallery */}
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {item.gallery?.map((image, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="aspect-square rounded-lg overflow-hidden"
                                >
                                    <img
                                        src={image}
                                        alt={`${item.name} gallery ${index + 1}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Details and Actions */}
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Header */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {item.name}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {item.description}
                                </p>
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center gap-6 flex-wrap">
                                <div className="flex items-center text-yellow-400">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="ml-1 font-medium">
                                        {item.rating} ({item.reviews_count} reviews)
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                    <Clock className="w-5 h-5" />
                                    <span className="ml-1">
                                        {item.preparation_time} mins
                                    </span>
                                </div>
                                {item.is_vegetarian && (
                                    <Badge variant="secondary">
                                        Vegetarian
                                    </Badge>
                                )}
                                {item.calories && (
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {item.calories} cal
                                    </span>
                                )}
                            </div>

                            {/* Price and Quantity */}
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold text-primary">
                                    ${calculateTotalPrice()}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="w-12 text-center font-medium">
                                        {quantity}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= 10}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Variations */}
                            {item.variations?.length > 0 && (
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="variations">
                                        <AccordionTrigger>
                                            Customize Your Order
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4">
                                                {item.variations.map((variation) => (
                                                    <div key={variation.name}>
                                                        <h4 className="font-medium mb-2">
                                                            {variation.name}
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {variation.options.map((option) => (
                                                                <Button
                                                                    key={option.name}
                                                                    variant={selectedVariations[variation.name]?.name === option.name ? "default" : "outline"}
                                                                    onClick={() => handleVariationChange(variation.name, option)}
                                                                    className="justify-between"
                                                                >
                                                                    <span>{option.name}</span>
                                                                    {option.price > 0 && (
                                                                        <span>+${option.price}</span>
                                                                    )}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )}

                            {/* Addons */}
                            {item.addons?.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="font-medium">Add Extra Items</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {item.addons.map((addon) => (
                                            <Button
                                                key={addon.name}
                                                variant={selectedAddons.find(a => a.name === addon.name) ? "default" : "outline"}
                                                onClick={() => handleAddonToggle(addon)}
                                                className="justify-between"
                                            >
                                                <span>{addon.name}</span>
                                                <span>+${addon.price}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Allergens */}
                            {item.allergens?.length > 0 && (
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">
                                        Contains: {item.allergens.join(', ')}
                                    </span>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4">
                                <Button
                                    size="lg"
                                    className="flex-1"
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart - ${calculateTotalPrice()}
                                </Button>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={handleWishlist}
                                            >
                                                <Heart 
                                                    className={cn(
                                                        "w-5 h-5",
                                                        isWishlisted && "fill-current text-red-500"
                                                    )} 
                                                />
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
                                                variant="outline"
                                                size="icon"
                                                onClick={handleShare}
                                            >
                                                <Share2 className="w-5 h-5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Share</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Related Items */}
                <RelatedItems items={relatedItems} />

                {/* Reviews Section */}
                <ReviewsSection reviews={reviews} />
            </div>
        </Layout>
    );
};

export default Show; 