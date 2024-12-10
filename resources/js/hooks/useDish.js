import { useState } from 'react';
import { router } from '@inertiajs/react';

export const useDish = (dish) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const addToCart = async (quantity = 1, options = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            await router.post('/cart/add', {
                dish_id: dish.id,
                quantity,
                ...options
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const addToWishlist = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await router.post('/wishlist/add', {
                dish_id: dish.id
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        addToCart,
        addToWishlist
    };
}; 