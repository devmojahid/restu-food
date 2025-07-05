import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import Hero from './Partials/Hero';
import Mission from './Partials/Mission';
import Story from './Partials/Story';
import Team from './Partials/Team';
import Values from './Partials/Values';
import Stats from './Partials/Stats';
import Awards from './Partials/Awards';
import Locations from './Partials/Locations';
import Partners from './Partials/Partners';
import Testimonials from './Partials/Testimonials';
import Careers from './Partials/Careers';

const Index = ({ 
    hero, 
    mission, 
    story, 
    team, 
    values, 
    stats, 
    awards, 
    locations, 
    partners, 
    testimonials, 
    careers 
}) => {
    return (
        <Layout>
            <Head title="About Us" />
            
            <div className="space-y-0">
                <Hero data={hero} />
                <Mission data={mission} />
                <Story data={story} />
                <Values data={values} />
                <Stats data={stats} />
                <Team data={team} />
                <Awards data={awards} />
                <Locations data={locations} />
                <Partners data={partners} />
                <Testimonials data={testimonials} />
                <Careers data={careers} />
            </div>
        </Layout>
    );
};

export default Index; 