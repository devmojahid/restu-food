import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import RecommendedItems from './Partials/RecommendedItems';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    Clock,
    MapPin,
    Phone,
    ArrowRight,
    Receipt,
    Star,
    Calendar,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { useToast } from '@/Components/ui/use-toast';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';

const SuccessPage = ({
    hero,
    order = {},
    tracking_info = {},
    estimated_delivery = {},
    recommended_items = [],
    error = null
}) => {
    const { toast } = useToast();

    // Handle error notification
    React.useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            });
        }
    }, [error, toast]);

    // Format price
    const formatPrice = (price) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '';

        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <Layout>
            <Head title="Order Confirmed" />

            {/* Success Hero */}
            <div className="bg-primary/10 dark:bg-primary/5 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-3xl md:text-4xl font-bold mb-4"
                        >
                            {hero?.title || 'Order Confirmed!'}
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-xl text-gray-600 dark:text-gray-400 mb-2"
                        >
                            {hero?.subtitle || 'Your order has been placed successfully!'}
                        </motion.p>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-gray-600 dark:text-gray-400 mb-8"
                        >
                            {hero?.description || 'Thank you for your order. We\'ll keep you updated on the status.'}
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Button asChild size="lg" className="rounded-full">
                                <Link href={tracking_info?.url || '/'}>
                                    Track Order
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>

                            <Button asChild variant="outline" size="lg" className="rounded-full">
                                <Link href="/account/orders">
                                    View All Orders
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Order Summary & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Information */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Receipt className="mr-2 h-5 w-5 text-primary" />
                                        <CardTitle>Order Information</CardTitle>
                                    </div>
                                    <Badge variant="outline">
                                        {order?.status || 'Confirmed'}
                                    </Badge>
                                </div>
                                <CardDescription>
                                    Order #{order?.id || ''}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-3">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                        <p className="font-medium">{formatDate(order?.date) || 'Today'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                                        <p className="font-medium">{formatPrice(order?.summary?.total || 0)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Payment</p>
                                        <p className="font-medium capitalize">
                                            {order?.payment_method?.type?.replace('_', ' ') || 'Card'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Delivery</p>
                                        <p className="font-medium">{estimated_delivery?.time_range || '30-45 min'}</p>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Order Items */}
                                <div>
                                    <h3 className="font-medium mb-4">Order Items</h3>
                                    <div className="space-y-4">
                                        {(order?.items || []).map((item) => (
                                            <div key={item.id} className="flex justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">{item.name}</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {item.quantity} × {formatPrice(item.price)}
                                                        </p>
                                                        {Object.entries(item.options || {}).length > 0 && (
                                                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                                                                {Object.entries(item.options).map(([key, value]) => (
                                                                    <span key={key} className="mr-2">
                                                                        {key}: {value}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-semibold">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Order Summary */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                        <span>{formatPrice(order?.summary?.subtotal || 0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                        <span>{formatPrice(order?.summary?.tax || 0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                                        <span>
                                            {order?.summary?.delivery_fee > 0
                                                ? formatPrice(order.summary.delivery_fee)
                                                : 'Free'}
                                        </span>
                                    </div>
                                    {(order?.summary?.tip > 0) && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Driver Tip</span>
                                            <span>{formatPrice(order.summary.tip)}</span>
                                        </div>
                                    )}
                                    {(order?.summary?.discount > 0) && (
                                        <div className="flex justify-between text-green-600 dark:text-green-400">
                                            <span>Discount</span>
                                            <span>-{formatPrice(order.summary.discount)}</span>
                                        </div>
                                    )}
                                    <Separator className="my-2" />
                                    <div className="flex justify-between font-bold text-base pt-2">
                                        <span>Total</span>
                                        <span>{formatPrice(order?.summary?.total || 0)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Tracking */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center">
                                    <Clock className="mr-2 h-5 w-5 text-primary" />
                                    <CardTitle>Delivery Tracking</CardTitle>
                                </div>
                                <CardDescription>
                                    Estimated delivery by {estimated_delivery?.estimated_arrival || '12:45 PM'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-3">
                                {/* Tracking Steps */}
                                <div className="relative">
                                    {(tracking_info?.steps || []).map((step, index) => {
                                        const isLast = index === tracking_info.steps.length - 1;

                                        return (
                                            <div key={step.id} className="flex mb-6 last:mb-0">
                                                {/* Timeline Line */}
                                                {!isLast && (
                                                    <div className="absolute h-full top-0 left-6 mt-10 z-0 border-l-2 border-dashed border-gray-200 dark:border-gray-700"
                                                        style={{ height: `calc(100% - ${60 * (tracking_info.steps.length - 1)}px)` }} />
                                                )}

                                                {/* Status Icon */}
                                                <div className={cn(
                                                    "z-10 mr-4 w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center",
                                                    step.completed
                                                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                                )}>
                                                    {step.completed ? (
                                                        <CheckCircle className="w-6 h-6" />
                                                    ) : (
                                                        <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600" />
                                                    )}
                                                </div>

                                                {/* Status Details */}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className={cn(
                                                                "font-medium",
                                                                step.completed && "text-green-600 dark:text-green-400"
                                                            )}>
                                                                {step.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                {step.description}
                                                            </p>
                                                        </div>
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                                            {step.time}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild variant="outline" className="w-full rounded-full" size="sm">
                                    <Link href={tracking_info?.url || '/'}>
                                        View Detailed Tracking
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Right Column: Delivery Details */}
                    <div className="space-y-8">
                        {/* Delivery Address */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center">
                                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                                    <CardTitle>Delivery Address</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-0">
                                {order?.shipping_address ? (
                                    <div className="space-y-1">
                                        <p className="font-medium">{order.shipping_address.recipient}</p>
                                        <p className="text-sm">{order.shipping_address.address_line1}</p>
                                        {order.shipping_address.address_line2 && (
                                            <p className="text-sm">{order.shipping_address.address_line2}</p>
                                        )}
                                        <p className="text-sm">
                                            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                                        </p>
                                        <p className="text-sm">{order.shipping_address.country}</p>
                                        <p className="text-sm font-medium mt-2">{order.shipping_address.phone}</p>

                                        {order.shipping_address.delivery_instructions && (
                                            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                                <p className="font-medium mb-1">Delivery Instructions:</p>
                                                <p>{order.shipping_address.delivery_instructions}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        Address information not available
                                    </p>
                                )}

                                {order?.special_instructions && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-sm font-medium mb-1">Special Instructions:</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {order.special_instructions}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Delivery Driver */}
                        {estimated_delivery?.driver && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle>Delivery Driver</CardTitle>
                                </CardHeader>
                                <CardContent className="pb-0">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden">
                                            <img
                                                src={estimated_delivery.driver.avatar}
                                                alt={estimated_delivery.driver.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium">{estimated_delivery.driver.name}</h3>
                                            <div className="flex items-center mt-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                                                <span className="text-sm">{estimated_delivery.driver.rating}</span>
                                            </div>
                                        </div>
                                        <Button size="icon" variant="outline" className="rounded-full flex-shrink-0">
                                            <Phone className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* FAQ & Help */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle>Frequently Asked Questions</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-0">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>How do I change my delivery address?</AccordionTrigger>
                                        <AccordionContent>
                                            Please contact our customer service immediately at (555) 123-4567 to change your delivery address. Changes may be possible depending on the order status.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>What if I'm not home for delivery?</AccordionTrigger>
                                        <AccordionContent>
                                            The delivery driver will wait for 5 minutes and attempt to contact you. You can also add delivery instructions like "leave at door" in the order notes.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>Can I cancel my order?</AccordionTrigger>
                                        <AccordionContent>
                                            Orders can be canceled within 5 minutes of placing them. After that, please contact customer service for assistance as the order may already be in preparation.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                            <CardFooter className="pt-4">
                                <Button asChild variant="outline" className="w-full rounded-full" size="sm">
                                    <Link href="/contact">
                                        Contact Support
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                {/* Recommended Items */}
                {recommended_items.length > 0 && (
                    <div className="mt-16">
                        <Separator className="my-8" />
                        <RecommendedItems items={recommended_items} />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default SuccessPage; 