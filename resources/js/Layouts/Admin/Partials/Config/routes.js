export const routes = {
    dashboard: {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: "LayoutDashboard"
    },
    settings: {
        name: "Settings",
        path: "/admin/settings",
        icon: "Settings"
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
                path: "/admin/orders",
                icon: "ShoppingCart"
            },
            customers: {
                name: "Customers",
                path: "/admin/customers",
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
                path: "/admin/blogs",
                icon: "Package"
            },
            blogCreate: {
                name: "Blog Create",
                path: "/admin/blogs/create",
                icon: "Package"
            }
        }
    },
    // Add other menu items similarly...
};
