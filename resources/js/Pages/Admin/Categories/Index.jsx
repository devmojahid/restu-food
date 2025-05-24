import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Home, FileText, FolderTree } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import CategoryForm from "./Partials/CategoryForm";
import CategoryList from "./Partials/CategoryList";
import { Card } from "@/Components/ui/card";
import { useInfiniteScrollData } from "@/hooks/useInfiniteScrollData";

const Index = ({ categories, filters, parentCategories, can, meta }) => {
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

  const allCategories = useInfiniteScrollData(categories, filters);
  console.log("allCategories", meta);
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
          {/* {(can.create || can.edit) && ( */}
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
          {/* )} */}

          <CategoryList
            categories={{
              ...categories,
              data: allCategories,
            }}
            filters={filters}
            onEdit={handleEdit}
            can={can}
            meta={meta}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Index;
