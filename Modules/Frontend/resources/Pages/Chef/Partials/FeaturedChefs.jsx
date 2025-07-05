import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Star, Award, ChevronRight, Instagram, Facebook, Twitter, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FeaturedChefs = ({ chefs = [] }) => {
    if (!chefs?.length) {
        return null;
    }

    return (
        <section id="featured-chefs" className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            Featured Chefs
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Meet our culinary artists who create the most amazing dishes with passion and creativity
                        </p>
                    </motion.div>

                    <Link
                        href="#chef-grid"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary/90 font-semibold transition-colors group mt-4 md:mt-0"
                    >
                        <span>View All Chefs</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Featured Chefs Slider */}
                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={24}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    className="!pb-14"
                >
                    {chefs.map((chef, index) => (
                        <SwiperSlide key={chef.id || index}>
                            <ChefCard chef={chef} featured />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export const ChefCard = ({ chef, featured = false, className }) => {
    if (!chef) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5 }}
            className={cn(
                "group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 h-full",
                className
            )}
        >
            {/* Chef Image */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay & Badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {featured && (
                    <Badge
                        className="absolute top-4 left-4 bg-primary text-white px-3 py-1"
                        variant="secondary"
                    >
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                    </Badge>
                )}

                {/* Social Media Icons */}
                <div className="absolute bottom-4 left-4 flex space-x-2">
                    {chef.social?.instagram && (
                        <a
                            href={chef.social.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/50 transition-colors"
                        >
                            <Instagram className="w-4 h-4" />
                        </a>
                    )}
                    {chef.social?.facebook && (
                        <a
                            href={chef.social.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/50 transition-colors"
                        >
                            <Facebook className="w-4 h-4" />
                        </a>
                    )}
                    {chef.social?.twitter && (
                        <a
                            href={chef.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/50 transition-colors"
                        >
                            <Twitter className="w-4 h-4" />
                        </a>
                    )}
                </div>

                {/* Rating */}
                <div className="absolute bottom-4 right-4 flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{chef.rating || '4.8'}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-1">
                    {chef.name}
                </h3>
                
                <p className="text-primary font-medium mb-3">
                    {chef.role || 'Executive Chef'}
                </p>

                {chef.specialties?.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-2">
                            {chef.specialties.slice(0, 3).map((specialty, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
                                >
                                    {specialty}
                                </Badge>
                            ))}
                            {chef.specialties.length > 3 && (
                                <Badge
                                    variant="outline"
                                    className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
                                >
                                    +{chef.specialties.length - 3} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {chef.bio || 'Bringing years of culinary expertise and passion to create exceptional dining experiences.'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                    <Link
                        href={`/chef/${chef.slug}`}
                        className="text-primary hover:text-primary/90 flex items-center space-x-1 font-medium transition-colors"
                    >
                        <span>View Profile</span>
                        <ExternalLink className="w-4 h-4" />
                    </Link>

                    {chef.available ? (
                        <Badge variant="success" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Available
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            Booked
                        </Badge>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default FeaturedChefs; 