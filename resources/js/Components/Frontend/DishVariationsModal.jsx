import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    Minus, 
    Plus, 
    ChevronRight,
    Info,
    Clock,
    Flame,
    Star,
    AlertCircle,
    ShoppingBag,
    Utensils,
    Heart
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Checkbox } from '@/Components/ui/checkbox';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { 
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Separator } from "@/Components/ui/separator";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { useToast } from "@/Components/ui/use-toast";
import { router } from '@inertiajs/react';
import { Loader2 } from "lucide-react";

// Add this new component for better tab design
const CustomTab = ({ active, icon: Icon, label, onClick }) => (
    <motion.button
        onClick={onClick}
        className={cn(
            "flex-1 relative px-4 py-3 flex items-center justify-center space-x-2",
            "text-sm font-medium transition-all duration-200",
            active ? "text-primary" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        {Icon && <Icon className={cn("w-4 h-4", active && "text-primary")} />}
        <span>{label}</span>
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        )}
    </motion.button>
);

const DishVariationsModal = ({ isOpen, onClose, dish }) => {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Store scroll position
    const scrollPosition = useRef(0);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedSize(null);
            setSelectedAddons([]);
            setQuantity(1);
            setSpecialInstructions('');
        }
    }, [isOpen]);

    // Example variations data - in real app, this would come from the backend
    const variations = [
        {
            id: 1,
            name: 'Regular',
            price: dish?.price || 0,
            description: 'Standard size portion',
            calories: '600-800',
            preparationTime: '15-20 mins'
        },
        {
            id: 2,
            name: 'Large',
            price: (dish?.price || 0) * 1.5,
            description: 'Perfect for sharing',
            calories: '900-1100',
            preparationTime: '20-25 mins'
        },
        {
            id: 3,
            name: 'Family',
            price: (dish?.price || 0) * 2.5,
            description: 'Great for 3-4 people',
            calories: '1500-1800',
            preparationTime: '25-30 mins'
        }
    ];

    const addonCategories = [
        {
            id: 1,
            name: 'Extra Toppings',
            required: false,
            multiple: true,
            items: [
                { id: 1, name: 'Extra Cheese', price: 1.5, calories: 120 },
                { id: 2, name: 'Mushrooms', price: 1, calories: 50 },
                { id: 3, name: 'Pepperoni', price: 2, calories: 150 }
            ]
        },
        {
            id: 2,
            name: 'Spice Level',
            required: true,
            multiple: false,
            items: [
                { id: 4, name: 'Mild', price: 0 },
                { id: 5, name: 'Medium', price: 0 },
                { id: 6, name: 'Hot', price: 0 }
            ]
        }
    ];

    const calculateTotal = useCallback(() => {
        let total = selectedSize?.price || dish?.price || 0;
        selectedAddons.forEach(addon => {
            total += addon.price;
        });
        return total * quantity;
    }, [selectedSize, selectedAddons, quantity, dish?.price]);

    const handleAddToCart = async () => {
        if (!selectedSize) {
            toast({
                title: "Please select a size",
                variant: "destructive",
            });
            return;
        }

        // Check for required addon categories
        const missingRequired = addonCategories
            .filter(cat => cat.required)
            .find(cat => !selectedAddons.some(addon => 
                cat.items.find(item => item.id === addon.id)
            ));

        if (missingRequired) {
            toast({
                title: `Please select a ${missingRequired.name}`,
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            await router.post('/cart/add', {
                dish_id: dish?.id,
                variation_id: selectedSize.id,
                quantity,
                addons: selectedAddons.map(addon => addon.id),
                special_instructions: specialInstructions,
                total_price: calculateTotal()
            });

            toast({
                title: "Added to Cart",
                description: `${dish?.name} has been added to your cart.`,
                action: (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => router.visit('/cart')}
                    >
                        View Cart
                    </Button>
                ),
            });

            onClose();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add item to cart. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Enhanced scroll lock with position memory
    useEffect(() => {
        if (isOpen) {
            // Store current scroll position
            scrollPosition.current = window.scrollY;
            
            // Apply fixed position to body while preserving scroll position
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition.current}px`;
            document.body.style.width = '100%';
            document.body.style.overflowY = 'scroll'; // Prevent layout shift
        } else {
            // Restore scroll position when modal closes
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflowY = '';
            
            // Restore scroll position
            window.scrollTo(0, scrollPosition.current);
        }

        return () => {
            // Cleanup
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflowY = '';
            if (scrollPosition.current) {
                window.scrollTo(0, scrollPosition.current);
            }
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Enhanced Backdrop with better blur and animation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[60]"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Enhanced Modal Container */}
                    <div 
                        className="fixed inset-0 z-[70] overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <div className="flex min-h-full items-center justify-center p-4">
                            {/* Enhanced Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ 
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30 
                                }}
                                className="relative w-full max-w-lg overflow-hidden 
                                         bg-white dark:bg-gray-900 rounded-2xl shadow-xl 
                                         transform-gpu"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header with Image */}
                                <div className="relative h-48">
                                    <img
                                        src={dish?.image}
                                        alt={dish?.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                                    
                                    {/* Close Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
                                        onClick={onClose}
                                    >
                                        <X className="w-6 h-6" />
                                    </Button>

                                    {/* Dish Info */}
                                    <div className="absolute bottom-4 left-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            {dish?.isNew && (
                                                <Badge variant="secondary" className="bg-primary/90">New</Badge>
                                            )}
                                            {dish?.discount && (
                                                <Badge variant="secondary" className="bg-red-500/90">
                                                    <Flame className="w-3 h-3 mr-1" />
                                                    {dish.discount}% OFF
                                                </Badge>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-1">
                                            {dish?.name}
                                        </h3>
                                        <div className="flex items-center space-x-3 text-white/90">
                                            <span className="flex items-center">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                                {dish?.rating}
                                            </span>
                                            <span className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {dish?.preparation_time}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Tabs Navigation */}
                                <div className="border-b dark:border-gray-800">
                                    <div className="flex items-center px-2">
                                        <CustomTab
                                            active={true}
                                            icon={Utensils}
                                            label="Customize Order"
                                            onClick={() => {}}
                                        />
                                        <CustomTab
                                            active={false}
                                            icon={Info}
                                            label="Dish Details"
                                            onClick={() => {}}
                                        />
                                    </div>
                                </div>

                                {/* Enhanced Tab Content with better scrolling */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key="customize"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="relative max-h-[calc(100vh-24rem)] overflow-y-auto 
                                                 overscroll-contain scrollbar-thin 
                                                 scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 
                                                 scrollbar-track-transparent 
                                                 scroll-smooth"
                                        style={{
                                            WebkitOverflowScrolling: 'touch',
                                            scrollbarWidth: 'thin'
                                        }}
                                    >
                                        <div className="p-6">
                                            {/* Size Selection */}
                                            <div>
                                                <Label className="text-base font-semibold">
                                                    Choose Size
                                                    <span className="text-red-500 ml-1">*</span>
                                                </Label>
                                                <RadioGroup
                                                    value={selectedSize?.id}
                                                    onValueChange={(value) => {
                                                        setSelectedSize(variations.find(v => v.id === parseInt(value)));
                                                    }}
                                                    className="mt-3 space-y-3"
                                                >
                                                    {variations.map((variation) => (
                                                        <Label
                                                            key={variation.id}
                                                            className={cn(
                                                                "flex items-center justify-between p-4 rounded-xl border",
                                                                "cursor-pointer transition-colors",
                                                                selectedSize?.id === variation.id
                                                                    ? "border-primary bg-primary/5"
                                                                    : "border-gray-200 dark:border-gray-800 hover:border-primary/50"
                                                            )}
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <RadioGroupItem 
                                                                    value={variation.id} 
                                                                    id={`size-${variation.id}`} 
                                                                />
                                                                <div>
                                                                    <div className="font-medium">{variation.name}</div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {variation.description}
                                                                    </div>
                                                                    <div className="flex items-center space-x-2 mt-1">
                                                                        <Badge variant="secondary">
                                                                            {variation.calories} cal
                                                                        </Badge>
                                                                        <Badge variant="secondary">
                                                                            {variation.preparationTime}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <span className="font-semibold">
                                                                ${variation.price.toFixed(2)}
                                                            </span>
                                                        </Label>
                                                    ))}
                                                </RadioGroup>
                                            </div>

                                            <Separator />

                                            {/* Addons */}
                                            <Accordion type="single" collapsible className="w-full">
                                                {addonCategories.map((category) => (
                                                    <AccordionItem key={category.id} value={`category-${category.id}`}>
                                                        <AccordionTrigger className="text-base font-semibold">
                                                            {category.name}
                                                            {category.required && (
                                                                <span className="text-red-500 ml-1">*</span>
                                                            )}
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="space-y-3 pt-2">
                                                                {category.items.map((item) => (
                                                                    <Label
                                                                        key={item.id}
                                                                        className={cn(
                                                                            "flex items-center justify-between p-3 rounded-lg border",
                                                                            "cursor-pointer transition-colors",
                                                                            selectedAddons.find(a => a.id === item.id)
                                                                                ? "border-primary bg-primary/5"
                                                                                : "border-gray-200 dark:border-gray-800 hover:border-primary/50"
                                                                        )}
                                                                    >
                                                                        <div className="flex items-center space-x-3">
                                                                            {category.multiple ? (
                                                                                <Checkbox
                                                                                    checked={selectedAddons.some(a => a.id === item.id)}
                                                                                    onCheckedChange={(checked) => {
                                                                                        if (checked) {
                                                                                            setSelectedAddons([...selectedAddons, item]);
                                                                                        } else {
                                                                                            setSelectedAddons(selectedAddons.filter(a => a.id !== item.id));
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <RadioGroupItem
                                                                                    value={item.id}
                                                                                    checked={selectedAddons.some(a => a.id === item.id)}
                                                                                    onChange={() => {
                                                                                        const otherAddons = selectedAddons.filter(a => 
                                                                                            !category.items.find(i => i.id === a.id)
                                                                                        );
                                                                                        setSelectedAddons([...otherAddons, item]);
                                                                                    }}
                                                                                />
                                                                            )}
                                                                            <div>
                                                                                <div className="font-medium">{item.name}</div>
                                                                                {item.calories && (
                                                                                    <div className="text-sm text-gray-500">
                                                                                        {item.calories} cal
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        {item.price > 0 && (
                                                                            <span className="font-semibold">
                                                                                +${item.price.toFixed(2)}
                                                                            </span>
                                                                        )}
                                                                    </Label>
                                                                ))}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>

                                            <Separator />

                                            {/* Special Instructions */}
                                            <div>
                                                <Label className="text-base font-semibold">
                                                    Special Instructions
                                                </Label>
                                                <Input
                                                    value={specialInstructions}
                                                    onChange={(e) => setSpecialInstructions(e.target.value)}
                                                    placeholder="Any special requests?"
                                                    className="mt-2"
                                                />
                                            </div>

                                            <Separator />

                                            {/* Quantity and Total */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-base font-semibold">Quantity</Label>
                                                    <div className="flex items-center space-x-3">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full"
                                                            onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                                                            disabled={quantity <= 1}
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <span className="text-xl font-semibold w-8 text-center">
                                                            {quantity}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full"
                                                            onClick={() => setQuantity(q => q + 1)}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between font-semibold">
                                                    <span>Total Amount</span>
                                                    <span className="text-xl text-primary">
                                                        ${calculateTotal().toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Enhanced Footer with better positioning */}
                                <motion.div
                                    className="sticky bottom-0 left-0 right-0 p-4 
                                             border-t dark:border-gray-800 
                                             bg-white/80 dark:bg-gray-900/80 
                                             backdrop-blur-md backdrop-saturate-150 
                                             z-10"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center space-x-4">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="rounded-full"
                                                onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                                                disabled={quantity <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                            <span className="text-xl font-semibold w-12 text-center">
                                                {quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="rounded-full"
                                                onClick={() => setQuantity(q => q + 1)}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <div className="flex items-center space-x-3">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="rounded-full"
                                            >
                                                <Heart className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="lg"
                                                className="rounded-full space-x-2"
                                                onClick={handleAddToCart}
                                                disabled={!selectedSize || isLoading}
                                            >
                                                <span>${calculateTotal().toFixed(2)}</span>
                                                <div className="w-px h-4 bg-white/20" />
                                                <span>Add to Cart</span>
                                                <ShoppingBag className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Validation Message */}
                                    {!selectedSize && (
                                        <p className="text-sm text-yellow-500 flex items-center">
                                            <Info className="w-4 h-4 mr-1" />
                                            Please select a size to continue
                                        </p>
                                    )}
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DishVariationsModal; 