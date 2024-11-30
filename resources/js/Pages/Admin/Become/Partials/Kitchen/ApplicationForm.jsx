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
  ChefHat,
  User,
  MapPin,
  Briefcase,
  Clock,
  FileText,
  Save,
  AlertCircle,
  GraduationCap,
  Calendar,
  Heart,
  Shield,
  Phone,
  Mail,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Store,
} from "lucide-react";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { DatePicker } from "@/Components/ui/date-picker";
import { Checkbox } from "@/Components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useToast } from "@/Components/ui/use-toast";
import AvailabilitySchedule from "@/Components/Admin/Kitchen/AvailabilitySchedule";
import EnhancedDatePicker from "@/Components/ui/enhanced-date-picker";

const FILE_COLLECTIONS = {
  RESUME: {
    name: "resume",
    maxFiles: 1,
    fileType: "document",
    title: "Resume/CV",
    description: "Upload your resume (PDF format)",
  },
  ID_PROOF: {
    name: "id_proof",
    maxFiles: 1,
    fileType: "document",
    title: "ID Proof",
    description: "Upload your ID proof (PDF, JPG, PNG)",
  },
  CERTIFICATES: {
    name: "certificates",
    maxFiles: 5,
    fileType: "document",
    title: "Certificates",
    description: "Upload your culinary certificates",
  },
  PHOTO: {
    name: "photo",
    maxFiles: 1,
    fileType: "image",
    title: "Profile Photo",
    description: "Upload a recent photo",
  },
};

const INITIAL_FORM_STATE = {
  // Personal Information
  full_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  gender: "",
  
  // Address Information
  address: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  
  // Professional Information
  position_applied: "",
  years_of_experience: "",
  specializations: [],
  previous_experience: "",
  highest_education: "",
  culinary_certificates: [],
  
  // Availability
  availability_hours: {},
  full_time: true,
  part_time: false,
  expected_salary: "",
  available_from: "",
  
  // Documents
  resume: null,
  photo: null,
  id_proof: null,
  certificates: [],
  
  // References
  references: [],
  
  // Health and Safety
  has_food_safety_certification: false,
  food_safety_certification_expiry: "",
  has_health_certification: false,
  health_certification_expiry: "",
  
  // Emergency Contact
  emergency_contact_name: "",
  emergency_contact_phone: "",
  emergency_contact_relationship: "",
  
  // Additional Information
  additional_notes: "",
  terms_accepted: false,
  background_check_consent: false,
};

const KITCHEN_POSITIONS = [
  { value: "head_chef", label: "Head Chef" },
  { value: "sous_chef", label: "Sous Chef" },
  { value: "line_cook", label: "Line Cook" },
  { value: "prep_cook", label: "Prep Cook" },
  { value: "pastry_chef", label: "Pastry Chef" },
  { value: "kitchen_helper", label: "Kitchen Helper" },
];

const SPECIALIZATIONS = [
  { value: "italian", label: "Italian Cuisine" },
  { value: "french", label: "French Cuisine" },
  { value: "asian", label: "Asian Cuisine" },
  { value: "indian", label: "Indian Cuisine" },
  { value: "mediterranean", label: "Mediterranean Cuisine" },
  { value: "pastry", label: "Pastry & Baking" },
  { value: "butchery", label: "Butchery" },
  { value: "seafood", label: "Seafood" },
];

