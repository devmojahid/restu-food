import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Loader2, Navigation, MapPin, Clock, Phone, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const LiveDeliveryTracking = ({ order, deliveryData, isLoading: parentIsLoading }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [currentLocation, setCurrentLocation] = useState(order?.delivery?.current_location);
    const [directions, setDirections] = useState(null);
    const [eta, setEta] = useState(order?.estimated_delivery_time);
    const [deliveryStatus, setDeliveryStatus] = useState(order?.status);
    const [mapLoading, setMapLoading] = useState(true);

    // Generate unique device ID using timestamp and random string
    const generateDeviceId = useCallback(() => {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 8);
        return `${timestamp}-${randomStr}`;
    }, []);

    const deviceId = useRef(generateDeviceId());

    const mapContainerStyle = {
        width: '100%',
        height: isMobile ? '300px' : '400px'
    };

    const defaultCenter = {
        lat: order?.restaurant?.location?.lat || 23.8103,
        lng: order?.restaurant?.location?.lng || 90.4125
    };

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: window.googleMapsApiKey,
        libraries: ['places']
    });

    // Initialize Google Maps Direction Service
    const initDirectionsService = useCallback(() => {
        if (!window.google) return null;
        return new window.google.maps.DirectionsService();
    }, []);

    // Update route and ETA
    const updateRoute = useCallback(async (driverLocation) => {
        const directionsService = initDirectionsService();
        if (!directionsService || !driverLocation) return;

        try {
            const result = await directionsService.route({
                origin: driverLocation,
                destination: order.delivery_location,
                waypoints: [{
                    location: order.restaurant.location,
                    stopover: true
                }],
                travelMode: window.google.maps.TravelMode.DRIVING,
            });

            setDirections(result);
            setEta(result.routes[0].legs[0].duration.text);
        } catch (error) {
            console.error('Direction Service Error:', error);
        }
    }, [order]);

    // Listen for real-time updates
    useEffect(() => {
        if (!order?.id) return;

        const channel = window.Echo.private(`order.${order.id}`);
        
        channel.listen('.location.updated', (event) => {
            const { location, metadata } = event;
            setCurrentLocation(location);
            updateRoute(location);
            
            if (metadata?.estimated_time) {
                setEta(metadata.estimated_time);
            }

            toast.success('Delivery location updated');
        });

        channel.listen('.status.updated', (event) => {
            setDeliveryStatus(event.status);
            toast.success(`Delivery status updated to: ${event.status}`);
        });

        return () => {
            channel.stopListening('.location.updated');
            channel.stopListening('.status.updated');
        };
    }, [order?.id]);

    // Initialize map and directions
    useEffect(() => {
        if (currentLocation) {
            updateRoute(currentLocation);
        }
        setMapLoading(false);
    }, [currentLocation, updateRoute]);

    const handleContactDriver = useCallback(() => {
        toast.success('Connecting to driver...');
    }, []);

    const handleSendMessage = useCallback(() => {
        toast.success('Opening chat...');
    }, []);

    // Add smooth marker animation
    const DriverMarker = ({ position }) => (
        <motion.div
            initial={false}
            animate={{ x: position.lng, y: position.lat }}
            transition={{ type: "spring", damping: 15 }}
        >
            <Marker
                position={position}
                icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: isMobile ? 6 : 8,
                    fillColor: "#4f46e5",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#ffffff",
                }}
            />
        </motion.div>
    );

    // Add mobile-optimized controls
    const MapControls = () => (
        <div className={cn(
            "absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-800/95",
            "backdrop-blur-sm rounded-lg shadow-lg p-4 space-y-2",
            "md:w-auto md:left-4 md:right-auto"
        )}>
            {/* ... controls content ... */}
        </div>
    );

    // Update device pairing effect
    // useEffect(() => {
    //     if (!order?.delivery?.id) return;

    //     const pairDevice = async () => {
    //         try {
    //             await axios.post('/app/delivery/device/pair', {
    //                 delivery_id: order.delivery.id,
    //                 device_id: deviceId.current,
    //                 role: 'customer'
    //             });

    //             const deviceChannel = window.Echo.private(
    //                 `delivery.${order.delivery.id}.device.${deviceId.current}`
    //             );
                
    //             deviceChannel.listen('.device.update', (event) => {
    //                 if (event.data?.location) {
    //                     setCurrentLocation(event.data.location);
    //                     updateRoute(event.data.location);
    //                 }
    //             });

    //             return () => {
    //                 deviceChannel.stopListening('.device.update');
    //                 axios.post('/app/delivery/device/unpair', {
    //                     delivery_id: order.delivery.id,
    //                     device_id: deviceId.current
    //                 }).catch(console.error);
    //             };
    //         } catch (error) {
    //             console.error('Device pairing failed:', error);
    //             toast.error('Failed to connect to delivery tracking');
    //         }
    //     };

    //     pairDevice();
    // }, [order?.delivery?.id, updateRoute]);

    useEffect(() => {
        if (!order?.delivery?.id) return;
    
        const pairDevice = async () => {
            try {
                // First ensure the device is paired
                await axios.post('/app/delivery/device/pair', {
                    delivery_id: order.delivery.id,
                    device_id: deviceId.current,
                    role: 'customer'
                });
    
                // Use the correct channel format for Reverb
                const deviceChannel = window.Echo
                    .private(`delivery.${order.delivery.id}.device.${deviceId.current}`)
                    .listen('.device.update', (event) => {
                        if (event.data?.location) {
                            setCurrentLocation(event.data.location);
                            updateRoute(event.data.location);
                        }
                    })
                    .error((error) => {
                        console.error('Channel subscription error:', error);
                        toast.error('Connection to delivery tracking lost');
                    });
    
                return () => {
                    deviceChannel.stopListening('.device.update');
                    axios.post('/app/delivery/device/unpair', {
                        delivery_id: order.delivery.id,
                        device_id: deviceId.current
                    }).catch(console.error);
                };
            } catch (error) {
                console.error('Device pairing failed:', error);
                toast.error('Failed to connect to delivery tracking');
            }
        };
    
        pairDevice();
    }, [order?.delivery?.id, updateRoute]);

    if (!order?.delivery) {
        return (
            <Card className="p-4">
                <div className="text-center text-gray-500">
                    No delivery information available
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-4">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Live Delivery Tracking</h3>
                        <p className="text-sm text-muted-foreground">
                            Order #{order?.id}
                        </p>
                    </div>
                    <Badge variant={
                        deliveryStatus === 'delivered' ? 'success' :
                        deliveryStatus === 'picked_up' ? 'warning' :
                        'secondary'
                    }>
                        {deliveryStatus}
                    </Badge>
                </div>

                <div className="relative">
                    {!isLoaded || mapLoading || parentIsLoading ? (
                        <div className="flex items-center justify-center h-[300px] md:h-[400px]">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="relative rounded-lg overflow-hidden">
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={defaultCenter}
                                zoom={13}
                                options={{
                                    zoomControl: !isMobile,
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                    fullscreenControl: !isMobile,
                                    gestureHandling: 'greedy',
                                    styles: [
                                        {
                                            featureType: "poi",
                                            elementType: "labels",
                                            stylers: [{ visibility: "off" }]
                                        }
                                    ]
                                }}
                            >
                                {currentLocation && (
                                    <DriverMarker position={currentLocation} />
                                )}

                                <Marker
                                    position={order.restaurant.location}
                                    icon={{
                                        path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                                        scale: 6,
                                        fillColor: "#22c55e",
                                        fillOpacity: 1,
                                        strokeWeight: 2,
                                        strokeColor: "#ffffff",
                                    }}
                                />

                                <Marker
                                    position={order.delivery_location}
                                    icon={{
                                        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                        scale: 6,
                                        fillColor: "#ef4444",
                                        fillOpacity: 1,
                                        strokeWeight: 2,
                                        strokeColor: "#ffffff",
                                    }}
                                />

                                {directions && (
                                    <DirectionsRenderer
                                        directions={directions}
                                        options={{
                                            suppressMarkers: true,
                                            polylineOptions: {
                                                strokeColor: '#4f46e5',
                                                strokeWeight: 4
                                            }
                                        }}
                                    />
                                )}
                            </GoogleMap>
                            
                            <MapControls />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                    {eta && (
                        <div className="flex items-center space-x-2 bg-secondary/20 p-3 rounded-lg">
                            <Clock className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm font-medium">ETA: {eta}</span>
                        </div>
                    )}

                    <Button
                        variant="outline"
                        className="flex items-center"
                        onClick={handleContactDriver}
                    >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Driver
                    </Button>

                    <Button
                        variant="outline"
                        className="flex items-center"
                        onClick={handleSendMessage}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Message
                    </Button>
                </div>

                {order?.delivery?.driver && (
                    <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
                        <h4 className="font-medium mb-2">Delivery Driver</h4>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Navigation className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">{order.delivery.driver.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    ID: {order.delivery.driver.id}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default LiveDeliveryTracking; 