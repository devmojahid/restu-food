import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/Components/ui/use-toast";
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Package,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LazyImage } from "@/Components/Table/LazyImage";
import { format } from "date-fns";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { router } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const AddonList = ({ addons, categories, onEdit }) => {
  const { toast } = useToast();

  const filterConfigs = {
    status: {
      type: "select",
      label: "Status",
      options: [
        { label: "All Status", value: "" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    category: {
      type: "select",
      label: "Category",
      options: [
        { label: "All Categories", value: "" },
        ...categories.map(cat => ({
          label: cat.name,
          value: cat.id.toString()
        }))
      ],
    },
  };

  const sortableConfigs = {
    name: {
      key: "name",
      defaultDirection: "asc",
    },
    price: {
      key: "price",
      defaultDirection: "desc",
      format: (value) => formatCurrency(value),
    },
    created_at: {
      key: "created_at",
      defaultDirection: "desc",
      format: (value) => format(new Date(value), "PPP"),
    },
  };

  const columns = [
    {
      id: "thumbnail",
      header: "",
      cell: (row) => (
        <div className="flex justify-center sm:justify-start">
          {row.thumbnail ? (
            <LazyImage
              src={row.thumbnail.url}
              alt={row.name}
              className={cn(
                "w-12 h-12 sm:w-14 sm:h-14",
                "rounded-lg object-cover",
                "border border-gray-200 dark:border-gray-700",
                "transition-all duration-200",
                "hover:scale-105 hover:shadow-lg",
                "bg-gray-50 dark:bg-gray-800"
              )}
              fallback="/images/placeholder-product.jpg"
            />
          ) : (
            <div
              className={cn(
                "w-12 h-12 sm:w-14 sm:h-14",
                "rounded-lg",
                "border border-gray-200 dark:border-gray-700",
                "bg-gray-50 dark:bg-gray-800",
                "flex items-center justify-center"
              )}
            >
              <Package className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      ),
      className: "w-[60px] sm:w-[70px] pl-4",
    },
    {
      id: "name",
      header: "Add-on",
      cell: (row) => (
        <div className="space-y-1">
          <div className="font-medium">{row.name}</div>
          <div className="flex flex-wrap gap-1">
            {row.categories?.map((category) => (
              <Badge key={category.id} variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      ),
      sortable: true,
      sortConfig: sortableConfigs.name,
    },
    {
      id: "price",
      header: "Price",
      cell: (row) => formatCurrency(row.price),
      sortable: true,
      sortConfig: sortableConfigs.price,
    },
    {
      id: "stock_status",
      header: "Stock Status",
      cell: (row) => (
        <Badge
          variant={
            row.stock_status === "in_stock"
              ? "success"
              : row.stock_status === "low_stock"
              ? "warning"
              : "destructive"
          }
        >
          {row.stock_status.replace("_", " ").toUpperCase()}
        </Badge>
      ),
      filter: filterConfigs.status,
    },
    {
      id: "created_at",
      header: "Created",
      cell: (row) => (
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {format(new Date(row.created_at), "PPP")}
        </div>
      ),
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
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleToggleStatus(row)}
              className="text-yellow-600"
            >
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
            <DropdownMenuItem
              onClick={() => handleDelete(row)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleDelete = (addon) => {
    if (confirm("Are you sure you want to delete this add-on?")) {
      router.delete(route("app.products.addons.destroy", addon.id));
    }
  };

  const handleToggleStatus = (addon) => {
    router.put(route("app.products.addons.update", addon.id), {
      ...addon,
      is_active: !addon.is_active,
      _method: 'PUT'
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Success",
          description: `Add-on ${addon.is_active ? 'deactivated' : 'activated'} successfully`,
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update add-on status",
          variant: "destructive",
        });
      },
    });
  };

  const {
    selectedItems,
    filters,
    sorting,
    isLoading,
    handleFilterChange,
    handleSelectionChange,
    handlePageChange,
    handleSort,
  } = useDataTable({
    routeName: "app.products.addons.index",
    sortableConfigs,
    filterConfigs,
  });

  const bulkActions = [
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      action: (ids) =>
        router.post(route("app.products.addons.bulk-action"), {
          ids,
          action: "delete",
        }),
    },
    {
      id: "activate",
      label: "Activate",
      icon: Eye,
      action: (ids) =>
        router.post(route("app.products.addons.bulk-action"), {
          ids,
          action: "activate",
        }),
    },
    {
      id: "deactivate",
      label: "Deactivate",
      icon: EyeOff,
      action: (ids) =>
        router.post(route("app.products.addons.bulk-action"), {
          ids,
          action: "deactivate",
        }),
    },
  ];

  return (
    <DataTable
      data={addons.data}
      columns={columns}
      filters={filters}
      filterConfigs={filterConfigs}
      onFilterChange={handleFilterChange}
      selectedItems={selectedItems}
      onSelectionChange={handleSelectionChange}
      sorting={sorting}
      onSort={handleSort}
      isLoading={isLoading}
      pagination={{
        currentPage: addons.current_page,
        totalPages: addons.last_page,
        perPage: addons.per_page,
        total: addons.total,
        from: addons.from,
        to: addons.to,
      }}
      onPageChange={handlePageChange}
      bulkActions={bulkActions}
    />
  );
};

export default AddonList; 