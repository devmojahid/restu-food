import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { 
  Home, Truck, FileText, MapPin, Phone, Mail, Clock, 
  DollarSign, User, Building2, CreditCard, CheckCircle2,
  XCircle, AlertCircle, Calendar, Image as ImageIcon, FileType,
  Shield, Users, MessageSquare, Car, Bike
} from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card";
import { format, parseISO, isValid } from "date-fns";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Textarea } from "@/Components/ui/textarea";
import { useToast } from "@/Components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Progress } from "@/Components/ui/progress";
import { Separator } from "@/Components/ui/separator";
import MobileTabSelect from "./Partials/Tabs/MobileTabSelect";
import TabHeader from "./Partials/Tabs/TabHeader";
import LoadingState from "./Partials/Loading/LoadingState";

// Helper function to safely format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    // First try parsing as ISO string
    let date = parseISO(dateString);
    
    // If not valid, try creating a new Date object
    if (!isValid(date)) {
      date = new Date(dateString);
    }
    
    // Check if the date is valid before formatting
    if (!isValid(date)) {
      console.error("Invalid date:", dateString);
      return "Invalid date";
    }
    
    return format(date, "PPP");
  } catch (error) {
    console.error("Date formatting error:", error, dateString);
    return "Invalid date";
  }
};

// Add a date validator helper
const isValidDateString = (dateString) => {
  if (!dateString) return false;
  try {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  } catch {
    return false;
  }
};

// Enhanced InfoItem component
const InfoItem = ({ icon: Icon, label, value, className, description }) => (
  <div className={cn(
    "flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors",
    "flex-col sm:flex-row",
    className
  )}>
    <div className="flex items-center gap-2 sm:items-start">
      <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
      <p className="text-sm font-medium sm:hidden">{label}</p>
    </div>
    <div className="flex-1 w-full sm:w-auto">
      <p className="text-sm font-medium hidden sm:block">{label}</p>
      <p className="text-sm text-muted-foreground break-words">
        {value !== undefined && value !== null && value !== '' ? value : 'N/A'}
      </p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  </div>
);

// Enhanced StatusBadge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: "yellow", icon: AlertCircle, label: "Pending Review" },
    under_review: { color: "blue", icon: Clock, label: "Under Review" },
    approved: { color: "green", icon: CheckCircle2, label: "Approved" },
    rejected: { color: "red", icon: XCircle, label: "Rejected" },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant={config.color} className="gap-1.5 px-3 py-1">
      <Icon className="w-3.5 h-3.5" />
      <span className="font-medium">{config.label}</span>
    </Badge>
  );
};

// Vehicle Icon component
const getVehicleIcon = (type) => {
  const icons = {
    car: Car,
    motorcycle: Truck,
    bicycle: Bike,
    scooter: Truck,
    van: Truck,
  };

  return icons[type] || Car;
};

