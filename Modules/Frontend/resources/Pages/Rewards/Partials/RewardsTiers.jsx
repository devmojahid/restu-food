import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Medal,
    Award,
    Gem,
    ChevronRight,
    ChevronDown,
    Check,
    Gift,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';
import { Badge } from '@/Components/ui/badge';

const RewardsTiers = ({ data = {} }) => {
    const {
        title = 'Loyalty Tiers',
        description = 'The more you order, the more benefits you unlock. Climb through our tiers for exclusive rewards and benefits.',
        tiers = []
    } = data;

    // Ensure tiers is an array
    const safeTiers = Array.isArray(tiers) ? tiers : [];

    // Default tiers if none provided
    const defaultTiers = [
        {
            name: 'Bronze',
            icon: 'Medal',
            pointsRequired: 0,
            color: 'from-amber-700 to-amber-500',
            benefits: [
                'Earn 1 point per $1 spent',
                'Birthday bonus points',
                'Monthly newsletters with exclusive offers',
            ],
            image: 'https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
        },
        {
            name: 'Silver',
            icon: 'Medal',
            pointsRequired: 500,
            color: 'from-gray-400 to-gray-300',
            benefits: [
                'All Bronze benefits',
                'Earn 1.25 points per $1 spent',
                'Free delivery once a month',
                'Early access to new menu items',
            ],
            image: 'https://images.unsplash.com/photo-1551286923-c82d6a8ae079?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
        },
        {
            name: 'Gold',
            icon: 'Award',
            pointsRequired: 1000,
            color: 'from-yellow-500 to-yellow-300',
            benefits: [
                'All Silver benefits',
                'Earn 1.5 points per $1 spent',
                'Free delivery on all orders',
                'Monthly free appetizer',
                'Priority customer support',
            ],
            image: 'https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
        },
        {
            name: 'Platinum',
            icon: 'Gem',
            pointsRequired: 2500,
            color: 'from-indigo-600 to-indigo-400',
            benefits: [
                'All Gold benefits',
                'Earn 2 points per $1 spent',
                'Free delivery on all orders',
                'Quarterly $25 reward credit',
                'Exclusive tasting events',
                'Dedicated concierge service',
            ],
            image: 'https://images.unsplash.com/photo-1551807501-9faaf45137a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
        }
    ];

    // Use provided tiers or fallback to defaults
    const displayTiers = safeTiers.length > 0 ? safeTiers : defaultTiers;

    // State for the active/expanded tier in mobile view
    const [activeTier, setActiveTier] = useState(0);

    // Helper function to render the correct icon
    const getIconComponent = (iconName) => {
        const icons = {
            'Medal': Medal,
            'Award': Award,
            'Gem': Gem
        };

        const IconComponent = icons[iconName] || Medal;
        return <IconComponent className="h-6 w-6" />;
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
                        Exclusive Benefits
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

                {/* Desktop Tiers */}
                <div className="hidden lg:block">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-4 gap-6"
                    >
                        {displayTiers.map((tier, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="h-full"
                            >
                                <div className={cn(
                                    "h-full rounded-2xl overflow-hidden bg-white dark:bg-gray-800",
                                    "border border-gray-100 dark:border-gray-700",
                                    "shadow-lg hover:shadow-xl transition-all duration-300",
                                    "flex flex-col"
                                )}>
                                    {/* Tier Header */}
                                    <div className={cn(
                                        "relative py-8 px-6 text-center text-white",
                                        "bg-gradient-to-br",
                                        tier.color || "from-primary to-primary-600"
                                    )}>
                                        {/* Shimmer Effect */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            <div className="absolute -inset-[10%] top-0 bg-white/20 
                                                          rotate-12 transform skew-x-12 w-1/3 h-full 
                                                          translate-x-[-200%] animate-[shimmer_4s_infinite]" />
                                        </div>

                                        <div className="relative">
                                            <div className="mx-auto mb-4 w-16 h-16 rounded-full 
                                                         bg-white/20 backdrop-blur-sm flex items-center 
                                                         justify-center">
                                                {typeof tier.icon === 'string'
                                                    ? getIconComponent(tier.icon)
                                                    : tier.icon || <Medal className="h-6 w-6" />}
                                            </div>
                                            <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                                            <div className="text-white/80">
                                                {tier.pointsRequired > 0
                                                    ? `${tier.pointsRequired.toLocaleString()}+ points`
                                                    : 'Starting tier'}
                                            </div>

                                            {/* Current Tier Badge */}
                                            {index === 1 && (
                                                <div className="absolute top-3 right-3 bg-white text-primary 
                                                             px-3 py-1 rounded-full text-xs font-bold">
                                                    Your Tier
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Benefits */}
                                    <div className="flex-1 p-6">
                                        <h4 className="font-semibold mb-4">Benefits</h4>
                                        <ul className="space-y-3">
                                            {tier.benefits?.map((benefit, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5 mr-3" />
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {benefit}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* CTA */}
                                    <div className="p-6 pt-0">
                                        {tier.pointsRequired === 0 ? (
                                            <Button asChild className="w-full">
                                                <Link href="/rewards/register">Join Now</Link>
                                            </Button>
                                        ) : index === 1 ? (
                                            <Badge className="w-full flex justify-center py-2 bg-primary/20 text-primary">
                                                Current Tier
                                            </Badge>
                                        ) : (
                                            <Button variant="outline" asChild className="w-full">
                                                <Link href={`/rewards/upgrade/${tier.name.toLowerCase()}`}>
                                                    Upgrade to {tier.name}
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Mobile Accordion View */}
                <div className="lg:hidden space-y-4">
                    {displayTiers.map((tier, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <div
                                className={cn(
                                    "rounded-xl overflow-hidden bg-white dark:bg-gray-800",
                                    "border border-gray-100 dark:border-gray-700",
                                    "shadow-md transition-all duration-300",
                                    activeTier === index ? "shadow-lg" : ""
                                )}
                            >
                                {/* Accordion Header */}
                                <button
                                    onClick={() => setActiveTier(activeTier === index ? -1 : index)}
                                    className={cn(
                                        "w-full text-left p-4 flex items-center justify-between",
                                        "bg-gradient-to-br text-white",
                                        tier.color || "from-primary to-primary-600"
                                    )}
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-white/20 
                                                     flex items-center justify-center mr-3">
                                            {typeof tier.icon === 'string'
                                                ? getIconComponent(tier.icon)
                                                : tier.icon || <Medal className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{tier.name}</h3>
                                            <div className="text-sm text-white/80">
                                                {tier.pointsRequired > 0
                                                    ? `${tier.pointsRequired.toLocaleString()}+ points`
                                                    : 'Starting tier'}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronDown className={cn(
                                        "w-5 h-5 transition-transform",
                                        activeTier === index ? "rotate-180" : ""
                                    )} />
                                </button>

                                {/* Accordion Content */}
                                <AnimatePresence initial={false}>
                                    {activeTier === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4">
                                                <h4 className="font-semibold mb-4">Benefits</h4>
                                                <ul className="space-y-3">
                                                    {tier.benefits?.map((benefit, idx) => (
                                                        <li key={idx} className="flex items-start">
                                                            <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5 mr-3" />
                                                            <span className="text-gray-600 dark:text-gray-400">
                                                                {benefit}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <div className="mt-6">
                                                    {tier.pointsRequired === 0 ? (
                                                        <Button asChild className="w-full">
                                                            <Link href="/rewards/register">Join Now</Link>
                                                        </Button>
                                                    ) : index === 1 ? (
                                                        <Badge className="w-full flex justify-center py-2 bg-primary/20 text-primary">
                                                            Current Tier
                                                        </Badge>
                                                    ) : (
                                                        <Button variant="outline" asChild className="w-full">
                                                            <Link href={`/rewards/upgrade/${tier.name.toLowerCase()}`}>
                                                                Upgrade to {tier.name}
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="max-w-3xl mx-auto mt-16 text-center"
                >
                    <div className="bg-primary/10 dark:bg-primary/5 rounded-2xl p-6 md:p-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3">Unlock Premium Benefits</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
                            Start earning points today to climb tiers and unlock exclusive rewards. The more you order, the more benefits you'll enjoy.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild>
                                <Link href="/rewards/register" className="flex items-center gap-2">
                                    <Gift className="w-5 h-5" />
                                    <span>Join Rewards Program</span>
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/rewards/calculator" className="flex items-center">
                                    <span>Points Calculator</span>
                                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default RewardsTiers; 