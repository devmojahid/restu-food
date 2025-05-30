import React from 'react';
import { motion } from 'framer-motion';
import {
    Phone,
    MessageSquare,
    Star,
    Bike,
    UserCheck,
    Award,
    MapPin,
    Clock,
    AlertCircle,
    Store,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Badge } from '@/Components/ui/badge';
import { Link } from '@inertiajs/react';

const DeliveryDetails = ({ deliveryPerson = null, restaurant = null, order = null }) => {
    if (!deliveryPerson && !restaurant) {
        return (
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-6 text-center">
                <Bike className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">Delivery Information Unavailable</h3>
                <p className="text-sm text-gray-500 mt-2">
                    Delivery person and restaurant details are not available at this time.
                </p>
            </div>
        );
    }

    // Format phone number for display if it exists
    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        // Basic formatting - more complex regional formatting could be added
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Person Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden h-full"
            >
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Delivery Details</h2>

                    {!deliveryPerson ? (
                        <div className="text-center py-6">
                            <Bike className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">
                                No delivery person assigned yet
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Delivery Person Profile */}
                            <div className="flex items-center mb-6">
                                <div className="relative mr-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden">
                                        {deliveryPerson.avatar ? (
                                            <img
                                                src={deliveryPerson.avatar}
                                                alt={deliveryPerson.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <UserCheck className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    {deliveryPerson.is_online && (
                                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center">
                                        <h3 className="font-semibold text-lg">{deliveryPerson.name}</h3>
                                        {deliveryPerson.is_verified && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Badge className="ml-2 bg-blue-500/10 text-blue-500">
                                                            <UserCheck className="w-3.5 h-3.5 mr-1" />
                                                            Verified
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Verified delivery partner</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                    <div className="flex items-center mt-1">
                                        <div className="flex items-center mr-3">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                            <span>{deliveryPerson.rating || '0.0'}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {deliveryPerson.total_deliveries || '0'} deliveries
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Status */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                    <div className="flex items-center">
                                        <Bike className="w-5 h-5 text-primary mr-2" />
                                        <span className="font-medium">
                                            {deliveryPerson.status || 'Status unavailable'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {deliveryPerson.updated_at && (
                                            <span>Updated {deliveryPerson.updated_at}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ETA and Location */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                    <div className="flex items-center mb-1">
                                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-500">Estimated Arrival</span>
                                    </div>
                                    <p className="font-semibold">{deliveryPerson.eta || 'Unknown'}</p>
                                </div>

                                <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                    <div className="flex items-center mb-1">
                                        <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-500">Current Location</span>
                                    </div>
                                    <p className="font-semibold">{deliveryPerson.current_location || 'En route'}</p>
                                </div>
                            </div>

                            {/* Contact Options */}
                            <div className="flex space-x-3">
                                {deliveryPerson.phone && (
                                    <Button variant="outline" className="flex-1">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call
                                    </Button>
                                )}
                                <Button variant="secondary" className="flex-1">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Message
                                </Button>
                            </div>

                            {/* Additional Notes */}
                            {deliveryPerson.notes && (
                                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-lg">
                                    <div className="flex items-start">
                                        <AlertCircle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-amber-800 dark:text-amber-300">
                                            {deliveryPerson.notes}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </motion.div>

            {/* Restaurant Card */}
            {restaurant && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden h-full"
                >
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-6">Restaurant</h2>

                        <div className="flex items-center mb-6">
                            <div className="mr-4 flex-shrink-0">
                                {restaurant.logo ? (
                                    <img
                                        src={restaurant.logo}
                                        alt={restaurant.name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                        <Store className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                    <span>{restaurant.rating || '0.0'}</span>
                                    <span className="mx-1">•</span>
                                    <span>{restaurant.reviews_count || '0'} reviews</span>
                                </div>
                            </div>
                        </div>

                        {/* Restaurant Details */}
                        <div className="space-y-3 mb-6">
                            {restaurant.address && (
                                <div className="flex items-start">
                                    <MapPin className="w-4 h-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-sm text-gray-500">
                                        {restaurant.address.formatted || restaurant.address}
                                    </span>
                                </div>
                            )}

                            {restaurant.phone && (
                                <div className="flex items-center">
                                    <Phone className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-500">{restaurant.phone}</span>
                                </div>
                            )}

                            {restaurant.delivery_time && (
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-500">
                                        Avg. delivery time: {restaurant.delivery_time}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Restaurant Link */}
                        {restaurant.slug && (
                            <Link
                                href={`/restaurants/${restaurant.slug}`}
                                className="flex items-center justify-center w-full bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-md transition-colors"
                            >
                                <Store className="w-4 h-4 mr-2" />
                                <span>View Restaurant</span>
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </Link>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default DeliveryDetails; 