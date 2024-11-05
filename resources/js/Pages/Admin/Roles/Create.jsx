import React from "react";
import { Head } from "@inertiajs/react";
import Form from "./Partials/Create/Index";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Shield, Home } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";

const CreateRole = ({ permissions }) => {
  return (
    <AdminLayout>
      <Head title="Create Role" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Roles", href: "app.roles.index", icon: Shield },
            { label: "Create Role" },
          ]}
        />

        <Form permissions={permissions} />
      </div>
    </AdminLayout>
  );
};

export default CreateRole;
