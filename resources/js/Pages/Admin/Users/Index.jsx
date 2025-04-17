import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import ListUsers from "./Partials/List/Index";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "@inertiajs/react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import { useEffect, useState, useRef } from "react";

export default function Index({ users, filters, roles, meta }) {
  const breadcrumbItems = [
    { label: "Dashboard", href: "dashboard" },
    { label: "Users", href: "app.users.index" },
  ];

  // Track all user data for infinite scroll
  const [allUsers, setAllUsers] = useState(users.data || []);
  // Track current page to prevent duplicate data
  const currentPageRef = useRef(users.current_page || 1);
  
  // Add unique identifiers to prevent key collisions
  const addUniqueIds = (data, page) => {
    return data.map(item => ({
      ...item,
      _uniqueKey: `${item.id}-p${page}`
    }));
  };

  // Update allUsers when new data comes in, handling duplicate prevention
  useEffect(() => {
    if (!users?.data) return;
    
    const newPage = users.current_page || 1;
    
    if (newPage === 1) {
      // If this is the first page or filter reset, replace all data
      setAllUsers(addUniqueIds(users.data, newPage));
      currentPageRef.current = newPage;
    } else if (newPage > currentPageRef.current) {
      // Only append data if it's a new page we haven't seen before
      setAllUsers(prev => [
        ...prev,
        ...addUniqueIds(users.data, newPage)
      ]);
      currentPageRef.current = newPage;
    }
    // If it's a page we've already loaded, do nothing to prevent duplicates
  }, [users]);

  return (
    <AdminLayout>
      <Head title="Users List" />

      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            List Users
          </h2>
          <div className="flex space-x-2">
            <Link
              className="link-button-secondary"
              href={route("app.users.index")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
            </Link>
            <Link
              className="link-button-primary"
              href={route("app.users.create")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Users
            </Link>
          </div>
        </div>
        <ListUsers 
          users={{
            ...users,
            data: allUsers // Use our accumulated data with unique IDs
          }} 
          roles={roles} 
          meta={meta} 
        />
      </div>
    </AdminLayout>
  );
}
