import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    Award,
    Calendar,
    Clock,
    MapPin,
    Phone,
    Mail,
    ChevronRight,
    Heart,
    Share2,
    Bookmark,
    AlertCircle,
    User,
    Instagram,
    Twitter,
    Facebook,
    Youtube,
    ExternalLink,
    FileText
} from 'lucide-react';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { useToast } from '@/Components/ui/use-toast';

import Hero from './Partials/Hero';
import ChefSpecialties from './Partials/ChefSpecialties';
import ChefGallery from './Partials/ChefGallery';
import ChefExperience from './Partials/ChefExperience';
import ChefAwards from './Partials/ChefAwards';
import ChefTestimonials from './Partials/ChefTestimonials';
import RelatedChefs from './Partials/RelatedChefs';
import BookingInfo from './Partials/BookingInfo';
import ChefRecipes from './Partials/ChefRecipes';

const Show = ({
    chef = null,
    specialties = [],
    gallery = [],
    experience = [],
    awards = [],
    testimonials = [],
    relatedChefs = [],
    bookingInfo = {},
    recipes = [],
    social = {},
    error = null
}) => {
    const [activeTab, setActiveTab] = useState('about');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { toast } = useToast();

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Chef ${chef?.name}`,
                    text: chef?.bio,
                    url: window.location.href
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast({
                    title: 'Link Copied',
                    description: 'Chef profile link copied to clipboard'
                });
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast({
            title: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
            description: isWishlisted
                ? `${chef?.name} has been removed from your wishlist`
                : `${chef?.name} has been added to your wishlist`
        });
    };

    const handleBookNow = () => {
        // Implementation for booking would go here
        toast({
            title: 'Booking Initiated',
            description: `You're about to book Chef ${chef?.name}. Please complete the process.`
        });
    };

    if (error) {
        return (
            <Layout>
                <Head title="Chef Details | Error" />
                <div className="container mx-auto px-4 py-16">
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <div className="text-center">
                        <Button asChild variant="default">
                            <Link href={route('frontend.chef')}>
                                View All Chefs
                            </Link>
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!chef) {
        return (
            <Layout>
                <Head title="Chef Not Found" />
                <div className="container mx-auto px-4 py-16 text-center">
                    <div className="mb-8">
                        <User className="w-16 h-16 mx-auto text-gray-400" />
                        <h1 className="text-3xl font-bold mt-4 mb-2">Chef Not Found</h1>
                        <p className="text-gray-500 mb-8">
                            The chef you're looking for doesn't exist or may have been removed.
                        </p>
                    </div>
                    <Button asChild variant="default">
                        <Link href={route('frontend.chef')}>
                            View All Chefs
                        </Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head title={`Chef ${chef?.name} | ${chef?.cuisine} Cuisine`} />

            <Hero chef={chef} />

            <div className="container mx-auto px-4 pt-6 pb-16">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-primary transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <Link href={route('frontend.chef')} className="hover:text-primary transition-colors">
                        Chefs
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {chef?.name}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="w-full justify-start overflow-x-auto">
                                <TabsTrigger value="about">About</TabsTrigger>
                                <TabsTrigger value="specialties">Specialties</TabsTrigger>
                                <TabsTrigger value="experience">Experience</TabsTrigger>
                                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                                <TabsTrigger value="recipes">Recipes</TabsTrigger>
                            </TabsList>

                            <TabsContent value="about" className="mt-6">
                                <div className="space-y-8">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                        <h2 className="text-2xl font-bold mb-4">About Chef {chef?.name}</h2>
                                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                                            {chef?.long_bio || chef?.bio}
                                        </p>

                                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {chef?.skills && chef?.skills?.length > 0 && (
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-4">Expertise & Skills</h3>
                                                    <div className="space-y-4">
                                                        {chef?.skills?.map((skill, index) => (
                                                            <div key={index}>
                                                                <div className="flex justify-between mb-1">
                                                                    <span className="text-sm font-medium">{skill?.name}</span>
                                                                    <span className="text-sm text-gray-500">{skill?.level}%</span>
                                                                </div>
                                                                <Progress value={skill?.level} className="h-2" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <h3 className="text-lg font-semibold mb-4">Details</h3>
                                                <ul className="space-y-3">
                                                    <li className="flex items-start">
                                                        <MapPin className="w-5 h-5 text-primary mr-3 mt-0.5" />
                                                        <span>{chef?.location || 'Location not specified'}</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <Clock className="w-5 h-5 text-primary mr-3 mt-0.5" />
                                                        <span>{chef?.experience || 'Experience not specified'}</span>
                                                    </li>
                                                    {chef?.languages && (
                                                        <li className="flex items-start">
                                                            <FileText className="w-5 h-5 text-primary mr-3 mt-0.5" />
                                                            <span>Languages: {chef?.languages?.join(', ')}</span>
                                                        </li>
                                                    )}
                                                    {chef?.availability && (
                                                        <li className="flex items-start">
                                                            <Calendar className="w-5 h-5 text-primary mr-3 mt-0.5" />
                                                            <span>{chef?.availability}</span>
                                                        </li>
                                                    )}
                                                    {chef?.booking_fee && (
                                                        <li className="flex items-start">
                                                            <Award className="w-5 h-5 text-primary mr-3 mt-0.5" />
                                                            <span>Booking Fee: {chef?.booking_fee}</span>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {awards?.length > 0 && (
                                        <ChefAwards awards={awards} />
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="specialties" className="mt-6">
                                <ChefSpecialties specialties={specialties} />
                            </TabsContent>

                            <TabsContent value="experience" className="mt-6">
                                <ChefExperience experience={experience} />
                            </TabsContent>

                            <TabsContent value="gallery" className="mt-6">
                                <ChefGallery gallery={gallery} />
                            </TabsContent>

                            <TabsContent value="reviews" className="mt-6">
                                <ChefTestimonials testimonials={testimonials} />
                            </TabsContent>

                            <TabsContent value="recipes" className="mt-6">
                                <ChefRecipes recipes={recipes} />
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Booking Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">Book This Chef</h2>

                                <div className="mb-6">
                                    <p className="text-sm text-gray-500 mb-1">Starting at</p>
                                    <div className="flex items-baseline">
                                        <span className="text-3xl font-bold text-primary">
                                            {chef?.booking_fee || '$250/hr'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        onClick={handleBookNow}
                                    >
                                        Book Now
                                    </Button>

                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="outline"
                                            className="flex-1 mr-2"
                                            onClick={toggleWishlist}
                                        >
                                            <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                                            Wishlist
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 ml-2"
                                            onClick={handleShare}
                                        >
                                            <Share2 className="w-4 h-4 mr-2" />
                                            Share
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-semibold mb-3">Contact Information</h3>
                                    {chef?.contact_email && (
                                        <div className="flex items-center mb-2">
                                            <Mail className="w-4 h-4 text-gray-500 mr-2" />
                                            <a href={`mailto:${chef?.contact_email}`} className="text-sm text-blue-600 hover:text-blue-800">
                                                {chef?.contact_email}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Social Media Links */}
                                {social && Object.keys(social)?.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <h3 className="text-sm font-semibold mb-3">Follow Chef {chef?.name}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {social?.instagram && (
                                                <Button variant="outline" size="icon" asChild className="rounded-full">
                                                    <a href={`https://instagram.com/${social?.instagram}`} target="_blank" rel="noopener noreferrer">
                                                        <Instagram className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                            )}
                                            {social?.twitter && (
                                                <Button variant="outline" size="icon" asChild className="rounded-full">
                                                    <a href={`https://twitter.com/${social?.twitter}`} target="_blank" rel="noopener noreferrer">
                                                        <Twitter className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                            )}
                                            {social?.facebook && (
                                                <Button variant="outline" size="icon" asChild className="rounded-full">
                                                    <a href={`https://facebook.com/${social?.facebook}`} target="_blank" rel="noopener noreferrer">
                                                        <Facebook className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                            )}
                                            {social?.youtube && (
                                                <Button variant="outline" size="icon" asChild className="rounded-full">
                                                    <a href={`https://youtube.com/${social?.youtube}`} target="_blank" rel="noopener noreferrer">
                                                        <Youtube className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                            )}
                                            {social?.website && (
                                                <Button variant="outline" size="icon" asChild className="rounded-full">
                                                    <a href={social?.website} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Booking Info */}
                            {bookingInfo && Object.keys(bookingInfo).length > 0 && (
                                <BookingInfo data={bookingInfo} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Chefs */}
                {relatedChefs?.length > 0 && (
                    <div className="mt-16">
                        <RelatedChefs chefs={relatedChefs} />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Show; 