import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import {
    Minus,
    Plus,
    Trash2,
    Edit,
    Info,
    AlertCircle,
    ShoppingBag,
    RefreshCw,
    X,
    MessageSquare,
    Clock,
    Check
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/Components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/Components/ui/popover';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/Components/ui/alert-dialog';
import { Textarea } from '@/Components/ui/textarea';
import { useToast } from '@/Components/ui/use-toast';
import { cn } from '@/lib/utils';

const EmptyCart = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
    >
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Your cart is empty
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
            Looks like you haven't added any items to your cart yet.
            Browse our menu to find your favorite dishes.
        </p>
        <Link
            href="/menu"
            className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-full 
                    hover:bg-primary/90 transition-colors"
        >
            Explore Menu
        </Link>
    </motion.div>
);

const CartItem = ({ item, onUpdateQuantity, onRemove, onInstructionsChange }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isEditingInstructions, setIsEditingInstructions] = useState(false);
    const [instructions, setInstructions] = useState(item.instructions || '');
    const { toast } = useToast();

    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity < 1) return;

        setQuantity(newQuantity);

        setIsUpdating(true);
        try {
            await onUpdateQuantity(item.id, newQuantity);

            toast({
                title: "Cart updated",
                description: `${item.name} quantity updated to ${newQuantity}`,
            });
        } catch (error) {
            // Revert to previous quantity on error
            setQuantity(item.quantity);

            toast({
                title: "Update failed",
                description: "Failed to update item quantity",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemove = async () => {
        setIsRemoving(true);
        try {
            await onRemove(item.id);

            toast({
                title: "Item removed",
                description: `${item.name} was removed from your cart`,
            });
        } catch (error) {
            toast({
                title: "Remove failed",
                description: "Failed to remove item from cart",
                variant: "destructive",
            });
        } finally {
            setIsRemoving(false);
        }
    };

    const handleInstructionsSubmit = () => {
        onInstructionsChange(item.id, instructions);
        setIsEditingInstructions(false);

        toast({
            title: "Instructions updated",
            description: "Your special instructions have been updated",
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
                "rounded-xl overflow-hidden bg-white dark:bg-gray-800",
                "border border-gray-100 dark:border-gray-700",
                "shadow-sm hover:shadow-md transition-all duration-300"
            )}
        >
            <div className="flex flex-col sm:flex-row">
                {/* Item Image */}
                <div className="relative w-full sm:w-32 h-32 sm:h-auto overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                    {!item.is_available && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <Badge variant="destructive" className="text-xs">
                                Currently Unavailable
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Item Details */}
                <div className="flex-1 p-4 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {item.name}
                            </h3>
                            <Link
                                href={`/restaurant/${item.restaurant?.slug || '#'}`}
                                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary"
                            >
                                {typeof item.restaurant === 'string'
                                    ? item.restaurant
                                    : item.restaurant?.name || 'Restaurant'}
                            </Link>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-gray-900 dark:text-white">
                                {formatPrice(item.price)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                each
                            </div>
                        </div>
                    </div>

                    {/* Options */}
                    {item.options && Object.keys(item.options).length > 0 && (
                        <div className="mb-4">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Options:
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(item.options).map(([key, value]) => (
                                    <Badge
                                        key={key}
                                        variant="outline"
                                        className="bg-gray-50 dark:bg-gray-700/50"
                                    >
                                        {key}: {value}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Special Instructions */}
                    <div className="mt-auto">
                        {item.instructions ? (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                                <MessageSquare className="w-4 h-4 mr-1 text-primary" />
                                <span className="truncate">{item.instructions}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-1 h-6 w-6 p-0 rounded-full"
                                    onClick={() => setIsEditingInstructions(true)}
                                >
                                    <Edit className="h-3 w-3" />
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 dark:text-gray-400 text-xs flex items-center"
                                onClick={() => setIsEditingInstructions(true)}
                            >
                                <Edit className="h-3 w-3 mr-1" />
                                Add special instructions
                            </Button>
                        )}
                    </div>

                    {/* Instructions Popover */}
                    <Popover open={isEditingInstructions} onOpenChange={setIsEditingInstructions}>
                        <PopoverContent className="w-80">
                            <div className="space-y-4">
                                <div className="font-medium">Special Instructions</div>
                                <Textarea
                                    placeholder="Add any special requests or instructions for this item..."
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                />
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setInstructions(item.instructions || '');
                                            setIsEditingInstructions(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleInstructionsSubmit}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t dark:border-gray-700">
                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1 || isUpdating || isRemoving}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="mx-3 w-8 text-center">
                                {isUpdating ? (
                                    <RefreshCw className="h-4 w-4 mx-auto animate-spin" />
                                ) : (
                                    quantity
                                )}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={isUpdating || isRemoving}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500"
                                    disabled={isUpdating || isRemoving}
                                >
                                    {isRemoving ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Remove Item</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to remove {item.name} from your cart?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-500 hover:bg-red-600"
                                        onClick={handleRemove}
                                    >
                                        Remove
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const CartItems = ({ items = [], onUpdateQuantity, onRemove, onInstructionsChange }) => {
    const safeItems = Array.isArray(items) ? items : [];
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const handleUpdateQuantity = async (itemId, quantity) => {
        setIsProcessing(true);
        try {
            // In a real app, you would make an API call to update the cart
            if (onUpdateQuantity) {
                await onUpdateQuantity(itemId, quantity);
            } else {
                // Simulate API call if no handler provided
                await new Promise(resolve => setTimeout(resolve, 500));

                // Update item directly in the UI for demo purposes
                const updatedItems = safeItems.map(item =>
                    item.id === itemId ? { ...item, quantity } : item
                );

                // In a real app, you would update the state through a proper state management system
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        setIsProcessing(true);
        try {
            // In a real app, you would make an API call to remove the item
            if (onRemove) {
                await onRemove(itemId);
            } else {
                // Simulate API call if no handler provided
                await new Promise(resolve => setTimeout(resolve, 500));

                // In a real app, you would update the state through a proper state management system
            }
        } catch (error) {
            console.error('Failed to remove item:', error);
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    const handleInstructionsChange = (itemId, instructions) => {
        if (onInstructionsChange) {
            onInstructionsChange(itemId, instructions);
        } else {
            // In a real app, you would update the state through a proper state management system
            console.log('Updated instructions for item', itemId, instructions);
        }
    };

    if (safeItems.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Items in Your Cart ({safeItems.length})
            </h2>

            <AnimatePresence>
                {safeItems.map(item => (
                    <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                        onInstructionsChange={handleInstructionsChange}
                    />
                ))}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-6">
                <Link
                    href="/menu"
                    className="text-primary hover:text-primary/90 font-medium flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add More Items
                </Link>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>Cart updated just now</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Your cart is automatically saved</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default CartItems; 