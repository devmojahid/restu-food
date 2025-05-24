import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/Components/ui/use-toast";
import { Trash2, UserX2, UserCheck2, Pencil, Eye, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { router, usePage } from "@inertiajs/react";
import { LazyImage } from "@/Components/Table/LazyImage";
import { format, subDays } from "date-fns";
import { RowActions } from "@/Components/Table/RowActions";
import { useState, useMemo, useCallback } from "react";

// ====================================
// CONSTANTS FOR BETTER MAINTAINABILITY
// ====================================

// Sort configurations for all sortable columns
const SORT_CONFIG = {
  name: {
    key: "name",
    defaultDirection: "asc",
    transform: (value) => value?.toLowerCase(),
    priority: 1,
  },
  email: {
    key: "email",
    defaultDirection: "asc",
    transform: (value) => value?.toLowerCase(),
    priority: 2,
  },
  created_at: {
    key: "created_at",
    defaultDirection: "desc",
    transform: (value) => new Date(value),
    format: (value) => format(new Date(value), "PPP"),
    priority: 3,
  },
  status: {
    key: "status",
    defaultDirection: "desc",
    transform: (value) => String(value).toLowerCase(),
    priority: 2,
  },
};

// Filter configurations for all filterable columns
const FILTER_CONFIGS = {
  status: {
    type: "select",
    label: "Status",
    options: [
      { label: "All Status", value: "" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Banned", value: "banned" },
    ],
    defaultValue: "",
    transform: (value) => value?.toLowerCase(),
    format: (value) => value?.charAt(0).toUpperCase() + value?.slice(1),
  },
  verified: {
    type: "select",
    label: "Verified Status",
    options: [
      { label: "All", value: "" },
      { label: "Verified", value: "1" },
      { label: "Unverified", value: "0" },
    ],
    defaultValue: "",
  },
  date_range: {
    type: "date-range",
    label: "Date Range",
    defaultValue: {
      from: "",
      to: "",
    },
    transform: (value) => ({
      from: value.from ? format(new Date(value.from), "yyyy-MM-dd") : "",
      to: value.to ? format(new Date(value.to), "yyyy-MM-dd") : "",
    }),
  },
};

// Bulk actions available for selected items
const BULK_ACTIONS = [
  {
    label: "Delete Selected",
    icon: Trash2,
    value: "delete",
    variant: "destructive",
  }
];


export default function ListUsers({ users, roles, meta, filters: initialFilters = {} }) {
  console.log(users);
  const { toast } = useToast();
  const [enablePolling, setEnablePolling] = useState(false);

  const safeUsers = useMemo(() => users?.data || [], [users]);

  // Build role filter options dynamically from props
  const roleFilterOptions = useMemo(() => [
    { label: "All Roles", value: "" },
    ...roles.map((role) => ({
      label: role.name,
      value: role.name.toLowerCase(),
    })),
  ], [roles]);

  // Enhanced responsive design for status badges
  const getStatusConfig = (status) =>
  ({
    active: {
      className: cn(
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        "whitespace-nowrap text-xs sm:text-sm",
        "px-2 py-1 sm:px-3 sm:py-1.5"
      ),
      label: "Active",
    },
    inactive: {
      className: cn(
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        "whitespace-nowrap text-xs sm:text-sm",
        "px-2 py-1 sm:px-3 sm:py-1.5"
      ),
      label: "Inactive",
    },
    banned: {
      className: cn(
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        "whitespace-nowrap text-xs sm:text-sm",
        "px-2 py-1 sm:px-3 sm:py-1.5"
      ),
      label: "Banned",
    },
  }[status || "inactive"]);

  // Enhanced columns with better responsive design
  const columns = useMemo(() => [
    {
      id: "avatar",
      header: "",
      cell: (row) => (
        <div className="flex justify-center sm:justify-start">
          <LazyImage
            src={row.avatar?.url || "/images/avatar.jpg"}
            alt={row.name}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />
        </div>
      ),
      className: "w-[50px] sm:w-[60px]",
      responsive: {
        hidden: false,
        priority: 1,
      },
    },
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {row.name}
        </div>
      ),
      sortable: true,
      sortConfig: SORT_CONFIG.name,
      features: {
        search: true,
        filter: true,
        resize: true,
        hide: false,
      },
      className: "min-w-[200px]",
    },
    {
      id: "email",
      header: "Email",
      cell: (row) => row.email,
      sortable: true,
      sortConfig: SORT_CONFIG.email,
      features: {
        search: true,
        filter: true,
      },
      responsive: {
        hidden: "sm",
        priority: 2,
      },
      className: "min-w-[200px]",
    },
    {
      id: "roles",
      header: "Roles",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.roles?.map((role) => (
            <span
              key={role.id}
              className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {role.name}
            </span>
          ))}
        </div>
      ),
      filter: {
        type: "select",
        options: roleFilterOptions,
      },
      responsive: {
        hidden: "lg",
        priority: 3,
      },
      className: "min-w-[150px]",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        const config = getStatusConfig(row.status);
        return (
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-full",
              config.className
            )}
          >
            {config.label}
          </span>
        );
      },
      sortable: true,
      sortConfig: SORT_CONFIG.status,
      filter: {
        type: "select",
        options: FILTER_CONFIGS.status.options,
      },
      responsive: {
        hidden: "md",
        priority: 2,
      },
      className: "min-w-[100px]",
    },
    {
      id: "created_at",
      header: "Created At",
      cell: (row) => format(new Date(row.created_at), "PPP"),
      sortable: true,
      sortConfig: SORT_CONFIG.created_at,
      responsive: {
        hidden: "md",
        priority: 4,
      },
      className: "min-w-[180px]",
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <RowActions
          actions={[
            {
              label: "View User",
              icon: Eye,
              onClick: () => handleView(row),
              className: "text-blue-600 hover:text-blue-800",
            },
            {
              label: "Edit User",
              icon: Pencil,
              onClick: () => handleEdit(row),
              className: "text-green-600 hover:text-green-800",
            },
            {
              label: row.status === "active" ? "Deactivate" : "Activate",
              icon: row.status === "active" ? UserX2 : UserCheck2,
              onClick: () => handleStatusToggle(row),
              className:
                row.status === "active"
                  ? "text-yellow-600 hover:text-yellow-800"
                  : "text-green-600 hover:text-green-800",
            },
            {
              label: "Delete",
              icon: Trash2,
              onClick: () => handleDelete(row),
              className: "text-red-600 hover:text-red-800",
            },
          ]}
        />
      ),
      className: "w-[80px] sm:w-[100px]",
      responsive: {
        hidden: false,
        priority: 1,
      },
    },
  ], [roleFilterOptions, getStatusConfig]);

  // Toggle real-time polling on/off
  const handleTogglePolling = () => {
    if (enablePolling) {
      // Turn off polling
      setEnablePolling(false);

      // Reset the URL to remove polling parameter
      const newUrl = window.location.pathname +
        window.location.search.replace(/([?&])polling=\d+(&|$)/, '$1').replace(/\?$/, '');

      router.get(newUrl, {}, {
        preserveState: true,
        preserveScroll: true,
        only: ['users', 'meta']
      });
    } else {
      // Turn on polling (every 30 seconds)
      setEnablePolling(true);

      // Add polling parameter to URL
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set('polling', '30000');

      router.get(
        window.location.pathname + '?' + currentParams.toString(),
        {},
        {
          preserveState: true,
          preserveScroll: true,
          only: ['users', 'meta']
        }
      );
    }
  };

  // Initialize the data table hook with required configurations
  const {
    selectedItems,
    filters,
    sorting: tableSorting,
    isLoading,
    isLoadingMore,
    hasMoreData,
    loadMoreData,
    handleFilterChange,
    handleBulkAction: handleBulkActionFromHook,
    handleSelectionChange,
    handleSort,
    currentPage,
    dataCache,
    meta: tableMeta,
  } = useDataTable({
    routeName: "app.users.index",
    dataKey: 'users', // ← This is the key! Must match your controller prop name
    initialFilters: {
      search: initialFilters.search || "",
      role: initialFilters.role || "",
      status: initialFilters.status || "",
      date_from: initialFilters.date_from || "",
      date_to: initialFilters.date_to || "",
      verified: initialFilters.verified || "",
      sort: initialFilters.sort || "created_at",
      direction: initialFilters.direction || "desc",
      per_page: initialFilters.per_page || 10,
      ...initialFilters
    },
    onSuccess: () => {
      // Handle success if needed
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message || "An error occurred while fetching data",
        variant: "destructive",
      });
    },
    // Use polling from the server configuration or from our local state
    pollingOptions: enablePolling ? { interval: 30000 } : null,
    enablePrefetch: true, // Enable prefetching for better performance
  });

  // ====================================
  // ACTION HANDLERS
  // ====================================


  // Handle row actions
  const handleView = useCallback((row) => {
    router.get(route("app.users.show", row.id));
  }, []);

  const handleEdit = useCallback((row) => {
    router.get(route("app.users.edit", row.id));
  }, []);

  const handleDelete = useCallback((row) => {
    if (confirm(`Are you sure you want to delete ${row.name}?`)) {
      router.delete(route("app.users.destroy", row.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: "User deleted successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error?.message || "Failed to delete user",
            variant: "destructive",
          });
        },
      });
    }
  }, []);

  const handleStatusToggle = useCallback((row) => {
    const newStatus = row.status === "active" ? "inactive" : "active";
    router.put(
      route("app.users.status", row.id),
      { status: newStatus },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: `User ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
          });
          handleRefresh();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error?.message || "Failed to update user status",
            variant: "destructive",
          });
        },
      }
    );
  }, []);

  // Handle refresh - manual data reload
  const handleRefresh = useCallback(() => {
    console.log("refresh");
    return router.reload({
      only: ['users', 'meta'],
      preserveScroll: true,
      preserveState: true
    });
  }, []);

  // ====================================
  // BULK ACTION HANDLERS
  // ====================================

  const handleBulkAction = useCallback((action) => {
    switch (action) {
      case 'delete':
        handleBulkDelete(selectedItems);
        break;
      case 'activate':
        handleBulkStatusChange(selectedItems, 'active');
        break;
      case 'deactivate':
        handleBulkStatusChange(selectedItems, 'inactive');
        break;
      default:
        handleBulkActionFromHook(action);
    }
  }, [selectedItems, handleBulkActionFromHook]);

  // Bulk delete users
  const handleBulkDelete = useCallback((selected) => {
    if (!selected || selected.length === 0) return;

    if (confirm(`Are you sure you want to delete ${selected.length} selected users?`)) {
      router.delete(route("app.users.bulk-delete"), {
        data: { ids: selected },
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: `${selected.length} users deleted successfully`,
          });
          handleSelectionChange([]);
          handleRefresh();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error?.message || "Failed to delete users",
            variant: "destructive",
          });
        },
      });
    }
  }, [handleSelectionChange, handleRefresh, toast]);

  // Bulk status change
  const handleBulkStatusChange = useCallback((selected, status) => {
    if (!selected || selected.length === 0) return;

    const actionText = status === 'active' ? 'activate' : 'deactivate';

    if (confirm(`Are you sure you want to ${actionText} ${selected.length} selected users?`)) {
      router.put(route("app.users.bulk-status"), {
        data: {
          ids: selected,
          status: status
        },
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: `${selected.length} users ${actionText}d successfully`,
          });
          handleSelectionChange([]);
          handleRefresh();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error?.message || `Failed to ${actionText} users`,
            variant: "destructive",
          });
        },
      });
    }
  }, [handleSelectionChange, handleRefresh, toast]);

  // ====================================
  // FILTER COMPONENT RENDERER
  // ====================================

  const renderFilters = useCallback(() => (
    <div className="flex flex-col sm:flex-row gap-4 mb-4 hidden">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handleTogglePolling}
          className={cn(
            "flex items-center space-x-1 px-3 py-1 rounded-md text-sm",
            enablePolling
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
          )}
        >
          <RefreshCw
            className={cn(
              "h-4 w-4",
              enablePolling && "animate-spin"
            )}
          />
          <span>{enablePolling ? "Polling Active" : "Enable Polling"}</span>
        </button>
      </div>
    </div>
  ), [enablePolling, handleTogglePolling]);

  // ====================================
  // MAIN RENDER
  // ====================================

  // Render the data table with all the configurations
  return (
    <div className="space-y-4">
      {renderFilters()}
      <DataTable
        data={users?.data || []}
        columns={columns}
        filters={filters}
        onFilterChange={handleFilterChange}
        selectedItems={selectedItems}
        onSelectionChange={handleSelectionChange}
        bulkActions={BULK_ACTIONS}
        onBulkAction={handleBulkAction}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMoreData={hasMoreData}
        onLoadMore={loadMoreData}
        sorting={tableSorting}
        onSort={handleSort}
        currentPage={currentPage}
        meta={tableMeta || meta}
        onRefresh={handleRefresh}
        keyField="id"
        dataCache={dataCache}
        showLastUpdated={true}
      />
    </div>
  );
}
