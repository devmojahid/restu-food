import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Check, 
    ChevronDown, 
    Filter, 
    X, 
    SlidersHorizontal,
    Tag,
    Utensils,
    DollarSign,
    Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const MenuFilters = ({ filters, activeFilters, onFilterChange }) => {
    const [selectedSection, setSelectedSection] = useState('categories');
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const handleCategoryChange = (categoryId) => {
        const newCategories = activeFilters.category.includes(categoryId)
            ? activeFilters.category.filter(id => id !== categoryId)
            : [...activeFilters.category, categoryId];
        
        onFilterChange({ category: newCategories });
    };

    const handlePriceChange = (range) => {
        const newPrices = activeFilters.price.includes(range)
            ? activeFilters.price.filter(r => r !== range)
            : [...activeFilters.price, range];
        
        onFilterChange({ price: newPrices });
    };

    const handleDietaryChange = (diet) => {
        const newDietary = activeFilters.dietary.includes(diet)
            ? activeFilters.dietary.filter(d => d !== diet)
            : [...activeFilters.dietary, diet];
        
        onFilterChange({ dietary: newDietary });
    };

    const handleSortChange = (value) => {
        onFilterChange({ sort: value });
    };

    const getActiveFiltersCount = () => {
        return (
            activeFilters.category.length +
            activeFilters.price.length +
            activeFilters.dietary.length +
            (activeFilters.sort !== 'recommended' ? 1 : 0)
        );
    };

    const clearAllFilters = () => {
        onFilterChange({
            category: [],
            price: [],
            dietary: [],
            sort: 'recommended'
        });
        setShowMobileFilters(false);
    };

    const FilterSection = ({ title, icon: Icon, children }) => (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 last:border-0">
            <div className="flex items-center gap-2 mb-4">
                <Icon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h3>
            </div>
            {children}
        </div>
    );

    const MobileFilterTabs = () => (
        <div className="flex overflow-x-auto gap-2 p-2 -mx-4 mb-4">
            {['categories', 'price', 'dietary', 'sort'].map((section) => (
                <Button
                    key={section}
                    variant={selectedSection === section ? 'default' : 'outline'}
                    onClick={() => setSelectedSection(section)}
                    className="whitespace-nowrap"
                >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                </Button>
            ))}
        </div>
    );

    const FilterContent = () => (
        <ScrollArea className={cn(
            "pr-4",
            isMobile ? "h-[calc(100vh-200px)]" : "h-[calc(100vh-150px)]"
        )}>
            {(!isMobile || selectedSection === 'categories') && (
                <FilterSection title="Categories" icon={Utensils}>
                    <div className="grid grid-cols-1 gap-2">
                        {filters.categories.map(category => (
                            <Button
                                key={category.id}
                                variant={activeFilters.category.includes(category.id) ? "default" : "outline"}
                                onClick={() => handleCategoryChange(category.id)}
                                className="justify-between h-auto py-3"
                            >
                                <div className="flex items-center gap-2">
                                    <span>{category.name}</span>
                                    <Badge variant="secondary" className="ml-2">
                                        {category.count}
                                    </Badge>
                                </div>
                                {activeFilters.category.includes(category.id) && (
                                    <Check className="w-4 h-4 ml-2" />
                                )}
                            </Button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {(!isMobile || selectedSection === 'price') && (
                <FilterSection title="Price Range" icon={DollarSign}>
                    <div className="space-y-2">
                        {filters.price_ranges.map(range => (
                            <Button
                                key={range.label}
                                variant={activeFilters.price.includes(`${range.min}-${range.max}`) ? "default" : "outline"}
                                onClick={() => handlePriceChange(`${range.min}-${range.max}`)}
                                className="w-full justify-between"
                            >
                                <span>{range.label}</span>
                                {activeFilters.price.includes(`${range.min}-${range.max}`) && (
                                    <Check className="w-4 h-4 ml-2" />
                                )}
                            </Button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {(!isMobile || selectedSection === 'dietary') && (
                <FilterSection title="Dietary Preferences" icon={Leaf}>
                    <div className="space-y-2">
                        {Object.entries(filters.dietary).map(([key, label]) => (
                            <Button
                                key={key}
                                variant={activeFilters.dietary.includes(key) ? "default" : "outline"}
                                onClick={() => handleDietaryChange(key)}
                                className="w-full justify-between"
                            >
                                <span>{label}</span>
                                {activeFilters.dietary.includes(key) && (
                                    <Check className="w-4 h-4 ml-2" />
                                )}
                            </Button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {(!isMobile || selectedSection === 'sort') && (
                <FilterSection title="Sort By" icon={SlidersHorizontal}>
                    <RadioGroup
                        value={activeFilters.sort}
                        onValueChange={(value) => onFilterChange({ sort: value })}
                        className="space-y-2"
                    >
                        {Object.entries(filters.sort_options).map(([value, label]) => (
                            <Button
                                key={value}
                                variant={activeFilters.sort === value ? "default" : "outline"}
                                onClick={() => onFilterChange({ sort: value })}
                                className="w-full justify-between"
                            >
                                <span>{label}</span>
                                {activeFilters.sort === value && (
                                    <Check className="w-4 h-4 ml-2" />
                                )}
                            </Button>
                        ))}
                    </RadioGroup>
                </FilterSection>
            )}
        </ScrollArea>
    );

    const ActiveFilters = () => {
        const activeCount = getActiveFiltersCount();
        if (activeCount === 0) return null;

        return (
            <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.category.map(categoryId => {
                    const category = filters.categories.find(c => c.id === categoryId);
                    if (!category) return null;
                    return (
                        <Badge
                            key={category.id}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            {category.name}
                            <X
                                className="w-3 h-3 ml-1 cursor-pointer"
                                onClick={() => handleCategoryChange(category.id)}
                            />
                        </Badge>
                    );
                })}
                {/* Similar badges for price and dietary filters */}
                {activeCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-xs"
                    >
                        Clear All
                    </Button>
                )}
            </div>
        );
    };

    return (
        <div className="relative">
            {isMobile ? (
                <>
                    <Button
                        variant="outline"
                        className="w-full mb-4 flex items-center justify-between"
                        onClick={() => setShowMobileFilters(true)}
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </div>
                        {getActiveFiltersCount() > 0 && (
                            <Badge>{getActiveFiltersCount()}</Badge>
                        )}
                    </Button>
                    <AnimatePresence>
                        {showMobileFilters && (
                            <motion.div
                                initial={{ opacity: 0, y: "100%" }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: "100%" }}
                                className="fixed inset-0 z-50 bg-white dark:bg-gray-900"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                                        <h2 className="text-lg font-semibold">Filters</h2>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setShowMobileFilters(false)}
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>
                                    <MobileFilterTabs />
                                    <div className="flex-1 overflow-hidden">
                                        <FilterContent />
                                    </div>
                                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                                        <Button
                                            className="w-full"
                                            onClick={() => setShowMobileFilters(false)}
                                        >
                                            Apply Filters
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            ) : (
                <div className="sticky top-[120px]">
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Filters</h2>
                                {getActiveFiltersCount() > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearAllFilters}
                                    >
                                        Clear All
                                    </Button>
                                )}
                            </div>
                            <ActiveFilters />
                        </div>
                        <FilterContent />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuFilters; 