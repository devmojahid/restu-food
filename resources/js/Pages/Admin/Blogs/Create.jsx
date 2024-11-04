import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Form from "./Partials/Create/Index";
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
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Blogs", href: "blogs", icon: FileText },
            { label: "Create Blog", icon: Plus },
          ]}
        />

        <Form />
      </div>
    </AdminLayout>
  );
};

export default CreateBlog;
