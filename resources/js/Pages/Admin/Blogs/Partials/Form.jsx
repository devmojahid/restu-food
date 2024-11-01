import React from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import FileUpload from "@/Components/FileUpload/FileUpload";
import { format } from "date-fns";

const BlogForm = ({ blog = null, className = "" }) => {
  const { data, setData, post, put, processing, errors } = useForm({
    title: blog?.title || "",
    content: blog?.content || "",
    featured_image: null,
    is_published: blog?.is_published || false,
    published_at: blog?.published_at
      ? format(new Date(blog.published_at), "yyyy-MM-dd'T'HH:mm")
      : "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (blog) {
      put(route("admin.blogs.update", blog.id));
    } else {
      post(route("admin.blogs.store"));
    }
  };

  const handleFileSelect = (files) => {
    setData("featured_image", files[0]);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => setData("title", e.target.value)}
          error={errors.title}
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={data.content}
          onChange={(e) => setData("content", e.target.value)}
          error={errors.content}
          rows={10}
        />
      </div>

      <div>
        <Label>Featured Image</Label>
        <FileUpload
          onFileSelect={handleFileSelect}
          accept={["image/*"]}
          className="mt-1"
        />
        {blog?.featured_image && (
          <div className="mt-2">
            <img
              src={blog.featured_image.url}
              alt="Featured"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="is_published"
          checked={data.is_published}
          onCheckedChange={(checked) => setData("is_published", checked)}
        />
        <Label htmlFor="is_published">Published</Label>
      </div>

      {data.is_published && (
        <div>
          <Label htmlFor="published_at">Publish Date</Label>
          <Input
            type="datetime-local"
            id="published_at"
            value={data.published_at}
            onChange={(e) => setData("published_at", e.target.value)}
          />
        </div>
      )}

      <Button type="submit" disabled={processing}>
        {blog ? "Update" : "Create"} Blog
      </Button>
    </form>
  );
};

export default BlogForm;
