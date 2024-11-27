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
            },
            blogCategories: {
                name: "Blog Categories",
                path: "/app/categories?type=blog",
                icon: "Folder"
            }
        }
    },
    ecommerce: {
        name: "E-commerce",
        icon: "ShoppingBag",
        submenu: {
            products: {
                name: "Products",
                path: "/app/products",
                icon: "Package"
            },
            addNewProduct: {
                name: "Add New",
                path: "/app/products/create",
                icon: "Plus"
            },
            categories: {
                name: "Categories",
                path: "/app/categories?type=product",
                icon: "Folder"
            },
            productAttributes: {
                name: "Product Attributes",
                path: "/app/product-attributes",
                icon: "Settings"
            },
            coupons: {
                name: "Coupons",
                path: "/app/coupons",
                icon: "Settings"
            },
            reviews: {
                name: "Reviews",
                path: "/app/reviews",
                icon: "Settings"
            },
            productOptions: {
                name: "Product Options",
                path: "/app/products/options",
                icon: "Settings"
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
    orders: {
        name: "Orders",
        icon: "ShoppingCart",
        submenu: {
            allOrders: {
                name: "All Orders",
                path: "/app/orders/all",
                icon: "List"
            },
            pendingOrders: {
                name: "Pending Orders",
                path: "/app/orders/pending",
                icon: "Clock"
            },
            processingOrders: {
                name: "Processing Orders",
                path: "/app/orders/processing",
                icon: "Loader"
            },
            completedOrders: {
                name: "Completed Orders",
                path: "/app/orders/completed",
                icon: "CheckCircle"
            },
            cancelledOrders: {
                name: "Cancelled Orders",
                path: "/app/orders/cancelled",
                icon: "XCircle"
            }
        }
    },
    marketplace: {
        name: "Marketplace",
        icon: "ShoppingBag",
        submenu: {
            restaurants: {
                name: "Restaurants",
                path: "/app/restaurants",
                icon: "Package"
            }
        }
    }

    // Add other menu items similarly...
};
