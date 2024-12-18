import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
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
import { cn } from "@/lib/utils";
import {
  Save,
  ArrowLeft,
  AlertCircle,
  FolderTree,
} from "lucide-react";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import MultiSelect from "@/Components/ui/multi-select";

const FILE_COLLECTIONS = {
  THUMBNAIL: {
    name: "thumbnail",
    maxFiles: 1,
    fileType: "image",
    title: "Blog Thumbnail",
    description: "Upload a blog thumbnail (recommended size: 800x600px)",
  },
  FEATURED: {
    name: "featured",
    maxFiles: 1,
    fileType: "image",
    title: "Featured Image",
    description: "Upload a featured image (recommended size: 1200x800px)",
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
  published_at: null,
  categories: [],
  files: {
    thumbnail: null,
    featured: null,
  }
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

export default function CreateBlogForm({ categories }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoUpdateSlug, setAutoUpdateSlug] = useState(true);

  const { data, setData, post, processing, errors } = useForm(INITIAL_FORM_STATE);

  // Auto-generate slug from title
  useEffect(() => {
    if (data.title && autoUpdateSlug) {
      const slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setData('slug', slug);
    }
  }, [data.title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    post(route("app.blogs.store"));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create New Blog Post</h1>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={processing || isSubmitting}
            className={cn(
              "gap-2",
              (processing || isSubmitting) && "opacity-50 cursor-not-allowed"
            )}
          >
            <Save className="w-4 h-4" />
            Save Blog
          </Button>
        </div>
      </div>

      <ErrorAlert errors={errors} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" error={errors.title}>Title</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => setData("title", e.target.value)}
                  placeholder="Enter blog title"
                  error={errors.title}
                />
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
                  placeholder="blog-post-slug"
                  error={errors.slug}
                  disabled={autoUpdateSlug}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" error={errors.content}>Content</Label>
                <Textarea
                  id="content"
                  value={data.content}
                  onChange={(e) => setData("content", e.target.value)}
                  placeholder="Write your blog content here..."
                  className="min-h-[200px]"
                  error={errors.content}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" error={errors.excerpt}>Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={data.excerpt}
                  onChange={(e) => setData("excerpt", e.target.value)}
                  placeholder="Brief summary of the blog post"
                  className="h-24"
                  error={errors.excerpt}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title" error={errors.meta_title}>Meta Title</Label>
                <Input
                  id="meta_title"
                  value={data.meta_title}
                  onChange={(e) => setData("meta_title", e.target.value)}
                  placeholder="SEO title"
                  error={errors.meta_title}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description" error={errors.meta_description}>
                  Meta Description
                </Label>
                <Textarea
                  id="meta_description"
                  value={data.meta_description}
                  onChange={(e) => setData("meta_description", e.target.value)}
                  placeholder="SEO description"
                  className="h-24"
                  error={errors.meta_description}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Visibility</CardTitle>
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={data.is_featured}
                  onCheckedChange={(checked) => setData("is_featured", checked)}
                />
                <Label htmlFor="is_featured">Featured post</Label>
              </div>
            </CardContent>
          </Card>

          {/* Categories Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-4 w-4" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categories">
                  Select Categories
                  <span className="text-xs text-muted-foreground ml-2">
                    (You can select multiple)
                  </span>
                </Label>
                
                <MultiSelect
                  options={categories.map(category => ({
                    value: category.id.toString(),
                    label: category.name,
                    ...(category.parent && {
                      parent: category.parent
                    })
                  }))}
                  selected={data.categories}
                  onChange={(values) => setData("categories", values)}
                  placeholder="Select categories"
                  error={errors.categories}
                />

                {errors.categories && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.categories}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* File Uploaders */}
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
                    value={data.files[collection.name]}
                    onUpload={(file) => setData('files', {
                      ...data.files,
                      [collection.name]: file
                    })}
                    description={collection.description}
                    error={errors[`files.${collection.name}`]}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
