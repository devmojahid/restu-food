import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight, Globe, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const BrandCard = ({ brand, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md 
                     transition-all duration-300 overflow-hidden border border-gray-100 
                     dark:border-gray-700 hover:border-primary/20 h-full"
        >
            <Link href={`/brands/${brand.slug}`} className="block p-6 h-full">
                <div className="flex flex-col items-center h-full">
                    {/* Brand Logo */}
                    <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                        <img
                            src={brand.logo}
                            alt={brand.name}
                            className="max-w-full max-h-full object-contain filter transition-all duration-300
                                   group-hover:brightness-110"
                        />
                    </div>

                    {/* Brand Name */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center 
                               group-hover:text-primary transition-colors">
                        {brand.name}
                    </h3>

                    {/* Product Count */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                        {brand.product_count} Products
                    </p>

                    {/* View Brand Link */}
                    <div className="mt-auto">
                        <div className="inline-flex items-center text-primary text-sm font-medium">
                            <span>View Brand</span>
                            <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const EmptyState = () => (
    <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Brands Available</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            We're currently working on partnerships with top brands. Check back soon!
        </p>
    </div>
);

const BrandsShowcase = ({ data = {} }) => {
    const { title = "Shop by Brand", subtitle, brands = [] } = data;
    
    if (!brands.length) {
        return (
            <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <EmptyState />
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-500 px-3 py-1 
                                 rounded-full text-sm font-medium mb-4"
                    >
                        <Globe className="h-4 w-4" />
                        <span>Top Brands</span>
                    </motion.div>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
                    >
                        {title}
                    </motion.h2>
                    
                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>

                {/* Mobile Carousel */}
                <div className="block md:hidden">
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={16}
                        slidesPerView={1.5}
                        centeredSlides={false}
                        loop={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            480: {
                                slidesPerView: 2.5,
                            },
                        }}
                        className="pb-8"
                    >
                        {brands.map((brand, index) => (
                            <SwiperSlide key={brand.id}>
                                <div className="h-full">
                                    <BrandCard brand={brand} index={index} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {brands.map((brand, index) => (
                        <BrandCard key={brand.id} brand={brand} index={index} />
                    ))}
                </div>

                {/* View All Brands Link */}
                <div className="text-center mt-12">
                    <Link
                        href="/brands"
                        className="inline-flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 
                               text-primary px-6 py-3 rounded-full transition-colors group"
                    >
                        <span>View All Brands</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BrandsShowcase; 