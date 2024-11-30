import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { LoadingState } from '@/Components/ui/loading-state';

const AdvancedAnalytics = ({ data = null }) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Advanced Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState message="Loading analytics data..." />
        </CardContent>
      </Card>
    );
  }

  // Ensure we're working with arrays
  const topRestaurants = Array.isArray(data.top_restaurants) ? data.top_restaurants : [];
  const popularItems = Array.isArray(data.popular_items) ? data.popular_items : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Restaurants */}
          <div>
            <h3 className="font-medium mb-4">Top Restaurants</h3>
            <div className="space-y-4">
              {topRestaurants.map((restaurant, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{restaurant.name}</span>
                  <span>${restaurant.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Items */}
          <div>
            <h3 className="font-medium mb-4">Popular Items</h3>
            <div className="space-y-4">
              {popularItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <span>{item.orders} orders</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedAnalytics; 