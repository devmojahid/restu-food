import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import Hero from './Partials/Hero';
import LegalContent from './Partials/LegalContent';
import Faq from './Partials/Faq';
import RelatedPolicies from './Partials/RelatedPolicies';
import StatsSection from './Partials/StatsSection';
import ContactSection from './Partials/ContactSection';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Index = ({
    pageTitle,
    hero,
    content,
    faq,
    related,
    stats,
    contact,
    error
}) => {
    return (
        <Layout>
            <Head title={pageTitle || 'Legal Information'} />

            {error && (
                <div className="container mx-auto py-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Hero Section */}
            {hero && <Hero data={hero} />}

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="w-full lg:w-2/3">
                        {content && <LegalContent data={content} />}
                        {faq && <Faq data={faq} />}
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-1/3 space-y-8">
                        {related && <RelatedPolicies data={related} />}
                        {stats && <StatsSection data={stats} />}
                        {contact && <ContactSection data={contact} />}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Index; 