import React from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { 
  Home, ChefHat, FileText, MapPin, Phone, Mail, Clock, 
  DollarSign, User, Building2, CreditCard, CheckCircle2,
  XCircle, AlertCircle, Calendar, Image, FileType,
  Briefcase, GraduationCap, Heart, Shield
} from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { format, parseISO, isValid } from "date-fns";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Textarea } from "@/Components/ui/textarea";
import { useToast } from "@/Components/ui/use-toast";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Progress } from "@/Components/ui/progress";
import { Separator } from "@/Components/ui/separator";

// Import helper components
import InfoItem from "./Partials/Show/InfoItem";
import StatusBadge from "./Partials/Show/StatusBadge";
import DocumentPreview from "./Partials/Show/DocumentPreview";
import Timeline from "./Partials/Show/Timeline";

// Add these imports for the tab components
import Overview from "./Partials/Show/Tabs/Overview";
import Details from "./Partials/Show/Tabs/Details";
import Documents from "./Partials/Show/Tabs/Documents";
import Experience from "./Partials/Show/Tabs/Experience";
import Certifications from "./Partials/Show/Tabs/Certifications";
import Availability from "./Partials/Show/Tabs/Availability";
import History from "./Partials/Show/Tabs/History";

const ApplicationDetails = ({ application }) => {
  const { toast } = useToast();
  const [rejectionDialog, setRejectionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  // Tab definitions with icons
  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "details", label: "Details", icon: User },
    { id: "documents", label: "Documents", icon: FileType },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "certifications", label: "Certifications", icon: GraduationCap },
    { id: "availability", label: "Availability", icon: Clock },
    { id: "history", label: "History", icon: AlertCircle },
  ];

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      setIsSubmitting(true);
      await router.post(route("app.kitchen-staff.applications.approve", application.id));
      
      toast({
        title: "Success",
        description: "Application approved successfully",
      });
    } catch (error) {
      console.error("Approval error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve application",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsSubmitting(true);
      await router.post(route("app.kitchen-staff.applications.reject", application.id), {
        reason: rejectionReason
      });
      
      setRejectionDialog(false);
      setRejectionReason("");
      
      toast({
        title: "Success",
        description: "Application rejected successfully",
      });
    } catch (error) {
      console.error("Rejection error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject application",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this helper function inside the component
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "PPP") : "Invalid date";
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  // Add error boundary component
  const ErrorBoundary = ({ children }) => {
    if (!application) {
      return (
        <div className="p-4 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
          <p className="text-lg font-medium">Error Loading Application</p>
          <p className="text-sm text-muted-foreground">
            Unable to load application details. Please try again.
          </p>
        </div>
      );
    }
    return children;
  };

  return (
    <AdminLayout>
      <Head title={`Application - ${application?.full_name || 'Loading...'}`} />
      <ErrorBoundary>
        <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "dashboard", icon: Home },
              { label: "Applications", href: "app.kitchen-staff.applications.index", icon: ChefHat },
              { label: application.full_name, icon: FileText },
            ]}
          />

          {/* Enhanced Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={application.photo_url} alt={application.full_name} />
                  <AvatarFallback>
                    <User className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{application.full_name}</h1>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <StatusBadge status={application.status} />
                    <span>•</span>
                    <Calendar className="w-4 h-4" />
                    <span>Applied {formatDate(application.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {application.status === 'pending' && (
              <div className="flex gap-3 w-full md:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setRejectionDialog(true)}
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Processing..." : "Approve"}
                </Button>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="relative border-b">
              <ScrollArea className="w-full whitespace-nowrap" type="scroll">
                <TabsList className="inline-flex h-11 items-center justify-start rounded-none bg-transparent p-0">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <TabsTrigger
                      key={id}
                      value={id}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 px-4 py-2",
                        "text-sm font-medium transition-all relative",
                        "data-[state=active]:text-primary",
                        "border-b-2 border-transparent",
                        "data-[state=active]:border-primary"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>

            {/* Tab Contents */}
            <TabsContent value="overview">
              <Overview application={application} />
            </TabsContent>

            <TabsContent value="details">
              <Details application={application} />
            </TabsContent>

            <TabsContent value="documents">
              <Documents application={application} />
            </TabsContent>

            <TabsContent value="experience">
              <Experience application={application} />
            </TabsContent>

            <TabsContent value="certifications">
              <Certifications application={application} />
            </TabsContent>

            <TabsContent value="availability">
              <Availability application={application} />
            </TabsContent>

            <TabsContent value="history">
              <History application={application} />
            </TabsContent>
          </Tabs>

          {/* Rejection Dialog */}
          <Dialog 
            open={rejectionDialog} 
            onOpenChange={(open) => {
              if (!open) {
                setRejectionDialog(false);
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
                  onClick={() => setRejectionDialog(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || isSubmitting}
                >
                  {isSubmitting ? "Rejecting..." : "Reject"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default ApplicationDetails; 