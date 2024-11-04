import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Table from "./Partials/List/Index";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Button } from "@/Components/ui/button";
import { Home, FileText, Plus, ArrowLeft } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";

export default function Index({ blogs }) {
  return (
    <AdminLayout>
      <Head title="Blogs List" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Blogs", href: "blogs", icon: FileText },
          ]}
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            List Blogs
          </h2>
          <div className="flex space-x-2">
            <Link className="link-button-secondary" href="blogs">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
            </Link>
            <Link className="link-button-primary" href="blogs/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Blog
            </Link>
          </div>
        </div>
        <Table blogs={blogs} />
      </div>
    </AdminLayout>
  );
}
