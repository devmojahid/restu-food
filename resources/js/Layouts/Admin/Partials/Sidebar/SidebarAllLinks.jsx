import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import * as Icons from "lucide-react";
import { routes } from "../Config/routes";

const DynamicIcon = ({ name }) => {
  const Icon = Icons[name];
  return Icon ? <Icon className="mr-3 h-5 w-5" /> : null;
};

export default function SidebarAllLinks({ closeSidebar }) {
  const {
    url,
    props: { auth },
  } = usePage();
  const userRoles = auth.roles;
  const [openSubmenu, setOpenSubmenu] = useState("");

  // Check if current URL matches any submenu items and open parent menu
  useEffect(() => {
    for (const [key, item] of Object.entries(routes)) {
      if (item.submenu) {
        const hasActiveChild = Object.values(item.submenu).some((subItem) =>
          url.startsWith(subItem.path)
        );
        if (hasActiveChild) {
          setOpenSubmenu(key);
          break;
        }
      }
    }
  }, [url]);

  const isActive = (path) => {
    if (!path) return false;
    return url.startsWith(path);
  };

  const toggleSubmenu = (key) => {
    setOpenSubmenu(openSubmenu === key ? "" : key);
  };

  const hasRequiredRole = (item) => {
    // If no roles specified, show to everyone
    if (!item.role) return true;

    // Check if user has any of the required roles
    return userRoles.some((userRole) =>
      Array.isArray(item.role)
        ? item.role.includes(userRole)
        : item.role === userRole
    );
  };

  const renderMenuItem = (key, item) => {
    // Skip rendering if user doesn't have required role
    if (!hasRequiredRole(item)) return null;

    const active = isActive(item.path);

    if (item.submenu) {
      // Check if any submenu items are accessible to the user
      const hasAccessibleSubmenuItems = Object.values(
        item.submenu
      ).some((subItem) => hasRequiredRole(subItem));

      // Don't render the submenu if user has no access to any of its items
      if (!hasAccessibleSubmenuItems) return null;

      return (
        <div key={key}>
          <button
            onClick={() => toggleSubmenu(key)}
            className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 
              ${openSubmenu === key ? "bg-blue-50 dark:bg-gray-800" : ""}
              text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700`}
          >
            <span className="flex items-center">
              <DynamicIcon name={item.icon} />
              {item.name}
            </span>
            <Icons.ChevronRight
              className={`h-4 w-4 transition-transform duration-200 
                ${openSubmenu === key ? "rotate-90" : ""}`}
            />
          </button>
          {openSubmenu === key && (
            <ul className="mt-2 space-y-1 px-4">
              {Object.entries(item.submenu).map(
                ([subKey, subItem]) =>
                  // Only render submenu items user has access to
                  hasRequiredRole(subItem) && (
                    <li key={subKey}>
                      <Link
                        href={subItem.path}
                        className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 
                        ${
                          isActive(subItem.path)
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => closeSidebar()}
                      >
                        <DynamicIcon name={subItem.icon} />
                        {subItem.name}
                      </Link>
                    </li>
                  )
              )}
            </ul>
          )}
        </div>
      );
    }

    return (
      <Link
        key={key}
        href={item.path}
        className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 
          ${
            active
              ? "bg-blue-500 text-white"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        onClick={() => closeSidebar()}
      >
        <DynamicIcon name={item.icon} />
        {item.name}
      </Link>
    );
  };

  return (
    <ul className="space-y-2 px-3">
      {Object.entries(routes).map(([key, item]) => (
        <li key={key}>{renderMenuItem(key, item)}</li>
      ))}
    </ul>
  );
}
