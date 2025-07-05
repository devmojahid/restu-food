import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import Hero from './Partials/Hero';
import WishlistItems from './Partials/WishlistItems';
import WishlistCollections from './Partials/WishlistCollections';
import WishlistStats from './Partials/WishlistStats';
import EmptyWishlist from './Partials/EmptyWishlist';
import TrendingNow from './Partials/TrendingNow';
import RecentlyViewed from './Partials/RecentlyViewed';
import PriceDrops from './Partials/PriceDrops';
import WishlistInsights from './Partials/WishlistInsights';
import SimilarDishes from './Partials/SimilarDishes';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { Separator } from '@/Components/ui/separator';
import { useToast } from '@/Components/ui/use-toast';
import { router } from '@inertiajs/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LoadingSpinner } from '@/Components/ui/spinner';
import {
    Heart,
    Clock,
    PieChart,
    Grid3X3,
    ListFilter,
    AlertTriangle,
    Bookmark,
    Sparkles,
    TrendingUp,
    History,
    Tag,
    AlertCircle
} from 'lucide-react';

const Index = ({
    hero,
    wishlist_items = [],
    collections = [],
    recommended_items = [],
    similar_dishes = [],
    trending_now = [],
    recently_viewed = [],
    price_drops = [],
    wishlist_stats = {},
    error = null
}) => {
    const { toast } = useToast();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [activeTab, setActiveTab] = useState('wishlist');
    const [activeCollection, setActiveCollection] = useState(null);
    const [removeInProgress, setRemoveInProgress] = useState(false);
    const [moveToCartInProgress, setMoveToCartInProgress] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Display error toast if error is provided
    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            });
        }
    }, [error]);

    // Handle removing item from wishlist
    const handleRemoveItem = (itemId) => {
        setRemoveInProgress(true);

        router.delete('/wishlist2/remove', {
            data: { item_id: itemId },
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Removed from wishlist",
                    description: "Item has been removed from your wishlist",
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Could not remove item. Please try again.",
                    variant: "destructive",
                });
            },
            onFinish: () => {
                setRemoveInProgress(false);
            }
        });
    };

    // Handle moving item to cart
    const handleMoveToCart = (itemId) => {
        setMoveToCartInProgress(true);

        router.post('/wishlist2/move-to-cart', {
            item_id: itemId,
            quantity: 1
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Added to cart",
                    description: "Item has been added to your cart",
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
                setMoveToCartInProgress(false);
            }
        });
    };

    // Handle clearing wishlist
    const handleClearWishlist = () => {
        router.delete('/wishlist2/clear', {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Wishlist cleared",
                    description: "Your wishlist has been cleared",
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Could not clear wishlist. Please try again.",
                    variant: "destructive",
                });
            }
        });
    };

    // Filter wishlist items by collection
    const filteredItems = activeCollection
        ? wishlist_items.filter(item =>
            item.collection_id === activeCollection ||
            item.collections?.includes(activeCollection)
        )
        : wishlist_items;

    // Get active collection name
    const activeCollectionName = activeCollection
        ? collections.find(c => c.id === activeCollection)?.name
        : null;

    // Show toast for error if present
    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            });
        }
    }, [error, toast]);

    return (
        <Layout>
            <Head title={hero?.title || "Your Wishlist"} />

            {/* Hero Section */}
            <Hero data={hero} stats={wishlist_stats} />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8">
                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-3 space-y-6">
                            <WishlistCollections
                                collections={collections}
                                activeCollection={activeCollection}
                                setActiveCollection={setActiveCollection}
                            />

                            <WishlistStats stats={wishlist_stats} />

                            {price_drops.length > 0 && (
                                <PriceDrops items={price_drops} />
                            )}
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-9">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 md:w-auto">
                                    <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                                    <TabsTrigger value="insights">Insights</TabsTrigger>
                                    <TabsTrigger value="discover">Discover</TabsTrigger>
                                </TabsList>

                                {/* Wishlist Tab */}
                                <TabsContent value="wishlist" className="mt-6">
                                    <WishlistItems
                                        items={filteredItems}
                                        onRemoveItem={handleRemoveItem}
                                        onMoveToCart={handleMoveToCart}
                                        onClearWishlist={handleClearWishlist}
                                        removeInProgress={removeInProgress}
                                        moveToCartInProgress={moveToCartInProgress}
                                        collectionName={activeCollectionName}
                                    />
                                </TabsContent>

                                {/* Insights Tab */}
                                <TabsContent value="insights" className="mt-6">
                                    <WishlistInsights stats={wishlist_stats} />
                                </TabsContent>

                                {/* Discover Tab */}
                                <TabsContent value="discover" className="mt-6">
                                    <div className="space-y-12">
                                        {trending_now.length > 0 && (
                                            <TrendingNow items={trending_now} />
                                        )}

                                        {recommended_items.length > 0 && (
                                            <div className="mt-12 pt-4">
                                                <Separator className="mb-12" />
                                                <SimilarDishes items={recommended_items} />
                                            </div>
                                        )}

                                        {recently_viewed.length > 0 && (
                                            <div className="mt-12 pt-4">
                                                <Separator className="mb-12" />
                                                <RecentlyViewed items={recently_viewed} />
                                            </div>
                                        )}

                                        {price_drops.length > 0 && (
                                            <div className="mt-12 pt-4">
                                                <Separator className="mb-12" />
                                                <PriceDrops items={price_drops} fullWidth={true} showViewAll={false} />
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* Recommended Items Section */}
                    {similar_dishes.length > 0 && (
                        <div className="mt-12 pt-4">
                            <Separator className="mb-12" />
                            <SimilarDishes items={similar_dishes} />
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Index; 