import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ChevronRight, Star, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const RelatedChefs = ({ chefs = [] }) => {
    if (!chefs || chefs.length === 0) {
        return null;
    }

    return (
        <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Similar Chefs</h2>
                
                <Link 
                    href={route('frontend.chef')}
                    className="flex items-center text-primary hover:text-primary/90 transition-colors"
                >
                    <span>View All Chefs</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
            </div>
            
            <div className="relative">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={16}
                    slidesPerView={1}
                    navigation={{
                        nextEl: '.swiper-next',
                        prevEl: '.swiper-prev',
                    }}
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
                    className="pb-10"
                >
                    {chefs.map((chef, index) => (
                        <SwiperSlide key={chef.id || index}>
                            <ChefCard chef={chef} index={index} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                
                {/* Custom Navigation Buttons */}
                <button className="swiper-prev absolute top-1/2 -left-4 z-10 -translate-y-1/2 bg-white dark:bg-gray-800 shadow-md p-2 rounded-full hidden md:flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <button className="swiper-next absolute top-1/2 -right-4 z-10 -translate-y-1/2 bg-white dark:bg-gray-800 shadow-md p-2 rounded-full hidden md:flex items-center justify-center">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
};

const ChefCard = ({ chef, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden h-full flex flex-col border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
            {/* Chef Image */}
            <div className="relative h-48 overflow-hidden">
                <img 
                    src={chef.image || '/images/default-chef.jpg'} 
                    alt={chef.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4">
                        <Link 
                            href={route('frontend.chef.show', chef.slug || chef.id)}
                            className="text-white font-medium flex items-center justify-center bg-primary/90 backdrop-blur-sm hover:bg-primary rounded-full py-2 px-4 transition-colors"
                        >
                            <span>View Profile</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                <Link 
                    href={route('frontend.chef.show', chef.slug || chef.id)}
                    className="hover:text-primary transition-colors"
                >
                    <h3 className="font-semibold text-lg mb-1">{chef.name}</h3>
                </Link>
                
                <p className="text-primary text-sm mb-2">{chef.role || 'Chef'}</p>
                
                <div className="flex items-center mb-3">
                    <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                            <Star 
                                key={i} 
                                className={cn(
                                    "w-4 h-4", 
                                    i < Math.floor(chef.rating || 4) 
                                        ? "text-yellow-400 fill-yellow-400" 
                                        : "text-gray-300"
                                )} 
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                        ({chef.reviews_count || 0})
                    </span>
                </div>
                
                {/* Location */}
                {chef.location && (
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{chef.location}</span>
                    </div>
                )}
                
                {/* Specialties */}
                {chef.specialties && chef.specialties.length > 0 && (
                    <div className="mt-auto">
                        <h4 className="text-xs font-medium text-gray-500 mb-1">Specialties:</h4>
                        <div className="flex flex-wrap gap-1">
                            {chef.specialties.slice(0, 3).map((specialty, i) => (
                                <span 
                                    key={i}
                                    className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                                >
                                    {specialty}
                                </span>
                            ))}
                            {chef.specialties.length > 3 && (
                                <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                                    +{chef.specialties.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default RelatedChefs; 