import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    Heart,
    Share2,
    Minus,
    Plus,
    ShoppingBag,
    Truck,
    ShieldCheck,
    Clock,
    MessageCircle,
    AlertCircle,
    Check,
    RefreshCw,
    Loader2,
    CreditCard
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";
import { useToast } from '@/Components/ui/use-toast';
import { Link } from '@inertiajs/react';

const ProductInfo = ({ 
    product, 
    quantity, 
    onQuantityChange, 
    onAddToCart, 
    onWishlistToggle, 
    isWishlisted,
    isLoading,
    selectedVariant,
    onVariantChange,
    calculatedPrice
}) => {
    const [showShareDialog, setShowShareDialog] = useState(false);
    const { toast } = useToast();
    const [isCopied, setIsCopied] = useState(false);
    
    const formattedPrice = (price) => {
        return parseFloat(price).toFixed(2);
    };
    
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href
            }).catch(error => {
                console.error('Error sharing:', error);
                setShowShareDialog(true);
            });
        } else {
            setShowShareDialog(true);
        }
    };
    
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            toast({
                title: "Link Copied!",
                description: "The link has been copied to your clipboard",
            });
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Error copying link:', error);
        }
    };
    
    const shareOptions = [
        {
            name: 'Copy Link',
            icon: 'copy',
            onClick: handleCopyLink,
            className: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
        },
        {
            name: 'Facebook',
            icon: 'facebook',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
            className: 'bg-blue-500 hover:bg-blue-600 text-white'
        },
        {
            name: 'Twitter',
            icon: 'twitter',
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`,
            className: 'bg-sky-500 hover:bg-sky-600 text-white'
        },
        {
            name: 'WhatsApp',
            icon: 'whatsapp',
            href: `https://wa.me/?text=${encodeURIComponent(`${product.name} - ${window.location.href}`)}`,
            className: 'bg-green-500 hover:bg-green-600 text-white'
        }
    ];

    // Render ratings stars
    const RatingStars = ({ rating }) => {
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
            </div>
        );
    };
    
    return (
        <div className="h-full flex flex-col">
            {/* Product Header */}
            <div>
                {/* Category & Brand */}
                <div className="flex items-center space-x-2 mb-2">
                    <Link 
                        href={`/shop?category=${encodeURIComponent(product.category)}`}
                        className="text-sm text-primary hover:underline"
                    >
                        {product.category}
                    </Link>
                    <span className="text-gray-400">•</span>
                    <Link 
                        href={`/shop?brand=${encodeURIComponent(product.brand)}`}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:underline"
                    >
                        {product.brand}
                    </Link>
                </div>
                
                {/* Product Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.name}
                </h1>
                
                {/* Ratings & Reviews */}
                <div className="flex items-center mb-4">
                    <div className="flex items-center">
                        <RatingStars rating={product.rating} />
                        <span className="ml-2 text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="mx-2 text-gray-300 dark:text-gray-700">|</span>
                    <Link 
                        href="#reviews"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:underline flex items-center"
                    >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {product.reviews_count || 0} Reviews
                    </Link>
                    {product.in_stock ? (
                        <>
                            <span className="mx-2 text-gray-300 dark:text-gray-700">|</span>
                            <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
                                <Check className="w-4 h-4 mr-1" />
                                In Stock
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="mx-2 text-gray-300 dark:text-gray-700">|</span>
                            <span className="text-sm text-red-600 dark:text-red-400 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                Out of Stock
                            </span>
                        </>
                    )}
                </div>
                
                {/* Price */}
                <div className="flex items-end space-x-2 mb-6">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${formattedPrice(calculatedPrice)}
                    </span>
                    
                    {product.on_sale && (
                        <span className="text-lg text-gray-500 line-through mb-0.5">
                            ${formattedPrice(product.price)}
                        </span>
                    )}
                    
                    {product.on_sale && (
                        <Badge variant="destructive" className="mb-1">
                            {product.discount_percentage}% OFF
                        </Badge>
                    )}
                </div>
            </div>
            
            {/* Brief Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {product.description}
            </p>
            
            {/* Variants Selection */}
            {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Options
                    </h3>
                    <RadioGroup 
                        defaultValue={product.variants[0].id.toString()}
                        className="grid grid-cols-2 md:grid-cols-4 gap-2"
                        onValueChange={(value) => {
                            const variant = product.variants.find(v => v.id.toString() === value);
                            if (variant) onVariantChange(variant);
                        }}
                    >
                        {product.variants.map((variant) => (
                            <div key={variant.id}>
                                <RadioGroupItem
                                    value={variant.id.toString()}
                                    id={`variant-${variant.id}`}
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor={`variant-${variant.id}`}
                                    className="flex flex-col items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 peer-checked:border-primary peer-checked:bg-primary/10"
                                >
                                    <div className="w-full flex items-center justify-between">
                                        <span className="text-sm font-medium">{variant.name}</span>
                                        <span className="text-sm">${formattedPrice(variant.price)}</span>
                                    </div>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            )}
            
            {/* Quantity Selector & Add to Cart */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center h-12 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-full rounded-none border-r border-gray-300 dark:border-gray-700"
                        onClick={() => onQuantityChange(-1)}
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <div className="h-full flex items-center justify-center w-12">
                        <span className="text-center font-medium">{quantity}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-full rounded-none border-l border-gray-300 dark:border-gray-700"
                        onClick={() => onQuantityChange(1)}
                        disabled={quantity >= 10}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                
                <div className="flex flex-1 gap-2">
                    <Button
                        className="flex-1"
                        onClick={onAddToCart}
                        disabled={isLoading || !product.in_stock}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Add to Cart
                            </>
                        )}
                    </Button>
                    
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-md"
                        onClick={onWishlistToggle}
                    >
                        <Heart className={cn("w-5 h-5", isWishlisted && "fill-red-500 text-red-500")} />
                    </Button>
                    
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-md"
                        onClick={handleShare}
                    >
                        <Share2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>
            
            {/* Buy Now button */}
            <Button
                variant="secondary"
                className="w-full mb-6"
                disabled={!product.in_stock}
            >
                <CreditCard className="w-5 h-5 mr-2" />
                Buy Now
            </Button>
            
            {/* Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Truck className="w-5 h-5 text-primary mr-3" />
                    <div>
                        <h4 className="text-sm font-medium">Free Shipping</h4>
                        <p className="text-xs text-gray-500">On orders over $50</p>
                    </div>
                </div>
                <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <RefreshCw className="w-5 h-5 text-primary mr-3" />
                    <div>
                        <h4 className="text-sm font-medium">30-Day Returns</h4>
                        <p className="text-xs text-gray-500">Hassle-free returns</p>
                    </div>
                </div>
                <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-primary mr-3" />
                    <div>
                        <h4 className="text-sm font-medium">Secure Payment</h4>
                        <p className="text-xs text-gray-500">100% protected</p>
                    </div>
                </div>
            </div>
            
            {/* Additional Info (Accordions) */}
            <div className="mt-auto">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="shipping">
                        <AccordionTrigger className="text-sm">Shipping Information</AccordionTrigger>
                        <AccordionContent>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                <p>Standard shipping: 3-5 business days</p>
                                <p>Express shipping: 1-2 business days</p>
                                <p>Free shipping on orders over $50</p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="returns">
                        <AccordionTrigger className="text-sm">Return Policy</AccordionTrigger>
                        <AccordionContent>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                <p>30-day money-back guarantee</p>
                                <p>Return shipping is free for defective items</p>
                                <p>Items must be in original packaging</p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    
                    {product.specifications && (
                        <AccordionItem value="details">
                            <AccordionTrigger className="text-sm">Product Details</AccordionTrigger>
                            <AccordionContent>
                                <div className="grid grid-cols-1 gap-2">
                                    {Object.entries(product.specifications).slice(0, 3).map(([key, value], index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="text-gray-500">{key}</span>
                                            <span>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
            </div>
            
            {/* Share Dialog */}
            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Share this product</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        {shareOptions.map((option) => (
                            <Button
                                key={option.name}
                                className={cn("flex items-center justify-center gap-2", option.className)}
                                onClick={option.onClick}
                                asChild={Boolean(option.href)}
                            >
                                {option.href ? (
                                    <a href={option.href} target="_blank" rel="noopener noreferrer">
                                        {option.name}
                                    </a>
                                ) : (
                                    <>
                                        {option.name === 'Copy Link' && isCopied ? 'Copied!' : option.name}
                                    </>
                                )}
                            </Button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductInfo; 