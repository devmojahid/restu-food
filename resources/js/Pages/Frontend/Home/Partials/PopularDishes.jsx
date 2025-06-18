import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    Clock,
    ChevronRight,
    Heart,
    Timer,
    Flame,
    Utensils,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Badge } from '@/Components/ui/badge';
import {
    ShoppingBag,
    TrendingUp,
    Award,
    Sparkles
} from 'lucide-react';
import DishVariationsModal from '@/Components/Frontend/DishVariationsModal';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => (
    <div className="flex items-center space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => onCategoryChange('all')}
        >
            <Sparkles className="w-4 h-4 mr-2" />
            All Dishes
        </Button>
        {categories.map(category => (
            <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                size="sm"
                className="rounded-full whitespace-nowrap"
                onClick={() => onCategoryChange(category)}
            >
                {category}
            </Button>
        ))}
    </div>
);

const DishCard = ({ dish, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md 
                         hover:shadow-xl transition-all duration-300 overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Link href={`/menu/${dish.slug}`}>
                    {/* Enhanced Image Container */}
                    <div className="relative h-48 overflow-hidden">
                        <motion.img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                            animate={{ scale: isHovered ? 1.1 : 1 }}
                            transition={{ duration: 0.4 }}
                        />

                        {/* Enhanced Discount Badge */}
                        {dish.discount && (
                            <motion.div
                                initial={{ x: -100 }}
                                animate={{ x: 0 }}
                                className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 
                                        rounded-full text-sm font-medium backdrop-blur-sm 
                                        flex items-center space-x-1"
                            >
                                <Flame className="w-4 h-4 animate-pulse" />
                                <span>{dish.discount}% OFF</span>
                            </motion.div>
                        )}

                        {/* Quick Actions */}
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm 
                                       hover:bg-white/40 text-white transition-colors"
                                onClick={handleAddToCart}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm 
                                       hover:bg-white/40 text-white transition-colors"
                            >
                                <Heart className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Enhanced Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t 
                                    from-black/80 via-black/50 to-transparent" />

                        {/* Additional Info Overlay */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                            className="absolute bottom-4 left-4 right-4 text-white"
                        >
                            <div className="flex items-center space-x-2 mb-2">
                                {dish.isNew && (
                                    <Badge variant="secondary" className="bg-primary/90">New</Badge>
                                )}
                                {dish.isPopular && (
                                    <Badge variant="secondary" className="bg-orange-500/90">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        Popular
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center">
                                    <Award className="w-4 h-4 mr-1" />
                                    {dish.rating} Rating
                                </span>
                                <span className="flex items-center">
                                    <ShoppingBag className="w-4 h-4 mr-1" />
                                    {dish.orders}+ Orders
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Enhanced Content */}
                    <div className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white 
                                           group-hover:text-primary transition-colors">
                                    {dish.name}
                                </h3>
                                <Link
                                    href={`/restaurants/${dish.restaurant.slug}`}
                                    className="text-sm text-gray-500 dark:text-gray-400 
                                           hover:text-primary transition-colors"
                                >
                                    {dish.restaurant.name}
                                </Link>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center space-x-1 text-yellow-400">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="font-medium">{dish.rating}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                                    <Timer className="w-4 h-4" />
                                    <span className="text-sm">{dish.preparation_time}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {dish.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-primary">
                                    ${dish.price.toFixed(2)}
                                </span>
                                {dish.discount && (
                                    <span className="text-sm text-gray-500 line-through">
                                        ${(dish.price * (1 + dish.discount / 100)).toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-full hover:bg-primary/10 hover:text-primary"
                            >
                                <Heart className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </Link>
            </motion.div>

            <DishVariationsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                dish={dish}
            />
        </>
    );
};

const PopularDishes = ({ dishes }) => {
    const { title, columns, dishes: dishesData } = dishes;

    const [activeCategory, setActiveCategory] = useState('all');
    const [filteredDishes, setFilteredDishes] = useState(dishesData);

    // Extract unique categories from dishes
    const categories = [...new Set(dishesData?.map(dish => dish.category))];

    useEffect(() => {
        if (activeCategory === 'all') {
            setFilteredDishes(dishesData);
        } else {
            setFilteredDishes(dishesData.filter(dish => dish.category === activeCategory));
        }
    }, [activeCategory, dishesData]);

    if (!dishesData?.length) {
        return (
            <div className="text-center py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                >
                    <Utensils className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Dishes Available</h3>
                    <p className="text-gray-500">Check back later for our delicious offerings!</p>
                </motion.div>
            </div>
        );
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                {/* Enhanced Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            {title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Explore our most ordered dishes loved by thousands of customers
                        </p>
                    </motion.div>

                    <Link
                        href="/menu"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary/90 
                               font-semibold transition-colors group mt-4 md:mt-0"
                    >
                        <span>View Full Menu</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                    <CategoryFilter
                        categories={categories}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                    />
                </div>

                {/* Enhanced Grid with Animation */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    <AnimatePresence>
                        {filteredDishes.map((dish, index) => (
                            <DishCard key={dish.id} dish={dish} index={index} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Enhanced View All Button */}
                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Link
                        href="/menu"
                        className="inline-flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 
                               text-primary px-8 py-4 rounded-full transition-colors group"
                    >
                        <span>Explore Full Menu</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default PopularDishes; 