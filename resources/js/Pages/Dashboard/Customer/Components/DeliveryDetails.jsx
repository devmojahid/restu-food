import React from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
    Phone, 
    MessageSquare, 
    Navigation, 
    Star,
    Package,
    MapPin,
    Info
} from 'lucide-react';
import { Separator } from '@/Components/ui/separator';
import { toast } from 'react-hot-toast';

const DeliveryDetails = ({ order }) => {
    const handleCall = (type) => {
        const number = type === 'driver' 
            ? order.delivery?.driver?.phone 
            : order.restaurant?.phone;
        toast.success(`Calling ${type}: ${number}`);
    };

    const handleMessage = (type) => {
        toast.success(`Opening chat with ${type}`);
    };

    return (
        <Card className="p-6">
            <div className="space-y-6">
                {/* Driver Details */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Delivery Driver</h3>
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Navigation className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium">{order.delivery?.driver?.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span>{order.delivery?.driver?.rating} Rating</span>
                                <span>•</span>
                                <span>{order.delivery?.driver?.total_deliveries} Deliveries</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCall('driver')}
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMessage('driver')}
                                >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Message
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Order Details */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                    <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                                <div className="font-medium">Order Items</div>
                                <div className="text-sm text-muted-foreground">
                                    {order.items?.map((item, index) => (
                                        <div key={index}>
                                            {item.quantity}x {item.name}
                                            {item.special_instructions && (
                                                <span className="text-xs ml-2 text-muted-foreground">
                                                    ({item.special_instructions})
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                                <div className="font-medium">Delivery Address</div>
                                <div className="text-sm text-muted-foreground">
                                    {order.delivery_address}
                                </div>
                                {order.delivery_instructions && (
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Note: {order.delivery_instructions}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                                <div className="font-medium">Restaurant</div>
                                <div className="text-sm text-muted-foreground">
                                    {order.restaurant?.name}
                                    <br />
                                    {order.restaurant?.address}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => handleCall('restaurant')}
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call Restaurant
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default DeliveryDetails; 