import React from "react";
import { Head } from "@inertiajs/react";
import Form from "./Partials/Edit/Index";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Shield, Home } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";

const EditRole = ({ role, permissions, stats }) => {
  return (
    <AdminLayout>
      <Head title={`Edit Role - ${role.name}`} />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Roles", href: "app.roles.index", icon: Shield },
            { label: `Edit ${role.name}` },
          ]}
        />

        <Form role={role} permissions={permissions} stats={stats} />
      </div>
    </AdminLayout>
  );
};

export default EditRole;
