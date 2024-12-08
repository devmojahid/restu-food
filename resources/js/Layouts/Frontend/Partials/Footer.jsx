import React from 'react';
import { Link } from '@inertiajs/react';
import { 
    Facebook, 
    Twitter, 
    Instagram, 
    Youtube,
    MapPin,
    Phone,
    Mail,
    Clock,
    ChevronRight
} from 'lucide-react';

const Footer = () => {
    const quickLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'FAQ', href: '/faq' },
    ];

    const categories = [
        { name: 'Pizza', href: '/menu/pizza' },
        { name: 'Burger', href: '/menu/burger' },
        { name: 'Sushi', href: '/menu/sushi' },
        { name: 'Pasta', href: '/menu/pasta' },
        { name: 'Desserts', href: '/menu/desserts' },
    ];

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Youtube, href: '#', label: 'Youtube' },
    ];

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div>
                        <Link href="/">
                            <img 
                                src="/images/logo-light.png" 
                                alt="Poco" 
                                className="h-12 w-auto mb-6"
                            />
                        </Link>
                        <p className="text-gray-400 mb-6">
                            Discover the best food and drinks in your area. Order online for fast delivery.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-primary mt-1" />
                                <span>71 Madison Ave, New York, NY 10013</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-primary" />
                                <span>+1 718-904-4450</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-primary" />
                                <span>info@poco.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Clock className="w-5 h-5 text-primary" />
                                <span>Open: 8:00 AM - 10:00 PM</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-xl font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        href={link.href}
                                        className="hover:text-primary transition-colors flex items-center group"
                                    >
                                        <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white text-xl font-semibold mb-6">Categories</h3>
                        <ul className="space-y-4">
                            {categories.map((category) => (
                                <li key={category.name}>
                                    <Link 
                                        href={category.href}
                                        className="hover:text-primary transition-colors flex items-center group"
                                    >
                                        <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white text-xl font-semibold mb-6">Newsletter</h3>
                        <p className="text-gray-400 mb-6">
                            Subscribe to our newsletter and get latest updates and offers.
                        </p>
                        <form className="mb-6">
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="flex-1 px-4 py-3 bg-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-r-lg transition-colors"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </form>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-center md:text-left">
                            © {new Date().getFullYear()} Poco. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6 mt-4 md:mt-0">
                            <img src="/images/payment/visa.png" alt="Visa" className="h-8" />
                            <img src="/images/payment/mastercard.png" alt="Mastercard" className="h-8" />
                            <img src="/images/payment/paypal.png" alt="PayPal" className="h-8" />
                            <img src="/images/payment/apple-pay.png" alt="Apple Pay" className="h-8" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 