import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/Components/ui/use-toast";
import {
  ShieldCheck,
  Users,
  Trash2,
  CheckCircle,
  Copy,
  Eye,
  Pencil,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/Components/ui/badge";
import { RowActions } from "@/Components/Table/RowActions";
import { format } from "date-fns";
import { router } from "@inertiajs/react";
import { useState, useMemo, useCallback } from "react";

// Constants for better maintainability
const SORT_CONFIG = {
  name: {
    key: "name",
    defaultDirection: "asc",
    transform: (value) => value?.toLowerCase(),
    priority: 1,
  },
  created_at: {
    key: "created_at",
    defaultDirection: "desc",
    transform: (value) => new Date(value),
    format: (value) => format(new Date(value), "PPP"),
    priority: 3,
  },
  users_count: {
    key: "users_count",
    defaultDirection: "desc",
    transform: (value) => Number(value || 0),
    format: (value) => `${value} ${value === 1 ? "User" : "Users"}`,
    priority: 2,
  },
  permissions_count: {
    key: "permissions_count",
    defaultDirection: "desc",
    transform: (value) => value?.length || 0,
    format: (value) => `${value} Permissions`,
    priority: 2,
  },
};

const FILTER_CONFIGS = {
  permission: {
    type: "select",
    label: "Permissions",
    options: [
      { label: "All", value: "" },
      { label: "With Permissions", value: "has_permissions" },
      { label: "No Permissions", value: "no_permissions" },
    ],
    defaultValue: "",
  }
};

const BULK_ACTIONS = [
  {
    label: "Delete Selected",
    icon: Trash2,
    value: "delete",
    variant: "destructive",
  }
];


export default function ListRoles({ roles, meta = {}, stats = {}, filters: initialFilters = {} }) {
  const { toast } = useToast();
  const [enablePolling, setEnablePolling] = useState(false);


  // Ensure data has the correct structure
  const safeRoles = useMemo(() => roles?.data || [], [roles]);

  // Enhanced columns with better responsive design
  const columns = useMemo(() => [
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <div className="flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-blue-500" />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
      sortable: true,
      sortConfig: SORT_CONFIG.name,
      // Column specific features
      features: {
        search: true,
        filter: true,
        resize: true,
        hide: false,
      },
      responsive: {
        hidden: false,
        priority: 1,
      },
      className: "min-w-[200px]",
    },
    {
      id: "permissions_count",
      header: "Permissions",
      cell: (row) => (
        <Badge
          variant={row.permissions?.length > 0 ? "secondary" : "outline"}
          className="font-medium"
        >
          {row.permissions?.length || 0} Permissions
        </Badge>
      ),
      sortable: true,
      sortConfig: SORT_CONFIG.permissions_count,
      filter: {
        type: "select",
        options: FILTER_CONFIGS.permission.options,
      },
      responsive: {
        hidden: "sm",
        priority: 2,
      },
    },
    {
      id: "users_count",
      header: "Users",
      cell: (row) => (
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 text-gray-500" />
          <span>{row.users_count || 0} {row.users_count === 1 ? "User" : "Users"}</span>
        </div>
      ),
      sortable: true,
      sortConfig: SORT_CONFIG.users_count,
      className: (row) => cn({
        "text-red-500": row.users_count === 0,
        "text-green-500": row.users_count > 5,
      }),
      responsive: {
        hidden: "sm",
        priority: 2,
      },
    },
    {
      id: "created_at",
      header: "Created At",
      cell: (row) => format(new Date(row.created_at), "PPP"),
      sortable: true,
      sortConfig: SORT_CONFIG.created_at,
      responsive: {
        hidden: "md",
        priority: 3,
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <RowActions
          actions={[
            {
              label: "View Role",
              icon: Eye,
              onClick: () => handleView(row),
              className: "text-blue-600 hover:text-blue-800",
              show: () => true,
            },
            {
              label: "Edit Role",
              icon: Pencil,
              onClick: () => handleEdit(row),
              className: "text-green-600 hover:text-green-800",
              show: (r) => r.name !== "Admin", // Disable editing for Admin role
            },
            {
              label: "Clone Role",
              icon: Copy,
              onClick: (r) => handleCloneRole(r),
              className: "text-orange-600 hover:text-orange-800",
              show: (r) => r.name !== "Admin", // Disable cloning for Admin role
            },
            {
              label: "Delete",
              icon: Trash2,
              onClick: (r) => handleDelete(r),
              className: "text-red-600 hover:text-red-800",
              show: (r) => r.name !== "Admin", // Disable deletion for Admin role
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
  ], []);


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
    routeName: "app.roles.index",
    dataKey: 'roles', // ← This is the key! Must match your controller prop name
    initialFilters: {
      search: initialFilters.search || "",
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

  // Handle the view action
  const handleView = useCallback((row) => {
    router.get(route("app.roles.show", row.id));
  }, []);


  const handleEdit = useCallback((row) => {
    router.get(route("app.roles.edit", row.id));
  }, []);

  const handleCloneRole = useCallback((role) => {
    router.post(
      route("app.roles.clone", role.id),
      {},
      {
        onSuccess: () => {
          toast("Success", `Role "${role.name}" cloned successfully`);
          handleRefresh();
        },
        onError: (error) => {
          toast("Error", error?.message || "Failed to clone role", "destructive");
        },
      }
    );
  }, []);

  const handleDelete = useCallback((row) => {
    if (confirm(`Are you sure you want to delete ${row.name}?`)) {
      router.delete(route("app.roles.destroy", row.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast("Success", "Role deleted successfully");
          handleRefresh();
        },
        onError: (error) => {
          toast("Error", error?.message || "Failed to delete role", "destructive");
        },
      });
    }
  }, []);

  const handleTogglePolling = useCallback(() => {
    const newPollingState = !enablePolling;
    setEnablePolling(newPollingState);

    const currentParams = new URLSearchParams(window.location.search);

    if (newPollingState) {
      currentParams.set('polling', '30000');
    } else {
      currentParams.delete('polling');
    }

    const newUrl = window.location.pathname +
      (currentParams.toString() ? '?' + currentParams.toString() : '');

    router.get(newUrl, {}, {
      preserveState: true,
      preserveScroll: true,
      only: ['roles', 'meta']
    });
  }, [enablePolling]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    return router.reload({
      only: ['roles', 'meta'],
      preserveScroll: true,
      preserveState: true
    });
  }, []);

  const handleBulkAction = useCallback((action) => {
    if (action === 'delete') {
      handleBulkDelete(selectedItems);
    } else {
      handleBulkActionFromHook(action);
    }
  }, [selectedItems, handleBulkActionFromHook]);

  // Handle bulk delete
  const handleBulkDelete = useCallback((selected) => {
    if (!selected || selected.length === 0) return;

    if (confirm(`Are you sure you want to delete the selected roles?`)) {
      router.delete(route("app.roles.bulk-delete"), {
        data: { ids: selected },
        preserveScroll: true,
        onSuccess: () => {
          toast("Success", `${selected.length} roles deleted successfully`);
          handleSelectionChange([]);
          handleRefresh();
        },
        onError: (error) => {
          toast("Error", error?.message || "Failed to delete roles", "destructive");
        },
      });
    }
  }, [handleSelectionChange, handleRefresh, toast]);


  // Render the filters component
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

  return (
    <div className="space-y-4">
      {renderFilters()}
      <DataTable
        data={safeRoles}
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
