import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import { Save, ArrowLeft } from "lucide-react";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import OperatingHours from "./OperatingHours";
import DeliverySettings from "./DeliverySettings";
import LocationPicker from "./LocationPicker";

// Error Alert Component
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

export default function RestaurantForm({ restaurant = null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoUpdateSlug, setAutoUpdateSlug] = useState(true);
  const isEditing = !!restaurant;

  const { data, setData, post, put, processing, errors } = useForm({
    name: restaurant?.name ?? "",
    slug: restaurant?.slug ?? "",
    description: restaurant?.description ?? "",
    address: restaurant?.address ?? "",
    latitude: restaurant?.latitude ?? "",
    longitude: restaurant?.longitude ?? "",
    phone: restaurant?.phone ?? "",
    email: restaurant?.email ?? "",
    status: restaurant?.status ?? "pending",
    is_featured: restaurant?.is_featured ?? false,
    opening_hours: restaurant?.opening_hours ?? {},
    opening_time: restaurant?.opening_time ?? "09:00",
    closing_time: restaurant?.closing_time ?? "22:00",
    delivery_radius: restaurant?.delivery_radius ?? 5,
    minimum_order: restaurant?.minimum_order ?? 0,
    delivery_fee: restaurant?.delivery_fee ?? 0,
    commission_rate: restaurant?.commission_rate ?? 10,
    logo: restaurant?.logo ?? null,
    banner: restaurant?.banner ?? null,
    gallery: restaurant?.gallery ?? [],
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (data.name && autoUpdateSlug) {
      const slug = data.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setData('slug', slug);
    }
  }, [data.name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const options = {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
      },
      onError: () => {
        setIsSubmitting(false);
      },
    };

    if (isEditing) {
      put(route("app.restaurants.update", restaurant.id), data, options);
    } else {
      post(route("app.restaurants.store"), data, options);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ErrorAlert errors={errors} />

      {/* Form Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isEditing ? `Edit Restaurant: ${restaurant.name}` : "Create New Restaurant"}
          </h1>
        </div>
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={processing || isSubmitting}
            className="flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {processing || isSubmitting ? "Saving..." : "Save Restaurant"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-1">
                  <span>Restaurant Name</span>
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  disabled={processing || isSubmitting}
                  className={cn(errors.name && "border-red-500")}
                  placeholder="Enter restaurant name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug" error={errors.slug}>Slug</Label>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="autoUpdateSlug">Auto Update</Label>
                    <Switch
                      id="autoUpdateSlug"
                      checked={autoUpdateSlug}
                      onCheckedChange={setAutoUpdateSlug}
                    />
                  </div>
                </div>
                <Input
                  id="slug"
                  value={data.slug}
                  onChange={(e) => setData("slug", e.target.value)}
                  placeholder="restaurant-slug"
                  error={errors.slug}
                  disabled={autoUpdateSlug}
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  disabled={processing || isSubmitting}
                  className={cn(
                    "min-h-[100px]",
                    errors.description && "border-red-500"
                  )}
                  placeholder="Enter restaurant description"
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    disabled={processing || isSubmitting}
                    className={cn(errors.phone && "border-red-500")}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    disabled={processing || isSubmitting}
                    className={cn(errors.email && "border-red-500")}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LocationPicker
                address={data.address}
                latitude={data.latitude}
                longitude={data.longitude}
                onAddressChange={(address) => setData("address", address)}
                onLocationChange={(lat, lng) => {
                  setData("latitude", lat);
                  setData("longitude", lng);
                }}
                errors={errors}
              />
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <OperatingHours
            value={data.opening_hours}
            onChange={(hours) => setData("opening_hours", hours)}
            openingTime={data.opening_time}
            closingTime={data.closing_time}
            onTimeChange={(field, value) => setData(field, value)}
            errors={errors}
          />

          {/* Delivery Settings */}
          <DeliverySettings
            value={{
              delivery_radius: data.delivery_radius,
              minimum_order: data.minimum_order,
              delivery_fee: data.delivery_fee,
              commission_rate: data.commission_rate,
            }}
            onChange={(field, value) => setData(field, value)}
            errors={errors}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={data.status}
                onValueChange={(value) => setData("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {["active", "inactive", "pending", "suspended"].map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status}</p>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={data.is_featured}
                  onCheckedChange={(checked) => setData("is_featured", checked)}
                />
                <Label htmlFor="is_featured">Featured Restaurant</Label>
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader
                maxFiles={1}
                fileType="image"
                collection="logo"
                value={data.logo}
                onUpload={(file) => setData("logo", file)}
              />
              {errors.logo && (
                <p className="text-sm text-red-500 mt-1">{errors.logo}</p>
              )}
            </CardContent>
          </Card>

          {/* Banner Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Banner</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader
                maxFiles={1}
                fileType="image"
                collection="banner"
                value={data.banner}
                onUpload={(file) => setData("banner", file)}
              />
              {errors.banner && (
                <p className="text-sm text-red-500 mt-1">{errors.banner}</p>
              )}
            </CardContent>
          </Card>

          {/* Gallery Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader
                maxFiles={5}
                fileType="image"
                collection="gallery"
                value={data.gallery}
                onUpload={(files) => setData("gallery", files)}
              />
              {errors.gallery && (
                <p className="text-sm text-red-500 mt-1">{errors.gallery}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
} 