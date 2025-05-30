import React from 'react';
import { motion } from 'framer-motion';
import {
    LineChart,
    BarChart,
    PieChart,
    TrendingUp,
    Clock,
    Heart,
    Leaf,
    Award,
    ThumbsUp,
    Calendar,
    Utensils,
    Wine,
    IceCream
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";

const InsightsSection = ({ insights }) => {
    if (!insights) {
        return null;
    }

    const {
        mostOrderedDishes = [],
        peakHours = {},
        customerFavorites = {},
        sustainability = {}
    } = insights;

    return (
        <section className="py-16">
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center mb-4"
                >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <LineChart className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">Restaurant Insights</h2>
                </motion.div>
                <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                >
                    Discover the unique patterns and favorites that make this restaurant special
                </motion.p>
            </div>

            <Tabs defaultValue="favorites" className="w-full">
                <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 mb-8">
                    <TabsTrigger value="favorites" className="flex flex-col items-center p-3 gap-2">
                        <Heart className="h-4 w-4" />
                        <span className="text-xs">Favorites</span>
                    </TabsTrigger>
                    <TabsTrigger value="popular" className="flex flex-col items-center p-3 gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs">Popular</span>
                    </TabsTrigger>
                    <TabsTrigger value="timing" className="flex flex-col items-center p-3 gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs">Timing</span>
                    </TabsTrigger>
                    <TabsTrigger value="sustainability" className="flex flex-col items-center p-3 gap-2">
                        <Leaf className="h-4 w-4" />
                        <span className="text-xs">Eco-Friendly</span>
                    </TabsTrigger>
                </TabsList>

                {/* Customer Favorites Tab */}
                <TabsContent value="favorites">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FavoritesCard
                            title="Top Dishes"
                            items={customerFavorites?.dishes || []}
                            icon={<Utensils className="h-5 w-5" />}
                            className="bg-gradient-to-br from-orange-50 to-white dark:from-gray-800 dark:to-gray-900"
                        />
                        <FavoritesCard
                            title="Wine Selection"
                            items={customerFavorites?.wines || []}
                            icon={<Wine className="h-5 w-5" />}
                            className="bg-gradient-to-br from-red-50 to-white dark:from-gray-800 dark:to-gray-900"
                        />
                        <FavoritesCard
                            title="Dessert Picks"
                            items={customerFavorites?.desserts || []}
                            icon={<IceCream className="h-5 w-5" />}
                            className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900"
                        />
                    </div>
                </TabsContent>

                {/* Most Popular Tab */}
                <TabsContent value="popular">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <BarChart className="h-5 w-5 text-primary mr-2" />
                                <h3 className="text-lg font-semibold">Most Ordered Dishes</h3>
                            </div>
                            <div className="space-y-4">
                                {mostOrderedDishes.map((dish, index) => (
                                    <div key={index} className="relative">
                                        <div className="flex items-center mb-2">
                                            <Badge variant="outline" className="mr-2 bg-primary/10">
                                                #{index + 1}
                                            </Badge>
                                            <span className="font-medium">{dish}</span>
                                        </div>
                                        <Progress
                                            value={100 - (index * 20)}
                                            className="h-2"
                                            indicatorClassName={cn(
                                                index === 0 ? "bg-primary" :
                                                    index === 1 ? "bg-primary/80" :
                                                        "bg-primary/60"
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                                <p className="flex items-center">
                                    <ThumbsUp className="h-4 w-4 mr-2" />
                                    Based on orders from the last 3 months
                                </p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Peak Hours Tab */}
                <TabsContent value="timing">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center mb-6">
                                <Clock className="h-5 w-5 text-primary mr-2" />
                                <h3 className="text-lg font-semibold">Peak Hours</h3>
                            </div>
                            <div className="space-y-6">
                                <PeakHourCard
                                    day="Friday"
                                    hours={peakHours.friday || "N/A"}
                                    description="Perfect for dinner dates and social gatherings"
                                />
                                <PeakHourCard
                                    day="Saturday"
                                    hours={peakHours.saturday || "N/A"}
                                    description="Our busiest night with vibrant atmosphere"
                                />
                                <PeakHourCard
                                    day="Overall"
                                    hours={peakHours.overall || "N/A"}
                                    description="Reservation recommended during these hours"
                                    isHighlighted
                                />
                            </div>
                            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                                <p className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    For quieter dining, consider visiting outside these hours
                                </p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Sustainability Tab */}
                <TabsContent value="sustainability">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center mb-6">
                                <Leaf className="h-5 w-5 text-green-500 mr-2" />
                                <h3 className="text-lg font-semibold">Sustainability Commitment</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <SustainabilityCard
                                    title="Local Sourcing"
                                    percentage={sustainability.local_sourcing || 0}
                                    color="bg-green-500"
                                />
                                <SustainabilityCard
                                    title="Organic Ingredients"
                                    percentage={sustainability.organic_ingredients || 0}
                                    color="bg-blue-500"
                                />
                                <SustainabilityCard
                                    title="Waste Reduction"
                                    percentage={sustainability.waste_reduction || 0}
                                    color="bg-amber-500"
                                />
                            </div>

                            <div className="mt-6">
                                <h4 className="text-sm font-medium mb-3 flex items-center">
                                    <Award className="h-4 w-4 mr-2 text-primary" />
                                    Sustainability Partnerships
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {(sustainability.partnerships || []).map((partner, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                                        >
                                            {partner}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </section>
    );
};

const FavoritesCard = ({ title, items = [], icon, className }) => {
    return (
        <Card className={cn("overflow-hidden h-full", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                    {icon}
                    <span className="ml-2">{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <Badge
                                className={cn(
                                    "mr-3 h-6 w-6 rounded-full p-0 flex items-center justify-center",
                                    index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                )}
                            >
                                {index + 1}
                            </Badge>
                            <span className={cn(
                                "font-medium",
                                index === 0 && "text-primary"
                            )}>
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const PeakHourCard = ({ day, hours, description, isHighlighted = false }) => {
    return (
        <div className={cn(
            "rounded-lg p-4",
            isHighlighted
                ? "bg-primary/10 border border-primary/20"
                : "bg-gray-50 dark:bg-gray-700/30"
        )}>
            <div className="flex justify-between items-start mb-2">
                <h4 className={cn(
                    "font-semibold",
                    isHighlighted && "text-primary"
                )}>
                    {day}
                </h4>
                <Badge className={cn(
                    isHighlighted
                        ? "bg-primary"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                )}>
                    {hours}
                </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    );
};

const SustainabilityCard = ({ title, percentage, color }) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">{title}</h4>
            <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2" indicatorClassName={color} />
        </div>
    );
};

export default InsightsSection;