import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    Clock,
    ArrowLeft,
    ShoppingCart,
    Heart,
    Share2,
    Info,
    AlertTriangle,
    ChevronDown,
    Check,
    Flame,
    Shield,
    ThumbsUp,
    Calendar,
    MapPin,
    Bookmark,
    Award,
    Send,
    MessageSquare,
    Camera,
    DollarSign,
    Percent,
    ChevronRight,
    ChevronUp,
    Tag,
    UserCheck,
    Truck,
    Coffee,
    Map,
    Leaf,
    Utensils,
    BarChart2,
    PieChart,
    Play,
    X,
    Loader2,
    Plus,
    Minus
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Checkbox } from '@/Components/ui/checkbox';
import { Label } from '@/Components/ui/label';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { cn } from '@/lib/utils';
import { Textarea } from '@/Components/ui/textarea';
import { Input } from '@/Components/ui/input';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/Components/ui/tabs';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/Components/ui/carousel";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
    SheetFooter,
} from "@/Components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/Components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/Components/ui/drawer";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/Components/ui/hover-card";
import { Progress } from "@/Components/ui/progress";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useToast } from "@/Components/ui/use-toast";

const Details2 = ({ item = null, relatedItems = [], reviews = [], error = null }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariations, setSelectedVariations] = useState({});
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [activeGalleryImage, setActiveGalleryImage] = useState(0);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { toast } = useToast();

    // Initialize selected variations when item data loads
    useEffect(() => {
        if (item?.variations) {
            const initialVariations = {};
            item.variations.forEach(variation => {
                // Default to first option for each variation
                initialVariations[variation.name] = 0;
            });
            setSelectedVariations(initialVariations);
        }
    }, [item]);

    // If we have an error or no item, show error message
    if (error || !item) {
        return (
            <Layout>
                <Head title="Item Not Found" />
                <div className="container mx-auto py-16 px-4">
                    <Alert variant="destructive" className="mb-6">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            {error || "The menu item you're looking for could not be found."}
                        </AlertDescription>
                    </Alert>

                    <Link href="/food-menu">
                        <Button variant="outline" className="flex items-center">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Menu
                        </Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head title={item.name} />

            {/* Hero Section */}
            <HeroSection item={item} />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Images & Details */}
                    <LeftColumn
                        item={item}
                        activeGalleryImage={activeGalleryImage}
                        setActiveGalleryImage={setActiveGalleryImage}
                        setIsNutritionModalOpen={setIsNutritionModalOpen}
                        setIsVideoModalOpen={setIsVideoModalOpen}
                    />

                    {/* Right Column - Order Details */}
                    <RightColumn
                        item={item}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        selectedVariations={selectedVariations}
                        setSelectedVariations={setSelectedVariations}
                        selectedAddons={selectedAddons}
                        setSelectedAddons={setSelectedAddons}
                        specialInstructions={specialInstructions}
                        setSpecialInstructions={setSpecialInstructions}
                        isFavorite={isFavorite}
                        setIsFavorite={setIsFavorite}
                        isAddingToCart={isAddingToCart}
                        setIsAddingToCart={setIsAddingToCart}
                        toast={toast}
                    />
                </div>

                {/* Tabs Section */}
                <div className="mt-16">
                    <TabsSection
                        item={item}
                        reviews={reviews}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setIsReviewModalOpen={setIsReviewModalOpen}
                    />
                </div>

                {/* Related Items Section */}
                <RelatedItemsSection relatedItems={relatedItems} />
            </div>

            {/* Modals */}
            <NutritionModal
                item={item}
                isOpen={isNutritionModalOpen}
                setIsOpen={setIsNutritionModalOpen}
            />

            <ReviewModal
                item={item}
                isOpen={isReviewModalOpen}
                setIsOpen={setIsReviewModalOpen}
                toast={toast}
            />

            <VideoModal
                isOpen={isVideoModalOpen}
                setIsOpen={setIsVideoModalOpen}
            />
        </Layout>
    );
};

