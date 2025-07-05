import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import {
    Calendar,
    Copy,
    Tag,
    CheckCircle,
    AlertCircle,
    ExternalLink,
    Share2,
    Clock,
    Info,
    Star,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/Components/ui/use-toast';

const Show = ({ offer, error }) => {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();
    const { post, processing } = useForm();

    if (!offer && !error) {
        return (
            <Layout>
                <Head title="Offer Not Found" />
                <div className="container mx-auto py-16 px-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            This offer could not be found or may have expired.
                        </AlertDescription>
                    </Alert>
                    <div className="mt-8 text-center">
                        <Button asChild>
                            <Link href="/offers">View All Offers</Link>
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <Head title="Error" />
                <div className="container mx-auto py-16 px-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <div className="mt-8 text-center">
                        <Button asChild>
                            <Link href="/offers">View All Offers</Link>
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    const handleCopyCode = () => {
        navigator.clipboard.writeText(offer.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        toast({
            title: "Code Copied!",
            description: `${offer.code} has been copied to your clipboard.`,
        });
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: offer.title,
                    text: offer.description,
                    url: window.location.href
                });
            } else {
                // Fallback
                navigator.clipboard.writeText(window.location.href);
                toast({
                    title: "Link Copied!",
                    description: "Offer link has been copied to your clipboard.",
                });
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    const handleClaimOffer = () => {
        post(route('frontend.offers.claim', offer.id), {
            onSuccess: () => {
                toast({
                    title: "Offer Claimed!",
                    description: "The code has been sent to your email.",
                });
            }
        });
    };

    return (
        <Layout>
            <Head title={offer.title || "Offer Details"} />

            <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Column - Offer Details */}
                        <div className="w-full md:w-2/3">
                            {/* Back Button */}
                            <div className="mb-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                >
                                    <Link href="/offers" className="flex items-center gap-2">
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Offers
                                    </Link>
                                </Button>
                            </div>

                            {/* Offer Card */}
                            <Card className="overflow-hidden">
                                {/* Offer Image */}
                                <div className="relative h-[300px]">
                                    <img
                                        src={offer.image}
                                        alt={offer.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                                            {offer.discount}% OFF
                                        </Badge>
                                    </div>
                                </div>

                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl md:text-3xl">{offer.title}</CardTitle>
                                            <CardDescription className="mt-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="flex items-center gap-1 text-gray-500">
                                                        <Calendar className="w-4 h-4" />
                                                        Valid until {offer.valid_until}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-500">
                                                        <Tag className="w-4 h-4" />
                                                        {offer.category || "Special Offer"}
                                                    </span>
                                                </div>
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="rounded-full"
                                            onClick={handleShare}
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Restaurant Info */}
                                    {offer.restaurant && (
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="h-16 w-16 rounded-lg overflow-hidden">
                                                <img
                                                    src={offer.restaurant.logo}
                                                    alt={offer.restaurant.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{offer.restaurant.name}</h3>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    <span>{offer.restaurant.rating}</span>
                                                </div>
                                            </div>
                                            <div className="ml-auto">
                                                <Button asChild>
                                                    <Link href={`/restaurant/${offer.restaurant.id}`}>
                                                        <span>View Restaurant</span>
                                                        <ExternalLink className="w-4 h-4 ml-2" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Description */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {offer.description}
                                        </p>
                                    </div>

                                    {/* Terms & Conditions */}
                                    {offer.terms_conditions && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
                                            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                                                {offer.terms_conditions.map((term, idx) => (
                                                    <li key={idx}>{term}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* How to Redeem */}
                                    {offer.how_to_redeem && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">How to Redeem</h3>
                                            <ol className="list-decimal pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                                                {offer.how_to_redeem.map((step, idx) => (
                                                    <li key={idx}>{step}</li>
                                                ))}
                                            </ol>
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
                                    <div className="relative flex-1">
                                        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-5 h-5 text-primary" />
                                                <span className="font-medium text-lg">{offer.code}</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={handleCopyCode}
                                            >
                                                {copied ? (
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                ) : (
                                                    <Copy className="w-4 h-4 mr-2" />
                                                )}
                                                {copied ? 'Copied!' : 'Copy Code'}
                                            </Button>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleClaimOffer}
                                        size="lg"
                                        className="w-full sm:w-auto"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>Claim Offer</>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                        {/* Right Column - Additional Info */}
                        <div className="w-full md:w-1/3 space-y-6">
                            {/* Offer Stats */}
                            {(offer.popularity_score || offer.claimed_count) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Offer Stats</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {offer.popularity_score && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Popularity</span>
                                                <span className="font-semibold">{offer.popularity_score}/100</span>
                                            </div>
                                        )}
                                        {offer.claimed_count && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Claimed</span>
                                                <span className="font-semibold">{offer.claimed_count} times</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Important Notes */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="w-5 h-5 text-amber-500" />
                                        Important Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Alert>
                                        <Clock className="h-4 w-4" />
                                        <AlertTitle>Time Limited</AlertTitle>
                                        <AlertDescription>
                                            This offer is valid until {offer.valid_until}. Make sure to claim it before it expires.
                                        </AlertDescription>
                                    </Alert>

                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Please review all terms and conditions before claiming this offer.
                                        Some restrictions may apply and availability is subject to change.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Expiration Countdown */}
                            <Card className="bg-primary/10 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-primary">Limited Time Offer!</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Don't miss out on this exclusive deal. Claim it today to lock in your savings.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Show; 