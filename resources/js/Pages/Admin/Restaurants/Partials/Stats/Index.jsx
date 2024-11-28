import React, { useCallback } from "react";
import { useForm } from '@inertiajs/react';
import StatsCard from "@/Components/Admin/StatsCard";
import { 
    Store, Clock, Truck, DollarSign, Users, Star, 
    TrendingUp, ShoppingBag, Utensils, MapPin 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { cn } from "@/lib/utils";

const RestaurantStats = ({ stats = {}, filters = { range: '30', ranges: [] } }) => {
    const defaultStats = {
        totalRestaurants: 0,
        activeRestaurants: 0,
        totalOrders: 0,
        totalRevenue: 0,
        restaurantsTrend: 0,
        orderTrend: 0,
        revenueTrend: 0,
        totalCustomers: 0,
        averageRating: 0,
        revenueChart: [],
        orderChart: [],
        categoryDistribution: [],
        peakHours: []
    };

    // Merge default stats with provided stats
    const currentStats = { ...defaultStats, ...stats };

    const { data, setData, post, processing } = useForm({
        range: filters.range,
    });

    const handleRangeChange = useCallback((value) => {
        setData('range', value);
        post(route('app.restaurants.stats.filter'), {
            preserveState: true,
            preserveScroll: true,
            only: ['stats', 'filters'],
        });
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Restaurant Statistics
                </h2>
                <Select
                    value={data.range}
                    onValueChange={handleRangeChange}
                    disabled={processing}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                        {filters.ranges?.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                                {range.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Primary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Restaurants"
                    value={currentStats.totalRestaurants}
                    icon={Store}
                    trend={currentStats.restaurantsTrend}
                    description={`${currentStats.activeRestaurants} active`}
                    loading={processing}
                />
                <StatsCard
                    title="Total Orders"
                    value={currentStats.totalOrders}
                    icon={Truck}
                    trend={currentStats.orderTrend}
                    description="Orders processed"
                    loading={processing}
                />
                <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(currentStats.totalRevenue)}
                    icon={DollarSign}
                    trend={currentStats.revenueTrend}
                    description="Gross revenue"
                    loading={processing}
                />
                <StatsCard
                    title="Total Customers"
                    value={currentStats.totalCustomers}
                    icon={Users}
                    trend={currentStats.customerTrend}
                    description="Active customers"
                    loading={processing}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            {currentStats.revenueChart.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={currentStats.revenueChart}>
                                        <defs>
                                            <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="date" 
                                            tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                        />
                                        <YAxis 
                                            tickFormatter={formatCurrency}
                                        />
                                        <Tooltip 
                                            formatter={(value) => formatCurrency(value)}
                                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#3b82f6"
                                            fillOpacity={1}
                                            fill="url(#revenue)"
                                            name="Revenue"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-muted-foreground">No revenue data available</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Orders Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            {currentStats.orderChart.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={currentStats.orderChart}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="date"
                                            tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                        />
                                        <YAxis />
                                        <Tooltip
                                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="orders"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            name="Orders"
                                            dot={false}
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-muted-foreground">No orders data available</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default React.memo(RestaurantStats); 