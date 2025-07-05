import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Filter,
    ChevronDown,
    ChevronUp,
    X,
    RotateCcw
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { cn } from '@/lib/utils';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from '@/Components/ui/sheet';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const FilterSection = ({
    title,
    children,
    defaultOpen = false,
    mobileView = false
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={cn(
            "border-b border-gray-200 dark:border-gray-800 pb-4 mb-4",
            "last:border-b-0 last:mb-0 last:pb-0"
        )}>
            {/* Section Title with Toggle */}
            <div
                className="flex items-center justify-between py-2 cursor-pointer"
                onClick={() => !mobileView && setIsOpen(!isOpen)}
            >
                <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
                {!mobileView && (
                    <button className="text-gray-500 hover:text-gray-700">
                        {isOpen ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>

            {/* Section Content */}
            <AnimatePresence>
                {(isOpen || mobileView) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-2 space-y-2">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const MenuFilters = ({
    filters = {},
    activeFilters = {},
    handleFilterChange,
    clearFilters
}) => {
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Count active filters
    const activeFilterCount = Object.values(activeFilters)
        .flat()
        .filter(val => val !== 'recommended') // Don't count default sort
        .length;

    // Render desktop or mobile filters
    const FiltersContent = ({ mobileView = false }) => (
        <div className="space-y-4">
            {/* Active Filters Summary */}
            {activeFilterCount > 0 && (
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{activeFilterCount}</span> filter{activeFilterCount > 1 ? 's' : ''} applied
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80 p-0 h-auto"
                        onClick={clearFilters}
                    >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Reset
                    </Button>
                </div>
            )}

            {/* Sort Options */}
            <FilterSection
                title="Sort By"
                defaultOpen={true}
                mobileView={mobileView}
            >
                <RadioGroup
                    value={activeFilters.sort}
                    onValueChange={(value) => handleFilterChange('sort', value)}
                    className="space-y-2"
                >
                    {filters.sort_options && Object.entries(filters.sort_options).map(([value, label]) => (
                        <div key={value} className="flex items-center space-x-2">
                            <RadioGroupItem value={value} id={`sort-${value}`} />
                            <Label htmlFor={`sort-${value}`} className="cursor-pointer">
                                {label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </FilterSection>

            {/* Dietary Restrictions */}
            <FilterSection
                title="Dietary Preferences"
                defaultOpen={true}
                mobileView={mobileView}
            >
                <div className="space-y-2">
                    {filters.dietary && Object.entries(filters.dietary).map(([value, label]) => (
                        <div key={value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`dietary-${value}`}
                                checked={activeFilters.dietary.includes(value)}
                                onCheckedChange={() => handleFilterChange('dietary', value)}
                            />
                            <Label htmlFor={`dietary-${value}`} className="cursor-pointer">
                                {label}
                            </Label>
                        </div>
                    ))}
                </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection
                title="Price Range"
                defaultOpen={false}
                mobileView={mobileView}
            >
                <div className="space-y-2">
                    {filters.price_ranges && filters.price_ranges.map((range, index) => {
                        const rangeValue = `${range.min}-${range.max || ''}`;
                        return (
                            <div key={index} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`price-${index}`}
                                    checked={activeFilters.price.includes(rangeValue)}
                                    onCheckedChange={() => handleFilterChange('price', rangeValue)}
                                />
                                <Label htmlFor={`price-${index}`} className="cursor-pointer">
                                    {range.label}
                                </Label>
                            </div>
                        );
                    })}
                </div>
            </FilterSection>

            {/* Meal Type */}
            <FilterSection
                title="Meal Type"
                defaultOpen={false}
                mobileView={mobileView}
            >
                <div className="space-y-2">
                    {filters.meal_type && Object.entries(filters.meal_type).map(([value, label]) => (
                        <div key={value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`meal-${value}`}
                                checked={activeFilters.meal_type.includes(value)}
                                onCheckedChange={() => handleFilterChange('meal_type', value)}
                            />
                            <Label htmlFor={`meal-${value}`} className="cursor-pointer">
                                {label}
                            </Label>
                        </div>
                    ))}
                </div>
            </FilterSection>

            {/* Preparation Time */}
            <FilterSection
                title="Preparation Time"
                defaultOpen={false}
                mobileView={mobileView}
            >
                <div className="space-y-2">
                    {filters.preparation_time && Object.entries(filters.preparation_time).map(([value, label]) => (
                        <div key={value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`prep-${value}`}
                                checked={activeFilters.preparation_time.includes(value)}
                                onCheckedChange={() => handleFilterChange('preparation_time', value)}
                            />
                            <Label htmlFor={`prep-${value}`} className="cursor-pointer">
                                {label}
                            </Label>
                        </div>
                    ))}
                </div>
            </FilterSection>
        </div>
    );

    // Mobile Filters Sheet
    const MobileFilters = () => (
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="lg:hidden w-full mb-4 flex items-center justify-between"
                >
                    <div className="flex items-center">
                        <Filter className="w-4 h-4 mr-2" />
                        <span>Filters</span>
                    </div>
                    {activeFilterCount > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full px-2 py-1 ml-2">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
                <SheetHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10 border-b pb-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle>Filter Options</SheetTitle>
                        <SheetClose asChild>
                            <Button variant="ghost" size="icon">
                                <X className="w-4 h-4" />
                            </Button>
                        </SheetClose>
                    </div>
                </SheetHeader>
                <div className="overflow-y-auto h-full py-4">
                    <FiltersContent mobileView={true} />
                </div>
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-2 border-t flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                            clearFilters();
                            setMobileFiltersOpen(false);
                        }}
                    >
                        Reset
                    </Button>
                    <SheetClose asChild>
                        <Button className="flex-1">
                            Apply Filters
                        </Button>
                    </SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters</h2>
            </div>

            {/* Mobile Filters UI */}
            {isMobile && <MobileFilters />}

            {/* Desktop Filters UI */}
            {!isMobile && <FiltersContent />}
        </div>
    );
};

export default MenuFilters; 