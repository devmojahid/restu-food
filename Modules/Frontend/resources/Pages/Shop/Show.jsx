import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    Heart,
    Share2,
    Minus,
    Plus,
    ChevronRight,
    AlertCircle,
    ShoppingBag,
    Truck,
    ShieldCheck,
    Tag,
    Clock,
    Sparkles,
    ArrowLeft,
    Check,
    RotateCcw,
    Info,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/Components/ui/scroll-area';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { cn } from '@/lib/utils';
import { useToast } from '@/Components/ui/use-toast';
import ProductGallery from './Partials/ProductGallery';
import ProductInfo from './Partials/ProductInfo';
import ProductFeatures from './Partials/ProductFeatures';
import RelatedProducts from './Partials/RelatedProducts';
import ReviewsSection from './Partials/ReviewsSection';
import ProductFAQs from './Partials/ProductFAQs';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Link } from '@inertiajs/react';

const Show = ({ product = null, relatedProducts = [], reviews = [], faqs = [] }) => {
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const { toast } = useToast();

    // Handle missing product
    if (!product || product.id === 0) {
        return (
            <Layout>
                <Head title="Product Not Found" />
                <div className="container mx-auto px-4 py-12">
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Product not found or has been removed.</AlertDescription>
                    </Alert>

                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
                        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-full"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Shop
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    // Set default variant if available
    useEffect(() => {
        if (product.variants && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product.variants]);

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    const calculatePrice = () => {
        let basePrice = selectedVariant ? selectedVariant.price : product.price;
        return product.on_sale
            ? product.sale_price || basePrice * (1 - product.discount_percentage / 100)
            : basePrice;
    };

    const handleAddToCart = async () => {
        setIsLoading(true);
        try {
            // In a real application, this would call an API endpoint
            // For demo purposes, we'll just simulate the API call
            await new Promise(resolve => setTimeout(resolve, 800));

            toast({
                title: "Added to Cart",
                description: (
                    <div className="flex items-center gap-2">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                        <div>
                            <p className="font-medium">{quantity}x {product.name}</p>
                            <p className="text-sm text-gray-500">Added to your cart</p>
                        </div>
                    </div>
                ),
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add item to cart. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast({
            title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
            description: `${product.name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist`,
        });
    };

    return (
        <Layout>
            <Head title={product.name} />

            {/* Breadcrumb navigation */}
            <div className="bg-gray-50 dark:bg-gray-900/50 py-3">
                <div className="container mx-auto px-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors">
                            {product.category}
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-gray-900 dark:text-white font-medium truncate">
                            {product.name}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
                    {/* Product gallery - left column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ProductGallery product={product} />
                    </motion.div>

                    {/* Product info - right column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col h-full"
                    >
                        <ProductInfo
                            product={product}
                            quantity={quantity}
                            onQuantityChange={handleQuantityChange}
                            onAddToCart={handleAddToCart}
                            onWishlistToggle={handleWishlist}
                            isWishlisted={isWishlisted}
                            isLoading={isLoading}
                            selectedVariant={selectedVariant}
                            onVariantChange={setSelectedVariant}
                            calculatedPrice={calculatePrice()}
                        />
                    </motion.div>
                </div>

                {/* Product details tabs */}
                <div className="mb-16">
                    <Tabs defaultValue="description" onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-8">
                            <TabsTrigger value="description">Description</TabsTrigger>
                            <TabsTrigger value="specifications">Specifications</TabsTrigger>
                            <TabsTrigger value="reviews">
                                Reviews ({reviews.length})
                            </TabsTrigger>
                            <TabsTrigger value="faqs">FAQs</TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="mt-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="mb-4">{product.long_description || product.description}</p>

                                    {product.features && product.features.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="text-lg font-medium mb-3">Key Features</h4>
                                            <ul className="space-y-2">
                                                {product.features.map((feature, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start"
                                                    >
                                                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <ProductFeatures product={product} />
                            </div>
                        </TabsContent>

                        <TabsContent value="specifications">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>

                                {product.specifications ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Object.entries(product.specifications).map(([key, value], index) => (
                                            <div
                                                key={index}
                                                className="border-b dark:border-gray-700 pb-3"
                                            >
                                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{key}</div>
                                                <div className="font-medium">{value}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No specifications available for this product.</p>
                                )}

                                {product.nutritional_info && (
                                    <div className="mt-8">
                                        <h4 className="text-lg font-medium mb-4">Nutritional Information</h4>
                                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {Object.entries(product.nutritional_info).map(([key, value], index) => (
                                                    <div key={index} className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">{key}</span>
                                                        <span className="font-medium">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="reviews">
                            <ReviewsSection reviews={reviews} productId={product.id} />
                        </TabsContent>

                        <TabsContent value="faqs">
                            <ProductFAQs faqs={faqs} productId={product.id} />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Related products */}
                {relatedProducts.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">You Might Also Like</h2>
                            <Link href="/shop" className="text-primary flex items-center hover:underline">
                                View All
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                        <RelatedProducts products={relatedProducts} />
                    </div>
                )}

                {/* Recently viewed products would go here */}

                {/* Back to shop button - Mobile Only */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 lg:hidden z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Total Price</span>
                            <span className="font-bold text-lg">${(calculatePrice() * quantity).toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={handleWishlist}
                            >
                                <Heart className={cn("w-5 h-5", isWishlisted && "fill-red-500 text-red-500")} />
                            </Button>
                            <Button
                                className="px-6"
                                onClick={handleAddToCart}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <ShoppingBag className="w-5 h-5 mr-2" />
                                        Add to Cart
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Show; 