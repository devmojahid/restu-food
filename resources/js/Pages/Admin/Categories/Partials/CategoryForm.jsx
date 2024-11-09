import React, { useEffect, useRef, useCallback } from "react";
import { useForm } from "@inertiajs/react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import { Separator } from "@/Components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Save, X, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/Components/ui/use-toast";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { cn } from "@/lib/utils";

const CategoryForm = ({
  category,
  categories,
  isEditing,
  onCancel,
  onSuccess,
  can,
}) => {
  const { toast } = useToast();
  const iconUploaderRef = useRef(null);
  const thumbnailUploaderRef = useRef(null);

  // Initial form state
  const initialFormState = {
    name: "",
    slug: "",
    description: "",
    parent_id: null,
    type: "blog",
    sort_order: 0,
    is_active: true,
    files: {
      icon: null,
      thumbnail: null,
    },
  };

  const {
    data,
    setData,
    post,
    put,
    processing,
    errors,
    reset,
    clearErrors,
  } = useForm(initialFormState);

  // Complete reset function
  const resetForm = useCallback(() => {
    // Clear all form data
    clearErrors();
    reset();
    setData(initialFormState);
    
    // Reset file uploaders
    iconUploaderRef.current?.reset();
    thumbnailUploaderRef.current?.reset();
    
    // Clear any other state if needed
  }, [clearErrors, reset, setData]);

  // Handle successful form submission
  const handleSuccess = useCallback(() => {
    if (!isEditing) {
      resetForm();
    }
    onSuccess?.();
  }, [isEditing, resetForm, onSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrors();

    const submitData = {
      ...data,
      files: {
        icon: data.files.icon,
        thumbnail: data.files.thumbnail,
      },
    };

    if (isEditing) {
      put(route("app.categories.update", category.id), submitData, {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Category updated successfully",
          });
          handleSuccess();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update category",
            variant: "destructive",
          });
        },
      });
    } else {
      post(route("app.categories.store"), submitData, {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Category created successfully",
          });
          // Reset form to initial state
          setData(initialFormState);
          // Reset file uploaders
          iconUploaderRef.current?.reset();
          thumbnailUploaderRef.current?.reset();
          // Clear any errors
          clearErrors();
          // Call success callback
          onSuccess?.();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create category",
            variant: "destructive",
          });
        },
      });
    }
  };

  // Handle cancel
  const handleCancel = useCallback(() => {
    resetForm();
    onCancel?.();
  }, [resetForm, onCancel]);

  // Reset form when category changes
  useEffect(() => {
    if (category && isEditing) {
      const iconFile = category.files?.find(f => f.collection === 'icon');
      const thumbnailFile = category.files?.find(f => f.collection === 'thumbnail');

      setData({
        ...category,
        description: category.description || "",
        files: {
          icon: category.icon_url ? {
            id: iconFile?.id,
            url: category.icon_url,
            collection: 'icon',
            mime_type: 'image/jpeg',
          } : null,
          thumbnail: category.thumbnail_url ? {
            id: thumbnailFile?.id,
            url: category.thumbnail_url,
            collection: 'thumbnail',
            mime_type: 'image/jpeg',
          } : null,
        },
      });
    } else {
      resetForm();
    }
  }, [category, isEditing]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditing && data.name) {
      const slug = data.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .repl{!!  !!}(/^-|-$/g, "");
      setData("slug", slug);
    }
  }, [data.name, isEditing]);

  // Show validation errors summary
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {isEditing ? "Edit Category" : "Create New Category"}
        </h2>
        <div className="flex items-center gap-2">
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={processing}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={processing}>
            {processing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Validation Errors */}
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please correct the following errors:
            <ul className="mt-2 list-disc list-inside">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <div className="space-y-6">
          <FormItem>
            <FormLabel error={errors.name}>
              Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Category name"
              />
            </FormControl>
            <FormMessage error={errors.name} />
          </FormItem>

          <FormItem>
            <FormLabel error={errors.slug}>Slug</FormLabel>
            <FormControl>
              <Input
                value={data.slug}
                onChange={(e) => setData("slug", e.target.value)}
                placeholder="category-slug"
              />
            </FormControl>
            <FormDescription>
              Leave empty to auto-generate from name
            </FormDescription>
            <FormMessage error={errors.slug} />
          </FormItem>

          <FormItem>
            <FormLabel error={errors.parent_id}>Parent Category</FormLabel>
            <Select
              value={data.parent_id?.toString() || "null"}
              onValueChange={(value) =>
                setData("parent_id", value === "null" ? null : parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">None (Root Category)</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id.toString()}
                    disabled={cat.id === category?.id}
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage error={errors.parent_id} />
          </FormItem>

          <FormItem>
            <FormLabel error={errors.description}>Description</FormLabel>
            <FormControl>
              <Textarea
                value={data.description || ""}
                onChange={(e) => setData("description", e.target.value)}
                placeholder="Category description"
                className="h-32"
              />
            </FormControl>
            <FormMessage error={errors.description} />
          </FormItem>

          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Active Status</FormLabel>
              <FormDescription>
                Disable to hide this category from the site
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={data.is_active}
                onCheckedChange={(checked) => setData("is_active", checked)}
              />
            </FormControl>
          </FormItem>
        </div>

        {/* Media Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Category Icon</h3>
            <FileUploader
              ref={iconUploaderRef}
              maxFiles={1}
              fileType="image"
              value={data.files.icon}
              onUpload={(file) => setData('files', {
                ...data.files,
                icon: file
              })}
              description="Upload a small icon (SVG or PNG recommended)"
              error={errors['files.icon']}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Category Thumbnail</h3>
            <FileUploader
              ref={thumbnailUploaderRef}
              maxFiles={1}
              fileType="image"
              value={data.files.thumbnail}
              onUpload={(file) => setData('files', {
                ...data.files,
                thumbnail: file
              })}
              description="Upload a thumbnail image"
              error={errors['files.thumbnail']}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;
