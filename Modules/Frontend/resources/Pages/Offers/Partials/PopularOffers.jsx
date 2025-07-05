import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import {
    Clock,
    Tag,
    ChevronRight,
    TrendingUp,
    ShoppingBag,
    Star,
    Users,
    Heart,
    ThumbsUp,
    Award,
    Flame
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
        <div className="flex items-center gap-3">
            <div className={cn("p-3 rounded-full", colorClass)}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    </motion.div>
);

const OfferCard = ({ offer, index }) => {
    if (!offer) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
        >
            <div className="p-1">
                <div className="relative h-48 rounded-lg overflow-hidden">
                    <img
                        src={offer.image || '/images/placeholder-offer.jpg'}
                        alt={offer.title || 'Offer'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Popular Badge */}
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <Badge
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center gap-1 px-3 py-1"
                        >
                            <Flame className="w-3 h-3" />
                            <span>Popular</span>
                        </Badge>
                    </div>

                    {/* Discount Badge */}
                    {offer.discount && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {offer.discount}% OFF
                        </div>
                    )}

                    {/* Restaurant Info */}
                    {offer.restaurant && (
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {offer.restaurant.logo && (
                                    <img
                                        src={offer.restaurant.logo}
                                        alt={offer.restaurant.name}
                                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                    />
                                )}
                                <div>
                                    <p className="text-white text-sm font-medium">
                                        {offer.restaurant.name}
                                    </p>
                                    {offer.restaurant.rating && (
                                        <div className="flex items-center">
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            <span className="text-white text-xs ml-1">
                                                {offer.restaurant.rating}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 text-white"
                            >
                                <Heart className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {offer.title || 'Unknown Offer'}
                </CardTitle>
                {offer.category && (
                    <Badge variant="outline" className="font-normal mt-2">
                        {offer.category}
                    </Badge>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {offer.description || 'No description available'}
                </p>

                {/* Stats */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400 flex items-center">
                            <ShoppingBag className="w-4 h-4 mr-1" />
                            Claimed
                        </span>
                        <span className="font-medium">{offer.claims_count || 0}</span>
                    </div>
                    <Progress value={offer.popularity_percentage || 75} className="h-2" />

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                            Popularity
                        </span>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Flame
                                    key={i}
                                    className={cn(
                                        "w-3 h-3",
                                        i < Math.ceil((offer.popularity_percentage || 75) / 20)
                                            ? "text-orange-500 fill-orange-500"
                                            : "text-gray-300 dark:text-gray-600"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Offer Details */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                        <Tag className="w-4 h-4 mr-1" />
                        <span>Code: <span className="font-semibold">{offer.code}</span></span>
                    </div>

                    {offer.valid_until && (
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Until {offer.valid_until}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    asChild
                    className="w-full"
                >
                    <Link
                        href={`/offers/${offer.id}`}
                        className="inline-flex items-center justify-center w-full"
                    >
                        <span>View Offer</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </CardFooter>
        </motion.div>
    );
};

const PopularOffers = ({ offers = [], stats = [] }) => {
    // Safely ensure offers is an array
    const safeOffers = Array.isArray(offers) ? offers : [];

    // Default stats if none provided
    const defaultStats = [
        {
            icon: ThumbsUp,
            label: 'Success Rate',
            value: '94%',
            colorClass: 'bg-gradient-to-br from-green-500 to-emerald-600'
        },
        {
            icon: Users,
            label: 'Happy Users',
            value: '50K+',
            colorClass: 'bg-gradient-to-br from-blue-500 to-indigo-600'
        },
        {
            icon: Award,
            label: 'Top Savings',
            value: '40%',
            colorClass: 'bg-gradient-to-br from-purple-500 to-violet-600'
        },
        {
            icon: TrendingUp,
            label: 'Trending Offers',
            value: '120+',
            colorClass: 'bg-gradient-to-br from-orange-500 to-red-600'
        }
    ];

    // Use provided stats or fallback to defaults
    const displayStats = Array.isArray(stats) && stats.length > 0 ? stats : defaultStats;

    if (safeOffers.length === 0) {
        return (
            <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            Popular Offers
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            No popular offers available at the moment. Check back later!
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayStats.map((stat, index) => (
                            <StatCard
                                key={index}
                                icon={stat.icon}
                                label={stat.label}
                                value={stat.value}
                                colorClass={stat.colorClass}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white 
                                   flex items-center gap-2">
                            <TrendingUp className="w-8 h-8 text-primary" />
                            Popular Offers
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            The most sought-after deals that our customers love
                        </p>
                    </motion.div>

                    <Link
                        href="/offers?sort=popular"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary/90 
                               font-semibold transition-colors group mt-4 md:mt-0"
                    >
                        <span>View All Popular</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {displayStats.map((stat, index) => (
                        <StatCard
                            key={index}
                            icon={stat.icon}
                            label={stat.label}
                            value={stat.value}
                            colorClass={stat.colorClass}
                        />
                    ))}
                </div>

                {/* Offers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {safeOffers.map((offer, index) => (
                        <OfferCard
                            key={offer?.id || index}
                            offer={offer}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularOffers; 