import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import {
    ArrowLeft,
    Clock,
    Calendar,
    Gift,
    CheckCircle,
    CopyIcon,
    Share2,
    Info,
    Truck,
    Tag,
    Utensils,
    ShoppingBag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import { Badge } from '@/Components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/Components/ui/alert";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";

const Show = ({ reward, userPoints = 1500, relatedRewards = [] }) => {
    // Handle null reward with default values
    const safeReward = reward || {
        id: 1,
        title: 'Free Delivery',
        description: 'Get free delivery on your next order',
        points: 300,
        category: 'delivery',
        image: '/images/rewards/delivery.jpg',
        featured: true,
        discountType: 'delivery',
        termsAndConditions: [
            'Valid for 30 days from redemption date',
            'Can be used once per order',
            'Not combinable with other promotions',
            'Applicable to orders over $15',
            'Delivery must be within 10 miles of restaurant location'
        ],
        expiryDays: 30,
        code: 'FREEDEL2023',
        howToUse: 'Enter the code at checkout to apply the free delivery to your order.',
        createdAt: '2023-10-01T00:00:00'
    };

    // Default related rewards if none provided
    const safeRelatedRewards = Array.isArray(relatedRewards) && relatedRewards.length > 0
        ? relatedRewards
        : [
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
            }
        ];

    // State for copied code notification
    const [codeCopied, setCodeCopied] = useState(false);

    // State for redemption success
    const [redeemed, setRedeemed] = useState(false);

    // Calculate if user has enough points
    const hasEnoughPoints = userPoints >= safeReward.points;

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

    // Get reward icon
    const RewardIcon = getRewardIcon(safeReward);

    // Form for reward redemption
    const { data, setData, post, processing } = useForm({
        rewardId: safeReward.id
    });

    // Handle reward redemption
    const handleRedeemReward = () => {
        post(route('frontend.rewards.redeem', { id: safeReward.id }), {
            onSuccess: () => {
                setRedeemed(true);
            }
        });
    };

    // Handle copy code
    const handleCopyCode = () => {
        if (safeReward.code) {
            navigator.clipboard.writeText(safeReward.code);
            setCodeCopied(true);
            setTimeout(() => setCodeCopied(false), 3000);
        }
    };

    return (
        <Layout>
            <Head title={`${safeReward.title} | Rewards`} />

            <div className="py-12">
                <div className="container mx-auto px-4">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/rewards" className="inline-flex items-center">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Rewards
                            </Link>
                        </Button>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Reward Image/Card */}
                        <div className="lg:col-span-2">
                            <Card className="overflow-hidden">
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    {/* Default gradient background as fallback */}
                                    <div className={cn(
                                        "absolute inset-0 bg-gradient-to-br",
                                        safeReward.category === 'delivery' ? "from-blue-500 to-blue-700" :
                                            safeReward.category === 'food' ? "from-green-500 to-green-700" :
                                                safeReward.category === 'discount' ? "from-amber-500 to-amber-700" :
                                                    safeReward.category === 'special' ? "from-purple-500 to-purple-700" :
                                                        "from-primary to-primary-600"
                                    )} />

                                    {/* Image if available */}
                                    {safeReward.image && (
                                        <img
                                            src={safeReward.image}
                                            alt={safeReward.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/20" />

                                    {/* Category Badge */}
                                    <Badge className="absolute top-4 left-4 capitalize bg-white/90 text-gray-800 font-medium">
                                        {safeReward.category}
                                    </Badge>

                                    {/* Featured Badge */}
                                    {safeReward.featured && (
                                        <Badge className="absolute top-4 right-4 bg-yellow-500/90 text-white">
                                            Featured
                                        </Badge>
                                    )}
                                </div>

                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <RewardIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl">{safeReward.title}</CardTitle>
                                            <CardDescription className="text-base mt-1">
                                                {safeReward.description}
                                            </CardDescription>
                                            <div className="flex items-center mt-3 gap-2">
                                                <Badge variant="outline" className="flex items-center gap-1">
                                                    <Gift className="h-3.5 w-3.5" />
                                                    <span>{safeReward.points} Points</span>
                                                </Badge>

                                                {safeReward.expiryDays && (
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span>Valid for {safeReward.expiryDays} days</span>
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <Tabs defaultValue="how-to-use" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="how-to-use">How to Use</TabsTrigger>
                                            <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="how-to-use" className="pt-4">
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold">How to Use This Reward</h3>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {safeReward.howToUse}
                                                </p>

                                                {safeReward.code && redeemed && (
                                                    <div className="mt-6">
                                                        <h4 className="text-sm font-semibold mb-2">Your Reward Code</h4>
                                                        <div className="flex">
                                                            <div className="flex-1 bg-gray-100 dark:bg-gray-800 py-2 px-4 rounded-l-md font-mono text-lg">
                                                                {safeReward.code}
                                                            </div>
                                                            <Button
                                                                className="rounded-l-none"
                                                                onClick={handleCopyCode}
                                                                variant={codeCopied ? "success" : "default"}
                                                            >
                                                                {codeCopied ? (
                                                                    <>
                                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                                        Copied!
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CopyIcon className="h-4 w-4 mr-2" />
                                                                        Copy
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                                            Enter this code during checkout to apply your reward.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="terms" className="pt-4">
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold">Terms & Conditions</h3>
                                                {safeReward.termsAndConditions && safeReward.termsAndConditions.length > 0 ? (
                                                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                                                        {safeReward.termsAndConditions.map((term, index) => (
                                                            <li key={index}>{term}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        No specific terms and conditions available for this reward.
                                                    </p>
                                                )}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>

                                {redeemed && (
                                    <CardFooter className="pt-0">
                                        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            <AlertTitle>Reward Redeemed!</AlertTitle>
                                            <AlertDescription>
                                                You have successfully redeemed this reward. Use the code above to apply your reward during checkout.
                                            </AlertDescription>
                                        </Alert>
                                    </CardFooter>
                                )}
                            </Card>
                        </div>

                        {/* Redemption Sidebar */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Redeem Reward</CardTitle>
                                    <CardDescription>
                                        Use your points to claim this reward
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {/* Points Required */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">Points Required</span>
                                                <span className="font-bold">{safeReward.points}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">Your Points</span>
                                                <span className="font-bold">{userPoints}</span>
                                            </div>
                                            <Progress
                                                value={Math.min((userPoints / safeReward.points) * 100, 100)}
                                                className="h-2 mt-2"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>0</span>
                                                <span>{safeReward.points}</span>
                                            </div>
                                        </div>

                                        {/* Points Status */}
                                        {!hasEnoughPoints ? (
                                            <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                                                <Info className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                <AlertTitle>Not Enough Points</AlertTitle>
                                                <AlertDescription>
                                                    You need {safeReward.points - userPoints} more points to redeem this reward.
                                                </AlertDescription>
                                            </Alert>
                                        ) : redeemed ? (
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                                </div>
                                                <h3 className="text-lg font-semibold mb-2">Reward Redeemed!</h3>
                                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                    This reward has been added to your account.
                                                </p>
                                                <Button asChild variant="outline" className="w-full">
                                                    <Link href="/rewards/history">
                                                        View My Rewards
                                                    </Link>
                                                </Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <Button
                                                    className="w-full"
                                                    disabled={processing || !hasEnoughPoints}
                                                    onClick={handleRedeemReward}
                                                >
                                                    Redeem for {safeReward.points} Points
                                                </Button>
                                                {hasEnoughPoints && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                                                        After redemption, you'll have {userPoints - safeReward.points} points remaining
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Expiry Info */}
                                        {safeReward.expiryDays && (
                                            <div className="flex items-start gap-2">
                                                <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Once redeemed, this reward will be valid for {safeReward.expiryDays} days.
                                                </div>
                                            </div>
                                        )}

                                        {/* Share */}
                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <Button variant="outline" className="w-full" asChild>
                                                <a
                                                    href={`mailto:?subject=Check out this reward!&body=I found this great reward: ${safeReward.title} - ${window.location.href}`}
                                                    target="_blank"
                                                >
                                                    <Share2 className="h-4 w-4 mr-2" />
                                                    Share this Reward
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Related Rewards */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {safeRelatedRewards.map((relatedReward) => {
                                const Icon = getRewardIcon(relatedReward);

                                return (
                                    <Card key={relatedReward.id} className="overflow-hidden">
                                        {/* Image */}
                                        <div className="relative h-40 overflow-hidden">
                                            {/* Default gradient background as fallback */}
                                            <div className={cn(
                                                "absolute inset-0 bg-gradient-to-br",
                                                relatedReward.category === 'delivery' ? "from-blue-500 to-blue-700" :
                                                    relatedReward.category === 'food' ? "from-green-500 to-green-700" :
                                                        relatedReward.category === 'discount' ? "from-amber-500 to-amber-700" :
                                                            relatedReward.category === 'special' ? "from-purple-500 to-purple-700" :
                                                                "from-primary to-primary-600"
                                            )} />

                                            {/* Image if available */}
                                            {relatedReward.image && (
                                                <img
                                                    src={relatedReward.image}
                                                    alt={relatedReward.title}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            )}

                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-black/20" />

                                            {/* Points */}
                                            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                {relatedReward.points} Points
                                            </div>
                                        </div>

                                        <CardHeader className="pb-2">
                                            <div className="flex items-start gap-2">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">{relatedReward.title}</CardTitle>
                                                    <CardDescription className="line-clamp-2">
                                                        {relatedReward.description}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardFooter className="pt-0">
                                            <Button asChild className="w-full">
                                                <Link href={`/rewards/${relatedReward.id}`}>
                                                    View Reward
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Show; 