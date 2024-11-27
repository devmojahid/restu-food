import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/Components/ui/sheet";
import CouponList from "./Partials/CouponList";
import CouponForm from "./Partials/CouponForm";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import StatsCard from "@/Components/Admin/StatsCard";

const CouponsIndex = ({ coupons, filters, stats, can }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    setSelectedCoupon(null);
  };

  const statsConfig = [
    {
      title: "Total Coupons",
      value: stats.total,
      description: "Total number of coupons",
    },
    {
      title: "Active Coupons",
      value: stats.active,
      description: "Currently active coupons",
      trend: "up",
    },
    {
      title: "Expired Coupons",
      value: stats.expired,
      description: "Expired or fully used coupons",
      trend: "down",
    },
  ];

  return (
    <AdminLayout>
      <Head title="Coupons Management" />

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Coupons Management</h1>
          {/* {can.create && ( */}
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Coupon
            </Button>
          {/* )} */}
        </div>

        {/* Stats */}
        <StatsCard stats={statsConfig} />

        {/* Coupons List */}
        <CouponList
          coupons={coupons}
          filters={filters}
          onEdit={handleEdit}
          can={can}
        />

        {/* Form Sheet */}
        <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {selectedCoupon ? "Edit Coupon" : "Create New Coupon"}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <CouponForm
                coupon={selectedCoupon}
                isEditing={!!selectedCoupon}
                onCancel={() => setIsFormOpen(false)}
                onSuccess={handleSuccess}
                can={can}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </AdminLayout>
  );
};

export default CouponsIndex; 