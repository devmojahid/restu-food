import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import {
    Clock,
    Tag,
    ChevronRight,
    Calendar,
    ExternalLink,
    AlertCircle,
    Utensils,
    BookOpen
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { cn } from '@/lib/utils';

const EmptyState = () => (
    <div className="text-center py-12">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
        >
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Latest Offers</h3>
            <p className="text-gray-500">There are no new offers available at the moment. Check back later for fresh deals!</p>
        </motion.div>
    </div>
);

const OfferCard = ({ offer, index }) => {
    if (!offer) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group overflow-hidden"
        >
            <Card className="h-full transition-all duration-300 hover:shadow-lg border-gray-200 dark:border-gray-800">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={offer.image || '/images/placeholder-offer.jpg'}
                        alt={offer.title || 'Offer'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Discount Badge */}
                    {offer.discount && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {offer.discount}% OFF
                        </div>
                    )}

                    {/* Created Date */}
                    {offer.created_at && (
                        <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>
                                {new Date(offer.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardHeader className="space-y-2">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {offer.title || 'Unknown Offer'}
                    </CardTitle>

                    <div className="flex items-center gap-2 flex-wrap">
                        {offer.restaurant && (
                            <Link
                                href={`/restaurants/${offer.restaurant.slug || offer.restaurant.id}`}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors flex items-center"
                            >
                                {offer.restaurant.logo && (
                                    <img
                                        src={offer.restaurant.logo}
                                        alt={offer.restaurant.name}
                                        className="w-4 h-4 rounded-full mr-1 object-cover"
                                    />
                                )}
                                <span>{offer.restaurant.name}</span>
                            </Link>
                        )}

                        {offer.category && (
                            <Badge variant="secondary" className="font-normal">
                                {offer.category}
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                        {offer.description || 'No description available'}
                    </p>

                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
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
                    <Link
                        href={`/offers/${offer.id}`}
                        className="inline-flex items-center justify-center w-full bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold transition-colors group"
                    >
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

const LatestOffers = ({ offers = [] }) => {
    // Safely ensure offers is an array
    const safeOffers = Array.isArray(offers) ? offers : [];

    if (safeOffers.length === 0) {
        return <EmptyState />;
    }

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            Latest Offers
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Check out our most recent deals and promotions
                        </p>
                    </motion.div>

                    <Link
                        href="/offers?sort=newest"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary/90 
                               font-semibold transition-colors group mt-4 md:mt-0"
                    >
                        <span>View All Latest</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

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

export default LatestOffers; 