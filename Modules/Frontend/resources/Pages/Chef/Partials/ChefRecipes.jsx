import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Clock, 
    Users, 
    ChevronRight, 
    PlusCircle, 
    Utensils, 
    Flame, 
    Star, 
    Bookmark, 
    Share2, 
    Filter 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Link } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu';

const ChefRecipes = ({ recipes = [], chef = {} }) => {
    const [filter, setFilter] = useState('all'); // all, appetizer, main, dessert, etc.
    
    if (!recipes || recipes.length === 0) {
        return null;
    }

    // Filter recipes based on category
    const filteredRecipes = filter === 'all' 
        ? recipes 
        : recipes.filter(recipe => recipe.category?.toLowerCase() === filter);

    // Get unique categories
    const categories = ['all', ...new Set(recipes.map(recipe => 
        recipe.category?.toLowerCase()).filter(Boolean))];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Signature Recipes</h3>
                
                {chef.id && (
                    <Link 
                        href={route('frontend.chef.recipes', chef.id)}
                        className="flex items-center text-primary hover:text-primary/90 text-sm"
                    >
                        <span>View All</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                )}
            </div>
            
            {/* Category Filters */}
            {categories.length > 1 && (
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
                    <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    
                    {categories.map((category) => (
                        <Button 
                            key={category}
                            variant={filter === category ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(category)}
                            className="rounded-full capitalize text-xs whitespace-nowrap"
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            )}
            
            {/* Recipes Grid */}
            {filteredRecipes.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No recipes match the selected filter.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRecipes.slice(0, 4).map((recipe, index) => (
                        <RecipeCard 
                            key={recipe.id || index} 
                            recipe={recipe} 
                            index={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const RecipeCard = ({ recipe, index }) => {
    const [isSaved, setIsSaved] = useState(recipe.is_saved || false);
    
    const toggleSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSaved(!isSaved);
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
            <Link 
                href={route('frontend.recipes.show', recipe.slug || recipe.id)}
                className="block"
            >
                {/* Recipe Image */}
                <div className="relative h-40 overflow-hidden">
                    <img 
                        src={recipe.image || '/images/default-recipe.jpg'} 
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    
                    {/* Category Badge */}
                    {recipe.category && (
                        <Badge
                            className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm text-white"
                        >
                            {recipe.category}
                        </Badge>
                    )}
                    
                    {/* Difficulty */}
                    {recipe.difficulty && (
                        <Badge
                            variant="outline"
                            className="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white"
                        >
                            {recipe.difficulty}
                        </Badge>
                    )}
                    
                    {/* Save Button */}
                    <button
                        onClick={toggleSave}
                        className="absolute bottom-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    >
                        <Bookmark 
                            className={cn(
                                "w-4 h-4",
                                isSaved ? "text-primary fill-primary" : "text-gray-600 dark:text-gray-300"
                            )} 
                        />
                    </button>
                </div>
                
                {/* Recipe Content */}
                <div className="p-4">
                    <h4 className="font-semibold text-base line-clamp-1 mb-1 hover:text-primary transition-colors">
                        {recipe.title}
                    </h4>
                    
                    {/* Info: time, servings */}
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {recipe.prep_time && (
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{recipe.prep_time}</span>
                            </div>
                        )}
                        
                        {recipe.servings && (
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                <span>{recipe.servings} servings</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Rating or Spice Level */}
                    {(recipe.rating || recipe.spice_level) && (
                        <div className="flex items-center justify-between mb-3">
                            {recipe.rating && (
                                <div className="flex items-center">
                                    <div className="flex">
                                        {Array(5).fill(0).map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={cn(
                                                    "w-4 h-4", 
                                                    i < Math.floor(recipe.rating) 
                                                        ? "text-yellow-400 fill-yellow-400" 
                                                        : "text-gray-300"
                                                )} 
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500 ml-1">
                                        ({recipe.reviews_count || 0})
                                    </span>
                                </div>
                            )}
                            
                            {recipe.spice_level && (
                                <div className="flex items-center">
                                    {Array(3).fill(0).map((_, i) => (
                                        <Flame 
                                            key={i} 
                                            className={cn(
                                                "w-4 h-4", 
                                                i < recipe.spice_level 
                                                    ? "text-red-500" 
                                                    : "text-gray-300"
                                            )} 
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Description */}
                    {recipe.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                            {recipe.description}
                        </p>
                    )}
                    
                    {/* Key Ingredients */}
                    {recipe.key_ingredients && recipe.key_ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {recipe.key_ingredients.slice(0, 3).map((ingredient, i) => (
                                <span 
                                    key={i}
                                    className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                                >
                                    {ingredient}
                                </span>
                            ))}
                            {recipe.key_ingredients.length > 3 && (
                                <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                                    +{recipe.key_ingredients.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </Link>
        </motion.div>
    );
};

export default ChefRecipes; 