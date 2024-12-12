import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import Navbar from './Partials/Navbar';
import Footer from './Partials/Footer';
import TopBar from './Partials/TopBar';
import toast from 'react-hot-toast';

const Layout = ({ children }) => {
    // const [notifications, setNotifications] = useState([])
    // useEffect(() => {
    //     Echo.private("restaurant.1.orders")
    //         .listen(".NewOrder", (event) => {
    //             console.log(event.order);
    //             setNotifications(prevArray => [...prevArray, event])
    //         });
    // }, []);

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Ensure Echo is initialized
        if (typeof window.Echo === 'undefined') {
            console.error('Echo is not initialized');
            return;
        }

        // Connection status monitoring
        window.Echo.connector.pusher.connection.bind('connected', () => {
            console.log('Successfully connected to Reverb server');
        });

        window.Echo.connector.pusher.connection.bind('error', (error) => {
            console.error('Reverb connection error:', error);
        });

        // Subscribe to the channel
        const channel = window.Echo.private(`restaurant.1.orders`);
        
        channel.error((error) => {
            console.error('Channel subscription error:', error);
        });

        // Listen for new orders
        channel.listen('.NewOrder', (event) => {
            console.log('New order received:', event);
            alert('New order received!');
            // Add new notification
            setNotifications(prev => [...prev, event]);
            
            // Optional: Show toast notification
            toast.success(event.notification.message);
        });

        // Cleanup on component unmount
        return () => {
            channel.stopListening('.NewOrder');
            window.Echo.disconnect();
        };
    }, []);

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