import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';
import RestaurantStats from '@/Components/Admin/Dashboard/RestaurantStats';
import OrdersOverview from '@/Components/Admin/Dashboard/OrdersOverview';
import MenuPerformance from '@/Components/Admin/Dashboard/MenuPerformance';
import CustomerInsights from '@/Components/Admin/Dashboard/CustomerInsights';
import { Button } from '@/Components/ui/button';
import { 
    Store, 
    RefreshCcw,
    Download
} from 'lucide-react';
import RealtimeOrdersTable from '@/Components/Admin/Dashboard/RealtimeOrdersTable';

const RestaurantDashboard = ({ dashboardData, auth }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Provide default data structure if dashboardData is undefined
    const data = dashboardData || {
        summary_stats: {},
        orders_overview: {},
        menu_performance: [],
        customer_insights: {},
        analytics_data: {
            hourly_orders: [],
            daily_revenue: [],
            popular_times: [],
            customer_trends: {},
            performance_metrics: {}
        },
        recent_orders: [],
        revenue_stats: {},
        staff_performance: [],
        restaurant: null
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await router.reload({ only: ['dashboardData'] });
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <AdminLayout>
            <Head title="Restaurant Dashboard" />
            
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center">
                            <Store className="w-8 h-8 mr-3" />
                            Restaurant Dashboard
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Monitor and manage your restaurant performance
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button 
                            variant="outline" 
                            onClick={handleRefresh}
                            className="flex items-center"
                            disabled={isRefreshing}
                        >
                            <RefreshCcw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Stats and Overview */}
                <RestaurantStats stats={data.summary_stats} />
                
                {/* Realtime Orders Table - Move it before the grid */}
                <RealtimeOrdersTable 
                    initialOrders={data.recent_orders ?? []} 
                    restaurantId={auth?.user?.restaurant_id}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <OrdersOverview 
                            data={data.orders_overview}
                            recentOrders={data.recent_orders}
                        />
                    </div>
                    <div className="space-y-6">
                        <MenuPerformance data={data.menu_performance} />
                        <CustomerInsights data={data.customer_insights} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default RestaurantDashboard; 