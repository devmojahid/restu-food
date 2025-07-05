import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    ChevronUp,
    Search,
    Filter,
    Plus,
    Star,
    Clock,
    Utensils,
    X,
    Loader2,
    RefreshCw,
    AlertCircle,
    Sparkles,
    Flame,
    Leaf,
    ShoppingBag
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/Components/ui/tabs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Alert, AlertDescription } from "@/Components/ui/alert";

const MenuSection = ({ menu = null }) => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        dietary: [],
        price: [],
        spiciness: null
    });

    // If menu is null or empty, display placeholder message
    if (!menu || !menu.categories || menu.categories.length === 0) {
        return (
            <section id="menu" className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Menu</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                        <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Menu Currently Unavailable</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            We're currently updating our menu. Please check back later to see our delicious offerings.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // Set the initial active category
    React.useEffect(() => {
        if (menu?.categories?.length > 0 && !activeCategory) {
            setActiveCategory(menu.categories[0].id);
        }
    }, [menu, activeCategory]);

    // Filter menu items based on search and filters
    const filteredItems = React.useMemo(() => {
        if (!activeCategory) return [];

        const category = menu.categories.find(cat => cat.id === activeCategory);
        if (!category) return [];

        return category.items.filter(item => {
            // Search filter
            if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Dietary filters
            if (selectedFilters.dietary.length > 0) {
                const dietaryMatch = selectedFilters.dietary.some(diet => item[diet]);
                if (!dietaryMatch) return false;
            }

            // Price filter
            if (selectedFilters.price.length > 0) {
                const priceMatch = selectedFilters.price.some(range => {
                    const [min, max] = range.split('-').map(Number);
                    return item.price >= min && item.price <= max;
                });
                if (!priceMatch) return false;
            }

            // Spiciness filter
            if (selectedFilters.spiciness !== null && item.spiciness !== selectedFilters.spiciness) {
                return false;
            }

            return true;
        });
    }, [activeCategory, menu, searchQuery, selectedFilters]);

    const handleFilterChange = useCallback((filterType, value) => {
        setSelectedFilters(prev => {
            const newFilters = { ...prev };

            if (filterType === 'dietary') {
                if (newFilters.dietary.includes(value)) {
                    newFilters.dietary = newFilters.dietary.filter(item => item !== value);
                } else {
                    newFilters.dietary = [...newFilters.dietary, value];
                }
            } else if (filterType === 'price') {
                if (newFilters.price.includes(value)) {
                    newFilters.price = newFilters.price.filter(item => item !== value);
                } else {
                    newFilters.price = [...newFilters.price, value];
                }
            } else if (filterType === 'spiciness') {
                newFilters.spiciness = newFilters.spiciness === value ? null : value;
            }

            return newFilters;
        });
    }, []);

    const resetFilters = useCallback(() => {
        setSelectedFilters({
            dietary: [],
            price: [],
            spiciness: null
        });
        setSearchQuery('');
    }, []);

    // Item card component
    const MenuItem = ({ item }) => {
        const [isHovered, setIsHovered] = useState(false);
        const [isAddingToCart, setIsAddingToCart] = useState(false);

        const handleAddToCart = () => {
            setIsAddingToCart(true);
            // Simulating API call
            setTimeout(() => {
                setIsAddingToCart(false);
            }, 800);
            // Actual cart functionality would be implemented here
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className={cn(
                    "relative bg-white dark:bg-gray-800 rounded-xl",
                    "border border-gray-100 dark:border-gray-700",
                    "shadow-sm hover:shadow-md transition-all duration-300",
                    "overflow-hidden group"
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image container */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70"></div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {item.isNew && (
                            <Badge className="bg-primary text-white">New</Badge>
                        )}
                        {item.isPopular && (
                            <Badge className="bg-orange-500 text-white">
                                <Flame className="w-3 h-3 mr-1" />
                                Popular
                            </Badge>
                        )}
                        {item.isVegetarian && (
                            <Badge className="bg-green-500 text-white">
                                <Leaf className="w-3 h-3 mr-1" />
                                Veg
                            </Badge>
                        )}
                    </div>

                    {/* Add to cart button */}
                    <div className="absolute bottom-3 right-3">
                        <Button
                            size="sm"
                            className="rounded-full bg-white/90 text-gray-900 hover:bg-white"
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                        >
                            {isAddingToCart ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            {item.name}
                        </h3>
                        <div className="text-lg font-bold text-primary">
                            ${item.price.toFixed(2)}
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1">{item.rating}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4" />
                                <span className="ml-1">{item.prepTime} min</span>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary"
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                        >
                            <ShoppingBag className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    };

    // Filters panel
    const FiltersPanel = () => (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
                height: isFiltersOpen ? "auto" : 0,
                opacity: isFiltersOpen ? 1 : 0
            }}
            className="overflow-hidden"
        >
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Dietary Preferences */}
                    <div>
                        <h4 className="font-medium mb-2 text-sm">Dietary Preferences</h4>
                        <div className="flex flex-wrap gap-2">
                            {['vegetarian', 'vegan', 'glutenFree'].map(diet => (
                                <Button
                                    key={diet}
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                        "rounded-full",
                                        selectedFilters.dietary.includes(diet) &&
                                        "bg-primary/10 text-primary border-primary"
                                    )}
                                    onClick={() => handleFilterChange('dietary', diet)}
                                >
                                    {diet === 'vegetarian' ? 'Vegetarian' :
                                        diet === 'vegan' ? 'Vegan' : 'Gluten Free'}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h4 className="font-medium mb-2 text-sm">Price Range</h4>
                        <div className="flex flex-wrap gap-2">
                            {['0-10', '10-20', '20-30', '30-50'].map(range => (
                                <Button
                                    key={range}
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                        "rounded-full",
                                        selectedFilters.price.includes(range) &&
                                        "bg-primary/10 text-primary border-primary"
                                    )}
                                    onClick={() => handleFilterChange('price', range)}
                                >
                                    {range === '0-10' ? 'Under $10' :
                                        range === '10-20' ? '$10-$20' :
                                            range === '20-30' ? '$20-$30' :
                                                'Over $30'}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Spiciness Level */}
                    <div>
                        <h4 className="font-medium mb-2 text-sm">Spiciness Level</h4>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3].map(level => (
                                <Button
                                    key={level}
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                        "rounded-full",
                                        selectedFilters.spiciness === level &&
                                        "bg-primary/10 text-primary border-primary"
                                    )}
                                    onClick={() => handleFilterChange('spiciness', level)}
                                >
                                    {level === 1 ? 'Mild 🌶️' :
                                        level === 2 ? 'Medium 🌶️🌶️' :
                                            'Spicy 🌶️🌶️🌶️'}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="rounded-full"
                    >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Reset Filters
                    </Button>
                </div>
            </div>
        </motion.div>
    );

    // Component for when no items match filters
    const NoItemsFound = () => (
        <div className="text-center py-12">
            <Utensils className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No items match your filters</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Try adjusting your search or filter criteria to find something delicious
            </p>
            <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="rounded-full"
            >
                <RefreshCw className="w-4 h-4 mr-1" />
                Reset Filters
            </Button>
        </div>
    );

    return (
        <section id="menu" className="py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary" />
                            Our Menu
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {menu.description || "Explore our carefully crafted menu"}
                        </p>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                            {isFiltersOpen ? (
                                <ChevronUp className="w-4 h-4 ml-2" />
                            ) : (
                                <ChevronDown className="w-4 h-4 ml-2" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Search Bar and Filters */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Search menu items..."
                            className="pl-10 rounded-full border-gray-200 dark:border-gray-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                onClick={() => setSearchQuery('')}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    <FiltersPanel />
                </div>

                {/* Category Tabs */}
                <Tabs
                    defaultValue={menu.categories[0]?.id}
                    value={activeCategory}
                    onValueChange={setActiveCategory}
                    className="mb-8"
                >
                    <TabsList className="w-full overflow-x-auto flex-nowrap whitespace-nowrap pb-1 justify-start h-auto">
                        {menu.categories.map(category => (
                            <TabsTrigger
                                key={category.id}
                                value={category.id}
                                className="px-4 py-2 rounded-full data-[state=active]:text-primary data-[state=active]:bg-primary/10 transition-all"
                            >
                                {category.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {menu.categories.map(category => (
                        <TabsContent
                            key={category.id}
                            value={category.id}
                            className="pt-4"
                        >
                            <AnimatePresence>
                                {filteredItems.length > 0 ? (
                                    <motion.div
                                        layout
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    >
                                        {filteredItems.map(item => (
                                            <MenuItem key={item.id} item={item} />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <NoItemsFound />
                                )}
                            </AnimatePresence>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
};

export default MenuSection; 