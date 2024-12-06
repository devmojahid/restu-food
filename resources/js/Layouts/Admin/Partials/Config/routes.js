export const routes = {
    dashboard: {
        name: "Dashboard",
        path: "/app/dashboard",
        icon: "LayoutDashboard",
        role: ["Admin", "Customer", "Restaurant", "Kitchen", "Delivery"]
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
        role: ["Admin", "Restaurant"],
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
        role: ["Admin", "Restaurant"],
        submenu: {
            reports: {
                name: "Reports",
                path: route('app.products-management.reports'),
                icon: "Package"
            },
            analytics: {
                name: "Analytics",
                path: route('app.products-management.analytics'),
                icon: "Package"
            },
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
            },
            addons: {
                name: "Add-ons",
                icon: "Plus",
                role: ["Admin", "Restaurant"],
                path: "/app/products/addons",
            },
            addonsCategories: {
                name: "Add-on Categories",
                path: "/app/categories?type=addon",
                icon: "Folder"
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
            },
            orderCancelRequests: {
                name: "Order Cancel Requests",
                path: "/app/orders/cancel-requests",
                icon: "XCircle"
            }
        }
    },
    marketplace: {
        name: "Marketplace",
        icon: "ShoppingBag",
        role: ["Admin", "Restaurant"],
        submenu: {
            restaurants: {
                name: "Restaurants",
                path: "/app/restaurants",
                icon: "Package",
                role: ["Admin"]
            },
            pendingRestaurants: {
                name: "Restaurants Applications",
                path: "/app/restaurants/applications",
                icon: "Package",
                role: ["Admin"]
            },
            kitchenStaffApplications: {
                name: "Kitchen Staff Applications",
                path: "/app/kitchen-staff/applications",
                icon: "Package",
                role: ["Restaurant"]
            },
            deliveryStaffApplications: {
                name: "Delivery Staff Applications",
                path: "/app/delivery-staff/applications",
                icon: "Package",
                role: ["Admin"]
            }
        }
    },
    become: {
        name: "Become",
        icon: "Package",
        role: ["Customer"],
        submenu: {
            becomeRestaurant: {
                name: "Become Restaurant",
                path: route("app.become.restaurant"),
                icon: "Package"
            },
            becomeKitchenStaff: {
                name: "Become Kitchen Staff",
                path: route("app.become.kitchen"),
                icon: "Package"
            },
            becomeDeliveryStaff: {
                name: "Become Delivery Staff",
                path: route("app.become.delivery"),
                icon: "Package"
            }
        }
    },
    logistics: {
        name: "Logistics",
        icon: "Package",
        role: ["Admin"],
        submenu: {
            zones: {
                name: "Zones",
                path: "/app/logistics/zones",
                icon: "Package"
            }
        }
    }


    // Add other menu items similarly...
};
