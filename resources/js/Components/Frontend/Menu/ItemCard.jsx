import React from 'react';
import { motion } from 'framer-motion';
import { 
    Star, 
    Clock, 
    Heart,
    Plus,
    Info,
    Leaf,
    Flame,
    DollarSign,
    Sparkles
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import { useInView } from 'react-intersection-observer';

const ItemCard = ({ 
    item, 
    index, 
    isListView, 
    onAddToCart, 
    onQuickView, 
    onWishlist, 
    isWishlisted 
}) => {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    const renderBadges = () => (
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <AnimatePresence>
                {item.is_popular && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Badge className="bg-primary gap-1">
                            <Sparkles className="w-3 h-3" />
                            Popular
                        </Badge>
                    </motion.div>
                )}
                {item.is_new && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                    >
                        <Badge className="bg-green-500">New</Badge>
                    </motion.div>
                )}
                {item.discount && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="animate-pulse"
                    >
                        <Badge className="bg-red-500 gap-1">
                            <DollarSign className="w-3 h-3" />
                            {item.discount}% OFF
                        </Badge>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    const renderQuickActions = () => (
        <div className="absolute top-4 right-4 flex gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onWishlist(item.id)}
                        >
                            <Heart className={cn(
                                "w-4 h-4 transition-colors",
                                isWishlisted && "fill-current text-red-500"
                            )} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onQuickView(item)}
                        >
                            <Info className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Quick View
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );

    const renderMetaInfo = () => (
        <div className="flex items-center gap-4 mb-4 flex-wrap">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 text-sm font-medium">
                                {item.rating}
                            </span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{item.reviews_count} reviews</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="ml-1 text-sm">
                    {item.preparation_time}min
                </span>
            </div>

            {item.is_vegetarian && (
                <Badge variant="secondary" className="gap-1">
                    <Leaf className="w-3 h-3" />
                    Vegetarian
                </Badge>
            )}

            {item.is_spicy && (
                <Badge variant="secondary" className="gap-1">
                    <Flame className="w-3 h-3" />
                    Spicy
                </Badge>
            )}
        </div>
    );

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden",
                "border border-gray-200 dark:border-gray-700",
                "hover:shadow-lg transition-all duration-300",
                isListView ? "flex gap-6" : "flex flex-col"
            )}
        >
            {/* Image Section */}
            <div className={cn(
                "relative overflow-hidden",
                isListView ? "w-48 h-48" : "aspect-[4/3]"
            )}>
                <motion.img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {renderBadges()}
                {renderQuickActions()}

                {/* Mobile Quick Add Button */}
                <div className="md:hidden absolute bottom-4 right-4">
                    <Button
                        size="sm"
                        className="rounded-full shadow-lg"
                        onClick={() => onAddToCart(item)}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Content Section */}
            <div className={cn(
                "flex-1",
                isListView ? "py-4 pr-4" : "p-6"
            )}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <Link 
                            href={`/menu/${item.slug}`}
                            className="group-hover:text-primary transition-colors"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                {item.name}
                            </h3>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {item.description}
                        </p>
                    </div>
                    <div className="text-lg font-bold text-primary">
                        ${item.price}
                    </div>
                </div>

                {renderMetaInfo()}

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-2">
                    <Button
                        onClick={() => onAddToCart(item)}
                        className="flex-1"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Cart
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        asChild
                    >
                        <Link href={`/menu/${item.slug}`}>
                            <Info className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default ItemCard; 