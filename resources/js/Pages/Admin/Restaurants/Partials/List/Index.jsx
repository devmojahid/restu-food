import React from "react";
import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/Components/ui/use-toast";
import { Store, MapPin, Phone, Mail, Globe, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { LazyImage } from "@/Components/Table/LazyImage";
import { format } from "date-fns";
import { RowActions } from "@/Components/Table/RowActions";

export default function ListRestaurants({ restaurants }) {
  const { toast } = useToast();
  const params = new URLSearchParams(window.location.search);

  // Filter configurations
  const filterConfigs = {
    status: {
      type: "select",
      label: "Status",
      options: [
        { label: "All Status", value: "" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
        { label: "Suspended", value: "suspended" },
      ],
      defaultValue: "",
    },
    is_featured: {
      type: "select",
      label: "Featured",
      options: [
        { label: "All", value: "" },
        { label: "Featured", value: "1" },
        { label: "Not Featured", value: "0" },
      ],
      defaultValue: "",
    },
  };

  // Sortable configurations
  const sortableConfigs = {
    name: {
      key: "name",
      defaultDirection: "asc",
    },
    created_at: {
      key: "created_at",
      defaultDirection: "desc",
      format: (value) => format(new Date(value), "PPP"),
    },
    status: {
      key: "status",
      defaultDirection: "asc",
    },
  };

  // Status badge configuration
  const getStatusConfig = (status) => ({
    active: {
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      label: "Active",
    },
    inactive: {
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      label: "Inactive",
    },
    pending: {
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      label: "Pending",
    },
    suspended: {
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      label: "Suspended",
    },
  }[status || "pending"]);

  // Table columns configuration
  const columns = [
    {
      id: "logo",
      header: "",
      cell: (row) => (
        <div className="flex justify-center sm:justify-start">
          <LazyImage
            src={row.logo?.url || "/images/default-restaurant.png"}
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      ),
      className: "w-[60px]",
    },
    {
      id: "name",
      header: "Restaurant",
      cell: (row) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {row.name}
          </div>
          <div className="text-sm text-muted-foreground flex items-center">
            <Globe className="w-3 h-3 mr-1" />
            {row.slug}
          </div>
        </div>
      ),
      sortable: true,
      sortConfig: sortableConfigs.name,
      className: "min-w-[200px]",
    },
    {
      id: "contact",
      header: "Contact",
      cell: (row) => (
        <div className="space-y-1">
          {row.phone && (
            <div className="text-sm flex items-center">
              <Phone className="w-3 h-3 mr-1" />
              {row.phone}
            </div>
          )}
          {row.email && (
            <div className="text-sm flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {row.email}
            </div>
          )}
        </div>
      ),
      className: "min-w-[180px]",
    },
    {
      id: "address",
      header: "Location",
      cell: (row) => (
        <div className="text-sm flex items-start">
          <MapPin className="w-3 h-3 mr-1 mt-1 shrink-0" />
          <span>{row.address}</span>
        </div>
      ),
      className: "min-w-[200px]",
    },
    {
      id: "hours",
      header: "Hours",
      cell: (row) => (
        <div className="text-sm flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {row.opening_time} - {row.closing_time}
        </div>
      ),
      className: "min-w-[150px]",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        const config = getStatusConfig(row.status?.toLowerCase());
        return (
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
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
    },
    {
      id: "created_at",
      header: "Created",
      cell: (row) => sortableConfigs.created_at.format(row.created_at),
      sortable: true,
      sortConfig: sortableConfigs.created_at,
      className: "min-w-[150px]",
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <RowActions
          row={row}
          actions={{
            view: "app.restaurants.show",
            edit: "app.restaurants.edit",
            delete: "app.restaurants.destroy",
          }}
          resourceName="restaurant"
        />
      ),
      className: "w-[100px]",
    },
  ];

  // Bulk actions configuration
  const bulkActions = [
    {
      id: "delete",
      label: "Delete Selected",
      variant: "destructive",
      confirm: {
        title: "Delete Selected Restaurants",
        message: "Are you sure you want to delete the selected restaurants?",
      },
    },
    {
      id: "activate",
      label: "Activate",
      status: "active",
    },
    {
      id: "deactivate",
      label: "Deactivate",
      status: "inactive",
    },
    {
      id: "suspend",
      label: "Suspend",
      status: "suspended",
    },
  ];

  // Initial filters
  const initialFilters = {
    search: params.get("search") || "",
    per_page: params.get("per_page") || "10",
    sort: params.get("sort") || "created_at",
    direction: params.get("direction") || "desc",
    status: params.get("status") || "",
    is_featured: params.get("is_featured") || "",
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
    routeName: "app.restaurants.index",
    initialFilters,
    sortableConfigs,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Operation completed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message || "Operation failed",
        variant: "destructive",
      });
    },
  });

  return (
    <DataTable
      data={restaurants.data}
      columns={columns}
      filters={filters}
      filterConfigs={filterConfigs}
      selectedItems={selectedItems}
      onSelectionChange={handleSelectionChange}
      bulkActions={bulkActions}
      onBulkAction={handleBulkAction}
      pagination={{
        currentPage: restaurants.current_page,
        totalPages: restaurants.last_page,
        perPage: restaurants.per_page,
        total: restaurants.total,
        from: restaurants.from,
        to: restaurants.to,
      }}
      onPageChange={handlePageChange}
      isLoading={isLoading}
      sorting={sorting}
      onSort={handleSort}
      onFilterChange={handleFilterChange}
    />
  );
} 