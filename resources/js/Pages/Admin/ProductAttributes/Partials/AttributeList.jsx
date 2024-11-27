import React from "react";
import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Box,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { router } from "@inertiajs/react";

const AttributeList = ({ attributes, pagination, filters, onEdit, can }) => {

  // Filter configurations
  const filterConfigs = {
    type: {
      type: "select",
      label: "Type",
      options: [
        { label: "All Types", value: "" },
        { label: "Select", value: "select" },
        { label: "Color", value: "color" },
        { label: "Button", value: "button" },
        { label: "Radio", value: "radio" },
      ],
      defaultValue: "",
    },
    status: {
      type: "select",
      label: "Status",
      options: [
        { label: "All Status", value: "" },
        { label: "Visible", value: "visible" },
        { label: "Hidden", value: "hidden" },
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
      header: "Attribute",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.name}</span>
            <span className="text-sm text-muted-foreground">{row.slug}</span>
          </div>
        </div>
      ),
      sortable: true,
      sortConfig: sortableConfigs.name,
    },
    {
      id: "type",
      header: "Type",
      cell: (row) => (
        <Badge variant="secondary">
          {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
        </Badge>
      ),
      filter: filterConfigs.type,
    },
    {
      id: "values",
      header: "Values",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.values.slice(0, 3).map((value, index) => (
            <Badge key={index} variant="outline">
              {value.label || value.value}
            </Badge>
          ))}
          {row.values.length > 3 && (
            <Badge variant="outline">+{row.values.length - 3}</Badge>
          )}
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              row.is_visible
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
            )}
          >
            {row.is_visible ? "Visible" : "Hidden"}
          </span>
          {row.is_global && (
            <Badge variant="secondary" className="text-xs">
              Global
            </Badge>
          )}
          {row.is_variation && (
            <Badge variant="secondary" className="text-xs">
              Variation
            </Badge>
          )}
        </div>
      ),
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
                {row.is_visible ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show
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
    },
  ];

  // Action handlers
  const handleDelete = (row) => {
    if (confirm("Are you sure you want to delete this attribute?")) {
      router.delete(route("app.product-attributes.destroy", row.id), {
        preserveScroll: true
      });
    }
  };

  const handleToggleStatus = (row) => {
    router.put(
      route("app.product-attributes.status", row.id),
      {
        is_visible: !row.is_visible,
      },
      {
        preserveScroll: true,
        preserveState: true,
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
    routeName: "app.product-attributes.index",
    initialFilters: filters,
    sortableConfigs,
    filterConfigs,
  });

  // Bulk actions
  const bulkActions = [
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      action: (ids) =>
        router.delete(route("app.product-attributes.bulk-delete"), {
          data: { ids },
          preserveScroll: true,
        }),
    },
    {
      id: "show",
      label: "Show",
      icon: Eye,
      action: (ids) =>
        router.put(route("app.product-attributes.bulk-status"), {
          data: { ids, is_visible: true },
          preserveScroll: true,
        }),
    },
    {
      id: "hide",
      label: "Hide",
      icon: EyeOff,
      action: (ids) =>
        router.put(route("app.product-attributes.bulk-status"), {
          data: { ids, is_visible: false },
          preserveScroll: true,
        }),
    },
  ];

  return (
    <DataTable
      data={attributes}
      columns={columns}
      filters={tableFilters}
      filterConfigs={filterConfigs}
      onFilterChange={handleFilterChange}
      selectedItems={selectedItems}
      onSelectionChange={handleSelectionChange}
      sorting={sorting}
      onSort={handleSort}
      isLoading={isLoading}
      pagination={pagination}
      onPageChange={handlePageChange}
      bulkActions={can.delete || can.edit ? bulkActions : []}
      className="attributes-table"
      rowSelection={{
        enabled: true,
        selectionKey: "id",
      }}
    />
  );
};

export default AttributeList; 