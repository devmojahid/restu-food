import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import ListRoles from "./Partials/List/Index";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Plus, FolderKey } from "lucide-react";
import { Link } from "@inertiajs/react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import { useInfiniteScrollData } from "@/hooks/useInfiniteScrollData";

// Constants
const BREADCRUMB_ITEMS = [
  { label: "Dashboard", href: "dashboard" },
  { label: "Roles", href: "app.roles.index" },
];

export default function Index({ roles, meta = {}, filters = {}, stats = {} }) {
  const allRoles = useInfiniteScrollData(roles, filters);
  console.log("allRoles", meta);
  return (
    <AdminLayout>
      <Head title="Roles List" />

      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb items={BREADCRUMB_ITEMS} />
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
        <ListRoles
          roles={{
            ...roles,
            data: allRoles // Use our accumulated data with unique IDs
          }}
          meta={meta}
          stats={stats}
          filters={filters}
        />
      </div>
    </AdminLayout>
  );
}
