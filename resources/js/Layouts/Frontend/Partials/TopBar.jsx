import React from 'react';
import { Link } from '@inertiajs/react';
import { Phone, MapPin, Clock } from 'lucide-react';

const TopBar = () => {
    return (
        <div className="bg-primary py-2 text-white hidden md:block">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <Phone size={16} />
                            <span>+1 718-904-4450</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin size={16} />
                            <span>71 Madison Ave</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock size={16} />
                            <span>Open: 8:00 AM - 10:00 PM</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/track-order" className="hover:text-gray-200">
                            Track Order
                        </Link>
                        <Link href="/about" className="hover:text-gray-200">
                            About Us
                        </Link>
                        <Link href="/contact" className="hover:text-gray-200">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar; 