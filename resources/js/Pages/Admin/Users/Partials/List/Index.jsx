import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/hooks/use-toast";
import { Trash2, UserX2, UserCheck2, Pencil, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import { LazyImage } from "@/Components/Table/LazyImage";
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { RowActions } from "@/Components/Table/RowActions";

const columns = [
  {
    id: "avatar",
    header: "",
    cell: (row) => (
      <LazyImage
        src={row.avatar?.url || "/images/default-avatar.png"}
        alt={row.name}
        className="w-10 h-10 rounded-full object-cover"
      />
    ),
  },
  {
    id: "name",
    header: "Name",
    cell: (row) => row.name,
    sortable: true,
  },
  {
    id: "email",
    header: "Email",
    cell: (row) => row.email,
    sortable: true,
  },
  {
    id: "roles",
    header: "Roles",
    cell: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.roles.map((role) => (
          <span
            key={role.id}
            className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
          >
            {role.name}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <span
        className={cn(
          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
          row.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}
      >
        {row.status ? "Active" : "Inactive"}
      </span>
    ),
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
  },
];

const bulkActions = [
  {
    id: "delete",
    label: "Delete Selected",
    icon: Trash2,
    variant: "destructive",
  },
  {
    id: "activate",
    label: "Activate Selected",
    icon: UserCheck2,
    variant: "default",
  },
  {
    id: "deactivate",
    label: "Deactivate Selected",
    icon: UserX2,
    variant: "default",
  },
];

const filters = [
  {
    id: "role",
    label: "Role",
    component: ({ value, onChange }) => (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.name}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
  },
  {
    id: "status",
    label: "Status",
    component: ({ value, onChange }) => (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="1">Active</SelectItem>
          <SelectItem value="0">Inactive</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
];

export default function ListUsers({ users, roles }) {
  const { toast } = useToast();
  const { url } = usePage();
  const params = new URLSearchParams(window.location.search);

  const initialFilters = {
    search: params.get("search") || "",
    role: params.get("role") || "all",
    status: params.get("status") || "all",
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
    routeName: "users.index",
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

  return (
    <DataTable
      data={users.data}
      columns={columns}
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      selectedItems={selectedItems}
      onSelectionChange={handleSelectionChange}
      bulkActions={bulkActions}
      onBulkAction={handleBulkAction}
      onSortChange={handleSortChange}
      pagination={{
        currentPage: users.current_page,
        totalPages: users.last_page,
        perPage: users.per_page,
        total: users.total,
      }}
      onPageChange={handlePageChange}
    />
  );
}
