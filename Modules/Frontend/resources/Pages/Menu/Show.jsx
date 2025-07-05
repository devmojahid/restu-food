import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    Clock,
    Info,
    Heart,
    Share2,
    Minus,
    Plus,
    ChevronRight,
    AlertCircle,
    Leaf,
    Flame,
    DollarSign,
    Utensils,
    Scale,
    Timer,
    Award,
    ShoppingBag,
    Truck,
    Shield,
    ThumbsUp,
    Copy,
    Facebook,
    Twitter,
    Phone,
    MessageCircle,
    ArrowLeft,
    Sparkles,
    ShieldCheck,
    Tag,
    Loader2
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea, ScrollBar } from '@/Components/ui/scroll-area';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import RelatedItems from './Partials/RelatedItems';
import ReviewsSection from './Partials/ReviewsSection';
import { useToast } from '@/Components/ui/use-toast';
import { useMenuItem } from '@/hooks/useMenuItem';

const Show = ({ item, relatedItems, reviews }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const { addToCart } = useCart();
    const { toast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariations, setSelectedVariations] = useState({});
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [selectedSize, setSelectedSize] = useState(item.sizes?.[0] || null);
    const [showIngredients, setShowIngredients] = useState(false);
    const [showNutrition, setShowNutrition] = useState(false);
    const [showAllergies, setShowAllergies] = useState(false);

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    const handleVariationChange = (name, option) => {
        setSelectedVariations(prev => ({
            ...prev,
            [name]: option
        }));
    };

    const handleAddonToggle = (addon) => {
        setSelectedAddons(prev => {
            const exists = prev.find(a => a.name === addon.name);
            if (exists) {
                return prev.filter(a => a.name !== addon.name);
            }
            return [...prev, addon];
        });
    };

    const calculateTotalPrice = () => {
        let total = item.price * quantity;

        // Add variation costs
        Object.values(selectedVariations).forEach(variation => {
            if (variation.price) {
                total += variation.price * quantity;
            }
        });

        // Add addon costs
        selectedAddons.forEach(addon => {
            total += addon.price * quantity;
        });

        return total.toFixed(2);
    };

    const handleAddToCart = async () => {
        setIsLoading(true);
        try {
            const cartItem = {
                ...item,
                quantity,
                variations: selectedVariations,
                addons: selectedAddons,
                total_price: calculateTotalPrice()
            };

            await addToCart(cartItem);

            toast({
                title: "Successfully Added! 🎉",
                description: (
                    <div className="flex items-center gap-2">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                        <div>
                            <p className="font-medium">{quantity}x {item.name}</p>
                            <p className="text-sm text-gray-500">Added to your cart</p>
                        </div>
                    </div>
                ),
                variant: "success",
                duration: 3000
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add item to cart. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: item.name,
                text: item.description,
                url: window.location.href
            }).catch(error => {
                console.error('Error sharing:', error);
                setShowShareDialog(true);
            });
        } else {
            setShowShareDialog(true);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            toast({
                title: "Link Copied!",
                description: "The link has been copied to your clipboard",
                variant: "success"
            });
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Error copying link:', error);
        }
    };

    const shareOptions = [
        {
            name: 'Copy Link',
            icon: Copy,
            onClick: handleCopyLink,
            className: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
        },
        {
            name: 'Facebook',
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
            className: 'bg-blue-500 hover:bg-blue-600 text-white'
        },
        {
            name: 'Twitter',
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(item.name)}`,
            className: 'bg-sky-500 hover:bg-sky-600 text-white'
        },
        {
            name: 'WhatsApp',
            icon: Phone,
            href: `https://wa.me/?text=${encodeURIComponent(`${item.name} - ${window.location.href}`)}`,
            className: 'bg-green-500 hover:bg-green-600 text-white'
        }
    ];

    const handleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast({
            title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
            description: `${item.name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist`,
            variant: "success"
        });
    };

    // Enhanced features data with animations
    const enhancedFeatures = [
        {
            icon: ShieldCheck,
            label: 'Quality Assured',
            description: 'Fresh ingredients daily',
            color: 'text-green-500'
        },
        {
            icon: Timer,
            label: 'Prep Time',
            description: `${item.preparation_time || '20-30'} mins`,
            color: 'text-blue-500'
        },
        {
            icon: Tag,
            label: 'Best Price',
            description: 'Price match guarantee',
            color: 'text-purple-500'
        }
    ];

    // Nutrition data (example)
    const nutritionInfo = {
        calories: '650 kcal',
        protein: '25g',
        carbs: '85g',
        fat: '22g',
        fiber: '8g',
        sodium: '1200mg'
    };

    // Add nutritional information section
    const NutritionalInfo = () => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            {[
                { label: 'Calories', value: item.nutrition?.calories || '---' },
                { label: 'Protein', value: item.nutrition?.protein || '---' },
                { label: 'Carbs', value: item.nutrition?.carbs || '---' },
                { label: 'Fat', value: item.nutrition?.fat || '---' }
            ].map((info) => (
                <div key={info.label} className="text-center">
                    <div className="text-2xl font-bold text-primary">{info.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{info.label}</div>
                </div>
            ))}
        </div>
    );

    // Add ingredients section
    const IngredientsSection = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {item.ingredients?.map((ingredient) => (
                <HoverCard key={ingredient.name}>
                    <HoverCardTrigger asChild>
                        <Button variant="outline" className="w-full justify-start gap-2">
                            <img
                                src={ingredient.icon}
                                alt={ingredient.name}
                                className="w-6 h-6 object-cover rounded-full"
                            />
                            {ingredient.name}
                        </Button>
                    </HoverCardTrigger>
                    <HoverCardContent>
                        <div className="space-y-2">
                            <h4 className="font-semibold">{ingredient.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {ingredient.description}
                            </p>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            ))}
        </div>
    );

    // Add tabs for better organization
    const tabs = [
        { id: 'details', label: 'Details', icon: Info },
        { id: 'ingredients', label: 'Ingredients', icon: Utensils },
        { id: 'nutrition', label: 'Nutrition', icon: Scale },
        { id: 'reviews', label: `Reviews (${reviews?.length || 0})`, icon: MessageCircle }
    ];

    // Enhanced rating display
    const RatingDisplay = () => (
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={cn(
                            "w-5 h-5 transition-colors",
                            i < Math.floor(item.rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-200"
                        )}
                    />
                ))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
                ({item.reviews_count || 0} reviews)
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {item.preparation_time || '20-30'} mins
            </div>
        </div>
    );

    // Enhanced price section
    const PriceSection = () => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">
                            ${calculateTotalPrice()}
                        </span>
                        {item.original_price && (
                            <span className="text-lg text-gray-400 line-through">
                                ${item.original_price}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-xl p-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="h-9 w-9 hover:bg-primary hover:text-white transition-colors"
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center text-lg font-semibold">
                        {quantity}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= 10}
                        className="h-9 w-9 hover:bg-primary hover:text-white transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    size="lg"
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={handleAddToCart}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Adding...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            Add to Cart
                        </span>
                    )}
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12"
                    onClick={handleWishlist}
                >
                    <Heart
                        className={cn(
                            "w-5 h-5 transition-colors",
                            isWishlisted && "fill-current text-red-500"
                        )}
                    />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12"
                    onClick={handleShare}
                >
                    <Share2 className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );

    // Enhanced features section
    const FeaturesSection = () => (
        <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-primary">
                    <ShieldCheck className="w-5 h-5" />
                    <h3 className="font-medium">Quality Assured</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fresh ingredients daily
                </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-primary">
                    <Clock className="w-5 h-5" />
                    <h3 className="font-medium">Prep Time</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.preparation_time || '20-30'} mins
                </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-primary">
                    <Tag className="w-5 h-5" />
                    <h3 className="font-medium">Best Price</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Price match guarantee
                </p>
            </div>
        </div>
    );

    return (
        <Layout>
            <Head title={item.name} />

            <div className="container py-6 space-y-8">
                {/* Rating Display */}
                <RatingDisplay />

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Image */}
                    <div className="space-y-6">
                        {/* Main Image Slider */}
                        <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <Swiper
                                spaceBetween={0}
                                navigation={true}
                                pagination={{
                                    clickable: true,
                                    dynamicBullets: true
                                }}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[Navigation, Pagination, Thumbs]}
                                className="aspect-square md:aspect-[4/3] group"
                            >
                                <SwiperSlide>
                                    <motion.div
                                        className="relative w-full h-full group"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Enhanced Image Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <h3 className="text-white text-xl font-bold mb-2">
                                                    {item.name}
                                                </h3>
                                                <p className="text-gray-200 text-sm line-clamp-2">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Enhanced Badges */}
                                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                                            {item.is_new && (
                                                <Badge className="bg-blue-500 px-3 py-1">
                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                    New
                                                </Badge>
                                            )}
                                            {item.discount > 0 && (
                                                <Badge variant="destructive" className="animate-pulse">
                                                    {item.discount}% OFF
                                                </Badge>
                                            )}
                                        </div>
                                    </motion.div>
                                </SwiperSlide>
                                {/* Gallery Slides */}
                                {item.gallery?.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <motion.div
                                            className="relative aspect-square"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <img
                                                src={image}
                                                alt={`${item.name} view ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Enhanced Features Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            {enhancedFeatures.map((feature, index) => (
                                <motion.div
                                    key={feature.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className={cn(
                                        "absolute -top-3 -left-3 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg",
                                        feature.color
                                    )}>
                                        <feature.icon className="w-5 h-5" />
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {feature.label}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Title and Description */}
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {item.name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {item.description}
                            </p>
                        </div>

                        {/* Price Section */}
                        <PriceSection />

                        {/* Features */}
                        <FeaturesSection />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Show; 