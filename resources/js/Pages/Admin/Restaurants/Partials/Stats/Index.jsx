import React from "react";
import StatsCard from "@/Components/Admin/StatsCard";
import { Store, Clock, Truck, DollarSign } from "lucide-react";

const RestaurantStats = ({ stats = {} }) => {
  const {
    totalRestaurants = 0,
    activeRestaurants = 0,
    totalOrders = 0,
    totalRevenue = 0,
    restaurantsTrend = 0,
    ordersTrend = 0,
    revenueTrend = 0,
  } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="Total Restaurants"
        value={totalRestaurants}
        icon={Store}
        trend={restaurantsTrend}
        description="All registered restaurants"
      />
      <StatsCard
        title="Active Restaurants"
        value={activeRestaurants}
        icon={Clock}
        description="Currently operating"
      />
      <StatsCard
        title="Total Orders"
        value={totalOrders}
        icon={Truck}
        trend={ordersTrend}
        description="Orders processed"
      />
      <StatsCard
        title="Total Revenue"
        value={totalRevenue}
        icon={DollarSign}
        trend={revenueTrend}
        description="Gross revenue"
      />
    </div>
  );
};

export default RestaurantStats; 