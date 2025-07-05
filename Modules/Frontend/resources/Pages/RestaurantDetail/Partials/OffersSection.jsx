import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Percent, Calendar, Tag, Copy, Check, AlertCircle,
    Clock, Info, ChevronRight, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/Components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Badge } from "@/Components/ui/badge";
import { useToast } from '@/Components/ui/use-toast';

const OffersSection = ({ offers = [] }) => {
    const { toast } = useToast();

    if (!offers?.length) {
        return null;
    }

    // Check if any offers are featured
    const featuredOffers = offers.filter(offer => offer.is_featured);
    const regularOffers = offers.filter(offer => !offer.is_featured);

    return (
        <section className="py-16">
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center mb-4"
                >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Percent className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">Special Offers</h2>
                </motion.div>
                <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                >
                    Exclusive deals and promotions to enhance your dining experience
                </motion.p>
            </div>

            {/* Featured Offers */}
            {featuredOffers.length > 0 && (
                <div className="mb-12">
                    <div className="flex items-center mb-6">
                        <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                        <h3 className="text-xl font-semibold">Featured Offers</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {featuredOffers.map((offer, index) => (
                            <FeaturedOfferCard key={offer.id} offer={offer} index={index} />
                        ))}
                    </div>
                </div>
            )}

            {/* Regular Offers */}
            {regularOffers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularOffers.map((offer, index) => (
                        <OfferCard
                            key={offer.id}
                            offer={offer}
                            index={index + featuredOffers.length}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

const FeaturedOfferCard = ({ offer, index }) => {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const formatDate = (dateString) => {
        if (!dateString) return '';

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(offer.code)
            .then(() => {
                setCopied(true);

                toast({
                    title: "Code Copied!",
                    description: `${offer.code} has been copied to your clipboard.`,
                });

                setTimeout(() => {
                    setCopied(false);
                }, 3000);
            })
            .catch(err => {
                toast({
                    title: "Failed to copy",
                    description: "Please try manually copying the code.",
                    variant: "destructive"
                });
            });
    };

    const getDiscountText = () => {
        if (offer.discount_type === 'percentage') {
            return `${offer.discount_value}% off`;
        } else if (offer.discount_type === 'fixed_price') {
            return `$${offer.discount_value}`;
        } else if (offer.discount_type === 'freebie') {
            return 'Free Item';
        }
        return '';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg overflow-hidden border border-primary/10"
        >
            <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-2/5 h-48 md:h-auto relative">
                    <img
                        src={offer.image || '/images/offers/default-offer.jpg'}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-white">{getDiscountText()}</Badge>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{offer.description}</p>

                        <div className="space-y-3">
                            {/* Promo Code */}
                            <div className="flex items-center">
                                <Tag className="w-4 h-4 text-primary mr-2" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Promo Code:</p>
                                    <div className="flex items-center mt-1">
                                        <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-l-md border-y border-l border-gray-200 dark:border-gray-700">
                                            <code className="text-sm font-mono">{offer.code}</code>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-[30px] rounded-l-none border-gray-200 dark:border-gray-700"
                                            onClick={handleCopyCode}
                                        >
                                            {copied ? (
                                                <Check className="h-3 w-3 text-green-500" />
                                            ) : (
                                                <Copy className="h-3 w-3" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Validity */}
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 text-primary mr-2" />
                                <div>
                                    <p className="text-sm font-medium">Valid Until:</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(offer.valid_until)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms Accordion */}
                    {offer.terms && (
                        <Accordion type="single" collapsible className="mt-4">
                            <AccordionItem value="terms" className="border-b-0">
                                <AccordionTrigger className="py-2 text-sm font-medium">
                                    <div className="flex items-center">
                                        <Info className="w-4 h-4 mr-1" />
                                        Terms & Conditions
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 py-2">
                                        {offer.terms}
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )}

                    {/* CTA Button */}
                    <Button
                        className="mt-4 w-full gap-2 group"
                    >
                        <span>Redeem Offer</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

const OfferCard = ({ offer, index }) => {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const formatDate = (dateString) => {
        if (!dateString) return '';

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(offer.code)
            .then(() => {
                setCopied(true);

                toast({
                    title: "Code Copied!",
                    description: `${offer.code} has been copied to your clipboard.`,
                });

                setTimeout(() => {
                    setCopied(false);
                }, 3000);
            })
            .catch(err => {
                toast({
                    title: "Failed to copy",
                    description: "Please try manually copying the code.",
                    variant: "destructive"
                });
            });
    };

    const getDiscountText = () => {
        if (offer.discount_type === 'percentage') {
            return `${offer.discount_value}% off`;
        } else if (offer.discount_type === 'fixed_price') {
            return `$${offer.discount_value}`;
        } else if (offer.discount_type === 'freebie') {
            return 'Free Item';
        }
        return '';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Image */}
                <div className="h-48 relative">
                    <img
                        src={offer.image || '/images/offers/default-offer.jpg'}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-white">{getDiscountText()}</Badge>
                    </div>
                </div>

                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                    <CardDescription>{offer.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 flex-grow">
                    {/* Promo Code */}
                    <div>
                        <p className="text-sm font-medium mb-1 flex items-center">
                            <Tag className="w-3 h-3 mr-1" />
                            Promo Code:
                        </p>
                        <div className="flex items-center">
                            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-l-md border-y border-l border-gray-200 dark:border-gray-700 flex-grow">
                                <code className="text-sm font-mono">{offer.code}</code>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-[30px] rounded-l-none border-gray-200 dark:border-gray-700"
                                onClick={handleCopyCode}
                            >
                                {copied ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                    <Copy className="h-3 w-3" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Validity */}
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Valid until {formatDate(offer.valid_until)}
                            </p>
                        </div>
                    </div>

                    {/* Terms */}
                    {offer.terms && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md">
                            <div className="flex items-start">
                                <AlertCircle className="w-3 h-3 mt-0.5 mr-1 flex-shrink-0" />
                                <p>{offer.terms}</p>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter>
                    <Button
                        variant="outline"
                        className="w-full gap-2 group"
                    >
                        <span>Redeem Offer</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default OffersSection; 