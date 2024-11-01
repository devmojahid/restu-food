import React, { useState, useEffect, useCallback } from "react";
import { Head, useForm } from "@inertiajs/react";
import { useDropzone } from "react-dropzone";
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
import { Toast } from "@/Components/ui/toast";
import { cn } from "@/lib/utils";
import {
  X,
  Plus,
  Upload,
  Image as ImageIcon,
  ChevronRight,
  Home,
  FileText,
  Save,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
// import { format } from "date-fns";
const MediaUploader = ({
  onUpload,
  maxFiles = 1,
  acceptedFileTypes = { "image/*": [".jpeg", ".png", ".jpg", ".gif", ".webp"] },
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.slice(0, maxFiles - prevFiles.length),
      ]);
      setUploading(true);
      setTimeout(() => {
        setUploading(false);
        onUpload(acceptedFiles);
      }, 1500);
    },
    [onUpload, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles,
  });

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            {isDragActive
              ? "Drop the files here"
              : "Drag 'n' drop files here, or click to select files"}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: Images (Max {maxFiles} files, 2MB each)
          </p>
        </div>
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded file ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <div className="w-3/4 bg-white rounded-full h-2">
                      <div
                        className="bg-primary h-full rounded-full animate-progress"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function CreateBlog() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { data, setData, post, processing, errors } = useForm({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image: null,
    meta_title: "",
    meta_description: "",
    tags: [],
    categories: [],
    is_published: false,
    // published_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    published_at: new Date().toISOString(),
  });

  useEffect(() => {
    if (data.title) {
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

    post("/admin/blogs", {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        setToastMessage("Blog post created successfully!");
        setShowToast(true);
      },
      onError: () => {
        setIsSubmitting(false);
        setToastMessage("An error occurred while creating the blog post.");
        setShowToast(true);
      },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => setData("title", e.target.value)}
                  className="w-full"
                  placeholder="Enter blog title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
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

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={data.excerpt}
                  onChange={(e) => setData("excerpt", e.target.value)}
                  className="h-24"
                  placeholder="Brief summary of the blog post"
                />
                {errors.excerpt && (
                  <p className="text-red-500 text-sm">{errors.excerpt}</p>
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
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={data.is_published}
                onCheckedChange={(checked) => setData("is_published", checked)}
              />
              <Label htmlFor="is_published">Publish immediately</Label>
            </div>

            {!data.is_published && (
              <div className="space-y-2">
                <Label htmlFor="published_at">Schedule Publication</Label>
                <Input
                  type="datetime-local"
                  id="published_at"
                  value={data.published_at}
                  onChange={(e) => setData("published_at", e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
          </CardHeader>
          <CardContent>
            <MediaUploader
              onUpload={(files) => {
                if (files.length > 0) {
                  setData("featured_image", files[0]);
                }
              }}
            />
            {errors.featured_image && (
              <p className="text-red-500 text-sm mt-2">
                {errors.featured_image}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={data.categories[data.categories.length - 1]}
              onValueChange={(value) =>
                setData("categories", [...data.categories, value])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="health">Health</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.categories.map((category, index) => (
                <Badge key={index} variant="secondary">
                  {category}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 p-0 h-auto"
                    onClick={() => {
                      const newCategories = [...data.categories];
                      newCategories.splice(index, 1);
                      setData("categories", newCategories);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Add a tag and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const newTag = e.currentTarget.value.trim();
                  if (newTag && !data.tags.includes(newTag)) {
                    setData("tags", [...data.tags, newTag]);
                    e.currentTarget.value = "";
                  }
                }
              }}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {data.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 p-0 h-auto"
                    onClick={() => {
                      const newTags = [...data.tags];
                      newTags.splice(index, 1);
                      setData("tags", newTags);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
