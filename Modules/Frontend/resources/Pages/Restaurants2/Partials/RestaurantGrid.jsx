import React from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/Components/ui/pagination';
import { Button } from '@/Components/ui/button';
import { Star, Clock, MapPin, Heart, ChevronRight, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/Components/ui/skeleton';

const RestaurantGrid = ({
    restaurants = [],
    view = 'grid',
    loading = false,
    searchQuery = '',
    page = 1,
    totalPages = 1,
    setPage
}) => {
    // Calculate restaurants for current page
    const itemsPerPage = 12;
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Instead of slicing here, we expect proper paginated data from backend
    const currentRestaurants = restaurants.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
            // Scroll to top of grid
            const gridElement = document.getElementById('restaurant-content');
            if (gridElement) {
                gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    // Format price range to display as text
    const formatPriceRange = (priceRange) => {
        switch (priceRange) {
            case '$':
                return 'Inexpensive';
            case '$$':
                return 'Moderate';
            case '$$$':
                return 'Expensive';
            case '$$$$':
                return 'Very Expensive';
            default:
                return priceRange;
        }
    };

    // Empty state when no results found
    const renderEmptyState = () => {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center" id="restaurant-content">
                <div className="rounded-full bg-gray-100 p-5 mb-4 dark:bg-gray-800">
                    <MapPin className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    {searchQuery
                        ? `We couldn't find any restaurants matching "${searchQuery}". Try different keywords or filters.`
                        : "We couldn't find any restaurants matching your criteria. Try adjusting your filters."
                    }
                </p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Reset Filters
                </Button>
            </div>
        );
    };

    // Loading state
    const renderLoadingState = () => {
        return view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="restaurant-content">
                {[...Array(6)].map((_, index) => (
                    <Card key={index} className="overflow-hidden h-full">
                        <Skeleton className="h-48 w-full" />
                        <CardHeader className="pb-2">
                            <Skeleton className="h-6 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-4/5 mb-2" />
                            <Skeleton className="h-4 w-3/5" />
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-20" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        ) : (
            <div className="flex flex-col gap-4" id="restaurant-content">
                {[...Array(6)].map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <Skeleton className="h-48 md:h-auto md:w-64" />
                            <div className="flex-1 p-4">
                                <Skeleton className="h-6 w-2/3 mb-2" />
                                <Skeleton className="h-4 w-full mb-4" />
                                <div className="flex gap-4 mb-4">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-8 w-20" />
                                    <Skeleton className="h-8 w-32" />
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    };

    // When there are no restaurants and not loading
    if (restaurants.length === 0 && !loading) {
        return renderEmptyState();
    }

    // When loading is true
    if (loading) {
        return renderLoadingState();
    }

    return (
        <div id="restaurant-content" className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">
                {searchQuery ? `Results for "${searchQuery}"` : 'All Restaurants'}
                <span className="text-gray-500 ml-2 text-lg">
                    ({restaurants.length} {restaurants.length === 1 ? 'restaurant' : 'restaurants'})
                </span>
            </h2>

            <AnimatePresence mode="wait">
                {view === 'grid' ? (
                    <motion.div
                        key="grid-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {currentRestaurants.map((restaurant) => (
                            <motion.div
                                key={restaurant.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
                                    <div className="relative h-48 overflow-hidden">
                                        {restaurant.image ? (
                                            <img
                                                src={restaurant.image}
                                                alt={restaurant.name}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400">No Image</span>
                                            </div>
                                        )}
                                        {restaurant.is_featured && (
                                            <Badge className="absolute top-3 left-3 bg-primary">
                                                Featured
                                            </Badge>
                                        )}
                                        <button className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors">
                                            <Heart size={18} className="text-gray-600 hover:text-red-500 transition-colors" />
                                        </button>
                                        {restaurant.offer && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-center py-1.5 text-sm font-medium">
                                                {restaurant.offer}
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                                            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-900/20 dark:text-green-300">
                                                <Star size={14} fill="currentColor" />
                                                <span className="text-sm font-medium">{restaurant.rating}</span>
                                            </div>
                                        </div>
                                        <CardDescription className="line-clamp-1">
                                            {restaurant.categories?.join(', ')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-3 pt-0 flex-grow">
                                        <div className="flex items-center text-gray-500 text-sm mb-2">
                                            <MapPin size={14} className="mr-1" />
                                            <span className="line-clamp-1">{restaurant.location || 'Unknown location'}</span>
                                        </div>
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <Clock size={14} className="mr-1" />
                                            <span>Delivery: {restaurant.delivery_time || '30-45 min'}</span>
                                            {restaurant.delivery_fee && (
                                                <span className="ml-2">· Fee: {restaurant.delivery_fee}</span>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-2 border-t flex justify-between">
                                        <Badge variant="outline" className="font-normal">
                                            {formatPriceRange(restaurant.price_range || '$$')}
                                        </Badge>
                                        <Link href={`/restaurants/${restaurant.id}`}>
                                            <Button size="sm" variant="default">
                                                View Menu
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="list-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col gap-4"
                    >
                        {currentRestaurants.map((restaurant) => (
                            <motion.div
                                key={restaurant.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="relative md:w-64 h-48 md:h-auto">
                                            {restaurant.image ? (
                                                <img
                                                    src={restaurant.image}
                                                    alt={restaurant.name}
                                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400">No Image</span>
                                                </div>
                                            )}
                                            {restaurant.is_featured && (
                                                <Badge className="absolute top-3 left-3 bg-primary">
                                                    Featured
                                                </Badge>
                                            )}
                                            <button className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors">
                                                <Heart size={18} className="text-gray-600 hover:text-red-500 transition-colors" />
                                            </button>
                                        </div>
                                        <div className="flex-1 p-4 flex flex-col">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                                                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-900/20 dark:text-green-300">
                                                    <Star size={14} fill="currentColor" />
                                                    <span className="text-sm font-medium">{restaurant.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-500 text-sm mb-3">{restaurant.categories?.join(', ')}</p>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 text-sm">
                                                <div className="flex items-center text-gray-500">
                                                    <MapPin size={14} className="mr-1 flex-shrink-0" />
                                                    <span className="truncate">{restaurant.location || 'Unknown location'}</span>
                                                </div>
                                                <div className="flex items-center text-gray-500">
                                                    <Clock size={14} className="mr-1 flex-shrink-0" />
                                                    <span>{restaurant.delivery_time || '30-45 min'}</span>
                                                </div>
                                                {restaurant.offer && (
                                                    <div className="flex items-center text-primary">
                                                        <Bookmark size={14} className="mr-1 flex-shrink-0" />
                                                        <span className="font-medium">{restaurant.offer}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center mt-auto">
                                                <Badge variant="outline" className="font-normal">
                                                    {formatPriceRange(restaurant.price_range || '$$')}
                                                </Badge>
                                                <div className="flex gap-2">
                                                    {restaurant.delivery_fee && (
                                                        <div className="text-sm text-gray-500">Delivery fee: {restaurant.delivery_fee}</div>
                                                    )}
                                                    <Link href={`/restaurants/${restaurant.id}`}>
                                                        <Button size="sm" variant="default">
                                                            View Menu
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(page - 1)}
                                    className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {/* We'll show a limited number of pages */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                // Logic for which pages to show
                                let pageNumber;
                                if (totalPages <= 5) {
                                    // Show all pages if total is 5 or less
                                    pageNumber = i + 1;
                                } else if (page <= 3) {
                                    // At beginning, show first 5 pages
                                    pageNumber = i + 1;
                                } else if (page >= totalPages - 2) {
                                    // At end, show last 5 pages
                                    pageNumber = totalPages - 4 + i;
                                } else {
                                    // In middle, show current and 2 on each side
                                    pageNumber = page - 2 + i;
                                }

                                return (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            isActive={pageNumber === page}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className="cursor-pointer"
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(page + 1)}
                                    className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default RestaurantGrid; 