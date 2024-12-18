import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';

const PopularTags = ({ tags, activeFilters, onFilterChange }) => {
    const handleTagClick = (tagSlug) => {
        const newTags = activeFilters.tags.includes(tagSlug)
            ? activeFilters.tags.filter(t => t !== tagSlug)
            : [...activeFilters.tags, tagSlug];

        onFilterChange({ tags: newTags });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4" />
                <h3 className="font-medium">Popular Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
                { tags && tags.map((tag, index) => (
                    <motion.div
                        key={tag.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Badge
                            variant="outline"
                            className={cn(
                                "cursor-pointer transition-colors",
                                "hover:bg-primary/10",
                                activeFilters.tags.includes(tag.slug) && 
                                "bg-primary/10 text-primary border-primary"
                            )}
                            onClick={() => handleTagClick(tag.slug)}
                        >
                            {tag.name}
                            <span className="ml-1 text-xs">({tag.posts_count})</span>
                        </Badge>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PopularTags; 