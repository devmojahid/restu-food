import React from 'react';
import { motion } from 'framer-motion';
import { Search, Grid, LayoutList, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

const SearchSection = ({ searchQuery, setSearchQuery, view, setView }) => {
    const sortOptions = [
        { label: 'Latest', value: 'latest' },
        { label: 'Oldest', value: 'oldest' },
        { label: 'Most Popular', value: 'popular' },
        { label: 'Most Commented', value: 'commented' }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Search Input */}
                    <div className="w-full sm:w-auto relative">
                        <Input
                            type="search"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-full sm:w-[300px]"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    </div>

                    {/* View and Sort Controls */}
                    <div className="flex items-center gap-2">
                        {/* View Toggle */}
                        <div className="flex items-center rounded-lg border dark:border-gray-700 p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "px-2",
                                    view === 'grid' && "bg-gray-100 dark:bg-gray-700"
                                )}
                                onClick={() => setView('grid')}
                            >
                                <Grid className="w-4 h-4" />
                                <span className="sr-only">Grid view</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "px-2",
                                    view === 'list' && "bg-gray-100 dark:bg-gray-700"
                                )}
                                onClick={() => setView('list')}
                            >
                                <LayoutList className="w-4 h-4" />
                                <span className="sr-only">List view</span>
                            </Button>
                        </div>

                        {/* Sort Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Sort
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {sortOptions.map((option) => (
                                    <DropdownMenuItem key={option.value}>
                                        {option.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchSection; 