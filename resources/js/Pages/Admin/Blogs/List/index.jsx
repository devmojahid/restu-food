import React, { useState, useCallback } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { DataTable } from "@/Components/ui/data-table/data-table";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import {
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  MoreVertical,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { DataTableHeader } from "@/Components/ui/data-table/data-table-header";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import debounce from "lodash/debounce";

const Index = ({ blogs: initialBlogs, filters: initialFilters }) => {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    search: initialFilters.search || "",
    perPage: initialFilters.perPage || 10,
    page: initialFilters.page || 1,
    sort: initialFilters.sort || "",
    direction: initialFilters.direction || "",
    filters: initialFilters.filters || {},
  });

  const { csrf_token } = usePage().props;

  // Filter configurations
  const filterableColumns = [
    {
      id: "is_published",
      title: "Status",
      options: [
        { label: "Published", value: "1" },
        { label: "Draft", value: "0" },
      ],
    },
    {
      id: "published_at",
      title: "Published Date",
      options: [
        { label: "Last 7 Days", value: "7days" },
        { label: "Last 30 Days", value: "30days" },
        { label: "This Month", value: "this_month" },
        { label: "Last Month", value: "last_month" },
      ],
    },
  ];

  // Searchable columns configuration
  const searchableColumns = [
    {
      id: "title",
      title: "Title",
    },
    {
      id: "content",
      title: "Content",
    },
    {
      id: "user.name",
      title: "Author",
    },
  ];

  // Table columns configuration
  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span
            className="font-medium hover:text-primary cursor-pointer"
            onClick={() =>
              router.visit(route("admin.blogs.show", row.original.id))
            }
          >
            {row.original.title}
          </span>
          <span className="text-sm text-muted-foreground">
            {row.original.slug}
          </span>
        </div>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "user.name",
      header: "Author",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.user?.name}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.user?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "is_published",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.is_published ? "success" : "secondary"}
          className="w-24 cursor-pointer transition-colors hover:bg-opacity-80"
          onClick={() => handleStatusToggle(row.original.id)}
        >
          {row.original.is_published ? (
            <Check className="w-4 h-4 mr-1" />
          ) : (
            <X className="w-4 h-4 mr-1" />
          )}
          {row.original.is_published ? "Published" : "Draft"}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(String(row.original.is_published));
      },
    },
    {
      accessorKey: "published_at",
      header: () => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Published Date</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 text-muted-foreground">
            <Calendar className="w-4 h-4" />
          </div>
          <span>
            {row.original.published_at
              ? format(new Date(row.original.published_at), "PPP")
              : "-"}
          </span>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem
              onClick={() =>
                router.visit(route("admin.blogs.show", row.original.id))
              }
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.visit(route("admin.blogs.edit", row.original.id))
              }
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(row.original.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Handle server-side filtering with POST request
  const handleFiltering = useCallback(
    async (newData = {}) => {
      setIsLoading(true);

      form.post(route("admin.blogs.index"), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          setBlogs(page.props.blogs);
          setIsLoading(false);
        },
        onError: (errors) => {
          if (errors?.message === "CSRF token mismatch") {
            window.location.reload();
            return;
          }
          toast.error("Failed to filter blogs");
          setIsLoading(false);
        },
        data: {
          ...form.data,
          ...newData,
          _token: csrf_token,
        },
      });
    },
    [form, csrf_token]
  );

  // Handle pagination
  const handlePaginationChange = useCallback(
    ({ pageIndex, pageSize }) => {
      handleFiltering({
        page: pageIndex + 1,
        perPage: pageSize,
      });
    },
    [handleFiltering]
  );

  // Handle sorting
  const handleSortingChange = useCallback(
    (sorting) => {
      if (sorting.length) {
        handleFiltering({
          sort: sorting[0].id,
          direction: sorting[0].desc ? "desc" : "asc",
        });
      }
    },
    [handleFiltering]
  );

  // Handle filters
  const handleFilterChange = useCallback(
    (filters) => {
      handleFiltering({
        filters: filters.reduce((acc, filter) => {
          acc[filter.id] = filter.value;
          return acc;
        }, {}),
        page: 1,
      });
    },
    [handleFiltering]
  );

  // Handle search with debounce
  const debouncedSearch = useCallback(
    debounce((value) => {
      handleFiltering({
        search: value,
        page: 1,
      });
    }, 300),
    [handleFiltering]
  );

  const handleSearch = useCallback(
    (value) => {
      form.setData("search", value);
      debouncedSearch(value);
    },
    [form, debouncedSearch]
  );

  const handleBulkDelete = useCallback(async (selectedIds) => {
    const toastId = toast.loading("Deleting selected items...");

    router.delete(route("admin.blogs.bulk-delete"), {
      data: { ids: selectedIds },
      onSuccess: () => {
        toast.success("Selected blogs deleted successfully", { id: toastId });
      },
      onError: () => {
        toast.error("Failed to delete selected items", { id: toastId });
      },
    });
  }, []);

  const handleDelete = useCallback((id) => {
    const toastId = toast.loading("Deleting blog post...");

    router.delete(route("admin.blogs.destroy", id), {
      onSuccess: () => {
        toast.success("Blog deleted successfully", { id: toastId });
      },
      onError: () => {
        toast.error("Failed to delete blog", { id: toastId });
      },
    });
  }, []);

  const handleStatusToggle = useCallback((id) => {
    const toastId = toast.loading("Updating status...");

    router.put(
      route("admin.blogs.toggle-status", id),
      {},
      {
        onSuccess: () => {
          toast.success("Status updated successfully", { id: toastId });
        },
        onError: () => {
          toast.error("Failed to update status", { id: toastId });
        },
      }
    );
  }, []);

  return (
    <AdminLayout>
      <Head title="Blog Posts" />

      <div className="container mx-auto py-6 space-y-4">
        <DataTableHeader
          title="Blog Posts"
          description="Manage your blog posts and articles"
          onAdd={() => router.visit(route("admin.blogs.create"))}
          onExport={(format) =>
            router.post(route("admin.blogs.export"), { format })
          }
          onImport={(file) => {
            const formData = new FormData();
            formData.append("file", file);
            router.post(route("admin.blogs.import"), formData);
          }}
          enableAdd={true}
          enableExport={true}
          enableImport={true}
          enablePrint={true}
        />

        <DataTable
          data={blogs.data}
          columns={columns}
          pageCount={Math.ceil(blogs.total / blogs.per_page)}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
          onFilterChange={handleFilterChange}
          onGlobalFilter={handleSearch}
          onBulkDelete={handleBulkDelete}
          initialPageSize={initialFilters.perPage}
          initialPageIndex={initialFilters.page - 1}
          enableRowSelection
          enableBulkActions
          enableColumnResizing
          enableSorting
          stickyHeader
          isLoading={isLoading}
          className="bg-white shadow-sm border rounded-lg"
        />
      </div>
    </AdminLayout>
  );
};

export default Index;