// Hero Section Component
const HeroSection = ({ item }) => {
    return (
        <div className="relative bg-gray-900 overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    filter: 'blur(4px)'
                }}
            />

            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />

            {/* Content */}
            <div className="container mx-auto relative z-10 py-16 md:py-24 px-4">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />

                        {/* Item badges */}
                        <div className="absolute top-4 left-4 flex flex-col space-y-2">
                            {item.is_new && (
                                <Badge className="bg-blue-500 text-white px-3 py-1.5">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    New
                                </Badge>
                            )}
                            {item.is_popular && (
                                <Badge className="bg-purple-500 text-white px-3 py-1.5">
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    Popular
                                </Badge>
                            )}
                            {item.discount > 0 && (
                                <Badge className="bg-red-500 text-white px-3 py-1.5">
                                    <Percent className="w-3 h-3 mr-1" />
                                    {item.discount}% OFF
                                </Badge>
                            )}
                        </div>
                    </motion.div>

                    {/* Info */}
                    <div className="md:flex-1">
                        {/* Category Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Link href={`/food-menu/category/${item.category.slug}`}>
                                <Badge variant="outline" className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                    {item.category.name}
                                </Badge>
                            </Link>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                        >
                            {item.name}
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-white/80 mb-6 max-w-2xl"
                        >
                            {item.description}
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-wrap gap-4 md:gap-6 text-white/90 mb-6"
                        >
                            <div className="flex items-center">
                                <Star className="w-5 h-5 text-yellow-400 mr-2" fill="#FBBF24" />
                                <span className="font-medium">{item.rating}</span>
                                <span className="text-white/60 ml-1">({item.reviews_count} reviews)</span>
                            </div>

                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-2" />
                                <span>{item.preparation_time}</span>
                            </div>

                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 mr-2" />
                                <span>{item.origin}</span>
                            </div>

                            <div className="flex items-center">
                                <Utensils className="w-5 h-5 mr-2" />
                                <span>{item.cooking_method}</span>
                            </div>
                        </motion.div>

                        {/* Price & Action */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-wrap items-center gap-4 md:gap-8"
                        >
                            <div className="flex items-center">
                                <span className="text-white/60 mr-2">Price:</span>
                                <div className="flex items-center">
                                    <span className="text-3xl font-bold text-white">
                                        ${item.discount ?
                                            (item.price * (1 - item.discount / 100)).toFixed(2) :
                                            item.price.toFixed(2)
                                        }
                                    </span>
                                    {item.discount > 0 && (
                                        <span className="ml-2 text-xl text-white/60 line-through">
                                            ${item.price.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <Link href="#order-section" className="inline-block">
                                <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white px-8">
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Order Now
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
    );
};

// Left Column Component
const LeftColumn = ({
    item,
    activeGalleryImage,
    setActiveGalleryImage,
    setIsNutritionModalOpen,
    setIsVideoModalOpen
}) => {
    const imageGallery = item.image_gallery || [
        { url: item.image, alt: item.name }
    ];

    return (
        <div className="w-full lg:w-2/5">
            <div className="sticky top-24 space-y-6">
                {/* Main Image Gallery */}
                <div className="space-y-4">
                    {/* Main Large Image */}
                    <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeGalleryImage}
                                src={imageGallery[activeGalleryImage]?.url || item.image}
                                alt={imageGallery[activeGalleryImage]?.alt || item.name}
                                className="w-full h-full object-cover"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </AnimatePresence>

                        {/* Video play button (mock) */}
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
                            onClick={() => setIsVideoModalOpen(true)}
                        >
                            <Play className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-2">
                        {imageGallery.map((image, index) => (
                            <button
                                key={index}
                                className={cn(
                                    "rounded-lg overflow-hidden border-2 aspect-square",
                                    activeGalleryImage === index
                                        ? "border-primary"
                                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                                )}
                                onClick={() => setActiveGalleryImage(index)}
                            >
                                <img
                                    src={image.url || item.image}
                                    alt={image.alt || `${item.name} thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Origin & Cooking Method */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                            <Map className="w-4 h-4 mr-2 text-primary" />
                            Origin & Preparation
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Cuisine</div>
                            <div className="font-medium text-gray-900 dark:text-white flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-red-500" />
                                {item.origin}
                            </div>
                        </div>

                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Method</div>
                            <div className="font-medium text-gray-900 dark:text-white flex items-center">
                                <Utensils className="w-4 h-4 mr-1 text-blue-500" />
                                {item.cooking_method}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nutrition Info Quick View */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                            <PieChart className="w-4 h-4 mr-2 text-primary" />
                            Nutritional Information
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setIsNutritionModalOpen(true)}>
                            View Details
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {item.nutritional_info && Object.entries(item.nutritional_info).slice(0, 4).map(([key, value], index) => (
                            <div key={index} className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                    {value}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    {key}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Allergens */}
                    {item.allergens && item.allergens.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-2">
                                <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Contains:
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {item.allergens.map((allergen, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/30"
                                    >
                                        {allergen}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Chef's Notes */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mr-3">
                            <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Chef's Notes
                        </h3>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 italic">
                        "{item.chefs_notes}"
                    </p>
                </div>

                {/* Sustainability Section */}
                {item.sustainability && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                        <div className="flex items-center mb-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full mr-3">
                                <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Sustainability
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(item.sustainability).map(([key, value], index) => (
                                <div key={index} className="flex items-center">
                                    {value ? (
                                        <Check className="w-4 h-4 text-green-500 mr-2" />
                                    ) : (
                                        <X className="w-4 h-4 text-gray-400 mr-2" />
                                    )}
                                    <span className={cn(
                                        "text-sm",
                                        value ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                                    )}>
                                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Right Column Component
const RightColumn = ({
    item,
    quantity,
    setQuantity,
    selectedVariations,
    setSelectedVariations,
    selectedAddons,
    setSelectedAddons,
    specialInstructions,
    setSpecialInstructions,
    isFavorite,
    setIsFavorite,
    isAddingToCart,
    setIsAddingToCart,
    toast
}) => {
    // Calculate total price
    const calculateTotalPrice = () => {
        if (!item) return 0;

        let total = item.price;

        // Add variation costs
        if (item.variations) {
            Object.entries(selectedVariations).forEach(([variationName, optionIndex]) => {
                const variation = item.variations.find(v => v.name === variationName);
                if (variation && variation.options[optionIndex]) {
                    total += variation.options[optionIndex].price;
                }
            });
        }

        // Add addon costs
        if (item.addons) {
            selectedAddons.forEach(addonIndex => {
                if (item.addons[addonIndex]) {
                    total += item.addons[addonIndex].price;
                }
            });
        }

        // Apply discount if available
        if (item.discount) {
            total = total * (1 - item.discount / 100);
        }

        // Multiply by quantity
        total = total * quantity;

        return total.toFixed(2);
    };

    // Handle variation selection
    const handleVariationChange = (variationName, optionIndex) => {
        setSelectedVariations(prev => ({
            ...prev,
            [variationName]: optionIndex
        }));
    };

    // Handle addon selection
    const handleAddonToggle = (addonIndex) => {
        setSelectedAddons(prev => {
            if (prev.includes(addonIndex)) {
                return prev.filter(idx => idx !== addonIndex);
            } else {
                return [...prev, addonIndex];
            }
        });
    };

    // Handle quantity change
    const handleQuantityChange = (amount) => {
        const newQuantity = Math.max(1, quantity + amount);
        setQuantity(newQuantity);
    };

    // Handle add to cart
    const handleAddToCart = async () => {
        setIsAddingToCart(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
            title: "Added to cart",
            description: `${quantity} × ${item.name} added to your cart.`,
        });

        setIsAddingToCart(false);
    };

    // Handle favorite toggle
    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);

        toast({
            title: isFavorite ? "Removed from favorites" : "Added to favorites",
            description: isFavorite ? `${item.name} removed from your favorites.` : `${item.name} added to your favorites.`,
        });
    };

    return (
        <div id="order-section" className="w-full lg:w-3/5">
            <div className="space-y-8">
                {/* Actions Bar */}
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <Link href="/food-menu">
                        <Button variant="outline" size="sm" className="flex items-center">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back to Menu
                        </Button>
                    </Link>

                    <div className="flex items-center space-x-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "rounded-full",
                                            isFavorite && "text-red-500 hover:text-red-600"
                                        )}
                                        onClick={toggleFavorite}
                                    >
                                        <Heart
                                            className="h-5 w-5"
                                            fill={isFavorite ? "currentColor" : "none"}
                                        />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full"
                                    >
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Share item</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                {/* Variations Section */}
                {item.variations && item.variations.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-xl mb-4">
                            Customize Your Order
                        </h3>

                        <div className="space-y-6">
                            {item.variations.map((variation, varIndex) => (
                                <div key={varIndex} className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            {variation.name}
                                        </h4>
                                        {variation.required && (
                                            <Badge variant="outline" className="text-gray-500">Required</Badge>
                                        )}
                                    </div>

                                    <RadioGroup
                                        value={selectedVariations[variation.name]?.toString() || "0"}
                                        onValueChange={(value) => handleVariationChange(variation.name, parseInt(value))}
                                        className="space-y-2"
                                    >
                                        {variation.options.map((option, optIndex) => (
                                            <div
                                                key={optIndex}
                                                className={cn(
                                                    "flex items-center justify-between p-3 rounded-lg border",
                                                    parseInt(selectedVariations[variation.name]) === optIndex
                                                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                                                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/70"
                                                )}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem id={`${variation.name}-${optIndex}`} value={optIndex.toString()} />
                                                    <Label htmlFor={`${variation.name}-${optIndex}`} className="cursor-pointer">
                                                        {option.name}
                                                    </Label>
                                                </div>
                                                {option.price > 0 && (
                                                    <span className={cn(
                                                        "text-sm font-medium",
                                                        parseInt(selectedVariations[variation.name]) === optIndex
                                                            ? "text-primary"
                                                            : "text-gray-500 dark:text-gray-400"
                                                    )}>
                                                        +${option.price.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add-ons Section */}
                {item.addons && item.addons.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-xl mb-4 flex items-center">
                            <Plus className="w-5 h-5 mr-2 text-primary" />
                            Add Extra Toppings
                        </h3>

                        <div className="space-y-2">
                            {item.addons.map((addon, addonIndex) => (
                                <div
                                    key={addonIndex}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-lg border",
                                        selectedAddons.includes(addonIndex)
                                            ? "border-primary bg-primary/5 dark:bg-primary/10"
                                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/70"
                                    )}
                                >
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`addon-${addonIndex}`}
                                            checked={selectedAddons.includes(addonIndex)}
                                            onCheckedChange={() => handleAddonToggle(addonIndex)}
                                        />
                                        <Label htmlFor={`addon-${addonIndex}`} className="cursor-pointer">
                                            {addon.name}
                                        </Label>
                                    </div>
                                    <span className={cn(
                                        "text-sm font-medium",
                                        selectedAddons.includes(addonIndex)
                                            ? "text-primary"
                                            : "text-gray-500 dark:text-gray-400"
                                    )}>
                                        +${addon.price.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Special Instructions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-xl mb-4 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                        Special Instructions
                    </h3>

                    <Textarea
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Any special requests or allergies we should know about?"
                        className="resize-none"
                        rows={3}
                    />

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Our kitchen will do its best to accommodate your requests
                    </p>
                </div>

                {/* Quantity and Order Box */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 space-y-6">
                    {/* Price & Quantity */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                Price
                            </h3>
                            <div className="flex items-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                    ${calculateTotalPrice()}
                                </span>
                                {item.discount > 0 && (
                                    <Badge className="ml-2 bg-red-500 text-white">
                                        {item.discount}% OFF
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1 text-right">
                                Quantity
                            </h3>
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center text-xl font-medium">
                                    {quantity}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                    onClick={() => handleQuantityChange(1)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                        className="w-full h-14 text-lg rounded-xl"
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                    >
                        {isAddingToCart ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Adding to Cart...
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Add to Cart - ${calculateTotalPrice()}
                            </>
                        )}
                    </Button>

                    {/* Delivery Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <div className="flex items-center">
                            <Truck className="w-4 h-4 mr-2 text-primary" />
                            <span>Delivery: 25-40 min</span>
                        </div>
                        <div className="flex items-center">
                            <Tag className="w-4 h-4 mr-2 text-primary" />
                            <span>Free delivery over $30</span>
                        </div>
                    </div>
                </div>

                {/* Pairing Suggestions */}
                {item.pairings && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-xl mb-4 flex items-center">
                            <Coffee className="w-5 h-5 mr-2 text-primary" />
                            Perfect Pairings
                        </h3>

                        <div className="space-y-3">
                            {item.pairings.map((pairing, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            {pairing.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {pairing.description}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        Add
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Tabs Section Component
const TabsSection = ({ item, reviews, activeTab, setActiveTab, setIsReviewModalOpen }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <Tabs
                defaultValue="overview"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                    <TabsTrigger value="preparation">Preparation</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="pt-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            About this Dish
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            {item.description}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            Our {item.name} is prepared with the freshest ingredients, following traditional {item.origin} recipes with a modern twist. Each dish is made to order to ensure the best quality and taste experience.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Key Features */}
                        <div className="space-y-4">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                                Key Features
                            </h4>
                            <div className="space-y-2">
                                {[
                                    { icon: Award, text: `Authentic ${item.origin} recipe` },
                                    { icon: Flame, text: item.is_spicy ? 'Spicy flavor profile' : 'Mild flavor profile' },
                                    { icon: Leaf, text: item.is_vegetarian ? 'Vegetarian friendly' : 'Contains animal products' },
                                    { icon: Clock, text: `Ready in ${item.preparation_time}` }
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-start">
                                        <feature.icon className="w-5 h-5 text-primary mr-3 mt-0.5" />
                                        <span className="text-gray-700 dark:text-gray-300">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dietary Information */}
                        <div className="space-y-4">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                                Dietary Information
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { label: 'Gluten Free', value: item.is_gluten_free },
                                    { label: 'Dairy Free', value: item.is_dairy_free },
                                    { label: 'Vegan', value: item.is_vegan },
                                    { label: 'Vegetarian', value: item.is_vegetarian },
                                    { label: 'Nut Free', value: item.is_nut_free },
                                    { label: 'Organic', value: item.sustainability?.organic }
                                ].map((diet, index) => (
                                    <div key={index} className="flex items-center">
                                        {diet.value ? (
                                            <Check className="w-4 h-4 text-green-500 mr-2" />
                                        ) : (
                                            <X className="w-4 h-4 text-red-500 mr-2" />
                                        )}
                                        <span className="text-gray-700 dark:text-gray-300">{diet.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Ingredients Tab */}
                <TabsContent value="ingredients" className="pt-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Ingredients
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            Our ingredients are locally sourced whenever possible and carefully selected for quality and flavor.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                    Main Ingredients
                                </h4>
                                <ul className="space-y-2">
                                    {[
                                        'Fresh organic vegetables',
                                        'Premium quality proteins',
                                        'Artisanal cheeses',
                                        'House-made sauces',
                                        'Aromatic herbs and spices',
                                        'Cold-pressed oils'
                                    ].map((ingredient, index) => (
                                        <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3"></div>
                                            {ingredient}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                    Spices & Seasonings
                                </h4>
                                <ul className="space-y-2">
                                    {[
                                        'Sea salt',
                                        'Black pepper',
                                        'Garlic powder',
                                        'Smoked paprika',
                                        'Cayenne pepper',
                                        'Fresh herbs'
                                    ].map((spice, index) => (
                                        <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3"></div>
                                            {spice}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Allergens Alert */}
                        {item.allergens && item.allergens.length > 0 && (
                            <Alert variant="warning" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800/30">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    <div className="font-medium mb-1">Allergen Information</div>
                                    <div className="text-sm">
                                        This dish contains: {item.allergens.join(', ')}
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </TabsContent>

                {/* Preparation Tab */}
                <TabsContent value="preparation" className="pt-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Preparation Method
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            Our {item.name} is {item.cooking_method.toLowerCase()} to perfection, following our chef's special technique.
                        </p>

                        <div className="space-y-4">
                            {item.preparation_steps?.map((step, index) => (
                                <div key={index} className="flex">
                                    <div className="mr-4">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">
                                            {step.step}
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                            <h4 className="font-medium text-primary mb-2">
                                Chef's Tip
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                {item.chefs_notes}
                            </p>
                        </div>
                    </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="pt-6 space-y-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Customer Reviews
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {reviews?.length || 0} reviews for this item
                            </p>
                        </div>

                        <Button onClick={() => setIsReviewModalOpen(true)}>
                            Write a Review
                        </Button>
                    </div>

                    {/* Reviews List */}
                    {reviews && reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.slice(0, 3).map((review, index) => (
                                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={review.profile_image}
                                                alt={review.user_name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {review.title}
                                                    </h4>
                                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        <span className="font-medium text-gray-900 dark:text-white mr-2">
                                                            {review.user_name}
                                                        </span>
                                                        {review.verified_purchase && (
                                                            <Badge className="ml-2 bg-green-500 text-white text-xs">
                                                                <UserCheck className="w-3 h-3 mr-1" />
                                                                Verified
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={cn(
                                                                "w-4 h-4",
                                                                i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {review.tags?.map((tag, tagIndex) => (
                                                    <Badge key={tagIndex} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <p className="mt-3 text-gray-700 dark:text-gray-300">
                                                {review.comment}
                                            </p>

                                            {/* Review Images */}
                                            {review.images && review.images.length > 0 && (
                                                <div className="flex gap-2 mt-3">
                                                    {review.images.map((image, imgIndex) => (
                                                        <div key={imgIndex} className="w-16 h-16 rounded-md overflow-hidden">
                                                            <img
                                                                src={image.url}
                                                                alt={image.alt}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Restaurant Response */}
                                            {review.restaurant_response && (
                                                <div className="mt-3 pl-4 border-l-2 border-primary">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        Response from Restaurant:
                                                    </p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                                        {review.restaurant_response.text}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                                                    <ThumbsUp className="w-4 h-4 mr-1" />
                                                    <span>Helpful ({review.helpful_count})</span>
                                                </Button>
                                                <span className="mx-2">•</span>
                                                <span>{new Date(review.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {reviews.length > 3 && (
                                <Button variant="outline" className="w-full">
                                    View All {reviews.length} Reviews
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No Reviews Yet
                            </h4>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Be the first to review this item!
                            </p>
                            <Button onClick={() => setIsReviewModalOpen(true)}>
                                Write a Review
                            </Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

// Related Items Section Component
const RelatedItemsSection = ({ relatedItems = [] }) => {
    if (!relatedItems?.length) return null;

    return (
        <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    You Might Also Like
                </h2>
                <Link
                    href="/food-menu"
                    className="text-primary hover:text-primary/90 flex items-center"
                >
                    View All Menu
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
            </div>

            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {relatedItems.map((item, index) => (
                        <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="h-full"
                            >
                                <Link
                                    href={`/food-menu/details2/${item.slug}`}
                                    className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
                                >
                                    <div className="relative h-40 overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                        {item.discount > 0 && (
                                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                {item.discount}% OFF
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
                                            {item.description}
                                        </p>
                                        <div className="flex justify-between items-center mt-auto">
                                            <div className="font-bold text-gray-900 dark:text-white">
                                                ${item.price.toFixed(2)}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                                <span>{item.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-1" />
                <CarouselNext className="right-1" />
            </Carousel>
        </div>
    );
};

// Nutrition Modal Component
const NutritionModal = ({ item, isOpen, setIsOpen }) => {
    if (!item?.nutritional_info) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-xl">
                        <PieChart className="w-5 h-5 mr-2 text-primary" />
                        Nutritional Information
                    </DialogTitle>
                    <DialogDescription>
                        Complete nutritional breakdown for {item.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Main Nutrients */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(item.nutritional_info).map(([key, value], index) => (
                            <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {value}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    {key}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Daily Value Chart */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                            % Daily Value
                        </h4>

                        <div className="space-y-3">
                            {[
                                { name: 'Total Fat', value: 25, dailyValue: '30g' },
                                { name: 'Saturated Fat', value: 15, dailyValue: '20g' },
                                { name: 'Cholesterol', value: 10, dailyValue: '300mg' },
                                { name: 'Sodium', value: 40, dailyValue: '2,300mg' },
                                { name: 'Total Carbohydrate', value: 30, dailyValue: '275g' },
                                { name: 'Dietary Fiber', value: 20, dailyValue: '28g' },
                                { name: 'Sugars', value: 35, dailyValue: '50g' },
                                { name: 'Protein', value: 45, dailyValue: '50g' },
                            ].map((nutrient, index) => (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {nutrient.name}
                                        </span>
                                        <span className="text-gray-900 dark:text-white font-medium">
                                            {nutrient.value}% ({nutrient.dailyValue})
                                        </span>
                                    </div>
                                    <Progress value={nutrient.value} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Allergens */}
                    {item.allergens && item.allergens.length > 0 && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-2">
                                <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Allergen Information
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {item.allergens.map((allergen, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/30"
                                    >
                                        {allergen}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                        *Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// Review Modal Component
const ReviewModal = ({ item, isOpen, setIsOpen, toast }) => {
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: "Review Submitted",
            description: "Thank you for your feedback!",
        });

        setIsSubmitting(false);
        setIsOpen(false);

        // Reset form
        setRating(5);
        setReviewText('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-xl">
                        <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                        Write a Review
                    </DialogTitle>
                    <DialogDescription>
                        Share your experience with {item.name}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Rating */}
                    <div className="space-y-2">
                        <Label>Your Rating</Label>
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={cn(
                                            "w-8 h-8",
                                            star <= rating
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300 dark:text-gray-600"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Text */}
                    <div className="space-y-2">
                        <Label>Your Review</Label>
                        <Textarea
                            placeholder="What did you like or dislike about this dish?"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={5}
                            required
                        />
                    </div>

                    {/* Photo Upload (Mock) */}
                    <div className="space-y-2">
                        <Label className="flex items-center">
                            <Camera className="w-4 h-4 mr-2" />
                            Add Photos (optional)
                        </Label>
                        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                            <Button type="button" variant="outline">
                                Choose Files
                            </Button>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Supported formats: JPG, PNG. Max 5MB each.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Review
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// Video Modal Component
const VideoModal = ({ isOpen, setIsOpen }) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} className="max-w-3xl">
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Recipe Video</DialogTitle>
                </DialogHeader>

                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white p-8">
                        <Play className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <p className="text-lg font-medium">Video Playback (Demo)</p>
                        <p className="text-sm text-gray-400 mt-2">
                            This is a placeholder for the recipe video. In a production environment, this would show an actual video player.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Details2; 