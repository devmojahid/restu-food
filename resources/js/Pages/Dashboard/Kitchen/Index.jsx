import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';
import KitchenStats from '@/Components/Admin/Dashboard/KitchenStats';
import OrderQueue from '@/Components/Admin/Dashboard/OrderQueue';
import KitchenAnalytics from '@/Components/Admin/Dashboard/KitchenAnalytics';
import PreparationTimeline from '@/Components/Admin/Dashboard/PreparationTimeline';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { 
  ChefHat, 
  Clock, 
  Utensils, 
  AlertCircle,
  Bell,
  Timer,
  TrendingUp
} from 'lucide-react';
import Echo from 'laravel-echo';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const KitchenDashboard = ({ dashboardData, userRole, permissions }) => {
  let stats = dashboardData;
  const [timeRange, setTimeRange] = useState('today');
  const [orders, setOrders] = useState(stats.pending_orders);
  const [kitchenLoad, setKitchenLoad] = useState(null);

//   useEffect(() => {
//     const channel = Echo.channel('kitchen');
    
//     channel.listen('KitchenOrderStatusUpdated', (e) => {
//       setOrders(currentOrders => {
//         const updatedOrders = [...currentOrders];
//         const index = updatedOrders.findIndex(order => order.id === e.order.id);
        
//         if (index !== -1) {
//           updatedOrders[index] = e.order;
//         }
        
//         return updatedOrders;
//       });
//     });

//     // Fetch kitchen load every minute
//     const loadInterval = setInterval(() => {
//       axios.get(route('kitchen.load'))
//         .then(response => setKitchenLoad(response.data));
//     }, 60000);

//     return () => {
//       channel.stopListening('KitchenOrderStatusUpdated');
//       clearInterval(loadInterval);
//     };
//   }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const response = await axios.put(route('kitchen.orders.status', orderId), {
        status,
        notes: `Status changed to ${status} by ${userRole}`,
      });

      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
      console.error(error);
    }
  };

  const handleTimeRangeChange = (newRange) => {
    // You can use Inertia.get or router.get for server-side updates
    router.get(
      route('app.dashboard'), 
      { timeRange: newRange },
      { preserveScroll: true }
    );
    setTimeRange(newRange);
  };

  return (
    <AdminLayout>
      <Head title="Kitchen Dashboard" />
      
      <div className="space-y-6">
        {/* Kitchen Stats Overview */}
        <KitchenStats stats={stats} />
        
        {/* Order Queue and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OrderQueue 
              orders={orders}
              onStatusChange={handleStatusChange}
            />
          </div>
          <div className="space-y-6">
            <KitchenAnalytics 
              data={stats.analytics_data}
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
            />
            
            {/* Priority Alerts */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
                  Priority Alerts
                </h3>
                <Badge variant="warning">{stats.priority_alerts?.length || 0}</Badge>
              </div>
              <div className="space-y-3">
                {stats.priority_alerts?.map((alert, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-amber-50 border border-amber-100"
                  >
                    <Bell className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">{alert.message}</p>
                      <p className="text-sm text-amber-600">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
        
        {/* Preparation Timeline */}
        <PreparationTimeline orders={stats.processing_orders} />
        
        {/* Kitchen Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Timer className="w-5 h-5 mr-2" />
              Average Preparation Times
            </h3>
            <div className="space-y-4">
              {stats.avg_prep_times?.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{item.category}</span>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-primary" />
                    <span className="font-semibold">{item.time} mins</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Utensils className="w-5 h-5 mr-2" />
              Kitchen Efficiency
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Orders Completed</span>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  <span className="font-semibold">{stats.efficiency?.completed_orders}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">On-Time Rate</span>
                <span className="font-semibold text-green-600">
                  {stats.efficiency?.on_time_rate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quality Score</span>
                <span className="font-semibold text-blue-600">
                  {stats.efficiency?.quality_score}/10
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ChefHat className="w-5 h-5 mr-2" />
              Kitchen Status
            </h3>
            <div className="space-y-4">
              {stats.kitchen_status?.map((station, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{station.name}</span>
                  <Badge variant={station.status === 'Active' ? 'success' : 'warning'}>
                    {station.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default KitchenDashboard; 