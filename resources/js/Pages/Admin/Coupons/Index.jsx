import React, { useState, useCallback } from "react";
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
import { cn } from "@/lib/utils";

const CouponsIndex = ({ coupons, filters, stats, can }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEdit = useCallback((coupon) => {
    if (isProcessing) return;
    setSelectedCoupon(coupon);
    setIsFormOpen(true);
  }, [isProcessing]);

  const handleCreate = useCallback(() => {
    if (isProcessing) return;
    setSelectedCoupon(null);
    setIsFormOpen(true);
  }, [isProcessing]);

  const handleSuccess = useCallback(() => {
    setIsProcessing(true);
    setIsFormOpen(false);
    
    setTimeout(() => {
      setSelectedCoupon(null);
      setIsProcessing(false);
    }, 300);
  }, []);

  const handleClose = useCallback(() => {
    if (isProcessing) return;
    setIsFormOpen(false);
    setTimeout(() => {
      setSelectedCoupon(null);
    }, 300);
  }, [isProcessing]);

  const statsConfig = [
    {
      title: "Total Coupons",
      value: stats?.total ?? 0,
      description: "Total number of coupons",
      className: "bg-card hover:bg-accent/10 transition-colors",
    },
    {
      title: "Active Coupons",
      value: stats?.active ?? 0,
      description: "Currently active coupons",
      trend: "up",
      className: "bg-green-50/50 dark:bg-green-500/10 hover:bg-green-50 dark:hover:bg-green-500/20 transition-colors",
    },
    {
      title: "Expired Coupons",
      value: stats?.expired ?? 0,
      description: "Expired or fully used coupons",
      trend: "down",
      className: "bg-red-50/50 dark:bg-red-500/10 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors",
    },
  ];

  return (
    <AdminLayout>
      <Head title="Coupons Management" />

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Coupons Management</h1>
          <Button 
            onClick={handleCreate}
            disabled={isProcessing}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
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

        {/* Form Sheet - Updated with better responsive styles */}
        <Sheet 
          open={isFormOpen} 
          onOpenChange={(open) => {
            if (!isProcessing) {
              if (!open) {
                handleClose();
              } else {
                setIsFormOpen(true);
              }
            }
          }}
        >
          <SheetContent 
            side="right"
            className={cn(
              "w-full p-0",
              "lg:w-[85vw] xl:w-[75vw] 2xl:w-[65vw]",
              "!max-w-none",
            )}
          >
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-hidden">
                {isFormOpen && (
                  <CouponForm
                    key={`coupon-form-${selectedCoupon?.id || 'new'}-${Date.now()}`}
                    coupon={selectedCoupon}
                    isEditing={!!selectedCoupon}
                    onCancel={handleClose}
                    onSuccess={handleSuccess}
                    can={can}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                  />
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </AdminLayout>
  );
};

export default CouponsIndex; 