import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Home, Box } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import AttributeForm from "./Partials/AttributeForm";
import { Card } from "@/Components/ui/card";

const Edit = ({ attribute, can }) => {
  return (
    <AdminLayout>
      <Head title={`Edit Attribute: ${attribute.name}`} />
      <div className="container mx-auto py-6 px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Product Attributes", href: "app.product-attributes.index", icon: Box },
            { label: `Edit: ${attribute.name}` },
          ]}
        />

        <div className="space-y-6">
          <Card className="p-6">
            <AttributeForm
              attribute={attribute}
              isEditing={true}
              can={can}
            />
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Edit; 