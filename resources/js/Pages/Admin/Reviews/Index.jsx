import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Home, Star } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import ReviewList from "./Partials/List/Index";
import StatsCard from "./Partials/Stats/StatsCard";

const ReviewsIndex = ({ reviews, stats }) => {
  return (
    <AdminLayout>
      <Head title="Reviews" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Reviews", icon: Star },
          ]}
        />

        <StatsCard stats={stats} />
        <ReviewList reviews={reviews} />
      </div>
    </AdminLayout>
  );
};

export default ReviewsIndex; 