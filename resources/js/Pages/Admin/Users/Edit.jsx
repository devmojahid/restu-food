import React from "react";
import { Head } from "@inertiajs/react";
import Form from "./Partials/Edit/Index";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Users, Home } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";

const EditUser = ({ user, roles }) => {
  return (
    <AdminLayout>
      <Head title={`Edit User - ${user.name}`} />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Users", href: "app.users.index", icon: Users },
            { label: `Edit ${user.name}` },
          ]}
        />

        <Form user={user} roles={roles} />
      </div>
    </AdminLayout>
  );
};

export default EditUser;
