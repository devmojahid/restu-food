import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import { LazyImage } from "@/Components/Table/LazyImage";

// Column definitions for the blog table
const columns = [
  {
    id: "id",
    header: "ID",
    cell: (row) => row.id,
  },
  {
    id: "title",
    header: "Title",
    cell: (row) => row.title,
  },
  {
    id: "featured_image",
    header: "Featured Image",
    cell: (row) => (
      <LazyImage
        src={row.featured_image}
        alt={row.title}
        className="w-10 h-10 rounded-md object-cover"
      />
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <span
        className={cn(
          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
          row.is_published
            ? "bg-green-100 text-green-800"
            : "bg-blue-100 text-blue-800"
        )}
      >
        {row.is_published ? "Published" : "Draft"}
      </span>
    ),
  },
];

// Bulk actions configuration
const bulkActions = [
  {
    id: "delete",
    label: "Delete Selected",
    icon: Trash2,
    variant: "destructive",
  },
  {
    id: "publish",
    label: "Publish Selected",
    icon: Eye,
    variant: "default",
  },
  {
    id: "unpublish",
    label: "Unpublish Selected",
    icon: EyeOff,
    variant: "default",
  },
];

export default function ListBlogs({ blogs }) {
  const { url } = usePage();
  const params = new URLSearchParams(window.location.search);

  // Initialize filters from URL parameters
  const initialFilters = {
    search: params.get("search") || "",
    status: params.get("status") || "all",
    per_page: params.get("per_page") || "10",
  };

  const {
    selectedItems,
    filters,
    handleFilterChange,
    handleBulkAction,
    handleSelectionChange,
    handlePageChange,
  } = useDataTable({
    routeName: "admin.blogs.index",
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
      data={blogs.data}
      columns={columns}
      filters={filters}
      onFilterChange={handleFilterChange}
      selectedItems={selectedItems}
      onSelectionChange={handleSelectionChange}
      bulkActions={bulkActions}
      onBulkAction={handleBulkAction}
      pagination={{
        currentPage: blogs.current_page,
        totalPages: blogs.last_page,
        perPage: blogs.per_page,
      }}
      onPageChange={handlePageChange}
    />
  );
}
