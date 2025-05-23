import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import ListRoles from "./Partials/List/Index";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Plus, FolderKey } from "lucide-react";
import { Link } from "@inertiajs/react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import { useEffect, useState, useRef } from "react";

export default function Index({ roles, meta, filters, stats }) {
  const breadcrumbItems = [
    { label: "Dashboard", href: "dashboard" },
    { label: "Roles", href: "app.roles.index" },
  ];

  // Track all roles data for infinite scroll
  const [allRoles, setAllRoles] = useState(roles.data || []);
  // Track current page to prevent duplicate data
  const currentPageRef = useRef(roles.current_page || 1);

  // Add unique identifiers to prevent key collisions
  const addUniqueIds = (data, page) => {
    return data.map(item => ({
      ...item,
      _uniqueKey: `${item.id}-p${page}`
    }));
  };

  // Update allRoles when new data comes in, handling duplicate prevention
  useEffect(() => {
    if (!roles?.data) return;

    const newPage = roles.current_page || 1;

    if (newPage === 1) {
      // If this is the first page or filter reset, replace all data
      setAllRoles(addUniqueIds(roles.data, newPage));
      currentPageRef.current = newPage;
    } else if (newPage > currentPageRef.current) {
      // Only append data if it's a new page we haven't seen before
      setAllRoles(prev => [
        ...prev,
        ...addUniqueIds(roles.data, newPage)
      ]);
      currentPageRef.current = newPage;
    }
    // If it's a page we've already loaded, do nothing to prevent duplicates
  }, [roles]);

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
