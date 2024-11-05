import React from "react";
import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/Components/ui/use-toast";
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  FolderTree,
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

const CategoryList = ({ categories, filters, onEdit, can }) => {
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
      ],
      defaultValue: "",
    },
    parent: {
      type: "select",
      label: "Parent",
      options: [
        { label: "All", value: "" },
        { label: "Root Categories", value: "root" },
        { label: "Sub Categories", value: "sub" },
      ],
      defaultValue: "",
    },
  };

  // Sort configurations
  const sortableConfigs = {
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
      priority: 2,
    },
  };

  // Column definitions
  const columns = [
    {
      id: "name",
      header: "Category",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.icon_url ? (
            <LazyImage
              src={row.icon_url}
              alt={row.name}
              className="w-8 h-8 rounded object-cover"
            />
          ) : (
            <FolderTree className="w-8 h-8 text-gray-400" />
          )}
          <div className="flex flex-col">
            <span className="font-medium">{row.name}</span>
            {row.description && (
              <span className="text-sm text-gray-500 line-clamp-1">
                {row.description}
              </span>
            )}
            {row.parent && (
              <span className="text-xs text-gray-400">
                Parent: {row.parent.name}
              </span>
            )}
          </div>
        </div>
      ),
      sortable: true,
      sortConfig: sortableConfigs.name,
      className: "min-w-[200px]",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              row.is_active
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
            )}
          >
            {row.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      filter: filterConfigs.status,
    },
    {
      id: "items_count",
      header: "Items",
      cell: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {row.blogs_count || 0}
        </span>
      ),
    },
    {
      id: "created_at",
      header: "Created At",
      cell: (row) => format(new Date(row.created_at), "PPP"),
      sortable: true,
      sortConfig: sortableConfigs.created_at,
    },
    {
      id: "slug",
      header: "Slug",
      cell: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.slug}
        </span>
      ),
      sortable: true,
    },
    {
      id: "parent",
      header: "Parent",
      cell: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.parent?.name || "None"}
        </span>
      ),
    },
    {
      id: "blogs_count",
      header: "Blogs",
      cell: (row) => (
        <span className="text-sm font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
          {row.blogs_count || 0}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
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
      width: "50px",
    },
  ];

  // Action handlers
  const handleDelete = (row) => {
    if (confirm("Are you sure you want to delete this category?")) {
      router.delete(route("app.categories.destroy", row.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Category deleted successfully",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to delete category",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleToggleStatus = (row) => {
    router.put(
      route("app.categories.status", row.id),
      {
        is_active: !row.is_active,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Category ${
              row.is_active ? "deactivated" : "activated"
            } successfully`,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update category status",
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
    routeName: "app.categories.index",
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
      confirmTitle: "Delete Categories",
      confirmMessage:
        "Are you sure you want to delete the selected categories? This action cannot be undone.",
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
        router.delete(route("app.categories.bulk-delete"), {
          data: { ids: selectedIds },
          preserveScroll: true,
        });
        break;
      case "activate":
        router.put(route("app.categories.bulk-status"), {
          data: { ids: selectedIds, is_active: true },
          preserveScroll: true,
        });
        break;
      case "deactivate":
        router.put(route("app.categories.bulk-status"), {
          data: { ids: selectedIds, is_active: false },
          preserveScroll: true,
        });
        break;
    }
  };

  return (
    <DataTable
      data={categories.data}
      columns={columns}
      filters={tableFilters}
      filterConfigs={filterConfigs}
      onFilterChange={handleFilterChange}
      selectedItems={selectedItems}
      onSelectionChange={handleSelectionChange}
      sorting={sorting}
      onSort={handleSort}
      isLoading={isLoading}
      pagination={categories.meta}
      onPageChange={handlePageChange}
      bulkActions={can.delete || can.edit ? bulkActions : []}
      onBulkAction={handleBulkAction}
      className="categories-table"
      rowSelection={{
        enabled: true,
        selectionKey: "id",
      }}
    />
  );
};

export default CategoryList;
