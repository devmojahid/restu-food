import React, { useCallback } from "react";
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
  Copy,
  Users,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import { Badge } from "@/Components/ui/badge";
import { router, Link } from "@inertiajs/react";

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

  // Add copy to clipboard function
  const handleCopyCode = useCallback(async (code) => {
    try {
        // Use modern clipboard API with fallback
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(code);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = code;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
            } finally {
                textArea.remove();
            }
        }
        
        toast({
            title: "Copied!",
            description: `Coupon code "${code}" copied to clipboard`,
            duration: 3000,
        });
    } catch (err) {
        console.error('Copy failed:', err);
        toast({
            title: "Error",
            description: "Failed to copy code. Please try manually copying.",
            variant: "destructive",
            duration: 3000,
        });
    }
  }, [toast]);

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

        const config = statusConfig[row.status] || {
          label: row.status?.charAt(0).toUpperCase() + row.status?.slice(1) || 'Unknown',
          className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        };

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
      cell: (row) => <ActionMenu row={row} />,
    },
  ];

  // Action handlers
  const handleDelete = useCallback((row) => {
    if (confirm(`Are you sure you want to delete coupon "${row.code}"?`)) {
        router.delete(route("app.coupons.destroy", row.id), {
            preserveScroll: true,
            preserveState: true,
            onBefore: () => {
                toast({
                    title: "Deleting...",
                    description: "Please wait while we delete the coupon.",
                });
            },
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Coupon deleted successfully",
                });
            },
            onError: (error) => {
                toast({
                    title: "Error",
                    description: error.message || "Failed to delete coupon",
                    variant: "destructive",
                });
            },
        });
    }
  }, [router, toast]);

  const handleToggleStatus = useCallback((row) => {
    const newStatus = !row.is_active;
    const action = newStatus ? 'activate' : 'deactivate';
    
    if (confirm(`Are you sure you want to ${action} coupon "${row.code}"?`)) {
        router.put(
            route("app.coupons.status", row.id),
            { is_active: newStatus },
            {
                preserveScroll: true,
                preserveState: true,
                onBefore: () => {
                    toast({
                        title: "Updating...",
                        description: `Please wait while we ${action} the coupon.`,
                    });
                },
                onSuccess: () => {
                    toast({
                        title: "Success",
                        description: `Coupon ${action}d successfully`,
                    });
                },
                onError: (error) => {
                    toast({
                        title: "Error",
                        description: error.message || `Failed to ${action} coupon`,
                        variant: "destructive",
                    });
                },
            }
        );
    }
  }, [router, toast]);

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

  // Update the actions menu
  const ActionMenu = ({ row }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                aria-label="Open menu"
            >
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCopyCode(row.code);
                }}
                className="cursor-pointer"
            >
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
            </DropdownMenuItem>

            {/* {can.edit && ( */}
                <>
                    <DropdownMenuItem 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEdit(row);
                        }}
                        className="cursor-pointer"
                    >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleStatus(row);
                        }}
                        className={cn(
                            "cursor-pointer",
                            row.is_active ? "hover:bg-red-50" : "hover:bg-green-50"
                        )}
                    >
                        {row.is_active ? (
                            <>
                                <EyeOff className="h-4 w-4 mr-2 text-red-500" />
                                <span className="text-red-600">Deactivate</span>
                            </>
                        ) : (
                            <>
                                <Eye className="h-4 w-4 mr-2 text-green-500" />
                                <span className="text-green-600">Activate</span>
                            </>
                        )}
                    </DropdownMenuItem>
                </>
            {/* )} */}

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link 
                href={route('app.coupons.usage', row.id)}
                className="flex items-center"
              >
                <Users className="h-4 w-4 mr-2" />
                View Usage
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link 
                href={route('app.coupons.settings', row.id)}
                className="flex items-center"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>

            {/* {can.delete && ( */}
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onClick={() => handleDelete(row)}
                        className="text-red-600 cursor-pointer"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </>
            {/* )} */}
        </DropdownMenuContent>
    </DropdownMenu>
  );

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