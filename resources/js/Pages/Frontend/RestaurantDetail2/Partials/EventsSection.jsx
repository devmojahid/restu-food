import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    DollarSign,
    Users,
    PlusCircle,
    Ticket,
    Sparkles,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/Components/ui/dialog';
import { Card, CardContent } from '@/Components/ui/card';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

const EventCard = ({ event, index, onBook }) => {
    // Format date if it exists and is valid
    let eventDate = '';
    let formattedDate = '';
    let isEventPast = false;
    let isEventToday = false;

    try {
        if (event?.date) {
            eventDate = parseISO(event.date);
            formattedDate = format(eventDate, 'EEEE, MMMM d, yyyy');
            isEventPast = isPast(eventDate);
            isEventToday = isToday(eventDate);
        }
    } catch (error) {
        formattedDate = event?.date || 'Date TBD';
    }

    // Status badge based on date and tickets
    const getStatusBadge = () => {
        if (isEventPast) {
            return (
                <Badge variant="outline" className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    Past Event
                </Badge>
            );
        }

        if (event?.tickets?.available === false) {
            return (
                <Badge variant="outline" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    Sold Out
                </Badge>
            );
        }

        if (isEventToday) {
            return (
                <Badge className="bg-amber-500 text-white">
                    Today
                </Badge>
            );
        }

        if (event?.tickets?.remaining && event.tickets.remaining < 10) {
            return (
                <Badge className="bg-orange-500 text-white">
                    Few Tickets Left
                </Badge>
            );
        }

        return (
            <Badge className="bg-green-500 text-white">
                Available
            </Badge>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
        >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Event Image */}
                {event?.image && (
                    <div className="relative w-full h-48 overflow-hidden">
                        <img
                            src={event.image}
                            alt={event.title || 'Event'}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                            {getStatusBadge()}
                        </div>
                    </div>
                )}

                <CardContent className="p-6">
                    {/* Event Date & Time */}
                    <div className="flex items-center mb-3 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <span>{formattedDate}</span>

                        {event?.time && (
                            <>
                                <span className="mx-2">•</span>
                                <Clock className="w-4 h-4 mr-2 text-primary" />
                                <span>{event.time}</span>
                            </>
                        )}
                    </div>

                    {/* Event Title */}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                        {event?.title || 'Upcoming Event'}
                    </h3>

                    {/* Price */}
                    {event?.price && (
                        <div className="flex items-center mb-3 text-sm font-medium">
                            <DollarSign className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                            <span>{event.price}</span>
                        </div>
                    )}

                    {/* Event Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {event?.description || 'No description available'}
                    </p>

                    {/* Tickets Info & CTA */}
                    <div className="flex items-center justify-between">
                        {event?.tickets?.remaining && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">{event.tickets.remaining}</span> tickets remaining
                            </div>
                        )}

                        {!isEventPast && event?.tickets?.available !== false && (
                            <Button
                                onClick={() => onBook(event)}
                                className="ml-auto"
                                disabled={isEventPast}
                            >
                                <Ticket className="w-4 h-4 mr-2" />
                                Book Now
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const BookingForm = ({ event, onClose }) => {
    return (
        <div className="space-y-4">
            <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                    <h4 className="font-medium text-gray-900 dark:text-white">{event?.title || 'Event Booking'}</h4>
                </div>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {event?.date ? format(parseISO(event.date), 'EEEE, MMMM d, yyyy') : 'Date TBD'}
                        {event?.time && ` • ${event.time}`}
                    </div>
                    {event?.price && (
                        <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            {event.price}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                        placeholder="Your full name"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                        placeholder="your@email.com"
                    />
                </div>

                <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Number of Guests
                    </label>
                    <select
                        id="guests"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                    >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                        ))}
                        <option value="7+">7+ guests</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Special Requests (Optional)
                    </label>
                    <textarea
                        id="notes"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                        placeholder="Any dietary restrictions or other requests"
                    />
                </div>
            </div>
        </div>
    );
};

const EventsSection = ({ events }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    // Check if we have valid data
    if (!events || !events.events || events.events.length === 0) {
        return null;
    }

    const eventsList = events.events;

    // Handle booking request
    const handleBookEvent = (event) => {
        setSelectedEvent(event);
        setIsBookingOpen(true);
    };

    // Handle booking submission
    const handleSubmitBooking = () => {
        // In a real app, this would send data to the server
        setIsBookingOpen(false);

        // You could show a success message or redirect
        alert(`Booking request submitted for ${selectedEvent?.title}. You'll receive a confirmation email shortly.`);
    };

    return (
        <div className="py-16">
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {events.title || 'Upcoming Events'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {events.description || 'Join us for special dining experiences and events'}
                </p>
            </div>

            {/* Events Grid */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventsList.map((event, index) => (
                        <EventCard
                            key={event?.id || index}
                            event={event}
                            index={index}
                            onBook={handleBookEvent}
                        />
                    ))}
                </div>

                {/* View All Events Link */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <a
                        href="/events"
                        className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                    >
                        View All Events
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                </motion.div>
            </div>

            {/* Booking Dialog */}
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-xl">
                            <Sparkles className="w-5 h-5 mr-2 text-primary" />
                            Reserve Your Spot
                        </DialogTitle>
                    </DialogHeader>

                    <BookingForm event={selectedEvent} onClose={() => setIsBookingOpen(false)} />

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitBooking}>
                            Confirm Booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EventsSection; 