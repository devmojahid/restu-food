import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Users,
    ChevronDown,
    CalendarDays,
    Check,
    X,
    Phone,
    Mail,
    MapPin,
    AlertCircle,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Calendar as CalendarComponent } from "@/Components/ui/calendar";
import { useForm } from '@inertiajs/react';

const BookingSection = ({ booking = null }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedGuests, setSelectedGuests] = useState(2);
    const [isBookingSubmitted, setIsBookingSubmitted] = useState(false);
    const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Inertia form
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        date: selectedDate,
        time: '',
        guests: selectedGuests,
        occasion: '',
        specialRequests: '',
    });

    // If booking is null or empty, display placeholder message
    if (!booking) {
        return (
            <section id="booking" className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Reservations</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Booking Not Available</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            Online reservations are not available at this time. Please contact the restaurant directly to make a booking.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // Generate available time slots
    const generateTimeSlots = () => {
        const slots = [];
        const openTime = booking.hours?.openTime || '10:00';
        const closeTime = booking.hours?.closeTime || '22:00';

        const [openHour, openMinute] = openTime.split(':').map(Number);
        const [closeHour, closeMinute] = closeTime.split(':').map(Number);

        const startDate = new Date();
        startDate.setHours(openHour, openMinute, 0);

        const endDate = new Date();
        endDate.setHours(closeHour, closeMinute, 0);

        // Generate 30-minute time slots
        const currentSlot = new Date(startDate);
        while (currentSlot < endDate) {
            const hour = currentSlot.getHours();
            const minute = currentSlot.getMinutes();

            // Format as 12-hour time
            const formattedHour = hour % 12 || 12;
            const period = hour < 12 ? 'AM' : 'PM';
            const timeString = `${formattedHour}:${minute === 0 ? '00' : minute} ${period}`;

            // Check if this time slot is available
            const isAvailable = !booking.unavailableSlots?.includes(timeString);

            slots.push({
                time: timeString,
                available: isAvailable,
                popular: booking.popularTimes?.includes(timeString) || false
            });

            // Add 30 minutes
            currentSlot.setMinutes(currentSlot.getMinutes() + 30);
        }

        return slots;
    };

    const timeSlots = generateTimeSlots();

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Update form data with current selections
        setData({
            ...data,
            date: selectedDate,
            time: selectedTime,
            guests: selectedGuests
        });

        // Simulate API call
        setTimeout(() => {
            setIsBookingSubmitted(true);
            setShowConfirmation(true);
            reset();
        }, 1000);
    };

    // Format date for display
    const formatDate = (date) => {
        if (!date) return '';
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    return (
        <section id="booking" className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
                        <Calendar className="w-6 h-6 text-primary" />
                        {booking.title || "Make a Reservation"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {booking.description || "Reserve your table now for a memorable dining experience"}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                        {/* Booking Header with Image */}
                        {booking.image && (
                            <div className="h-40 md:h-56 overflow-hidden relative">
                                <img
                                    src={booking.image}
                                    alt="Restaurant interior"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                    <div className="text-center text-white p-4">
                                        <h3 className="text-xl md:text-2xl font-bold">
                                            {booking.imageTitle || "Book Your Experience"}
                                        </h3>
                                        {booking.imageSubtitle && (
                                            <p className="mt-2">{booking.imageSubtitle}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-6 md:p-8">
                            {/* Quick Selection Buttons */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                {/* Date Selection */}
                                <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="justify-between h-auto py-3"
                                        >
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="w-4 h-4 text-primary" />
                                                <span>
                                                    {selectedDate
                                                        ? formatDate(selectedDate)
                                                        : "Select date"
                                                    }
                                                </span>
                                            </div>
                                            <ChevronDown className="w-4 h-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(date) => {
                                                setSelectedDate(date);
                                                setIsDatePopoverOpen(false);
                                            }}
                                            disabled={(date) => {
                                                // Disable past dates
                                                return date < new Date(new Date().setHours(0, 0, 0, 0));
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>

                                {/* Time Selection */}
                                <Select
                                    value={selectedTime}
                                    onValueChange={setSelectedTime}
                                >
                                    <SelectTrigger className="h-auto py-3">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <SelectValue placeholder="Select time" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeSlots.map((slot, index) => (
                                            <SelectItem
                                                key={index}
                                                value={slot.time}
                                                disabled={!slot.available}
                                                className={!slot.available ? "opacity-50" : ""}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <span>{slot.time}</span>
                                                    {slot.popular && (
                                                        <Badge
                                                            variant="outline"
                                                            className="ml-2 bg-primary/10 text-primary text-xs"
                                                        >
                                                            Popular
                                                        </Badge>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Guest Selection */}
                                <Select
                                    value={selectedGuests.toString()}
                                    onValueChange={(value) => setSelectedGuests(parseInt(value))}
                                >
                                    <SelectTrigger className="h-auto py-3">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-primary" />
                                            <SelectValue placeholder="Number of guests" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                            <SelectItem key={num} value={num.toString()}>
                                                {num} {num === 1 ? "Guest" : "Guests"}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="more">More than 10 (Call us)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Booking Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Your full name"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="Your phone number"
                                            required
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-sm">{errors.phone}</p>
                                        )}
                                    </div>

                                    {/* Occasion */}
                                    <div className="space-y-2">
                                        <Label htmlFor="occasion">Occasion</Label>
                                        <Select
                                            value={data.occasion}
                                            onValueChange={(value) => setData('occasion', value)}
                                        >
                                            <SelectTrigger id="occasion">
                                                <SelectValue placeholder="Select occasion (optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="birthday">Birthday</SelectItem>
                                                <SelectItem value="anniversary">Anniversary</SelectItem>
                                                <SelectItem value="date_night">Date Night</SelectItem>
                                                <SelectItem value="business_meal">Business Meal</SelectItem>
                                                <SelectItem value="celebration">Celebration</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Special Requests */}
                                <div className="space-y-2">
                                    <Label htmlFor="specialRequests">Special Requests</Label>
                                    <Textarea
                                        id="specialRequests"
                                        value={data.specialRequests}
                                        onChange={(e) => setData('specialRequests', e.target.value)}
                                        placeholder="Any special requests or dietary requirements?"
                                        rows={4}
                                    />
                                </div>

                                {/* Booking Policies */}
                                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg text-sm space-y-2">
                                    <p className="font-medium flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-primary" />
                                        Reservation Policy
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                                        <li>Please arrive within 15 minutes of your reservation time</li>
                                        <li>Reservations are held for 15 minutes past the scheduled time</li>
                                        <li>For parties of 6 or more, please call us directly</li>
                                        <li>Cancellations must be made at least 4 hours in advance</li>
                                    </ul>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center">
                                    <Button
                                        type="submit"
                                        className="w-full md:w-auto px-8 py-3 rounded-full"
                                        disabled={processing || !selectedDate || !selectedTime}
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            "Book Now"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Booking Notes */}
                    {booking.notes && (
                        <div className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
                            <p>{booking.notes}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-primary" />
                            Reservation Confirmed
                        </DialogTitle>
                        <DialogDescription>
                            Thank you for booking with us. We've sent a confirmation to your email.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg my-4">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <CalendarDays className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Date & Time</p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {formatDate(selectedDate)} at {selectedTime}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Party Size</p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {selectedGuests} {selectedGuests === 1 ? 'guest' : 'guests'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Location</p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {booking.location || "123 Restaurant Street, City"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-between flex-row">
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => setShowConfirmation(false)}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Contact Us
                        </Button>
                        <Button onClick={() => setShowConfirmation(false)}>
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default BookingSection; 