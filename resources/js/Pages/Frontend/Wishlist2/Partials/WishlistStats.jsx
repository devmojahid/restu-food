import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    PieChart,
    BarChart,
    RefreshCw,
    ArrowUp,
    ArrowDown,
    Percent,
    DollarSign,
    Calendar,
    Clock,
    ChevronDown,
    Utensils,
    Building,
    Coffee,
    Flame,
    Info
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import { formatCurrency } from '@/lib/formatters';

const WishlistStats = ({ stats = {} }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Default stats if none provided
    const {
        total_value = 0,
        total_savings = 0,
        avg_price = 0,
        price_range = { min: 0, max: 0 },
        categories = [],
        restaurants = [],
        avg_rating = 0,
        in_stock_percentage = 0,
        added_last_week = 0,
        total_items = 0,
        price_drops = 0
    } = stats;

    // Format currency values
    const formattedTotalValue = formatCurrency(total_value);
    const formattedTotalSavings = formatCurrency(total_savings);
    const formattedAvgPrice = formatCurrency(avg_price);
    const formattedMinPrice = formatCurrency(price_range?.min || 0);
    const formattedMaxPrice = formatCurrency(price_range?.max || 0);

    // Calculate savings percentage
    const savingsPercentage = total_value > 0
        ? Math.round((total_savings / total_value) * 100)
        : 0;

    // Sort categories by count
    const sortedCategories = [...(categories || [])].sort((a, b) => b.count - a.count).slice(0, 3);

    // Sort restaurants by count
    const sortedRestaurants = [...(restaurants || [])].sort((a, b) => b.count - a.count).slice(0, 3);

    return (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
            {/* Header */}
            <Collapsible
                open={!isCollapsed}
                onOpenChange={setIsCollapsed}
                className="space-y-4"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Wishlist Insights</h3>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            {isCollapsed ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronUp className="h-4 w-4" />
                            )}
                        </Button>
                    </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="space-y-6">
                    {/* Main Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border bg-background p-3">
                            <div className="text-sm text-gray-500">Total Value</div>
                            <div className="text-xl font-semibold">{formattedTotalValue}</div>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                            <div className="text-sm text-gray-500">Saved</div>
                            <div className="text-xl font-semibold text-green-600">{formattedTotalSavings}</div>
                        </div>
                    </div>

                    {/* Savings Progress */}
                    {total_savings > 0 && (
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <div className="text-sm font-medium">Potential Savings</div>
                                <div className="text-sm font-medium text-green-600">{savingsPercentage}%</div>
                            </div>
                            <Progress value={savingsPercentage} className="h-2 bg-gray-200" indicatorClassName="bg-green-500" />
                        </div>
                    )}

                    {/* Price Distribution */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <div className="text-sm font-medium">Price Range</div>
                            <div className="text-xs text-gray-500">
                                Avg: <span className="font-medium">{formattedAvgPrice}</span>
                            </div>
                        </div>
                        <div className="relative h-8 rounded-full bg-gray-100">
                            {/* Price distribution visualization */}
                            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 text-xs">
                                <span>{formattedMinPrice}</span>
                                <span>{formattedMaxPrice}</span>
                            </div>
                            <div
                                className="absolute inset-y-0 w-1 bg-primary rounded-full transform translate-x-1/2"
                                style={{
                                    left: `${price_range?.max ? (avg_price / price_range.max) * 100 : 50}%`,
                                    display: price_range?.max ? 'block' : 'none'
                                }}
                            />
                        </div>
                    </div>

                    {/* Category & Restaurant Distribution */}
                    {sortedCategories.length > 0 && (
                        <div>
                            <div className="mb-2 text-sm font-medium">Top Categories</div>
                            <div className="space-y-2">
                                {sortedCategories.map((category, index) => (
                                    <div key={`category-${index}`}>
                                        <div className="flex items-center justify-between text-xs">
                                            <span>{category.name}</span>
                                            <span>{category.percentage}%</span>
                                        </div>
                                        <Progress
                                            value={category.percentage}
                                            className="h-1.5 bg-gray-200"
                                            indicatorClassName={`${getGradientColor(index)}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {sortedRestaurants.length > 0 && (
                        <div>
                            <div className="mb-2 text-sm font-medium">Top Restaurants</div>
                            <div className="space-y-2">
                                {sortedRestaurants.map((restaurant, index) => (
                                    <div key={`restaurant-${index}`} className="flex items-center space-x-2">
                                        <div className="h-8 w-8 rounded-md overflow-hidden flex-shrink-0">
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
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium truncate">{restaurant.name}</span>
                                                <span className="text-xs text-gray-500">{restaurant.count} items</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Activity */}
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Activity</div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center space-x-2 rounded-md border p-2">
                                <div className="rounded-full bg-blue-100 p-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium">{added_last_week}</div>
                                    <div className="text-xs text-gray-500">Added this week</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-2">
                                <div className="rounded-full bg-green-100 p-1.5">
                                    <Percent className="h-3.5 w-3.5 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium">{price_drops}</div>
                                    <div className="text-xs text-gray-500">Price drops</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                            <Flame className="h-3 w-3" />
                            <span>Rating: {avg_rating.toFixed(1)}/5</span>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center space-x-1 cursor-help">
                                        <Info className="h-3 w-3" />
                                        <span>Updated daily</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs">Statistics are calculated daily based on your wishlist items.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

// ChevronUp Icon Component
const ChevronUp = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="18 15 12 9 6 15" />
    </svg>
);

// Helper functions for colors
const getGradientColor = (index) => {
    const gradients = [
        "bg-gradient-to-r from-blue-500 to-indigo-500",
        "bg-gradient-to-r from-green-500 to-emerald-500",
        "bg-gradient-to-r from-amber-500 to-orange-500",
        "bg-gradient-to-r from-purple-500 to-pink-500",
        "bg-gradient-to-r from-red-500 to-rose-500",
    ];

    return gradients[index % gradients.length];
};

const getBackgroundColor = (index) => {
    const colors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-amber-500",
        "bg-purple-500",
        "bg-red-500",
    ];

    return colors[index % colors.length];
};

export default WishlistStats; 