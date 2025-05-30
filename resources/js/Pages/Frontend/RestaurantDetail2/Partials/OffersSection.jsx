import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Gift,
    Tag,
    Calendar,
    Clock,
    Users,
    Copy,
    Check,
    AlertCircle,
    ArrowUpRight,
    Info,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/Components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

const OffersSection = ({ offers = null }) => {
    const [copiedCode, setCopiedCode] = useState(null);
    const [showTerms, setShowTerms] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);

    // If offers is null or empty, display placeholder message
    if (!offers || offers.length === 0) {
        return (
            <section id="offers" className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Special Offers</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                        <Gift className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Current Offers</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            We don't have any active offers at the moment. Please check back later for special deals and promotions.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // Copy promo code to clipboard
    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        });
    };

    // Format date range
    const formatDateRange = (startDate, endDate) => {
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).format(date);
        };

        if (startDate && endDate) {
            return `${formatDate(startDate)} - ${formatDate(endDate)}`;
        } else if (startDate) {
            return `From ${formatDate(startDate)}`;
        } else if (endDate) {
            return `Until ${formatDate(endDate)}`;
        }

        return 'Limited time offer';
    };

    // Check if offer is expiring soon (within 3 days)
    const isExpiringSoon = (endDate) => {
        if (!endDate) return false;

        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 && diffDays <= 3;
    };

    return (
        <section id="offers" className="py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                            <Gift className="w-6 h-6 text-primary" />
                            Special Offers & Promotions
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Exclusive deals and discounts to enhance your dining experience
                        </p>
                    </div>

                    {offers.allOffersLink && (
                        <a
                            href={offers.allOffersLink}
                            className="inline-flex items-center gap-2 mt-4 md:mt-0 text-primary hover:text-primary/90 font-medium transition-colors"
                        >
                            <span>View All Offers</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {offers.map((offer, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={cn(
                                "bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md relative group",
                                offer.featured && "border-2 border-primary"
                            )}
                        >
                            {/* Featured Badge */}
                            {offer.featured && (
                                <div className="absolute top-4 left-0 z-10">
                                    <Badge className="bg-primary text-white rounded-l-none px-3">
                                        Featured
                                    </Badge>
                                </div>
                            )}

                            {/* Expiring Soon Badge */}
                            {isExpiringSoon(offer.endDate) && (
                                <div className="absolute top-4 right-4 z-10">
                                    <Badge className="bg-red-500 text-white px-3 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Ends Soon
                                    </Badge>
                                </div>
                            )}

                            {/* Offer Image */}
                            {offer.image ? (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={offer.image}
                                        alt={offer.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            ) : (
                                <div className="h-48 bg-primary/10 flex items-center justify-center">
                                    <Gift className="w-16 h-16 text-primary/30" />
                                </div>
                            )}

                            {/* Offer Content */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {offer.description}
                                    </p>
                                </div>

                                {/* Offer Details */}
                                <div className="space-y-3 mb-5">
                                    {/* Discount/Value */}
                                    {offer.discount && (
                                        <div className="flex items-start gap-2">
                                            <Tag className="w-5 h-5 text-primary mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {offer.discount}
                                            </span>
                                        </div>
                                    )}

                                    {/* Validity */}
                                    {(offer.startDate || offer.endDate) && (
                                        <div className="flex items-start gap-2">
                                            <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {formatDateRange(offer.startDate, offer.endDate)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Days/Times */}
                                    {offer.validDays && (
                                        <div className="flex items-start gap-2">
                                            <Clock className="w-5 h-5 text-primary mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {offer.validDays}
                                                {offer.validTimes && `, ${offer.validTimes}`}
                                            </span>
                                        </div>
                                    )}

                                    {/* Minimum Requirements */}
                                    {offer.minimumRequirement && (
                                        <div className="flex items-start gap-2">
                                            <Users className="w-5 h-5 text-primary mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {offer.minimumRequirement}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Promo Code */}
                                {offer.promoCode && (
                                    <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-md p-2 mb-4">
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Promo Code:</div>
                                            <div className="font-mono font-bold text-primary">
                                                {offer.promoCode}
                                            </div>
                                        </div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleCopyCode(offer.promoCode)}
                                                        className="h-8 w-8"
                                                    >
                                                        {copiedCode === offer.promoCode ? (
                                                            <Check className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{copiedCode === offer.promoCode ? 'Copied!' : 'Copy code'}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <Button
                                        className="flex-1"
                                        onClick={() => setSelectedOffer(offer)}
                                    >
                                        Redeem Offer
                                    </Button>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedOffer(offer);
                                                        setShowTerms(true);
                                                    }}
                                                >
                                                    <Info className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Terms & Conditions</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Terms & Conditions Dialog */}
                <Dialog open={showTerms} onOpenChange={setShowTerms}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Terms & Conditions</DialogTitle>
                            <DialogDescription>
                                {selectedOffer?.title || "Offer"} - Terms and conditions
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4 max-h-[50vh] overflow-y-auto">
                            {selectedOffer?.terms ? (
                                <div className="space-y-4 text-sm">
                                    {selectedOffer.terms.map((term, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <div className="flex-shrink-0 text-primary">•</div>
                                            <p className="text-gray-700 dark:text-gray-300">{term}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No specific terms available for this offer.</p>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button onClick={() => setShowTerms(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Offer Redemption Dialog */}
                <Dialog open={selectedOffer && !showTerms} onOpenChange={(open) => !open && setSelectedOffer(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Redeem Offer</DialogTitle>
                            <DialogDescription>
                                {selectedOffer?.title || "Special offer"} - Redemption details
                            </DialogDescription>
                        </DialogHeader>

                        {selectedOffer && (
                            <div className="py-4">
                                {/* Offer Image */}
                                {selectedOffer.image && (
                                    <div className="h-40 mb-6 overflow-hidden rounded-md">
                                        <img
                                            src={selectedOffer.image}
                                            alt={selectedOffer.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Offer Details */}
                                <div className="space-y-4 mb-6">
                                    <div className="text-center mb-4">
                                        <h3 className="text-lg font-bold">{selectedOffer.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {selectedOffer.description}
                                        </p>
                                    </div>

                                    {/* Promo Code */}
                                    {selectedOffer.promoCode && (
                                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Use this code at checkout:
                                            </div>
                                            <div className="font-mono text-xl font-bold text-primary tracking-wider">
                                                {selectedOffer.promoCode}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => handleCopyCode(selectedOffer.promoCode)}
                                            >
                                                {copiedCode === selectedOffer.promoCode ? (
                                                    <>
                                                        <Check className="h-4 w-4 mr-2" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4 mr-2" />
                                                        Copy Code
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}

                                    {/* How to Redeem */}
                                    {selectedOffer.howToRedeem && (
                                        <div>
                                            <h4 className="font-semibold mb-2">How to Redeem:</h4>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {selectedOffer.howToRedeem}
                                            </p>
                                        </div>
                                    )}

                                    {/* Validity */}
                                    {(selectedOffer.startDate || selectedOffer.endDate) && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <div>
                                                <h4 className="font-semibold">Valid:</h4>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {formatDateRange(selectedOffer.startDate, selectedOffer.endDate)}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Terms Link */}
                                    <button
                                        className="text-sm text-primary hover:underline flex items-center gap-1"
                                        onClick={() => setShowTerms(true)}
                                    >
                                        <Info className="w-4 h-4" />
                                        View Terms & Conditions
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3">
                                    {/* Order Now Button */}
                                    {selectedOffer.orderLink && (
                                        <a
                                            href={selectedOffer.orderLink}
                                            className="inline-flex items-center justify-center rounded-md font-medium bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2 w-full"
                                        >
                                            Order Now
                                        </a>
                                    )}

                                    {/* Book Table Button */}
                                    {selectedOffer.bookingLink && (
                                        <a
                                            href={selectedOffer.bookingLink}
                                            className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                                        >
                                            Book a Table
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
};

export default OffersSection; 