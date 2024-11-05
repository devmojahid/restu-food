import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/Components/ui/use-toast";
import { Trash2, Eye, EyeOff, FileText, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import { LazyImage } from "@/Components/Table/LazyImage";
import { format } from "date-fns";
import { RowActions } from "@/Components/Table/RowActions";

export default function ListBlogs({ blogs }) {
  const { toast } = useToast();
  const params = new URLSearchParams(window.location.search);

  // Define filter configurations
  const filterConfigs = {
    status: {
      type: "select",
      label: "Status",
      options: [
        { label: "All Status", value: "" },
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" },
      ],
      defaultValue: "",
      transform: (value) => value?.toLowerCase(),
      format: (value) => value?.charAt(0).toUpperCase() + value?.slice(1),
    },
    category: {
      type: "select",
      label: "Category",
      options: [
        { label: "All Categories", value: "" },
        // Add your categories here
      ],
      defaultValue: "",
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
  };

  // Enhanced sortable configurations
  const sortableConfigs = {
    title: {
      key: "title",
      defaultDirection: "asc",
      transform: (value) => value?.toLowerCase(),
      priority: 1,
    },
    created_at: {
      key: "created_at",
      defaultDirection: "desc",
      transform: (value) => new Date(value),
      format: (value) => format(new Date(value), "PPP"),
      priority: 3,
    },
    published_at: {
      key: "published_at",
      defaultDirection: "desc",
      transform: (value) => (value ? new Date(value) : null),
      format: (value) =>
        value ? format(new Date(value), "PPP") : "Not Published",
      priority: 2,
    },
  };

  // Enhanced column definitions with better spacing and layout
  const columns = [
    {
      id: "featured_image",
      header: "",
      cell: (row) => (
        <div className="flex justify-center sm:justify-start">
          <LazyImage
            src={row.featured_image?.url || "/images/default-blog.png"}
            alt={row.title}
            className={cn(
              "w-12 h-12 sm:w-14 sm:h-14",
              "rounded-lg object-cover",
              "border border-gray-200 dark:border-gray-700",
              "transition-all duration-200",
              "hover:scale-105"
            )}
          />
        </div>
      ),
      className: "w-[60px] sm:w-[70px] pl-4",
      responsive: {
        hidden: false,
        priority: 1,
      },
    },
    {
      id: "title",
      header: "Title",
      cell: (row) => (
        <div className="flex items-center space-x-4">
          <div className="space-y-1 min-w-0">
            <div
              className={cn(
                "font-medium text-gray-900 dark:text-gray-100",
                "text-sm sm:text-base",
                "truncate"
              )}
            >
              {row.title}
            </div>
            {row.excerpt && (
              <div
                className={cn(
                  "text-xs text-gray-500 dark:text-gray-400",
                  "line-clamp-1 sm:line-clamp-2",
                  "max-w-md"
                )}
              >
                {row.excerpt}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {row.category && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full",
                    "bg-gray-100 dark:bg-gray-800",
                    "text-gray-600 dark:text-gray-300"
                  )}
                >
                  {row.category}
                </span>
              )}
              {row.tags?.length > 0 && (
                <div className="flex items-center gap-1">
                  {row.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "px-2 py-0.5 rounded-full",
                        "bg-blue-50 dark:bg-blue-900/20",
                        "text-blue-600 dark:text-blue-300"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                  {row.tags.length > 2 && (
                    <span className="text-gray-500">
                      +{row.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      sortable: true,
      sortConfig: sortableConfigs.title,
      features: {
        search: true,
        filter: true,
        resize: true,
      },
      className: "min-w-[200px] px-4",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              "transition-colors duration-150",
              row.is_published
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            )}
          >
            {row.is_published ? "Published" : "Draft"}
          </span>
          {row.is_featured && (
            <span
              className={cn(
                "inline-flex items-center px-2 py-1 rounded-full",
                "text-xs font-medium",
                "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              )}
            >
              Featured
            </span>
          )}
        </div>
      ),
      filter: filterConfigs.status,
      responsive: {
        hidden: "sm",
        priority: 2,
      },
      className: "px-4",
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
              id: "preview",
              label: "Preview",
              icon: Eye,
              onClick: (row) => handlePreviewBlog(row),
            },
          ]}
          resourceName="blog"
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
      labelFull: "Delete Selected",
      icon: Trash2,
      variant: "destructive",
      confirm: {
        title: "Delete Selected Blogs",
        message: "Are you sure you want to delete the selected blogs?",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
      className: "sm:w-auto w-full",
    },
    {
      id: "publish",
      label: "Publish",
      labelFull: "Publish Selected",
      icon: Eye,
      variant: "default",
      className: "sm:w-auto w-full",
    },
    {
      id: "unpublish",
      label: "Unpublish",
      labelFull: "Unpublish Selected",
      icon: EyeOff,
      variant: "default",
      className: "sm:w-auto w-full",
    },
  ];

  // Initial filters
  const initialFilters = {
    search: params.get("search") || "",
    per_page: params.get("per_page") || "10",
    sort: params.get("sort") || sortableConfigs.created_at.key,
    direction:
      params.get("direction") || sortableConfigs.created_at.defaultDirection,
    status: params.get("status") || filterConfigs.status.defaultValue,
    category: params.get("category") || filterConfigs.category.defaultValue,
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
    routeName: "app.blogs.index",
    initialFilters,
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

  // Ensure blogs data has default values
  const safeBlogs = {
    data: blogs?.data || [],
    current_page: blogs?.current_page || 1,
    last_page: blogs?.last_page || 1,
    per_page: blogs?.per_page || 10,
    total: blogs?.total || 0,
    from: blogs?.from || 0,
    to: blogs?.to || 0,
  };

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
      onBulkAction={handleBulkAction}
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
      sorting={sorting}
      onSort={handleSort}
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
