import React, { useState } from 'react';
import { 
    Search, 
    X, 
    ChevronDown, 
    ChevronUp, 
    Tag, 
    SlidersHorizontal, 
    Trash2,
    Star,
    ArrowUpDown 
} from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Checkbox } from '@/Components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Separator } from '@/Components/ui/separator';

const FilterSection = ({ title, icon: Icon, defaultOpen = true, children }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-2 text-base font-medium"
            >
                <div className="flex items-center">
                    {Icon && <Icon className="h-4 w-4 mr-2 text-primary" />}
                    <span>{title}</span>
                </div>
                {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </button>
            
            {isOpen && (
                <div className="mt-3 space-y-1">
                    {children}
                </div>
            )}
            
            <Separator className="mt-4" />
        </div>
    );
};

const Filters = ({
    categories = [],
    brands = [],
    filters = {},
    activeFilters,
    setActiveFilters,
    onClearFilters,
    productsCount = 0
}) => {
    const handleCategoryChange = (category) => {
        setActiveFilters({
            ...activeFilters,
            category: activeFilters.category === category ? '' : category
        });
    };
    
    const handleBrandChange = (brand) => {
        setActiveFilters({
            ...activeFilters,
            brand: activeFilters.brand === brand ? '' : brand
        });
    };
    
    const handleSortChange = (value) => {
        setActiveFilters({
            ...activeFilters,
            sort: value
        });
    };
    
    const handlePriceChange = (range) => {
        setActiveFilters({
            ...activeFilters,
            price: range
        });
    };
    
    const handleRatingChange = (rating) => {
        setActiveFilters({
            ...activeFilters,
            rating: rating === activeFilters.rating ? null : rating
        });
    };
    
    const handleCheckboxChange = (group, value) => {
        if (!activeFilters[group]) {
            setActiveFilters({
                ...activeFilters,
                [group]: [value]
            });
            return;
        }
        
        if (activeFilters[group].includes(value)) {
            setActiveFilters({
                ...activeFilters,
                [group]: activeFilters[group].filter(v => v !== value)
            });
        } else {
            setActiveFilters({
                ...activeFilters,
                [group]: [...activeFilters[group], value]
            });
        }
    };
    
    const handleToggleFilter = (filter, value) => {
        setActiveFilters({
            ...activeFilters,
            [filter]: value
        });
    };
    
    const countActiveFilters = () => {
        let count = 0;
        if (activeFilters.category) count++;
        if (activeFilters.brand) count++;
        if (activeFilters.price) count++;
        if (activeFilters.rating) count++;
        if (activeFilters.discount) count++;
        if (activeFilters.availability && activeFilters.availability !== 'all') count++;
        if (activeFilters.dietary?.length) count += activeFilters.dietary.length;
        if (activeFilters.shipping?.length) count += activeFilters.shipping.length;
        if (activeFilters.featured?.length) count += activeFilters.featured.length;
        return count;
    };
    
    const sortOptions = [
        { label: 'Most Popular', value: 'popular' },
        { label: 'Newest First', value: 'newest' },
        { label: 'Price: Low to High', value: 'price-low' },
        { label: 'Price: High to Low', value: 'price-high' },
        { label: 'Top Rated', value: 'rating' },
    ];
    
    const priceRanges = [
        { label: 'Under $10', value: '0-10' },
        { label: '$10 - $25', value: '10-25' },
        { label: '$25 - $50', value: '25-50' },
        { label: '$50 - $100', value: '50-100' },
        { label: '$100+', value: '100-999' },
    ];
    
    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border dark:border-gray-700 sticky top-24">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <SlidersHorizontal className="h-5 w-5 mr-2 text-primary" />
                    <h2 className="text-lg font-semibold">Filters</h2>
                </div>
                
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-normal">
                        {productsCount} Products
                    </Badge>
                    {countActiveFilters() > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={onClearFilters}
                            className="h-8 px-2 text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>
            
            {/* Sort By */}
            <FilterSection title="Sort By" icon={ArrowUpDown} defaultOpen={true}>
                <RadioGroup 
                    value={activeFilters.sort} 
                    onValueChange={handleSortChange}
                    className="space-y-1"
                >
                    {sortOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem 
                                value={option.value} 
                                id={`desktop-sort-${option.value}`}
                                className="h-4 w-4"
                            />
                            <label 
                                htmlFor={`desktop-sort-${option.value}`}
                                className="text-sm cursor-pointer flex-1 py-1"
                            >
                                {option.label}
                            </label>
                        </div>
                    ))}
                </RadioGroup>
            </FilterSection>
            
            {/* Categories */}
            <FilterSection title="Categories" icon={Tag} defaultOpen={true}>
                <div className="max-h-64 overflow-y-auto pr-2 space-y-1">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryChange(category.name)}
                            className={cn(
                                "flex items-center justify-between w-full text-left py-1.5 px-2 rounded-md text-sm",
                                "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                activeFilters.category === category.name && "bg-primary/10 text-primary font-medium"
                            )}
                        >
                            <span>{category.name}</span>
                            {activeFilters.category === category.name && (
                                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary text-white text-xs">
                                    ✓
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </FilterSection>
            
            {/* Brands */}
            <FilterSection title="Brands" icon={Tag} defaultOpen={false}>
                <div className="max-h-48 overflow-y-auto pr-2 space-y-1">
                    {brands.map((brand) => (
                        <button
                            key={brand.id}
                            onClick={() => handleBrandChange(brand.name)}
                            className={cn(
                                "flex items-center justify-between w-full text-left py-1.5 px-2 rounded-md text-sm",
                                "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                activeFilters.brand === brand.name && "bg-primary/10 text-primary font-medium"
                            )}
                        >
                            <span>{brand.name}</span>
                            {activeFilters.brand === brand.name && (
                                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary text-white text-xs">
                                    ✓
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </FilterSection>
            
            {/* Price Range */}
            <FilterSection title="Price Range" icon={SlidersHorizontal} defaultOpen={false}>
                <div className="space-y-1">
                    {priceRanges.map((range) => (
                        <button
                            key={range.value}
                            onClick={() => handlePriceChange(range.value)}
                            className={cn(
                                "flex items-center justify-between w-full text-left py-1.5 px-2 rounded-md text-sm",
                                "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                activeFilters.price === range.value && "bg-primary/10 text-primary font-medium"
                            )}
                        >
                            <span>{range.label}</span>
                            {activeFilters.price === range.value && (
                                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary text-white text-xs">
                                    ✓
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </FilterSection>
            
            {/* Rating */}
            <FilterSection title="Rating" icon={Star} defaultOpen={false}>
                <RadioGroup 
                    value={activeFilters.rating?.toString() || ""} 
                    onValueChange={(value) => handleRatingChange(parseInt(value))}
                    className="space-y-2"
                >
                    {filters.ratings?.map(rating => (
                        <div 
                            key={rating.id}
                            className="flex items-center space-x-2"
                        >
                            <RadioGroupItem 
                                value={rating.value.toString()} 
                                id={`desktop-rating-${rating.value}`}
                                className="h-4 w-4"
                            />
                            <label 
                                htmlFor={`desktop-rating-${rating.value}`}
                                className="text-sm cursor-pointer flex-1 py-1 flex items-center"
                            >
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "h-3.5 w-3.5",
                                                i < rating.value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                            )}
                                        />
                                    ))}
                                    <span className="ml-1">{rating.label}</span>
                                </div>
                            </label>
                        </div>
                    ))}
                </RadioGroup>
            </FilterSection>
            
            {/* Discount */}
            {filters.discount?.length > 0 && (
                <FilterSection title="Discounts" icon={Tag} defaultOpen={false}>
                    <div className="space-y-1">
                        {filters.discount.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`desktop-discount-${option.value}`}
                                    checked={option.value === 'sale' ? activeFilters.discount : false}
                                    onCheckedChange={(checked) => 
                                        handleToggleFilter('discount', checked ? option.value === 'sale' : false)
                                    }
                                />
                                <label
                                    htmlFor={`desktop-discount-${option.value}`}
                                    className="text-sm cursor-pointer flex-1 py-1"
                                >
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </FilterSection>
            )}
            
            {/* Availability */}
            {filters.availability?.length > 0 && (
                <FilterSection title="Availability" icon={Tag} defaultOpen={false}>
                    <RadioGroup 
                        value={activeFilters.availability} 
                        onValueChange={(value) => handleToggleFilter('availability', value)}
                        className="space-y-1"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="desktop-availability-all" className="h-4 w-4" />
                            <label htmlFor="desktop-availability-all" className="text-sm cursor-pointer flex-1 py-1">
                                All Products
                            </label>
                        </div>
                        {filters.availability.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <RadioGroupItem 
                                    value={option.value} 
                                    id={`desktop-availability-${option.value}`}
                                    className="h-4 w-4"
                                />
                                <label
                                    htmlFor={`desktop-availability-${option.value}`}
                                    className="text-sm cursor-pointer flex-1 py-1"
                                >
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </RadioGroup>
                </FilterSection>
            )}
            
            {/* Shipping */}
            {filters.shipping?.length > 0 && (
                <FilterSection title="Shipping" icon={Tag} defaultOpen={false}>
                    <div className="space-y-1">
                        {filters.shipping.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`desktop-shipping-${option.value}`}
                                    checked={activeFilters.shipping?.includes(option.value) || false}
                                    onCheckedChange={(checked) => 
                                        handleCheckboxChange('shipping', option.value)
                                    }
                                />
                                <label
                                    htmlFor={`desktop-shipping-${option.value}`}
                                    className="text-sm cursor-pointer flex-1 py-1"
                                >
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </FilterSection>
            )}
            
            {/* Featured */}
            {filters.featured?.length > 0 && (
                <FilterSection title="Product Type" icon={Tag} defaultOpen={false}>
                    <div className="space-y-1">
                        {filters.featured.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`desktop-featured-${option.value}`}
                                    checked={activeFilters.featured?.includes(option.value) || false}
                                    onCheckedChange={(checked) => 
                                        handleCheckboxChange('featured', option.value)
                                    }
                                />
                                <label
                                    htmlFor={`desktop-featured-${option.value}`}
                                    className="text-sm cursor-pointer flex-1 py-1"
                                >
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </FilterSection>
            )}
            
            {countActiveFilters() > 0 && (
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={onClearFilters}
                >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Reset All Filters
                </Button>
            )}
        </div>
    );
};

export default Filters; 