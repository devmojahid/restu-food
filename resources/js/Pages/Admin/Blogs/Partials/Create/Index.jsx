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
import { cn } from "@/lib/utils";
import {
  X,
  Save,
  ArrowLeft,
  AlertCircle,
  Calendar,
} from "lucide-react";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { format } from "date-fns";
import toast from "react-hot-toast";

// File collection constants
const FILE_COLLECTIONS = {
  THUMBNAIL: {
    name: "thumbnail",
    maxFiles: 1,
    fileType: "image",
    title: "Thumbnail",
    description: "Upload a thumbnail image (recommended size: 1200x630px)",
  }
};

const INITIAL_FORM_STATE = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  meta_title: "",
  meta_description: "",
  is_published: false,
  is_featured: false,
  published_at: new Date().toISOString(),
  category_id: "",
  tags: [],
  thumbnail: null,
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

export default function CreateBlog({ categories = [] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, setData, post, processing, errors } = useForm(INITIAL_FORM_STATE);

  // Auto-generate slug from title
  useEffect(() => {
    if (data.title) {
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      
      setData("slug", slug);
    }
  }, [data.title]);

  // Auto-generate meta title and description if empty
  useEffect(() => {
    if (data.title && !data.meta_title) {
      setData("meta_title", data.title);
    }
    if (data.excerpt && !data.meta_description) {
      setData("meta_description", data.excerpt);
    }
  }, [data.title, data.excerpt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    post(route("app.blogs.store"), {
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

  const handleTagInput = (e) => {
    if (e.key === "Enter" && e.target.value) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag && !data.tags.includes(newTag)) {
        setData("tags", [...data.tags, newTag]);
        e.target.value = "";
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setData("tags", data.tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ErrorAlert errors={errors} />

      {/* Form Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create New Blog Post
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
            {processing || isSubmitting ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center space-x-1">
                  <span>Title</span>
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => setData("title", e.target.value)}
                  className={cn(errors.title && "border-red-500")}
                  placeholder="Enter blog title"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={data.slug}
                  onChange={(e) => setData("slug", e.target.value)}
                  placeholder="url-friendly-slug"
                />
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug}</p>
                )}
              </div>

              {/* Content */}
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
                  <p className="text-sm text-red-500">{errors.content}</p>
                )}
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={data.excerpt}
                  onChange={(e) => setData("excerpt", e.target.value)}
                  className="h-24"
                  placeholder="Brief summary of the blog post"
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
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

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_published">Publish</Label>
                <Switch
                  id="is_published"
                  checked={data.is_published}
                  onCheckedChange={(checked) => setData("is_published", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">Featured</Label>
                <Switch
                  id="is_featured"
                  checked={data.is_featured}
                  onCheckedChange={(checked) => setData("is_featured", checked)}
                />
              </div>

              {!data.is_published && (
                <div className="space-y-2">
                  <Label htmlFor="published_at">Schedule Publication</Label>
                  <Input
                    type="datetime-local"
                    id="published_at"
                    value={format(
                      new Date(data.published_at),
                      "yyyy-MM-dd'T'HH:mm"
                    )}
                    onChange={(e) => setData("published_at", e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={data.category_id}
                onValueChange={(value) => setData("category_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Add tags and press Enter"
                onKeyDown={handleTagInput}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {data.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 p-0 h-auto"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* File Uploaders */}
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
      </div>
    </form>
  );
}
