import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import {
  Store,
  MapPin,
  Building2,
  User,
  Clock,
  Truck,
  FileText,
  Save,
  AlertCircle,
  DollarSign,
  Phone,
  Mail,
  MapIcon,
  Building,
  Utensils,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { TimePicker } from "@/Components/ui/time-picker";
import { Checkbox } from "@/Components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useToast } from "@/Components/ui/use-toast";

const FILE_COLLECTIONS = {
  BUSINESS_LICENSE: {
    name: "business_license",
    maxFiles: 1,
    fileType: "document",
    title: "Business License",
    description: "Upload your business license (PDF, JPG, PNG)",
  },
  OWNER_ID: {
    name: "owner_id",
    maxFiles: 1,
    fileType: "document",
    title: "Owner ID",
    description: "Upload owner's ID document (PDF, JPG, PNG)",
  },
  RESTAURANT_PHOTOS: {
    name: "restaurant_photos",
    maxFiles: 5,
    fileType: "image",
    title: "Restaurant Photos",
    description: "Upload up to 5 photos of your restaurant",
  },
};

const INITIAL_FORM_STATE = {
  // Restaurant Information
  restaurant_name: "",
  description: "",
  cuisine_type: "",
  restaurant_phone: "",
  restaurant_email: "",
  
  // Address Information
  address: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  latitude: "",
  longitude: "",
  
  // Business Information
  business_registration_number: "",
  tax_number: "",
  bank_account_name: "",
  bank_account_number: "",
  bank_name: "",
  bank_branch: "",
  
  // Owner Information
  owner_name: "",
  owner_phone: "",
  owner_email: "",
  owner_id_type: "",
  owner_id_number: "",
  
  // Operational Information
  opening_time: "",
  closing_time: "",
  seating_capacity: "",
  delivery_available: true,
  pickup_available: true,
  delivery_radius: "",
  minimum_order: "",
  delivery_fee: "",
  
  // Documents
  business_license: null,
  owner_id: null,
  restaurant_photos: [],
  
  // Terms
  terms_accepted: false,
};

const ErrorAlert = ({ errors }) => {
  if (!Object.keys(errors).length) return null;

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1">
          {Object.entries(errors).map(([field, messages]) => (
            <li key={field} className="text-sm">
              <span className="font-medium capitalize">
                {field.replace("_", " ")}
              </span>
              : {Array.isArray(messages) ? messages[0] : messages}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

const TabButton = ({ active, icon: Icon, label, onClick, disabled, isCompleted }) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    disabled={disabled}
    className={cn(
      "relative flex items-center gap-2 p-4 transition-all",
      "w-full sm:w-auto min-w-[120px]",
      "text-sm font-medium rounded-lg",
      "focus:outline-none focus:ring-2 focus:ring-primary/20",
      "border border-gray-200 dark:border-gray-700",
      "hover:scale-105 transition-transform duration-200",
      "flex flex-col sm:flex-row items-center justify-center sm:justify-start",
      active ? (
        "bg-primary text-white shadow-lg"
      ) : isCompleted ? (
        "bg-primary/10 text-primary hover:bg-primary/20"
      ) : (
        "hover:bg-gray-100 dark:hover:bg-gray-800"
      ),
      disabled && "opacity-50 cursor-not-allowed"
    )}
  >
    <div className="relative">
      <Icon className="w-5 h-5 mb-1 sm:mb-0 sm:mr-2" />
      {isCompleted && !active && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>
    <span className="text-xs sm:text-sm">{label}</span>
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-full" />
    )}
  </button>
);

const FormSection = ({ title, description, children }) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
      {children}
    </div>
  </div>
);

const FormField = ({ label, required, error, children }) => (
  <div className="space-y-2 w-full">
    <Label className="block text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <div className="mt-1">
    {children}
    </div>
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default function RestaurantApplicationForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("restaurant");
  const { data, setData, post, reset, processing, errors } = useForm(INITIAL_FORM_STATE);

  const tabs = [
    {
      id: "restaurant",
      label: "Restaurant Info",
      icon: Store,
      content: (
        <FormSection
          title="Restaurant Information"
          description="Basic information about your restaurant"
        >
          <FormField label="Restaurant Name" required error={errors.restaurant_name}>
            <Input
              value={data.restaurant_name}
              onChange={(e) => setData("restaurant_name", e.target.value)}
              placeholder="Enter restaurant name"
            />
          </FormField>

          <FormField label="Cuisine Type" required error={errors.cuisine_type}>
            <Select
              value={data.cuisine_type}
              onValueChange={(value) => setData("cuisine_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cuisine type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
                <SelectItem value="mexican">Mexican</SelectItem>
                <SelectItem value="thai">Thai</SelectItem>
                <SelectItem value="american">American</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Phone Number" required error={errors.restaurant_phone}>
            <Input
              type="tel"
              value={data.restaurant_phone}
              onChange={(e) => setData("restaurant_phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </FormField>

          <FormField label="Email" required error={errors.restaurant_email}>
            <Input
              type="email"
              value={data.restaurant_email}
              onChange={(e) => setData("restaurant_email", e.target.value)}
              placeholder="restaurant@example.com"
            />
          </FormField>

          <div className="col-span-1 sm:col-span-2">
            <FormField label="Description" error={errors.description}>
              <Textarea
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                placeholder="Tell us about your restaurant..."
                className="h-32 w-full"
              />
            </FormField>
          </div>
        </FormSection>
      ),
    },
    {
      id: "address",
      label: "Address",
      icon: MapPin,
      content: (
        <FormSection
          title="Address Information"
          description="Location details of your restaurant"
        >
          <FormField label="Street Address" required error={errors.address}>
            <Input
              value={data.address}
              onChange={(e) => setData("address", e.target.value)}
              placeholder="123 Restaurant Street"
            />
          </FormField>

          <FormField label="City" required error={errors.city}>
            <Input
              value={data.city}
              onChange={(e) => setData("city", e.target.value)}
              placeholder="City name"
            />
          </FormField>

          <FormField label="State/Province" error={errors.state}>
            <Input
              value={data.state}
              onChange={(e) => setData("state", e.target.value)}
              placeholder="State or province"
            />
          </FormField>

          <FormField label="Postal Code" required error={errors.postal_code}>
            <Input
              value={data.postal_code}
              onChange={(e) => setData("postal_code", e.target.value)}
              placeholder="Postal code"
            />
          </FormField>

          <FormField label="Country" required error={errors.country}>
            <Select
              value={data.country}
              onValueChange={(value) => setData("country", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                {/* Add more countries as needed */}
              </SelectContent>
            </Select>
          </FormField>
        </FormSection>
      ),
    },
    {
      id: "business",
      label: "Business Info",
      icon: Building,
      content: (
        <FormSection
          title="Business Information"
          description="Legal and financial details of your business"
        >
          <FormField 
            label="Business Registration Number" 
            required 
            error={errors.business_registration_number}
          >
            <Input
              value={data.business_registration_number}
              onChange={(e) => setData("business_registration_number", e.target.value)}
              placeholder="Registration number"
            />
          </FormField>

          <FormField label="Tax Number" required error={errors.tax_number}>
            <Input
              value={data.tax_number}
              onChange={(e) => setData("tax_number", e.target.value)}
              placeholder="Tax identification number"
            />
          </FormField>

          <FormField 
            label="Bank Account Name" 
            required 
            error={errors.bank_account_name}
          >
            <Input
              value={data.bank_account_name}
              onChange={(e) => setData("bank_account_name", e.target.value)}
              placeholder="Account holder name"
            />
          </FormField>

          <FormField 
            label="Bank Account Number" 
            required 
            error={errors.bank_account_number}
          >
            <Input
              value={data.bank_account_number}
              onChange={(e) => setData("bank_account_number", e.target.value)}
              placeholder="Account number"
            />
          </FormField>

          <FormField label="Bank Name" required error={errors.bank_name}>
            <Input
              value={data.bank_name}
              onChange={(e) => setData("bank_name", e.target.value)}
              placeholder="Bank name"
            />
          </FormField>

          <FormField label="Bank Branch" error={errors.bank_branch}>
            <Input
              value={data.bank_branch}
              onChange={(e) => setData("bank_branch", e.target.value)}
              placeholder="Branch name or code"
            />
          </FormField>
        </FormSection>
      ),
    },
    {
      id: "owner",
      label: "Owner Info",
      icon: User,
      content: (
        <FormSection
          title="Owner Information"
          description="Details about the restaurant owner"
        >
          <FormField label="Owner Name" required error={errors.owner_name}>
            <Input
              value={data.owner_name}
              onChange={(e) => setData("owner_name", e.target.value)}
              placeholder="Full name"
            />
          </FormField>

          <FormField label="Owner Phone" required error={errors.owner_phone}>
            <Input
              type="tel"
              value={data.owner_phone}
              onChange={(e) => setData("owner_phone", e.target.value)}
              placeholder="Contact number"
            />
          </FormField>

          <FormField label="Owner Email" required error={errors.owner_email}>
            <Input
              type="email"
              value={data.owner_email}
              onChange={(e) => setData("owner_email", e.target.value)}
              placeholder="Email address"
            />
          </FormField>

          <FormField label="ID Type" required error={errors.owner_id_type}>
            <Select
              value={data.owner_id_type}
              onValueChange={(value) => setData("owner_id_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="national_id">National ID</SelectItem>
                <SelectItem value="drivers_license">Driver's License</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="ID Number" required error={errors.owner_id_number}>
            <Input
              value={data.owner_id_number}
              onChange={(e) => setData("owner_id_number", e.target.value)}
              placeholder="ID number"
            />
          </FormField>
        </FormSection>
      ),
    },
    {
      id: "operations",
      label: "Operations",
      icon: Clock,
      content: (
        <FormSection
          title="Operational Information"
          description="Restaurant operating hours and capacity"
        >
          <FormField label="Opening Time" required error={errors.opening_time}>
            <Input
              type="time"
              id="opening_time"
              value={data.opening_time}
              onChange={(e) => setData("opening_time", e.target.value)}
              className="w-full"
              error={errors.opening_time}
            />
          </FormField>

          <FormField label="Closing Time" required error={errors.closing_time}>
            <Input
              type="time"
              id="closing_time"
              value={data.closing_time}
              onChange={(e) => setData("closing_time", e.target.value)}
              className="w-full"
              error={errors.closing_time}
            />
          </FormField>

          <FormField label="Seating Capacity" error={errors.seating_capacity}>
            <Input
              type="number"
              value={data.seating_capacity}
              onChange={(e) => setData("seating_capacity", e.target.value)}
              placeholder="Number of seats"
              min="1"
            />
          </FormField>

          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="delivery_available">Delivery Available</Label>
              <Switch
                id="delivery_available"
                checked={data.delivery_available}
                onCheckedChange={(checked) => setData("delivery_available", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="pickup_available">Pickup Available</Label>
              <Switch
                id="pickup_available"
                checked={data.pickup_available}
                onCheckedChange={(checked) => setData("pickup_available", checked)}
              />
            </div>
          </div>
        </FormSection>
      ),
    },
    {
      id: "delivery",
      label: "Delivery",
      icon: Truck,
      content: (
        <FormSection
          title="Delivery Settings"
          description="Delivery options and pricing"
        >
          <FormField 
            label="Delivery Radius (km)" 
            required={data.delivery_available}
            error={errors.delivery_radius}
          >
            <Input
              type="number"
              value={data.delivery_radius}
              onChange={(e) => setData("delivery_radius", e.target.value)}
              placeholder="Maximum delivery distance"
              min="0"
              step="0.1"
              disabled={!data.delivery_available}
            />
          </FormField>

          <FormField 
            label="Minimum Order ($)" 
            error={errors.minimum_order}
          >
            <Input
              type="number"
              value={data.minimum_order}
              onChange={(e) => setData("minimum_order", e.target.value)}
              placeholder="Minimum order amount"
              min="0"
              step="0.01"
            />
          </FormField>

          <FormField 
            label="Delivery Fee ($)" 
            required={data.delivery_available}
            error={errors.delivery_fee}
          >
            <Input
              type="number"
              value={data.delivery_fee}
              onChange={(e) => setData("delivery_fee", e.target.value)}
              placeholder="Delivery fee amount"
              min="0"
              step="0.01"
              disabled={!data.delivery_available}
            />
          </FormField>
        </FormSection>
      ),
    },
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      content: (
        <FormSection
          title="Required Documents"
          description="Upload necessary documentation"
        >
          {Object.values(FILE_COLLECTIONS).map((collection) => (
            <div key={collection.name} className="col-span-2">
              <FormField 
                label={collection.title} 
                required 
                error={errors[collection.name]}
              >
                <FileUploader
                  maxFiles={collection.maxFiles}
                  fileType={collection.fileType}
                  collection={collection.name}
                  value={data[collection.name]}
                  onUpload={(files) => setData(collection.name, files)}
                  description={collection.description}
                />
              </FormField>
            </div>
          ))}

          <div className="col-span-2 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={data.terms_accepted}
                onCheckedChange={(checked) => setData("terms_accepted", checked)}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the terms and conditions
              </Label>
            </div>
            {errors.terms_accepted && (
              <p className="text-sm text-red-500 mt-1">{errors.terms_accepted}</p>
            )}
          </div>
        </FormSection>
      ),
    },
  ];

  const isTabCompleted = (tabId) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    return tabIndex < currentIndex;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("app.restaurants.applications.store"), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
      },
      onError: (errors) => {
        toast({
          title: "Error",
          description: "Please check the form for errors",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Enhanced Tab Navigation */}
            <div className="block sm:hidden mb-4">
            <Select
                value={activeTab}
                onValueChange={setActiveTab}
            >
                <SelectTrigger className="w-full">
                <SelectValue>
                    {(() => {
                    const currentTab = tabs.find(tab => tab.id === activeTab);
                    const Icon = currentTab?.icon;
                    return (
                        <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4" />}
                        {currentTab?.label}
                        </div>
                    );
                    })()}
                </SelectValue>
                </SelectTrigger>
                <SelectContent>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                    <SelectItem key={tab.id} value={tab.id}>
                        <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {tab.label}
                        </div>
                    </SelectItem>
                    );
                })}
                </SelectContent>
                </Select>
              </div>

              {/* Desktop Tab Navigation */}
              <div className="hidden sm:flex gap-2 overflow-x-auto pb-2">
                <div className="flex space-x-2 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {tabs.map((tab) => (
                    <TabButton
                        type="button"
                        key={tab.id}
                        active={activeTab === tab.id}
                        icon={tab.icon}
                        label={tab.label}
                        onClick={() => setActiveTab(tab.id)}
                        isCompleted={isTabCompleted(tab.id)}
                    />
                    ))}
                </div>
            </div>

              {/* Progress Bar */}
              <div className="mt-4 hidden sm:block">
                <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
                    style={{
                        width: `${((tabs.findIndex(tab => tab.id === activeTab) + 1) / tabs.length) * 100}%`
                    }}
                    />
                    <div className="absolute top-0 left-0 w-full h-full">
                    {tabs.map((_, index) => (
                        <div
                        key={index}
                        className={cn(
                            "absolute top-0 h-full w-px bg-white/50",
                            "transition-opacity duration-300",
                            index === 0 || index === tabs.length - 1 ? "opacity-0" : "opacity-100"
                        )}
                        style={{ left: `${((index + 1) / tabs.length) * 100}%` }}
                        />
                    ))}
                    </div>
                </div>
                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                    <span>Step {tabs.findIndex(tab => tab.id === activeTab) + 1} of {tabs.length}</span>
                    <span>{Math.round(((tabs.findIndex(tab => tab.id === activeTab) + 1) / tabs.length) * 100)}% Complete</span>
                </div>
            </div>

            {/* Enhanced Tab Content */}
            <div className="mt-6 transition-all duration-300">
              <div className="transform transition-all duration-300">
                {tabs.find((tab) => tab.id === activeTab)?.content}
              </div>
            </div>

            {/* Enhanced Navigation Buttons */}
            <div className="flex justify-between mt-6 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                disabled={activeTab === tabs[0].id}
                onClick={(e) => {
                  e.preventDefault();
                  const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
                  setActiveTab(tabs[currentIndex - 1].id);
                }}
                className="w-[120px] transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {activeTab === tabs[tabs.length - 1].id ? (
                <Button 
                  type="submit" 
                  disabled={processing}
                  className="w-[120px] transition-all duration-200 hover:scale-105"
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {processing ? "Submitting..." : "Submit"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const currentIndex = tabs.findIndex(
                      (tab) => tab.id === activeTab
                    );
                    setActiveTab(tabs[currentIndex + 1].id);
                  }}
                  className="w-[120px] transition-all duration-200 hover:scale-105"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
} 