import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/Components/ui/sheet";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { useMenuItem } from '@/hooks/useMenuItem';
import { 
    Star, 
    Clock, 
    Heart,
    Minus,
    Plus,
    AlertCircle,
    Leaf,
    Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';

const QuickView = ({ item, isOpen, onClose, onAddToCart, onWishlist, isWishlisted }) => {
    const {
        quantity,
        selectedVariations,
        selectedAddons,
        handleQuantityChange,
        handleVariationChange,
        handleAddonToggle,
        calculateTotalPrice,
        resetSelections
    } = useMenuItem();

    const handleClose = () => {
        resetSelections();
        onClose();
    };

    const handleAddToCart = () => {
        onAddToCart({
            ...item,
            quantity,
            variations: selectedVariations,
            addons: selectedAddons,
            total_price: calculateTotalPrice(item.price)
        });
        handleClose();
    };

    if (!item) return null;

    return (
        <Sheet open={isOpen} onOpenChange={handleClose}>
            <SheetContent 
                side="right" 
                className="w-full sm:max-w-[540px] p-0"
            >
                <div className="flex flex-col h-full">
                    {/* Header Image */}
                    <div className="relative aspect-video">
                        <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Close Button */}
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-4 right-4 rounded-full"
                            onClick={handleClose}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full px-6">
                            <div className="py-6 space-y-6">
                                {/* Title & Price */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="text-2xl font-bold text-primary">
                                        ${calculateTotalPrice(item.price)}
                                    </div>
                                </div>

                                {/* Meta Info */}
                                <div className="flex items-center gap-4 flex-wrap">
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
                                        <Badge variant="secondary" className="gap-1">
                                            <Leaf className="w-3 h-3" />
                                            Vegetarian
                                        </Badge>
                                    )}
                                    {item.is_spicy && (
                                        <Badge variant="secondary" className="gap-1">
                                            <Flame className="w-3 h-3" />
                                            Spicy
                                        </Badge>
                                    )}
                                </div>

                                {/* Variations */}
                                {item.variations?.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            Customize Your Order
                                        </h4>
                                        {item.variations.map((variation) => (
                                            <div key={variation.name} className="space-y-2">
                                                <label className="text-sm text-gray-600 dark:text-gray-400">
                                                    {variation.name}
                                                </label>
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
                                )}

                                {/* Addons */}
                                {item.addons?.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            Add Extra Items
                                        </h4>
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
                                    <div className="flex items-start gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-yellow-800 dark:text-yellow-200">
                                                Allergen Information
                                            </p>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                                Contains: {item.allergens.join(', ')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-4">
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
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onWishlist(item.id)}
                            >
                                <Heart className={cn(
                                    "w-4 h-4",
                                    isWishlisted && "fill-current text-red-500"
                                )} />
                            </Button>
                        </div>
                        <Button 
                            className="w-full" 
                            size="lg"
                            onClick={handleAddToCart}
                        >
                            Add to Cart - ${calculateTotalPrice(item.price)}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default QuickView; 