import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { toast } from 'react-hot-toast';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Loader2, Navigation, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const DeliveryTracker = ({ 
    orderId, 
    deliveryId,
    initialLocation,
    restaurantLocation,
    destinationLocation,
    onLocationUpdate 
}) => {
    const [currentLocation, setCurrentLocation] = useState(initialLocation);
    const [directions, setDirections] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [eta, setEta] = useState(null);
    const [watchId, setWatchId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const mapContainerStyle = {
        width: '100%',
        height: '400px'
    };

    const defaultCenter = {
        lat: initialLocation?.lat || 23.8103,
        lng: initialLocation?.lng || 90.4125
    };

    // Initialize Google Maps Direction Service
    const initDirectionsService = useCallback(() => {
        if (!window.google) return null;
        return new window.google.maps.DirectionsService();
    }, []);

    // Update route and ETA
    const updateRoute = useCallback(async (origin) => {
        const directionsService = initDirectionsService();
        if (!directionsService) return;

        try {
            const result = await directionsService.route({
                origin: origin,
                destination: { lat: destinationLocation.lat, lng: destinationLocation.lng },
                waypoints: [{
                    location: { lat: restaurantLocation.lat, lng: restaurantLocation.lng },
                    stopover: true
                }],
                travelMode: window.google.maps.TravelMode.DRIVING,
            });

            setDirections(result);
            setEta(result.routes[0].legs[0].duration.text);
        } catch (error) {
            console.error('Direction Service Error:', error);
            toast.error('Failed to update route');
        }
    }, [restaurantLocation, destinationLocation]);

    // Start location tracking
    const startTracking = useCallback(() => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setIsTracking(true);

        const id = navigator.geolocation.watchPosition(
            async (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                setCurrentLocation(newLocation);
                await updateRoute(newLocation);

                // Broadcast location update
                try {
                    await axios.post(route('delivery.location.update'), {
                        delivery_id: deliveryId,
                        order_id: orderId,
                        location: newLocation
                    });
                } catch (error) {
                    console.error('Failed to broadcast location:', error);
                }
            },
            (error) => {
                console.error('Geolocation Error:', error);
                toast.error('Failed to get location updates');
                setIsTracking(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        setWatchId(id);
    }, [deliveryId, orderId]);

    // Stop location tracking
    const stopTracking = useCallback(() => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
        setIsTracking(false);
    }, [watchId]);

    // Listen for real-time updates
    useEffect(() => {
        const channel = window.Echo.private(`delivery.${deliveryId}`);
        
        channel.listen('.location.updated', (event) => {
            const { location } = event;
            setCurrentLocation(location);
            updateRoute(location);
        });

        return () => {
            channel.stopListening('.location.updated');
            stopTracking();
        };
    }, [deliveryId]);

    // Initialize map and directions
    useEffect(() => {
        if (currentLocation) {
            updateRoute(currentLocation);
        }
        setIsLoading(false);
    }, [currentLocation]);

    return (
        <Card className="p-4">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Live Delivery Tracking</h3>
                    <Badge variant={isTracking ? "success" : "secondary"}>
                        {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
                    </Badge>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <LoadScript googleMapsApiKey={window.googleMapsApiKey}>
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
                                        url: '/images/delivery-marker.png',
                                        scaledSize: new window.google.maps.Size(40, 40)
                                    }}
                                />
                            )}

                            <Marker
                                position={restaurantLocation}
                                icon={{
                                    url: '/images/restaurant-marker.png',
                                    scaledSize: new window.google.maps.Size(40, 40)
                                }}
                            />

                            <Marker
                                position={destinationLocation}
                                icon={{
                                    url: '/images/destination-marker.png',
                                    scaledSize: new window.google.maps.Size(40, 40)
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
                    </LoadScript>
                )}

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant={isTracking ? "destructive" : "default"}
                            onClick={isTracking ? stopTracking : startTracking}
                            className="flex items-center"
                        >
                            <Navigation className="w-4 h-4 mr-2" />
                            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
                        </Button>
                    </div>

                    {eta && (
                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">ETA: {eta}</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default DeliveryTracker; 