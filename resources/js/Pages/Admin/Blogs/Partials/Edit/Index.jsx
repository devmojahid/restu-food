import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { X, Save, ArrowLeft, AlertCircle } from "lucide-react";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

// Reuse the blog collections from Create component
const BLOG_COLLECTIONS = {
  THUMBNAIL: "thumbnail",
  IMAGES: "images",
  VIDEOS: "videos",
  ATTACHMENTS: "attachments",
  FEATURED_IMAGES: "featured_images",
};

// Add these constants at the top of the file
const FILE_COLLECTIONS = {
  THUMBNAIL: {
    name: "thumbnail",
    maxFiles: 1,
    fileType: "image",
    title: "Thumbnail",
    description: "Upload a thumbnail image (recommended size: 1200x630px)",
  },
  FEATURED_IMAGE: {
    name: "featured_image",
    maxFiles: 1,
    fileType: "image",
    title: "Featured Image",
    description: "Upload a featured image (recommended size: 1920x1080px)",
  },
  IMAGES: {
    name: "images",
    maxFiles: 10,
    fileType: "image",
    title: "Gallery Images",
    description: "Upload up to 10 images for the blog gallery",
  },
  VIDEOS: {
    name: "videos",
    maxFiles: 5,
    fileType: "video",
    title: "Videos",
    description: "Upload up to 5 videos",
  },
  ATTACHMENTS: {
    name: "attachments",
    maxFiles: 20,
    fileType: "document",
    title: "Attachments",
    description: "Upload related documents and files",
  },
};

// Reuse the ErrorAlert component
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

export default function EditBlog({ blog }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, setData, put, processing, errors } = useForm({
    title: blog.title || "",
    slug: blog.slug || "",
    content: blog.content || "",
    excerpt: blog.excerpt || "",
    meta_title: blog.meta_title || "",
    meta_description: blog.meta_description || "",
    tags: blog.tags || [],
    categories: blog.categories || [],
    is_published: blog.is_published || false,
    published_at: blog.published_at || new Date().toISOString(),
    thumbnail: blog.thumbnail || null,
    featured_image: blog.featured_image || null,
    images: blog.images || [],
    videos: blog.videos || [],
    attachments: blog.attachments || [],
  });

  useEffect(() => {
    if (data.title && !blog.slug) {
      setData(
        "slug",
        data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  }, [data.title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    put(`/app/blogs/${blog.id}`, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        toast.success("Blog post updated successfully!");
      },
      onError: () => {
        setIsSubmitting(false);
        toast.error("An error occurred while updating the blog post.");
      },
    });
  };

  // Update the file upload section in your form
  const FileUploaders = () => (
    <div className="space-y-6">
      {Object.values(FILE_COLLECTIONS).map((collection) => (
        <Card key={collection.name}>
          <CardHeader>
            <CardTitle>{collection.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploader
              maxFiles={collection.maxFiles}
              fileType={collection.fileType}
              collection={collection.name}
              value={data[collection.name]}
              onUpload={(files) => setData(collection.name, files)}
              description={collection.description}
              error={errors[collection.name]}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ErrorAlert errors={errors} />

      {/* Form Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Edit Blog Post
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
            {processing || isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="flex items-center space-x-1"
                  >
                    <span>Title</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                    disabled={processing || isSubmitting}
                    className={cn(
                      "w-full",
                      errors.title && "border-red-500 focus:ring-red-500"
                    )}
                    placeholder="Enter blog title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={data.slug}
                    onChange={(e) => setData("slug", e.target.value)}
                    className="w-full"
                    placeholder="url-friendly-slug"
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm">{errors.slug}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={data.content}
                    onChange={(e) => setData("content", e.target.value)}
                    className="min-h-[400px]"
                    placeholder="Write your blog content here..."
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm">{errors.content}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={data.meta_title}
                  onChange={(e) => setData("meta_title", e.target.value)}
                  className="w-full"
                  placeholder="SEO optimized title"
                />
                <p className="text-sm text-muted-foreground">
                  {data.meta_title.length}/60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={data.meta_description}
                  onChange={(e) => setData("meta_description", e.target.value)}
                  className="h-24"
                  placeholder="Brief description for search engines"
                />
                <p className="text-sm text-muted-foreground">
                  {data.meta_description.length}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <FileUploaders />
        </div>
      </div>
    </form>
  );
}
