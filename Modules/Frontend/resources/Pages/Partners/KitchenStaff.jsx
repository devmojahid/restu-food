import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import PartnerHero from './Partials/PartnerHero';
import BenefitsSection from './Partials/BenefitsSection';
import HowItWorksSection from './Partials/HowItWorksSection';
import RequirementsSection from './Partials/RequirementsSection';
import TestimonialsSection from './Partials/TestimonialsSection';
import FaqSection from './Partials/FaqSection';
import CtaSection from './Partials/CtaSection';
import ErrorState from '@/Components/ui/error-state';

const KitchenStaff = ({ data, error }) => {
    // Handle error state
    if (error) {
        return (
            <Layout>
                <Head title="Kitchen Staff Opportunities - Error" />
                <div className="min-h-[400px] flex items-center justify-center">
                    <ErrorState
                        title="Couldn't Load Page"
                        description={error}
                        className="max-w-md"
                    />
                </div>
            </Layout>
        );
    }

    // Get data with fallbacks
    const hero = data?.hero || {};
    const benefits = data?.benefits || {};
    const howItWorks = data?.howItWorks || {};
    const requirements = data?.requirements || {};
    const testimonials = data?.testimonials || {};
    const faq = data?.faq || {};
    const cta = data?.cta || {};

    return (
        <Layout>
            <Head title="Kitchen Staff Opportunities" />

            {/* Hero Section */}
            <PartnerHero data={hero} />

            {/* Benefits Section */}
            <BenefitsSection data={benefits} />

            {/* How It Works */}
            <HowItWorksSection data={howItWorks} />

            {/* Requirements Section */}
            <RequirementsSection data={requirements} />

            {/* Testimonials Section */}
            <TestimonialsSection data={testimonials} />

            {/* FAQ Section */}
            <FaqSection data={faq} />

            {/* CTA Section */}
            <CtaSection data={cta} />
        </Layout>
    );
};

export default KitchenStaff; 