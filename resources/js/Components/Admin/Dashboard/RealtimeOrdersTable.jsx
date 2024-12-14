import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
    Bell, 
    Clock, 
    CheckCircle2, 
    XCircle,
    AlertTriangle,
    ChevronDown,
    MoreVertical,
    Volume2,
    VolumeX,
    Eye
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { router } from '@inertiajs/react';
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/Components/ui/sheet";
import Echo from 'laravel-echo';
import { Switch } from "@/Components/ui/switch";
import { Label } from "@/Components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { cn } from "@/lib/utils";

const RealtimeOrdersTable = ({ initialOrders = [], restaurantId }) => {
    if (!restaurantId) {
        return null;
    }

    const [orders, setOrders] = useState(initialOrders);
    const [isLoading, setIsLoading] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const [filters, setFilters] = useState({
        showTestOrders: false,
        status: 'all',
        search: ''
    });

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // Filter test orders
            if (!filters.showTestOrders && order.is_test_order) {
                return false;
            }

            // Filter by status
            if (filters.status !== 'all' && order.status !== filters.status) {
                return false;
            }

            // Filter by search
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                return (
                    order.order_number.toLowerCase().includes(searchTerm) ||
                    order.customer?.name.toLowerCase().includes(searchTerm) ||
                    order.items.some(item => 
                        item.product?.name.toLowerCase().includes(searchTerm)
                    )
                );
            }

            return true;
        });
    }, [orders, filters]);


    const renderFilters = () => (
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <Switch
                    checked={filters.showTestOrders}
                    onCheckedChange={(checked) => 
                        setFilters(prev => ({ ...prev, showTestOrders: checked }))
                    }
                />
                <Label>Show Test Orders</Label>
            </div>
            <Select
                value={filters.status}
                onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, status: value }))
                }
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>
            <Input
                placeholder="Search orders..."
                value={filters.search}
                onChange={(e) => 
                    setFilters(prev => ({ ...prev, search: e.target.value }))
                }
                className="max-w-xs"
            />
        </div>
    );

    const renderOrderCard = (order) => (
        <div 
            key={order.id}
            id={`order-${order.id}`}
            className={cn(
                "border rounded-lg p-4",
                order.is_test_order && "border-dashed border-yellow-500",
                order.status === 'pending' && "bg-yellow-50"
            )}
        >
            {order.is_test_order && (
                <Badge variant="warning" className="mb-2">
                    Test Order
                </Badge>
            )}
            {/* Rest of your order card content */}
        </div>
    );

    useEffect(() => {
        if (!restaurantId) {
            console.warn('No restaurantId provided to RealtimeOrdersTable');
            return;
        }

        // console.log('Subscribing to channel:', `restaurant.${restaurantId}.orders`);

        const channel = window.Echo.private(`restaurant.${restaurantId}.orders`);
        
        channel.listen('.App\\Events\\NewOrder', (e) => {
            // console.log('New order received:', e);
            
            if (!e.order) {
                console.error('Invalid order data received');
                return;
            }

            setOrders(currentOrders => {
                // Check if order already exists
                if (currentOrders.some(order => order.id === e.order.id)) {
                    return currentOrders;
                }

                const updatedOrders = [e.order, ...currentOrders];
                
                // Play notification sound
                if (soundEnabled) {
                    new Audio('/sounds/new-order.mp3').play().catch(console.error);
                }
                
                // Show toast notification
                toast({
                    title: e.notification.title,
                    description: e.notification.message,
                    action: (
                        <Button variant="outline" size="sm" onClick={() => {
                            document.getElementById(`order-${e.order.id}`)?.scrollIntoView({
                                behavior: 'smooth'
                            });
                        }}>
                            View Order
                        </Button>
                    ),
                });
                
                return updatedOrders;
            });
        });

        // Debug logging
        channel.error((error) => {
            console.error('Echo connection error:', error);
        });

        return () => {
            // console.log('Unsubscribing from channel:', `restaurant.${restaurantId}.orders`);
            channel.stopListening('.App\\Events\\NewOrder');
        };
    }, [restaurantId, soundEnabled]);

    const handleAction = async (orderId, action) => {
        setIsLoading(true);
        try {
            await router.post(route('orders.update-status'), {
                orderId,
                status: action
            });

            setOrders(currentOrders => 
                currentOrders.map(order => 
                    order.id === orderId 
                        ? { ...order, status: action }
                        : order
                )
            );

            toast.success(`Order #${orderId} has been ${action}`);
        } catch (error) {
            console.error('Action failed:', error);
            toast.error("Failed to update order status");
        } finally {
            setIsLoading(false);
        }
    };

    // Generate dummy data for demonstration
    const dummyOrders = [
        {
            id: 'ORD-00001',
            customer: {
                name: 'John Doe',
                phone: '+1234567890',
                address: '123 Main St'
            },
            items: [
                { name: 'Chicken Burger', quantity: 2, price: 12.99 },
                { name: 'French Fries', quantity: 1, price: 4.99 }
            ],
            total: 30.97,
            status: 'pending',
            created_at: new Date().toISOString(),
            special_instructions: 'Extra sauce please',
            payment_method: 'Credit Card',
            table_number: 'T-12'
        },
        // Add more dummy orders...
    ];

    const displayOrders = orders.length > 0 ? orders : dummyOrders;

    return (
        <Card className="mb-6">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <CardTitle className="text-xl font-bold flex items-center">
                            <Bell className="w-5 h-5 mr-2" />
                            Live Orders
                        </CardTitle>
                        <Badge variant="secondary" className="animate-pulse">
                            {displayOrders.filter(o => o.status === 'pending').length} New
                        </Badge>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="ml-2"
                    >
                        {soundEnabled ? (
                            <Volume2 className="h-4 w-4" />
                        ) : (
                            <VolumeX className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {/* Desktop View */}
                <div className="hidden md:block">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-4 py-2 text-left">Order ID</th>
                                    <th className="px-4 py-2 text-left">Customer</th>
                                    <th className="px-4 py-2 text-left">Items</th>
                                    <th className="px-4 py-2 text-left">Total</th>
                                    <th className="px-4 py-2 text-left">Table/Delivery</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayOrders.map((order) => (
                                    <tr 
                                        key={order.id} 
                                        className={`border-b ${
                                            order.status === 'pending' ? 'bg-yellow-50 animate-pulse' : ''
                                        }`}
                                    >
                                        <td className="px-4 py-2">{order.id}</td>
                                        <td className="px-4 py-2">
                                            <div>
                                                <div className="font-medium">{order.customer.name}</div>
                                                <div className="text-sm text-gray-500">{order.customer.phone}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="text-sm">
                                                {order.items.map((item, index) => (
                                                    <div key={index}>
                                                        {item.quantity}x {item.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 font-medium">
                                            ${order.total.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2">
                                            {order.table_number || 'Delivery'}
                                        </td>
                                        <td className="px-4 py-2">
                                            <Badge className={
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            {order.status === 'pending' ? (
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        onClick={() => handleAction(order.id, 'approved')}
                                                        disabled={isLoading}
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleAction(order.id, 'rejected')}
                                                        disabled={isLoading}
                                                    >
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {}}
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {displayOrders.map((order) => (
                        <Sheet key={order.id}>
                            <SheetTrigger asChild>
                                <div 
                                    className={`p-4 rounded-lg border cursor-pointer ${
                                        order.status === 'pending' ? 'bg-yellow-50 animate-pulse border-yellow-200' : 'bg-white'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium">{order.id}</div>
                                            <div className="text-sm text-gray-500">{order.customer.name}</div>
                                        </div>
                                        <Badge className={
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }>
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <div className="mt-2 flex justify-between items-center">
                                        <div className="text-sm text-gray-500">
                                            {order.items.length} items • ${order.total.toFixed(2)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {order.table_number || 'Delivery'}
                                        </div>
                                    </div>
                                </div>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[90vh]">
                                <SheetHeader>
                                    <SheetTitle>Order Details</SheetTitle>
                                </SheetHeader>
                                <ScrollArea className="h-full py-4">
                                    <div className="space-y-6">
                                        {/* Order Info */}
                                        <div>
                                            <h3 className="font-medium mb-2">Order Information</h3>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Order ID</p>
                                                    <p className="font-medium">{order.id}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Status</p>
                                                    <Badge className={
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }>
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Table/Delivery</p>
                                                    <p className="font-medium">{order.table_number || 'Delivery'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Payment Method</p>
                                                    <p className="font-medium">{order.payment_method}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Customer Info */}
                                        <div>
                                            <h3 className="font-medium mb-2">Customer Information</h3>
                                            <div className="space-y-2 text-sm">
                                                <p><span className="text-gray-500">Name:</span> {order.customer.name}</p>
                                                <p><span className="text-gray-500">Phone:</span> {order.customer.phone}</p>
                                                <p><span className="text-gray-500">Address:</span> {order.customer.address}</p>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div>
                                            <h3 className="font-medium mb-2">Order Items</h3>
                                            <div className="space-y-3">
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="flex justify-between items-start border-b pb-2">
                                                        <div>
                                                            <p className="font-medium">{item.name}</p>
                                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                            {item.special_instructions && (
                                                                <p className="text-sm text-amber-600 mt-1">
                                                                    Note: {item.special_instructions}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-between items-center mt-4 pt-3 border-t">
                                                <span className="font-medium">Total Amount</span>
                                                <span className="font-semibold text-lg">${order.total.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        {order.status === 'pending' && (
                                            <div className="flex gap-2 mt-4">
                                                <Button
                                                    className="flex-1"
                                                    variant="success"
                                                    onClick={() => handleAction(order.id, 'approved')}
                                                    disabled={isLoading}
                                                >
                                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                                    Accept Order
                                                </Button>
                                                <Button
                                                    className="flex-1"
                                                    variant="destructive"
                                                    onClick={() => handleAction(order.id, 'rejected')}
                                                    disabled={isLoading}
                                                >
                                                    <XCircle className="w-4 h-4 mr-1" />
                                                    Reject Order
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </SheetContent>
                        </Sheet>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default RealtimeOrdersTable; 