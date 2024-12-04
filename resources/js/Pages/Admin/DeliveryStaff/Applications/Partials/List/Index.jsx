import React, { useState, useMemo } from "react";
import { DataTable } from "@/components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useToast } from "@/components/ui/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  Truck,
  Eye,
  Trash2,
  AlertTriangle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { router } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const statusConfig = {
  pending: { 
    color: "yellow", 
    icon: Clock, 
    label: "Pending Review",
    className: "bg-yellow-100 text-yellow-800"
  },
  under_review: { 
    color: "blue", 
    icon: AlertTriangle, 
    label: "Under Review",
    className: "bg-blue-100 text-blue-800"
  },
  approved: { 
    color: "green", 
    icon: CheckCircle, 
    label: "Approved",
    className: "bg-green-100 text-green-800"
  },
  rejected: { 
    color: "red", 
    icon: XCircle, 
    label: "Rejected",
    className: "bg-red-100 text-red-800"
  },
};

const ApplicationList = ({ applications, filters: initialFilters, vehicleTypes }) => {
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
    vehicle_type: {
      type: "select",
      label: "Vehicle Type",
      options: [
        { label: "All Vehicles", value: "" },
        ...Object.entries(vehicleTypes).map(([value, label]) => ({
          label,
          value
        }))
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
      
      await router.post(route("app.delivery-staff.applications.approve", id));
      
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
      await router.post(route("app.delivery-staff.applications.reject", rejectionDialog.id), {
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

  // Define columns
  const columns = useMemo(() => [
    {
      id: "full_name",
      header: "Applicant",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={row.profile_photo_url} alt={row.full_name} />
            <AvatarFallback>{row.full_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <span className="font-medium">{row.full_name}</span>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>{row.email}</span>
              {row.verified_identity && (
                <CheckCircle className="w-3 h-3 text-green-500" />
              )}
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "vehicle_type",
      header: "Vehicle",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {vehicleTypes[row.vehicle_type] || row.vehicle_type}
          </Badge>
          {row.verified_vehicle && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        const config = statusConfig[row.status] || statusConfig.pending;
        const Icon = config.icon;

        return (
          <div className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1",
            config.className
          )}>
            <Icon className="w-3 h-3" />
            <span className="capitalize">{config.label}</span>
          </div>
        );
      },
    },
    {
      id: "created_at",
      header: "Applied Date",
      cell: (row) => format(new Date(row.created_at), "PPP"),
      sortable: true,
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.get(route("app.delivery-staff.applications.show", row.id))}
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
  ], [actionLoading, vehicleTypes]);

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
    routeName: "app.delivery-staff.applications.index",
    initialFilters,
    sortableConfigs,
    filterConfigs,
  });

  // Define bulk actions
  const bulkActions = [
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
      variant: "destructive",
    },
    {
      id: "delete",
      label: "Delete Selected",
      icon: Trash2,
      variant: "destructive",
    },
  ];

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
        case 'approve':
          await router.post(route('app.delivery.staff.applications.bulk-approve'), {
            ids: selectedItems
          });
          break;
        case 'reject':
          setRejectionDialog({ open: true, id: selectedItems });
          return;
        case 'delete':
          await router.delete(route('app.delivery.staff.applications.bulk-delete'), {
            data: { ids: selectedItems }
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