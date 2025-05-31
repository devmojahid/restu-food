import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Filter, 
    X, 
    ChevronDown, 
    ChevronUp, 
    Star, 
    Check, 
    Tag,
    RefreshCw 
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Label } from '@/Components/ui/label';
import { cn } from '@/lib/utils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';

const FilterSection = ({ title, children, icon: Icon, defaultOpen = false }) => {
    return (
        <AccordionItem value={title.toLowerCase().replace(/\s+/g, '-')}>
            <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center">
                    {Icon && <Icon className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />}
                    <span>{title}</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
                {children}
            </AccordionContent>
        </AccordionItem>
    );
};

const Filters = ({ categories = [], brands = [], filters = {}, activeFilters, setActiveFilters }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const handleCategoryChange = (categorySlug) => {
        setActiveFilters(prev => ({
            ...prev,
            category: prev.category === categorySlug ? '' : categorySlug
        }));
    };
    
    const handleBrandChange = (brandSlug) => {
        setActiveFilters(prev => ({
            ...prev,
            brand: prev.brand === brandSlug ? '' : brandSlug
        }));
    };
    
    const handlePriceChange = (priceRange) => {
        setActiveFilters(prev => ({
            ...prev,
            price: priceRange
        }));
    };
    
    const handleDietaryChange = (value) => {
        setActiveFilters(prev => {
            const newDietary = prev.dietary.includes(value)
                ? prev.dietary.filter(d => d !== value)
                : [...prev.dietary, value];
                
            return {
                ...prev,
                dietary: newDietary
            };
        });
    };
    
    const handleRatingChange = (rating) => {
        setActiveFilters(prev => ({
            ...prev,
            rating: rating === prev.rating ? null : rating
        }));
    };
    
    const handleClearFilters = () => {
        setActiveFilters({
            category: '',
            brand: '',
            price: '',
            dietary: [],
            rating: null,
            sort: 'popular'
        });
    };
    
    // Count how many filters are applied
    const getActiveFilterCount = () => {
        let count = 0;
        if (activeFilters.category) count++;
        if (activeFilters.brand) count++;
        if (activeFilters.price) count++;
        count += activeFilters.dietary.length;
        if (activeFilters.rating) count++;
        return count;
    };
    
    const activeFilterCount = getActiveFilterCount();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    <h2 className="text-xl font-semibold">Filters</h2>
                    {activeFilterCount > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 
                                    bg-primary/10 text-primary text-xs rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </div>
                
                {activeFilterCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-gray-500 hover:text-primary hover:bg-primary/10"
                    >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Clear
                    </Button>
                )}
            </div>
            
            <Accordion
                type="multiple"
                defaultValue={["categories", "price-range"]}
                className="space-y-1"
            >
                {/* Categories Filter */}
                <FilterSection title="Categories" icon={Tag} defaultOpen={true}>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                        {categories.map(category => (
                            <div 
                                key={category.id} 
                                className={cn(
                                    "flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer",
                                    "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                    activeFilters.category === category.slug && "bg-primary/10"
                                )}
                                onClick={() => handleCategoryChange(category.slug)}
                            >
                                <div className="flex items-center">
                                    <Checkbox 
                                        id={`category-${category.id}`}
                                        checked={activeFilters.category === category.slug}
                                        onCheckedChange={() => handleCategoryChange(category.slug)}
                                        className="mr-2"
                                    />
                                    <Label
                                        htmlFor={`category-${category.id}`}
                                        className="text-sm cursor-pointer"
                                    >
                                        {category.name}
                                    </Label>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 
                                              dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                    {category.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </FilterSection>
                
                {/* Brands Filter */}
                <FilterSection title="Brands" icon={Check} defaultOpen={false}>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                        {brands.map(brand => (
                            <div 
                                key={brand.id} 
                                className={cn(
                                    "flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer",
                                    "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                    activeFilters.brand === brand.slug && "bg-primary/10"
                                )}
                                onClick={() => handleBrandChange(brand.slug)}
                            >
                                <div className="flex items-center">
                                    <Checkbox 
                                        id={`brand-${brand.id}`}
                                        checked={activeFilters.brand === brand.slug}
                                        onCheckedChange={() => handleBrandChange(brand.slug)}
                                        className="mr-2"
                                    />
                                    <Label
                                        htmlFor={`brand-${brand.id}`}
                                        className="text-sm cursor-pointer"
                                    >
                                        {brand.name}
                                    </Label>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 
                                              dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                    {brand.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </FilterSection>
                
                {/* Price Range Filter */}
                <FilterSection title="Price Range" defaultOpen={true}>
                    <RadioGroup 
                        value={activeFilters.price} 
                        onValueChange={handlePriceChange}
                        className="space-y-2"
                    >
                        {filters.price_ranges?.map(range => (
                            <div 
                                key={range.id}
                                className={cn(
                                    "flex items-center py-1.5 px-2 rounded-lg cursor-pointer",
                                    "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                    activeFilters.price === range.value && "bg-primary/10"
                                )}
                            >
                                <RadioGroupItem 
                                    value={range.value} 
                                    id={`price-${range.id}`}
                                    className="mr-2"
                                />
                                <Label
                                    htmlFor={`price-${range.id}`}
                                    className="text-sm cursor-pointer flex-1"
                                >
                                    {range.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </FilterSection>
                
                {/* Dietary Preferences */}
                <FilterSection title="Dietary Preferences" defaultOpen={false}>
                    <div className="space-y-2">
                        {filters.dietary?.map(option => (
                            <div 
                                key={option.id}
                                className={cn(
                                    "flex items-center py-1.5 px-2 rounded-lg cursor-pointer",
                                    "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                    activeFilters.dietary.includes(option.value) && "bg-primary/10"
                                )}
                                onClick={() => handleDietaryChange(option.value)}
                            >
                                <Checkbox 
                                    id={`dietary-${option.id}`}
                                    checked={activeFilters.dietary.includes(option.value)}
                                    onCheckedChange={() => handleDietaryChange(option.value)}
                                    className="mr-2"
                                />
                                <Label
                                    htmlFor={`dietary-${option.id}`}
                                    className="text-sm cursor-pointer"
                                >
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </FilterSection>
                
                {/* Rating Filter */}
                <FilterSection title="Rating" icon={Star} defaultOpen={false}>
                    <RadioGroup 
                        value={activeFilters.rating?.toString() || ""} 
                        onValueChange={(value) => handleRatingChange(parseInt(value))}
                        className="space-y-2"
                    >
                        {filters.ratings?.map(rating => (
                            <div 
                                key={rating.id}
                                className={cn(
                                    "flex items-center py-1.5 px-2 rounded-lg cursor-pointer",
                                    "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                    activeFilters.rating === rating.value && "bg-primary/10"
                                )}
                                onClick={() => handleRatingChange(rating.value)}
                            >
                                <RadioGroupItem 
                                    value={rating.value.toString()}
                                    id={`rating-${rating.id}`}
                                    className="mr-2"
                                />
                                <Label
                                    htmlFor={`rating-${rating.id}`}
                                    className="text-sm cursor-pointer flex items-center"
                                >
                                    <div className="flex items-center">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star 
                                                key={i}
                                                className={cn(
                                                    "w-3.5 h-3.5",
                                                    i < rating.value 
                                                        ? "text-yellow-400 fill-yellow-400" 
                                                        : "text-gray-300"
                                                )}
                                            />
                                        ))}
                                        <span className="ml-2">{rating.label}</span>
                                    </div>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </FilterSection>
            </Accordion>
        </motion.div>
    );
};

export default Filters; 