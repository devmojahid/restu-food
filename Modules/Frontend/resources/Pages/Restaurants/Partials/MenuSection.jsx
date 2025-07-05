import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Minus, Info } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/Components/ui/use-toast';

const MenuSection = ({ menu = [], offers = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({
        vegetarian: false,
        vegan: false,
        spicy: false,
    });
    const { addToCart } = useCart();
    const { toast } = useToast();

    const menuItems = Array.isArray(menu) ? menu : [];
    const activeOffers = Array.isArray(offers) ? offers : [];

    const categories = menuItems.filter(item => item?.category)
        .reduce((acc, item) => {
            if (!acc.includes(item.category)) {
                acc.push(item.category);
            }
            return acc;
        }, []);

    const handleAddToCart = useCallback((item) => {
        addToCart(item);
        toast({
            title: "Added to cart",
            description: `${item.name} has been added to your cart.`,
        });
    }, [addToCart, toast]);

    const filteredMenu = menuItems.filter(category => {
        const matchesSearch = category.items.some(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const matchesFilters = category.items.some(item => {
            if (selectedFilters.vegetarian && !item.is_vegetarian) return false;
            if (selectedFilters.vegan && !item.is_vegan) return false;
            if (selectedFilters.spicy && !item.is_spicy) return false;
            return true;
        });

        return matchesSearch && matchesFilters;
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            {/* Active Offers */}
            {activeOffers.length > 0 && (
                <div className="bg-primary/5 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-primary">Active Offers</h3>
                    <div className="flex flex-wrap gap-2">
                        {activeOffers.map((offer) => (
                            <Badge 
                                key={offer.id} 
                                variant="outline"
                                className="bg-white dark:bg-gray-800"
                            >
                                {offer.title} - {offer.code}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={selectedFilters.vegetarian ? "default" : "outline"}
                        onClick={() => setSelectedFilters(prev => ({
                            ...prev,
                            vegetarian: !prev.vegetarian
                        }))}
                    >
                        🥬 Vegetarian
                    </Button>
                    <Button
                        variant={selectedFilters.vegan ? "default" : "outline"}
                        onClick={() => setSelectedFilters(prev => ({
                            ...prev,
                            vegan: !prev.vegan
                        }))}
                    >
                        🌱 Vegan
                    </Button>
                    <Button
                        variant={selectedFilters.spicy ? "default" : "outline"}
                        onClick={() => setSelectedFilters(prev => ({
                            ...prev,
                            spicy: !prev.spicy
                        }))}
                    >
                        🌶️ Spicy
                    </Button>
                </div>
            </div>

            {/* Categories Navigation */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        variant={activeCategory === category.id ? "default" : "outline"}
                        onClick={() => setActiveCategory(category.id)}
                        className="flex-none"
                    >
                        {category.name}
                    </Button>
                ))}
            </div>

            {/* Menu Items */}
            <div className="space-y-8">
                {filteredMenu.map((category) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {category.name}
                        </h2>
                        {category.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {category.description}
                            </p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {category.items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    className={cn(
                                        "bg-white dark:bg-gray-800 rounded-xl p-4",
                                        "border border-gray-100 dark:border-gray-700",
                                        "hover:shadow-lg transition-shadow",
                                        "flex gap-4"
                                    )}
                                >
                                    {/* Item Image */}
                                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                    {item.name}
                                                    {item.is_new && (
                                                        <Badge className="ml-2">New</Badge>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="flex-shrink-0"
                                                        >
                                                            <Info className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="space-y-1 text-sm">
                                                            <p>Calories: {item.calories}</p>
                                                            <p>Prep Time: {item.preparation_time}</p>
                                                            {item.allergens.length > 0 && (
                                                                <p>Allergens: {item.allergens.join(', ')}</p>
                                                            )}
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-2 my-2">
                                            {item.is_vegetarian && (
                                                <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                                                    🥬 Vegetarian
                                                </Badge>
                                            )}
                                            {item.is_vegan && (
                                                <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                                                    🌱 Vegan
                                                </Badge>
                                            )}
                                            {item.is_spicy && (
                                                <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20">
                                                    🌶️ Spicy
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Price & Add to Cart */}
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                                ${item.price}
                                            </div>
                                            <Button
                                                onClick={() => handleAddToCart(item)}
                                                size="sm"
                                            >
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default MenuSection; 