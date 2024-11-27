import React, { useMemo } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { format } from "date-fns";
import { DataTable } from "@/Components/Table/DataTable";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Users, DollarSign, Tag, Calendar } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { cn } from "@/lib/utils";

const CouponUsage = ({ coupon, usage, stats }) => {
  const columns = useMemo(() => [
    {
      id: "user",
      header: "User",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
          <span className="text-sm text-muted-foreground">{row.email}</span>
        </div>
      ),
    },
    {
      id: "order",
      header: "Order ID",
      cell: (row) => (
        <div className="font-mono">
          {row.pivot.order_id ? (
            <Link 
              href={route('app.orders.show', row.pivot.order_id)}
              className="text-primary hover:underline"
            >
              #{row.pivot.order_id}
            </Link>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          )}
        </div>
      ),
    },
    {
      id: "discount",
      header: "Discount Amount",
      cell: (row) => (
        <div className="font-medium text-green-600">
          ${parseFloat(row.pivot.discount_amount).toFixed(2)}
        </div>
      ),
    },
    {
      id: "used_at",
      header: "Used At",
      cell: (row) => (
        <div className="flex flex-col">
          <span>{format(new Date(row.pivot.created_at), "PPP")}</span>
          <span className="text-sm text-muted-foreground">
            {format(new Date(row.pivot.created_at), "p")}
          </span>
        </div>
      ),
    },
  ], []);

  const statsCards = [
    {
      title: "Total Uses",
      value: `${stats.total_uses} / ${stats.max_uses || '∞'}`,
      icon: Tag,
      description: "Total times this coupon has been used",
      className: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Total Discount Given",
      value: `$${parseFloat(stats.total_discount).toFixed(2)}`,
      icon: DollarSign,
      description: "Total discount amount provided",
      className: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Unique Users",
      value: stats.unique_users,
      icon: Users,
      description: "Number of unique users",
      className: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <AdminLayout>
      <Head title={`Coupon Usage - ${coupon.code}`} />

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href={route('app.coupons.index')}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-semibold">Coupon Usage</h1>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">
                Usage history for coupon:
              </p>
              <Badge variant="outline" className="font-mono">
                {coupon.code}
              </Badge>
              <Badge variant={coupon.is_active ? "success" : "secondary"}>
                {coupon.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {statsCards.map((stat, index) => (
            <Card key={index} className={cn("", stat.className)}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Usage Table */}
        <Card>
          <CardContent className="p-6">
            <DataTable
              data={usage.data}
              columns={columns}
              pagination={usage.meta}
              className="usage-table"
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CouponUsage; 