export const routes = {
    dashboard: {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: "LayoutDashboard"
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
    daraft: {
        name: "Draft",
        icon: "ShoppingBag",
        submenu: {
            productCreate: {
                name: "Product Create",
                path: "/drafts/product-create",
                icon: "Package"
            },
            productList: {
                name: "Product List",
                path: "/drafts/product-list",
                icon: "Package"
            }
        }
    },
    // Add other menu items similarly...
};
