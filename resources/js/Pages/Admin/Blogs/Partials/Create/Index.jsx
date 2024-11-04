import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
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
  AlertCircle,
} from "lucide-react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
// import { format } from "date-fns";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import toast from "react-hot-toast";

// Define Blog collections constants
const BLOG_COLLECTIONS = {
  THUMBNAIL: "thumbnail",
  IMAGES: "images",
  VIDEOS: "videos",
  ATTACHMENTS: "attachments",
  FEATURED_IMAGES: "featured_images",
};

// Add this component for handling multiple blog images
const BlogImagesUploader = ({ images, onChange }) => {
  const handleImageUpload = (file) => {
    onChange([...images, file]);
  };

  const handleImageRemove = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const handleReorder = (dragIndex, hoverIndex) => {
    const newImages = [...images];
    const draggedImage = newImages[dragIndex];
    newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, draggedImage);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={image.id || image.uuid} className="relative group">
            <img
              src={image.url}
              alt={image.original_name}
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
              onClick={() => handleImageRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <FileUploader
        maxFiles={10}
        accept={{
          "image/*": [".png", ".jpg", ".jpeg", ".gif"],
        }}
        collection="blog_images"
        onUpload={handleImageUpload}
      />
    </div>
  );
};

// Add this component for error messages
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

export default function CreateBlog() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    blog_images: [],
    // File fields
    thumbnail: null,
    featured_image: null,
    images: [],
    videos: [],
    attachments: [],
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

    post(route("blogs.store"), {
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
    <form id="blog-form" onSubmit={handleSubmit} className="space-y-8">
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
            {processing || isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <span>Save Post</span>
            )}
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
                  onCheckedChange={(checked) =>
                    setData("is_published", checked)
                  }
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
              <CardTitle>Thumbnail</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader
                maxFiles={1}
                fileType="image"
                collection={BLOG_COLLECTIONS.THUMBNAIL}
                value={data.thumbnail}
                onUpload={(file) => setData("thumbnail", file)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader
                maxFiles={10}
                fileType="image"
                collection={BLOG_COLLECTIONS.IMAGES}
                value={data.images}
                onUpload={(files) => setData("images", files)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader
                maxFiles={5}
                fileType="video"
                collection={BLOG_COLLECTIONS.VIDEOS}
                value={data.videos}
                onUpload={(files) => setData("videos", files)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader
                maxFiles={20}
                fileType="document"
                collection={BLOG_COLLECTIONS.ATTACHMENTS}
                value={data.attachments}
                onUpload={(files) => setData("attachments", files)}
              />
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
    </form>
  );
}
