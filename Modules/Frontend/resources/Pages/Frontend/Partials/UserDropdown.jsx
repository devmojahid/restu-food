import React from 'react';
import { Link } from '@inertiajs/react';
import { 
    User,
    LogOut,
    Settings,
    ShoppingBag,
    Heart,
    MapPin,
    Bell,
    ChevronRight,
    UserCircle,
    Wallet,
    HelpCircle
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropdown } from '@/hooks/useDropdown';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import MobileSheet from '@/Components/ui/mobile-sheet';
import { cn } from '@/lib/utils';

const UserDropdown = () => {
    const { isOpen, handleToggle, handleClose } = useDropdown();
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    const user = {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '/images/avatar.jpg'
    };

    const menuItems = [
        {
            icon: ShoppingBag,
            label: 'My Orders',
            href: '/orders',
            description: 'View your order history',
            badge: 2
        },
        {
            icon: Heart,
            label: 'Wishlist',
            href: '/wishlist',
            description: 'Your saved items',
            badge: 5
        },
        {
            icon: MapPin,
            label: 'Addresses',
            href: '/addresses',
            description: 'Manage delivery addresses'
        },
        {
            icon: Wallet,
            label: 'Payment Methods',
            href: '/payment-methods',
            description: 'Manage your payment options'
        },
        {
            icon: Bell,
            label: 'Notifications',
            href: '/notifications',
            description: 'View your notifications',
            badge: 3
        },
    ];

    const bottomMenuItems = [
        {
            icon: Settings,
            label: 'Settings',
            href: '/settings'
        },
        {
            icon: HelpCircle,
            label: 'Help & Support',
            href: '/support'
        }
    ];

    const UserMenuContent = () => (
        <div className="flex flex-col h-full">
            {/* User Profile Section */}
            <div className="p-4 border-b dark:border-gray-800">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <UserCircle className="w-6 h-6 text-primary" />
                            </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {user.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 
                                     dark:hover:bg-gray-800/50 transition-colors group"
                            onClick={handleClose}
                        >
                            <span className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 
                                         text-gray-600 dark:text-gray-400
                                         group-hover:bg-primary/10 group-hover:text-primary">
                                <item.icon className="w-5 h-5" />
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.label}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.description}
                                </p>
                            </div>
                            {item.badge && (
                                <span className="bg-primary/10 text-primary text-xs font-medium 
                                             px-2 py-1 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t dark:border-gray-800">
                <div className="p-2">
                    {bottomMenuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 
                                     dark:hover:bg-gray-800/50 transition-colors group"
                            onClick={handleClose}
                        >
                            <span className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 
                                         text-gray-600 dark:text-gray-400
                                         group-hover:bg-primary/10 group-hover:text-primary">
                                <item.icon className="w-5 h-5" />
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.label}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                        </Link>
                    ))}
                </div>

                {/* Logout Button */}
                <div className="p-2">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center space-x-3 p-3 rounded-lg w-full 
                                 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
                        onClick={handleClose}
                    >
                        <span className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600">
                            <LogOut className="w-5 h-5" />
                        </span>
                        <span className="text-sm font-medium text-red-600">Logout</span>
                    </Link>
                </div>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100 text-gray-700 rounded-full w-10 h-10"
                    onClick={handleToggle}
                >
                    <User className="w-5 h-5" />
                </Button>

                <AnimatePresence>
                    {isOpen && (
                        <MobileSheet
                            isOpen={isOpen}
                            onClose={handleClose}
                            title="Account"
                            fullHeight
                            className="flex flex-col max-w-lg mx-auto"
                        >
                            <UserMenuContent />
                        </MobileSheet>
                    )}
                </AnimatePresence>
            </>
        );
    }

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 text-gray-700 rounded-full w-10 h-10"
                onClick={handleToggle}
            >
                <User className="w-5 h-5" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-30" 
                            onClick={handleClose}
                        />
                        <div className="absolute right-0 mt-2 w-[320px] bg-white dark:bg-gray-900 
                                    rounded-lg shadow-lg border dark:border-gray-800 z-40">
                            <UserMenuContent />
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserDropdown; 