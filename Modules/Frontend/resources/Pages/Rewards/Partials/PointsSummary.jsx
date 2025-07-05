import React from 'react';
import { motion } from 'framer-motion';
import {
    Award,
    ArrowUp,
    Calendar,
    Clock,
    TrendingUp,
    Zap,
    Plus,
    Minus,
    Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/Components/ui/progress';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/Components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

const PointsSummary = ({ data = {} }) => {
    const {
        currentPoints = 0,
        pointsToNextTier = 0,
        currentTier = 'Bronze',
        nextTier = 'Silver',
        lifetime = 0,
        pointsExpiring = { amount: 0, date: '' },
        memberSince = '',
        progress = 0,
        recentActivity = []
    } = data;

    // Ensure arrays
    const safeRecentActivity = Array.isArray(recentActivity) ? recentActivity : [];

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
        <section id="points-summary" className="py-12 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Main Points Card */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-2"
                    >
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-primary/10 dark:bg-primary/5 pb-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl">Your Rewards</CardTitle>
                                        <CardDescription>
                                            {currentTier} member since {formatDate(memberSince)}
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Lifetime Points
                                        </span>
                                        <div className="flex items-center gap-1 font-medium">
                                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                            {lifetime.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6">
                                <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-12 mb-8">
                                    {/* Current Points */}
                                    <div className="flex-1">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                                            Current Points Balance
                                        </span>
                                        <div className="flex items-baseline mt-1">
                                            <span className="text-4xl font-bold">
                                                {currentPoints.toLocaleString()}
                                            </span>
                                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                                points
                                            </span>
                                        </div>
                                        {pointsExpiring?.amount > 0 && (
                                            <div className="mt-2 text-sm text-amber-600 dark:text-amber-400 flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span>
                                                    {pointsExpiring.amount} points expiring on {formatDate(pointsExpiring.date)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Next Tier Progress */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                Progress to {nextTier}
                                            </span>
                                            <span className="text-sm font-medium">
                                                {progress}%
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <Progress value={progress} className="h-2" />
                                        </div>
                                        <div className="mt-2 flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-1">
                                                <Award className="w-4 h-4 text-primary" />
                                                <span>{currentTier}</span>
                                            </div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                {pointsToNextTier} points to go
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Award className="w-4 h-4 text-yellow-500" />
                                                <span>{nextTier}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <Button asChild>
                                        <Link href="/rewards/redeem">
                                            Redeem Points
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/rewards/history">
                                            View History
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/rewards/refer">
                                            Refer a Friend
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Recent Activity Card */}
                    <motion.div variants={itemVariants}>
                        <Card className="h-full">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Recent Activity</CardTitle>
                                        <CardDescription>Your latest points transactions</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/rewards/history">View All</Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {safeRecentActivity.length > 0 ? (
                                        safeRecentActivity.map((activity, index) => (
                                            <div
                                                key={activity.id || index}
                                                className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={cn(
                                                        "mt-1 w-8 h-8 rounded-full flex items-center justify-center",
                                                        activity.type === 'earned'
                                                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                                            : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                                    )}>
                                                        {activity.type === 'earned' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{activity.description}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {formatDate(activity.date)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={cn(
                                                    "font-semibold",
                                                    activity.type === 'earned'
                                                        ? "text-green-600 dark:text-green-400"
                                                        : "text-amber-600 dark:text-amber-400"
                                                )}>
                                                    {activity.type === 'earned' ? '+' : '-'}{activity.points}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>No recent activity</p>
                                            <p className="text-sm mt-1">Start earning points with your next order!</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default PointsSummary; 