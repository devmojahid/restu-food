import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Loader2, Navigation, MapPin, Clock, Phone, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

const LiveDeliveryTracking = ({ order, deliveryData, isLoading: parentIsLoading }) => {
    const [currentLocation, setCurrentLocation] = useState(order?.delivery?.current_location);
    const [directions, setDirections] = useState(null);
    const [eta, setEta] = useState(order?.estimated_delivery_time);
    const [deliveryStatus, setDeliveryStatus] = useState(order?.status);
    const [mapLoading, setMapLoading] = useState(true);

    const mapContainerStyle = {
        width: '100%',
        height: '400px'
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

                {!isLoaded || mapLoading || parentIsLoading ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <div className="relative h-[400px] rounded-lg overflow-hidden">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={defaultCenter}
                            zoom={13}
                            options={{
                                zoomControl: true,
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: false,
                            }}
                        >
                            {currentLocation && (
                                <Marker
                                    position={currentLocation}
                                    icon={{
                                        path: window.google.maps.SymbolPath.CIRCLE,
                                        scale: 8,
                                        fillColor: "#4f46e5",
                                        fillOpacity: 1,
                                        strokeWeight: 2,
                                        strokeColor: "#ffffff",
                                    }}
                                />
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
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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