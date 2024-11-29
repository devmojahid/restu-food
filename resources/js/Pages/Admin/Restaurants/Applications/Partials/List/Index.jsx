import React, { useState, useMemo } from "react";
import { DataTable } from "@/components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/components/ui/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  Store, 
  Eye,
  Trash2,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { RowActions } from "@/components/Table/RowActions";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { router } from "@inertiajs/react";

const ApplicationList = ({ applications, filters: initialFilters }) => {
  const { toast } = useToast();
  const [rejectionDialog, setRejectionDialog] = useState({ open: false, id: null });
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  // Define filterConfigs
  const filterConfigs = {
    status: {
      type: "select",
      label: "Status",
      options: [
        { label: "All Status", value: "" },
        { label: "Pending", value: "pending" },
        { label: "Under Review", value: "under_review" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" }
      ],
      defaultValue: "",
    }
  };

  // Define sortableConfigs
  const sortableConfigs = {
    restaurant_name: {
      key: "restaurant_name",
      label: "Restaurant",
      defaultDirection: "asc",
    },
    created_at: {
      key: "created_at",
      label: "Applied Date",
      defaultDirection: "desc",
      format: (value) => format(new Date(value), "PPP"),
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(prev => ({ ...prev, [id]: true }));
      
      await router.post(route("app.restaurants.applications.approve", { inquiry: id }));
      
      toast({
        title: "Success",
        description: "Application approved successfully",
      });
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve application",
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(prev => ({ ...prev, [rejectionDialog.id]: true }));
      await router.post(route("app.restaurants.applications.reject", rejectionDialog.id), {
        reason: rejectionReason
      });
      
      setRejectionDialog({ open: false, id: null });
      setRejectionReason("");
      
      toast({
        title: "Success",
        description: "Application rejected successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [rejectionDialog.id]: false }));
    }
  };

  // Define columns using useMemo to prevent unnecessary re-renders
  const columns = useMemo(() => [
    {
      id: "restaurant_name",
      header: "Restaurant",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-gray-500" />
          <div>
            <span className="font-medium">{row.restaurant_name}</span>
            <span className="text-sm text-gray-500 block">
              {row.restaurant_email}
            </span>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <div className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
          {
            "bg-yellow-100 text-yellow-800": row.status === "pending",
            "bg-blue-100 text-blue-800": row.status === "under_review",
            "bg-green-100 text-green-800": row.status === "approved",
            "bg-red-100 text-red-800": row.status === "rejected",
          }
        )}>
          {row.status}
        </div>
      ),
    },
    {
      id: "created_at",
      header: "Applied Date",
      cell: (row) => format(new Date(row.created_at), "PPP"),
      sortable: true,
    },
    {
      id: "view",
      header: "View",
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.get(route("app.restaurants.applications.show", row.id))}
          className="w-full"
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
      ),
    },
    {
      id: "approve",
      header: "Approve",
      cell: (row) => (
        row.status !== 'approved' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleApprove(row.id)}
            disabled={actionLoading[row.id]}
            className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {actionLoading[row.id] ? "Processing..." : "Approve"}
          </Button>
        )
      ),
    },
    {
      id: "reject",
      header: "Reject",
      cell: (row) => (
        row.status !== 'rejected' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRejectionDialog({ open: true, id: row.id })}
            disabled={actionLoading[row.id]}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <XCircle className="w-4 h-4 mr-2" />
            {actionLoading[row.id] ? "Processing..." : "Reject"}
          </Button>
        )
      ),
    },
  ], [actionLoading]); // Add dependencies for useMemo

  // Initialize useDataTable hook after columns are defined
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
    routeName: "app.restaurants.applications.index",
    initialFilters,
    sortableConfigs,
    filterConfigs,
  });

  // Define bulk actions properly
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
    }
  ];

  // Add this function before the return statement, after defining bulkActions
  const handleBulkOperation = async (action) => {
    if (!selectedItems.length) {
      toast({
        title: "Warning",
        description: "Please select items to perform this action",
        variant: "warning",
      });
      return;
    }

    try {
      switch (action) {
        case 'delete':
          await router.delete(route('app.restaurants.applications.bulk-delete'), {
            data: { ids: selectedItems }
          });
          break;
        case 'publish':
          await router.post(route('app.restaurants.applications.bulk-publish'), {
            ids: selectedItems,
            status: true
          });
          break;
        case 'unpublish':
          await router.post(route('app.restaurants.applications.bulk-unpublish'), {
            ids: selectedItems,
            status: false
          });
          break;
        default:
          return;
      }

      toast({
        title: "Success",
        description: "Bulk action completed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to perform bulk action",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DataTable
        data={applications.data}
        columns={columns}
        filters={filters}
        filterConfigs={filterConfigs}
        onFilterChange={handleFilterChange}
        selectedItems={selectedItems}
        onSelectionChange={handleSelectionChange}
        bulkActions={bulkActions}
        onBulkAction={handleBulkOperation}
        pagination={{
          currentPage: applications.current_page,
          totalPages: applications.last_page,
          perPage: applications.per_page,
          total: applications.total,
          from: applications.from,
          to: applications.to,
        }}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        sorting={{
          column: sorting.sort,
          direction: sorting.direction,
        }}
        onSort={handleSort}
        sortableConfigs={sortableConfigs}
      />

      <Dialog 
        open={rejectionDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setRejectionDialog({ open: false, id: null });
            setRejectionReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectionDialog({ open: false, id: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim() || actionLoading[rejectionDialog.id]}
            >
              {actionLoading[rejectionDialog.id] ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicationList;