import React from "react";
import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/Components/ui/use-toast";
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Tag,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Badge } from "@/Components/ui/badge";
import { router } from "@inertiajs/react";

const CouponList = ({ coupons, filters, onEdit, can }) => {
  const { toast } = useToast();

  // Filter configurations
  const filterConfigs = {
    status: {
      type: "select",
      label: "Status",
      options: [
        { label: "All Status", value: "" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Expired", value: "expired" },
        { label: "Scheduled", value: "scheduled" },
      ],
      defaultValue: "",
    },
    type: {
      type: "select",
      label: "Type",
      options: [
        { label: "All Types", value: "" },
        { label: "Percentage", value: "percentage" },
        { label: "Fixed", value: "fixed" },
      ],
      defaultValue: "",
    },
  };

  // Sort configurations
  const sortableConfigs = {
    code: {
      key: "code",
      defaultDirection: "asc",
      priority: 1,
    },
    value: {
      key: "value",
      defaultDirection: "desc",
      priority: 2,
    },
    created_at: {
      key: "created_at",
      defaultDirection: "desc",
      transform: (value) => new Date(value),
      format: (value) => format(new Date(value), "PPP"),
      priority: 3,
    },
  };

  // Column definitions
  const columns = [
    {
      id: "code",
      header: "Coupon Code",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Tag className="w-4 h-4 text-gray-400" />
          <div className="flex flex-col">
            <span className="font-medium uppercase">{row.code}</span>
            {row.description && (
              <span className="text-sm text-gray-500 line-clamp-1">
                {row.description}
              </span>
            )}
          </div>
        </div>
      ),
      sortable: true,
      sortConfig: sortableConfigs.code,
    },
    {
      id: "value",
      header: "Value",
      cell: (row) => (
        <span className="font-medium">
          {row.type === "percentage" ? `${row.value}%` : `$${row.value}`}
        </span>
      ),
      sortable: true,
      sortConfig: sortableConfigs.value,
    },
    {
      id: "usage",
      header: "Usage",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-sm">
            {row.used_count} / {row.max_uses || "∞"}
          </span>
          {row.max_uses && (
            <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1">
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${(row.used_count / row.max_uses) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
      ),
    },
    {
      id: "validity",
      header: "Validity",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          {row.start_date && (
            <span className="text-xs text-gray-500">
              From: {format(new Date(row.start_date), "PP")}
            </span>
          )}
          {row.end_date && (
            <span className="text-xs text-gray-500">
              Until: {format(new Date(row.end_date), "PP")}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        const statusConfig = {
          active: {
            label: "Active",
            className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
          },
          inactive: {
            label: "Inactive",
            className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
          },
          expired: {
            label: "Expired",
            className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
          },
          scheduled: {
            label: "Scheduled",
            className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
          },
        };

        const config = statusConfig[row.status];

        return (
          <Badge variant="outline" className={cn(config.className)}>
            {config.label}
          </Badge>
        );
      },
      filter: filterConfigs.status,
    },
    {
      id: "created_at",
      header: "Created At",
      cell: (row) => format(new Date(row.created_at), "PPP"),
      sortable: true,
      sortConfig: sortableConfigs.created_at,
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {can.edit && (
              <DropdownMenuItem onClick={() => onEdit(row)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            {can.edit && (
              <DropdownMenuItem onClick={() => handleToggleStatus(row)}>
                {row.is_active ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
            )}
            {can.delete && (
              <DropdownMenuItem
                onClick={() => handleDelete(row)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Action handlers
  const handleDelete = (row) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      router.delete(route("app.coupons.destroy", row.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Coupon deleted successfully",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to delete coupon",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleToggleStatus = (row) => {
    router.put(
      route("app.coupons.status", row.id),
      {
        is_active: !row.is_active,
      },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Coupon ${row.is_active ? "deactivated" : "activated"} successfully`,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update coupon status",
            variant: "destructive",
          });
        },
      }
    );
  };

  // DataTable hook
  const {
    selectedItems,
    filters: tableFilters,
    sorting,
    isLoading,
    handleFilterChange,
    handleSelectionChange,
    handlePageChange,
    handleSort,
  } = useDataTable({
    routeName: "app.coupons.index",
    initialFilters: filters,
    sortableConfigs,
    filterConfigs,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Operation completed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Operation failed",
        variant: "destructive",
      });
    },
  });

  // Add these bulk actions
  const bulkActions = [
    {
      id: "delete",
      label: "Delete",
      labelFull: "Delete Selected",
      icon: Trash2,
      variant: "destructive",
      confirmTitle: "Delete Coupons",
      confirmMessage:
        "Are you sure you want to delete the selected coupons? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    },
    {
      id: "activate",
      label: "Activate",
      labelFull: "Activate Selected",
      icon: Eye,
      variant: "default",
    },
    {
      id: "deactivate",
      label: "Deactivate",
      labelFull: "Deactivate Selected",
      icon: EyeOff,
      variant: "default",
    },
  ];

  // Update the handleBulkAction implementation
  const handleBulkAction = async (action, selectedIds) => {
    switch (action) {
      case "delete":
        router.delete(route("app.coupons.bulk-delete"), {
          data: { ids: selectedIds },
          preserveScroll: true,
        });
        break;
      case "activate":
        router.put(route("app.coupons.bulk-status"), {
          data: { ids: selectedIds, is_active: true },
          preserveScroll: true,
        });
        break;
      case "deactivate":
        router.put(route("app.coupons.bulk-status"), {
          data: { ids: selectedIds, is_active: false },
          preserveScroll: true,
        });
        break;
    }
  };

  return (
    <DataTable
      data={coupons.data}
      columns={columns}
      filters={tableFilters}
      filterConfigs={filterConfigs}
      onFilterChange={handleFilterChange}
      selectedItems={selectedItems}
      onSelectionChange={handleSelectionChange}
      sorting={sorting}
      onSort={handleSort}
      isLoading={isLoading}
      pagination={coupons.meta}
      onPageChange={handlePageChange}
      bulkActions={can.delete || can.edit ? bulkActions : []}
      onBulkAction={handleBulkAction}
      className="coupons-table"
      rowSelection={{
        enabled: true,
        selectionKey: "id",
      }}
    />
  );
};

export default CouponList; 