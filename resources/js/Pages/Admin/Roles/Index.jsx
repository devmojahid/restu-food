import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import ListRoles from "./Partials/List/Index";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Plus, FolderKey } from "lucide-react";
import { Link } from "@inertiajs/react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";

export default function Index({ roles }) {
  const breadcrumbItems = [
    { label: "Dashboard", href: "dashboard" },
    { label: "Roles", href: "app.roles.index" },
  ];

  return (
    <AdminLayout>
      <Head title="Roles List" />

      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            List Roles
          </h2>
          <div className="flex space-x-2">
            <Link
              className="link-button-secondary"
              href={route("app.roles.index")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Roles
            </Link>
            <Link
              className="link-button-primary"
              href={route("app.roles.create")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Link>
          </div>
        </div>
        <ListRoles roles={roles} />
      </div>
    </AdminLayout>
  );
}
