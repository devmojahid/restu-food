import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
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

export default function CreateUser(roledata) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
    status: "active",
    avatar: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    post(route("app.users.store"), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ErrorAlert errors={errors} />

      {/* Form Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create New User
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
            {processing || isSubmitting ? "Saving..." : "Save User"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center space-x-1">
                    <span>Name</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    disabled={processing || isSubmitting}
                    className={cn(errors.name && "border-red-500")}
                    placeholder="Enter user's full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center space-x-1"
                  >
                    <span>Email</span>
                    <span className="text-red-500">*</span>
                  </Label>
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

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center space-x-1"
                    >
                      <span>Password</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={data.password}
                      onChange={(e) => setData("password", e.target.value)}
                      disabled={processing || isSubmitting}
                      className={cn(errors.password && "border-red-500")}
                      placeholder="Enter password"
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password_confirmation"
                      className="flex items-center space-x-1"
                    >
                      <span>Confirm Password</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      value={data.password_confirmation}
                      onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                      }
                      disabled={processing || isSubmitting}
                      className={cn(
                        errors.password_confirmation && "border-red-500"
                      )}
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
                  {["active", "inactive", "banned"].map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500 mt-1">{errors.status}</p>
              )}
            </CardContent>
          </Card>

          {/* Role Card */}
          <Card>
            <CardHeader>
              <CardTitle>Role</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={data.role}
                onValueChange={(value) => setData("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roledata?.data?.roles?.length > 0 ? (
                    roledata.data.roles.map((role) => (
                      <SelectItem key={role.id || role.name} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem key="no-roles" value="" disabled>
                      No roles available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500 mt-1">{errors.role}</p>
              )}
            </CardContent>
          </Card>

          {/* Avatar Card */}
          <Card>
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader
                maxFiles={1}
                fileType="image"
                collection="avatar"
                value={data.avatar}
                onUpload={(file) => setData("avatar", file)}
              />
              {errors.avatar && (
                <p className="text-sm text-red-500 mt-1">{errors.avatar}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
