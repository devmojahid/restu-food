import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Search, AlertCircle, Loader2, PackageSearch, PizzaIcon, ClipboardList } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { cn } from '@/lib/utils';

const OrderSearch = ({ onOrderNotFound, showNotFoundMessage = false }) => {
    const [orderNumber, setOrderNumber] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [validationError, setValidationError] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();

        // Basic validation
        if (!orderNumber.trim()) {
            setValidationError('Please enter an order number');
            return;
        }

        // Clear any previous errors
        setValidationError('');
        setIsSearching(true);

        // Navigate to the order tracking page with the order number
        router.visit(`/order-tracking/${orderNumber}`, {
            onSuccess: (page) => {
                // Check if the order was actually found
                if (page.props.error || !page.props.order) {
                    if (onOrderNotFound) onOrderNotFound();
                }
                setIsSearching(false);
            },
            onError: () => {
                if (onOrderNotFound) onOrderNotFound();
                setIsSearching(false);
            }
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            id="tracking-content"
            className="w-full py-8"
        >
            <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <PackageSearch className="w-10 h-10 text-primary" />
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Track Your Order
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                    Enter your order number to track your delivery in real-time
                </p>
            </div>

            {showNotFoundMessage && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Order not found</AlertTitle>
                    <AlertDescription>
                        We couldn't find any order with this number. Please check the number and try again.
                    </AlertDescription>
                </Alert>
            )}

            {validationError && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{validationError}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Enter your order number (e.g., ORD-ABC12345)"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className={cn(
                            "pl-10",
                            "h-14",
                            "text-base",
                            "placeholder:text-gray-400",
                            "border-gray-300 dark:border-gray-700",
                            "rounded-xl",
                            "bg-white dark:bg-gray-900",
                            "shadow-sm",
                            "focus:ring-2 focus:ring-primary/50",
                            validationError && "border-red-500 focus:ring-red-500/50"
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full h-14 text-base font-semibold"
                    disabled={isSearching}
                >
                    {isSearching ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Searching...
                        </>
                    ) : (
                        <>
                            Track Order
                        </>
                    )}
                </Button>
            </form>

            {/* Sample Orders Section */}
            <div className="mt-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">
                    Example Order Numbers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { number: 'ORD-ABC12345', status: 'Delivered', icon: PizzaIcon },
                        { number: 'ORD-XYZ67890', status: 'On the way', icon: ClipboardList },
                        { number: 'ORD-DEF45678', status: 'Preparing', icon: PizzaIcon }
                    ].map((order, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            onClick={() => setOrderNumber(order.number)}
                        >
                            <div className="p-2 bg-primary/10 rounded-full">
                                <order.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                    {order.number}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Status: {order.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default OrderSearch; 