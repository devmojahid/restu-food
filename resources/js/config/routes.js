const routes = {
    home: '/',
    menu: '/menu',
    restaurants: '/restaurants',
    offers: '/offers',
    cart: '/cart',
    wishlist: '/wishlist',
    profile: '/profile',
    orders: '/orders',
    about: '/about',
    contact: '/contact',
    
    // Restaurant routes
    restaurantDetail: (slug) => `/restaurants/${slug}`,
    restaurantMenu: (slug) => `/restaurants/${slug}/menu`,
    
    // Menu routes
    menuCategory: (category) => `/menu/${category}`,
    dishDetail: (slug) => `/menu/dish/${slug}`,
    
    // Cart routes
    cartAdd: '/cart/add',
    cartUpdate: '/cart/update',
    cartRemove: '/cart/remove',
    checkout: '/checkout',
    
    // User routes
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    
    // API routes
    api: {
        search: '/api/search',
        locations: '/api/locations',
        restaurants: '/api/restaurants',
        dishes: '/api/dishes',
        categories: '/api/categories',
        cart: '/api/cart',
        wishlist: '/api/wishlist',
        orders: '/api/orders',
        reviews: '/api/reviews',
    }
};

export default routes; 