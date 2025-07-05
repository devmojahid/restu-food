import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import Hero from './Partials/Hero';
import TrackingStatus from './Partials/TrackingStatus';
import DeliveryDetails from './Partials/DeliveryDetails';
import OrderMap from './Partials/OrderMap';
import OrderSummary from './Partials/OrderSummary';
import SimilarItems from './Partials/SimilarItems';
import OrderSupport from './Partials/OrderSupport';
import OrderSearch from './Partials/OrderSearch';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Index = ({
    hero = {},
    order = null,
    delivery_person = null,
    tracking_updates = [],
    map_data = null,
    order_items = [],
    similar_items = [],
    restaurant = null,
    support_info = {},
    faqs = [],
    error = null
}) => {
    const [searchedOrder, setSearchedOrder] = useState(null);
    const [showOrderNotFound, setShowOrderNotFound] = useState(false);

    // Reset the "order not found" message when we get new props
    useEffect(() => {
        if (order) {
            setShowOrderNotFound(false);
        }
    }, [order]);

    // Check if there's an order to display or if we're showing the search page
    const hasOrderToDisplay = order && Object.keys(order).length > 0;

    return (
        <Layout>
            <Head title="Track Your Order" />

            {/* Hero Section */}
            <Hero data={hero} />

            {/* Error Alert */}
            {error && (
                <div className="container mx-auto py-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                {/* If no order is being tracked, show the search form */}
                {!hasOrderToDisplay && (
                    <div className="max-w-3xl mx-auto">
                        <OrderSearch
                            onOrderNotFound={() => setShowOrderNotFound(true)}
                            showNotFoundMessage={showOrderNotFound}
                        />
                    </div>
                )}

                {/* If we have an order to display, show all the tracking sections */}
                {hasOrderToDisplay && (
                    <div className="space-y-12">
                        {/* Tracking Status Section */}
                        <TrackingStatus
                            order={order}
                            trackingUpdates={tracking_updates}
                        />

                        {/* Map Section */}
                        {map_data && (
                            <OrderMap
                                mapData={map_data}
                                restaurant={restaurant}
                            />
                        )}

                        {/* Delivery Person & Restaurant Section */}
                        <DeliveryDetails
                            deliveryPerson={delivery_person}
                            restaurant={restaurant}
                            order={order}
                        />

                        {/* Order Summary Section */}
                        <OrderSummary
                            order={order}
                            items={order_items}
                        />

                        {/* Similar Items Section */}
                        {similar_items?.length > 0 && (
                            <SimilarItems items={similar_items} />
                        )}

                        {/* Support Section */}
                        <OrderSupport
                            supportInfo={support_info}
                            faqs={faqs}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Index; 
