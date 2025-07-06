import React from "react";
import { Head } from "@inertiajs/react";
import Form from "./Partials/Create/Index";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Plus, Home, FileText } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";

const CreateBlog = ({ categories }) => {
  return (
    <AdminLayout>
      <Head title="Create Blog" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Blogs", href: "app.blogs.index", icon: FileText },
            { label: "Create Blog", icon: Plus },
          ]}
        />

        <Form categories={categories} />
      </div>
    </AdminLayout>
  );
};

export default CreateBlog;
