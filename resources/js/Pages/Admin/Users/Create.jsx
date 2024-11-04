import React from "react";
import { Head } from "@inertiajs/react";
import Form from "./Partials/Create/Index";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Users, Home } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";

const CreateUser = (data) => {
  return (
    <AdminLayout>
      <Head title="Create User" />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Users", href: "app.users.index", icon: Users },
            { label: "Create User" },
          ]}
        />

        <Form data={data} />
      </div>
    </AdminLayout>
  );
};

export default CreateUser;
