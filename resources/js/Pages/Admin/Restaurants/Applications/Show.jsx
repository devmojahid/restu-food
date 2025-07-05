import React from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import {
  Home, Store, FileText, MapPin, Phone, Mail, Clock,
  DollarSign, User, Building2, CreditCard, CheckCircle2,
  XCircle, AlertCircle, Calendar, Image, FileType,
  Truck, Utensils, MapPinOff, History, Settings,
  CreditCard as PaymentIcon, Receipt, ClipboardList,
  ShieldCheck, Users, MessageSquare
} from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";

// Helper function to safely format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "PPP") : "Invalid date";
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
};

// Enhanced InfoItem component with better styling
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

// New Timeline component for history
const Timeline = ({ events }) => (
  <div className="space-y-4">
    {events.map((event, index) => (
      <div key={index} className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          {index !== events.length - 1 && (
            <div className="w-px h-full bg-border" />
          )}
        </div>
        <div className="flex-1 pb-4">
          <p className="text-sm font-medium">{event.title}</p>
          <p className="text-sm text-muted-foreground">{event.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(event.date)}
          </p>
        </div>
      </div>
    ))}
  </div>
);

// New DocumentPreview component
const DocumentPreview = ({ file }) => {
  if (!file) return null;

  const isImage = file.mime_type?.startsWith('image/');
  const fileSize = formatFileSize(file.size);

  return (
    <Card className="group hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="aspect-square rounded-lg bg-muted flex items-center justify-center mb-3 overflow-hidden">
          {isImage ? (
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FileType className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{fileSize}</p>
        <div className="mt-2 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.open(file.url, '_blank')}
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Add helper function for file size formatting
const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Update the MobileTabSelect component with better UI/UX
const MobileTabSelect = ({ tabs, activeTab, onTabChange }) => (
  <div className="p-4 md:hidden">
    <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap",
            "text-sm font-medium transition-all",
            "border border-border",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            activeTab === id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-background hover:bg-muted"
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  </div>
);

const ApplicationDetails = ({ application }) => {
  const { toast } = useToast();
  const [rejectionDialog, setRejectionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Tab definitions with icons
  const tabs = [
    { id: "overview", label: "Overview", icon: ClipboardList },
    { id: "details", label: "Details", icon: FileText },
    { id: "documents", label: "Documents", icon: FileType },
    { id: "delivery", label: "Delivery", icon: Truck },
    { id: "menu", label: "Menu", icon: Utensils },
    { id: "location", label: "Location", icon: MapPinOff },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      await router.post(route("app.restaurants.applications.approve", application.id));

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
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsSubmitting(true);
      await router.post(route("app.restaurants.applications.reject", application.id), {
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

  return (
    <AdminLayout>
      <Head title={`Application - ${application.restaurant_name}`} />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Applications", href: "app.restaurants.applications.index", icon: Store },
            { label: application.restaurant_name, icon: FileText },
          ]}
        />

        {/* Enhanced Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 p-2 md:p-0">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={application.logo_url} alt={application.restaurant_name} />
                <AvatarFallback>
                  <Store className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{application.restaurant_name}</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <StatusBadge status={application.status} />
                  <span>•</span>
                  <Calendar className="w-4 h-4" />
                  <span>Submitted {formatDate(application.created_at)}</span>
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
          {/* Mobile Tab Navigation */}
          <MobileTabSelect
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Desktop/Tablet Scrollable Tabs */}
          <div className="hidden md:block relative border-b">
            <ScrollArea className="w-full whitespace-nowrap" type="scroll">
              <TabsList className="inline-flex h-11 items-center justify-start rounded-none bg-transparent p-0 w-full">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <TabsTrigger
                    key={id}
                    value={id}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 px-4 py-2",
                      "text-sm font-medium transition-all relative",
                      "data-[state=active]:text-primary",
                      "border-b-2 border-transparent",
                      "data-[state=active]:border-primary",
                      "hover:bg-muted/50",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "disabled:pointer-events-none disabled:opacity-50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                    {id === activeTab && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Fade Indicators */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </ScrollArea>
          </div>

          {/* Tab Contents */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 md:p-0">
              {/* Quick Info Card */}
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    Restaurant Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <InfoItem
                    icon={Store}
                    label="Restaurant Name"
                    value={application.restaurant_name}
                  />
                  <InfoItem
                    icon={Mail}
                    label="Email"
                    value={application.restaurant_email}
                  />
                  <InfoItem
                    icon={Phone}
                    label="Phone"
                    value={application.restaurant_phone}
                  />
                  <InfoItem
                    icon={Utensils}
                    label="Cuisine Type"
                    value={application.cuisine_type}
                  />
                </CardContent>
              </Card>

              {/* Owner Information */}
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Owner Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <InfoItem
                    icon={User}
                    label="Owner Name"
                    value={application.owner_name}
                  />
                  <InfoItem
                    icon={Mail}
                    label="Owner Email"
                    value={application.owner_email}
                  />
                  <InfoItem
                    icon={Phone}
                    label="Owner Phone"
                    value={application.owner_phone}
                  />
                  <InfoItem
                    icon={FileText}
                    label="ID Type"
                    value={application.owner_id_type}
                  />
                </CardContent>
              </Card>

              {/* Business Information */}
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Business Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <InfoItem
                    icon={Building2}
                    label="Registration Number"
                    value={application.business_registration_number}
                  />
                  <InfoItem
                    icon={Receipt}
                    label="Tax Number"
                    value={application.tax_number}
                  />
                  <InfoItem
                    icon={Clock}
                    label="Operating Hours"
                    value={`${application.opening_time} - ${application.closing_time}`}
                  />
                  <InfoItem
                    icon={DollarSign}
                    label="Minimum Order"
                    value={application.minimum_order ? `$${application.minimum_order}` : "N/A"}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Description Card */}
            <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg">Restaurant Description</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <p className="text-sm whitespace-pre-wrap">{application.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2 md:p-0">
              {/* Address Information */}
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <InfoItem
                    icon={MapPin}
                    label="Street Address"
                    value={application.address}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="City"
                    value={application.city}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="State/Province"
                    value={application.state}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="Postal Code"
                    value={application.postal_code}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="Country"
                    value={application.country}
                  />
                </CardContent>
              </Card>

              {/* Banking Information */}
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PaymentIcon className="w-5 h-5" />
                    Banking Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <InfoItem
                    icon={PaymentIcon}
                    label="Bank Name"
                    value={application.bank_name}
                  />
                  <InfoItem
                    icon={PaymentIcon}
                    label="Account Name"
                    value={application.bank_account_name}
                  />
                  <InfoItem
                    icon={PaymentIcon}
                    label="Account Number"
                    value={application.bank_account_number}
                  />
                  <InfoItem
                    icon={Building2}
                    label="Branch"
                    value={application.bank_branch}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 md:p-0">
              {/* Business License */}
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Business License
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  {application.files?.business_license ? (
                    <DocumentPreview file={application.files.business_license} />
                  ) : (
                    <div className="text-center p-6 text-muted-foreground bg-muted rounded-lg">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p>No business license uploaded</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Owner ID */}
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Owner ID
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  {application.files?.owner_id ? (
                    <DocumentPreview file={application.files.owner_id} />
                  ) : (
                    <div className="text-center p-6 text-muted-foreground bg-muted rounded-lg">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p>No owner ID uploaded</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Restaurant Photos */}
              <Card className="col-span-full lg:col-span-1 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Restaurant Photos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
                    {application.files?.restaurant_photos?.length > 0 ? (
                      application.files.restaurant_photos.map((photo, index) => (
                        <DocumentPreview key={index} file={photo} />
                      ))
                    ) : (
                      <div className="col-span-full text-center p-6 text-muted-foreground bg-muted rounded-lg">
                        <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p>No restaurant photos uploaded</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Delivery Settings */}
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Delivery Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span className="font-medium">Delivery Available</span>
                    </div>
                    <Badge variant={application.delivery_available ? "success" : "secondary"}>
                      {application.delivery_available ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <InfoItem
                    icon={MapPin}
                    label="Delivery Radius"
                    value={`${application.delivery_radius} km`}
                  />
                  <InfoItem
                    icon={DollarSign}
                    label="Delivery Fee"
                    value={`$${application.delivery_fee}`}
                  />
                  <InfoItem
                    icon={DollarSign}
                    label="Minimum Order"
                    value={`$${application.minimum_order}`}
                  />
                </CardContent>
              </Card>

              {/* Operating Hours */}
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Operating Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    <InfoItem
                      icon={Clock}
                      label="Opening Time"
                      value={application.opening_time}
                    />
                    <InfoItem
                      icon={Clock}
                      label="Closing Time"
                      value={application.closing_time}
                    />
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Weekly Schedule</h4>
                      {application.opening_hours && typeof application.opening_hours === 'object' ? (
                        Object.entries(application.opening_hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between text-sm">
                            <span className="font-medium capitalize">{day}</span>
                            <span className="text-muted-foreground">{hours || 'Closed'}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No schedule available</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Application History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <Timeline events={[
                  {
                    title: "Application Submitted",
                    description: "Restaurant application was submitted",
                    date: application.created_at,
                  },
                  ...(application.status === 'approved' ? [{
                    title: "Application Approved",
                    description: "Restaurant application was approved",
                    date: application.approved_at,
                  }] : []),
                  ...(application.status === 'rejected' ? [{
                    title: "Application Rejected",
                    description: application.rejection_reason,
                    date: application.updated_at,
                  }] : []),
                ]} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Application Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={ShieldCheck}
                    label="Email Verified"
                    value={application.verified_email ? "Yes" : "No"}
                  />
                  <InfoItem
                    icon={ShieldCheck}
                    label="Phone Verified"
                    value={application.verified_phone ? "Yes" : "No"}
                  />
                  <InfoItem
                    icon={ShieldCheck}
                    label="Address Verified"
                    value={application.verified_address ? "Yes" : "No"}
                  />
                  <InfoItem
                    icon={Users}
                    label="Terms Accepted"
                    value={application.terms_accepted ? "Yes" : "No"}
                  />
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
          <DialogContent className="sm:max-w-[425px]">
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
    </AdminLayout>
  );
};

export default ApplicationDetails; 