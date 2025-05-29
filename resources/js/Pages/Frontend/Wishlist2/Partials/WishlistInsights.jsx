import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    PieChart as PieChartIcon,
    BarChart as BarChartIcon,
    TrendingUp,
    DollarSign,
    Calendar,
    Tag,
    Star,
    Clock,
    ArrowUp,
    ArrowDown,
    Building,
    Utensils,
    Package,
    ShoppingBag,
    BadgePercent,
    Info,
    X
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { Progress } from '@/Components/ui/progress';
import { Badge } from '@/Components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';

const WishlistInsights = ({ stats = {} }) => {
    const [activeTab, setActiveTab] = useState('overview');

    // Default data if none provided
    const {
        total_value = 0,
        total_savings = 0,
        avg_price = 0,
        price_range = { min: 0, max: 0 },
        categories = [],
        restaurants = [],
        avg_rating = 0,
        ratings_distribution = [],
        price_distribution = [],
        date_added_distribution = [],
        savings_history = [],
        in_stock_percentage = 0,
        added_last_week = 0,
        added_last_month = 0,
        total_items = 0,
        price_drops = 0,
        price_increases = 0,
        popular_keywords = [],
        discount_distribution = []
    } = stats;

    // Format currency values
    const formattedTotalValue = formatCurrency(total_value);
    const formattedTotalSavings = formatCurrency(total_savings);
    const formattedAvgPrice = formatCurrency(avg_price);

    // Calculate savings percentage
    const savingsPercentage = total_value > 0
        ? Math.round((total_savings / total_value) * 100)
        : 0;

    // Sort categories by count
    const sortedCategories = [...(categories || [])].sort((a, b) => b.count - a.count);

    // Sort restaurants by count
    const sortedRestaurants = [...(restaurants || [])].sort((a, b) => b.count - a.count).slice(0, 5);

    // Format rating distribution for chart
    const formattedRatings = ratings_distribution?.length
        ? ratings_distribution
        : [
            { rating: 5, percentage: 45 },
            { rating: 4, percentage: 30 },
            { rating: 3, percentage: 15 },
            { rating: 2, percentage: 7 },
            { rating: 1, percentage: 3 }
        ];

    // Format price distribution for chart
    const formattedPrices = price_distribution?.length
        ? price_distribution
        : [
            { range: '$0-$10', percentage: 20 },
            { range: '$10-$20', percentage: 35 },
            { range: '$20-$30', percentage: 25 },
            { range: '$30-$40', percentage: 15 },
            { range: '$40+', percentage: 5 }
        ];

    // Generate monthly distribution if not provided
    const formattedDates = date_added_distribution?.length
        ? date_added_distribution
        : [
            { month: 'Jan', count: 3 },
            { month: 'Feb', count: 5 },
            { month: 'Mar', count: 8 },
            { month: 'Apr', count: 12 },
            { month: 'May', count: 7 },
            { month: 'Jun', count: 9 }
        ];

    // Empty state
    if (total_items === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 p-4">
                    <PieChartIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No insights available</h3>
                <p className="text-gray-500 max-w-md mb-8">
                    Start adding items to your wishlist to see insights and statistics about your saved items.
                </p>
                <Button>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Explore Restaurants
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center">
                    <PieChartIcon className="mr-2 h-5 w-5 text-primary" />
                    Wishlist Insights
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Detailed analytics and trends about your saved items
                </p>
            </div>

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:w-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Value Card */}
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-primary/5 pb-2">
                                <CardTitle className="text-lg flex items-center">
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Total Value
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold">{formattedTotalValue}</div>
                                <div className="mt-2 text-sm text-gray-500">
                                    Across {total_items} items
                                </div>
                            </CardContent>
                        </Card>

                        {/* Savings Card */}
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-green-500/5 pb-2">
                                <CardTitle className="text-lg flex items-center">
                                    <BadgePercent className="h-4 w-4 mr-2 text-green-500" />
                                    Potential Savings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold text-green-500">{formattedTotalSavings}</div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Savings rate</span>
                                    <span className="text-sm font-medium text-green-500">{savingsPercentage}%</span>
                                </div>
                                <Progress
                                    value={savingsPercentage}
                                    className="h-2 mt-1"
                                    indicatorClassName="bg-green-500"
                                />
                            </CardContent>
                        </Card>

                        {/* Price Tracking Card */}
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-blue-500/5 pb-2">
                                <CardTitle className="text-lg flex items-center">
                                    <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                                    Price Tracking
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                                            <span className="text-sm">Price Drops</span>
                                        </div>
                                        <Badge variant="outline" className="text-green-500">
                                            {price_drops}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <ArrowUp className="h-4 w-4 mr-1 text-red-500" />
                                            <span className="text-sm">Price Increases</span>
                                        </div>
                                        <Badge variant="outline" className="text-red-500">
                                            {price_increases}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Card */}
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-amber-500/5 pb-2">
                                <CardTitle className="text-lg flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Last 7 days</span>
                                        <Badge variant="outline" className="bg-amber-500/10">
                                            +{added_last_week}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Last 30 days</span>
                                        <Badge variant="outline" className="bg-amber-500/10">
                                            +{added_last_month}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {/* Ratings Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                                    Ratings Distribution
                                </CardTitle>
                                <CardDescription>
                                    Breakdown of your saved items by rating
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {formattedRatings.map((item) => (
                                        <div key={`rating-${item.rating}`} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center">
                                                    <span className="font-medium">{item.rating}</span>
                                                    <Star className="h-3 w-3 ml-1 text-yellow-400 fill-yellow-400" />
                                                </div>
                                                <span className="text-gray-500">{item.percentage}%</span>
                                            </div>
                                            <Progress
                                                value={item.percentage}
                                                className="h-2"
                                                indicatorClassName={getRatingColor(item.rating)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-center text-sm text-gray-500">
                                    Average rating: <span className="font-medium">{avg_rating.toFixed(1)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Monthly Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                                    Monthly Additions
                                </CardTitle>
                                <CardDescription>
                                    Items added to wishlist by month
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-end justify-between gap-2">
                                    {formattedDates.map((month, index) => {
                                        const maxCount = Math.max(...formattedDates.map(m => m.count));
                                        const height = maxCount > 0 ? (month.count / maxCount) * 100 : 0;

                                        return (
                                            <div key={`month-${index}`} className="flex flex-col items-center">
                                                <div
                                                    className="w-10 bg-indigo-500/80 rounded-t-md relative group"
                                                    style={{ height: `${height}%`, minHeight: '10px' }}
                                                >
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="absolute inset-0" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="text-xs font-medium">{month.month}: {month.count} items</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                <div className="mt-2 text-xs">{month.month}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Restaurants Tab */}
                <TabsContent value="restaurants" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <Building className="h-4 w-4 mr-2" />
                                Top Restaurants
                            </CardTitle>
                            <CardDescription>
                                Restaurants you've saved the most items from
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {sortedRestaurants.length > 0 ? (
                                    sortedRestaurants.map((restaurant, index) => (
                                        <div key={`restaurant-${index}`} className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                                                {restaurant.image ? (
                                                    <img
                                                        src={restaurant.image}
                                                        alt={restaurant.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className={`h-full w-full flex items-center justify-center ${getBackgroundColor(index)}`}>
                                                        <Building className="h-4 w-4 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-medium truncate">{restaurant.name}</h4>
                                                    <Badge variant="outline">
                                                        {restaurant.count} items
                                                    </Badge>
                                                </div>
                                                <Progress
                                                    value={restaurant.percentage}
                                                    className="h-2"
                                                    indicatorClassName={getBackgroundColor(index)}
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        <Building className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p>No restaurant data available</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Categories Tab */}
                <TabsContent value="categories" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <Package className="h-4 w-4 mr-2" />
                                Category Analysis
                            </CardTitle>
                            <CardDescription>
                                Distribution of your wishlist items by category
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {sortedCategories.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Categories Chart */}
                                    <div className="relative aspect-square">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="h-4/5 w-4/5 rounded-full bg-gray-100" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <Utensils className="h-8 w-8 text-gray-400 mb-1" />
                                                <span className="text-xl font-bold">{total_items}</span>
                                                <span className="text-xs text-gray-500">Total Items</span>
                                            </div>

                                            {/* Simulated pie chart segments */}
                                            {sortedCategories.slice(0, 5).map((category, index) => {
                                                const rotation = index * (360 / sortedCategories.length);
                                                const percentage = (category.percentage / 100) * 360;

                                                return (
                                                    <div
                                                        key={`pie-${index}`}
                                                        className="absolute inset-0 flex items-center justify-center"
                                                        style={{
                                                            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin(rotation * Math.PI / 180)}% ${50 - 50 * Math.cos(rotation * Math.PI / 180)}%)`
                                                        }}
                                                    >
                                                        <div
                                                            className={`h-4/5 w-4/5 rounded-full ${getCategoryColor(index)}`}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Categories List */}
                                    <div className="space-y-4">
                                        {sortedCategories.slice(0, 8).map((category, index) => (
                                            <div key={`cat-${index}`} className="flex items-center gap-3">
                                                <div className={`h-3 w-3 rounded-full ${getCategoryColor(index)}`} />
                                                <div className="flex-1 flex items-center justify-between">
                                                    <span className="font-medium">{category.name}</span>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {category.count}
                                                        </Badge>
                                                        <span className="text-xs text-gray-500">
                                                            {category.percentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {sortedCategories.length > 8 && (
                                            <div className="text-center text-sm text-gray-500 pt-2">
                                                +{sortedCategories.length - 8} more categories
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-500">
                                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No category data available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Pricing Tab */}
                <TabsContent value="pricing" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Price Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <BarChartIcon className="h-4 w-4 mr-2 text-blue-500" />
                                    Price Distribution
                                </CardTitle>
                                <CardDescription>
                                    Breakdown of your saved items by price range
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {formattedPrices.map((range, index) => (
                                        <div key={`price-${index}`} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span>{range.range}</span>
                                                <span className="text-gray-500">{range.percentage}%</span>
                                            </div>
                                            <Progress
                                                value={range.percentage}
                                                className="h-2"
                                                indicatorClassName="bg-blue-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 flex items-center justify-between text-sm">
                                    <div>
                                        <span className="text-gray-500">Average Price:</span>
                                        <span className="ml-2 font-semibold">{formattedAvgPrice}</span>
                                    </div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex items-center text-gray-500 cursor-help">
                                                    <Info className="h-3 w-3 mr-1" />
                                                    <span>What does this mean?</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs">
                                                <p className="text-xs">
                                                    This shows the distribution of prices across your saved items.
                                                    It helps you understand your spending preferences and identify potential deals.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Discount Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <BadgePercent className="h-4 w-4 mr-2 text-green-500" />
                                    Discount Analysis
                                </CardTitle>
                                <CardDescription>
                                    Distribution of discounts on your wishlist items
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 grid grid-cols-5 gap-2 items-end">
                                    {discount_distribution && discount_distribution.length > 0 ? (
                                        discount_distribution.map((item, index) => {
                                            const maxValue = Math.max(...discount_distribution.map(d => d.count));
                                            const height = maxValue > 0 ? (item.count / maxValue) * 100 : 0;

                                            return (
                                                <div key={`discount-${index}`} className="flex flex-col items-center">
                                                    <div
                                                        className="w-full bg-green-500 rounded-t-md relative group"
                                                        style={{
                                                            height: `${height}%`,
                                                            minHeight: '10px',
                                                            opacity: 0.6 + (item.discount_range / 100) * 0.4
                                                        }}
                                                    >
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="absolute inset-0" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="text-xs font-medium">
                                                                        {item.discount_range}% off: {item.count} items
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                    <div className="mt-2 text-xs">{item.discount_range}%</div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-5 flex items-center justify-center text-center text-gray-500">
                                            <div>
                                                <BadgePercent className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p>No discount data available</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 text-center text-sm text-gray-500">
                                    {price_drops > 0 ? (
                                        <span>
                                            <span className="text-green-500 font-medium">{price_drops}</span> items have price drops
                                        </span>
                                    ) : (
                                        <span>No items currently have price drops</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

// Helper functions for colors
const getBackgroundColor = (index) => {
    const colors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-amber-500",
        "bg-purple-500",
        "bg-red-500",
        "bg-indigo-500",
        "bg-pink-500",
        "bg-teal-500",
    ];

    return colors[index % colors.length];
};

const getCategoryColor = (index) => {
    const colors = [
        "bg-blue-400",
        "bg-green-400",
        "bg-amber-400",
        "bg-purple-400",
        "bg-red-400",
        "bg-indigo-400",
        "bg-pink-400",
        "bg-teal-400",
        "bg-cyan-400",
        "bg-lime-400",
    ];

    return colors[index % colors.length];
};

const getRatingColor = (rating) => {
    switch (Math.floor(rating)) {
        case 5: return "bg-green-500";
        case 4: return "bg-emerald-500";
        case 3: return "bg-amber-500";
        case 2: return "bg-orange-500";
        case 1: return "bg-red-500";
        default: return "bg-gray-500";
    }
};

export default WishlistInsights; 