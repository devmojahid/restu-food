import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Folder } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';

const Categories = ({ categories, activeFilters, onFilterChange }) => {
    const handleCategoryClick = (categorySlug) => {
        const newCategories = activeFilters.category.includes(categorySlug)
            ? activeFilters.category.filter(c => c !== categorySlug)
            : [...activeFilters.category, categorySlug];

        onFilterChange({ category: newCategories });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Folder className="w-4 h-4" />
                <h3 className="font-medium">Categories</h3>
            </div>
            <div className="space-y-2">
                {categories.map((category, index) => (
                    <motion.button
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleCategoryClick(category.slug)}
                        className={cn(
                            "w-full flex items-center justify-between p-2 rounded-md",
                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                            "transition-colors duration-200",
                            activeFilters.category.includes(category.slug) && 
                            "bg-primary/10 text-primary"
                        )}
                    >
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="ml-2">
                            {category.posts_count}
                        </Badge>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default Categories; 