import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/Components/ui/use-toast";
import { Trash2, CheckCircle, XCircle, Star, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { RowActions } from "@/Components/Table/RowActions";
import { useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Rating } from "@/Components/ui/rating";
import { router } from "@inertiajs/react";

const useReviewActions = () => {
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState({});

  const handleApprove = async (review) => {
    const loadingKey = `approve-${review.id}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      await router.put(route("app.reviews.approve", review.id));
      toast({
        title: "Success",
        description: "Review approved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve review",
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleReject = async (review) => {
    const loadingKey = `reject-${review.id}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      await router.put(route("app.reviews.reject", review.id));
      toast({
        title: "Success",
        description: "Review rejected successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject review",
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

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
        approve: {
          route: 'app.reviews.bulk-approve',
          method: 'post',
          successMessage: "Selected reviews approved successfully",
        },
        reject: {
          route: 'app.reviews.bulk-reject',
          method: 'post',
          successMessage: "Selected reviews rejected successfully",
        },
        delete: {
          route: 'app.reviews.bulk-delete',
          method: 'delete',
          successMessage: "Selected reviews deleted successfully",
          confirmMessage: 'Are you sure you want to delete the selected reviews?',
        },
      };

      const selectedAction = actions[action];
      if (!selectedAction) return;

      if (selectedAction.confirmMessage && !window.confirm(selectedAction.confirmMessage)) {
        return;
      }

      await router[selectedAction.method](
        route(selectedAction.route),
        { data: { ids: selectedIds } }
      );

      toast({
        title: "Success",
        description: selectedAction.successMessage,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        variant: "destructive",
      });
    }
  };

  return {
    actionLoading,
    handleApprove,
    handleReject,
    handleBulkOperation,
  };
};

export default function ReviewList({ reviews }) {
  const { toast } = useToast();
  const {
    actionLoading,
    handleApprove,
    handleReject,
    handleBulkOperation,
  } = useReviewActions();

  const filterConfigs = {
    status: {
      type: "select",
      label: "Status",
      options: [
        { label: "All Status", value: "" },
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ],
      defaultValue: "",
    },
    rating: {
      type: "select",
      label: "Rating",
      options: [
        { label: "All Ratings", value: "" },
        { label: "5 Stars", value: "5" },
        { label: "4 Stars", value: "4" },
        { label: "3 Stars", value: "3" },
        { label: "2 Stars", value: "2" },
        { label: "1 Star", value: "1" },
      ],
      defaultValue: "",
    },
  };

  const columns = [
    {
      id: "user",
      header: "Reviewer",
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={row.user?.avatar} />
            <AvatarFallback>
              {row.user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.user?.name}</div>
            <div className="text-sm text-muted-foreground">
              {row.user?.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "review",
      header: "Review",
      cell: (row) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Rating value={row.rating} readOnly />
            {row.title && (
              <span className="font-medium">{row.title}</span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {row.comment.length > 100
              ? `${row.comment.substring(0, 100)}...`
              : row.comment}
          </p>
          {(row.pros || row.cons) && (
            <div className="flex flex-wrap gap-2">
              {row.pros && (
                <Badge variant="success" className="text-xs">
                  Pros: {row.pros}
                </Badge>
              )}
              {row.cons && (
                <Badge variant="destructive" className="text-xs">
                  Cons: {row.cons}
                </Badge>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          variant={
            row.is_approved
              ? "success"
              : row.status === "rejected"
              ? "destructive"
              : "default"
          }
        >
          {row.is_approved
            ? "Approved"
            : row.status === "rejected"
            ? "Rejected"
            : "Pending"}
        </Badge>
      ),
      filter: filterConfigs.status,
    },
    {
      id: "created_at",
      header: "Date",
      cell: (row) => format(new Date(row.created_at), "PPP"),
      sortable: true,
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <RowActions
          row={row}
          actions={{
            view: "app.reviews.show",
            delete: "app.reviews.destroy",
          }}
          customActions={[
            {
              id: "approve",
              label: "Approve",
              icon: CheckCircle,
              onClick: () => handleApprove(row),
              show: !row.is_approved,
              loading: actionLoading[`approve-${row.id}`],
            },
            {
              id: "reject",
              label: "Reject",
              icon: XCircle,
              onClick: () => handleReject(row),
              show: !row.is_approved,
              loading: actionLoading[`reject-${row.id}`],
            },
          ]}
          resourceName="review"
        />
      ),
    },
  ];

  const bulkActions = [
    {
      id: "approve",
      label: "Approve",
      icon: CheckCircle,
    },
    {
      id: "reject",
      label: "Reject",
      icon: XCircle,
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      confirm: {
        title: "Delete Selected Reviews",
        message: "Are you sure you want to delete the selected reviews? This action cannot be undone.",
      },
    },
  ];

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
    routeName: "app.reviews.index",
    filterConfigs,
  });

  return (
    <DataTable
      data={reviews.data}
      columns={columns}
      filters={filters}
      filterConfigs={filterConfigs}
      onFilterChange={handleFilterChange}
      selectedItems={selectedItems}
      onSelectionChange={handleSelectionChange}
      bulkActions={bulkActions}
      onBulkAction={handleBulkOperation}
      pagination={{
        currentPage: reviews.current_page,
        totalPages: reviews.last_page,
        perPage: reviews.per_page,
        total: reviews.total,
        from: reviews.from,
        to: reviews.to,
      }}
      onPageChange={handlePageChange}
      isLoading={isLoading}
      sorting={sorting}
      onSort={handleSort}
    />
  );
} 