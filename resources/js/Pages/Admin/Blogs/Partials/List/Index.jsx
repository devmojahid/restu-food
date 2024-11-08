import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/Components/ui/use-toast";
import { Trash2, Eye, EyeOff, FileText, Calendar, Star, StarOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { LazyImage } from "@/Components/Table/LazyImage";
import { format } from "date-fns";
import { RowActions } from "@/Components/Table/RowActions";
import { useState, useMemo } from "react";

// Add sortable configurations
const sortableConfigs = {
  title: {
    key: "title",
    label: "Title",
    defaultDirection: "asc",
  },
  created_at: {
    key: "created_at",
    label: "Created Date",
    defaultDirection: "desc",
    format: (value) => format(new Date(value), "PPP"),
  },
  published_at: {
    key: "published_at",
    label: "Published Date",
    defaultDirection: "desc",
    format: (value) => value ? format(new Date(value), "PPP") : "Not Published",
  },
  is_featured: {
    key: "is_featured",
    label: "Featured Status",
    defaultDirection: "desc",
  },
  category: {
    key: "category.name",
    label: "Category",
    defaultDirection: "asc",
  },
};

// Move bulk action handler to a custom hook for better organization
const useBlogActions = () => {
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
          route: 'app.blogs.bulk-delete',
          method: 'delete',
          data: { ids: selectedIds },
          successMessage: "Selected items deleted successfully",
          confirmMessage: 'Are you sure you want to delete the selected items?',
        },
        publish: {
          route: 'app.blogs.bulk-publish',
          method: 'put',
          data: { ids: selectedIds, status: true },
          successMessage: "Selected items published successfully",
        },
        unpublish: {
          route: 'app.blogs.bulk-publish',
          method: 'put',
          data: { ids: selectedIds, status: false },
          successMessage: "Selected items unpublished successfully",
        },
        feature: {
          route: 'app.blogs.bulk-feature',
          method: 'put',
          data: { ids: selectedIds, featured: true },
          successMessage: "Selected items featured successfully",
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

  const handleToggleFeatured = async (blog) => {
    const loadingKey = `featured-${blog.id}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));
    
    try {
      await router.put(route("app.blogs.toggle-featured", blog.id));
      toast({
        title: "Success",
        description: `Blog ${blog.is_featured ? "removed from" : "marked as"} featured`,
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

  const handleTogglePublish = async (blog) => {
    const loadingKey = `publish-${blog.id}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      await router.put(route("app.blogs.toggle-publish", blog.id));
      toast({
        title: "Success",
        description: `Blog ${blog.is_published ? "unpublished" : "published"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update publish status",
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
    handleTogglePublish,
  };
};

export default function ListBlogs({ blogs, categories = [] }) {
  const { toast } = useToast();
  const params = new URLSearchParams(window.location.search);
  
  // Use the custom hook
  const {
    actionLoading,
    handleBulkOperation,
    handleToggleFeatured,
    handleTogglePublish,
  } = useBlogActions();

  // Enhanced filter configurations with categories
  const filterConfigs = {
    status: {
      type: "select",
      label: "Status",
      options: [
        { label: "All Status", value: "" },
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" },
        { label: "Scheduled", value: "scheduled" }
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
    }
  };

  // Enhanced column definitions with better error handling
  const columns = [
    {
      id: "thumbnail",
      header: "",
      cell: (row) => (
        <div className="flex justify-center sm:justify-start">
          {row.thumbnail ? (
            <LazyImage
              src={row.thumbnail.url}
              alt={row.title}
              className={cn(
                "w-12 h-12 sm:w-14 sm:h-14",
                "rounded-lg object-cover",
                "border border-gray-200 dark:border-gray-700",
                "transition-all duration-200",
                "hover:scale-105 hover:shadow-lg",
                "bg-gray-50 dark:bg-gray-800"
              )}
              fallback="/images/placeholder-image.jpg"
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
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      ),
      className: "w-[60px] sm:w-[70px] pl-4",
    },
    {
      id: "title",
      header: "Title",
      cell: (row) => (
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-medium text-gray-900 dark:text-gray-100",
              "text-sm sm:text-base",
              "truncate"
            )}>
              {row.title.length > 20 ? `${row.title.substring(0, 23)}...` : row.title} 
            </span>
            {row.is_featured && (
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            )}
          </div>
          {row.excerpt && (
            <p className={cn(
              "text-xs text-gray-500 dark:text-gray-400",
              "line-clamp-1 sm:line-clamp-2",
              "max-w-md"
            )}>
              {row.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {row.category && (
              <span className={cn(
                "px-2 py-0.5 rounded-full",
                "bg-gray-100 dark:bg-gray-800",
                "text-gray-600 dark:text-gray-300"
              )}>
                {row.category}
              </span>
            )}
            {row.tags?.map((tag, index) => (
              <span
                key={index}
                className={cn(
                  "px-2 py-0.5 rounded-full",
                  "bg-blue-50 dark:bg-blue-900/20",
                  "text-blue-600 dark:text-blue-300"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        const isScheduled = row.is_published && new Date(row.published_at) > new Date();
        const statusConfig = {
          published: {
            label: "Published",
            className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
          },
          draft: {
            label: "Draft",
            className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
          },
          scheduled: {
            label: "Scheduled",
            className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
          },
        };

        const status = isScheduled ? 'scheduled' : (row.is_published ? 'published' : 'draft');
        const config = statusConfig[status];

        return (
          <div className="flex items-center gap-2">
            <span className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              config.className
            )}>
              {config.label}
            </span>
            {row.published_at && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(row.published_at), "MMM d, yyyy")}
              </span>
            )}
          </div>
        );
      },
      filter: filterConfigs.status,
    },
    {
      id: "author",
      header: "Author",
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <LazyImage
            src={row.user?.avatar?.url || "/images/default-avatar.png"}
            alt={row.user?.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm">{row.user?.name}</span>
        </div>
      ),
      responsive: {
        hidden: "md",
        priority: 3,
      },
    },
    {
      id: "published_at",
      header: "Published",
      cell: (row) => (
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {sortableConfigs.published_at.format(row.published_at)}
        </div>
      ),
      sortable: true,
      sortConfig: sortableConfigs.published_at,
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
            view: "app.blogs.show",
            edit: "app.blogs.edit",
            delete: "app.blogs.destroy",
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
              id: "toggle-publish",
              label: row.is_published ? "Unpublish" : "Publish",
              icon: row.is_published ? EyeOff : Eye,
              onClick: () => handleTogglePublish(row),
              loading: actionLoading[`publish-${row.id}`],
            },
          ]}
          resourceName="blog"
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

  // Enhanced bulk actions
  const bulkActions = [
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      confirm: {
        title: "Delete Selected Blogs",
        message: "Are you sure you want to delete the selected blogs? This action cannot be undone.",
      },
    },
    {
      id: "publish",
      label: "Publish",
      icon: Eye,
      variant: "default",
    },
    {
      id: "unpublish",
      label: "Unpublish",
      icon: EyeOff,
      variant: "default",
    },
    {
      id: "feature",
      label: "Feature",
      icon: Star,
      variant: "default",
    },
  ];

  // Initial filters with error handling for date parsing
  const initialFilters = {
    search: params.get("search") || "",
    per_page: params.get("per_page") || "10",
    sort: params.get("sort") || "created_at",
    direction: params.get("direction") || "desc",
    status: params.get("status") || "",
    featured: params.get("featured") || "",
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
    routeName: "app.blogs.index",
    initialFilters,
    sortableConfigs,
    filterConfigs
  });

  // Ensure blogs data has default values with error handling
  const safeBlogs = useMemo(() => ({
    data: blogs?.data || [],
    current_page: blogs?.current_page || 1,
    last_page: blogs?.last_page || 1,
    per_page: blogs?.per_page || 10,
    total: blogs?.total || 0,
    from: blogs?.from || 0,
    to: blogs?.to || 0,
  }), [blogs]);

  return (
    <DataTable
      data={safeBlogs.data}
      columns={columns}
      filters={filters}
      filterConfigs={filterConfigs}
      onFilterChange={handleFilterChange}
      selectedItems={selectedItems}
      onSelectionChange={handleSelectionChange}
      bulkActions={bulkActions}
      onBulkAction={handleBulkOperation}
      pagination={{
        currentPage: safeBlogs.current_page,
        totalPages: safeBlogs.last_page,
        perPage: safeBlogs.per_page,
        total: safeBlogs.total,
        from: safeBlogs.from,
        to: safeBlogs.to,
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
        defaultHidden: ["published_at", "author"],
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
          row.is_featured && "bg-purple-50/50 dark:bg-purple-900/10"
        )
      }
    />
  );
}
