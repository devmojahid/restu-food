import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Truck,
    Tag,
    Utensils,
    Coffee,
    Gift,
    Heart,
    Award,
    Search,
    Filter,
    ArrowUpDown,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/Components/ui/select";
import { Link } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";

const AvailableRewards = ({ data = {} }) => {
    const {
        title = 'Available Rewards',
        description = 'Redeem your points for these exclusive rewards. From free deliveries to discounts and special offers.',
        rewards = [],
        categories = []
    } = data;

    // Ensure arrays
    const safeRewards = Array.isArray(rewards) ? rewards : [];
    const safeCategories = Array.isArray(categories) ? categories : [];

    // Default rewards if none provided
    const defaultRewards = [
        {
            id: 1,
            title: 'Free Delivery',
            description: 'Get free delivery on your next order',
            points: 300,
            category: 'delivery',
            image: '/images/rewards/delivery.jpg',
            featured: true,
            discountType: 'delivery'
        },
        {
            id: 2,
            title: 'Free Appetizer',
            description: 'Choose any appetizer for free with your meal',
            points: 500,
            category: 'food',
            image: '/images/rewards/appetizer.jpg',
            featured: false,
            discountType: 'item'
        },
        {
            id: 3,
            title: '$10 Off Your Order',
            description: '$10 discount on your next order',
            points: 800,
            category: 'discount',
            image: '/images/rewards/discount.jpg',
            featured: true,
            discountType: 'amount'
        },
        {
            id: 4,
            title: 'Free Dessert',
            description: 'Choose any dessert for free with your meal',
            points: 400,
            category: 'food',
            image: '/images/rewards/dessert.jpg',
            featured: false,
            discountType: 'item'
        },
        {
            id: 5,
            title: '15% Off Your Order',
            description: '15% discount on your next order',
            points: 1000,
            category: 'discount',
            image: '/images/rewards/percentage.jpg',
            featured: false,
            discountType: 'percentage'
        },
        {
            id: 6,
            title: 'Free Drink',
            description: 'Get a free drink with your meal',
            points: 300,
            category: 'food',
            image: '/images/rewards/drink.jpg',
            featured: false,
            discountType: 'item'
        },
        {
            id: 7,
            title: 'Priority Delivery',
            description: 'Get priority delivery on your next 3 orders',
            points: 600,
            category: 'delivery',
            image: '/images/rewards/priority.jpg',
            featured: false,
            discountType: 'service'
        },
        {
            id: 8,
            title: 'Birthday Special',
            description: 'Special birthday treat on your next order',
            points: 1200,
            category: 'special',
            image: '/images/rewards/birthday.jpg',
            featured: true,
            discountType: 'bundle'
        }
    ];

    // Default categories if none provided
    const defaultCategories = [
        { id: 'all', name: 'All Rewards' },
        { id: 'delivery', name: 'Delivery' },
        { id: 'food', name: 'Food & Drinks' },
        { id: 'discount', name: 'Discounts' },
        { id: 'special', name: 'Special Offers' }
    ];

    // Use provided data or fallback to defaults
    const displayRewards = safeRewards.length > 0 ? safeRewards : defaultRewards;
    const displayCategories = safeCategories.length > 0 ? safeCategories : defaultCategories;

    // States for filtering and sorting
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('featured');

    // Helper function to get icon component based on category or discount type
    const getRewardIcon = (reward) => {
        const { category, discountType } = reward;

        if (category === 'delivery' || discountType === 'delivery') return Truck;
        if (category === 'food' || discountType === 'item') return Utensils;
        if (category === 'discount') {
            if (discountType === 'amount') return Tag;
            if (discountType === 'percentage') return Tag;
        }
        if (category === 'special') return Gift;

        return ShoppingBag;
    };

    // Filter rewards based on category and search
    const filteredRewards = displayRewards.filter(reward => {
        const matchesCategory = activeCategory === 'all' || reward.category === activeCategory;
        const matchesSearch = !searchQuery ||
            reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reward.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    // Sort filtered rewards
    const sortedRewards = [...filteredRewards].sort((a, b) => {
        switch (sortOption) {
            case 'featured':
                return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
            case 'points-low':
                return a.points - b.points;
            case 'points-high':
                return b.points - a.points;
            case 'alphabetical':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center rounded-full px-4 py-1 mb-4 
                                 bg-primary/10 text-primary text-sm font-medium"
                    >
                        Redeem Points
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400"
                    >
                        {description}
                    </motion.p>
                </div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                placeholder="Search rewards..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex space-x-2 items-center">
                            <Filter className="text-gray-400 h-4 w-4" />
                            <Select
                                value={activeCategory}
                                onValueChange={setActiveCategory}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {displayCategories.map(category => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort */}
                        <div className="flex space-x-2 items-center">
                            <ArrowUpDown className="text-gray-400 h-4 w-4" />
                            <Select
                                value={sortOption}
                                onValueChange={setSortOption}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="featured">Featured</SelectItem>
                                    <SelectItem value="points-low">Points: Low to High</SelectItem>
                                    <SelectItem value="points-high">Points: High to Low</SelectItem>
                                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </motion.div>

                {/* Category Pills (visible on larger screens) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="hidden md:flex flex-wrap gap-2 mb-8"
                >
                    {displayCategories.map(category => (
                        <Button
                            key={category.id}
                            variant={activeCategory === category.id ? "default" : "outline"}
                            size="sm"
                            className="rounded-full"
                            onClick={() => setActiveCategory(category.id)}
                        >
                            {category.name}
                        </Button>
                    ))}
                </motion.div>

                {/* Rewards Grid */}
                {sortedRewards.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {sortedRewards.map((reward, index) => {
                            const Icon = getRewardIcon(reward);

                            return (
                                <motion.div
                                    key={reward.id}
                                    variants={itemVariants}
                                    className="h-full"
                                >
                                    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                            {/* Default gradient background as fallback */}
                                            <div className={cn(
                                                "absolute inset-0 bg-gradient-to-br",
                                                reward.category === 'delivery' ? "from-blue-500 to-blue-700" :
                                                    reward.category === 'food' ? "from-green-500 to-green-700" :
                                                        reward.category === 'discount' ? "from-amber-500 to-amber-700" :
                                                            reward.category === 'special' ? "from-purple-500 to-purple-700" :
                                                                "from-primary to-primary-600"
                                            )} />

                                            {/* Image if available */}
                                            {reward.image && (
                                                <img
                                                    src={reward.image}
                                                    alt={reward.title}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            )}

                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-black/20" />

                                            {/* Category Badge */}
                                            <Badge className="absolute top-4 left-4 capitalize bg-white/90 text-gray-800 font-medium">
                                                {reward.category}
                                            </Badge>

                                            {/* Featured Badge */}
                                            {reward.featured && (
                                                <Badge className="absolute top-4 right-4 bg-yellow-500/90 text-white">
                                                    Featured
                                                </Badge>
                                            )}

                                            {/* Points */}
                                            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                {reward.points} Points
                                            </div>
                                        </div>

                                        <CardHeader className="pb-2">
                                            <div className="flex items-start gap-2">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                                                    <CardDescription className="line-clamp-2">
                                                        {reward.description}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardFooter className="pt-0">
                                            <Button asChild className="w-full">
                                                <Link href={`/rewards/${reward.id}`} className="inline-flex items-center group">
                                                    <span>Redeem Now</span>
                                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center py-12"
                    >
                        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Rewards Found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            No rewards match your current filters. Try adjusting your search or category selection.
                        </p>
                        <Button onClick={() => {
                            setActiveCategory('all');
                            setSearchQuery('');
                            setSortOption('featured');
                        }}>
                            Clear Filters
                        </Button>
                    </motion.div>
                )}

                {/* More Rewards Link */}
                {sortedRewards.length > 0 && sortedRewards.length < displayRewards.length && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="text-center mt-12"
                    >
                        <Button variant="outline" asChild>
                            <Link href="/rewards/catalog" className="inline-flex items-center group">
                                <span>View All Rewards</span>
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default AvailableRewards; 