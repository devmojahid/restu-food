import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Clock,
    Car,
    Train,
    Bus,
    Landmark,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Calendar,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/Components/ui/tabs';

const LocationSection = ({ location, schedule }) => {
    const [activeDay, setActiveDay] = useState(getCurrentDay());

    // Helper to get current day of week
    function getCurrentDay() {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
        return days[today];
    }

    const formatHours = (hoursArray) => {
        if (!hoursArray || hoursArray[0] === 'closed') return 'Closed';
        return `${hoursArray[0]} - ${hoursArray[1]}`;
    };

    // Format address for Google Maps link
    const getGoogleMapsUrl = () => {
        if (!location?.address?.formatted) return '#';
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address.formatted)}`;
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Location & Hours
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Find us and plan your visit
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Address and Map */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                        {/* Map Embed */}
                        {location?.coordinates && (
                            <div className="h-[300px] bg-gray-200 dark:bg-gray-700 relative">
                                <iframe
                                    title="Restaurant Location"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${location.coordinates.latitude},${location.coordinates.longitude}&zoom=15`}
                                    allowFullScreen
                                ></iframe>

                                {/* Fallback if API key not set */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                    <div className="text-center p-6">
                                        <MapPin className="h-10 w-10 text-primary mx-auto mb-2" />
                                        <h3 className="text-lg font-medium mb-2">Restaurant Location</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                            {location?.address?.formatted || 'Address not available'}
                                        </p>
                                        <Button
                                            size="sm"
                                            onClick={() => window.open(getGoogleMapsUrl(), '_blank')}
                                        >
                                            Open in Google Maps
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Address Details */}
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                        Address
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {location?.address?.formatted || 'Address not available'}
                                    </p>

                                    <Button
                                        variant="link"
                                        className="px-0 h-auto mt-2 text-primary"
                                        onClick={() => window.open(getGoogleMapsUrl(), '_blank')}
                                    >
                                        Get Directions
                                        <ExternalLink className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Transportation Options */}
                            <div className="space-y-6">
                                {/* Parking */}
                                {location?.parking && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-full bg-primary/10">
                                            <Car className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                                Parking
                                            </h3>
                                            <div className="space-y-2">
                                                {location.parking.valet && (
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                        <span className="text-gray-600 dark:text-gray-300">Valet parking available</span>
                                                    </div>
                                                )}
                                                {location.parking.street && (
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                        <span className="text-gray-600 dark:text-gray-300">Street parking available</span>
                                                    </div>
                                                )}
                                                {location.parking.garage && (
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                        <span className="text-gray-600 dark:text-gray-300">
                                                            {location.parking.garage.name} ({location.parking.garage.distance})
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Public Transport */}
                                {location?.public_transport && location.public_transport.length > 0 && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-full bg-primary/10">
                                            <Train className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                                Public Transport
                                            </h3>
                                            <div className="space-y-2">
                                                {location.public_transport.map((transport, index) => {
                                                    const TransportIcon = transport.type === 'Subway' ? Train : Bus;

                                                    return (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <TransportIcon className="h-4 w-4 text-gray-500" />
                                                            <span className="text-gray-600 dark:text-gray-300">
                                                                {transport.type} {transport.line}: {transport.station} ({transport.distance})
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Nearby Landmarks */}
                                {location?.nearby_landmarks && Object.keys(location.nearby_landmarks).length > 0 && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-full bg-primary/10">
                                            <Landmark className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                                Nearby Landmarks
                                            </h3>
                                            <div className="space-y-2">
                                                {Object.entries(location.nearby_landmarks).map(([landmark, distance], index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <span className="text-gray-600 dark:text-gray-300">
                                                            {landmark}: {distance}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Hours */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 h-full">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-2 rounded-full bg-primary/10">
                                <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Hours
                                </h3>
                            </div>
                        </div>

                        {/* Hours Table */}
                        <Tabs defaultValue="restaurant" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
                                {schedule?.bar_hours && (
                                    <TabsTrigger value="bar">Bar</TabsTrigger>
                                )}
                            </TabsList>

                            <TabsContent value="restaurant" className="mt-4">
                                <Table>
                                    <TableBody>
                                        {schedule?.regular_hours && Object.entries(schedule.regular_hours).map(([day, hours]) => (
                                            <TableRow key={day} className={cn(
                                                day === activeDay && "bg-primary/5"
                                            )}>
                                                <TableCell className="py-2 capitalize font-medium">
                                                    {day === activeDay && (
                                                        <span className="text-primary">Today</span>
                                                    )}
                                                    {day !== activeDay && day}
                                                </TableCell>
                                                <TableCell className="py-2 text-right">
                                                    {formatHours(hours)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>

                            {schedule?.bar_hours && (
                                <TabsContent value="bar" className="mt-4">
                                    <Table>
                                        <TableBody>
                                            {Object.entries(schedule.bar_hours).map(([day, hours]) => (
                                                <TableRow key={day} className={cn(
                                                    day === activeDay && "bg-primary/5"
                                                )}>
                                                    <TableCell className="py-2 capitalize font-medium">
                                                        {day === activeDay && (
                                                            <span className="text-primary">Today</span>
                                                        )}
                                                        {day !== activeDay && day}
                                                    </TableCell>
                                                    <TableCell className="py-2 text-right">
                                                        {formatHours(hours)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                            )}
                        </Tabs>

                        {/* Happy Hour */}
                        {schedule?.happy_hour && Object.values(schedule.happy_hour).some(hour => hour !== null) && (
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    Happy Hour
                                </h4>
                                <Table>
                                    <TableBody>
                                        {Object.entries(schedule.happy_hour)
                                            .filter(([_, hours]) => hours !== null)
                                            .map(([day, hours]) => (
                                                <TableRow key={day} className={cn(
                                                    day === activeDay && "bg-primary/5"
                                                )}>
                                                    <TableCell className="py-2 capitalize font-medium">
                                                        {day === activeDay && (
                                                            <span className="text-primary">Today</span>
                                                        )}
                                                        {day !== activeDay && day}
                                                    </TableCell>
                                                    <TableCell className="py-2 text-right">
                                                        {formatHours(hours)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {/* Special Events */}
                        {schedule?.special_events && schedule.special_events.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Special Events
                                </h4>
                                <Accordion type="single" collapsible>
                                    {schedule.special_events.map((event, index) => (
                                        <AccordionItem key={index} value={`event-${index}`}>
                                            <AccordionTrigger className="text-left">
                                                <div>
                                                    <span className="font-medium">{event.name}</span>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        Every {event.day}, {event.time}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                                    {event.description}
                                                </p>
                                                {event.price && (
                                                    <p className="text-sm">
                                                        <span className="font-medium">Price:</span> ${event.price}
                                                    </p>
                                                )}
                                                {event.reservation_required && (
                                                    <p className="text-sm text-primary mt-1">
                                                        Reservation required
                                                    </p>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        )}

                        {/* Holiday Schedule */}
                        {schedule?.holiday_schedule && schedule.holiday_schedule.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Holiday Hours
                                </h4>
                                <div className="space-y-3">
                                    {schedule.holiday_schedule.map((holiday, index) => (
                                        <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium">{new Date(holiday.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                <span className="text-sm">
                                                    {holiday.hours[0] === 'closed'
                                                        ? <span className="text-red-500">Closed</span>
                                                        : formatHours(holiday.hours)}
                                                </span>
                                            </div>
                                            {holiday.special_menu && (
                                                <p className="text-xs text-primary">
                                                    {holiday.special_menu}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationSection; 