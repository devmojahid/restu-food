import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BadgePercent,
    ChevronRight,
    Clock,
    Heart,
    ShoppingBag,
    ArrowRight,
    Tag,
    TrendingDown,
    AlertCircle,
    Bell,
    Timer,
    ChevronDown,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

const PriceDrops = ({
    items = [],
    showViewAll = true,
    fullWidth = false
}) => {
    const { toast } = useToast();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Handle add to cart
    const handleAddToCart = (itemId) => {
        setIsAddingToCart(true);

        router.post('/cart/add', {
            dish_id: itemId,
            quantity: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Added to cart",
                    description: "Item has been added to your cart",
                    action: (
                        <Link href="/cart" className="inline-flex items-center justify-center font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-3 text-xs">
                            View Cart
                        </Link>
                    ),
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Could not add item to cart. Please try again.",
                    variant: "destructive",
                });
            },
            onFinish: () => {
                setIsAddingToCart(false);
            }
        });
    };

    // Empty state
    if (items.length === 0) {
        return (
            <div className={cn(
                "rounded-lg border bg-card p-4 shadow-sm text-center",
                fullWidth ? "w-full" : ""
            )}>
                <div className="py-6">
                    <div className="rounded-full bg-amber-100 p-3 inline-flex mb-3">
                        <BadgePercent className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No Price Drops</h3>
                    <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">
                        We'll notify you when items in your wishlist go on sale.
                    </p>
                    <Button variant="outline" size="sm" className="rounded-full">
                        <Bell className="mr-2 h-3 w-3" />
                        Enable Notifications
                    </Button>
                </div>
            </div>
        );
    }

    // Content for sidebar (smaller version)
    if (!fullWidth) {
        return (
            <div className="rounded-lg border bg-card p-4 shadow-sm">
                <Collapsible
                    open={!isCollapsed}
                    onOpenChange={setIsCollapsed}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <BadgePercent className="h-4 w-4 text-green-500 mr-2" />
                            <h3 className="text-lg font-medium">Price Drops</h3>
                        </div>
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

                    <CollapsibleContent className="space-y-3">
                        {items.map((item, index) => (
                            <div
                                key={`price-drop-${item.id}-${index}`}
                                className="flex items-center gap-3 group rounded-lg border p-2 transition-colors hover:bg-accent/50"
                            >
                                {/* Item Image */}
                                <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Item Info */}
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/menu/${item.slug}`}
                                        className="line-clamp-1 font-medium text-sm group-hover:text-primary transition-colors"
                                    >
                                        {item.name}
                                    </Link>

                                    <div className="flex items-center justify-between mt-0.5">
                                        <div className="flex items-center">
                                            <span className="text-green-600 font-medium text-sm">{formatCurrency(item.price)}</span>
                                            <span className="text-xs text-gray-500 line-through ml-1.5">
                                                {formatCurrency(item.original_price)}
                                            </span>
                                        </div>

                                        <Badge className="bg-green-500 text-white text-xs">
                                            {item.discount}% OFF
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {showViewAll && items.length >= 3 && (
                            <Link
                                href="/price-drops"
                                className="flex items-center justify-center text-sm text-primary font-medium mt-2 hover:underline"
                            >
                                View all price drops
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                        )}
                    </CollapsibleContent>
                </Collapsible>
            </div>
        );
    }

    // Full width content with more details
    return (
        <div>
            {/* Section Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <BadgePercent className="h-5 w-5 text-green-500" />
                    <h2 className="text-2xl font-bold">Price Drops</h2>
                </div>
                <p className="text-gray-500 text-sm">
                    Items from your wishlist that are now available at a lower price
                </p>
            </div>

            {/* Price Drops Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => (
                    <PriceDropCard
                        key={`price-drop-card-${item.id}-${index}`}
                        item={item}
                        onAddToCart={handleAddToCart}
                        isAddingToCart={isAddingToCart}
                        index={index}
                    />
                ))}
            </div>

            {/* Price Drop Alert Banner */}
            <div className="mt-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="rounded-full bg-white/20 p-3">
                            <Bell className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-1">Get Price Drop Alerts</h3>
                            <p className="text-white/80">
                                Be notified immediately when items in your wishlist go on sale
                            </p>
                        </div>
                    </div>
                    <Button size="lg" className="whitespace-nowrap bg-white text-green-600 hover:bg-white/90">
                        Enable Notifications
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Price Drop Card Component
const PriceDropCard = ({
    item,
    onAddToCart,
    isAddingToCart,
    index
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate savings
    const savings = item.original_price - item.price;
    const savingsPercentage = Math.round((savings / item.original_price) * 100);

    // Format values
    const formattedCurrentPrice = formatCurrency(item.price);
    const formattedOriginalPrice = formatCurrency(item.original_price);
    const formattedSavings = formatCurrency(savings);

    // Get date of price drop
    const priceDropDate = item.price_drop_date
        ? formatDate(item.price_drop_date)
        : "Recently";

    // Get expiration date for the deal (if any)
    const expirationDate = item.deal_expiration
        ? formatDate(item.deal_expiration)
        : null;

    // Calculate days remaining if expiration date exists
    const daysRemaining = expirationDate
        ? Math.max(0, Math.ceil((new Date(item.deal_expiration) - new Date()) / (1000 * 60 * 60 * 24)))
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="overflow-hidden rounded-lg border bg-card shadow-sm hover:shadow-md transition-all"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                />

                {/* Sale Badge */}
                <div className="absolute left-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                    {savingsPercentage}% OFF
                </div>

                {/* Add to Cart Button */}
                <div className="absolute right-3 top-3">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToCart(item.id);
                        }}
                        disabled={isAddingToCart}
                    >
                        <ShoppingBag className="h-4 w-4 text-primary" />
                    </Button>
                </div>

                {/* Expiration Badge */}
                {expirationDate && (
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <Badge
                            variant="secondary"
                            className="bg-black/70 text-white backdrop-blur-sm gap-1"
                        >
                            <Timer className="h-3 w-3" />
                            {daysRemaining > 0
                                ? `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left`
                                : 'Ending today'
                            }
                        </Badge>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <Link href={`/menu/${item.slug}`}>
                    <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">
                        {item.name}
                    </h3>
                </Link>

                {item.restaurant && (
                    <div className="mt-1 text-sm text-gray-500">
                        <Link
                            href={`/restaurants/${item.restaurant.slug}`}
                            className="hover:text-primary transition-colors"
                        >
                            {item.restaurant.name}
                        </Link>
                    </div>
                )}

                {/* Price Comparison */}
                <div className="mt-3 space-y-2">
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="flex items-center">
                                <span className="text-xl font-bold text-green-600">{formattedCurrentPrice}</span>
                                <span className="ml-2 text-sm text-gray-500 line-through">{formattedOriginalPrice}</span>
                            </div>
                            <div className="mt-1 text-xs text-green-600">
                                You save {formattedSavings}
                            </div>
                        </div>

                        <div className="flex items-center text-xs text-gray-500">
                            <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                            <span>Price dropped {priceDropDate}</span>
                        </div>
                    </div>

                    {/* Price History */}
                    <Collapsible
                        open={isExpanded}
                        onOpenChange={setIsExpanded}
                    >
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-1 h-8 w-full justify-between rounded-md bg-muted/50 px-3 py-1 text-xs font-medium"
                            >
                                <span>Price History</span>
                                <ChevronDown
                                    className={cn(
                                        "h-4 w-4 transition-transform",
                                        isExpanded && "rotate-180"
                                    )}
                                />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2">
                            {item.price_history?.length > 0 ? (
                                <div className="space-y-2">
                                    {item.price_history.map((pricePoint, i) => (
                                        <div key={`history-${i}`} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center">
                                                <div
                                                    className={cn(
                                                        "h-2 w-2 rounded-full mr-2",
                                                        pricePoint.type === 'increase' ? "bg-red-500" : "bg-green-500"
                                                    )}
                                                />
                                                <span className="text-gray-600">{formatDate(pricePoint.date)}</span>
                                            </div>
                                            <div className="font-medium">
                                                {formatCurrency(pricePoint.price)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500 py-2">
                                    No price history available
                                </div>
                            )}
                        </CollapsibleContent>
                    </Collapsible>
                </div>

                {/* Action Button */}
                <div className="mt-4">
                    <Link href={`/menu/${item.slug}`}>
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                            View Deal
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
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

export default PriceDrops; 