import React, { useState, useMemo } from "react";
import { DataTable } from "@/components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/components/ui/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  ChefHat, 
  Eye,
  Store,
  Trash2,
  EyeOff,
  FileText,
  Clock,
  AlertCircle
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

const ApplicationList = ({ applications, filters: initialFilters, restaurants }) => {
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
    },
    restaurant_id: {
      type: "select",
      label: "Restaurant",
      options: [
        { label: "All Restaurants", value: "" },
        ...restaurants.map(r => ({ label: r.name, value: r.id }))
      ],
      defaultValue: "",
    }
  };

  // Define sortableConfigs
  const sortableConfigs = {
    full_name: {
      key: "full_name",
      label: "Name",
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
      
      await router.post(route("app.kitchen-staff.applications.approve", { inquiry: id }));
      
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
      await router.post(route("app.kitchen-staff.applications.reject", rejectionDialog.id), {
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
      id: "full_name",
      header: "Applicant",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <ChefHat className="w-4 h-4 text-gray-500" />
          <div>
            <span className="font-medium">{row.full_name}</span>
            <span className="text-sm text-gray-500 block">
              {row.email}
            </span>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "restaurant",
      header: "Restaurant",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-gray-500" />
          <div>
            <span>{row.restaurant?.name}</span>
            <span className="text-sm text-gray-500 block">
              {row.position_applied?.replace('_', ' ')}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "experience",
      header: "Experience",
      cell: (row) => (
        <div className="text-sm">
          <span className="font-medium">{row.years_of_experience} years</span>
          {row.specializations?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {row.specializations.slice(0, 2).map((spec, index) => (
                <span
                  key={index}
                  className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs"
                >
                  {spec}
                </span>
              ))}
              {row.specializations.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{row.specializations.length - 2} more
                </span>
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
      id: "actions",
      header: "",
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.get(route("app.kitchen-staff.applications.show", row.id))}
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          {row.status !== 'approved' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleApprove(row.id)}
              disabled={actionLoading[row.id]}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {actionLoading[row.id] ? "Processing..." : "Approve"}
            </Button>
          )}
          {row.status !== 'rejected' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRejectionDialog({ open: true, id: row.id })}
              disabled={actionLoading[row.id]}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              {actionLoading[row.id] ? "Processing..." : "Reject"}
            </Button>
          )}
        </div>
      ),
    },
  ], [actionLoading]);

  // Initialize useDataTable hook
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
    routeName: "app.kitchen-staff.applications.index",
    initialFilters,
    sortableConfigs,
    filterConfigs,
  });

  // Define bulk actions
  const bulkActions = [
    {
      id: "delete",
      label: "Delete Selected",
      icon: Trash2,
      variant: "destructive",
    },
    {
      id: "approve",
      label: "Approve Selected",
      icon: CheckCircle,
      variant: "default",
    },
    {
      id: "reject",
      label: "Reject Selected",
      icon: XCircle,
      variant: "default",
    }
  ];

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