import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { 
    TrendingUp, 
    DollarSign, 
    ShoppingBag,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { Skeleton } from "@/Components/ui/skeleton";
import { Alert, AlertDescription } from "@/Components/ui/alert";

const CustomerAnalytics = ({ 
    title, 
    timeRange, 
    onTimeRangeChange, 
    data = {}, 
    stats = {},
    isLoading = false 
}) => {
    // Ensure data has the required structure with default values
    const {
        order_trends = {
            daily: [],
            monthly: []
        },
        spending_analysis = {
            categories: [],
            time_of_day: {}
        }
    } = data;

    // Calculate total spending
    const totalSpending = spending_analysis.categories?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

    // Format data for charts
    const formattedDailyData = Array.isArray(order_trends.daily) ? order_trends.daily : [];
    const formattedMonthlyData = Array.isArray(order_trends.monthly) ? order_trends.monthly : [];
    const formattedCategories = Array.isArray(spending_analysis.categories) ? spending_analysis.categories : [];

    // Calculate percentage changes
    const calculateChange = (current, previous) => {
        if (!previous) return 0;
        return ((current - previous) / previous) * 100;
    };

    const recentOrdersChange = calculateChange(
        formattedDailyData[formattedDailyData.length - 1]?.orders || 0,
        formattedDailyData[formattedDailyData.length - 2]?.orders || 0
    );

    const recentSpendingChange = calculateChange(
        formattedDailyData[formattedDailyData.length - 1]?.amount || 0,
        formattedDailyData[formattedDailyData.length - 2]?.amount || 0
    );

    // Add loading state
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-8 w-[200px]" />
                        <Skeleton className="h-10 w-[180px]" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardContent className="pt-6">
                                    <Skeleton className="h-20 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
        );
    }

    // Add empty state
    if (!data || Object.keys(data).length === 0) {
        return (
            <Card>
                <CardContent className="py-8">
                    <Alert>
                        <AlertDescription>
                            No analytics data available at the moment.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    // Enhance the tooltip content
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border">
                    <p className="font-medium mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex justify-between space-x-8 text-sm">
                            <span style={{ color: entry.color }}>
                                {entry.name === 'amount' ? 'Spending' : 'Orders'}:
                            </span>
                            <span className="font-medium">
                                {entry.name === 'amount' ? '$' : ''}{entry.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                    <Select value={timeRange} onValueChange={onTimeRangeChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Last 7 Days</SelectItem>
                            <SelectItem value="weekly">Last 4 Weeks</SelectItem>
                            <SelectItem value="monthly">Last 12 Months</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                    <h4 className="text-2xl font-bold mt-1">
                                        {formattedDailyData.reduce((acc, curr) => acc + (curr.orders || 0), 0)}
                                    </h4>
                                </div>
                                <div className={`flex items-center ${recentOrdersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {recentOrdersChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    <span className="text-sm font-medium">{Math.abs(recentOrdersChange).toFixed(1)}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Spending</p>
                                    <h4 className="text-2xl font-bold mt-1">
                                        ${totalSpending.toLocaleString()}
                                    </h4>
                                </div>
                                <div className={`flex items-center ${recentSpendingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {recentSpendingChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    <span className="text-sm font-medium">{Math.abs(recentSpendingChange).toFixed(1)}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Average Order</p>
                                    <h4 className="text-2xl font-bold mt-1">
                                        ${(totalSpending / Math.max(1, formattedDailyData.reduce((acc, curr) => acc + (curr.orders || 0), 0))).toFixed(2)}
                                    </h4>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <Tabs defaultValue="orders" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="spending">Spending</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                    </TabsList>

                    <TabsContent value="orders" className="space-y-4">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timeRange === 'monthly' ? formattedMonthlyData : formattedDailyData}>
                                    <defs>
                                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                                    <XAxis dataKey={timeRange === 'monthly' ? 'month' : 'date'} />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#3B82F6"
                                        fillOpacity={1}
                                        fill="url(#colorOrders)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>

                    <TabsContent value="spending" className="space-y-4">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timeRange === 'monthly' ? formattedMonthlyData : formattedDailyData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                                    <XAxis dataKey={timeRange === 'monthly' ? 'month' : 'date'} />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#10B981"
                                        fillOpacity={1}
                                        fill="url(#colorAmount)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>

                    <TabsContent value="categories" className="space-y-4">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={formattedCategories}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default CustomerAnalytics; 