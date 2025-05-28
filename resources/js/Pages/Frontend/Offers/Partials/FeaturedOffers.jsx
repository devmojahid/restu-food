import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import {
    ChevronRight,
    Clock,
    Tag,
    ExternalLink,
    Star,
    Award
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FeaturedOffers = ({ offers }) => {
    if (!offers?.length) return null;

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center space-x-2 mb-2">
                            <Award className="w-6 h-6 text-primary" />
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Featured Offers
                            </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Don't miss out on these exclusive deals from our top restaurants
                        </p>
                    </motion.div>

                    <Link
                        href="#all-offers"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary/90 
                               font-semibold transition-colors group mt-4 md:mt-0"
                    >
                        <span>View All Offers</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Swiper Carousel */}
                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={24}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                    }}
                    className="featured-offers-swiper"
                >
                    {offers.map((offer, index) => (
                        <SwiperSlide key={offer.id}>
                            <OfferCard offer={offer} index={index} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

const OfferCard = ({ offer, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
                     hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
        >
            <Link href={`/offers/${offer.id}`}>
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover transform 
                               group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                        <Badge className="bg-red-500 text-white">
                            {offer.discount}% OFF
                        </Badge>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 
                                bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 
                                       dark:text-white mb-1 group-hover:text-primary 
                                       transition-colors">
                                {offer.title}
                            </h3>
                            {offer.restaurant && (
                                <div className="flex items-center space-x-2 text-sm 
                                            text-gray-500 dark:text-gray-400">
                                    <span>by {offer.restaurant.name}</span>
                                    {offer.restaurant.rating && (
                                        <div className="flex items-center space-x-1 text-yellow-400">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span>{offer.restaurant.rating}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {offer.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center space-x-1 
                                    text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Valid until {offer.valid_until}</span>
                        </div>
                        <div className="flex items-center text-primary font-medium">
                            <Tag className="w-4 h-4 mr-1" />
                            <span>{offer.code}</span>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="px-6 pb-6 pt-2">
                    <Button
                        className="w-full group-hover:bg-primary/90 transition-colors flex justify-center items-center"
                    >
                        <span>View Offer</span>
                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </Link>
        </motion.div>
    );
};

export default FeaturedOffers; 