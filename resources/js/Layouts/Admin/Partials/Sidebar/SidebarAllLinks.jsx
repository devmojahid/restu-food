import React, { useState, useEffect, useCallback } from "react";
import { Link, usePage } from "@inertiajs/react";
import * as Icons from "lucide-react";
import { routes } from "../Config/routes";

const DynamicIcon = ({ name, className = "h-5 w-5" }) => {
  const Icon = Icons[name];
  return Icon ? <Icon className={className} /> : null;
};

const MenuLink = ({ href, icon, children, isActive, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`
      flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
      ${isActive 
        ? "bg-blue-500 text-white hover:bg-blue-600" 
        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      }
      group relative
    `}
  >
    <DynamicIcon name={icon} className="mr-3 h-5 w-5" />
    <span>{children}</span>
  </Link>
);

const SubMenuItems = ({ isOpen, items, parentKey, activeItems, hasRequiredRole, closeSidebar }) => {
  if (!isOpen) return null;

  return (
    <div className="ml-4 pl-2 space-y-1 border-l-2 border-gray-200 dark:border-gray-700">
      {Object.entries(items).map(
        ([subKey, subItem]) =>
          hasRequiredRole(subItem) && (
            <MenuLink
              key={subKey}
              href={subItem.path}
              icon={subItem.icon}
              isActive={activeItems.has(`${parentKey}-${subKey}`)}
              onClick={closeSidebar}
            >
              {subItem.name}
            </MenuLink>
          )
      )}
    </div>
  );
};

const SubMenuButton = ({ 
  icon, 
  children, 
  isOpen, 
  onClick, 
  hasActiveChild,
  submenuItems,
  parentKey,
  activeItems,
  hasRequiredRole,
  closeSidebar
}) => (
  <div className="relative">
    <button
      onClick={onClick}
      className={`
        flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
        ${hasActiveChild
          ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        }
        group
      `}
    >
      <div className="flex items-center">
        <DynamicIcon name={icon} className="mr-3 h-5 w-5" />
        <span>{children}</span>
      </div>
      <Icons.ChevronRight
        className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
      />
    </button>

    <SubMenuItems
      isOpen={isOpen}
      items={submenuItems}
      parentKey={parentKey}
      activeItems={activeItems}
      hasRequiredRole={hasRequiredRole}
      closeSidebar={closeSidebar}
    />
  </div>
);

export default function SidebarAllLinks({ closeSidebar }) {
  const { url } = usePage();
  const userRoles = usePage().props.auth.roles;
  const [openSubmenu, setOpenSubmenu] = useState("");
  const [activeItems, setActiveItems] = useState(new Set());

  // Check active routes on mount and URL changes
  useEffect(() => {
    const newActiveItems = new Set();
    
    Object.entries(routes).forEach(([key, item]) => {
      if (item.submenu) {
        Object.entries(item.submenu).forEach(([subKey, subItem]) => {
          if (url.startsWith(subItem.path)) {
            newActiveItems.add(key);
            newActiveItems.add(`${key}-${subKey}`);
            setOpenSubmenu(key);
          }
        });
      } else if (url.startsWith(item.path)) {
        newActiveItems.add(key);
      }
    });

    setActiveItems(newActiveItems);
  }, [url]);

  const toggleSubmenu = useCallback((key) => {
    setOpenSubmenu(openSubmenu === key ? "" : key);
  }, [openSubmenu]);

  const hasRequiredRole = useCallback((item) => {
    if (!item.role) return true;
    return userRoles.some((userRole) =>
      Array.isArray(item.role)
        ? item.role.includes(userRole)
        : item.role === userRole
    );
  }, [userRoles]);

  const hasActiveChild = useCallback((item) => {
    if (!item.submenu) return false;
    return Object.entries(item.submenu).some(
      ([subKey]) => activeItems.has(`${item.key}-${subKey}`)
    );
  }, [activeItems]);

  const renderMenuItem = useCallback((key, item) => {
    if (!hasRequiredRole(item)) return null;

    if (item.submenu) {
      const hasAccessibleSubmenuItems = Object.values(item.submenu).some(
        (subItem) => hasRequiredRole(subItem)
      );

      if (!hasAccessibleSubmenuItems) return null;

      return (
        <div key={key} className="relative">
          <SubMenuButton
            icon={item.icon}
            isOpen={openSubmenu === key}
            onClick={() => toggleSubmenu(key)}
            hasActiveChild={hasActiveChild(item)}
            submenuItems={item.submenu}
            parentKey={key}
            activeItems={activeItems}
            hasRequiredRole={hasRequiredRole}
            closeSidebar={closeSidebar}
          >
            {item.name}
          </SubMenuButton>
        </div>
      );
    }

    return (
      <MenuLink
        key={key}
        href={item.path}
        icon={item.icon}
        isActive={activeItems.has(key)}
        onClick={closeSidebar}
      >
        {item.name}
      </MenuLink>
    );
  }, [openSubmenu, activeItems, hasRequiredRole, hasActiveChild, toggleSubmenu, closeSidebar]);

  return (
    <div className="space-y-2 px-2">
      {Object.entries(routes).map(([key, item]) => renderMenuItem(key, item))}
    </div>
  );
}
