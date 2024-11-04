export const routes = {
    dashboard: {
        name: "Dashboard",
        path: "/app/dashboard",
        icon: "LayoutDashboard",
        role: ["Admin", "Customer"]
    },
    settings: {
        name: "Settings",
        path: "/app/settings",
        icon: "Settings",
        role: "Admin"
    },
    users: {
        name: "Users",
        icon: "Users",
        role: "Admin",
        submenu: {
            users: {
                name: "Users",
                path: "/app/users",
                icon: "Users"
            },
            roles: {
                name: "Roles",
                path: "/app/roles",
                icon: "FolderKey"
            }
        }
    },
    ecommerce: {
        name: "E-commerce",
        icon: "ShoppingBag",
        submenu: {
            products: {
                name: "Products",
                path: "/ai/writers",
                icon: "Package"
            },
            orders: {
                name: "Orders",
                path: "orders",
                icon: "ShoppingCart"
            },
            customers: {
                name: "Customers",
                path: "customers",
                icon: "Users"
            }
        }
    },
    blog: {
        name: "Blog",
        icon: "ShoppingBag",
        submenu: {
            blog: {
                name: "Blog",
                path: "/app/blogs",
                icon: "Package"
            },
            blogCreate: {
                name: "Blog Create",
                path: "/app/blogs/create",
                icon: "Package"
            }
        }
    },
    // Add other menu items similarly...
};
