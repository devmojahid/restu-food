import React, { useState, useRef, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import {
  Truck,
  MapPin,
  User,
  Clock,
  FileText,
  Save,
  AlertCircle,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  Car,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Shield,
  Briefcase,
  Languages,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useToast } from "@/Components/ui/use-toast";
import { format } from "date-fns";

// Import custom components
import { FormSection, FormField } from "@/Components/Admin/Form/FormSection";
import TabButton from "@/Components/Admin/Form/TabButton";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import LocationPicker from "@/Components/Admin/Delivery/LocationPicker";
import AvailabilitySchedule from "@/Components/Admin/Delivery/AvailabilitySchedule";
import VehicleFields from "@/Components/Admin/Delivery/VehicleFields";
import TagInput from "@/Components/Admin/Form/TagInput";
import { EnhancedDatePicker } from "@/Components/ui/enhanced-date-picker";

const FILE_COLLECTIONS = {
  PROFILE_PHOTO: {
    name: "profile_photo",
    maxFiles: 1,
    fileType: "image",
    title: "Profile Photo",
    description: "Upload your profile photo (JPG, PNG)",
  },
  ID_PROOF: {
    name: "id_proof",
    maxFiles: 1,
    fileType: "document",
    title: "ID Proof",
    description: "Upload your ID proof (PDF, JPG, PNG)",
  },
  DRIVING_LICENSE: {
    name: "driving_license",
    maxFiles: 1,
    fileType: "document",
    title: "Driving License",
    description: "Upload your driving license (PDF, JPG, PNG)",
  },
  VEHICLE_INSURANCE: {
    name: "vehicle_insurance",
    maxFiles: 1,
    fileType: "document",
    title: "Vehicle Insurance",
    description: "Upload vehicle insurance document (PDF, JPG, PNG)",
  },
  VEHICLE_PHOTOS: {
    name: "vehicle_photos",
    maxFiles: 5,
    fileType: "image",
    title: "Vehicle Photos",
    description: "Upload up to 5 photos of your vehicle",
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
  latitude: "",
  longitude: "",
  
  // Vehicle Information
  vehicle_type: "",
  vehicle_model: "",
  vehicle_year: "",
  vehicle_color: "",
  license_plate: "",
  
  // Documents
  driving_license_number: "",
  driving_license_expiry: "",
  has_vehicle_insurance: false,
  vehicle_insurance_expiry: "",
  
  // Work Preferences
  availability_hours: {},
  full_time: false,
  part_time: false,
  expected_salary: "",
  available_from: "",
  preferred_areas: [],
  
  // Emergency Contact
  emergency_contact_name: "",
  emergency_contact_phone: "",
  emergency_contact_relationship: "",
  
  // Background Check
  has_criminal_record: false,
  criminal_record_details: "",
  background_check_consent: false,
  
  // Experience
  years_of_experience: 0,
  previous_experience: "",
  delivery_experience: [],
  language_skills: [],
  
  // Terms and Files
  terms_accepted: false,
  data_processing_consent: false,
  additional_notes: "",
  
  // Files
  profile_photo: null,
  id_proof: null,
  driving_license: null,
  vehicle_insurance: null,
  vehicle_photos: [],
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

const tabs = [
  {
    id: "personal",
    label: "Personal Info",
    icon: User,
  },
  {
    id: "address",
    label: "Address",
    icon: MapPin,
  },
  {
    id: "vehicle",
    label: "Vehicle",
    icon: Car,
  },
  {
    id: "availability",
    label: "Availability",
    icon: Clock,
  },
  {
    id: "experience",
    label: "Experience",
    icon: Briefcase,
  },
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
  },
  {
    id: "verification",
    label: "Verification",
    icon: Shield,
  },
];

export default function DeliveryApplicationForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const { data, setData, post, processing, errors } = useForm(INITIAL_FORM_STATE);
  const formRef = useRef(null);
  
  // Add persistent form data state
  const [persistentData, setPersistentData] = useState(INITIAL_FORM_STATE);

  // Update form data when tab changes
  const handleTabChange = (newTab) => {
    // Save current tab data
    setPersistentData(current => ({
      ...current,
      ...data
    }));
    
    // Change tab
    setActiveTab(newTab);
  };

  // Restore form data when component mounts
  useEffect(() => {
    setData(persistentData);
  }, []);

  // Update form data when persistent data changes
  useEffect(() => {
    setData(current => ({
      ...current,
      ...persistentData
    }));
  }, [persistentData]);

  // Handle navigation with data persistence
  const handleNavigation = (direction) => {
    // Save current state
    setPersistentData(current => ({
      ...current,
      ...data
    }));

    // Navigate
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (direction === 'next' && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    } else if (direction === 'prev' && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  // Update the handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Use the persistent data for submission
    const submissionData = {
      ...persistentData,
      ...data
    };

    if (activeTab === tabs[tabs.length - 1].id) {
      post(route("app.delivery-staff.applications.store"), {
        ...submissionData
      }, {
        preserveScroll: true,
        onSuccess: () => {
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
    }
  };

  // Update TabButton click handler
  const handleTabClick = (tabId) => {
    // Save current data before switching
    setPersistentData(current => ({
      ...current,
      ...data
    }));
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <FormSection
            title="Personal Information"
            description="Basic information about you"
          >
            <FormField label="Full Name" required error={errors?.full_name}>
              <Input
                value={data?.full_name}
                onChange={(e) => setData("full_name", e.target.value)}
                placeholder="Enter your full name"
              />
            </FormField>

            <FormField label="Email" required error={errors?.email}>
              <Input
                type="email"
                value={data?.email}
                onChange={(e) => setData("email", e.target.value)}
                placeholder="your.email@example.com"
              />
            </FormField>

            <FormField label="Phone" required error={errors?.phone}>
              <Input
                type="tel"
                value={data?.phone}
                onChange={(e) => setData("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </FormField>

            <FormField label="Date of Birth" required error={errors?.date_of_birth}>
              <EnhancedDatePicker
                value={data?.date_of_birth}
                onChange={(date) => setData("date_of_birth", format(date, "yyyy-MM-dd"))}
                maxDate={new Date()}
                placeholder="Select birth date"
                error={errors?.date_of_birth}
              />
            </FormField>

            <FormField label="Gender" error={errors?.gender}>
              <Select
                value={data?.gender}
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

            <FormField 
              label="Emergency Contact Name" 
              required 
              error={errors?.emergency_contact_name}
            >
              <Input
                value={data?.emergency_contact_name}
                onChange={(e) => setData("emergency_contact_name", e.target.value)}
                placeholder="Enter emergency contact name"
              />
            </FormField>

            <FormField 
              label="Emergency Contact Phone" 
              required 
              error={errors?.emergency_contact_phone}
            >
              <Input
                type="tel"
                value={data?.emergency_contact_phone}
                onChange={(e) => setData("emergency_contact_phone", e.target.value)}
                placeholder="Enter emergency contact phone"
              />
            </FormField>

            <FormField 
              label="Relationship with Emergency Contact" 
              required 
              error={errors?.emergency_contact_relationship}
            >
              <Select
                value={data?.emergency_contact_relationship}
                onValueChange={(value) => setData("emergency_contact_relationship", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="relative">Other Relative</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </FormSection>
        );

      case "address":
        return (
          <FormSection
            title="Address Information"
            description="Your current address and location details"
          >
            <div className="col-span-2">
              <LocationPicker
                address={data?.address}
                onAddressChange={(address) => setData("address", address)}
                onCoordinatesChange={(coords) => {
                  setData("latitude", coords.lat);
                  setData("longitude", coords.lng);
                }}
                error={errors?.address}
              />
            </div>

            <FormField label="City" required error={errors?.city}>
              <Input
                value={data?.city}
                onChange={(e) => setData("city", e.target.value)}
                placeholder="Enter city"
              />
            </FormField>

            <FormField label="State/Province" required error={errors?.state}>
              <Input
                value={data?.state}
                onChange={(e) => setData("state", e.target.value)}
                placeholder="Enter state"
              />
            </FormField>

            <FormField label="Postal Code" required error={errors?.postal_code}>
              <Input
                value={data?.postal_code}
                onChange={(e) => setData("postal_code", e.target.value)}
                placeholder="Enter postal code"
              />
            </FormField>

            <FormField label="Country" required error={errors?.country}>
              <Select
                value={data?.country}
                onValueChange={(value) => setData("country", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </FormSection>
        );

      case "vehicle":
        return (
          <FormSection
            title="Vehicle Information"
            description="Details about your delivery vehicle"
          >
            <VehicleFields
              data={data}
              setData={setData}
              errors={errors}
              vehicleType={data?.vehicle_type}
            />

            {data?.vehicle_type !== "bicycle" && (
              <>
                <FormField
                  label="Driving License Number"
                  required
                  error={errors?.driving_license_number}
                >
                  <Input
                    value={data?.driving_license_number}
                    onChange={(e) => setData("driving_license_number", e.target.value)}
                    placeholder="Enter license number"
                  />
                </FormField>

                <FormField
                  label="License Expiry Date"
                  required
                  error={errors?.driving_license_expiry}
                >
                  <EnhancedDatePicker
                    value={data?.driving_license_expiry}
                    onChange={(date) => setData("driving_license_expiry", format(date, "yyyy-MM-dd"))}
                    minDate={new Date()}
                    placeholder="Select expiry date"
                    error={errors?.driving_license_expiry}
                  />
                </FormField>

                <div className="col-span-2">
                  <FormField label="Vehicle Insurance" error={errors?.has_vehicle_insurance}>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={data?.has_vehicle_insurance}
                        onCheckedChange={(checked) =>
                          setData("has_vehicle_insurance", checked)
                        }
                      />
                      <span>I have vehicle insurance</span>
                    </div>
                  </FormField>
                </div>

                {data?.has_vehicle_insurance && (
                  <FormField
                    label="Insurance Expiry Date"
                    required
                    error={errors?.vehicle_insurance_expiry}
                  >
                    <EnhancedDatePicker
                      value={data?.vehicle_insurance_expiry}
                      onChange={(date) => setData("vehicle_insurance_expiry", format(date, "yyyy-MM-dd"))}
                      minDate={new Date()}
                      placeholder="Select expiry date"
                      error={errors?.vehicle_insurance_expiry}
                    />
                  </FormField>
                )}
              </>
            )}
          </FormSection>
        );

      case "availability":
        return (
          <FormSection
            title="Availability & Preferences"
            description="Your working hours and delivery preferences"
          >
            <div className="col-span-2">
              <FormField label="Weekly Schedule" required error={errors?.availability_hours}>
                <AvailabilitySchedule
                  value={data?.availability_hours}
                  onChange={(schedule) => setData("availability_hours", schedule)}
                />
              </FormField>
            </div>

            <div className="col-span-2 space-y-4">
              <FormField label="Employment Type" error={errors?.employment_type}>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={data?.full_time}
                      onCheckedChange={(checked) => setData("full_time", checked)}
                    />
                    <span>Full Time</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={data?.part_time}
                      onCheckedChange={(checked) => setData("part_time", checked)}
                    />
                    <span>Part Time</span>
                  </div>
                </div>
              </FormField>
            </div>

            <FormField label="Expected Salary" error={errors?.expected_salary}>
              <Input
                type="number"
                value={data?.expected_salary}
                onChange={(e) => setData("expected_salary", e.target.value)}
                placeholder="Enter expected salary"
                min="0"
                step="0.01"
              />
            </FormField>

            <FormField label="Available From" required error={errors?.available_from}>
              <EnhancedDatePicker
                value={data?.available_from}
                onChange={(date) => setData("available_from", format(date, "yyyy-MM-dd"))}
                minDate={new Date()}
                placeholder="Select start date"
                error={errors?.available_from}
              />
            </FormField>

            <div className="col-span-2">
              <FormField label="Preferred Areas" required error={errors?.preferred_areas}>
                <TagInput
                  value={data?.preferred_areas}
                  onChange={(areas) => setData("preferred_areas", areas)}
                  placeholder="Type area name and press Enter"
                  maxTags={5}
                />
              </FormField>
            </div>
          </FormSection>
        );

      case "experience":
        return (
          <FormSection
            title="Experience & Skills"
            description="Your delivery experience and qualifications"
          >
            <FormField
              label="Years of Experience"
              required
              error={errors?.years_of_experience}
            >
              <Input
                type="number"
                value={data?.years_of_experience}
                onChange={(e) => setData("years_of_experience", e.target.value)}
                placeholder="Enter years of experience"
                min="0"
              />
            </FormField>

            <div className="col-span-2">
              <FormField
                label="Previous Experience"
                error={errors?.previous_experience}
              >
                <Textarea
                  value={data?.previous_experience}
                  onChange={(e) => setData("previous_experience", e.target.value)}
                  placeholder="Describe your previous delivery experience"
                  className="h-32"
                />
              </FormField>
            </div>

            <div className="col-span-2">
              <FormField
                label="Delivery Experience Types"
                required
                error={errors?.delivery_experience}
              >
                <TagInput
                  value={data?.delivery_experience}
                  onChange={(exp) => setData("delivery_experience", exp)}
                  placeholder="Add delivery types (e.g., Food, Groceries)"
                />
              </FormField>
            </div>

            <div className="col-span-2">
              <FormField
                label="Language Skills"
                required
                error={errors?.language_skills}
              >
                <TagInput
                  value={data?.language_skills}
                  onChange={(langs) => setData("language_skills", langs)}
                  placeholder="Add languages you speak"
                />
              </FormField>
            </div>
          </FormSection>
        );

      case "documents":
        return (
          <FormSection
            title="Required Documents"
            description="Upload necessary documentation"
          >
            {Object.values(FILE_COLLECTIONS).map((collection) => (
              <div key={collection.name} className="col-span-2">
                <FormField
                  label={collection.title}
                  required
                  error={errors?.[collection.name]}
                >
                  <FileUploader
                    maxFiles={collection.maxFiles}
                    fileType={collection.fileType}
                    collection={collection.name}
                    value={data?.[collection.name]}
                    onUpload={(files) => setData(collection.name, files)}
                    description={collection.description}
                  />
                </FormField>
              </div>
            ))}
          </FormSection>
        );

      case "verification":
        return (
          <FormSection
            title="Verification & Consent"
            description="Final verification steps"
          >
            <div className="col-span-2 space-y-6">
              <FormField
                label="Background Check Consent"
                error={errors?.background_check_consent}
              >
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={data?.background_check_consent}
                    onCheckedChange={(checked) =>
                      setData("background_check_consent", checked)
                    }
                  />
                  <span>I consent to a background check</span>
                </div>
              </FormField>

              <FormField
                label="Criminal Record"
                error={errors?.has_criminal_record}
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={data?.has_criminal_record}
                      onCheckedChange={(checked) =>
                        setData("has_criminal_record", checked)
                      }
                    />
                    <span>I have a criminal record</span>
                  </div>

                  {data?.has_criminal_record && (
                    <Textarea
                      value={data?.criminal_record_details}
                      onChange={(e) =>
                        setData("criminal_record_details", e.target.value)
                      }
                      placeholder="Please provide details"
                      className="mt-2"
                    />
                  )}
                </div>
              </FormField>

              <FormField
                label="Terms & Conditions"
                required
                error={errors?.terms_accepted}
              >
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={data?.terms_accepted}
                    onCheckedChange={(checked) =>
                      setData("terms_accepted", checked)
                    }
                  />
                  <span>I accept the terms and conditions</span>
                </div>
              </FormField>

              <FormField
                label="Data Processing"
                required
                error={errors?.data_processing_consent}
              >
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={data?.data_processing_consent}
                    onCheckedChange={(checked) =>
                      setData("data_processing_consent", checked)
                    }
                  />
                  <span>I consent to data processing</span>
                </div>
              </FormField>

              <FormField label="Additional Notes" error={errors?.additional_notes}>
                <Textarea
                  value={data?.additional_notes}
                  onChange={(e) => setData("additional_notes", e.target.value)}
                  placeholder="Any additional information you'd like to share"
                  className="h-32"
                />
              </FormField>
            </div>
          </FormSection>
        );

      default:
        return null;
    }
  };

  const isTabCompleted = (tabId) => {
    const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    return tabIndex < currentIndex;
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      className="space-y-6"
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }}
    >
      <ErrorAlert errors={errors} />

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Enhanced Tab Navigation */}
            <div className="hidden sm:flex gap-2 overflow-x-auto pb-2">
              <div className="flex space-x-2 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {tabs.map((tab) => (
                  <TabButton
                    key={tab.id}
                    active={activeTab === tab.id}
                    icon={tab.icon}
                    label={tab.label}
                    onClick={() => handleTabClick(tab.id)}
                    isCompleted={isTabCompleted(tab.id)}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Tab Selection */}
            <div className="block sm:hidden mb-4">
              <Select 
                value={activeTab} 
                onValueChange={handleTabClick}
              >
                <SelectTrigger>
                  <SelectValue>
                    {tabs.find((tab) => tab.id === activeTab)?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {tabs.map((tab) => (
                    <SelectItem key={tab.id} value={tab.id}>
                      <div className="flex items-center gap-2">
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
                  style={{
                    width: `${
                      ((tabs.findIndex((tab) => tab.id === activeTab) + 1) /
                        tabs.length) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>
                  Step {tabs.findIndex((tab) => tab.id === activeTab) + 1} of{" "}
                  {tabs.length}
                </span>
                <span>
                  {Math.round(
                    ((tabs.findIndex((tab) => tab.id === activeTab) + 1) /
                      tabs.length) *
                      100
                  )}
                  % Complete
                </span>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6">{renderTabContent()}</div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleNavigation('prev')}
                disabled={activeTab === tabs[0].id}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {activeTab === tabs[tabs.length - 1].id ? (
                <Button 
                  type="submit"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('next');
                  }}
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