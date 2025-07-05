import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    X,
    ChevronDown,
    Info,
    Leaf,
    PlusCircle,
    Star,
    Flame,
    AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Separator } from '@/Components/ui/separator';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/Components/ui/collapsible';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import { ScrollArea, ScrollBar } from '@/Components/ui/scroll-area';

const MenuSection = ({ menu, onAddToCart }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedFilters, setSelectedFilters] = useState({
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        dairyFree: false,
        popular: false,
    });
    const [expandedItems, setExpandedItems] = useState({});

    const toggleItemExpanded = (itemId) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleFilterChange = (filter) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filter]: !prev[filter]
        }));
    };

    const filteredCategories = menu?.categories?.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.items.some(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const activeFiltersCount = Object.values(selectedFilters).filter(Boolean).length;

    const MenuItem = ({ item, categoryName }) => {
        const isExpanded = expandedItems[item.id];
        const isPopular = item.isPopular;
        const isVegetarian = item.isVegetarian;
        const allergensExist = item.allergens && item.allergens.length > 0;

        // Check if item passes filters
        const passesFilters = () => {
            if (selectedFilters.vegetarian && !item.isVegetarian) return false;
            if (selectedFilters.vegan && !item.isVegan) return false;
            if (selectedFilters.glutenFree && item.allergens?.includes('Gluten')) return false;
            if (selectedFilters.dairyFree && item.allergens?.includes('Dairy')) return false;
            if (selectedFilters.popular && !item.isPopular) return false;
            return true;
        };

        if (!passesFilters()) return null;

        return (
            <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                    "p-4 rounded-lg mb-4 transition-all group cursor-pointer",
                    "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    "border border-gray-100 dark:border-gray-800",
                    isExpanded ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-800"
                )}
                onClick={() => toggleItemExpanded(item.id)}
            >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Image (if available) */}
                    {item.image && (
                        <div className="w-full md:w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-start justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                    {item.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                    {item.description}
                                </p>

                                {/* Item Badges */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {isVegetarian && (
                                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900">
                                            <Leaf className="w-3 h-3 mr-1" />
                                            Vegetarian
                                        </Badge>
                                    )}

                                    {isPopular && (
                                        <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900">
                                            <Flame className="w-3 h-3 mr-1" />
                                            Popular
                                        </Badge>
                                    )}

                                    {allergensExist && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900">
                                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                                        Allergens
                                                    </Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Contains: {item.allergens.join(', ')}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end mt-2 md:mt-0">
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                    ${item.price.toFixed(2)}
                                </div>

                                {/* Add to Cart Button */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2 text-primary hover:text-primary/80 hover:bg-primary/10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddToCart && onAddToCart(item);
                                    }}
                                >
                                    <PlusCircle className="w-4 h-4 mr-1" />
                                    Add to Cart
                                </Button>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
                                >
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                        {item.calories && (
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Calories:</span>
                                                <span className="ml-2 font-medium">{item.calories}</span>
                                            </div>
                                        )}

                                        {item.allergens && item.allergens.length > 0 && (
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Allergens:</span>
                                                <span className="ml-2 font-medium">{item.allergens.join(', ')}</span>
                                            </div>
                                        )}

                                        {categoryName && (
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Category:</span>
                                                <span className="ml-2 font-medium">{categoryName}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Our Menu
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Browse our selection of carefully crafted dishes
                    </p>
                </div>

                {/* Dietary Options */}
                {menu?.dietary_options?.length > 0 && (
                    <div className="mt-4 md:mt-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Dietary Options Available:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {menu.dietary_options.map((option, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-primary/10 text-primary border-primary/20"
                                >
                                    {option}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search menu items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                        {searchQuery && (
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                onClick={() => setSearchQuery('')}
                            >
                                <X className="h-4 w-4 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="flex-shrink-0">
                        <Collapsible>
                            <div className="flex items-center gap-2">
                                <CollapsibleTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                        <Filter className="h-4 w-4 mr-1" />
                                        <span>Filters</span>
                                        {activeFiltersCount > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="ml-1 bg-primary text-white h-5 w-5 p-0 flex items-center justify-center rounded-full"
                                            >
                                                {activeFiltersCount}
                                            </Badge>
                                        )}
                                        <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
                                    </Button>
                                </CollapsibleTrigger>

                                {activeFiltersCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedFilters({
                                            vegetarian: false,
                                            vegan: false,
                                            glutenFree: false,
                                            dairyFree: false,
                                            popular: false,
                                        })}
                                    >
                                        Reset
                                    </Button>
                                )}
                            </div>

                            <CollapsibleContent>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
                                    <Button
                                        variant={selectedFilters.vegetarian ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleFilterChange('vegetarian')}
                                        className={cn(
                                            selectedFilters.vegetarian ? "" : "border-gray-200 dark:border-gray-700",
                                            "justify-start"
                                        )}
                                    >
                                        <Leaf className="h-4 w-4 mr-2" />
                                        Vegetarian
                                    </Button>

                                    <Button
                                        variant={selectedFilters.vegan ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleFilterChange('vegan')}
                                        className={cn(
                                            selectedFilters.vegan ? "" : "border-gray-200 dark:border-gray-700",
                                            "justify-start"
                                        )}
                                    >
                                        <Leaf className="h-4 w-4 mr-2" />
                                        Vegan
                                    </Button>

                                    <Button
                                        variant={selectedFilters.glutenFree ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleFilterChange('glutenFree')}
                                        className={cn(
                                            selectedFilters.glutenFree ? "" : "border-gray-200 dark:border-gray-700",
                                            "justify-start"
                                        )}
                                    >
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        Gluten Free
                                    </Button>

                                    <Button
                                        variant={selectedFilters.dairyFree ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleFilterChange('dairyFree')}
                                        className={cn(
                                            selectedFilters.dairyFree ? "" : "border-gray-200 dark:border-gray-700",
                                            "justify-start"
                                        )}
                                    >
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        Dairy Free
                                    </Button>

                                    <Button
                                        variant={selectedFilters.popular ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleFilterChange('popular')}
                                        className={cn(
                                            selectedFilters.popular ? "" : "border-gray-200 dark:border-gray-700",
                                            "justify-start"
                                        )}
                                    >
                                        <Star className="h-4 w-4 mr-2" />
                                        Popular
                                    </Button>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            {menu?.categories?.length > 0 && (
                <div className="mb-6">
                    <ScrollArea>
                        <div className="flex pb-4">
                            <TabsList className="h-10 bg-transparent p-0">
                                <TabsTrigger
                                    value="all"
                                    onClick={() => setSelectedCategory('all')}
                                    className={cn(
                                        "rounded-full px-4 py-2 text-sm font-medium",
                                        selectedCategory === 'all'
                                            ? "bg-primary text-white"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    )}
                                >
                                    All Categories
                                </TabsTrigger>

                                {menu.categories.map((category) => (
                                    <TabsTrigger
                                        key={category.id}
                                        value={category.id.toString()}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={cn(
                                            "rounded-full px-4 py-2 text-sm font-medium ml-2",
                                            selectedCategory === category.id
                                                ? "bg-primary text-white"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        )}
                                    >
                                        {category.name}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            )}

            {/* Menu Items */}
            {filteredCategories?.length > 0 ? (
                <div>
                    {(selectedCategory === 'all' ? filteredCategories : filteredCategories.filter(cat => cat.id === selectedCategory))
                        .map((category) => (
                            <div key={category.id} className="mb-8">
                                <div className="flex items-center mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {category.name}
                                    </h3>
                                    {category.description && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="w-4 h-4 ml-2 text-gray-400" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{category.description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>

                                <Separator className="mb-4" />

                                <div>
                                    {category.items
                                        .filter(item =>
                                            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            item.description.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map(item => (
                                            <MenuItem
                                                key={item.id}
                                                item={item}
                                                categoryName={category.name}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No menu items found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        {searchQuery
                            ? `No results found for "${searchQuery}". Try a different search term or clear filters.`
                            : "No menu items available at the moment."}
                    </p>

                    {(searchQuery || activeFiltersCount > 0) && (
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedFilters({
                                    vegetarian: false,
                                    vegan: false,
                                    glutenFree: false,
                                    dairyFree: false,
                                    popular: false,
                                });
                            }}
                        >
                            Clear All Filters
                        </Button>
                    )}
                </div>
            )}

            {/* Special Menus */}
            {menu?.specialMenus?.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Special Menus
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {menu.specialMenus.map((specialMenu) => (
                            <div
                                key={specialMenu.id}
                                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                            >
                                {specialMenu.image && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={specialMenu.image}
                                            alt={specialMenu.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="p-5">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {specialMenu.name}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {specialMenu.description}
                                    </p>

                                    {specialMenu.items?.length > 0 && (
                                        <div className="mb-4">
                                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Includes:
                                            </h5>
                                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                                                {specialMenu.items.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="text-lg font-semibold text-primary">
                                            ${specialMenu.price.toFixed(2)}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onAddToCart && onAddToCart({
                                                id: `special-${specialMenu.id}`,
                                                name: specialMenu.name,
                                                price: specialMenu.price,
                                                image: specialMenu.image,
                                                isSpecialMenu: true
                                            })}
                                        >
                                            <PlusCircle className="w-4 h-4 mr-2" />
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Wine Pairings */}
            {menu?.wine_pairings && (
                <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Wine Pairing Available
                        </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Our sommelier can recommend the perfect wine to complement your meal. Ask your server for details.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MenuSection; 