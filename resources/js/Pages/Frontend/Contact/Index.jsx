import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import Hero from './Partials/Hero';
import ContactForm from './Partials/ContactForm';
import ContactMethods from './Partials/ContactMethods';
import Locations from './Partials/Locations';
import Faq from './Partials/Faq';
import Social from './Partials/Social';
import Support from './Partials/Support';

const Index = ({ hero, contact, locations, faq, social, support }) => {
    return (
        <Layout>
            <Head title="Contact Us" />
            
            <div className="space-y-0 overflow-x-hidden">
                <Hero data={hero} />
                
                <div className="relative">
                    <div className="container mx-auto px-4 py-16 lg:py-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
                            <div className="w-full">
                                <ContactForm />
                            </div>
                            <div className="w-full">
                                <ContactMethods data={contact} />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="overflow-hidden">
                    <Locations data={locations} />
                    <Faq data={faq} />
                    <Social data={social} />
                    <Support data={support} />
                </div>
            </div>
        </Layout>
    );
};

export default Index; 