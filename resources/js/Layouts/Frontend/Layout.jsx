import React from 'react';
import { Link } from '@inertiajs/react';
import Navbar from './Partials/Navbar';
import Footer from './Partials/Footer';
import TopBar from './Partials/TopBar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <TopBar />
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout; 