import React from 'react';
import { motion } from 'framer-motion';
import {
    Heart,
    ShoppingBag,
    ChevronRight,
    Compass,
    Star,
    Search,
    ArrowRight,
    Gift,
    Utensils,
    ChefHat,
    AlarmClock,
    Bell,
    Calendar
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';

const EmptyWishlist = () => {
    // Sample suggestion cards with links and icons
    const suggestions = [
        {
            title: "Browse Popular Restaurants",
            description: "Discover top-rated restaurants in your area",
            icon: Utensils,
            link: "/restaurants",
            color: "bg-orange-500/10 text-orange-600"
        },
        {
            title: "Explore Trending Dishes",
            description: "See what everyone's talking about right now",
            icon: ChefHat,
            link: "/trending",
            color: "bg-blue-500/10 text-blue-600"
        },
        {
            title: "Special Offers & Deals",
            description: "Find limited-time offers and discounts",
            icon: Gift,
            link: "/offers",
            color: "bg-green-500/10 text-green-600"
        },
        {
            title: "Recently Added Items",
            description: "Check out the newest additions to our menu",
            icon: AlarmClock,
            link: "/new-arrivals",
            color: "bg-purple-500/10 text-purple-600"
        },
    ];

    // Subscription prompt card
    const subscriptionCard = {
        title: "Get Price Drop Alerts",
        description: "Be notified when dishes you're interested in go on sale",
        icon: Bell,
        link: "/notifications/subscribe",
        color: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
    };

    // Animation variants for staggered children
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="py-8 md:py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 p-6">
                    <Heart className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                    Start saving your favorite dishes and restaurants to create your personal collection.
                    Discover dishes, compare prices, and get notified about special offers!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/restaurants">
                        <Button size="lg" className="rounded-full">
                            <Compass className="mr-2 h-4 w-4" />
                            Explore Restaurants
                        </Button>
                    </Link>
                    <Link href="/trending">
                        <Button size="lg" variant="outline" className="rounded-full">
                            <Star className="mr-2 h-4 w-4" />
                            See What's Trending
                        </Button>
                    </Link>
                </div>
            </motion.div>

            <div className="mb-16">
                <h3 className="text-xl font-semibold mb-6 text-center">How to use your wishlist</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col items-center text-center p-6"
                    >
                        <div className="mb-4 rounded-full bg-primary/10 p-4">
                            <Heart className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="text-lg font-medium mb-2">Save Items</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                            Click the heart icon on any dish or restaurant to save it to your wishlist for later.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col items-center text-center p-6"
                    >
                        <div className="mb-4 rounded-full bg-amber-500/10 p-4">
                            <Calendar className="h-6 w-6 text-amber-500" />
                        </div>
                        <h4 className="text-lg font-medium mb-2">Organize Collections</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                            Create custom collections to organize your saved items by occasion, cuisine, or any category you prefer.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col items-center text-center p-6"
                    >
                        <div className="mb-4 rounded-full bg-green-500/10 p-4">
                            <ShoppingBag className="h-6 w-6 text-green-500" />
                        </div>
                        <h4 className="text-lg font-medium mb-2">Order Easily</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                            Move items directly from your wishlist to your cart when you're ready to place an order.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="mb-16">
                <h3 className="text-xl font-semibold mb-6 text-center">Recommended for You</h3>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
                >
                    {suggestions.map((suggestion, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
                        >
                            <div className={`mb-4 rounded-full p-3 inline-flex ${suggestion.color}`}>
                                <suggestion.icon className="h-6 w-6" />
                            </div>
                            <h4 className="text-lg font-medium mb-2">{suggestion.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                                {suggestion.description}
                            </p>
                            <Link
                                href={suggestion.link}
                                className="group inline-flex items-center text-primary hover:underline text-sm font-medium"
                            >
                                Explore
                                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="max-w-3xl mx-auto rounded-xl overflow-hidden"
            >
                <div className={`p-8 ${subscriptionCard.color}`}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">{subscriptionCard.title}</h3>
                            <p className="mb-0 text-white/80">
                                {subscriptionCard.description}
                            </p>
                        </div>
                        <Link href={subscriptionCard.link}>
                            <Button size="lg" className="whitespace-nowrap bg-white text-indigo-600 hover:bg-white/90 hover:text-indigo-700">
                                <Bell className="mr-2 h-4 w-4" />
                                Enable Notifications
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default EmptyWishlist; 