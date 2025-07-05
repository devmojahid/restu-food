import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Trash2, Star } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Slider } from '@/Components/ui/slider';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';
import { Checkbox } from '@/Components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Label } from '@/Components/ui/label';
import { cn } from '@/lib/utils';

const FiltersSection = ({
    filters = {},
    activeFilters,
    setActiveFilters,
    clearFilters
}) => {
    // Get all active filter counts
    const getActiveFilterCount = () => {
        let count = 0;
        if (activeFilters.cuisine?.length) count += activeFilters.cuisine.length;
        if (activeFilters.price?.length) count += activeFilters.price.length;
        if (activeFilters.dietary?.length) count += activeFilters.dietary.length;
        if (activeFilters.features?.length) count += activeFilters.features.length;
        if (activeFilters.rating) count += 1;
        if (activeFilters.distance) count += 1;
        if (activeFilters.sort && activeFilters.sort !== 'recommended') count += 1;
        return count;
    };

    const activeFilterCount = getActiveFilterCount();

    // Cuisine filters
    const handleCuisineChange = (cuisine) => {
        const newCuisines = [...(activeFilters.cuisine || [])];
        const index = newCuisines.indexOf(cuisine);

        if (index === -1) {
            newCuisines.push(cuisine);
        } else {
            newCuisines.splice(index, 1);
        }

        setActiveFilters({
            ...activeFilters,
            cuisine: newCuisines
        });
    };

    // Price range filters
    const handlePriceChange = (price) => {
        const newPrices = [...(activeFilters.price || [])];
        const index = newPrices.indexOf(price);

        if (index === -1) {
            newPrices.push(price);
        } else {
            newPrices.splice(index, 1);
        }

        setActiveFilters({
            ...activeFilters,
            price: newPrices
        });
    };

    // Dietary filters
    const handleDietaryChange = (diet) => {
        const newDietary = [...(activeFilters.dietary || [])];
        const index = newDietary.indexOf(diet);

        if (index === -1) {
            newDietary.push(diet);
        } else {
            newDietary.splice(index, 1);
        }

        setActiveFilters({
            ...activeFilters,
            dietary: newDietary
        });
    };

    // Feature filters
    const handleFeatureChange = (feature) => {
        const newFeatures = [...(activeFilters.features || [])];
        const index = newFeatures.indexOf(feature);

        if (index === -1) {
            newFeatures.push(feature);
        } else {
            newFeatures.splice(index, 1);
        }

        setActiveFilters({
            ...activeFilters,
            features: newFeatures
        });
    };

    // Rating filter
    const handleRatingChange = (rating) => {
        setActiveFilters({
            ...activeFilters,
            rating: activeFilters.rating === rating ? null : rating
        });
    };

    // Distance filter
    const handleDistanceChange = (distance) => {
        setActiveFilters({
            ...activeFilters,
            distance: distance[0]
        });
    };

    // Sort order
    const handleSortChange = (sort) => {
        setActiveFilters({
            ...activeFilters,
            sort
        });
    };

    // Function to render star icons for rating
    const renderStars = (count) => {
        return Array(5).fill(0).map((_, i) => (
            <Star
                key={i}
                size={16}
                className={cn(
                    i < count ? "text-amber-500 fill-amber-500" : "text-gray-300"
                )}
            />
        ));
    };

    // Render active filters as badges
    const renderActiveCuisines = () => {
        if (!activeFilters.cuisine?.length) return null;

        return (
            <div className="flex flex-wrap gap-2 mt-2 mb-4">
                {activeFilters.cuisine.map(cuisine => (
                    <Badge key={cuisine} variant="secondary" className="pr-1">
                        {cuisine}
                        <button
                            className="ml-1 bg-gray-200 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center"
                            onClick={() => handleCuisineChange(cuisine)}
                        >
                            <X size={10} />
                        </button>
                    </Badge>
                ))}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-4 sticky top-20"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg flex items-center">
                    Filters
                    {activeFilterCount > 0 && (
                        <Badge variant="primary" className="ml-2">{activeFilterCount}</Badge>
                    )}
                </h3>
                {activeFilterCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-gray-500 hover:text-gray-700 flex items-center"
                    >
                        <Trash2 size={14} className="mr-1" />
                        Clear all
                    </Button>
                )}
            </div>

            <ScrollArea className="h-[calc(100vh-240px)] pr-4">
                {/* Sort Options */}
                <div className="mb-6">
                    <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Sort By</h4>
                    <RadioGroup
                        value={activeFilters.sort || 'recommended'}
                        onValueChange={handleSortChange}
                        className="space-y-2"
                    >
                        <div className="flex items-center">
                            <RadioGroupItem value="recommended" id="sort-recommended" />
                            <Label className="ml-2" htmlFor="sort-recommended">Recommended</Label>
                        </div>
                        <div className="flex items-center">
                            <RadioGroupItem value="rating_desc" id="sort-rating" />
                            <Label className="ml-2" htmlFor="sort-rating">Rating (high to low)</Label>
                        </div>
                        <div className="flex items-center">
                            <RadioGroupItem value="delivery_time_asc" id="sort-delivery" />
                            <Label className="ml-2" htmlFor="sort-delivery">Delivery Time</Label>
                        </div>
                        <div className="flex items-center">
                            <RadioGroupItem value="distance_asc" id="sort-distance" />
                            <Label className="ml-2" htmlFor="sort-distance">Distance</Label>
                        </div>
                        <div className="flex items-center">
                            <RadioGroupItem value="price_asc" id="sort-price-low" />
                            <Label className="ml-2" htmlFor="sort-price-low">Price (low to high)</Label>
                        </div>
                        <div className="flex items-center">
                            <RadioGroupItem value="price_desc" id="sort-price-high" />
                            <Label className="ml-2" htmlFor="sort-price-high">Price (high to low)</Label>
                        </div>
                    </RadioGroup>
                </div>

                <hr className="my-5 border-gray-200 dark:border-gray-700" />

                {/* Distance Slider */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">Distance</h4>
                        {activeFilters.distance && (
                            <Badge variant="outline" className="ml-2 bg-primary/10">
                                {activeFilters.distance} km
                            </Badge>
                        )}
                    </div>
                    <Slider
                        defaultValue={[activeFilters.distance || 10]}
                        max={50}
                        step={1}
                        min={1}
                        onValueChange={handleDistanceChange}
                        className="mb-1"
                    />
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>1 km</span>
                        <span>50 km</span>
                    </div>
                </div>

                <hr className="my-5 border-gray-200 dark:border-gray-700" />

                {/* Cuisine Type Accordion */}
                <Accordion type="single" collapsible defaultValue="cuisines" className="mb-4">
                    <AccordionItem value="cuisines" className="border-none">
                        <AccordionTrigger className="py-3 hover:no-underline">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Cuisine Types</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            {renderActiveCuisines()}
                            <div className="space-y-2">
                                {(filters.cuisines || [
                                    'Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican',
                                    'Thai', 'American', 'Mediterranean', 'French', 'Korean',
                                    'Middle Eastern', 'Vegetarian', 'Seafood', 'BBQ', 'Pizza'
                                ]).map(cuisine => (
                                    <div key={cuisine} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`cuisine-${cuisine}`}
                                            checked={(activeFilters.cuisine || []).includes(cuisine)}
                                            onCheckedChange={() => handleCuisineChange(cuisine)}
                                        />
                                        <label
                                            htmlFor={`cuisine-${cuisine}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {cuisine}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <hr className="my-5 border-gray-200 dark:border-gray-700" />

                {/* Price Range */}
                <div className="mb-6">
                    <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Price Range</h4>
                    <div className="flex flex-wrap gap-2">
                        {['$', '$$', '$$$', '$$$$'].map(price => (
                            <Badge
                                key={price}
                                variant={(activeFilters.price || []).includes(price) ? "default" : "outline"}
                                className="cursor-pointer text-base py-1.5 px-4 h-auto"
                                onClick={() => handlePriceChange(price)}
                            >
                                {price}
                            </Badge>
                        ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 grid grid-cols-4">
                        <span>Budget</span>
                        <span className="text-center">Low</span>
                        <span className="text-center">Mid</span>
                        <span className="text-right">High</span>
                    </div>
                </div>

                <hr className="my-5 border-gray-200 dark:border-gray-700" />

                {/* Rating Filter */}
                <div className="mb-6">
                    <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Rating</h4>
                    <div className="space-y-2">
                        {[5, 4, 3, 2].map(rating => (
                            <div
                                key={rating}
                                className={cn(
                                    "flex items-center p-2 rounded-md cursor-pointer",
                                    activeFilters.rating === rating
                                        ? "bg-primary/10 border border-primary/20"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                )}
                                onClick={() => handleRatingChange(rating)}
                            >
                                <div className="flex items-center flex-1">
                                    <div className="flex items-center">
                                        {renderStars(rating)}
                                    </div>
                                    <span className="ml-2 text-sm">& up</span>
                                </div>
                                {activeFilters.rating === rating && (
                                    <Check size={16} className="text-primary" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="my-5 border-gray-200 dark:border-gray-700" />

                {/* Dietary Restrictions */}
                <Accordion type="single" collapsible defaultValue="dietary" className="mb-4">
                    <AccordionItem value="dietary" className="border-none">
                        <AccordionTrigger className="py-3 hover:no-underline">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Dietary Restrictions</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                {(filters.dietary || [
                                    'Vegetarian', 'Vegan', 'Halal', 'Gluten-Free',
                                    'Kosher', 'Dairy-Free', 'Nut-Free', 'Organic',
                                    'Low-Carb', 'Sugar-Free'
                                ]).map(diet => (
                                    <div key={diet} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`diet-${diet}`}
                                            checked={(activeFilters.dietary || []).includes(diet)}
                                            onCheckedChange={() => handleDietaryChange(diet)}
                                        />
                                        <label
                                            htmlFor={`diet-${diet}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {diet}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <hr className="my-5 border-gray-200 dark:border-gray-700" />

                {/* Features */}
                <Accordion type="single" collapsible className="mb-4">
                    <AccordionItem value="features" className="border-none">
                        <AccordionTrigger className="py-3 hover:no-underline">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Restaurant Features</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                {(filters.features || [
                                    'Outdoor Seating', 'Delivery', 'Takeout',
                                    'Reservations', 'Group Friendly', 'Kids Friendly',
                                    'Accepts Credit Cards', 'Wheelchair Accessible',
                                    'Free Wi-Fi', 'Alcohol Served'
                                ]).map(feature => (
                                    <div key={feature} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`feature-${feature}`}
                                            checked={(activeFilters.features || []).includes(feature)}
                                            onCheckedChange={() => handleFeatureChange(feature)}
                                        />
                                        <label
                                            htmlFor={`feature-${feature}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {feature}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </ScrollArea>
        </motion.div>
    );
};

export default FiltersSection; 