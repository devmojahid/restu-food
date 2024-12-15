import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { 
    Star, 
    Clock, 
    MapPin, 
    ChevronRight,
    BadgeCheck,
    Award,
    TrendingUp,
    Heart
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FeaturedRestaurants = ({ restaurants }) => {
    if (!restaurants?.length) return null;

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center space-x-2 mb-4">
                            <Award className="w-6 h-6 text-primary" />
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Featured Restaurants
                            </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Discover our handpicked selection of top-rated restaurants
                        </p>
                    </motion.div>

                    <Link 
                        href="/restaurants?featured=true"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary/90 
                               font-semibold transition-colors group mt-4 md:mt-0"
                    >
                        <span>View All Featured</span>
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
                    className="featured-restaurants-swiper"
                >
                    {restaurants.map((restaurant, index) => (
                        <SwiperSlide key={restaurant.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
                                         hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                <Link href={`/restaurants/${restaurant.slug}`}>
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={restaurant.image}
                                            alt={restaurant.name}
                                            className="w-full h-full object-cover transform 
                                                   group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 flex items-center space-x-2">
                                            <Badge 
                                                className="bg-primary/90 text-white backdrop-blur-sm 
                                                         flex items-center space-x-1"
                                            >
                                                <BadgeCheck className="w-4 h-4" />
                                                <span>Featured</span>
                                            </Badge>
                                            {restaurant.trending && (
                                                <Badge 
                                                    className="bg-orange-500/90 text-white backdrop-blur-sm 
                                                             flex items-center space-x-1"
                                                >
                                                    <TrendingUp className="w-4 h-4" />
                                                    <span>Trending</span>
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full bg-white/20 
                                                       backdrop-blur-sm hover:bg-white/40 text-white 
                                                       transition-colors"
                                            >
                                                <Heart className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 
                                                    bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 
                                                           dark:text-white mb-1 group-hover:text-primary 
                                                           transition-colors">
                                                    {restaurant.name}
                                                </h3>
                                                <div className="flex items-center space-x-2 text-sm 
                                                            text-gray-500 dark:text-gray-400">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{restaurant.distance} km away</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-center space-x-1 text-yellow-400">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="font-medium">{restaurant.rating}</span>
                                                </div>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    ({restaurant.total_reviews} reviews)
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-1 
                                                            text-gray-500 dark:text-gray-400">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{restaurant.delivery_time} mins</span>
                                                </div>
                                                <Badge variant={restaurant.is_open ? "success" : "destructive"}>
                                                    {restaurant.is_open ? "Open Now" : "Closed"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center text-primary font-medium">
                                                View Menu
                                                <ChevronRight className="w-4 h-4 ml-1 
                                                                     group-hover:translate-x-1 
                                                                     transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default FeaturedRestaurants; 