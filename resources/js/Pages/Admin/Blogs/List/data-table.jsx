import { createDataTable } from "@/factories/createDataTable";
import { Badge } from "@/Components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

const columns = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        {row.original.featured_image && (
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={row.original.featured_image}
              alt={row.getValue("title")}
            />
            <AvatarFallback>BL</AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col">
          <span className="font-medium">{row.getValue("title")}</span>
          <span className="text-xs text-muted-foreground truncate max-w-[300px]">
            {row.original.slug}
          </span>
        </div>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "user.name",
    header: "Author",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={row.original.user?.avatar}
            alt={row.original.user?.name}
          />
          <AvatarFallback>{row.original.user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <span>{row.original.user?.name}</span>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "is_published",
    header: "Status",
    cell: ({ row }) => {
      const isPublished = row.getValue("is_published");
      const publishedAt = row.original.published_at;

      return (
        <div className="flex flex-col">
          <Badge
            variant={isPublished ? "success" : "secondary"}
            className="w-fit"
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
          {isPublished && publishedAt && (
            <span className="text-xs text-muted-foreground mt-1">
              {formatDate(publishedAt)}
            </span>
          )}
        </div>
      );
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags") || [];
      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag.id} variant="outline" className="text-xs">
              {tag.name}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3} more
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => formatDate(row.getValue("created_at")),
    enableSorting: true,
    enableHiding: true,
  },
];

const config = {
  columns,
  filterableColumns: [
    {
      id: "is_published",
      title: "Status",
      options: [
        { label: "Published", value: true },
        { label: "Draft", value: false },
      ],
    },
  ],
  searchableColumns: [
    {
      id: "title",
      title: "Title",
    },
    {
      id: "user.name",
      title: "Author",
    },
  ],
  // Default configuration
  enableRowSelection: true,
  enableMultiSort: false,
  enableColumnResizing: true,
  enableColumnOrdering: true,
  enablePinning: true,
  enableFullScreen: true,
  enableDensityToggle: true,
  stickyHeader: true,
  striped: true,
};

export const BlogDataTable = createDataTable(config);
