import React from 'react';
import { motion } from 'framer-motion';
import { 
    ChevronDown,
    Star,
    DollarSign,
    Leaf,
    SortAsc,
    X
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Checkbox } from "@/Components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Badge } from "@/Components/ui/badge";
import { cn } from '@/lib/utils';

const Filters = ({ filters, activeFilters, setActiveFilters }) => {
    const handleCuisineChange = (cuisine) => {
        setActiveFilters(prev => ({
            ...prev,
            cuisine: prev.cuisine.includes(cuisine)
                ? prev.cuisine.filter(c => c !== cuisine)
                : [...prev.cuisine, cuisine]
        }));
    };

    const handlePriceChange = (price) => {
        setActiveFilters(prev => ({
            ...prev,
            price: prev.price.includes(price)
                ? prev.price.filter(p => p !== price)
                : [...prev.price, price]
        }));
    };

    const handleDietaryChange = (dietary) => {
        setActiveFilters(prev => ({
            ...prev,
            dietary: prev.dietary.includes(dietary)
                ? prev.dietary.filter(d => d !== dietary)
                : [...prev.dietary, dietary]
        }));
    };

    const handleSortChange = (sort) => {
        setActiveFilters(prev => ({
            ...prev,
            sort
        }));
    };

    const clearFilters = () => {
        setActiveFilters({
            cuisine: [],
            rating: null,
            price: [],
            dietary: [],
            sort: 'recommended'
        });
    };

    const hasActiveFilters = () => {
        return activeFilters.cuisine.length > 0 ||
               activeFilters.price.length > 0 ||
               activeFilters.dietary.length > 0 ||
               activeFilters.sort !== 'recommended';
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border 
                      dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                {hasActiveFilters() && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Clear All
                    </Button>
                )}
            </div>

            <Accordion type="single" collapsible className="space-y-4">
                {/* Cuisines */}
                <AccordionItem value="cuisines">
                    <AccordionTrigger>Cuisines</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {filters.cuisines.map((cuisine) => (
                                <div key={cuisine} className="flex items-center">
                                    <Checkbox
                                        id={`cuisine-${cuisine}`}
                                        checked={activeFilters.cuisine.includes(cuisine)}
                                        onCheckedChange={() => handleCuisineChange(cuisine)}
                                    />
                                    <label
                                        htmlFor={`cuisine-${cuisine}`}
                                        className="ml-2 text-sm font-medium leading-none 
                                               peer-disabled:cursor-not-allowed 
                                               peer-disabled:opacity-70"
                                    >
                                        {cuisine}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Price Range */}
                <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {Object.entries(filters.price_ranges).map(([price, label]) => (
                                <div key={price} className="flex items-center">
                                    <Checkbox
                                        id={`price-${price}`}
                                        checked={activeFilters.price.includes(price)}
                                        onCheckedChange={() => handlePriceChange(price)}
                                    />
                                    <label
                                        htmlFor={`price-${price}`}
                                        className="ml-2 text-sm font-medium leading-none"
                                    >
                                        {price} - {label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Dietary */}
                <AccordionItem value="dietary">
                    <AccordionTrigger>Dietary</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {Object.entries(filters.dietary).map(([value, label]) => (
                                <div key={value} className="flex items-center">
                                    <Checkbox
                                        id={`dietary-${value}`}
                                        checked={activeFilters.dietary.includes(value)}
                                        onCheckedChange={() => handleDietaryChange(value)}
                                    />
                                    <label
                                        htmlFor={`dietary-${value}`}
                                        className="ml-2 text-sm font-medium leading-none"
                                    >
                                        {label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Sort By */}
                <AccordionItem value="sort">
                    <AccordionTrigger>Sort By</AccordionTrigger>
                    <AccordionContent>
                        <RadioGroup
                            value={activeFilters.sort}
                            onValueChange={handleSortChange}
                            className="space-y-2"
                        >
                            {Object.entries(filters.sort_options).map(([value, label]) => (
                                <div key={value} className="flex items-center">
                                    <RadioGroupItem value={value} id={`sort-${value}`} />
                                    <label
                                        htmlFor={`sort-${value}`}
                                        className="ml-2 text-sm font-medium leading-none"
                                    >
                                        {label}
                                    </label>
                                </div>
                            ))}
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Active Filters */}
            {hasActiveFilters() && (
                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                    <h3 className="text-sm font-medium mb-3">Active Filters</h3>
                    <div className="flex flex-wrap gap-2">
                        {activeFilters.cuisine.map((cuisine) => (
                            <Badge
                                key={cuisine}
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={() => handleCuisineChange(cuisine)}
                            >
                                {cuisine}
                                <X className="w-3 h-3 ml-1" />
                            </Badge>
                        ))}
                        {activeFilters.price.map((price) => (
                            <Badge
                                key={price}
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={() => handlePriceChange(price)}
                            >
                                {price}
                                <X className="w-3 h-3 ml-1" />
                            </Badge>
                        ))}
                        {activeFilters.dietary.map((dietary) => (
                            <Badge
                                key={dietary}
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={() => handleDietaryChange(dietary)}
                            >
                                {filters.dietary[dietary]}
                                <X className="w-3 h-3 ml-1" />
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Filters; 