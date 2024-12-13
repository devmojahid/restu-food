import React from 'react';
import { Card } from '@/Components/ui/card';
import LiveDeliveryTracking from './LiveDeliveryTracking';
import OrderTimeline from './OrderTimeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';

const ActiveOrderTracking = ({ order }) => {
    return (
        <Card className="p-6">
            <Tabs defaultValue="map" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="map">Live Tracking</TabsTrigger>
                    <TabsTrigger value="timeline">Order Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="map">
                    <LiveDeliveryTracking order={order} />
                </TabsContent>

                <TabsContent value="timeline">
                    <OrderTimeline order={order} />
                </TabsContent>
            </Tabs>
        </Card>
    );
};

export default ActiveOrderTracking; 