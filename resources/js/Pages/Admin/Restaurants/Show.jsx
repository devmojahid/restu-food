import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Store, Home, Edit, ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { LazyImage } from "@/Components/Table/LazyImage";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import RestaurantAnalytics from "./Partials/Show/Analytics";
import MenuItems from "./Partials/Show/MenuItems";
import DeliveryZones from "./Partials/Show/DeliveryZones";
import OperatingSchedule from "./Partials/Show/OperatingSchedule";

const Show = ({ restaurant, analytics }) => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "dashboard", icon: Home },
    { label: "Restaurants", href: "app.restaurants.index", icon: Store },
    { label: restaurant.name },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      inactive: "warning",
      pending: "default",
      suspended: "destructive",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <Head title={`Restaurant: ${restaurant.name}`} />

      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            Restaurant Details
          </h2>
          <div className="flex space-x-2">
            <Link
              className="link-button-secondary"
              href={route("app.restaurants.index")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
            <Link
              className="link-button-primary"
              href={route("app.restaurants.edit", restaurant.id)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Restaurant
            </Link>
          </div>
        </div>

        {/* Restaurant Overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/4">
                <LazyImage
                  src={restaurant.logo?.url || "/images/default-restaurant.png"}
                  alt={restaurant.name}
                  className="w-full aspect-square rounded-lg object-cover"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                    <p className="text-muted-foreground">{restaurant.email}</p>
                  </div>
                  {getStatusBadge(restaurant.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <p>Phone: {restaurant.phone}</p>
                      <p>Address: {restaurant.address}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Delivery Information</h3>
                    <div className="space-y-2 text-sm">
                      <p>Minimum Order: ${restaurant.minimum_order}</p>
                      <p>Delivery Fee: ${restaurant.delivery_fee}</p>
                      <p>Delivery Radius: {restaurant.delivery_radius}km</p>
                    </div>
                  </div>
                </div>

                {restaurant.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {restaurant.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="delivery">Delivery Zones</TabsTrigger>
            <TabsTrigger value="schedule">Operating Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <RestaurantAnalytics analytics={analytics} />
          </TabsContent>

          <TabsContent value="menu">
            <MenuItems 
              categories={restaurant.menuCategories}
              items={restaurant.menuItems}
            />
          </TabsContent>

          <TabsContent value="delivery">
            <DeliveryZones 
              zones={restaurant.deliveryZones}
              defaultLocation={{
                lat: restaurant.latitude,
                lng: restaurant.longitude
              }}
            />
          </TabsContent>

          <TabsContent value="schedule">
            <OperatingSchedule 
              hours={restaurant.opening_hours}
              openingTime={restaurant.opening_time}
              closingTime={restaurant.closing_time}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Show; 