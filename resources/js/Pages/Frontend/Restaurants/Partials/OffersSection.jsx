import React from 'react';
import { motion } from 'framer-motion';
import { Percent, Clock, Tag, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';
import PropTypes from 'prop-types';

const OfferCard = ({ offer }) => {
    if (!offer) return null;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={cn(
                "group relative bg-white dark:bg-gray-800 rounded-xl p-6",
                "border border-primary/20 hover:border-primary transition-colors",
                "overflow-hidden"
            )}
        >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            
            {/* Offer Badge */}
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Percent className="w-5 h-5 text-primary" />
                </div>
                <span className="text-lg font-semibold text-primary">
                    {offer.discount_value}% OFF
                </span>
            </div>

            {/* Offer Details */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {offer.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
                {offer.description}
            </p>

            {/* Offer Meta */}
            <div className="space-y-2 mb-6">
                {/* Code */}
                <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                        Code: <span className="text-primary">{offer.code}</span>
                    </span>
                </div>

                {/* Minimum Order */}
                <div className="flex items-center gap-2 text-sm">
                    <Info className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                        Min. Order: ${offer.minimum_order}
                    </span>
                </div>

                {/* Expiry */}
                {offer.expires_at && (
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                            Expires: {new Date(offer.expires_at).toLocaleDateString()}
                        </span>
                    </div>
                )}
            </div>

            {/* Terms Tooltip */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => navigator.clipboard.writeText(offer.code)}
                        >
                            Copy Code
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-sm">{offer.terms}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </motion.div>
    );
};

const OffersSection = ({ offers = [] }) => {
    if (!Array.isArray(offers)) {
        console.warn('OffersSection: offers prop must be an array');
        return null;
    }

    if (offers.length === 0) {
        return null;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Special Offers
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Save big with our exclusive deals
                        </p>
                    </div>
                    <Button 
                        variant="outline" 
                        className="hidden sm:flex items-center gap-2"
                        asChild
                    >
                        <Link href="/offers">
                            View All
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>

                {/* Offers Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {offers.map((offer) => (
                        <OfferCard key={offer.id} offer={offer} />
                    ))}
                </motion.div>

                {/* Mobile View All Button */}
                <div className="mt-6 sm:hidden">
                    <Button 
                        variant="outline" 
                        className="w-full"
                        asChild
                    >
                        <Link href="/offers">
                            View All Offers
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

OfferCard.propTypes = {
    offer: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
        discount_type: PropTypes.string.isRequired,
        discount_value: PropTypes.number.isRequired,
        minimum_order: PropTypes.number.isRequired,
        expires_at: PropTypes.string,
        terms: PropTypes.string,
    }).isRequired,
};

OffersSection.propTypes = {
    offers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
        discount_type: PropTypes.string.isRequired,
        discount_value: PropTypes.number.isRequired,
        minimum_order: PropTypes.number.isRequired,
        expires_at: PropTypes.string,
        terms: PropTypes.string,
    }))
};

export default OffersSection; 