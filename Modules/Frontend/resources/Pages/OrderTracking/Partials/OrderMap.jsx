import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Navigation,
    Store,
    Bike,
    Car,
    LocateFixed,
    AlertCircle,
    Info,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { Badge } from '@/Components/ui/badge';

const OrderMap = ({ mapData = null, restaurant = null }) => {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [map, setMap] = useState(null);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Handle null safety
    if (!mapData) {
        return (
            <Alert variant="destructive" className="mb-8">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Map data is not available</AlertDescription>
            </Alert>
        );
    }

    const {
        customer_location = { lat: 0, lng: 0 },
        restaurant_location = { lat: 0, lng: 0 },
        delivery_person_location = { lat: 0, lng: 0 },
        route = [],
        zoom_level = 14,
        map_center = { lat: 0, lng: 0 }
    } = mapData;

    // Initialize map
    useEffect(() => {
        const loadGoogleMaps = async () => {
            try {
                // Check if Google Maps API is already loaded
                if (window.google && window.google.maps) {
                    initMap();
                    return;
                }

                // Otherwise, load the API
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
                script.async = true;
                script.defer = true;
                script.onload = initMap;
                script.onerror = () => setError('Failed to load Google Maps API');
                document.head.appendChild(script);
            } catch (error) {
                setError('Failed to load map: ' + error.message);
            }
        };

        loadGoogleMaps();
    }, []);

    // Initialize map once the API is loaded
    const initMap = useCallback(() => {
        if (!window.google || !window.google.maps) {
            setError('Google Maps API not available');
            return;
        }

        try {
            const mapElement = document.getElementById('delivery-map');
            if (!mapElement) return;

            const newMap = new window.google.maps.Map(mapElement, {
                center: map_center,
                zoom: zoom_level,
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                styles: [
                    {
                        "featureType": "all",
                        "elementType": "geometry.fill",
                        "stylers": [{ "weight": "2.00" }]
                    },
                    {
                        "featureType": "all",
                        "elementType": "geometry.stroke",
                        "stylers": [{ "color": "#9c9c9c" }]
                    },
                    {
                        "featureType": "all",
                        "elementType": "labels.text",
                        "stylers": [{ "visibility": "on" }]
                    },
                    {
                        "featureType": "administrative",
                        "elementType": "labels.text.fill",
                        "stylers": [{ "color": "#656565" }]
                    },
                    {
                        "featureType": "administrative.locality",
                        "elementType": "labels.text.fill",
                        "stylers": [{ "color": "#656565" }]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [{ "color": "#f2f2f2" }]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": [{ "visibility": "off" }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "all",
                        "stylers": [{ "visibility": "simplified" }]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.icon",
                        "stylers": [{ "visibility": "off" }]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "all",
                        "stylers": [{ "visibility": "off" }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": [{ "color": "#c4c4c4" }, { "visibility": "on" }]
                    }
                ]
            });

            setMap(newMap);

            // Add markers
            addMarkers(newMap);

            // Draw route path
            drawRoute(newMap);

            setMapLoaded(true);
        } catch (error) {
            setError('Error initializing map: ' + error.message);
        }
    }, [map_center, zoom_level, customer_location, restaurant_location, delivery_person_location, route]);

    // Add markers to map
    const addMarkers = useCallback((map) => {
        if (!window.google || !map) return;

        const google = window.google;

        // Customer marker
        new google.maps.Marker({
            position: customer_location,
            map,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>'),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 32)
            },
            title: 'Your Location'
        });

        // Restaurant marker
        new google.maps.Marker({
            position: restaurant_location,
            map,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3zM7 7h.01M11 7h.01M15 7h.01M7 11h.01M11 11h.01M15 11h.01M7 15h.01M11 15h.01M15 15h.01"></path></svg>'),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 16)
            },
            title: restaurant?.name || 'Restaurant'
        });

        // Delivery person marker
        new google.maps.Marker({
            position: delivery_person_location,
            map,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 0v12m0 0-5-5m5 5 5-5"/></svg>'),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 16)
            },
            title: 'Delivery Person'
        });
    }, [customer_location, restaurant_location, delivery_person_location, restaurant]);

    // Draw route between points
    const drawRoute = useCallback((map) => {
        if (!window.google || !map || !route?.length) return;

        const google = window.google;

        const path = new google.maps.Polyline({
            path: route,
            geodesic: true,
            strokeColor: '#4f46e5',
            strokeOpacity: 0.8,
            strokeWeight: 3
        });

        path.setMap(map);
    }, [route]);

    // Get user's current location
    const getUserLocation = useCallback(() => {
        setIsLoadingLocation(true);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setIsLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });

                if (map) {
                    map.setCenter({ lat: latitude, lng: longitude });
                    map.setZoom(15);
                }

                setIsLoadingLocation(false);
            },
            (error) => {
                setError(`Error getting location: ${error.message}`);
                setIsLoadingLocation(false);
            }
        );
    }, [map]);

    // Center map on a specific location
    const centerMap = useCallback((location) => {
        if (!map) return;
        map.setCenter(location);
        map.setZoom(15);
    }, [map]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
        >
            <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        Live Tracking
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Follow your order's journey in real-time
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => centerMap(customer_location)}
                                >
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Your Location
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Center on your delivery address</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => centerMap(restaurant_location)}
                                >
                                    <Store className="w-4 h-4 mr-2" />
                                    Restaurant
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Center on restaurant location</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => centerMap(delivery_person_location)}
                                >
                                    <Bike className="w-4 h-4 mr-2" />
                                    Delivery Person
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Center on delivery person</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={getUserLocation}
                                    disabled={isLoadingLocation}
                                >
                                    {isLoadingLocation ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <LocateFixed className="w-4 h-4 mr-2" />
                                    )}
                                    My Location
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Use your current location</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Map Legend */}
            <div className="px-4 md:px-6 py-2 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap gap-4 items-center justify-center md:justify-start text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Your Location</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Restaurant</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Delivery Person</span>
                </div>
                <Badge variant="outline" className="ml-auto">
                    <Info className="w-3 h-3 mr-1" />
                    Live updates every minute
                </Badge>
            </div>

            <div className="relative">
                {error && (
                    <Alert variant="destructive" className="m-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div
                    id="delivery-map"
                    className="w-full h-[400px] md:h-[500px]"
                    style={{ background: '#f4f4f4' }}
                ></div>

                {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-900/80">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
                            <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default OrderMap; 