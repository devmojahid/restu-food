import React from 'react';
import { motion } from 'framer-motion';
import { 
    Search, 
    Grid, 
    LayoutList,
    MapPin,
    X
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';

const SearchSection = ({ searchQuery, setSearchQuery, view, setView }) => {
    return (
        <div className="sticky top-20 z-40 bg-white dark:bg-gray-900 border-b 
                      dark:border-gray-800 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Input
                            type="text"
                            placeholder="Search restaurants, cuisines, or dishes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-10 py-2 w-full rounded-full"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 
                                         hover:bg-transparent"
                                onClick={() => setSearchQuery('')}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {/* Location Selector */}
                    <div className="relative w-full md:w-auto">
                        <Button 
                            variant="outline" 
                            className="w-full md:w-auto rounded-full"
                        >
                            <MapPin className="w-4 h-4 mr-2" />
                            New York, NY
                        </Button>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-8 w-8 rounded-md",
                                view === 'grid' && "bg-white dark:bg-gray-700 shadow-sm"
                            )}
                            onClick={() => setView('grid')}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-8 w-8 rounded-md",
                                view === 'list' && "bg-white dark:bg-gray-700 shadow-sm"
                            )}
                            onClick={() => setView('list')}
                        >
                            <LayoutList className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchSection; 