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
import { motion } from 'framer-motion';
import { useDropdown } from '@/hooks/useDropdown';

const UserDropdown = () => {
    const { isOpen, handleToggle, handleClose } = useDropdown();
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
            description: 'View your order history'
        },
        {
            icon: Heart,
            label: 'Wishlist',
            href: '/wishlist',
            description: 'Your saved items'
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

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-30" 
                        onClick={handleClose}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-40">
                        {/* User Info */}
                        <div className="p-4 border-b">
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
                                    <h4 className="text-base font-semibold text-gray-900 truncate">
                                        {user.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main Menu Items */}
                        <div className="p-2">
                            {menuItems.map((item) => (
                                <div
                                    key={item.href}
                                    className="p-2 focus:bg-gray-50"
                                >
                                    <Link
                                        href={item.href}
                                        className="flex items-center space-x-3 rounded-lg hover:bg-transparent"
                                    >
                                        <span className="p-2 rounded-lg bg-gray-50 text-gray-600">
                                            <item.icon className="w-5 h-5" />
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.label}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.description}
                                            </p>
                                        </div>
                                        {item.badge && (
                                            <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <div className="border-t p-2">
                            {bottomMenuItems.map((item) => (
                                <div
                                    key={item.href}
                                    className="p-2 focus:bg-gray-50"
                                >
                                    <Link
                                        href={item.href}
                                        className="flex items-center space-x-3 rounded-lg hover:bg-transparent"
                                    >
                                        <span className="p-2 rounded-lg bg-gray-50 text-gray-600">
                                            <item.icon className="w-5 h-5" />
                                        </span>
                                        <span className="flex-1 text-sm font-medium text-gray-900">
                                            {item.label}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Logout Button */}
                        <div className="p-2 border-t">
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center space-x-3 rounded-lg w-full hover:bg-transparent"
                            >
                                <span className="p-2 rounded-lg bg-red-50 text-red-600">
                                    <LogOut className="w-5 h-5" />
                                </span>
                                <span className="flex-1 text-sm font-medium text-red-600">
                                    Logout
                                </span>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserDropdown; 