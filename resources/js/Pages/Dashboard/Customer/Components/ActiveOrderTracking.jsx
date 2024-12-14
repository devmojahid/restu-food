import React from 'react';
import { Card } from '@/Components/ui/card';
import LiveDeliveryTracking from './LiveDeliveryTracking';
import OrderTimeline from './OrderTimeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const ActiveOrderTracking = ({ order }) => {
    return (
        <Card className="p-4 md:p-6">
            <Tabs defaultValue="map" className="space-y-4">
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4">
                    <TabsList className="w-full grid grid-cols-2 h-auto p-1">
                        <TabsTrigger 
                            value="map" 
                            className={cn(
                                "flex items-center gap-2 py-2.5",
                                "data-[state=active]:text-primary-foreground"
                            )}
                        >
                            <MapPin className="w-4 h-4" />
                            <span className="hidden sm:inline">Live</span> Tracking
                        </TabsTrigger>
                        <TabsTrigger 
                            value="timeline"
                            className={cn(
                                "flex items-center gap-2 py-2.5",
                                "data-[state=active]:text-primary-foreground"
                            )}
                        >
                            <Clock className="w-4 h-4" />
                            <span className="hidden sm:inline">Order</span> Timeline
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="map" className="mt-0 focus-visible:outline-none">
                    <LiveDeliveryTracking order={order} />
                </TabsContent>

                <TabsContent value="timeline" className="mt-0 focus-visible:outline-none">
                    <OrderTimeline order={order} />
                </TabsContent>
            </Tabs>
        </Card>
    );
};

export default ActiveOrderTracking; 