import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Layout from '@/Layouts/Frontend/Layout';
import {
    CheckCircle,
    Clock,
    MapPin,
    Phone,
    Mail,
    User,
    CreditCard,
    Truck,
    ArrowRight,
    Printer,
    Copy,
    HomeIcon,
    ShoppingBag
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@/Components/ui/timeline';
import { Badge } from '@/Components/ui/badge';
import RecommendedItems from './Partials/RecommendedItems';
import { cn } from '@/lib/utils';

const Success = ({ order = {}, tracking = {}, recommended_items = [] }) => {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // In a real app, you would want to show a toast here
        alert("Order number copied to clipboard!");
    };

    const handlePrint = () => {
        window.print();
    };

    // Check if the order exists and has items
    const hasOrder = order && order.items && order.items.length > 0;

    return (
        <Layout>
            <Head title="Order Confirmation" />

            {/* Order Confirmation Header */}
            <motion.div
                className="bg-gradient-to-r from-green-50 to-primary-50 py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <motion.h1
                        className="text-3xl md:text-4xl font-bold mb-3"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Order Confirmed!
                    </motion.h1>
                    <motion.p
                        className="text-lg text-gray-600 max-w-lg mx-auto"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Thank you for your order. We've received your order and will begin processing it right away.
                    </motion.p>

                    <motion.div
                        className="mt-6 bg-white inline-flex items-center px-4 py-2 rounded-full shadow-sm border border-gray-100"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <span className="text-gray-600 mr-2">Order #:</span>
                        <span className="font-semibold">{order?.number || 'ORD-00000'}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 rounded-full h-8 w-8 p-0 flex items-center justify-center"
                            onClick={() => copyToClipboard(order?.number || 'ORD-00000')}
                        >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy order number</span>
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Order Details */}
                    <div className="w-full lg:w-8/12">
                        {/* Delivery Information */}
                        <motion.div
                            className="mb-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-2xl flex items-center">
                                        <Truck className="mr-2 h-6 w-6" />
                                        Delivery Information
                                    </CardTitle>
                                    <CardDescription>
                                        Estimated delivery time: {tracking?.estimated_delivery_time || order?.estimated_delivery || 'Unknown'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {tracking ? (
                                        <div className="space-y-6">
                                            {/* Delivery Status Timeline */}
                                            <Timeline>
                                                {tracking.tracking_steps?.map((step, index) => (
                                                    <TimelineItem key={index}>
                                                        <TimelineSeparator>
                                                            <TimelineDot
                                                                variant={step.completed ? "filled" : "outlined"}
                                                                color={step.completed ? "success" : "gray"}
                                                            />
                                                            {index < tracking.tracking_steps.length - 1 && <TimelineConnector />}
                                                        </TimelineSeparator>
                                                        <TimelineContent>
                                                            <div className="mb-1 flex items-center">
                                                                <h4 className="font-medium text-gray-900">{step.title}</h4>
                                                                <span className="ml-auto text-sm text-gray-500">{step.time}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-600">{step.description}</p>
                                                        </TimelineContent>
                                                    </TimelineItem>
                                                ))}
                                            </Timeline>

                                            {/* Delivery Person Info (if order is on the way) */}
                                            {tracking.current_status === 'on_the_way' && tracking.delivery_person && (
                                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                                    <h4 className="font-medium mb-2">Your Delivery Person</h4>
                                                    <div className="flex items-center">
                                                        {tracking.delivery_person.photo ? (
                                                            <img
                                                                src={tracking.delivery_person.photo}
                                                                alt="Delivery Person"
                                                                className="w-12 h-12 rounded-full object-cover mr-4"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                                                                <User className="w-6 h-6 text-gray-600" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium">{tracking.delivery_person.name}</p>
                                                            <div className="flex items-center text-sm text-gray-600">
                                                                <span className="flex items-center mr-4">
                                                                    <Phone className="w-4 h-4 mr-1" />
                                                                    {tracking.delivery_person.phone}
                                                                </span>
                                                                <span>{tracking.delivery_person.vehicle}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Restaurant Info */}
                                            {tracking.restaurant_name && (
                                                <div className="mt-4 text-sm">
                                                    <p className="text-gray-500">Restaurant:</p>
                                                    <p className="font-medium">{tracking.restaurant_name}</p>
                                                    {tracking.restaurant_address && (
                                                        <p className="text-gray-600 mt-1">
                                                            {tracking.restaurant_address}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-4 text-center text-gray-500">
                                            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                            <p>Tracking information will be available once your order is processed.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Order Details */}
                        <motion.div
                            className="mb-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-2xl flex items-center">
                                        <ShoppingBag className="mr-2 h-6 w-6" />
                                        Order Details
                                    </CardTitle>
                                    <CardDescription>
                                        Placed on {new Date(order?.created_at || Date.now()).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {hasOrder ? (
                                        <>
                                            <div className="divide-y">
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="py-4 flex">
                                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                            {item.image ? (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="h-full w-full object-cover object-center"
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                                                    <span className="text-xs text-gray-500">No image</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="ml-4 flex flex-1 flex-col">
                                                            <div>
                                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                                    <h3>{item.name}</h3>
                                                                    <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                                                </div>
                                                                {item.restaurant && (
                                                                    <p className="mt-1 text-sm text-gray-500">{item.restaurant.name}</p>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                                <p className="text-gray-500">Qty {item.quantity}</p>

                                                                <div className="flex">
                                                                    {item.options && Object.keys(item.options).length > 0 && (
                                                                        <div className="flex gap-1">
                                                                            {Object.entries(item.options).map(([key, value], optIndex) => (
                                                                                <Badge key={optIndex} variant="outline" className="text-xs">
                                                                                    {key}: {value}
                                                                                </Badge>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {item.special_instructions && (
                                                                <p className="mt-2 text-xs italic text-gray-500">
                                                                    Note: {item.special_instructions}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Special Instructions */}
                                            {order.special_instructions && (
                                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                    <h4 className="font-medium text-sm">Special Instructions</h4>
                                                    <p className="mt-1 text-sm text-gray-600">{order.special_instructions}</p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="py-4 text-center text-gray-500">
                                            <p>No order items available.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            className="flex flex-wrap gap-3 mb-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={handlePrint}
                            >
                                <Printer className="mr-2 h-4 w-4" />
                                Print Receipt
                            </Button>
                            <Button asChild className="flex-1">
                                <Link href="/">
                                    <HomeIcon className="mr-2 h-4 w-4" />
                                    Continue Shopping
                                </Link>
                            </Button>
                        </motion.div>

                        {/* Recommended Items */}
                        <motion.div
                            className="mb-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
                            <RecommendedItems items={recommended_items} />
                        </motion.div>
                    </div>

                    {/* Summary & Contact Info */}
                    <div className="w-full lg:w-4/12">
                        <motion.div
                            className="sticky top-24"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {/* Order Summary */}
                            <Card className="mb-6">
                                <CardHeader className="pb-4">
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {order?.summary ? (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Subtotal</span>
                                                <span>${order.summary.subtotal?.toFixed(2) || '0.00'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tax</span>
                                                <span>${order.summary.tax?.toFixed(2) || '0.00'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Delivery Fee</span>
                                                <span>${order.summary.delivery_fee?.toFixed(2) || '0.00'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Service Fee</span>
                                                <span>${order.summary.service_fee?.toFixed(2) || '0.00'}</span>
                                            </div>
                                            {(order.summary.tip > 0) && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Driver Tip</span>
                                                    <span>${order.summary.tip?.toFixed(2) || '0.00'}</span>
                                                </div>
                                            )}
                                            {(order.summary.discount > 0) && (
                                                <div className="flex justify-between text-green-600">
                                                    <span>Discount</span>
                                                    <span>-${order.summary.discount?.toFixed(2) || '0.00'}</span>
                                                </div>
                                            )}

                                            <div className="border-t border-gray-200 mt-3 pt-3">
                                                <div className="flex justify-between font-semibold">
                                                    <span>Total</span>
                                                    <span>${order.summary.total?.toFixed(2) || '0.00'}</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-gray-500 text-center py-2">Summary not available</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Delivery Address */}
                            <Card className="mb-6">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center">
                                        <MapPin className="mr-2 h-5 w-5" />
                                        Delivery Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {order?.delivery_address ? (
                                        <div>
                                            <p className="font-medium">{order.delivery_address.name}</p>
                                            <p className="text-gray-600 mt-1">
                                                {order.delivery_address.address_line_1}
                                                {order.delivery_address.address_line_2 && (
                                                    <>, {order.delivery_address.address_line_2}</>
                                                )}
                                            </p>
                                            <p className="text-gray-600">
                                                {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.postal_code}
                                            </p>
                                            <p className="text-gray-600 mt-1">
                                                {order.delivery_address.phone}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Address not available</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Payment Info */}
                            <Card className="mb-6">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center">
                                        <CreditCard className="mr-2 h-5 w-5" />
                                        Payment Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {order?.payment_method ? (
                                        <div>
                                            {order.payment_method.type === 'card' ? (
                                                <>
                                                    <div className="flex items-center">
                                                        <span className="font-medium">{order.payment_method.brand}</span>
                                                        <span className="ml-2 text-gray-600">****{order.payment_method.last4}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Expires: {order.payment_method.exp_month}/{order.payment_method.exp_year}
                                                    </p>
                                                </>
                                            ) : order.payment_method.type === 'paypal' ? (
                                                <div className="flex items-center">
                                                    <span className="font-medium">PayPal</span>
                                                    <span className="ml-2 text-gray-600">{order.payment_method.email}</span>
                                                </div>
                                            ) : (
                                                <p className="font-medium">{order.payment_method.name || order.payment_method.type}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Payment information not available</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Contact Info */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center">
                                        <User className="mr-2 h-5 w-5" />
                                        Contact Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {order?.contact ? (
                                        <div className="space-y-2">
                                            <p className="font-medium">{order.contact.name}</p>
                                            <div className="flex items-center text-gray-600">
                                                <Mail className="h-4 w-4 mr-2" />
                                                <span>{order.contact.email}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Phone className="h-4 w-4 mr-2" />
                                                <span>{order.contact.phone}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Contact information not available</p>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Success; 