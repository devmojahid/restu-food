import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Package, Home, Plus, FolderTree } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import AddonList from "./Partials/List/Index";
import AddonForm from "./Partials/Form/Index";
import { Button } from "@/Components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/Components/ui/sheet";
import { useState } from "react";
import { Link } from "@inertiajs/react";

const AddonsIndex = ({ addons, categories }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState(null);

  const handleCreate = () => {
    setEditingAddon(null);
    setIsCreateOpen(true);
  };

  const handleEdit = (addon) => {
    setEditingAddon(addon);
    setIsCreateOpen(true);
  };

  const handleClose = () => {
    setIsCreateOpen(false);
    setEditingAddon(null);
  };

  return (
    <AdminLayout>
      <Head title="Product Add-ons" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Products", href: "app.products.index", icon: Package },
            { label: "Add-ons" },
          ]}
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Product Add-ons
          </h1>
          <div className="flex gap-2">
            <Link
              href={route('app.categories.index', { type: 'addon' })}
              className="btn-secondary"
            >
              <FolderTree className="w-4 h-4 mr-2" />
              Manage Categories
            </Link>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Add-on
            </Button>
          </div>
        </div>

        <AddonList 
          addons={addons} 
          categories={categories}
          onEdit={handleEdit}
        />

        <Sheet 
          open={isCreateOpen} 
          onOpenChange={setIsCreateOpen}
          modal={true}
          side="right"
        >
          <SheetContent 
            className="w-full sm:max-w-xl lg:max-w-2xl"
            side="right"
            onClose={() => setIsCreateOpen(false)}
          >
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle>
                {editingAddon ? 'Edit Add-on' : 'Create Add-on'}
              </SheetTitle>
            </SheetHeader>
            
            <AddonForm
              addon={editingAddon}
              categories={categories}
              onSuccess={handleClose}
              onCancel={handleClose}
            />
          </SheetContent>
        </Sheet>
      </div>
    </AdminLayout>
  );
};

export default AddonsIndex; 