import routes from '@/config/routes';

export const route = (name, params = {}) => {
    let path = routes[name];
    
    if (typeof path === 'function') {
        return path(params);
    }
    
    if (!path) {
        console.error(`Route "${name}" not found`);
        return '/';
    }
    
    // Replace dynamic parameters
    Object.keys(params).forEach(key => {
        path = path.replace(`:${key}`, params[key]);
    });
    
    return path;
};

export const isRoute = (name) => {
    return window.location.pathname === routes[name];
};

export const isActiveRoute = (name, params = {}) => {
    const path = route(name, params);
    return window.location.pathname === path;
}; 