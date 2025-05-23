import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { ArrowLeft, Users } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import UserForm from "./Partials/Form/UserForm";

const EditUser = ({ user, roles }) => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "dashboard" },
    { label: "Users", href: "app.users.index", icon: Users },
    { label: `Edit ${user.name}` },
  ];

  return (
    <AdminLayout>
      <Head title={`Edit User - ${user.name}`} />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            Edit User: {user.name}
          </h2>
          <Link
            className="link-button-secondary flex items-center"
            href={route("app.users.index")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
          </Link>
        </div>

        <UserForm user={user} roles={roles} mode="edit" />
      </div>
    </AdminLayout>
  );
};

export default EditUser;
