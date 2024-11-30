import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
    ShoppingBag, 
    Clock, 
    TrendingUp,
    Filter,
    MoreHorizontal,
    Printer,
    Download,
    ChevronDown,
    AlertCircle,
    CheckCircle,
    XCircle,
    DollarSign,
    Loader2,
    History,
    TrendingDown,
    SortAsc,
    SortDesc
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import { 
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { router } from '@inertiajs/react';
import { format } from "date-fns";
import axios from 'axios';
import Echo from 'laravel-echo';
import { toast } from 'react-hot-toast';
import { DateRangePicker } from "@/Components/ui/date-range-picker";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Separator } from "@/Components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { cn } from "@/lib/utils";
import RealtimeOrdersTable from './RealtimeOrdersTable';

const OrdersOverview = ({ data = {}, recentOrders = [] }) => {
    const { current_orders = {}, order_trends = [], peak_hours = {} } = data;
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    const [filters, setFilters] = useState({
        dateRange: {
            from: null,
            to: null
        },
        status: 'all',
        search: '',
        orderBy: 'latest'
    });
    const [isExporting, setIsExporting] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const [isLoading, setIsLoading] = useState({
        filter: false,
        export: false,
        reset: false
    });

    const toggleOrderExpand = (orderId) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTime = (dateString) => {
        try {
            return new Date(dateString).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    const searchTimeoutRef = useRef(null);

    const handleSearch = useCallback((value) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        setFilters(prev => ({ ...prev, search: value }));

        searchTimeoutRef.current = setTimeout(() => {
            handleFilterChange('search', value);
        }, 300);
    }, []);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const handleFilterChange = async (key, value) => {
        setIsLoading(prev => ({ ...prev, filter: true }));
        try {
            const newFilters = { 
                ...filters, 
                [key]: value === 'all' && key === 'status' ? '' : value 
            };
            setFilters(newFilters);

            const apiFilters = {
                ...newFilters,
                status: newFilters.status === 'all' ? '' : newFilters.status,
                dateRange: {
                    from: newFilters.dateRange.from ? format(newFilters.dateRange.from, 'yyyy-MM-dd') : null,
                    to: newFilters.dateRange.to ? format(newFilters.dateRange.to, 'yyyy-MM-dd') : null
                }
            };

            await router.get(route('app.dashboard'), {
                filters: apiFilters
            }, {
                preserveState: true,
                preserveScroll: true,
                only: ['recentOrders']
            });
        } catch (error) {
            console.error('Filter error:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to apply filters",
                variant: "destructive",
            });
        } finally {
            setIsLoading(prev => ({ ...prev, filter: false }));
        }
    };

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const response = await axios.post(route('api.orders.export'), {
                filters,
                format: 'csv'
            }, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `orders-${format(new Date(), 'yyyy-MM-dd')}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const resetFilters = async () => {
        setIsLoading(prev => ({ ...prev, reset: true }));
        try {
        const defaultFilters = {
            dateRange: {
                from: null,
                to: null
            },
            status: 'all',
            search: '',
            orderBy: 'latest'
        };
        setFilters(defaultFilters);
        
            await router.get(route('app.dashboard'), {
            filters: {
                ...defaultFilters,
                status: ''
            }
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['recentOrders']
        });

            toast({
                title: "Filters Reset",
                description: "All filters have been cleared",
                variant: "success",
            });
        } catch (error) {
            console.error('Reset error:', error);
            toast({
                title: "Error",
                description: "Failed to reset filters",
                variant: "destructive",
            });
        } finally {
            setIsLoading(prev => ({ ...prev, reset: false }));
        }
    };

    // useEffect(() => {
    //     const channel = Echo.private('orders');
        
    //     channel.listen('OrderStatusUpdated', (e) => {
    //         router.reload({ only: ['recentOrders'] });
    //     });

    //     return () => {
    //         channel.stopListening('OrderStatusUpdated');
    //     };
    // }, []);

    const validateFilters = (filters) => {
        const errors = [];

        // Date range validation
        if (filters.dateRange.from && filters.dateRange.to) {
            if (new Date(filters.dateRange.from) > new Date(filters.dateRange.to)) {
                errors.push("Start date cannot be after end date");
            }
        }

        // Search validation
        if (filters.search && filters.search.length < 2) {
            errors.push("Search term must be at least 2 characters");
        }

        return errors;
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.search) count++;
        if (filters.status && filters.status !== 'all') count++;
        if (filters.dateRange.from || filters.dateRange.to) count++;
        if (filters.orderBy !== 'latest') count++;
        return count;
    };

    return (
        <>
            <RealtimeOrdersTable initialOrders={recentOrders.filter(o => o.status === 'pending')} />
            
            <Card className="col-span-2">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold flex items-center">
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            Orders Overview
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Filter
                                        {getActiveFilterCount() > 0 && (
                                            <Badge 
                                                variant="secondary" 
                                                className="ml-2"
                                            >
                                                {getActiveFilterCount()}
                                            </Badge>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[320px] p-0" align="end">
                                    <Tabs defaultValue="filters" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="filters">Filters</TabsTrigger>
                                            <TabsTrigger value="sort">Sort</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="filters" className="p-4 space-y-4">
                                            <div className="space-y-2">
                                                <Label>Date Range</Label>
                                                <DateRangePicker
                                                    from={filters.dateRange.from}
                                                    to={filters.dateRange.to}
                                                    onSelect={(range) => {
                                                        handleFilterChange('dateRange', {
                                                            from: range?.from || null,
                                                            to: range?.to || null
                                                        });
                                                    }}
                                                />
                                            </div>

                                            <Separator />

                                            <div className="space-y-2">
                                                <Label>Status</Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
                                                        <Button
                                                            key={status}
                                                            variant={filters.status === status ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => handleFilterChange('status', status)}
                                                            className="w-full capitalize"
                                                        >
                                                            {status === 'all' ? 'All Orders' : status}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-2">
                                                <Label>Search</Label>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Search orders..."
                                                        value={filters.search}
                                                        onChange={(e) => handleSearch(e.target.value)}
                                                        disabled={isLoading.filter}
                                                        className="pr-8"
                                                    />
                                                    {filters.search && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute right-0 top-0 h-full px-2"
                                                            onClick={() => handleSearch('')}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="sort" className="p-4 space-y-4">
                                            <ScrollArea className="h-[200px] rounded-md border p-2">
                                                {[
                                                    { value: 'latest', label: 'Latest First', icon: Clock },
                                                    { value: 'oldest', label: 'Oldest First', icon: History },
                                                    { value: 'highest', label: 'Highest Amount', icon: TrendingUp },
                                                    { value: 'lowest', label: 'Lowest Amount', icon: TrendingDown },
                                                    { value: 'customer_asc', label: 'Customer Name (A-Z)', icon: SortAsc },
                                                    { value: 'customer_desc', label: 'Customer Name (Z-A)', icon: SortDesc },
                                                ].map((option) => (
                                                    <div
                                                        key={option.value}
                                                        className={cn(
                                                            "flex items-center space-x-2 rounded-lg p-2 hover:bg-accent cursor-pointer",
                                                            filters.orderBy === option.value && "bg-accent"
                                                        )}
                                                        onClick={() => handleFilterChange('orderBy', option.value)}
                                                    >
                                                        <option.icon className="h-4 w-4" />
                                                        <span>{option.label}</span>
                                                    </div>
                                                ))}
                                            </ScrollArea>
                                        </TabsContent>
                                    </Tabs>

                                    <Separator />

                                    <div className="p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Active Filters: {getActiveFilterCount()}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={resetFilters}
                                                disabled={isLoading.reset || getActiveFilterCount() === 0}
                                            >
                                                {isLoading.reset ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    'Reset All'
                                                )}
                                            </Button>
                                        </div>
                                        <Button 
                                            className="w-full" 
                                            onClick={() => document.body.click()}
                                            disabled={isLoading.filter}
                                        >
                                            {isLoading.filter ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Applying...
                                                </>
                                            ) : (
                                                'Apply Filters'
                                            )}
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleExport}
                                disabled={isExporting}
                            >
                                {isExporting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Exporting...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4 mr-2" />
                                        Export
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Current Orders Status */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                        {Object.entries(current_orders).map(([status, count]) => (
                            <div key={status} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="text-sm text-gray-500 capitalize flex items-center">
                                    {getStatusIcon(status)}
                                    <span className="ml-2">{status.replace('_', ' ')}</span>
                                </div>
                                <div className="text-2xl font-semibold mt-1">
                                    {count}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Orders Trend Chart */}
                    <div className="h-[300px] mb-8 -mx-4 sm:mx-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={order_trends}>
                                <defs>
                                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                                <XAxis 
                                    dataKey="hour" 
                                    tick={{ fill: '#6B7280' }}
                                    tickLine={{ stroke: '#6B7280' }}
                                />
                                <YAxis 
                                    tick={{ fill: '#6B7280' }}
                                    tickLine={{ stroke: '#6B7280' }}
                                />
                                <Tooltip 
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white p-3 rounded-lg shadow-lg border">
                                                    <p className="font-medium">{label}</p>
                                                    {payload.map((entry, index) => (
                                                        <div key={index} className="flex justify-between space-x-8 text-sm">
                                                            <span style={{ color: entry.color }}>{entry.name}:</span>
                                                            <span className="font-medium">{entry.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#3B82F6"
                                    fillOpacity={1}
                                    fill="url(#colorOrders)"
                                    name="Total Orders"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="completed"
                                    stroke="#10B981"
                                    fillOpacity={1}
                                    fill="url(#colorCompleted)"
                                    name="Completed"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Peak Hours */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(peak_hours).map(([period, data]) => (
                            <div key={period} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium capitalize">{period}</h4>
                                    <Badge variant="secondary">
                                        {data.avg_orders} orders/hr
                                    </Badge>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {data.start} - {data.end}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Orders List */}
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <Collapsible
                                key={order.id}
                                open={expandedOrders.has(order.id)}
                                onOpenChange={() => toggleOrderExpand(order.id)}
                            >
                                <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <CollapsibleTrigger className="w-full">
                                        <div className="flex flex-col sm:flex-row justify-between items-start">
                                            <div className="w-full sm:w-auto mb-2 sm:mb-0">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium">{order.id}</span>
                                                    <Badge className={getStatusColor(order.status)}>
                                                        <div className="flex items-center space-x-1">
                                                            {getStatusIcon(order.status)}
                                                            <span>{order.status}</span>
                                                        </div>
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {order.customer?.name} • {order.items?.length || 0} items
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right w-full sm:w-auto">
                                                <div className="font-medium">
                                                    ${order.total?.toLocaleString()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {formatTime(order.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                    </CollapsibleTrigger>
                                    
                                    <CollapsibleContent>
                                        <div className="mt-4 space-y-3 border-t pt-4">
                                            {order.items?.map((item, index) => (
                                                <div key={index} className="flex justify-between items-start">
                                                    <div>
                                                        <div className="font-medium">{item.name}</div>
                                                        {item.special_instructions && (
                                                            <div className="text-sm text-amber-600 mt-1">
                                                                Note: {item.special_instructions}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium">
                                                            ${(item.price * item.quantity).toLocaleString()}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {item.quantity} × ${item.price}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            <div className="flex justify-between items-center pt-3 border-t mt-3">
                                                <span className="font-medium">Total Amount</span>
                                                <span className="font-semibold text-lg">
                                                    ${order.total?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default OrdersOverview; 