import React from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    CalendarDays,
    Cake,
    Users,
    Truck,
    Utensils,
    Tag,
    ShoppingBag,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";

const RewardsProgram = ({ data = {} }) => {
    const {
        title = 'Earn & Redeem',
        description = 'Our loyalty program rewards you for every order. Earn points and redeem them for exclusive rewards.',
        earnRules = [],
        redeemOptions = []
    } = data;

    // Ensure arrays
    const safeEarnRules = Array.isArray(earnRules) ? earnRules : [];
    const safeRedeemOptions = Array.isArray(redeemOptions) ? redeemOptions : [];

    // Default options if none provided
    const defaultEarnRules = [
        {
            title: 'Earn 1 Point',
            description: 'For every $1 spent on orders',
            icon: 'DollarSign'
        },
        {
            title: 'Bonus Points',
            description: '2x points on weekend orders',
            icon: 'CalendarDays'
        },
        {
            title: 'Birthday Bonus',
            description: '500 points on your birthday',
            icon: 'Cake'
        },
        {
            title: 'Referral Bonus',
            description: '300 points for each friend referral',
            icon: 'Users'
        }
    ];

    const defaultRedeemOptions = [
        {
            title: 'Free Delivery',
            description: 'No delivery fee on your next order',
            points: 300,
            icon: 'Truck'
        },
        {
            title: 'Free Appetizer',
            description: 'Choose any appetizer for free',
            points: 500,
            icon: 'Utensils'
        },
        {
            title: '$10 Discount',
            description: 'Get $10 off your next order',
            points: 800,
            icon: 'Tag'
        },
        {
            title: 'Free Meal',
            description: 'Get any meal up to $25 for free',
            points: 2000,
            icon: 'ShoppingBag'
        }
    ];

    // Use provided options or fallback to defaults
    const displayEarnRules = safeEarnRules.length > 0 ? safeEarnRules : defaultEarnRules;
    const displayRedeemOptions = safeRedeemOptions.length > 0 ? safeRedeemOptions : defaultRedeemOptions;

    // Helper function to get icon component based on icon name string
    const getIconComponent = (iconName) => {
        const icons = {
            'DollarSign': DollarSign,
            'CalendarDays': CalendarDays,
            'Cake': Cake,
            'Users': Users,
            'Truck': Truck,
            'Utensils': Utensils,
            'Tag': Tag,
            'ShoppingBag': ShoppingBag
        };

        const IconComponent = icons[iconName] || DollarSign;
        return <IconComponent className="h-5 w-5" />;
    };

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
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
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
                        Points Program
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

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="max-w-5xl mx-auto"
                >
                    <Tabs defaultValue="earn" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="earn">How to Earn Points</TabsTrigger>
                            <TabsTrigger value="redeem">How to Redeem Points</TabsTrigger>
                        </TabsList>

                        {/* Earn Points Content */}
                        <TabsContent value="earn">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            >
                                {displayEarnRules.map((rule, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        className="h-full"
                                    >
                                        <Card className="h-full hover:shadow-lg transition-shadow">
                                            <CardHeader className="pb-4">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                                                    {typeof rule.icon === 'string'
                                                        ? getIconComponent(rule.icon)
                                                        : rule.icon || <DollarSign className="h-5 w-5" />}
                                                </div>
                                                <CardTitle>{rule.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {rule.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <div className="text-center mt-8">
                                <Button variant="outline" asChild>
                                    <Link href="/rewards/terms" className="inline-flex items-center group">
                                        <span>View Full Program Terms</span>
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </div>
                        </TabsContent>

                        {/* Redeem Points Content */}
                        <TabsContent value="redeem">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            >
                                {displayRedeemOptions.map((option, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        className="h-full"
                                    >
                                        <Card className="h-full hover:shadow-lg transition-shadow relative overflow-hidden group">
                                            {/* Background Pattern */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <CardHeader className="pb-4">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                                                    {typeof option.icon === 'string'
                                                        ? getIconComponent(option.icon)
                                                        : option.icon || <Tag className="h-5 w-5" />}
                                                </div>
                                                <CardTitle>{option.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                    {option.description}
                                                </p>
                                                <div className="inline-flex items-center rounded-full px-3 py-1 bg-primary/10 text-primary text-sm font-medium">
                                                    {option.points} Points
                                                </div>
                                            </CardContent>
                                            <CardFooter className="pt-0">
                                                <Button variant="ghost" className="p-0 h-auto text-primary" asChild>
                                                    <Link href={`/rewards/${index + 1}`} className="inline-flex items-center group">
                                                        <span>Redeem</span>
                                                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </Link>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <div className="text-center mt-8">
                                <Button variant="outline" asChild>
                                    <Link href="/rewards/catalog" className="inline-flex items-center group">
                                        <span>View All Rewards</span>
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </section>
    );
};

export default RewardsProgram; 