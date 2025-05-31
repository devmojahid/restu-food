import React from 'react';
import { 
    Calendar, 
    Clock, 
    DollarSign, 
    Users, 
    Check, 
    Info, 
    Utensils,
    MapPin,
    Phone,
    AlertCircle,
    CalendarRange
} from 'lucide-react';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';

const BookingInfo = ({ data = {} }) => {
    if (!data || Object.keys(data).length === 0) {
        return null;
    }

    // Helper function to safely render service information
    const renderService = (service, index) => {
        if (typeof service === 'string') {
            return service;
        }
        if (typeof service === 'object' && service !== null) {
            return service.name || service.description || `Service ${index + 1}`;
        }
        return `Service ${index + 1}`;
    };

    // Helper function to safely render area information
    const renderArea = (area, index) => {
        if (typeof area === 'string') {
            return area;
        }
        if (typeof area === 'object' && area !== null) {
            return area.name || area.area || `Area ${index + 1}`;
        }
        return `Area ${index + 1}`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">Booking Information</h3>
            
            {/* Availability Alert */}
            {data.availability_status && (
                <Alert 
                    className={`mb-4 ${
                        data.availability_status === 'available' 
                            ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}
                >
                    {data.availability_status === 'available' ? (
                        <Check className="h-4 w-4" />
                    ) : (
                        <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>
                        {data.availability_status === 'available' 
                            ? 'Available for booking' 
                            : 'Limited availability - book soon'
                        }
                    </AlertDescription>
                </Alert>
            )}
            
            {/* Booking Details */}
            <div className="space-y-4">
                {/* Available Dates */}
                {data.available_dates && (
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <CalendarRange className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-medium">Available Dates</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {String(data.available_dates)}
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Advance Booking */}
                {data.advance_booking && (
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-medium">Advance Booking</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {String(data.advance_booking)} days in advance
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Duration */}
                {data.duration && (
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-medium">Service Duration</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {String(data.duration)}
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Price Range */}
                {data.price_range && (
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-medium">Price Range</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {String(data.price_range)}
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Group Size */}
                {data.group_size && (
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-medium">Group Size</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {String(data.group_size)}
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Services */}
                {data.services && Array.isArray(data.services) && data.services.length > 0 && (
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Utensils className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-medium">Services Offered</h4>
                            <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1 mt-1">
                                {data.services.map((service, index) => (
                                    <li key={index} className="flex items-start">
                                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{renderService(service, index)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                
                {/* Service Areas */}
                {data.service_areas && Array.isArray(data.service_areas) && data.service_areas.length > 0 && (
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-medium">Service Areas</h4>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {data.service_areas.map((area, index) => (
                                    <span 
                                        key={index}
                                        className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                                    >
                                        {renderArea(area, index)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Booking Policy */}
            {data.booking_policy && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-2 mb-3">
                        <Info className="w-4 h-4 text-primary mt-1" />
                        <h4 className="font-medium">Booking Policy</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {String(data.booking_policy)}
                    </p>
                </div>
            )}
            
            {/* Contact for Booking */}
            {data.booking_contact && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                        <Phone className="w-4 h-4 text-primary" />
                        <h4 className="font-medium">Contact for Booking</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {data.booking_contact?.description ? String(data.booking_contact.description) : 'For detailed inquiries about booking this chef, please contact us.'}
                    </p>
                    
                    <Button asChild className="w-full">
                        <Link href={data.booking_contact?.link || '#'}>
                            Contact for Booking
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default BookingInfo;