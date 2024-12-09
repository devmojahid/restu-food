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
    IceCream,
    Tag
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import CartDropdown from './CartDropdown';
import WishlistDropdown from './WishlistDropdown';
import UserDropdown from './UserDropdown';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropdown } from '@/hooks/useDropdown';
import { cn } from '@/lib/utils';
import SearchOverlay from '@/Components/Frontend/SearchOverlay';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { isOpen: isCartOpen, handleToggle: handleCartToggle } = useDropdown();
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollDirection, setScrollDirection] = useState('up');
    const [lastScrollY, setLastScrollY] = useState(0);
    const [openMobileSubmenu, setOpenMobileSubmenu] = useState(null);

    // Enhanced scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 50);
            
            // Determine scroll direction
            if (currentScrollY > lastScrollY) {
                setScrollDirection('down');
            } else {
                setScrollDirection('up');
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Add keyboard navigation support
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    // Enhanced styling for menu items
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
                { 
                    label: 'Pizza', 
                    href: '/menu/pizza', 
                    icon: Pizza,
                    color: 'text-orange-500',
                    bgColor: 'bg-orange-50'
                },
                { 
                    label: 'Burger', 
                    href: '/menu/burger', 
                    icon: Beef,
                    color: 'text-red-500',
                    bgColor: 'bg-red-50'
                },
                { 
                    label: 'Sushi', 
                    href: '/menu/sushi', 
                    icon: Soup,
                    color: 'text-pink-500',
                    bgColor: 'bg-pink-50'
                },
                { 
                    label: 'Pasta', 
                    href: '/menu/pasta', 
                    icon: Coffee,
                    color: 'text-yellow-500',
                    bgColor: 'bg-yellow-50'
                },
                { 
                    label: 'Desserts', 
                    href: '/menu/desserts', 
                    icon: IceCream,
                    color: 'text-purple-500',
                    bgColor: 'bg-purple-50'
                },
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

    // Add this function to handle mobile menu clicks
    const handleMobileMenuClick = (item, e) => {
        if (item.children) {
            e.preventDefault();
            setOpenMobileSubmenu(openMobileSubmenu === item.href ? null : item.href);
        } else {
            setIsMenuOpen(false);
        }
    };

    return (
        <div 
            className={cn(
                "sticky top-0 z-50 w-full bg-white border-b transition-all duration-300",
                isScrolled && "shadow-lg",
                scrollDirection === 'down' && isScrolled && "-translate-y-20",
                "dark:bg-gray-900 dark:border-gray-800"
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 relative z-10">
                        <motion.img 
                            src="/images/logo.png" 
                            alt="Poco" 
                            className="h-12 w-auto"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
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

                                {/* Enhanced Dropdown Menu */}
                                {item.children && (
                                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible 
                                                    group-hover:opacity-100 group-hover:visible 
                                                    transition-all duration-200 w-64 z-50">
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white rounded-lg shadow-xl border p-2"
                                        >
                                            {item.children.map((child) => {
                                                const Icon = child.icon;
                                                return (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        className="flex items-center space-x-3 px-4 py-3 rounded-lg
                                                                 hover:bg-gray-50 group/item transition-all"
                                                    >
                                                        <span className={cn(
                                                            "p-2 rounded-lg transition-colors",
                                                            child.bgColor,
                                                            child.color
                                                        )}>
                                                            <Icon className="w-5 h-5" />
                                                        </span>
                                                        <span className="flex-1 text-gray-700 font-medium 
                                                                     group-hover/item:text-primary">
                                                            {child.label}
                                                        </span>
                                                        <ChevronRight className="w-4 h-4 opacity-0 
                                                                             group-hover/item:opacity-100 
                                                                             group-hover/item:translate-x-1 
                                                                             transition-all" />
                                                    </Link>
                                                );
                                            })}
                                        </motion.div>
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

            {/* Enhanced Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden border-t bg-white dark:bg-gray-900"
                    >
                        <div className="container mx-auto">
                            <nav className="divide-y divide-gray-100 dark:divide-gray-800">
                                {menuItems.map((item) => (
                                    <div key={item.href} className="py-2">
                                        <button
                                            onClick={(e) => handleMobileMenuClick(item, e)}
                                            className={cn(
                                                "flex items-center justify-between w-full p-3 rounded-lg",
                                                "text-left",
                                                window.location.pathname === item.href
                                                    ? "bg-primary/5 text-primary font-medium"
                                                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                                                "transition-colors"
                                            )}
                                        >
                                            <span className="font-medium">{item.label}</span>
                                            {item.children && (
                                                <ChevronDown 
                                                    className={cn(
                                                        "w-5 h-5 text-gray-400 transition-transform duration-200",
                                                        openMobileSubmenu === item.href && "rotate-180"
                                                    )}
                                                />
                                            )}
                                        </button>

                                        {item.children && (
                                            <motion.div
                                                initial="collapsed"
                                                animate={openMobileSubmenu === item.href ? "open" : "collapsed"}
                                                variants={{
                                                    open: { opacity: 1, height: "auto" },
                                                    collapsed: { opacity: 0, height: 0 }
                                                }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pl-4 mt-2 space-y-1">
                                                    {item.children.map((child) => {
                                                        const Icon = child.icon;
                                                        return (
                                                            <Link
                                                                key={child.href}
                                                                href={child.href}
                                                                className={cn(
                                                                    "flex items-center space-x-3 p-3 rounded-lg",
                                                                    "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                                                                    "group transition-colors",
                                                                    window.location.pathname === child.href && "bg-primary/5 text-primary"
                                                                )}
                                                                onClick={() => setIsMenuOpen(false)}
                                                            >
                                                                <span className={cn(
                                                                    "p-2 rounded-lg",
                                                                    child.bgColor,
                                                                    child.color,
                                                                    "transition-colors"
                                                                )}>
                                                                    <Icon className="w-4 h-4" />
                                                                </span>
                                                                <div className="flex-1">
                                                                    <span className="block font-medium text-gray-900 dark:text-white">
                                                                        {child.label}
                                                                    </span>
                                                                    {child.description && (
                                                                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                                                                            {child.description}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </nav>

                            {/* Mobile Quick Actions */}
                            <div className="py-4 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/track-order"
                                        className={cn(
                                            "flex items-center justify-center space-x-2",
                                            "bg-primary/10 text-primary",
                                            "px-4 py-3 rounded-xl",
                                            "hover:bg-primary/20 transition-colors"
                                        )}
                                    >
                                        <MapPin className="w-4 h-4" />
                                        <span className="font-medium">Track Order</span>
                                    </Link>
                                    <Link
                                        href="/offers"
                                        className={cn(
                                            "flex items-center justify-center space-x-2",
                                            "bg-orange-500/10 text-orange-500",
                                            "px-4 py-3 rounded-xl",
                                            "hover:bg-orange-500/20 transition-colors"
                                        )}
                                    >
                                        <Tag className="w-4 h-4" />
                                        <span className="font-medium">Offers</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Mobile Contact Info */}
                            <div className="py-4 space-y-4 border-t dark:border-gray-800">
                                <a 
                                    href="tel:+17189044450" 
                                    className="flex items-center space-x-3 p-3 rounded-lg 
                                             hover:bg-gray-50 dark:hover:bg-gray-800/50 
                                             text-gray-700 dark:text-gray-200 
                                             transition-colors"
                                >
                                    <span className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Phone className="w-5 h-5" />
                                    </span>
                                    <div>
                                        <span className="block font-medium">+1 718-904-4450</span>
                                        <span className="text-sm text-gray-500">Call us for support</span>
                                    </div>
                                </a>
                                <div className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-200">
                                    <span className="p-2 rounded-lg bg-green-500/10 text-green-500">
                                        <Clock className="w-5 h-5" />
                                    </span>
                                    <div>
                                        <span className="block font-medium">Open Hours</span>
                                        <span className="text-sm text-gray-500">8:00 AM - 10:00 PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enhanced Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar; 