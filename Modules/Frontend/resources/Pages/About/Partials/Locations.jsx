import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    MapPin, 
    Phone, 
    Mail, 
    Clock,
    Globe,
    Navigation,
    Search,
    Building2,
    Users,
    ArrowRight,
    ChevronDown,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";

// Import map library (you'll need to install and configure your preferred map library)
// For example: import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const LocationCard = ({ location, index, onSelect, isActive }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(location)}
            className={cn(
                "group relative cursor-pointer",
                "bg-white dark:bg-gray-800",
                "rounded-2xl overflow-hidden",
                "border-2",
                isActive 
                    ? "border-primary shadow-lg" 
                    : "border-gray-100 dark:border-gray-700",
                "hover:shadow-xl",
                "transition-all duration-300"
            )}
        >
            {/* Location Image */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={location.image}
                    alt={location.city}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Location Badge */}
                <div className="absolute top-4 left-4">
                    <Badge 
                        variant="secondary" 
                        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                    >
                        <Building2 className="w-3 h-3 mr-1" />
                        {location.type}
                    </Badge>
                </div>

                {/* Status Indicator */}
                <div className="absolute top-4 right-4">
                    <div className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm",
                        location.isOpen 
                            ? "text-green-500" 
                            : "text-red-500"
                    )}>
                        {location.isOpen ? 'Open Now' : 'Closed'}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {location.city}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {location.address}
                    </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                    <a 
                        href={`tel:${location.phone}`}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
                    >
                        <Phone className="w-4 h-4 mr-2" />
                        {location.phone}
                    </a>
                    <a 
                        href={`mailto:${location.email}`}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        {location.email}
                    </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {location.restaurantCount}+
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Restaurants
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {location.deliveryPartners}+
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Delivery Partners
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://maps.google.com/?q=${location.coordinates[0]},${location.coordinates[1]}`, '_blank');
                        }}
                    >
                        <Navigation className="w-4 h-4 mr-2" />
                        Directions
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/locations/${location.id}`, '_blank');
                        }}
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Details
                    </Button>
                </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 border-2 border-primary scale-105 opacity-0 
                         group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
        </motion.div>
    );
};

const LocationSearch = ({ onSearch, onFilterChange }) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search by city or address..."
                    className="pl-10"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
            <Select onValueChange={onFilterChange} defaultValue="all">
                <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="headquarters">Headquarters</SelectItem>
                    <SelectItem value="branch">Branch Office</SelectItem>
                    <SelectItem value="hub">Distribution Hub</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

const Locations = ({ data }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [filteredLocations, setFilteredLocations] = useState(data.locations);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Handle search and filtering
    useEffect(() => {
        let filtered = data.locations;
        
        if (searchQuery) {
            filtered = filtered.filter(location => 
                location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                location.address.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterType !== 'all') {
            filtered = filtered.filter(location => location.type === filterType);
        }

        setFilteredLocations(filtered);
    }, [searchQuery, filterType, data.locations]);

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 
                             rounded-full blur-3xl opacity-50 dark:opacity-30" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 
                             rounded-full blur-3xl opacity-50 dark:opacity-30" />
            </div>

            <div className="container mx-auto px-4 relative">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full 
                                bg-primary/10 dark:bg-primary/20 text-primary mb-6"
                    >
                        <Globe className="w-8 h-8" />
                    </motion.div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {data.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {data.description}
                    </p>
                </motion.div>

                {/* Search and Filters */}
                <LocationSearch
                    onSearch={setSearchQuery}
                    onFilterChange={setFilterType}
                />

                {/* Locations Grid and Map */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Locations List */}
                    <div className="space-y-6">
                        {filteredLocations.map((location, index) => (
                            <LocationCard
                                key={location.id || `location-${index}`}
                                location={location}
                                index={index}
                                onSelect={setSelectedLocation}
                                isActive={selectedLocation?.id === location.id}
                            />
                        ))}
                    </div>

                    {/* Map Section */}
                    <div className="sticky top-24 h-[600px] rounded-2xl overflow-hidden 
                                bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        {/* Add your map component here */}
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                Map Component Goes Here
                            </p>
                        </div>
                    </div>
                </div>

                {/* Global Presence Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8"
                >
                    {[
                        {
                            icon: Globe,
                            value: '25+',
                            label: 'Countries',
                            color: 'text-blue-500'
                        },
                        {
                            icon: Building2,
                            value: '100+',
                            label: 'Office Locations',
                            color: 'text-green-500'
                        },
                        {
                            icon: Users,
                            value: '1000+',
                            label: 'Team Members',
                            color: 'text-purple-500'
                        },
                        {
                            icon: MapPin,
                            value: '50+',
                            label: 'Distribution Hubs',
                            color: 'text-red-500'
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative p-6 rounded-2xl",
                                "bg-white dark:bg-gray-800",
                                "border border-gray-100 dark:border-gray-700",
                                "text-center group",
                                "hover:shadow-lg transition-shadow duration-300"
                            )}
                        >
                            <div className={cn(
                                "inline-flex items-center justify-center",
                                "w-12 h-12 rounded-full mb-4",
                                "bg-gray-50 dark:bg-gray-700/50",
                                stat.color,
                                "group-hover:scale-110",
                                "transition-transform duration-300"
                            )}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Locations; 