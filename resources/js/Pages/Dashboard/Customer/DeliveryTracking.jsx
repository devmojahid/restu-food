import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';
import LiveDeliveryTracking from './Components/LiveDeliveryTracking';
import OrderTimeline from './Components/OrderTimeline';
import { Card } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { toast } from 'react-hot-toast';
import { Link } from '@inertiajs/react';
import { Separator } from "@/Components/ui/separator";
import EnhancedOrderTimeline from './Components/EnhancedOrderTimeline';
import { Badge } from '@/Components/ui/badge';
import { MapPin, Clock } from 'lucide-react';
import DeliveryDetails from './Components/DeliveryDetails';

const DeliveryTracking = ({ order, error }) => {
    const [deliveryData, setDeliveryData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDeliveryData = async () => {
            if (!order?.delivery?.id) {
                setIsLoading(false);
                return;
            }

            try {
                const [historyResponse, statsResponse] = await Promise.all([
                    axios.get(route('delivery.location.history', order.delivery.id)),
                    axios.get(route('delivery.stats', order.delivery.id))
                ]);

                setDeliveryData({
                    history: historyResponse.data.history,
                    stats: statsResponse.data.stats
                });
            } catch (error) {
                console.error('Failed to fetch delivery data:', error);
                toast.error('Failed to load delivery information');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeliveryData();
    }, [order?.delivery?.id]);

    if (error) {
        return (
            <AdminLayout>
                <Head title="Delivery Tracking" />
                <div className="container mx-auto py-6">
                    <Card className="p-6">
                        <div className="text-center text-gray-500">
                            <p>{error}</p>
                            <Link
                                // href={route('orders.show', order.id)}
                                href='#'
                                className="text-primary hover:text-primary/80 mt-4 inline-block"
                            >
                                Back to Order Details
                            </Link>
                        </div>
                    </Card>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Head title="Delivery Tracking" />

            <div className="container mx-auto py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Delivery Tracking</h2>
                        <p className="text-muted-foreground">
                            Track your order #{order.order_number} in real-time
                        </p>
                    </div>
                    <Badge variant={
                        order.status === 'delivered' ? 'success' :
                        order.status === 'cancelled' ? 'destructive' :
                        'secondary'
                    } className="text-base px-4 py-2">
                        {order.status}
                    </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <Tabs defaultValue="map" className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <TabsList className="grid w-[400px] grid-cols-2">
                                        <TabsTrigger value="map" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            Live Tracking
                                        </TabsTrigger>
                                        <TabsTrigger value="timeline" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                            <Clock className="w-4 h-4 mr-2" />
                                            Order Timeline
                                        </TabsTrigger>
                                    </TabsList>

                                    {order.estimated_delivery_time && (
                                        <div className="flex items-center space-x-2 bg-muted px-4 py-2 rounded-lg">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">
                                                Estimated Delivery: {order.estimated_delivery_time}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <TabsContent value="map" className="space-y-6 mt-6">
                                    <LiveDeliveryTracking 
                                        order={order}
                                        deliveryData={deliveryData}
                                        isLoading={isLoading}
                                    />
                                </TabsContent>

                                <TabsContent value="timeline" className="mt-6">
                                    <EnhancedOrderTimeline 
                                        order={order}
                                        deliveryData={deliveryData}
                                    />
                                </TabsContent>
                            </Tabs>
                        </Card>
                    </div>
                    <div className="lg:col-span-1">
                        <DeliveryDetails order={order} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default DeliveryTracking; 