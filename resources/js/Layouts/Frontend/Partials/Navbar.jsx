import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { 
    ShoppingCart, 
    Heart, 
    User, 
    Menu as MenuIcon, 
    Search,
    X,
    ChevronDown,
    MapPin,
    Phone,
    Clock,
    ChevronRight,
    Pizza,
    Beef,
    Soup,
    Coffee,
    IceCream
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import CartDropdown from './CartDropdown';
import WishlistDropdown from './WishlistDropdown';
import UserDropdown from './UserDropdown';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropdown } from '@/hooks/useDropdown';
import { cn } from '@/lib/utils';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { isOpen: isCartOpen, handleToggle: handleCartToggle } = useDropdown();
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Menu items with icons
    const menuItems = [
        { 
            label: 'Home', 
            href: '/',
            icon: null
        },
        { 
            label: 'Menu', 
            href: '/menu',
            icon: null,
            children: [
                { label: 'Pizza', href: '/menu/pizza', icon: Pizza },
                { label: 'Burger', href: '/menu/burger', icon: Beef },
                { label: 'Sushi', href: '/menu/sushi', icon: Soup },
                { label: 'Pasta', href: '/menu/pasta', icon: Coffee },
                { label: 'Desserts', href: '/menu/desserts', icon: IceCream },
            ]
        },
        { 
            label: 'Restaurants', 
            href: '/restaurants',
            icon: null
        },
        { 
            label: 'Offers', 
            href: '/offers',
            icon: null
        },
    ];

    return (
        <div className="fixed w-full z-50">
            {/* Top Bar */}
            <div className={cn(
                "bg-primary/95 backdrop-blur-sm text-white transition-all duration-300",
                isScrolled ? "h-0 opacity-0 overflow-hidden" : "h-10"
            )}>
                <div className="container mx-auto px-4 h-full">
                    <div className="flex items-center justify-between h-full">
                        {/* Left Side - Contact Info */}
                        <div className="hidden md:flex items-center divide-x divide-white/20">
                            <a href="tel:+17189044450" 
                               className="flex items-center space-x-2 pr-4 hover:text-white/90 transition">
                                <Phone className="h-3.5 w-3.5" />
                                <span className="text-sm font-medium">+1 718-904-4450</span>
                            </a>
                            <div className="flex items-center space-x-2 px-4">
                                <MapPin className="h-3.5 w-3.5" />
                                <span className="text-sm">71 Madison Ave</span>
                            </div>
                            <div className="flex items-center space-x-2 pl-4">
                                <Clock className="h-3.5 w-3.5" />
                                <span className="text-sm">Open: 8:00 AM - 10:00 PM</span>
                            </div>
                        </div>

                        {/* Right Side - Quick Links */}
                        <div className="flex items-center space-x-6">
                            <Link href="/track-order" className="text-sm font-medium hover:text-white/90 transition">
                                Track Order
                            </Link>
                            <Link href="/about" className="text-sm font-medium hover:text-white/90 transition">
                                About Us
                            </Link>
                            <Link href="/contact" className="text-sm font-medium hover:text-white/90 transition">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className={cn(
                "bg-white border-b transition-all duration-300",
                isScrolled && "shadow-lg"
            )}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 relative z-10">
                            <img 
                                src="/images/logo.png" 
                                alt="Poco" 
                                className="h-12 w-auto"
                            />
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {menuItems.map((item) => (
                                <div key={item.href} className="relative group">
                                    <Link 
                                        href={item.href}
                                        className={cn(
                                            "flex items-center px-4 py-8 text-base font-medium",
                                            "hover:text-primary transition-colors relative",
                                            window.location.pathname === item.href 
                                                ? "text-primary" 
                                                : "text-gray-700"
                                        )}
                                    >
                                        {item.label}
                                        {item.children && (
                                            <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
                                        )}
                                        
                                        {/* Active Indicator */}
                                        {window.location.pathname === item.href && (
                                            <motion.div 
                                                layoutId="activeIndicator"
                                                className="absolute bottom-6 left-4 right-4 h-0.5 bg-primary"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </Link>

                                    {/* Dropdown Menu */}
                                    {item.children && (
                                        <div className="absolute top-full left-0 pt-2 opacity-0 invisible 
                                                        group-hover:opacity-100 group-hover:visible 
                                                        transition-all duration-200 w-64 z-50">
                                            <div className="bg-white rounded-lg shadow-xl border p-2">
                                                {item.children.map((child) => {
                                                    const Icon = child.icon;
                                                    return (
                                                        <Link
                                                            key={child.href}
                                                            href={child.href}
                                                            className="flex items-center space-x-3 px-4 py-3 rounded-lg
                                                                     hover:bg-gray-50 group/item transition-all"
                                                        >
                                                            <span className="p-2 rounded-lg bg-gray-50 
                                                                           group-hover/item:bg-primary/10 
                                                                           group-hover/item:text-primary 
                                                                           transition-colors">
                                                                <Icon className="w-5 h-5" />
                                                            </span>
                                                            <span className="text-gray-700 font-medium 
                                                                           group-hover/item:text-primary">
                                                                {child.label}
                                                            </span>
                                                            <ChevronRight className="w-4 h-4 ml-auto opacity-0 
                                                                                   group-hover/item:opacity-100 
                                                                                   group-hover/item:translate-x-1 
                                                                                   transition-all" />
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-2">
                            {/* Search */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gray-100 text-gray-700 rounded-full w-10 h-10"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search className="w-5 h-5" />
                            </Button>

                            {/* Cart */}
                            <CartDropdown />

                            {/* Wishlist */}
                            <WishlistDropdown />

                            {/* User Menu */}
                            <UserDropdown />

                            {/* Mobile Menu Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden hover:bg-gray-100 text-gray-700 rounded-full w-10 h-10"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={isMenuOpen ? "close" : "menu"}
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isMenuOpen ? (
                                            <X className="w-5 h-5" />
                                        ) : (
                                            <MenuIcon className="w-5 h-5" />
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="lg:hidden border-t bg-white"
                        >
                            <div className="container mx-auto p-4">
                                <nav className="grid gap-2">
                                    {menuItems.map((item) => (
                                        <div key={item.href}>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center justify-between p-3 rounded-lg",
                                                    window.location.pathname === item.href
                                                        ? "bg-primary/5 text-primary font-medium"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                )}
                                                onClick={() => !item.children && setIsMenuOpen(false)}
                                            >
                                                <span>{item.label}</span>
                                                {item.children && (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </Link>

                                            {item.children && (
                                                <div className="pl-4 mt-1 grid gap-1">
                                                    {item.children.map((child) => {
                                                        const Icon = child.icon;
                                                        return (
                                                            <Link
                                                                key={child.href}
                                                                href={child.href}
                                                                className="flex items-center space-x-3 p-3 rounded-lg
                                                                         hover:bg-gray-50 text-gray-600"
                                                                onClick={() => setIsMenuOpen(false)}
                                                            >
                                                                <span className="p-2 rounded-lg bg-gray-50">
                                                                    <Icon className="w-4 h-4" />
                                                                </span>
                                                                <span>{child.label}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </nav>

                                {/* Mobile Contact Info */}
                                <div className="mt-6 pt-6 border-t space-y-4">
                                    <a href="tel:+17189044450" 
                                       className="flex items-center space-x-3 text-gray-600 hover:text-primary">
                                        <Phone className="w-5 h-5" />
                                        <span className="font-medium">+1 718-904-4450</span>
                                    </a>
                                    <div className="flex items-center space-x-3 text-gray-600">
                                        <MapPin className="w-5 h-5" />
                                        <span>71 Madison Ave</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-gray-600">
                                        <Clock className="w-5 h-5" />
                                        <span>Open: 8:00 AM - 10:00 PM</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="bg-white w-full max-w-3xl mx-auto mt-32 rounded-xl shadow-xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search for food, restaurants..."
                                        className="w-full px-4 py-3 pr-12 border rounded-lg bg-gray-50
                                                 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white"
                                        autoFocus
                                    />
                                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-500 mb-3">Popular Searches</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Pizza', 'Burger', 'Sushi', 'Italian', 'Chinese'].map((term) => (
                                            <button
                                                key={term}
                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 
                                                         text-gray-700 rounded-full text-sm transition-colors"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar; 