import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import Hero from './Partials/Hero';
import PointsSummary from './Partials/PointsSummary';
import RewardsProgram from './Partials/RewardsProgram';
import RewardsTiers from './Partials/RewardsTiers';
import AvailableRewards from './Partials/AvailableRewards';
import PointsHistory from './Partials/PointsHistory';
import HowItWorks from './Partials/HowItWorks';
import Faq from './Partials/Faq';
import Testimonials from './Partials/Testimonials';
import StatsSection from './Partials/StatsSection';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Index = ({
    hero,
    pointsSummary,
    rewardsProgram,
    rewardsTiers,
    availableRewards,
    pointsHistory,
    howItWorks,
    faq,
    testimonials,
    stats,
    error = null,
    userAuthenticated = false
}) => {
    return (
        <Layout>
            <Head title="Rewards & Loyalty Program" />

            {/* Hero Section */}
            <Hero data={hero} />

            {/* Points Summary for authenticated users */}
            {userAuthenticated && <PointsSummary data={pointsSummary} />}

            {/* Error Alert if any */}
            {error && (
                <div className="container mx-auto px-4 py-6">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* How It Works */}
            <HowItWorks data={howItWorks} />

            {/* Rewards Program */}
            <RewardsProgram data={rewardsProgram} />

            {/* Rewards Tiers */}
            <RewardsTiers data={rewardsTiers} />

            {/* Available Rewards */}
            <AvailableRewards data={availableRewards} />

            {/* Stats Section */}
            <StatsSection data={stats} />

            {/* Points History for authenticated users */}
            {userAuthenticated && <PointsHistory data={pointsHistory} />}

            {/* Testimonials */}
            <Testimonials data={testimonials} />

            {/* FAQ Section */}
            <Faq data={faq} />
        </Layout>
    );
};

export default Index; 