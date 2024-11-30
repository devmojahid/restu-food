import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';
import DeliveryStats from '@/Components/Admin/Dashboard/DeliveryStats';
import ActiveDeliveries from '@/Components/Admin/Dashboard/ActiveDeliveries';
import DeliveryAnalytics from '@/Components/Admin/Dashboard/DeliveryAnalytics';
import DeliveryMap from '@/Components/Admin/Dashboard/DeliveryMap';
import DeliveryTimeline from '@/Components/Admin/Dashboard/DeliveryTimeline';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { 
  Bike, 
  MapPin, 
  Clock, 
  AlertCircle,
  Navigation,
  Phone,
  MessageSquare
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const DeliveryDashboard = ({ dashboardData, userRole, permissions }) => {
  let stats = dashboardData;
  const [timeRange, setTimeRange] = useState('today');
  const [activeDeliveries, setActiveDeliveries] = useState(stats.active_deliveries);
  const [currentLocation, setCurrentLocation] = useState(null);

  // useEffect(() => {
  //   const channel = Echo.channel('delivery');
    
  //   channel.listen('DeliveryAssigned', (e) => {
  //     setActiveDeliveries(current => [...current, e.delivery]);
  //     toast.success('New delivery assigned!');
  //   });

  //   if (navigator.geolocation) {
  //     const locationInterval = setInterval(() => {
  //       navigator.geolocation.getCurrentPosition(
  //         position => {
  //           const { latitude, longitude } = position.coords;
  //           setCurrentLocation({ latitude, longitude });
  //           updateDeliveryLocation(latitude, longitude);
  //         },
  //         error => console.error('Error getting location:', error),
  //         { enableHighAccuracy: true }
  //       );
  //     }, 30000); 

  //     return () => {
  //       channel.stopListening('DeliveryAssigned');
  //       clearInterval(locationInterval);
  //     };
  //   }
  // }, []);

  const updateDeliveryLocation = async (latitude, longitude) => {
    try {
      await axios.post(route('delivery.location.update'), {
        latitude,
        longitude
      });
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  const handleDeliveryStatusChange = async (deliveryId, status) => {
    try {
      const response = await axios.put(route('delivery.status.update', deliveryId), {
        status,
        location: currentLocation
      });
      
      toast.success('Delivery status updated successfully');
      
      // Update local state
      setActiveDeliveries(current => 
        current.map(delivery => 
          delivery.id === deliveryId 
            ? { ...delivery, status: status }
            : delivery
        )
      );
    } catch (error) {
      toast.error('Failed to update delivery status');
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <Head title="Delivery Dashboard" />
      
      <div className="space-y-6">
        {/* Delivery Stats Overview */}
        <DeliveryStats stats={stats} />
        
        {/* Active Deliveries and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActiveDeliveries 
            deliveries={activeDeliveries}
            onStatusChange={handleDeliveryStatusChange}
            currentLocation={currentLocation}
          />
          <DeliveryMap 
            deliveries={activeDeliveries}
            currentLocation={currentLocation}
          />
        </div>
        
        {/* Analytics and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DeliveryAnalytics 
              data={stats.analytics_data}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
          </div>
          <div className="space-y-6">
            {/* Urgent Notifications */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
                  Urgent Updates
                </h3>
                <Badge variant="warning">
                  {stats.urgent_notifications?.length || 0}
                </Badge>
              </div>
              <div className="space-y-3">
                {stats.urgent_notifications?.map((notification, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-amber-50 border border-amber-100"
                  >
                    <div className="flex-shrink-0">
                      {notification.type === 'delay' && <Clock className="w-5 h-5 text-amber-500" />}
                      {notification.type === 'location' && <MapPin className="w-5 h-5 text-amber-500" />}
                      {notification.type === 'contact' && <Phone className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div>
                      <p className="font-medium text-amber-800">{notification.message}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <Badge variant="outline" className="text-xs">
                          Order #{notification.order_id}
                        </Badge>
                        <span className="text-xs text-amber-600">{notification.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Navigation className="w-5 h-5 text-blue-500 mr-3" />
                    <span>Start Navigation</span>
                  </div>
                  <Badge>Maps</Badge>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 text-green-500 mr-3" />
                    <span>Contact Support</span>
                  </div>
                  <Badge>Online</Badge>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-purple-500 mr-3" />
                    <span>Call Customer</span>
                  </div>
                  <Badge>Recent</Badge>
                </button>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Delivery Timeline */}
        <DeliveryTimeline deliveries={stats.completed_deliveries} />
      </div>
    </AdminLayout>
  );
};

export default DeliveryDashboard; 