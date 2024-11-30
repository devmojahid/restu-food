import React, { useEffect, useState } from 'react';
import { Card } from '@/Components/ui/card';
import { LoadingOverlay } from '@/Components/ui/loading-overlay';
import { Activity, TrendingUp, Clock } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Echo from 'laravel-echo';

const RealtimeStats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Echo for real-time updates
    const echo = new Echo({
      broadcaster: 'pusher',
      key: process.env.VITE_PUSHER_APP_KEY,
      cluster: process.env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: true
    });

    // Subscribe to stats channel
    echo.private('stats')
      .listen('StatsUpdated', (e) => {
        setData(prevData => {
          const newData = [...prevData, e.stats];
          return newData.slice(-20); // Keep last 20 data points
        });
      });

    // Initial data fetch
    fetchInitialData();

    return () => {
      echo.leave('stats');
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const response = await fetch('/api/stats/realtime');
      const initialData = await response.json();
      setData(initialData);
    } catch (error) {
      console.error('Error fetching initial stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Real-time Activity</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">Live</span>
        </div>
      </div>

      <LoadingOverlay loading={loading}>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#8884d8" 
                name="Orders"
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#82ca9d" 
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </LoadingOverlay>
    </Card>
  );
};

export default RealtimeStats; 