import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const OrderQueue = ({ orders = [], onStatusChange }) => {
    // Dummy data if orders is not provided
    const dummyOrders = [
        {
            id: 'ORD-00001',
            table: 'Table 5',
            items: [
                { name: 'Chicken Burger', quantity: 2, special: 'No onions' },
                { name: 'French Fries', quantity: 1 }
            ],
            status: 'pending',
            priority: 'high',
            ordered_at: '2024-01-20T14:30:00',
            estimated_completion: '2024-01-20T14:45:00'
        },
        // Add more dummy orders...
    ];

    const displayOrders = orders.length > 0 ? orders : dummyOrders;

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
            preparing: { color: 'bg-blue-100 text-blue-800', icon: Clock },
            completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge className={config.color}>
                <Icon className="w-4 h-4 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold">Order Queue</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {displayOrders.map((order) => (
                        <div 
                            key={order.id}
                            className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-medium">{order.id}</h4>
                                    <p className="text-sm text-gray-500">{order.table}</p>
                                </div>
                                {getStatusBadge(order.status)}
                            </div>
                            
                            <div className="space-y-2 mb-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span>{item.quantity}x {item.name}</span>
                                        {item.special && (
                                            <span className="text-amber-600">{item.special}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    <span>Est. completion: {new Date(order.estimated_completion).toLocaleTimeString()}</span>
                                </div>
                                <div className="flex space-x-2">
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => onStatusChange(order.id, 'preparing')}
                                    >
                                        Start
                                    </Button>
                                    <Button 
                                        size="sm"
                                        onClick={() => onStatusChange(order.id, 'completed')}
                                    >
                                        Complete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderQueue; 