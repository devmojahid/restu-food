import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BlogForm from "./Partials/Form";

const EditBlog = ({ blog }) => {
  return (
    <AdminLayout>
      <Head title="Edit Blog" />

      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold mb-6">Edit Blog</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <BlogForm blog={blog} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditBlog;
