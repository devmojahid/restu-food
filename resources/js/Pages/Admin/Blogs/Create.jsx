import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BlogForm from "./Partials/Form";

const CreateBlog = () => {
  return (
    <AdminLayout>
      <Head title="Create Blog" />

      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold mb-6">Create Blog</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <BlogForm />
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateBlog;
