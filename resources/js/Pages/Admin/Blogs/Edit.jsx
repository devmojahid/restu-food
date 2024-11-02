import React from "react";
import { Head } from "@inertiajs/react";
import Form from "./Partials/Edit/Index";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Home, FileText, Edit as EditIcon } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";

const EditBlog = ({ blog }) => {
  return (
    <AdminLayout>
      <Head title={`Edit Blog: ${blog.title}`} />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/admin/dashboard", icon: Home },
            { label: "Blogs", href: "/admin/blogs", icon: FileText },
            { label: `Edit: ${blog.title}`, icon: EditIcon },
          ]}
        />

        <Form blog={blog} />
      </div>
    </AdminLayout>
  );
};

export default EditBlog;
