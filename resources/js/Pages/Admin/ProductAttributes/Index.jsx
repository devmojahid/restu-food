import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Home, Box, Plus } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import AttributeForm from "./Partials/AttributeForm";
import AttributeList from "./Partials/AttributeList";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

const Index = ({ attributes, filters, can }) => {
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (attribute) => {
    setSelectedAttribute(attribute);
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setSelectedAttribute(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleSuccess = () => {
    setSelectedAttribute(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setSelectedAttribute(null);
    setIsEditing(false);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AdminLayout>
      <Head title="Product Attributes" />
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "dashboard", icon: Home },
              { label: "Product Attributes", icon: Box },
            ]}
          />
          {can.create && !showForm && (
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add Attribute
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {showForm && (
            <Card className="p-6">
              <AttributeForm
                attribute={selectedAttribute}
                isEditing={isEditing}
                onCancel={handleCancelEdit}
                onSuccess={handleSuccess}
                can={can}
              />
            </Card>
          )}

          <Card className="p-6">
            <AttributeList
              attributes={attributes.data}
              pagination={{
                currentPage: attributes.current_page,
                perPage: attributes.per_page,
                lastPage: attributes.last_page,
                total: attributes.total,
                links: attributes.links,
                from: attributes.from,
                to: attributes.to,
              }}
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