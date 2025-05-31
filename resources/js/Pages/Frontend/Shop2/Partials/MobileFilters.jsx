import React, { useState } from 'react';
import { 
    Search, 
    X, 
    Tag, 
    ChevronRight,
    Check,
    ChevronDown,
    ChevronUp,
    SlidersHorizontal,
    Trash2,
    ArrowUpDown,
    Star
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Separator } from '@/Components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Slider } from '@/Components/ui/slider';
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Checkbox } from '@/Components/ui/checkbox';

const MobileFilters = ({
    categories = [],
    brands = [],
    filters = {},
    activeFilters,
    setActiveFilters,
    searchQuery,
    setSearchQuery,
    onClearFilters,
    productsCount = 0,
    onClose
}) => {
    const [expandedSections, setExpandedSections] = useState({
        sort: true,
        categories: false,
        brands: false,
        price: false,
        rating: false,
        other: false
    });
    
    const toggleSection = (section) => {
        setExpandedSections({
            ...expandedSections,
            [section]: !expandedSections[section]
        });
    };
    
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
        <div className="py-2">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
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
                            Clear All
                        </Button>
                    )}
                </div>
            </div>
            
            {/* Search */}
            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setSearchQuery('')}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            
            <Separator className="my-4" />
            
            {/* Sort Section */}
            <div className="mb-4">
                <button
                    onClick={() => toggleSection('sort')}
                    className="w-full flex items-center justify-between py-2 font-medium"
                >
                    <div className="flex items-center">
                        <ArrowUpDown className="h-4 w-4 mr-2 text-primary" />
                        <span>Sort By</span>
                    </div>
                    {expandedSections.sort ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </button>
                
                {expandedSections.sort && (
                    <div className="mt-2 space-y-2">
                        <RadioGroup 
                            value={activeFilters.sort} 
                            onValueChange={handleSortChange}
                            className="space-y-1"
                        >
                            {sortOptions.map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem 
                                        value={option.value} 
                                        id={`sort-${option.value}`}
                                        className="h-4 w-4"
                                    />
                                    <label 
                                        htmlFor={`sort-${option.value}`}
                                        className="text-sm cursor-pointer flex-1 py-1"
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                )}
                
                <Separator className="my-4" />
            </div>
            
            {/* Categories */}
            <div className="mb-4">
                <button
                    onClick={() => toggleSection('categories')}
                    className="w-full flex items-center justify-between py-2 font-medium"
                >
                    <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-primary" />
                        <span>Categories</span>
                    </div>
                    {expandedSections.categories ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </button>
                
                {expandedSections.categories && (
                    <div className="mt-2 grid grid-cols-1 gap-1 max-h-60 overflow-auto pr-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.name)}
                                className={cn(
                                    "flex items-center justify-between py-2 px-3 rounded-md text-sm",
                                    "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                                    activeFilters.category === category.name && "bg-primary/10 text-primary"
                                )}
                            >
                                <span>{category.name}</span>
                                {activeFilters.category === category.name && (
                                    <Check className="h-4 w-4" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
                
                <Separator className="my-4" />
            </div>
            
            {/* Brands */}
            <div className="mb-4">
                <button
                    onClick={() => toggleSection('brands')}
                    className="w-full flex items-center justify-between py-2 font-medium"
                >
                    <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-primary" />
                        <span>Brands</span>
                    </div>
                    {expandedSections.brands ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </button>
                
                {expandedSections.brands && (
                    <div className="mt-2 grid grid-cols-1 gap-1 max-h-60 overflow-auto pr-2">
                        {brands.map((brand) => (
                            <button
                                key={brand.id}
                                onClick={() => handleBrandChange(brand.name)}
                                className={cn(
                                    "flex items-center justify-between py-2 px-3 rounded-md text-sm",
                                    "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                                    activeFilters.brand === brand.name && "bg-primary/10 text-primary"
                                )}
                            >
                                <span>{brand.name}</span>
                                {activeFilters.brand === brand.name && (
                                    <Check className="h-4 w-4" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
                
                <Separator className="my-4" />
            </div>
            
            {/* Price */}
            <div className="mb-4">
                <button
                    onClick={() => toggleSection('price')}
                    className="w-full flex items-center justify-between py-2 font-medium"
                >
                    <div className="flex items-center">
                        <SlidersHorizontal className="h-4 w-4 mr-2 text-primary" />
                        <span>Price Range</span>
                    </div>
                    {expandedSections.price ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </button>
                
                {expandedSections.price && (
                    <div className="mt-2 space-y-2">
                        <div className="grid grid-cols-1 gap-1">
                            {priceRanges.map((range) => (
                                <button
                                    key={range.value}
                                    onClick={() => handlePriceChange(range.value)}
                                    className={cn(
                                        "flex items-center justify-between py-2 px-3 rounded-md text-sm",
                                        "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                                        activeFilters.price === range.value && "bg-primary/10 text-primary"
                                    )}
                                >
                                    <span>{range.label}</span>
                                    {activeFilters.price === range.value && (
                                        <Check className="h-4 w-4" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                <Separator className="my-4" />
            </div>
            
            {/* Rating */}
            <div className="mb-4">
                <button
                    onClick={() => toggleSection('rating')}
                    className="w-full flex items-center justify-between py-2 font-medium"
                >
                    <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2 text-primary" />
                        <span>Rating</span>
                    </div>
                    {expandedSections.rating ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </button>
                
                {expandedSections.rating && (
                    <div className="mt-2 space-y-2">
                        <RadioGroup 
                            value={activeFilters.rating?.toString() || ""} 
                            onValueChange={(value) => handleRatingChange(parseInt(value))}
                            className="space-y-1"
                        >
                            {filters.ratings?.map(rating => (
                                <div 
                                    key={rating.id}
                                    className="flex items-center space-x-2"
                                >
                                    <RadioGroupItem 
                                        value={rating.value.toString()} 
                                        id={`rating-${rating.value}`}
                                        className="h-4 w-4"
                                    />
                                    <label 
                                        htmlFor={`rating-${rating.value}`}
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
                    </div>
                )}
                
                <Separator className="my-4" />
            </div>
            
            {/* Other Filters */}
            <div className="mb-4">
                <button
                    onClick={() => toggleSection('other')}
                    className="w-full flex items-center justify-between py-2 font-medium"
                >
                    <div className="flex items-center">
                        <SlidersHorizontal className="h-4 w-4 mr-2 text-primary" />
                        <span>More Filters</span>
                    </div>
                    {expandedSections.other ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </button>
                
                {expandedSections.other && (
                    <div className="mt-2 space-y-4">
                        {/* Discount */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium mb-2">Discount</h4>
                            <div className="grid grid-cols-1 gap-1">
                                {filters.discount?.map((option) => (
                                    <div key={option.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`discount-${option.value}`}
                                            checked={option.value === 'sale' ? activeFilters.discount : false}
                                            onCheckedChange={(checked) => 
                                                handleToggleFilter('discount', checked ? option.value === 'sale' : false)
                                            }
                                        />
                                        <label
                                            htmlFor={`discount-${option.value}`}
                                            className="text-sm cursor-pointer flex-1 py-1"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Availability */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium mb-2">Availability</h4>
                            <RadioGroup 
                                value={activeFilters.availability} 
                                onValueChange={(value) => handleToggleFilter('availability', value)}
                                className="space-y-1"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="all" id="availability-all" className="h-4 w-4" />
                                    <label htmlFor="availability-all" className="text-sm cursor-pointer flex-1 py-1">
                                        All Products
                                    </label>
                                </div>
                                {filters.availability?.map((option) => (
                                    <div key={option.id} className="flex items-center space-x-2">
                                        <RadioGroupItem 
                                            value={option.value} 
                                            id={`availability-${option.value}`}
                                            className="h-4 w-4"
                                        />
                                        <label
                                            htmlFor={`availability-${option.value}`}
                                            className="text-sm cursor-pointer flex-1 py-1"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        
                        {/* Shipping */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium mb-2">Shipping Options</h4>
                            <div className="grid grid-cols-1 gap-1">
                                {filters.shipping?.map((option) => (
                                    <div key={option.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`shipping-${option.value}`}
                                            checked={activeFilters.shipping?.includes(option.value) || false}
                                            onCheckedChange={(checked) => 
                                                handleCheckboxChange('shipping', option.value)
                                            }
                                        />
                                        <label
                                            htmlFor={`shipping-${option.value}`}
                                            className="text-sm cursor-pointer flex-1 py-1"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Featured */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium mb-2">Product Type</h4>
                            <div className="grid grid-cols-1 gap-1">
                                {filters.featured?.map((option) => (
                                    <div key={option.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`featured-${option.value}`}
                                            checked={activeFilters.featured?.includes(option.value) || false}
                                            onCheckedChange={(checked) => 
                                                handleCheckboxChange('featured', option.value)
                                            }
                                        />
                                        <label
                                            htmlFor={`featured-${option.value}`}
                                            className="text-sm cursor-pointer flex-1 py-1"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="flex items-center gap-2 mt-8">
                <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={onClearFilters}
                >
                    Clear All
                </Button>
                <Button 
                    className="flex-1"
                    onClick={onClose}
                >
                    View Results
                </Button>
            </div>
        </div>
    );
};

export default MobileFilters; 