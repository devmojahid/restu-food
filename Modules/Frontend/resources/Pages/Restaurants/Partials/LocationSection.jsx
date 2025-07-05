import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation2, Phone, Globe, Mail, MapPinOff } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import NoData from '@/Components/ui/no-data';

const LocationSection = ({ location = {} }) => {
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Ensure we have valid coordinates
    const coordinates = {
        lat: parseFloat(location?.coordinates?.latitude) || 0,
        lng: parseFloat(location?.coordinates?.longitude) || 0
    };

    // Default map options
    const mapOptions = {
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    };

    // Ensure contact info exists
    const contact = location?.contact || {};
    const address = location?.address || {};

    // If no valid location data, show placeholder
    if (!location || (!coordinates.lat && !coordinates.lng)) {
        return (
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                        Location & Contact
                    </h2>
                    <NoData
                        icon={MapPinOff}
                        title="Location Not Available"
                        description="The location information for this restaurant is currently unavailable. Please check back later."
                    >
                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Go Back
                        </Button>
                    </NoData>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    Location & Contact
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Map */}
                    <div className="lg:col-span-2 h-[400px] rounded-xl overflow-hidden">
                        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                            <GoogleMap
                                mapContainerStyle={{
                                    width: '100%',
                                    height: '100%'
                                }}
                                center={coordinates}
                                zoom={15}
                                options={mapOptions}
                                onLoad={map => {
                                    mapRef.current = map;
                                    setMapLoaded(true);
                                }}
                            >
                                <Marker
                                    position={coordinates}
                                    icon={{
                                        url: '/images/marker.png',
                                        scaledSize: new window.google.maps.Size(40, 40)
                                    }}
                                />
                            </GoogleMap>
                        </LoadScript>
                    </div>

                    {/* Info */}
                    <div className="space-y-6">
                        {/* Address */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    Address
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {address.formatted || 'Address not available'}
                                </p>
                                <Button
                                    variant="link"
                                    className="px-0 text-primary"
                                    onClick={() => {
                                        if (coordinates.lat && coordinates.lng) {
                                            window.open(
                                                `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`,
                                                '_blank'
                                            );
                                        }
                                    }}
                                >
                                    Get Directions
                                    <Navigation2 className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>

                        {/* Contact Info */}
                        {contact && (
                            <>
                                {contact.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Phone className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                Phone
                                            </h3>
                                            <a
                                                href={`tel:${contact.phone}`}
                                                className="text-gray-600 dark:text-gray-400 hover:text-primary"
                                            >
                                                {contact.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {contact.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Mail className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                Email
                                            </h3>
                                            <a
                                                href={`mailto:${contact.email}`}
                                                className="text-gray-600 dark:text-gray-400 hover:text-primary"
                                            >
                                                {contact.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {contact.website && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Globe className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                Website
                                            </h3>
                                            <a
                                                href={contact.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 dark:text-gray-400 hover:text-primary"
                                            >
                                                {new URL(contact.website).hostname}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LocationSection; 