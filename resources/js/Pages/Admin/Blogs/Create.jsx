import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Form from "./Create/Index";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Button } from "@/Components/ui/button";
import { Plus, Home, FileText, Save, ArrowLeft } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";

const CreateBlog = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <AdminLayout>
      <Head title="Create Blog" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/admin/dashboard", icon: Home },
            { label: "Blogs", href: "/admin/blogs", icon: FileText },
            { label: "Create Blog", icon: Plus },
          ]}
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            Create Blog Post
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" href="/admin/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
            </Button>
            <Button type="submit" form="blog-form" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </div>
        <Form />
      </div>
    </AdminLayout>
  );
};

export default CreateBlog;
