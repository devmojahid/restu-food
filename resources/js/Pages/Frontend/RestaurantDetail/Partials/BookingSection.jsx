import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, Users, CreditCard, Clock, Building, DollarSign,
    Mail, PenSquare, CalendarRange, AlertCircle, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { DatePicker } from '@/Components/ui/date-picker';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Badge } from "@/Components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/Components/ui/card";
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Separator } from '@/Components/ui/separator';
import { useToast } from '@/Components/ui/use-toast';

const BookingSection = ({ bookingInfo, restaurant }) => {
    const [bookingDate, setBookingDate] = useState(null);
    const [partySize, setPartySize] = useState("2");
    const [time, setTime] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    if (!bookingInfo) {
        return (
            <div className="py-8 text-center">
                <p className="text-gray-500">Booking information not available</p>
            </div>
        );
    }

    const {
        minimum_party_size = 1,
        maximum_party_size = 10,
        reservation_required = true,
        reservation_window = {},
        private_events = {},
        deposit_required = false,
        cancellation_policy = '',
        special_requests = {}
    } = bookingInfo;

    // Generate available party sizes
    const partySizeOptions = [];
    for (let i = minimum_party_size; i <= maximum_party_size; i++) {
        partySizeOptions.push(i.toString());
    }

    // Generate time slots (for demo purposes)
    const timeSlots = [
        "17:00", "17:30", "18:00", "18:30", "19:00",
        "19:30", "20:00", "20:30", "21:00", "21:30"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!bookingDate || !time || !name || !email || !phone) {
            toast({
                title: "Missing information",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "Booking request sent",
                description: "We'll contact you shortly to confirm your reservation.",
            });

            // Reset form
            setBookingDate(null);
            setPartySize("2");
            setTime("");
            setName("");
            setEmail("");
            setPhone("");
            setSpecialRequests("");
        }, 1500);
    };

    return (
        <div className="space-y-12">
            {/* Title */}
            <div className="text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-4"
                >
                    Reserve a Table
                </motion.h2>
                <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Reservation Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
                >
                    <h3 className="text-xl font-semibold mb-6">Make a Reservation</h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">
                                    Date<span className="text-red-500">*</span>
                                </label>
                                <DatePicker
                                    date={bookingDate}
                                    setDate={setBookingDate}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">
                                    Party Size<span className="text-red-500">*</span>
                                </label>
                                <Select value={partySize} onValueChange={setPartySize}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select party size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {partySizeOptions.map(size => (
                                            <SelectItem key={size} value={size}>
                                                {size} {parseInt(size) === 1 ? 'person' : 'people'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">
                                    Time<span className="text-red-500">*</span>
                                </label>
                                <Select value={time} onValueChange={setTime}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeSlots.map(slot => (
                                            <SelectItem key={slot} value={slot}>
                                                {slot}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">
                                    Full Name<span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">
                                    Phone Number<span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium">
                                Email<span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium">
                                <span>Special Requests</span>
                                {special_requests && (
                                    <div className="flex flex-wrap gap-2 ml-2">
                                        {special_requests.dietary_restrictions && (
                                            <Badge variant="outline" className="text-xs">Dietary Options</Badge>
                                        )}
                                        {special_requests.special_occasions && (
                                            <Badge variant="outline" className="text-xs">Celebrations</Badge>
                                        )}
                                        {special_requests.wine_pre_selection && (
                                            <Badge variant="outline" className="text-xs">Wine Selection</Badge>
                                        )}
                                    </div>
                                )}
                            </label>
                            <Textarea
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                                placeholder="Let us know about any special requests or dietary requirements"
                                rows={4}
                            />
                        </div>

                        {deposit_required && (
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    A deposit is required to secure your reservation.
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing..." : "Request Reservation"}
                        </Button>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            By clicking "Request Reservation", you agree to our reservation policies.
                        </p>
                    </form>
                </motion.div>

                {/* Reservation Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Reservation Policies */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Reservation Policies</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                                    <CalendarRange className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium">Reservation Window</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Up to {reservation_window?.advance_days || 30} days in advance
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Latest: {reservation_window?.latest || 'Same day (if available)'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                                    <Users className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium">Party Size</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {minimum_party_size} to {maximum_party_size} guests
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        For larger parties, see private events
                                    </p>
                                </div>
                            </div>

                            {cancellation_policy && (
                                <div className="flex items-start">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                                        <AlertCircle className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">Cancellation Policy</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {cancellation_policy}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Private Events */}
                    {private_events?.available && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Private Events</CardTitle>
                                <CardDescription>Host your special occasion with us</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Min Guests</p>
                                        <p className="text-xl font-semibold">{private_events.min_guests}</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Max Guests</p>
                                        <p className="text-xl font-semibold">{private_events.max_guests}</p>
                                    </div>
                                </div>

                                <Accordion type="single" collapsible>
                                    <AccordionItem value="spaces">
                                        <AccordionTrigger>Private Spaces</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4">
                                                {private_events.spaces?.map((space, index) => (
                                                    <div key={index} className="flex gap-3">
                                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={space.image || '/images/placeholder-space.jpg'}
                                                                alt={space.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-medium">{space.name}</h5>
                                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                                <Users className="w-3 h-3 mr-1" />
                                                                <span>Up to {space.capacity} guests</span>
                                                            </div>
                                                            {space.minimum_spend && (
                                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                                    <DollarSign className="w-3 h-3 mr-1" />
                                                                    <span>Min. ${space.minimum_spend}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                                <Button
                                    variant="outline"
                                    className="w-full flex items-center justify-center"
                                    onClick={() => window.open(`mailto:${private_events.contact_email}`)}
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Contact for Private Events
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default BookingSection; 