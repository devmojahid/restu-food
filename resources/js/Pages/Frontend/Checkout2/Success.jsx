import React from 'react';
import { motion } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle,
    Truck,
    Clock,
    MapPin,
    Phone,
    Copy,
    Share,
    ArrowUpRight,
    ArrowRight,
    CalendarClock
} from 'lucide-react';
import Layout from '@/Layouts/Frontend/Layout';
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Timeline,
    TimelineItem,
    TimelineConnector,
    TimelineHeader,
    TimelineIcon,
    TimelineBody,
} from "@/Components/ui/timeline";
import RecommendedItems from './Partials/RecommendedItems';
import { Separator } from "@/Components/ui/separator";

const CheckoutSuccess = ({
    order = {},
    tracking = {},
    recommended_items = []
}) => {
    // Handle copy order ID
    const copyOrderId = () => {
        navigator.clipboard.writeText(order?.order_number || '');
        // In a real app, you'd show a toast notification here
    };

    // Handle share order
    const shareOrder = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Food Order',
                text: `Check out my order #${order?.order_number} from Restu Food!`,
                url: window.location.href,
            });
        } else {
            // Fallback for browsers that don't support the Web Share API
            copyOrderId();
        }
    };

    return (
        <Layout>
            <Head title="Order Confirmation" />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 pt-24 pb-16 px-4 md:px-8 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="container mx-auto flex flex-col items-center text-center"
                >
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Order Confirmed!
                    </h1>

                    <p className="text-white/90 text-lg md:text-xl max-w-xl mb-8">
                        Thank you for your order. We're preparing your delicious food right now!
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center">
                        <Card className="inline-flex bg-white/10 backdrop-blur-sm border-white/20">
                            <CardContent className="p-3 text-center">
                                <div className="text-white/70 text-sm">Order Number</div>
                                <div className="text-white font-mono font-bold flex items-center gap-2">
                                    #{order.order_number || '000000'}
                                    <button onClick={copyOrderId} className="opacity-70 hover:opacity-100">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="inline-flex bg-white/10 backdrop-blur-sm border-white/20">
                            <CardContent className="p-3 text-center">
                                <div className="text-white/70 text-sm">Estimated Time</div>
                                <div className="text-white font-bold flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {order.estimated_time || '30-40 minutes'}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Order Details */}
                    <div className="col-span-2 space-y-8">
                        {/* Delivery Status */}
                        <Card className="border-gray-200 dark:border-gray-700 shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Truck className="w-5 h-5 text-primary" />
                                    Delivery Status
                                </CardTitle>
                                <CardDescription>
                                    Follow the status of your order in real time
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <Timeline>
                                    <TimelineItem>
                                        <TimelineHeader>
                                            <TimelineIcon className="bg-green-500 text-white">
                                                <CheckCircle className="h-4 w-4" />
                                            </TimelineIcon>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">Order Confirmed</span>
                                                <span className="text-gray-500 text-sm">
                                                    {tracking.confirmed_time || '12:30 PM'}
                                                </span>
                                            </div>
                                        </TimelineHeader>
                                        <TimelineConnector />
                                        <TimelineBody className="text-sm text-gray-600 dark:text-gray-300">
                                            Your order has been received and confirmed.
                                        </TimelineBody>
                                    </TimelineItem>

                                    <TimelineItem>
                                        <TimelineHeader>
                                            <TimelineIcon className={tracking.preparing ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700'}>
                                                {tracking.preparing ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : (
                                                    <CalendarClock className="h-4 w-4" />
                                                )}
                                            </TimelineIcon>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">Preparing</span>
                                                {tracking.preparing && (
                                                    <span className="text-gray-500 text-sm">
                                                        {tracking.preparing_time || '12:40 PM'}
                                                    </span>
                                                )}
                                            </div>
                                        </TimelineHeader>
                                        <TimelineConnector />
                                        <TimelineBody className="text-sm text-gray-600 dark:text-gray-300">
                                            Our chefs are preparing your delicious meal.
                                        </TimelineBody>
                                    </TimelineItem>

                                    <TimelineItem>
                                        <TimelineHeader>
                                            <TimelineIcon className={tracking.on_the_way ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700'}>
                                                {tracking.on_the_way ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : (
                                                    <Truck className="h-4 w-4" />
                                                )}
                                            </TimelineIcon>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">On the Way</span>
                                                {tracking.on_the_way && (
                                                    <span className="text-gray-500 text-sm">
                                                        {tracking.on_the_way_time || '1:00 PM'}
                                                    </span>
                                                )}
                                            </div>
                                        </TimelineHeader>
                                        <TimelineConnector />
                                        <TimelineBody className="text-sm text-gray-600 dark:text-gray-300">
                                            Your order is on its way to your delivery address.
                                        </TimelineBody>
                                    </TimelineItem>

                                    <TimelineItem>
                                        <TimelineHeader>
                                            <TimelineIcon className={tracking.delivered ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700'}>
                                                {tracking.delivered ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : (
                                                    <MapPin className="h-4 w-4" />
                                                )}
                                            </TimelineIcon>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">Delivered</span>
                                                {tracking.delivered && (
                                                    <span className="text-gray-500 text-sm">
                                                        {tracking.delivered_time || '1:15 PM'}
                                                    </span>
                                                )}
                                            </div>
                                        </TimelineHeader>
                                        <TimelineBody className="text-sm text-gray-600 dark:text-gray-300">
                                            Your order has been delivered. Enjoy your meal!
                                        </TimelineBody>
                                    </TimelineItem>
                                </Timeline>

                                {order.tracking_url && (
                                    <div className="mt-6 flex justify-center">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2"
                                            asChild
                                        >
                                            <Link href={route('tracking', { id: order.id || 1 })}>
                                                View Detailed Tracking
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card className="border-gray-200 dark:border-gray-700 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-xl">Order Summary</CardTitle>
                                <CardDescription>
                                    Items in your order
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-4">
                                    {(order.items || []).map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <h4 className="font-medium">{item.name}</h4>
                                                    <div className="text-gray-500 text-sm">
                                                        {item.quantity} × ${item.price?.toFixed(2)}
                                                    </div>

                                                    {item.options && Object.keys(item.options).length > 0 && (
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            {Object.entries(item.options).map(([key, value]) => (
                                                                <span key={key} className="inline-block mr-2">
                                                                    {key}: {value}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="font-medium">
                                                ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-4" />

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                        <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                                        <span>${order.delivery_fee?.toFixed(2) || '0.00'}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                        <span>${order.tax?.toFixed(2) || '0.00'}</span>
                                    </div>

                                    {order.tip > 0 && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Tip</span>
                                            <span>${order.tip?.toFixed(2) || '0.00'}</span>
                                        </div>
                                    )}

                                    {order.discount > 0 && (
                                        <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-400">
                                            <span>Discount</span>
                                            <span>-${order.discount?.toFixed(2) || '0.00'}</span>
                                        </div>
                                    )}

                                    <Separator className="my-2" />

                                    <div className="flex items-center justify-between font-bold">
                                        <span>Total</span>
                                        <span>${order.total?.toFixed(2) || '0.00'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Delivery Info & Actions */}
                    <div className="space-y-6">
                        {/* Delivery Information */}
                        <Card className="border-gray-200 dark:border-gray-700 shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    Delivery Information
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Delivery Address
                                    </div>
                                    <div>
                                        <p className="font-medium">{order.address?.name}</p>
                                        <p className="text-sm">
                                            {order.address?.address_line1}
                                            {order.address?.address_line2 && `, ${order.address.address_line2}`}
                                        </p>
                                        <p className="text-sm">
                                            {order.address?.city}, {order.address?.state} {order.address?.zipcode}
                                        </p>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600 pt-1">
                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                        {order.address?.phone || 'No phone provided'}
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Delivery Option
                                    </div>
                                    <div className="font-medium">
                                        {order.delivery_option?.name || 'Standard Delivery'}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        Estimated Delivery: {order.estimated_time || '30-45 minutes'}
                                    </div>
                                </div>

                                {order.special_instructions && (
                                    <>
                                        <Separator />

                                        <div className="space-y-2">
                                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Special Instructions
                                            </div>
                                            <div className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                                {order.special_instructions}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="border-gray-200 dark:border-gray-700 shadow-md">
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={shareOrder}
                                >
                                    <Share className="mr-2 h-4 w-4" />
                                    Share Order Details
                                </Button>

                                <Button
                                    className="w-full justify-start"
                                    asChild
                                >
                                    <Link href={route('frontend.restaurants.index')}>
                                        <ArrowRight className="mr-2 h-4 w-4" />
                                        Continue Shopping
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    asChild
                                >
                                    <Link href="#">
                                        <Phone className="mr-2 h-4 w-4" />
                                        Contact Support
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recommended Items */}
                {recommended_items?.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
                        <RecommendedItems items={recommended_items} />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default CheckoutSuccess; 