const ApplicationDetails = ({ application: initialApplication }) => {
  const { toast } = useToast();
  const [rejectionDialog, setRejectionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [application, setApplication] = useState(initialApplication);
  const [error, setError] = useState(null);

  // Add useEffect to handle initial data
  useEffect(() => {
    if (initialApplication) {
      setApplication(initialApplication);
    }
  }, [initialApplication]);

  // Fetch application data
  const fetchApplicationData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await router.get(
        route('app.delivery-staff.applications.show', application.id),
        {},
        {
          preserveState: true,
          preserveScroll: true,
          onSuccess: (page) => {
            if (page.props.application) {
              setApplication(page.props.application);
            }
          },
          onError: (errors) => {
            setError(errors.message || 'Failed to fetch application details');
            toast({
              title: "Error",
              description: errors.message || "Failed to fetch application details",
              variant: "destructive",
            });
          }
        }
      );
    } catch (error) {
      setError(error.message || 'Failed to fetch application details');
      toast({
        title: "Error",
        description: error.message || "Failed to fetch application details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data after actions
  const refreshData = () => {
    fetchApplicationData();
  };

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      setIsLoading(true);
      
      await router.post(route("app.delivery-staff.applications.approve", application.id), {}, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Application approved successfully",
          });
          refreshData();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to approve application",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      console.error("Approval error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve application",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsSubmitting(true);
      await router.post(
        route("app.delivery-staff.applications.reject", application.id), 
        { reason: rejectionReason },
        {
          onSuccess: () => {
            setRejectionDialog(false);
            setRejectionReason("");
            toast({
              title: "Success",
              description: "Application rejected successfully",
            });
            refreshData();
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: error.message || "Failed to reject application",
              variant: "destructive",
            });
          },
        }
      );
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

  // Add event handlers for tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Tab definitions with icons
  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "documents", label: "Documents", icon: FileType },
    { id: "vehicle", label: "Vehicle", icon: Car },
    { id: "background", label: "Background", icon: Shield },
    { id: "history", label: "History", icon: Clock },
  ];

  // Add data validation check
  const isValidData = (data) => {
    return data && typeof data === 'object' && Object.keys(data).length > 0;
  };

  // Update the return statement to handle loading and error states better
  return (
    <AdminLayout>
      <Head title={`Application - ${application?.full_name || 'Loading...'}`} />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Applications", href: "app.delivery-staff.applications.index", icon: Truck },
            { label: application?.full_name || 'Loading...', icon: FileText },
          ]}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-medium">Error loading application</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <LoadingState />
        ) : isValidData(application) ? (
          <>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={application.profile_photo_url} alt={application.full_name} />
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
                      <span>Applied {isValidDateString(application.created_at) ? formatDate(application.created_at) : 'N/A'}</span>
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

            {/* Tabs Section */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="sticky top-0 z-30 bg-background pb-4 mb-4 border-b">
                <MobileTabSelect 
                  tabs={tabs} 
                  activeTab={activeTab} 
                  onTabChange={setActiveTab} 
                />
                <TabHeader 
                  tabs={tabs} 
                  activeTab={activeTab} 
                  onTabChange={setActiveTab} 
                />
              </div>

              {/* Tab Contents */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <InfoItem 
                        icon={User} 
                        label="Full Name" 
                        value={application.full_name}
                      />
                      <InfoItem 
                        icon={Mail} 
                        label="Email" 
                        value={application.email}
                      />
                      <InfoItem 
                        icon={Phone} 
                        label="Phone" 
                        value={application.phone}
                      />
                      <InfoItem 
                        icon={Calendar} 
                        label="Date of Birth" 
                        value={isValidDateString(application.date_of_birth) ? formatDate(application.date_of_birth) : 'N/A'}
                      />
                    </CardContent>
                  </Card>

                  {/* Vehicle Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          {React.createElement(getVehicleIcon(application.vehicle_type), {
                            className: "w-5 h-5"
                          })}
                          <span>{application.vehicle_type}</span>
                        </div>
                        Vehicle Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <InfoItem 
                        icon={Car} 
                        label="Vehicle Model" 
                        value={application.vehicle_model}
                      />
                      <InfoItem 
                        icon={Calendar} 
                        label="Vehicle Year" 
                        value={application.vehicle_year}
                      />
                      <InfoItem 
                        icon={FileText} 
                        label="License Plate" 
                        value={application.license_plate}
                      />
                    </CardContent>
                  </Card>

                  {/* Address Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Address Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <InfoItem 
                        icon={MapPin} 
                        label="Address" 
                        value={application.address}
                      />
                      <InfoItem 
                        icon={MapPin} 
                        label="City" 
                        value={application.city}
                      />
                      <InfoItem 
                        icon={MapPin} 
                        label="State" 
                        value={application.state}
                      />
                      <InfoItem 
                        icon={MapPin} 
                        label="Postal Code" 
                        value={application.postal_code}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                {/* Document verification section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* ID Proof */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">ID Proof</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {application.id_proof_url ? (
                        <div className="space-y-4">
                          <img 
                            src={application.id_proof_url} 
                            alt="ID Proof" 
                            className="w-full rounded-lg"
                          />
                          <Button className="w-full" variant="outline">
                            <FileType className="w-4 h-4 mr-2" />
                            View Document
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center p-6 bg-muted rounded-lg">
                          <FileType className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p>No ID proof uploaded</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Driving License */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Driving License</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {application.driving_license_url ? (
                        <div className="space-y-4">
                          <img 
                            src={application.driving_license_url} 
                            alt="Driving License" 
                            className="w-full rounded-lg"
                          />
                          <Button className="w-full" variant="outline">
                            <FileType className="w-4 h-4 mr-2" />
                            View Document
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center p-6 bg-muted rounded-lg">
                          <FileType className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p>No driving license uploaded</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Vehicle Insurance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Vehicle Insurance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {application.vehicle_insurance_url ? (
                        <div className="space-y-4">
                          <img 
                            src={application.vehicle_insurance_url} 
                            alt="Vehicle Insurance" 
                            className="w-full rounded-lg"
                          />
                          <Button className="w-full" variant="outline">
                            <FileType className="w-4 h-4 mr-2" />
                            View Document
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center p-6 bg-muted rounded-lg">
                          <FileType className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p>No insurance document uploaded</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="vehicle" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Vehicle Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Car className="w-5 h-5" />
                        Vehicle Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <InfoItem 
                          icon={Car} 
                          label="Vehicle Model" 
                          value={application.vehicle_model}
                        />
                        <InfoItem 
                          icon={Calendar} 
                          label="Vehicle Year" 
                          value={application.vehicle_year}
                        />
                        <InfoItem 
                          icon={FileText} 
                          label="Color" 
                          value={application.vehicle_color}
                        />
                        <InfoItem 
                          icon={FileText} 
                          label="License Plate" 
                          value={application.license_plate}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Vehicle Photos */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        Vehicle Photos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {application.vehicle_photos?.map((photo, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                            <img 
                              src={photo.url} 
                              alt={`Vehicle photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="background" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Background Check */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Background Check
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <InfoItem 
                          icon={Shield} 
                          label="Criminal Record" 
                          value={application.has_criminal_record ? "Yes" : "No"}
                        />
                        {application.has_criminal_record && (
                          <InfoItem 
                            icon={FileText} 
                            label="Details" 
                            value={application.criminal_record_details}
                          />
                        )}
                        <InfoItem 
                          icon={Shield} 
                          label="Background Check Consent" 
                          value={application.background_check_consent ? "Given" : "Not Given"}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Experience */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Experience
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <InfoItem 
                          icon={Clock} 
                          label="Years of Experience" 
                          value={`${application.years_of_experience} years`}
                        />
                        <InfoItem 
                          icon={FileText} 
                          label="Previous Experience" 
                          value={application.previous_experience}
                        />
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Delivery Experience</h4>
                          <div className="flex flex-wrap gap-2">
                            {application.delivery_experience?.map((exp, index) => (
                              <Badge key={index} variant="secondary">
                                {exp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Application History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {application.status_history?.map((history, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                            {index !== application.status_history.length - 1 && (
                              <div className="w-px h-full bg-border" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <p className="text-sm font-medium capitalize">{history.status}</p>
                            <p className="text-sm text-muted-foreground">{history.comment}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(history.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="p-4 rounded-full bg-muted">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No Data Available</h3>
            <p className="text-sm text-muted-foreground">
              The application data could not be loaded.
            </p>
            <Button 
              variant="outline" 
              onClick={fetchApplicationData}
              disabled={isLoading}
            >
              {isLoading ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ApplicationDetails; 