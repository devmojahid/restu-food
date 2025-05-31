import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Filter, 
    GridIcon, 
    List, 
    Star, 
    ChevronDown, 
    Award, 
    Clock, 
    ArrowUpDown,
    X,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { ChefCard } from './FeaturedChefs';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Alert, AlertDescription } from '@/Components/ui/alert';

const ChefGrid = ({ 
    chefs = [], 
    searchQuery = '', 
    setSearchQuery,
    activeCategory = 'all',
    setActiveCategory,
    sortBy = 'featured',
    setSortBy
}) => {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [isLoading, setIsLoading] = useState(false);
    const [filteredChefs, setFilteredChefs] = useState(chefs);
    const [showFilters, setShowFilters] = useState(false);

    // Sort options
    const sortOptions = [
        { value: 'featured', label: 'Featured' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'experience', label: 'Most Experience' },
        { value: 'newest', label: 'Newest' },
    ];

    // Extract unique categories from chefs with null checks
    const categories = [
        { id: 'all', name: 'All Chefs' },
        ...Array.from(new Set(
            chefs
                .filter(chef => chef && chef.category) // Filter out null/undefined categories
                .map(chef => chef.category)
        )).map(category => ({
            id: category.toLowerCase().replace(/\s+/g, '-'),
            name: category
        }))
    ];

    // Filter chefs based on search and active category
    useEffect(() => {
        setIsLoading(true);
        
        // Simulate loading delay
        const timer = setTimeout(() => {
            let filtered = [...chefs];
            
            // Apply search filter with null checks
            if (searchQuery) {
                filtered = filtered.filter(chef => {
                    if (!chef) return false;
                    
                    const name = chef.name || '';
                    const role = chef.role || '';
                    const specialties = chef.specialties || [];
                    
                    return (
                        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        specialties.some(specialty => 
                            specialty && specialty.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                    );
                });
            }
            
            // Apply category filter with null checks
            if (activeCategory !== 'all') {
                filtered = filtered.filter(chef => {
                    if (!chef || !chef.category) return false;
                    return chef.category.toLowerCase().replace(/\s+/g, '-') === activeCategory;
                });
            }
            
            // Apply sorting with null checks
            switch (sortBy) {
                case 'rating':
                    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    break;
                case 'experience':
                    filtered.sort((a, b) => (b.experience || 0) - (a.experience || 0));
                    break;
                case 'newest':
                    filtered.sort((a, b) => {
                        const dateA = a.joinedDate ? new Date(a.joinedDate) : new Date(0);
                        const dateB = b.joinedDate ? new Date(b.joinedDate) : new Date(0);
                        return dateB - dateA;
                    });
                    break;
                default:
                    // Featured (default) - already sorted by featured flag
                    filtered.sort((a, b) => {
                        const aFeatured = a && a.featured ? 1 : 0;
                        const bFeatured = b && b.featured ? 1 : 0;
                        return bFeatured - aFeatured;
                    });
                    break;
            }
            
            setFilteredChefs(filtered);
            setIsLoading(false);
        }, 300);
        
        return () => clearTimeout(timer);
    }, [chefs, searchQuery, activeCategory, sortBy]);

    // Empty state when no chefs match filters
    const EmptyState = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-16"
        >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Chefs Found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                We couldn't find any chefs matching your criteria. Try adjusting your filters or search term.
            </p>
            <Button
                variant="outline"
                onClick={() => {
                    if (setSearchQuery) setSearchQuery('');
                    if (setActiveCategory) setActiveCategory('all');
                    if (setSortBy) setSortBy('featured');
                }}
            >
                Clear Filters
            </Button>
        </motion.div>
    );

    return (
        <section id="chef-grid" className="py-16">
            <div className="container mx-auto px-4">
                {/* Header with search and filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                    {/* Search bar */}
                    <div className="relative w-full md:w-auto md:min-w-[300px]">
                        <Input
                            type="text"
                            placeholder="Search chefs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                            className="pl-10 pr-10 py-2 w-full"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery && setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* Filters and view mode */}
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        {/* Filter button (mobile) */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="md:hidden"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                            <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>

                        {/* Sort dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="hidden md:flex">
                                    <ArrowUpDown className="w-4 h-4 mr-2" />
                                    Sort by: {sortOptions.find(option => option.value === sortBy)?.label || 'Featured'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {sortOptions.map(option => (
                                    <DropdownMenuItem
                                        key={option.value}
                                        onClick={() => setSortBy && setSortBy(option.value)}
                                        className={cn(
                                            sortBy === option.value && "bg-primary/10 text-primary"
                                        )}
                                    >
                                        {option.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile sort dropdown */}
                        <div className="md:hidden">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* View mode toggle */}
                        <div className="hidden md:flex items-center border rounded-lg p-1 bg-white dark:bg-gray-800">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "px-2 py-1 h-8",
                                    viewMode === 'grid' && "bg-gray-100 dark:bg-gray-700"
                                )}
                                onClick={() => setViewMode('grid')}
                            >
                                <GridIcon className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "px-2 py-1 h-8",
                                    viewMode === 'list' && "bg-gray-100 dark:bg-gray-700"
                                )}
                                onClick={() => setViewMode('list')}
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Category filter chips */}
                <div className="mb-8 overflow-x-auto pb-2 flex gap-2">
                    {categories.map(category => (
                        <Button
                            key={category.id}
                            variant={activeCategory === category.id ? "default" : "outline"}
                            size="sm"
                            className="rounded-full whitespace-nowrap"
                            onClick={() => setActiveCategory && setActiveCategory(category.id)}
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>

                {/* Mobile Filters (expandable) */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden mb-6"
                        >
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-4">
                                {/* Mobile filters content */}
                                <div>
                                    <h4 className="font-medium mb-2">Sort By</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {sortOptions.map(option => (
                                            <Button
                                                key={option.value}
                                                variant={sortBy === option.value ? "default" : "outline"}
                                                size="sm"
                                                className="justify-start"
                                                onClick={() => setSortBy && setSortBy(option.value)}
                                            >
                                                {option.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium mb-2">View Mode</h4>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={viewMode === 'grid' ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setViewMode('grid')}
                                        >
                                            <GridIcon className="w-4 h-4 mr-2" />
                                            Grid
                                        </Button>
                                        <Button
                                            variant={viewMode === 'list' ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setViewMode('list')}
                                        >
                                            <List className="w-4 h-4 mr-2" />
                                            List
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results count and loading indicator */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {filteredChefs.length} chef{filteredChefs.length !== 1 ? 's' : ''}
                    </p>
                    
                    {isLoading && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                        </div>
                    )}
                </div>

                {/* Chef Grid/List */}
                {filteredChefs.length > 0 ? (
                    <div className={cn(
                        viewMode === 'grid' 
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "flex flex-col space-y-4"
                    )}>
                        <AnimatePresence>
                            {filteredChefs.map((chef, index) => {
                                if (!chef) return null;
                                
                                return (
                                    <motion.div
                                        key={chef.id || `chef-${index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        {viewMode === 'grid' ? (
                                            <ChefCard chef={chef} />
                                        ) : (
                                            <ChefListItem chef={chef} />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
        </section>
    );
};

// List view item for chefs
const ChefListItem = ({ chef }) => {
    if (!chef) return null;

    const chefName = chef.name || 'Unknown Chef';
    const chefRole = chef.role || '';
    const chefRating = chef.rating || 4.8;
    const chefSpecialties = chef.specialties || [];
    const chefBio = chef.bio || '';
    const chefSlug = chef.slug || '#';
    const chefImage = chef.image || '/placeholder-chef.jpg';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex gap-4">
            {/* Chef image */}
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                    src={chefImage}
                    alt={chefName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = '/placeholder-chef.jpg';
                    }}
                />
                {chef.featured && (
                    <div className="absolute top-0 left-0 bg-primary text-white text-xs px-2 py-1">
                        Featured
                    </div>
                )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                    <div>
                        <h3 className="text-lg font-semibold">{chefName}</h3>
                        {chefRole && <p className="text-primary text-sm">{chefRole}</p>}
                    </div>
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">{chefRating}</span>
                    </div>
                </div>
                
                {/* Specialties */}
                {chefSpecialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {chefSpecialties.slice(0, 2).map((specialty, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                            >
                                {specialty}
                            </Badge>
                        ))}
                        {chefSpecialties.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                                +{chefSpecialties.length - 2}
                            </Badge>
                        )}
                    </div>
                )}
                
                {/* Bio */}
                {chefBio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {chefBio}
                    </p>
                )}
                
                {/* Action button */}
                <div className="flex justify-end">
                    <Link
                        href={`/chef/${chefSlug}`}
                        className="text-primary hover:text-primary/90 text-sm font-medium"
                    >
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ChefGrid;