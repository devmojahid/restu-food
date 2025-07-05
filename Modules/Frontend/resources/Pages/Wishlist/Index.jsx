import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import Layout from '../Frontend/Layout';
import Hero from './Partials/Hero';
import WishlistItems from './Partials/WishlistItems';
import WishlistCollections from './Partials/WishlistCollections';
import RecommendedItems from './Partials/RecommendedItems';
import WishlistStats from './Partials/WishlistStats';
import SimilarDishes from './Partials/SimilarDishes';
import EmptyWishlist from './Partials/EmptyWishlist';

const Index = ({ wishlist_items, collections, recommended_items, wishlist_stats, similar_dishes, hero, error }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [filteredItems, setFilteredItems] = useState(wishlist_items || []);

    // Filter items based on selected collection
    useEffect(() => {
        if (!wishlist_items) return;

        if (selectedCollection) {
            setFilteredItems(wishlist_items.filter(item =>
                item.collections?.some(col => col.id === selectedCollection.id)
            ));
        } else {
            setFilteredItems(wishlist_items);
        }
    }, [selectedCollection, wishlist_items]);

    // Handle removing an item from wishlist
    const handleRemoveItem = (itemId) => {
        setIsLoading(true);

        router.post(route('frontend.wishlist.remove'), { item_id: itemId }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsLoading(false);
            },
            onError: () => {
                setIsLoading(false);
            }
        });
    };

    // Handle moving an item to cart
    const handleMoveToCart = (itemId) => {
        setIsLoading(true);

        router.post(route('frontend.wishlist.move_to_cart'), { item_id: itemId }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsLoading(false);
            },
            onError: () => {
                setIsLoading(false);
            }
        });
    };

    // Handle clearing all items from wishlist
    const handleClearWishlist = () => {
        if (confirm('Are you sure you want to clear your wishlist?')) {
            setIsLoading(true);

            router.post(route('frontend.wishlist.clear'), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                }
            });
        }
    };

    // Helper function to check if wishlist is empty
    const isWishlistEmpty = !filteredItems || filteredItems.length === 0;

    return (
        <Layout>
            <Head title="Wishlist" />

            {/* Hero Section */}
            <Hero data={hero} />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 lg:py-12">
                {/* Error Alert */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-6"
                        >
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Loading Overlay */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
                        >
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex items-center space-x-4">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                <p className="text-gray-900 dark:text-white font-medium">Processing your request...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Sidebar - Collections & Stats */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Collections Section */}
                        <WishlistCollections
                            collections={collections || []}
                            activeCollection={selectedCollection}
                            setActiveCollection={setSelectedCollection}
                        />

                        {/* Stats Section */}
                        {!isWishlistEmpty && (
                            <WishlistStats stats={wishlist_stats} />
                        )}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 space-y-12">
                        {/* Wishlist Items or Empty State */}
                        {isWishlistEmpty ? (
                            <EmptyWishlist />
                        ) : (
                            <WishlistItems
                                items={filteredItems}
                                onRemoveItem={handleRemoveItem}
                                onMoveToCart={handleMoveToCart}
                                onClearWishlist={handleClearWishlist}
                                removeInProgress={isLoading}
                                moveToCartInProgress={isLoading}
                            />
                        )}

                        {/* Recommended Items */}
                        {recommended_items?.length > 0 && (
                            <RecommendedItems items={recommended_items} />
                        )}

                        {/* Similar Dishes */}
                        {similar_dishes?.length > 0 && (
                            <SimilarDishes items={similar_dishes} />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Index; 