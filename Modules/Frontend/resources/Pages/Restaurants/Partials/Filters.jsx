import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    ChevronDown,
    Star,
    DollarSign,
    Leaf,
    SortAsc,
    Filter as FilterIcon,
    X,
    Clock,
    Utensils,
    Heart,
    Percent,
    Sparkles,
    Check,
    MapPin,
    Settings,
    Truck,
    CreditCard,
    Music,
    ParkingCircle,
    Tag,
    Timer,
    Coffee
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/Components/ui/sheet";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Checkbox } from "@/Components/ui/checkbox";
import { Badge } from "@/Components/ui/badge";
import { Slider } from "@/Components/ui/slider";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Update the RangeSlider component for better UI/UX
const RangeSlider = ({ 
    title, 
    icon: Icon, 
    value, 
    onChange, 
    min, 
    max, 
    step, 
    formatValue,
    unit = '' 
}) => {
    const [localValue, setLocalValue] = useState(value);
    const [isDragging, setIsDragging] = useState(false);

    const percentage = useMemo(() => {
        const minP = ((localValue[0] - min) / (max - min)) * 100;
        const maxP = ((localValue[1] - min) / (max - min)) * 100;
        return [minP, maxP];
    }, [localValue, min, max]);

    return (
        <AccordionItem
            value={title.toLowerCase()}
            className={cn(
                "border rounded-lg overflow-hidden transition-all duration-200",
                isDragging ? "border-primary shadow-sm" : "hover:border-primary/20"
            )}
        >
            <AccordionTrigger className="hover:no-underline px-3 py-2.5 group">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                            isDragging ? "bg-primary text-white" : "bg-primary/10 text-primary"
                        )}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{title}</span>
                            <span className="text-xs text-gray-500">
                                {formatValue(localValue[0])}{unit} - {formatValue(localValue[1])}{unit}
                            </span>
                        </div>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="px-3 py-4">
                    <div 
                        className="relative pt-6"
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                        onTouchStart={() => setIsDragging(true)}
                        onTouchEnd={() => setIsDragging(false)}
                    >
                        {/* Range Track Background */}
                        <div className="absolute h-2 left-0 right-0 rounded-full bg-gray-100" />
                        
                        {/* Active Range Track */}
                        <div 
                            className="absolute h-2 rounded-full bg-primary/30"
                            style={{
                                left: `${percentage[0]}%`,
                                right: `${100 - percentage[1]}%`
                            }}
                        />

                        {/* Enhanced Slider */}
                        <Slider
                            value={localValue}
                            onValueChange={(value) => {
                                setLocalValue(value);
                                onChange(value);
                            }}
                            min={min}
                            max={max}
                            step={step}
                            className={cn(
                                "relative z-10 transition-all duration-200",
                                isDragging && "scale-[1.02]"
                            )}
                            thumbClassName="w-5 h-5 border-2 border-primary bg-white hover:border-4 
                                       transition-all duration-200"
                        />

                        {/* Value Labels */}
                        <div className="flex items-center justify-between mt-6 gap-4">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1.5 block">
                                    Min {title}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={localValue[0]}
                                        onChange={(e) => {
                                            const newValue = Number(e.target.value);
                                            if (newValue <= localValue[1]) {
                                                setLocalValue([newValue, localValue[1]]);
                                                onChange([newValue, localValue[1]]);
                                            }
                                        }}
                                        className="w-full px-3 py-2 text-sm border rounded-lg
                                               text-center focus:border-primary focus:ring-1 
                                               focus:ring-primary bg-gray-50"
                                        min={min}
                                        max={localValue[1]}
                                        step={step}
                                    />
                                    {unit && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 
                                                      text-sm text-gray-500">
                                            {unit}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1.5 block">
                                    Max {title}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={localValue[1]}
                                        onChange={(e) => {
                                            const newValue = Number(e.target.value);
                                            if (newValue >= localValue[0]) {
                                                setLocalValue([localValue[0], newValue]);
                                                onChange([localValue[0], newValue]);
                                            }
                                        }}
                                        className="w-full px-3 py-2 text-sm border rounded-lg
                                               text-center focus:border-primary focus:ring-1 
                                               focus:ring-primary bg-gray-50"
                                        min={localValue[0]}
                                        max={max}
                                        step={step}
                                    />
                                    {unit && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 
                                                      text-sm text-gray-500">
                                            {unit}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

const Filters = ({ filters, activeFilters, setActiveFilters, onApplyFilters }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isOpen, setIsOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState(activeFilters);
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [distance, setDistance] = useState([0, 10]);
    const [expandedItems, setExpandedItems] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    // Enhanced filter categories with more options and better organization
    const filterCategories = {
        sort: {
            icon: SortAsc,
            title: 'Sort By',
            options: [
                { label: 'Most Popular', value: 'popular' },
                { label: 'Rating: High to Low', value: 'rating' },
                { label: 'Delivery Time', value: 'delivery_time' },
                { label: 'Distance: Near to Far', value: 'distance' },
                { label: 'Price: Low to High', value: 'price_low' },
                { label: 'Price: High to Low', value: 'price_high' }
            ]
        },
        cuisines: {
            icon: Utensils,
            title: 'Cuisines',
            options: [
                { label: 'Italian', value: 'italian', count: 45 },
                { label: 'Japanese', value: 'japanese', count: 32 },
                { label: 'Chinese', value: 'chinese', count: 28 },
                { label: 'Indian', value: 'indian', count: 35 },
                { label: 'Mexican', value: 'mexican', count: 25 },
                { label: 'Thai', value: 'thai', count: 18 }
            ]
        },
        dietary: {
            icon: Leaf,
            title: 'Dietary',
            options: [
                { label: 'Vegetarian', value: 'vegetarian', icon: Leaf },
                { label: 'Vegan', value: 'vegan', icon: Leaf },
                { label: 'Gluten Free', value: 'gluten_free', icon: Leaf },
                { label: 'Halal', value: 'halal', icon: Check },
                { label: 'Kosher', value: 'kosher', icon: Check }
            ]
        },
        features: {
            icon: Settings,
            title: 'Features',
            options: [
                { label: 'Free Delivery', value: 'free_delivery', icon: Truck },
                { label: 'Online Payment', value: 'online_payment', icon: CreditCard },
                { label: 'Table Booking', value: 'table_booking', icon: Coffee },
                { label: 'Outdoor Seating', value: 'outdoor_seating', icon: Leaf },
                { label: 'Live Music', value: 'live_music', icon: Music },
                { label: 'Parking', value: 'parking', icon: ParkingCircle }
            ]
        },
        offers: {
            icon: Tag,
            title: 'Offers & Deals',
            options: [
                { label: 'Special Offers', value: 'special_offers', icon: Percent },
                { label: 'Happy Hours', value: 'happy_hours', icon: Timer },
                { label: 'Combo Meals', value: 'combo_meals', icon: Coffee },
                { label: 'Student Discount', value: 'student_discount', icon: Tag }
            ]
        }
    };

    // Handle filter changes
    const handleFilterChange = useCallback((category, value) => {
        setTempFilters(prev => ({
            ...prev,
            [category]: prev[category]?.includes(value)
                ? prev[category].filter(item => item !== value)
                : [...(prev[category] || []), value]
        }));
    }, []);

    // Handle price range change
    const handlePriceRangeChange = useCallback((value) => {
        setPriceRange(value);
        setTempFilters(prev => ({
            ...prev,
            priceRange: value
        }));
    }, []);

    // Handle distance range change
    const handleDistanceChange = useCallback((value) => {
        setDistance(value);
        setTempFilters(prev => ({
            ...prev,
            distance: value
        }));
    }, []);

    // Apply filters
    const handleApplyFilters = () => {
        setActiveFilters(tempFilters);
        onApplyFilters?.(tempFilters);
        setIsOpen(false);
    };

    // Reset filters
    const handleResetFilters = () => {
        setTempFilters({});
        setPriceRange([0, 100]);
        setDistance([0, 10]);
    };

    // Count active filters
    const activeFilterCount = Object.values(activeFilters)
        .flat()
        .filter(Boolean)
        .length;

    // Handle accordion state
    const handleAccordionChange = (value) => {
        setExpandedItems(value);
    };

    // Enhanced FilterContent component with better spacing and UI
    const FilterContent = () => (
        <ScrollArea className="h-full">
            <div className="p-2 space-y-2">
                <Accordion 
                    type="multiple" 
                    value={expandedItems}
                    onValueChange={handleAccordionChange}
                    className="space-y-1.5"
                >
                    {/* Price Range with enhanced UI */}
                    <RangeSlider
                        title="Price Range"
                        icon={DollarSign}
                        value={priceRange}
                        onChange={handlePriceRangeChange}
                        min={0}
                        max={100}
                        step={1}
                        formatValue={(value) => `$${value}`}
                    />

                    {/* Distance with enhanced UI */}
                    <RangeSlider
                        title="Distance"
                        icon={MapPin}
                        value={distance}
                        onChange={handleDistanceChange}
                        min={0}
                        max={10}
                        step={0.5}
                        formatValue={(value) => value}
                        unit=" km"
                    />

                    {/* Filter Categories */}
                    {Object.entries(filterCategories).map(([key, category]) => (
                        <AccordionItem
                            key={key}
                            value={key}
                            className={cn(
                                "border rounded-lg overflow-hidden",
                                expandedItems.includes(key) 
                                    ? "border-primary/30 bg-primary/5" 
                                    : "hover:border-primary/20"
                            )}
                        >
                            <AccordionTrigger 
                                className="hover:no-underline px-2.5 py-2 group"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-1.5">
                                        <category.icon className={cn(
                                            "w-3.5 h-3.5 transition-colors",
                                            expandedItems.includes(key) 
                                                ? "text-primary" 
                                                : "text-gray-500"
                                        )} />
                                        <span className="text-sm">{category.title}</span>
                                    </div>
                                    {tempFilters[key]?.length > 0 && (
                                        <Badge 
                                            variant="secondary" 
                                            className="ml-1 bg-primary/10 text-primary h-4 
                                                   text-[10px] px-1.5 rounded-full"
                                        >
                                            {tempFilters[key].length}
                                        </Badge>
                                    )}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-2.5 pb-1.5">
                                <div className="space-y-0.5">
                                    {category.options.map((option) => (
                                        <motion.div
                                            key={option.value || option}
                                            whileHover={{ x: 1 }}
                                            className="flex items-center py-1"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Checkbox
                                                id={`${key}-${option.value || option}`}
                                                checked={tempFilters[key]?.includes(
                                                    option.value || option
                                                )}
                                                onCheckedChange={() => 
                                                    handleFilterChange(
                                                        key, 
                                                        option.value || option
                                                    )
                                                }
                                                className="h-3.5 w-3.5 rounded-[3px] border-1.5 mr-2"
                                            />
                                            <label
                                                htmlFor={`${key}-${option.value || option}`}
                                                className="flex items-center gap-1.5 text-sm 
                                                       cursor-pointer select-none group flex-1"
                                            >
                                                {option.icon && (
                                                    <option.icon className="w-3 h-3 
                                                                text-gray-400
                                                                group-hover:text-primary
                                                                transition-colors" />
                                                )}
                                                <span className="group-hover:text-primary 
                                                             transition-colors text-[13px]">
                                                    {option.label || option}
                                                </span>
                                                {option.count && (
                                                    <span className="text-[11px] text-gray-400 ml-auto">
                                                        {option.count}
                                                    </span>
                                                )}
                                            </label>
                                        </motion.div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </ScrollArea>
    );

    // Mobile view
    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 rounded-full"
                    >
                        <FilterIcon className="w-4 h-4" />
                        Filters
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh]">
                    <SheetHeader className="px-6 py-4 border-b">
                        <div className="flex items-center justify-between">
                            <SheetTitle>Filters</SheetTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleResetFilters}
                            >
                                Reset All
                            </Button>
                        </div>
                    </SheetHeader>
                    <FilterContent />
                    <SheetFooter className="px-6 py-4 border-t">
                        <Button
                            className="w-full"
                            onClick={handleApplyFilters}
                        >
                            Apply Filters
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        );
    }

    // Desktop view
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border 
                      dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <FilterIcon className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Filters</h2>
                </div>
                {activeFilterCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetFilters}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Clear All
                    </Button>
                )}
            </div>

            <FilterContent />

            <div className="mt-6 pt-6 border-t dark:border-gray-700">
                <Button 
                    className="w-full"
                    onClick={handleApplyFilters}
                >
                    Apply Filters
                </Button>
            </div>
        </div>
    );
};

export default Filters; 