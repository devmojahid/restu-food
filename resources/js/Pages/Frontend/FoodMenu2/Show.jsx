import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import { motion } from 'framer-motion';
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
    Calendar
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Checkbox } from '@/Components/ui/checkbox';
import { Label } from '@/Components/ui/label';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { cn } from '@/lib/utils';
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

const Show = ({ item = null, relatedItems = [], reviews = [], error = null }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariations, setSelectedVariations] = useState({});
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [activeTab, setActiveTab] = useState('description');

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

            {/* Breadcrumb */}
            <div className="bg-gray-50 dark:bg-gray-900/50 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center text-sm">
                        <Link
                            href="/food-menu"
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            Menu
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <Link
                            href={`/food-menu/category/${item.category.slug}`}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            {item.category.name}
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="text-gray-900 dark:text-white font-medium">{item.name}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Back Button (Mobile Only) */}
                    <div className="lg:hidden mb-4">
                        <Link href="/food-menu">
                            <Button variant="outline" size="sm" className="flex items-center">
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                    </div>

                    {/* Left Column - Images */}
                    <div className="w-full lg:w-1/2">
                        <div className="sticky top-24">
                            {/* Main Image */}
                            <div className="rounded-xl overflow-hidden mb-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-[300px] md:h-[400px] object-cover"
                                />
                            </div>

                            {/* Image Gallery (Placeholder) */}
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all cursor-pointer"
                                        style={{
                                            backgroundImage: `url(${item.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Nutrition Info Quick View */}
                            <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <Info className="w-4 h-4 mr-2" />
                                    Nutritional Information
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {item.nutritional_info && Object.entries(item.nutritional_info).map(([key, value], index) => (
                                        <div key={index} className="text-center">
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
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="w-full lg:w-1/2">
                        <div className="space-y-6">
                            {/* Title and Rating */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{item.name}</h1>
                                    <div className="flex space-x-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-full">
                                                        <Heart className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Save to favorites</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-full">
                                                        <Share2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Share item</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                <div className="flex items-center mt-2 space-x-4">
                                    <div className="flex items-center">
                                        <Star className="w-5 h-5 text-yellow-400 mr-1" />
                                        <span className="font-medium">{item.rating}</span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-1">
                                            ({item.reviews_count} reviews)
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span>{item.preparation_time}</span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mt-4 flex items-center">
                                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                        ${item.discount ?
                                            (item.price * (1 - item.discount / 100)).toFixed(2) :
                                            item.price.toFixed(2)
                                        }
                                    </div>
                                    {item.discount && (
                                        <div className="ml-3 flex items-center">
                                            <span className="text-xl text-gray-500 line-through">
                                                ${item.price.toFixed(2)}
                                            </span>
                                            <Badge className="ml-2 bg-red-500">
                                                {item.discount}% OFF
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Dietary Tags */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {item.is_vegetarian && (
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 flex items-center">
                                            <Shield className="w-3 h-3 mr-1" />
                                            Vegetarian
                                        </Badge>
                                    )}
                                    {item.is_spicy && (
                                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 flex items-center">
                                            <Flame className="w-3 h-3 mr-1" />
                                            Spicy
                                        </Badge>
                                    )}
                                    {item.is_popular && (
                                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 flex items-center">
                                            <ThumbsUp className="w-3 h-3 mr-1" />
                                            Popular
                                        </Badge>
                                    )}
                                    {item.is_new && (
                                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            New
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Tabs: Description, Ingredients, Reviews */}
                            <Tabs
                                defaultValue="description"
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="description">Description</TabsTrigger>
                                    <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                                </TabsList>
                                <TabsContent value="description" className="pt-4">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {item.description}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300 mt-4">
                                        Our {item.name} is prepared with the freshest ingredients, following traditional recipes with a modern twist. Each dish is made to order to ensure the best quality and taste experience.
                                    </p>
                                </TabsContent>
                                <TabsContent value="ingredients" className="pt-4">
                                    <div className="space-y-4">
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Our ingredients are locally sourced whenever possible and carefully selected for quality and flavor.
                                        </p>
                                        <ul className="space-y-1">
                                            {[
                                                'Fresh organic vegetables',
                                                'Premium quality proteins',
                                                'Artisanal cheeses',
                                                'House-made sauces',
                                                'Aromatic herbs and spices',
                                                'Cold-pressed oils'
                                            ].map((ingredient, index) => (
                                                <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                                                    <span className="inline-block w-1 h-1 rounded-full bg-primary mt-2 mr-2"></span>
                                                    {ingredient}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </TabsContent>
                                <TabsContent value="reviews" className="pt-4">
                                    {reviews && reviews.length > 0 ? (
                                        <div className="space-y-4">
                                            {reviews.map((review, index) => (
                                                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="font-medium text-gray-900 dark:text-white">
                                                                {review.user_name}
                                                                {review.verified_purchase && (
                                                                    <Badge className="ml-2 bg-green-500 text-white text-xs">Verified</Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {new Date(review.date).toLocaleDateString()}
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
                                                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                                                        {review.comment}
                                                    </p>
                                                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                        <ThumbsUp className="w-3 h-3 mr-1" />
                                                        <span>{review.likes} people found this helpful</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 dark:text-gray-400">
                                                No reviews yet. Be the first to review this item!
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>

                            <Separator />

                            {/* Variations Section */}
                            {item.variations && item.variations.length > 0 && (
                                <div className="space-y-6">
                                    {item.variations.map((variation, varIndex) => (
                                        <div key={varIndex}>
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {variation.name}
                                                </h3>
                                                {variation.required && (
                                                    <Badge variant="outline" className="text-gray-500">Required</Badge>
                                                )}
                                            </div>

                                            <RadioGroup
                                                value={selectedVariations[variation.name]?.toString() || "0"}
                                                onValueChange={(value) => handleVariationChange(variation.name, parseInt(value))}
                                                className="mt-3 space-y-2"
                                            >
                                                {variation.options.map((option, optIndex) => (
                                                    <div key={optIndex} className="flex items-center justify-between space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem id={`${variation.name}-${optIndex}`} value={optIndex.toString()} />
                                                            <Label htmlFor={`${variation.name}-${optIndex}`} className="cursor-pointer">
                                                                {option.name}
                                                            </Label>
                                                        </div>
                                                        {option.price > 0 && (
                                                            <span className="text-gray-500 dark:text-gray-400">
                                                                +${option.price.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add-ons Section */}
                            {item.addons && item.addons.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        Add Extra Toppings
                                    </h3>
                                    <div className="space-y-2">
                                        {item.addons.map((addon, addonIndex) => (
                                            <div key={addonIndex} className="flex items-center justify-between space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
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
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    +${addon.price.toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Special Instructions */}
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    Special Instructions
                                </h3>
                                <textarea
                                    value={specialInstructions}
                                    onChange={(e) => setSpecialInstructions(e.target.value)}
                                    placeholder="Any special requests or allergies we should know about?"
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                                    rows={3}
                                />
                            </div>

                            {/* Quantity and Add to Cart */}
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </Button>
                                        <span className="w-8 text-center">{quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleQuantityChange(1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                                        Total: ${calculateTotalPrice()}
                                    </div>
                                </div>

                                <Button className="w-full h-12 text-lg rounded-lg">
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Items */}
                {relatedItems && relatedItems.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            You Might Also Like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedItems.map((relItem, index) => (
                                <motion.div
                                    key={relItem.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Link
                                        href={`/food-menu/${relItem.slug}`}
                                        className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="relative h-40 overflow-hidden">
                                            <img
                                                src={relItem.image}
                                                alt={relItem.name}
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                            {relItem.discount && (
                                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                    {relItem.discount}% OFF
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{relItem.name}</h3>
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="font-bold text-gray-900 dark:text-white">
                                                    ${relItem.price.toFixed(2)}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                                    <span>{relItem.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Show; 