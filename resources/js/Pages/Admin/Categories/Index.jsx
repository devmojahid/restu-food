import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Home, FileText, FolderTree } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import CategoryForm from "./Partials/CategoryForm";
import CategoryList from "./Partials/CategoryList";
import { Card } from "@/Components/ui/card";

const Index = ({ categories, filters, parentCategories, can }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setSelectedCategory(null);
    setIsEditing(false);
  };

  const handleSuccess = () => {
    setSelectedCategory(null);
    setIsEditing(false);
  };

  const paginatedCategories = categories || {
    data: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0,
    },
  };

  return (
    <AdminLayout>
      <Head title="Blog Categories" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Blogs", href: "app.blogs.index", icon: FileText },
            { label: "Categories", icon: FolderTree },
          ]}
        />

        <div className="space-y-6">
          {(can.create || can.edit) && (
            <Card className="p-6">
              <CategoryForm
                category={selectedCategory}
                categories={parentCategories}
                isEditing={isEditing}
                onCancel={handleCancelEdit}
                onSuccess={handleSuccess}
                can={can}
              />
            </Card>
          )}

          <Card className="p-6">
            <CategoryList
              categories={paginatedCategories}
              filters={filters}
              onEdit={handleEdit}
              can={can}
            />
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Index;
