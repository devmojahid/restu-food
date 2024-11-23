import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/Components/ui/use-toast";
import { Trash2, Eye, EyeOff, Package, Calendar, Star, StarOff, Archive, ArchiveRestore } from "lucide-react";
import { cn } from "@/lib/utils";
import { LazyImage } from "@/Components/Table/LazyImage";
import { format } from "date-fns";
import { RowActions } from "@/Components/Table/RowActions";
import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";

const sortableConfigs = {
  name: {
    key: "name",
    label: "Name",
    defaultDirection: "asc",
  },
  created_at: {
    key: "created_at",
    label: "Created Date",
    defaultDirection: "desc",
    format: (value) => format(new Date(value), "PPP"),
  },
  price: {
    key: "price",
    label: "Price",
    defaultDirection: "desc",
    format: (value) => formatCurrency(value),
  },
  stock_quantity: {
    key: "stock_quantity",
    label: "Stock",
    defaultDirection: "desc",
  }
};

const useProductActions = () => {
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState({});

  const handleBulkOperation = async (action, selectedIds) => {
    if (!selectedIds.length) {
      toast({
        title: "Warning",
        description: "Please select items to perform this action",
        variant: "warning",
      });
      return;
    }

    try {
      const actions = {
        delete: {
          route: 'app.products.bulk-delete',
          method: 'delete',
          data: { ids: selectedIds },
          successMessage: "Selected products deleted successfully",
          confirmMessage: 'Are you sure you want to delete the selected products?',
        },
        archive: {
          route: 'app.products.bulk-archive',
          method: 'put',
          data: { ids: selectedIds, archived: true },
          successMessage: "Selected products archived successfully",
        },
        restore: {
          route: 'app.products.bulk-archive',
          method: 'put',
          data: { ids: selectedIds, archived: false },
          successMessage: "Selected products restored successfully",
        },
        feature: {
          route: 'app.products.bulk-feature',
          method: 'put',
          data: { ids: selectedIds, featured: true },
          successMessage: "Selected products featured successfully",
        },
      };

      const selectedAction = actions[action];
      if (!selectedAction) return;

      if (selectedAction.confirmMessage && !window.confirm(selectedAction.confirmMessage)) {
        return;
      }

      await router[selectedAction.method](
        route(selectedAction.route),
        { data: selectedAction.data }
      );

      toast({
        title: "Success",
        description: selectedAction.successMessage,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to perform bulk action",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (product) => {
    const loadingKey = `featured-${product.id}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));
    
    try {
      await router.put(route("app.products.toggle-featured", product.id));
      toast({
        title: "Success",
        description: `Product ${product.is_featured ? "removed from" : "marked as"} featured`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleToggleArchive = async (product) => {
    const loadingKey = `archive-${product.id}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      await router.put(route("app.products.toggle-archive", product.id));
      toast({
        title: "Success",
        description: `Product ${product.is_archived ? "restored" : "archived"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update archive status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  return {
    actionLoading,
    handleBulkOperation,
    handleToggleFeatured,
    handleToggleArchive,
  };
};

export default function ListProducts({ products }) {
  const { toast } = useToast();
  const params = new URLSearchParams(window.location.search);
  
  const {
    actionLoading,
    handleBulkOperation,
    handleToggleFeatured,
    handleToggleArchive,
  } = useProductActions();

  const filterConfigs = {
    status: {
      type: "select",
      label: "Status",
      options: [
        { label: "All Status", value: "" },
        { label: "In Stock", value: "in_stock" },
        { label: "Out of Stock", value: "out_of_stock" },
        { label: "Low Stock", value: "low_stock" }
      ],
      defaultValue: "",
    },
    featured: {
      type: "select",
      label: "Featured",
      options: [
        { label: "All", value: "" },
        { label: "Featured", value: "1" },
        { label: "Not Featured", value: "0" }
      ],
      defaultValue: "",
    },
    type: {
      type: "select",
      label: "Product Type",
      options: [
        { label: "All Types", value: "" },
        { label: "Simple", value: "simple" },
        { label: "Variable", value: "variable" },
        { label: "Bundle", value: "bundle" }
      ],
      defaultValue: "",
    }
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
      header: "Product",
      cell: (row) => (
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-medium text-gray-900 dark:text-gray-100",
              "text-sm sm:text-base",
              "truncate"
            )}>
              {row.name.length > 20 ? `${row.name.substring(0, 23)}...` : row.name}
            </span>
            {row.is_featured && (
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {row.categories?.map((category, index) => (
              <span
                key={index}
                className={cn(
                  "px-2 py-0.5 rounded-full",
                  "bg-gray-100 dark:bg-gray-800",
                  "text-gray-600 dark:text-gray-300"
                )}
              >
                {category.name}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm">
            {row.discounted_price ? (
              <>
                <span className="font-medium text-primary">
                  {formatCurrency(row.discounted_price)}
                </span>
                <span className="text-gray-500 line-through">
                  {formatCurrency(row.price)}
                </span>
              </>
            ) : (
              <span className="font-medium text-primary">
                {formatCurrency(row.price)}
              </span>
            )}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "stock",
      header: "Stock",
      cell: (row) => {
        const stockConfig = {
          in_stock: {
            label: "In Stock",
            className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
          },
          out_of_stock: {
            label: "Out of Stock",
            className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
          },
          low_stock: {
            label: "Low Stock",
            className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
          },
        };

        const status = row.stock_quantity <= 0 ? 'out_of_stock' : 
                      row.stock_quantity <= row.low_stock_threshold ? 'low_stock' : 'in_stock';
        const config = stockConfig[status];

        return (
          <div className="flex flex-col gap-1">
            <span className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              config.className
            )}>
              {config.label}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {row.stock_quantity} in stock
            </span>
          </div>
        );
      },
      filter: filterConfigs.status,
      sortable: true,
      sortConfig: sortableConfigs.stock_quantity,
    },
    {
      id: "type",
      header: "Type",
      cell: (row) => (
        <span className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
          "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
        )}>
          {row.type === 'simple' ? 'Simple' : 
           row.type === 'variable' ? 'Variable' : 'Bundle'}
        </span>
      ),
      filter: filterConfigs.type,
    },
    {
      id: "created_at",
      header: "Created",
      cell: (row) => (
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {sortableConfigs.created_at.format(row.created_at)}
        </div>
      ),
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
            view: "app.products.show",
            edit: "app.products.edit",
            delete: "app.products.destroy",
          }}
          customActions={[
            {
              id: "toggle-featured",
              label: row.is_featured ? "Remove Featured" : "Make Featured",
              icon: row.is_featured ? StarOff : Star,
              onClick: () => handleToggleFeatured(row),
              loading: actionLoading[`featured-${row.id}`],
            },
            {
              id: "toggle-archive",
              label: row.is_archived ? "Restore" : "Archive",
              icon: row.is_archived ? ArchiveRestore : Archive,
              onClick: () => handleToggleArchive(row),
              loading: actionLoading[`archive-${row.id}`],
            },
          ]}
          resourceName="product"
          loading={isLoading}
        />
      ),
      width: "100px",
      responsive: {
        hidden: false,
        priority: 1,
      },
    },
  ];

  const bulkActions = [
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      confirm: {
        title: "Delete Selected Products",
        message: "Are you sure you want to delete the selected products? This action cannot be undone.",
      },
    },
    {
      id: "archive",
      label: "Archive",
      icon: Archive,
      variant: "default",
    },
    {
      id: "restore",
      label: "Restore",
      icon: ArchiveRestore,
      variant: "default",
    },
    {
      id: "feature",
      label: "Feature",
      icon: Star,
      variant: "default",
    },
  ];

  const initialFilters = {
    search: params.get("search") || "",
    per_page: params.get("per_page") || "10",
    sort: params.get("sort") || "created_at",
    direction: params.get("direction") || "desc",
    status: params.get("status") || "",
    featured: params.get("featured") || "",
    type: params.get("type") || "",
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
    routeName: "app.products.index",
    initialFilters,
    sortableConfigs,
    filterConfigs
  });

  const safeProducts = useMemo(() => ({
    data: products?.data || [],
    current_page: products?.current_page || 1,
    last_page: products?.last_page || 1,
    per_page: products?.per_page || 10,
    total: products?.total || 0,
    from: products?.from || 0,
    to: products?.to || 0,
  }), [products]);

  return (
    <DataTable
      data={safeProducts.data}
      columns={columns}
      filters={filters}
      filterConfigs={filterConfigs}
      onFilterChange={handleFilterChange}
      selectedItems={selectedItems}
      onSelectionChange={handleSelectionChange}
      bulkActions={bulkActions}
      onBulkAction={handleBulkOperation}
      pagination={{
        currentPage: safeProducts.current_page,
        totalPages: safeProducts.last_page,
        perPage: safeProducts.per_page,
        total: safeProducts.total,
        from: safeProducts.from,
        to: safeProducts.to,
      }}
      onPageChange={handlePageChange}
      isLoading={isLoading}
      sorting={{
        column: sorting.sort,
        direction: sorting.direction,
      }}
      onSort={handleSort}
      sortableConfigs={sortableConfigs}
      responsive={{
        breakpoints: {
          sm: 640,
          md: 768,
          lg: 1024,
          xl: 1280,
        },
        defaultHidden: ["created_at"],
        stackedOnMobile: true,
      }}
      className={cn(
        "max-w-full overflow-x-auto",
        "rounded-lg border border-gray-200 dark:border-gray-700",
        "bg-white dark:bg-gray-800",
        "shadow-sm"
      )}
      tableClassName="divide-y divide-gray-200 dark:divide-gray-700"
      rowClassName={(row) =>
        cn(
          "hover:bg-gray-50 dark:hover:bg-gray-700/50",
          "transition-colors duration-150",
          row.is_featured && "bg-purple-50/50 dark:bg-purple-900/10",
          row.is_archived && "bg-gray-100 dark:bg-gray-800/50"
        )
      }
    />
  );
} 