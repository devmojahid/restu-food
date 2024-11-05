import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/Components/ui/use-toast";
import { Trash2, UserX2, UserCheck2, Pencil, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import { LazyImage } from "@/Components/Table/LazyImage";
import { format, subDays } from "date-fns";
import { RowActions } from "@/Components/Table/RowActions";

export default function ListUsers({ users, roles }) {
  const { toast } = useToast();
  const params = new URLSearchParams(window.location.search);

  // Define filter configurations
  const filterConfigs = {
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
      // Optional: Transform value before sending to backend
      transform: (value) => value?.toLowerCase(),
      // Optional: Format value for display
      format: (value) => value?.charAt(0).toUpperCase() + value?.slice(1),
    },
    role: {
      type: "select",
      label: "Role",
      options: [
        { label: "All Roles", value: "" },
        ...roles.map((role) => ({
          label: role.name,
          value: role.name.toLowerCase(),
        })),
      ],
      defaultValue: "",
      transform: (value) => value?.toLowerCase(),
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
  };

  // Enhanced sortable configurations
  const sortableConfigs = {
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
      format: (value) => filterConfigs.status.format(value),
      priority: 2,
    },
  };

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
  const columns = [
    {
      id: "avatar",
      header: "",
      cell: (row) => (
        <div className="flex justify-center sm:justify-start">
          <LazyImage
            src={row.avatar?.url || "/images/default-avatar.png"}
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
      sortConfig: sortableConfigs.name,
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
      sortConfig: sortableConfigs.email,
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
          {row.roles.map((role) => (
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
        options: [
          { label: "All Roles", value: "" },
          ...roles.map((role) => ({
            label: role.name,
            value: role.name,
          })),
        ],
      },
      responsive: {
        hidden: "md",
        priority: 3,
      },
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        const config = getStatusConfig(row.status?.toLowerCase());
        return (
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-full font-medium",
              "transition-all duration-200",
              config.className
            )}
          >
            {config.label}
          </span>
        );
      },
      sortable: true,
      sortConfig: sortableConfigs.status,
      filter: filterConfigs.status,
      responsive: {
        hidden: "sm",
        priority: 2,
      },
      className: "text-center sm:text-left",
    },
    {
      id: "created_at",
      header: "Created At",
      cell: (row) => sortableConfigs.created_at.format(row.created_at),
      sortable: true,
      sortConfig: sortableConfigs.created_at,
      responsive: {
        hidden: "lg",
        priority: 4,
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <RowActions
          row={row}
          actions={{
            view: "app.users.show",
            edit: "app.users.edit",
            delete: "app.users.destroy",
          }}
          resourceName="user"
        />
      ),
      width: "100px",
      responsive: {
        hidden: false,
        priority: 1,
      },
    },
  ];

  // Enhanced filter presets with proper date handling
  const filterPresets = {
    recentlyActive: {
      label: "Recently Active",
      filters: {
        status: "active",
        date_range: {
          from: format(subDays(new Date(), 7), "yyyy-MM-dd"),
          to: format(new Date(), "yyyy-MM-dd"),
        },
      },
    },
    lastMonth: {
      label: "Last Month",
      filters: {
        date_range: {
          from: format(subDays(new Date(), 30), "yyyy-MM-dd"),
          to: format(new Date(), "yyyy-MM-dd"),
        },
      },
    },
    inactiveUsers: {
      label: "Inactive Users",
      filters: {
        status: "inactive",
      },
    },
  };

  // Enhanced mobile responsiveness for bulk actions
  const bulkActions = [
    {
      id: "delete",
      label: "Delete",
      labelFull: "Delete Selected", // Full label for larger screens
      icon: Trash2,
      variant: "destructive",
      confirm: {
        title: "Delete Selected Users",
        message: "Are you sure you want to delete the selected users?",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
      className: "sm:w-auto w-full",
    },
    {
      id: "activate",
      label: "Activate",
      labelFull: "Activate Selected",
      icon: UserCheck2,
      variant: "default",
      className: "sm:w-auto w-full",
    },
    {
      id: "deactivate",
      label: "Deactivate",
      labelFull: "Deactivate Selected",
      icon: UserX2,
      variant: "default",
      className: "sm:w-auto w-full",
    },
  ];

  // Initial filters with enhanced configuration
  const initialFilters = {
    search: params.get("search") || "",
    per_page: params.get("per_page") || "10",
    sort: params.get("sort") || sortableConfigs.created_at.key,
    direction:
      params.get("direction") || sortableConfigs.created_at.defaultDirection,
    // Add all filter initial values
    status: params.get("status") || filterConfigs.status.defaultValue,
    role: params.get("role") || filterConfigs.role.defaultValue,
    verified: params.get("verified") || filterConfigs.verified.defaultValue,
    date_range: {
      from: params.get("date_from") || "",
      to: params.get("date_to") || "",
    },
  };

  // Custom filter components (optional)
  const customFilterComponents = {
    dateRange: ({ value, onChange }) => (
      // Your custom date range component
      <DateRangePicker value={value} onChange={onChange} className="w-full" />
    ),
    // Add more custom filter components as needed
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
    routeName: "app.users.index",
    initialFilters,
    sortableConfigs,
    filterConfigs, // Pass filter configurations
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

  // Ensure users data has default values
  const safeUsers = {
    data: users?.data || [],
    current_page: users?.current_page || 1,
    last_page: users?.last_page || 1,
    per_page: users?.per_page || 10,
    total: users?.total || 0,
    from: users?.from || 0,
    to: users?.to || 0,
  };

  return (
    <DataTable
      data={safeUsers.data}
      columns={columns}
      filters={filters}
      filterConfigs={filterConfigs}
      customFilterComponents={customFilterComponents}
      filterPresets={filterPresets}
      onFilterChange={handleFilterChange}
      selectedItems={selectedItems}
      onSelectionChange={handleSelectionChange}
      bulkActions={bulkActions}
      onBulkAction={handleBulkAction}
      pagination={{
        currentPage: safeUsers.current_page,
        totalPages: safeUsers.last_page,
        perPage: safeUsers.per_page,
        total: safeUsers.total,
        from: safeUsers.from,
        to: safeUsers.to,
      }}
      onPageChange={handlePageChange}
      isLoading={isLoading}
      sorting={sorting}
      onSort={handleSort}
      // Enhanced responsive props
      responsive={{
        breakpoints: {
          sm: 640,
          md: 768,
          lg: 1024,
          xl: 1280,
        },
        defaultHidden: ["created_at", "email"],
        stackedOnMobile: true,
      }}
      className="max-w-full overflow-x-auto"
    />
  );
}
