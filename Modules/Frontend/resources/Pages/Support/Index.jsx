import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import Hero from './Partials/Hero';
import SupportCategories from './Partials/SupportCategories';
import FaqSection from './Partials/FaqSection';
import SubmitTicket from './Partials/SubmitTicket';
import LiveChat from './Partials/LiveChat';
import ContactMethods from './Partials/ContactMethods';
import ResourcesSection from './Partials/ResourcesSection';
import CommunitySupport from './Partials/CommunitySupport';
import SystemStatus from './Partials/SystemStatus';

const Index = ({
    hero,
    supportCategories,
    faq,
    ticketSubmission,
    liveChat,
    contactMethods,
    resources,
    communitySupport,
    statusUpdates,
    error
}) => {
    return (
        <Layout>
            <Head title="Help Center" />

            <div className="space-y-0 overflow-x-hidden">
                {/* Hero Section */}
                {hero && <Hero data={hero} />}

                {/* Support Categories Section */}
                <div className="relative bg-gray-50 dark:bg-gray-900/50 py-16">
                    <div className="container mx-auto px-4">
                        {supportCategories && <SupportCategories data={supportCategories} />}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="relative py-16">
                    <div className="container mx-auto px-4">
                        {faq && <FaqSection data={faq} />}
                    </div>
                </div>

                {/* Two Column Layout for Ticket Submission and Live Chat */}
                <div className="relative bg-gray-50 dark:bg-gray-900/50 py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Ticket Submission Form */}
                            <div className="w-full">
                                {ticketSubmission && <SubmitTicket data={ticketSubmission} />}
                            </div>

                            {/* Live Chat Component */}
                            <div className="w-full">
                                {liveChat && <LiveChat data={liveChat} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Methods Section */}
                <div className="relative py-16">
                    <div className="container mx-auto px-4">
                        {contactMethods && <ContactMethods data={contactMethods} />}
                    </div>
                </div>

                {/* Resources Section */}
                <div className="relative bg-gray-50 dark:bg-gray-900/50 py-16">
                    <div className="container mx-auto px-4">
                        {resources && <ResourcesSection data={resources} />}
                    </div>
                </div>

                {/* Community Support Section */}
                <div className="relative py-16">
                    <div className="container mx-auto px-4">
                        {communitySupport && <CommunitySupport data={communitySupport} />}
                    </div>
                </div>

                {/* System Status Section */}
                <div className="relative bg-gray-50 dark:bg-gray-900/50 py-16">
                    <div className="container mx-auto px-4">
                        {statusUpdates && <SystemStatus data={statusUpdates} />}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Index; 