const RestaurantCard = ({ restaurant, selected, onSelect }) => (
  <div
    onClick={() => onSelect(restaurant)}
    className={cn(
      "p-4 rounded-lg border cursor-pointer transition-all",
      "hover:shadow-md hover:scale-[1.02]",
      selected ? "border-primary bg-primary/5" : "border-border",
    )}
  >
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <h4 className="font-medium">{restaurant.name}</h4>
        <p className="text-sm text-muted-foreground">{restaurant.address}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{restaurant.city}, {restaurant.state}</span>
        </div>
      </div>
      <div className={cn(
        "w-4 h-4 rounded-full border-2",
        selected ? "border-primary bg-primary" : "border-muted"
      )} />
    </div>
  </div>
);

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
    <div className="mt-1">{children}</div>
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default function KitchenStaffApplicationForm({ restaurants = [] }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("restaurant");
  const { data, setData, post, reset, processing, errors } = useForm(INITIAL_FORM_STATE);

  const tabs = [
    {
      id: "restaurant",
      label: "Restaurant",
      icon: Store,
      content: ({ restaurants = [] }) => (
        <FormSection
          title="Select Restaurant"
          description="Choose the restaurant you want to work with"
        >
          <div className="col-span-2">
            <FormField 
              label="Restaurant" 
              required 
              error={errors.restaurant_id}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    selected={data.restaurant_id === restaurant.id}
                    onSelect={(selected) => setData("restaurant_id", selected.id)}
                  />
                ))}
              </div>
            </FormField>
          </div>

          {data.restaurant_id && (
            <div className="col-span-2 mt-4">
              <Card className="bg-muted">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Store className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Selected Restaurant</h4>
                      <p className="text-sm text-muted-foreground">
                        {restaurants.find(r => r.id === data.restaurant_id)?.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {restaurants.find(r => r.id === data.restaurant_id)?.address}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </FormSection>
      ),
    },
    {
      id: "personal",
      label: "Personal Info",
      icon: User,
      content: (
        <FormSection
          title="Personal Information"
          description="Basic information about you"
        >
          <FormField label="Full Name" required error={errors.full_name}>
            <Input
              value={data.full_name}
              onChange={(e) => setData("full_name", e.target.value)}
              placeholder="Enter your full name"
            />
          </FormField>

          <FormField label="Email" required error={errors.email}>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              placeholder="your.email@example.com"
            />
          </FormField>

          <FormField label="Phone" required error={errors.phone}>
            <Input
              type="tel"
              value={data.phone}
              onChange={(e) => setData("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </FormField>

          <FormField label="Date of Birth" required error={errors.date_of_birth}>
            <DatePicker
              value={data.date_of_birth}
              onChange={(date) => setData("date_of_birth", date)}
            />
          </FormField>

          <FormField label="Gender" required error={errors.gender}>
            <Select
              value={data.gender}
              onValueChange={(value) => setData("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
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
          description="Your current residential address"
        >
          <FormField label="Street Address" required error={errors.address}>
            <Input
              value={data.address}
              onChange={(e) => setData("address", e.target.value)}
              placeholder="Enter your street address"
            />
          </FormField>

          <FormField label="City" required error={errors.city}>
            <Input
              value={data.city}
              onChange={(e) => setData("city", e.target.value)}
              placeholder="Enter city"
            />
          </FormField>

          <FormField label="State/Province" error={errors.state}>
            <Input
              value={data.state}
              onChange={(e) => setData("state", e.target.value)}
              placeholder="Enter state/province"
            />
          </FormField>

          <FormField label="Postal Code" required error={errors.postal_code}>
            <Input
              value={data.postal_code}
              onChange={(e) => setData("postal_code", e.target.value)}
              placeholder="Enter postal code"
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
                {/* Add more countries */}
              </SelectContent>
            </Select>
          </FormField>
        </FormSection>
      ),
    },
    {
      id: "professional",
      label: "Professional",
      icon: Briefcase,
      content: (
        <FormSection
          title="Professional Information"
          description="Your work experience and qualifications"
        >
          <FormField label="Position Applied" required error={errors.position_applied}>
            <Select
              value={data.position_applied}
              onValueChange={(value) => setData("position_applied", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {KITCHEN_POSITIONS.map((position) => (
                  <SelectItem key={position.value} value={position.value}>
                    {position.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Years of Experience" required error={errors.years_of_experience}>
            <Input
              type="number"
              min="0"
              value={data.years_of_experience}
              onChange={(e) => setData("years_of_experience", e.target.value)}
              placeholder="Enter years of experience"
            />
          </FormField>

          <FormField label="Specializations" error={errors.specializations}>
            <div className="space-y-2">
              {SPECIALIZATIONS.map((spec) => (
                <div key={spec.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={spec.value}
                    checked={data.specializations.includes(spec.value)}
                    onCheckedChange={(checked) => {
                      const newSpecializations = checked
                        ? [...data.specializations, spec.value]
                        : data.specializations.filter((s) => s !== spec.value);
                      setData("specializations", newSpecializations);
                    }}
                  />
                  <Label htmlFor={spec.value}>{spec.label}</Label>
                </div>
              ))}
            </div>
          </FormField>

          <div className="col-span-2">
            <FormField label="Previous Experience" error={errors.previous_experience}>
              <Textarea
                value={data.previous_experience}
                onChange={(e) => setData("previous_experience", e.target.value)}
                placeholder="Describe your previous work experience..."
                className="h-32"
              />
            </FormField>
          </div>
        </FormSection>
      ),
    },
    {
      id: "availability",
      label: "Availability",
      icon: Clock,
      content: (
        <FormSection
          title="Availability Information"
          description="Your work availability and preferences"
        >
          <div className="col-span-2">
            <FormField 
              label="Weekly Schedule" 
              required 
              error={errors.availability_hours}
            >
              <AvailabilitySchedule
                value={data.availability_hours}
                onChange={(schedule) => setData("availability_hours", schedule)}
                error={errors.availability_hours}
              />
            </FormField>
          </div>

          <FormField label="Available From" required error={errors.available_from}>
            <EnhancedDatePicker
              value={data.available_from}
              onChange={(date) => setData("available_from", date)}
              minDate={new Date()}
              placeholder="Select start date"
              error={errors.available_from}
            />
          </FormField>

          <FormField label="Expected Salary" required error={errors.expected_salary}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={data.expected_salary}
                onChange={(e) => setData("expected_salary", e.target.value)}
                placeholder="Enter expected salary"
                className="pl-7"
              />
            </div>
          </FormField>

          <div className="col-span-2 space-y-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="full_time" className="font-medium">Full Time</Label>
                    <p className="text-sm text-muted-foreground">
                      Available for full-time positions (40 hours/week)
                    </p>
                  </div>
                  <Switch
                    id="full_time"
                    checked={data.full_time}
                    onCheckedChange={(checked) => setData("full_time", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="part_time" className="font-medium">Part Time</Label>
                    <p className="text-sm text-muted-foreground">
                      Available for part-time positions (less than 40 hours/week)
                    </p>
                  </div>
                  <Switch
                    id="part_time"
                    checked={data.part_time}
                    onCheckedChange={(checked) => setData("part_time", checked)}
                  />
                </div>
              </div>
            </Card>
          </div>
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
        </FormSection>
      ),
    },
    {
      id: "health",
      label: "Health & Safety",
      icon: Heart,
      content: (
        <FormSection
          title="Health and Safety Information"
          description="Your certifications and health records"
        >
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="food_safety_cert">Food Safety Certification</Label>
              <Switch
                id="food_safety_cert"
                checked={data.has_food_safety_certification}
                onCheckedChange={(checked) => 
                  setData("has_food_safety_certification", checked)
                }
              />
            </div>

            {data.has_food_safety_certification && (
              <FormField 
                label="Certification Expiry Date" 
                required 
                error={errors.food_safety_certification_expiry}
              >
                <DatePicker
                  value={data.food_safety_certification_expiry}
                  onChange={(date) => 
                    setData("food_safety_certification_expiry", date)
                  }
                />
              </FormField>
            )}
          </div>
        </FormSection>
      ),
    },
    {
      id: "emergency",
      label: "Emergency",
      icon: AlertCircle,
      content: (
        <FormSection
          title="Emergency Contact"
          description="Contact person in case of emergency"
        >
          <FormField 
            label="Contact Name" 
            required 
            error={errors.emergency_contact_name}
          >
            <Input
              value={data.emergency_contact_name}
              onChange={(e) => setData("emergency_contact_name", e.target.value)}
              placeholder="Emergency contact name"
            />
          </FormField>

          <FormField 
            label="Contact Phone" 
            required 
            error={errors.emergency_contact_phone}
          >
            <Input
              type="tel"
              value={data.emergency_contact_phone}
              onChange={(e) => setData("emergency_contact_phone", e.target.value)}
              placeholder="Emergency contact phone"
            />
          </FormField>

          <FormField 
            label="Relationship" 
            required 
            error={errors.emergency_contact_relationship}
          >
            <Input
              value={data.emergency_contact_relationship}
              onChange={(e) => 
                setData("emergency_contact_relationship", e.target.value)
              }
              placeholder="Relationship to emergency contact"
            />
          </FormField>
        </FormSection>
      ),
    },
  ];

  const canProceed = () => {
    if (activeTab === "restaurant" && !data.restaurant_id) {
      toast({
        title: "Required",
        description: "Please select a restaurant to continue",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleTabChange = (nextTab) => {
    if (canProceed()) {
      setActiveTab(nextTab);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.restaurant_id) {
      toast({
        title: "Required",
        description: "Please select a restaurant before submitting",
        variant: "destructive",
      });
      setActiveTab("restaurant");
      return;
    }
    
    post(route("app.kitchen-staff.applications.store"), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        toast({
          title: "Success",
          description: "Your application has been submitted successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Please check the form for errors",
          variant: "destructive",
        });
      },
    });
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

  const isTabCompleted = (tabId) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    return tabIndex < currentIndex;
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

            {/* Tab Content */}
            <div className="mt-6">
              <ErrorAlert errors={errors} />
              <div className="transform transition-all duration-300">
                {(() => {
                  const currentTab = tabs.find((tab) => tab.id === activeTab);
                  return currentTab?.content instanceof Function 
                    ? currentTab.content({ restaurants })
                    : currentTab?.content;
                })()}
              </div>
            </div>

            {/* Terms and Conditions */}
            {activeTab === tabs[tabs.length - 1].id && (
              <div className="space-y-4 pt-6 border-t">
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="background_check"
                    checked={data.background_check_consent}
                    onCheckedChange={(checked) => setData("background_check_consent", checked)}
                  />
                  <Label htmlFor="background_check" className="text-sm">
                    I consent to a background check
                  </Label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                disabled={activeTab === tabs[0].id}
                onClick={() => {
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
                  disabled={processing || !data.terms_accepted || !data.background_check_consent}
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
                  onClick={() => {
                    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
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