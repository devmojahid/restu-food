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
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { RowActions } from "@/Components/Table/RowActions";
import { format } from "date-fns";
import { router } from "@inertiajs/react";

export default function ListRoles({ roles }) {
  const { toast } = useToast();
  const params = new URLSearchParams(window.location.search);

  // Enhanced sortable configurations with more options
  const sortableConfigs = {
    name: {
      key: "name",
      defaultDirection: "asc",
      transform: (value) => value?.toLowerCase(),
      // Custom sort function if needed
      compare: (a, b) => a.localeCompare(b),
      // Priority for responsive design
      priority: 1,
    },
    created_at: {
      key: "created_at",
      defaultDirection: "desc",
      transform: (value) => new Date(value),
      // Format for display
      format: (value) => format(new Date(value), "PPP"),
      priority: 3,
    },
    users_count: {
      key: "users_count",
      defaultDirection: "desc",
      transform: (value) => Number(value || 0),
      // Custom formatter
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

  // Enhanced column definitions with more features
  const columns = [
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
      sortConfig: sortableConfigs.name,
      // Column specific features
      features: {
        search: true, // Enable searching in this column
        filter: true, // Enable filtering
        resize: true, // Enable column resizing
        hide: false, // Can be hidden in column visibility
      },
      // Responsive design
      responsive: {
        hidden: false, // Never hide this column
        priority: 1, // Highest priority
      },
      // Custom styling
      className: "min-w-[200px]",
      headerClassName: "font-bold",
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
      sortConfig: sortableConfigs.permissions_count,
      // Enhanced filtering options
      filter: {
        type: "select",
        options: [
          { label: "All", value: "" },
          { label: "With Permissions", value: "has_permissions" },
          { label: "No Permissions", value: "no_permissions" },
        ],
      },
      responsive: {
        hidden: "sm", // Hide on small screens
        priority: 2,
      },
    },
    {
      id: "users_count",
      header: "Users",
      cell: (row) => (
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 text-gray-500" />
          <span>{sortableConfigs.users_count.format(row.users_count)}</span>
        </div>
      ),
      sortable: true,
      sortConfig: sortableConfigs.users_count,
      // Conditional styling
      className: (row) => ({
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
      cell: (row) => sortableConfigs.created_at.format(row.created_at),
      sortable: true,
      sortConfig: sortableConfigs.created_at,
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
          row={row}
          actions={{
            view: "app.roles.show",
            edit: row.name ? "app.roles.edit" : null,
            delete: row.name ? "app.roles.destroy" : null,
            // edit: row.name !== "Admin" ? "app.roles.edit" : null,
            // delete: row.name !== "Admin" ? "app.roles.destroy" : null,
          }}
          // Enhanced custom actions
          customActions={[
            {
              id: "clone",
              label: "Clone Role",
              icon: Copy,
              onClick: (row) => handleCloneRole(row),
              show: (row) => row.name !== "Admin",
            },
            {
              id: "preview",
              label: "Preview",
              icon: Eye,
              onClick: (row) => handlePreviewRole(row),
            },
          ]}
          resourceName="role"
        />
      ),
    },
  ];

  // Custom action handlers
  const handleCloneRole = (role) => {
    router.post(
      route("app.roles.clone", role.id),
      {},
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Role "${role.name}" cloned successfully`,
          });
        },
      }
    );
  };

  const handlePreviewRole = (role) => {
    router.get(route("app.roles.preview", role.id));
  };

  // Enhanced bulk actions with more features
  const bulkActions = [
    {
      id: "delete",
      label: "Delete Selected",
      icon: Trash2,
      variant: "destructive",
      // Enhanced confirmation
      confirm: {
        title: "Delete Selected Roles",
        message: "Are you sure you want to delete the selected roles?",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
      // Conditional rendering
      show: (selected, data) => {
        const hasAdmin = selected.some(
          (id) => data.find((item) => item.id === id)?.name === "Admin"
        );
        return selected.length > 0 && !hasAdmin;
      },
    },
    {
      id: "activate",
      label: "Activate Selected",
      icon: CheckCircle,
      variant: "default",
    },
  ];

  // Initial filters with enhanced configuration
  const initialFilters = {
    search: params.get("search") || "",
    per_page: params.get("per_page") || "10",
    sort: params.get("sort") || sortableConfigs.created_at.key,
    direction:
      params.get("direction") || sortableConfigs.created_at.defaultDirection,
    // Additional filters
    status: params.get("status") || "",
    date_range: {
      from: params.get("date_from") || "",
      to: params.get("date_to") || "",
    },
  };

  const {
    selectedItems,
    filters,
    sorting,
    isLoading,
    handleFilterChange,
    handleBulkAction,
    handleSelectionChange,
    handlePageChange,
    handleSort,
  } = useDataTable({
    routeName: "app.roles.index",
    initialFilters,
    sortableConfigs,
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

  // Ensure roles data has default values
  const safeRoles = {
    data: roles?.data || [],
    current_page: roles?.current_page || 1,
    last_page: roles?.last_page || 1,
    per_page: roles?.per_page || 10,
    total: roles?.total || 0,
    from: roles?.from || 0,
    to: roles?.to || 0,
  };

  return (
    <DataTable
      data={safeRoles.data}
      columns={columns}
      filters={filters}
      onFilterChange={handleFilterChange}
      selectedItems={selectedItems}
      onSelectionChange={handleSelectionChange}
      bulkActions={bulkActions}
      onBulkAction={handleBulkAction}
      pagination={{
        currentPage: safeRoles.current_page,
        totalPages: safeRoles.last_page,
        perPage: safeRoles.per_page,
        total: safeRoles.total,
        from: safeRoles.from,
        to: safeRoles.to,
      }}
      onPageChange={handlePageChange}
      isLoading={isLoading}
      sorting={sorting}
      onSort={handleSort}
    />
  );
}
