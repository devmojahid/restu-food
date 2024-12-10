import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    Clock, 
    ChevronRight,
    Heart,
    ShoppingBag,
    Filter,
    TrendingUp,
    Flame,
    Utensils,
    Timer,
    Leaf,
    Sparkles,
    ArrowUpDown,
    X,
    AlertCircle,
    Info,
    Percent,
    Award,
    ThumbsUp,
    Bookmark,
    Share2,
    MessageCircle,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Badge } from '@/Components/ui/badge';
import DishVariationsModal from '@/Components/Frontend/DishVariationsModal';
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { useToast } from "@/Components/ui/use-toast";
import { Progress } from "@/Components/ui/progress";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const FilterButton = ({ active, label, icon: Icon, onClick, count }) => (
    <Button
        variant={active ? 'default' : 'outline'}
        size="sm"
        className="rounded-full"
        onClick={onClick}
    >
        <Icon className="w-4 h-4 mr-2" />
        <span>{label}</span>
        {count && (
            <span className="ml-2 bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
                {count}
            </span>
        )}
    </Button>
);

const SortButton = ({ sort, onSortChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions = [
        { value: 'popular', label: 'Most Popular' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'newest', label: 'Newest First' }
    ];

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setIsOpen(!isOpen)}
            >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <span>Sort By</span>
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-30" 
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 
                                   rounded-xl shadow-lg border dark:border-gray-700 z-40 
                                   overflow-hidden"
                        >
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    className={cn(
                                        "w-full px-4 py-2 text-left text-sm transition-colors",
                                        "hover:bg-gray-100 dark:hover:bg-gray-700",
                                        sort === option.value && "bg-primary/10 text-primary"
                                    )}
                                    onClick={() => {
                                        onSortChange(option.value);
                                        setIsOpen(false);
                                    }}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const DishCard = ({ dish, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { toast } = useToast();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        setIsAddingToCart(true);
        
        try {
            await router.post('/cart/add', {
                dish_id: dish.id,
                quantity: 1
            });
            
            toast({
                title: "Added to Cart",
                description: `${dish.name} has been added to your cart.`,
                action: (
                    <Button variant="outline" size="sm" onClick={() => router.visit('/cart')}>
                        View Cart
                    </Button>
                ),
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add item to cart. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleAddToWishlist = async (e) => {
        e.preventDefault();
        setIsAddingToWishlist(true);
        
        try {
            await router.post('/wishlist/add', {
                dish_id: dish.id
            });
            
            toast({
                title: "Added to Wishlist",
                description: `${dish.name} has been added to your wishlist.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add item to wishlist. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsAddingToWishlist(false);
        }
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
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                        <motion.img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                            animate={{ scale: isHovered ? 1.1 : 1 }}
                            transition={{ duration: 0.4 }}
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col space-y-2">
                            {dish.isNew && (
                                <Badge variant="secondary" className="bg-primary/90">New</Badge>
                            )}
                            {dish.discount && (
                                <Badge variant="secondary" className="bg-red-500/90">
                                    <Flame className="w-3 h-3 mr-1" />
                                    {dish.discount}% OFF
                                </Badge>
                            )}
                            {dish.isPopular && (
                                <Badge variant="secondary" className="bg-orange-500/90">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    Popular
                                </Badge>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm 
                                                   hover:bg-white/40 text-white transition-colors"
                                            onClick={handleAddToCart}
                                            disabled={isAddingToCart}
                                        >
                                            {isAddingToCart ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <ShoppingBag className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Add to Cart</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm 
                                                   hover:bg-white/40 text-white transition-colors"
                                            onClick={handleAddToWishlist}
                                            disabled={isAddingToWishlist}
                                        >
                                            {isAddingToWishlist ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Heart className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Add to Wishlist</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
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
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center">
                                    <Timer className="w-4 h-4 mr-1" />
                                    {dish.preparation_time}
                                </span>
                                <span className="flex items-center">
                                    <Leaf className="w-4 h-4 mr-1" />
                                    {dish.calories} cal
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Content */}
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
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    ({dish.orders}+ orders)
                                </span>
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
                                        ${(dish.price * (1 + dish.discount/100)).toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <Button
                                variant="default"
                                size="sm"
                                className="rounded-full"
                                onClick={handleAddToCart}
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Add to Cart
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

const EmptyState = () => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 px-4"
    >
        <Utensils className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Dishes Available</h3>
        <p className="text-gray-500">Check back later for our delicious offerings!</p>
    </motion.div>
);

const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(price);
};

const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * (discount / 100));
};

const getDietaryInfo = (dish) => {
    const info = [];
    if (dish.vegetarian) info.push('Vegetarian');
    if (dish.vegan) info.push('Vegan');
    if (dish.glutenFree) info.push('Gluten-Free');
    if (dish.spicy) info.push('Spicy');
    return info;
};

const DishDetails = ({ dish, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [reviewsExpanded, setReviewsExpanded] = useState(false);
    const { toast } = useToast();

    const handleShare = async () => {
        try {
            await navigator.share({
                title: dish.name,
                text: dish.description,
                url: window.location.href
            });
        } catch (err) {
            toast({
                title: "Sharing not supported",
                description: "Please copy the URL manually",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Tabs */}
            <div className="flex space-x-4 border-b dark:border-gray-800">
                {['overview', 'ingredients', 'reviews'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "pb-2 px-2 text-sm font-medium capitalize",
                            "border-b-2 -mb-px transition-colors",
                            activeTab === tab
                                ? "border-primary text-primary"
                                : "border-transparent text-gray-500 hover:text-gray-900"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-1">Rating</div>
                                    <div className="flex items-center space-x-2">
                                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                        <span className="text-lg font-semibold">{dish.rating}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-1">Orders</div>
                                    <div className="flex items-center space-x-2">
                                        <ShoppingBag className="w-5 h-5 text-primary" />
                                        <span className="text-lg font-semibold">{dish.orders}+</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium">Preparation Time</h4>
                                <div className="flex items-center space-x-2">
                                    <Timer className="w-4 h-4 text-gray-400" />
                                    <span>{dish.preparation_time}</span>
                                </div>
                            </div>

                            {getDietaryInfo(dish).length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-medium">Dietary Information</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {getDietaryInfo(dish).map((info) => (
                                            <span
                                                key={info}
                                                className="px-3 py-1 bg-primary/10 text-primary 
                                                       rounded-full text-sm"
                                            >
                                                {info}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <h4 className="font-medium">Nutritional Info</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-500">Calories</div>
                                        <Progress value={70} className="h-2" />
                                        <div className="text-sm font-medium">{dish.calories} cal</div>
                                    </div>
                                    {/* Add more nutritional info as needed */}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ingredients' && (
                        <div className="space-y-4">
                            {/* Add ingredients list */}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="space-y-4">
                            {/* Add reviews section */}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t dark:border-gray-800">
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={handleShare}
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                    >
                        <Bookmark className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                </div>
                <Button
                    variant="default"
                    size="sm"
                    className="rounded-full"
                    onClick={onClose}
                >
                    Done
                </Button>
            </div>
        </div>
    );
};

const FeaturedDishes = ({ dishes }) => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeSort, setActiveSort] = useState('popular');
    const [filteredDishes, setFilteredDishes] = useState(dishes);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Filter options
    const filters = [
        { id: 'all', label: 'All Dishes', icon: Sparkles },
        { id: 'trending', label: 'Trending', icon: TrendingUp },
        { id: 'vegetarian', label: 'Vegetarian', icon: Leaf },
        { id: 'spicy', label: 'Spicy', icon: Flame },
    ];

    useEffect(() => {
        // Apply filters and sorting
        let filtered = [...dishes];

        // Apply filters
        if (activeFilter !== 'all') {
            filtered = filtered.filter(dish => dish[activeFilter]);
        }

        // Apply sorting
        switch (activeSort) {
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'price_low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price_high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            default:
                filtered.sort((a, b) => b.orders - a.orders);
        }

        setFilteredDishes(filtered);
    }, [activeFilter, activeSort, dishes]);

    if (!dishes?.length) {
        return <EmptyState />;
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
                            Featured Dishes
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Explore our most popular and highly-rated dishes from top restaurants
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

                {/* Filters and Sort */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="flex items-center space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                        {filters.map(filter => (
                            <FilterButton
                                key={filter.id}
                                active={activeFilter === filter.id}
                                label={filter.label}
                                icon={filter.icon}
                                onClick={() => setActiveFilter(filter.id)}
                                count={filter.id !== 'all' ? dishes.filter(d => d[filter.id]).length : null}
                            />
                        ))}
                    </div>
                    <div className="ml-auto">
                        <SortButton
                            sort={activeSort}
                            onSortChange={setActiveSort}
                        />
                    </div>
                </div>

                {/* Dishes Grid/Carousel */}
                {isMobile ? (
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={16}
                        slidesPerView={1.2}
                        navigation
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2.2,
                            },
                        }}
                        className="!overflow-visible"
                    >
                        {filteredDishes.map((dish, index) => (
                            <SwiperSlide key={dish.id}>
                                <DishCard dish={dish} index={index} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {filteredDishes.map((dish, index) => (
                                <DishCard key={dish.id} dish={dish} index={index} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

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

export default FeaturedDishes; 