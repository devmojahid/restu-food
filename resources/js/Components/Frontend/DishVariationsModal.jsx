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
    const [totalPrice, setTotalPrice] = useState(dish?.price || 0);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [activeTab, setActiveTab] = useState('customize');

    // Store scroll position
    const scrollPosition = useRef(0);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedSize(null);
            setSelectedAddons([]);
            setQuantity(1);
            setSpecialInstructions('');
            setActiveTab('customize');
        }
    }, [isOpen]);

    // Example data structure for backend integration
    const variations = [
        { 
            id: 1, 
            name: 'Small', 
            price: dish?.price || 0,
            description: 'Perfect for 1 person',
            calories: '600-800',
            preparationTime: '15-20'
        },
        { 
            id: 2, 
            name: 'Medium', 
            price: (dish?.price || 0) + 2,
            description: 'Good for 2 people',
            calories: '900-1100',
            preparationTime: '20-25'
        },
        { 
            id: 3, 
            name: 'Large', 
            price: (dish?.price || 0) + 4,
            description: 'Ideal for 3-4 people',
            calories: '1200-1400',
            preparationTime: '25-30'
        }
    ];

    const addonCategories = [
        {
            id: 1,
            name: 'Toppings',
            items: [
                { id: 1, name: 'Extra Cheese', price: 1.5, calories: 120 },
                { id: 2, name: 'Mushrooms', price: 1, calories: 50 },
                { id: 3, name: 'Pepperoni', price: 2, calories: 150 },
            ]
        },
        {
            id: 2,
            name: 'Extras',
            items: [
                { id: 4, name: 'Garlic Bread', price: 2.5, calories: 200 },
                { id: 5, name: 'Dipping Sauce', price: 0.75, calories: 80 },
            ]
        }
    ];

    const calculateTotal = useCallback(() => {
        let total = selectedSize ? selectedSize.price : dish?.price || 0;
        selectedAddons.forEach(addon => {
            total += addon.price;
        });
        total *= quantity;
        setTotalPrice(total);
    }, [selectedSize, selectedAddons, quantity, dish?.price]);

    useEffect(() => {
        calculateTotal();
    }, [calculateTotal]);

    const handleAddonToggle = (addon) => {
        setSelectedAddons(prev => {
            const exists = prev.find(a => a.id === addon.id);
            if (exists) {
                return prev.filter(a => a.id !== addon.id);
            }
            return [...prev, addon];
        });
    };

    const handleAddToCart = () => {
        // Structure for backend API
        const cartItem = {
            dish_id: dish?.id,
            variation_id: selectedSize?.id,
            quantity,
            addons: selectedAddons.map(addon => addon.id),
            special_instructions: specialInstructions,
            total_price: totalPrice,
            meta: {
                dish_name: dish?.name,
                variation_name: selectedSize?.name,
                addon_names: selectedAddons.map(addon => addon.name),
                unit_price: selectedSize?.price,
                addons_total: selectedAddons.reduce((sum, addon) => sum + addon.price, 0)
            }
        };

        // Example API call structure
        // await axios.post('/api/cart/add', cartItem);
        console.log('Adding to cart:', cartItem);
        onClose();
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
                                            active={activeTab === 'customize'}
                                            icon={Utensils}
                                            label="Customize Order"
                                            onClick={() => setActiveTab('customize')}
                                        />
                                        <CustomTab
                                            active={activeTab === 'details'}
                                            icon={Info}
                                            label="Dish Details"
                                            onClick={() => setActiveTab('details')}
                                        />
                                    </div>
                                </div>

                                {/* Enhanced Tab Content with better scrolling */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
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
                                            {activeTab === 'customize' ? (
                                                <div className="space-y-6">
                                                    {/* Size Selection */}
                                                    <div className="mb-6">
                                                        <h4 className="text-lg font-semibold mb-4">Choose Size</h4>
                                                        <RadioGroup
                                                            value={selectedSize?.id}
                                                            onValueChange={(value) => {
                                                                setSelectedSize(variations.find(v => v.id === parseInt(value)));
                                                            }}
                                                            className="space-y-3"
                                                        >
                                                            {variations.map((variation) => (
                                                                <label
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
                                                                        <RadioGroupItem value={variation.id} id={`size-${variation.id}`} />
                                                                        <div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <span className="font-medium">{variation.name}</span>
                                                                                <Badge variant="secondary" className="text-xs">
                                                                                    {variation.calories} cal
                                                                                </Badge>
                                                                            </div>
                                                                            <p className="text-sm text-gray-500">
                                                                                {variation.description}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <span className="font-semibold">
                                                                        ${variation.price.toFixed(2)}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </RadioGroup>
                                                    </div>

                                                    {/* Add-ons Categories */}
                                                    {addonCategories.map(category => (
                                                        <div key={category.id} className="mb-6">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <h4 className="text-lg font-semibold">{category.name}</h4>
                                                                <span className="text-sm text-gray-500">Optional</span>
                                                            </div>
                                                            <div className="space-y-3">
                                                                {category.items.map((addon) => (
                                                                    <label
                                                                        key={addon.id}
                                                                        className={cn(
                                                                            "flex items-center justify-between p-4 rounded-xl border",
                                                                            "cursor-pointer transition-colors",
                                                                            selectedAddons.find(a => a.id === addon.id)
                                                                                ? "border-primary bg-primary/5"
                                                                                : "border-gray-200 dark:border-gray-800 hover:border-primary/50"
                                                                        )}
                                                                    >
                                                                        <div className="flex items-center space-x-3">
                                                                            <Checkbox
                                                                                checked={selectedAddons.some(a => a.id === addon.id)}
                                                                                onCheckedChange={() => handleAddonToggle(addon)}
                                                                            />
                                                                            <div>
                                                                                <span className="font-medium">{addon.name}</span>
                                                                                <span className="text-sm text-gray-500 ml-2">
                                                                                    ({addon.calories} cal)
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <span className="font-semibold">+${addon.price.toFixed(2)}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* Special Instructions */}
                                                    <div className="mb-6">
                                                        <h4 className="text-lg font-semibold mb-4">Special Instructions</h4>
                                                        <textarea
                                                            value={specialInstructions}
                                                            onChange={(e) => setSpecialInstructions(e.target.value)}
                                                            placeholder="Any special requests?"
                                                            className="w-full p-3 border rounded-xl resize-none h-24
                                                                   focus:outline-none focus:ring-2 focus:ring-primary
                                                                   dark:bg-gray-800 dark:border-gray-700"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="text-lg font-semibold mb-3">Description</h4>
                                                        <p className="text-gray-600 dark:text-gray-400">
                                                            {dish?.description}
                                                        </p>
                                                    </div>
                                                    
                                                    <div>
                                                        <h4 className="text-lg font-semibold mb-3">Nutritional Info</h4>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                                                <span className="text-sm text-gray-500">Calories</span>
                                                                <p className="text-lg font-semibold">
                                                                    {selectedSize?.calories || '600-800'} cal
                                                                </p>
                                                            </div>
                                                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                                                <span className="text-sm text-gray-500">Preparation Time</span>
                                                                <p className="text-lg font-semibold">
                                                                    {selectedSize?.preparationTime || '15-20'} mins
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Allergen Info */}
                                                    <div>
                                                        <h4 className="text-lg font-semibold mb-3">Allergen Information</h4>
                                                        <div className="flex items-center space-x-2 text-yellow-500">
                                                            <AlertCircle className="w-5 h-5" />
                                                            <span>Contains: Gluten, Dairy, Eggs</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
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
                                                disabled={!selectedSize}
                                            >
                                                <span>${totalPrice.toFixed(2)}</span>
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