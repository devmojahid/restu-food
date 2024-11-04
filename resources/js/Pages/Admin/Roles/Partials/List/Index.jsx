import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Eye, ShieldCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { RowActions } from "@/Components/Table/RowActions";

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
  },
  {
    id: "permissions_count",
    header: "Permissions",
    cell: (row) => (
      <Badge variant="secondary" className="font-medium">
        {row.permissions?.length || 0} Permissions
      </Badge>
    ),
  },
  {
    id: "users_count",
    header: "Users",
    cell: (row) => (
      <div className="flex items-center">
        <Users className="w-4 h-4 mr-2 text-gray-500" />
        <span>{row.users_count || 0} Users</span>
      </div>
    ),
  },
  {
    id: "created_at",
    header: "Created At",
    cell: (row) => new Date(row.created_at).toLocaleDateString(),
    sortable: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: (row) => (
      <RowActions
        row={row}
        actions={{
          view: "app.roles.show",
          edit: "app.roles.edit",
          delete: row.name !== "Admin" ? "app.roles.destroy" : null,
        }}
        resourceName="role"
      />
    ),
  },
];

const bulkActions = [
  {
    id: "delete",
    label: "Delete Selected",
    icon: Trash2,
    variant: "destructive",
  },
];

const filters = [
  {
    id: "search",
    label: "Search",
    type: "text",
    placeholder: "Search roles...",
  },
];

export default function ListRoles({ roles }) {
  const { toast } = useToast();
  const { url } = usePage();
  const params = new URLSearchParams(window.location.search);

  const initialFilters = {
    search: params.get("search") || "",
    per_page: params.get("per_page") || "10",
    sort: params.get("sort") || "created_at",
    direction: params.get("direction") || "desc",
  };

  const {
    selectedItems,
    filters: activeFilters,
    handleFilterChange,
    handleBulkAction,
    handleSelectionChange,
    handlePageChange,
    handleSortChange,
  } = useDataTable({
    routeName: "app.roles.index",
    initialFilters,
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

  // Filter out Admin role from bulk selection
  const canSelectItem = (item) => item.name !== "Admin";

  return (
    <DataTable
      data={roles.data}
      columns={columns}
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      selectedItems={selectedItems}
      onSelectionChange={handleSelectionChange}
      bulkActions={bulkActions}
      onBulkAction={handleBulkAction}
      onSortChange={handleSortChange}
      canSelectItem={canSelectItem}
      pagination={{
        currentPage: roles.current_page,
        totalPages: roles.last_page,
        perPage: roles.per_page,
        total: roles.total,
        from: roles.from,
        to: roles.to,
      }}
      onPageChange={handlePageChange}
    />
  );
}
