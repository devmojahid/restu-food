import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            restaurant: null,
            appliedOffer: null,

            // Add item to cart
            addToCart: (item, restaurant) => {
                const { items, restaurant: currentRestaurant } = get();

                // Check if trying to add item from different restaurant
                if (currentRestaurant && currentRestaurant.id !== restaurant.id) {
                    if (!window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
                        return;
                    }
                    set({ items: [], restaurant: null, appliedOffer: null });
                }

                const existingItem = items.find(i => i.id === item.id);

                if (existingItem) {
                    set({
                        items: items.map(i =>
                            i.id === item.id
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                        restaurant: restaurant
                    });
                } else {
                    set({
                        items: [...items, { ...item, quantity: 1 }],
                        restaurant: restaurant
                    });
                }

                toast.success(`${item.name} added to cart`);
            },

            // Update item quantity
            updateQuantity: (item, quantity) => {
                const { items } = get();
                set({
                    items: items.map(i =>
                        i.id === item.id
                            ? { ...i, quantity }
                            : i
                    )
                });
            },

            // Remove item from cart
            removeItem: (item) => {
                const { items } = get();
                const newItems = items.filter(i => i.id !== item.id);
                
                set({
                    items: newItems,
                    ...(newItems.length === 0 && { restaurant: null, appliedOffer: null })
                });

                toast.success(`${item.name} removed from cart`);
            },

            // Clear cart
            clearCart: () => {
                set({ items: [], restaurant: null, appliedOffer: null });
            },

            // Apply offer
            applyOffer: async (code) => {
                try {
                    const response = await fetch(`/api/offers/validate`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                            code,
                            restaurant_id: get().restaurant?.id,
                            subtotal: get().cartSubtotal
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Invalid promo code');
                    }

                    const offer = await response.json();
                    set({ appliedOffer: offer });
                    return offer;
                } catch (error) {
                    throw new Error(error.message);
                }
            },

            // Remove offer
            removeOffer: () => {
                set({ appliedOffer: null });
            },

            // Calculate cart totals
            getCartTotals: () => {
                const { items, appliedOffer, restaurant } = get();
                
                const subtotal = items.reduce((total, item) => 
                    total + (item.price * item.quantity), 0
                );

                const deliveryFee = restaurant?.delivery_info?.delivery_fee ?? 0;
                const tax = subtotal * 0.1; // 10% tax
                
                let discount = 0;
                if (appliedOffer) {
                    discount = (subtotal * appliedOffer.discount_value) / 100;
                }

                const total = subtotal + deliveryFee + tax - discount;

                return {
                    subtotal,
                    deliveryFee,
                    tax,
                    discount,
                    total
                };
            }
        }),
        {
            name: 'cart-storage',
            version: 1,
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
            }
        }
    )
);

export const useCart = () => {
    const cart = useCartStore();
    const totals = cart.getCartTotals();

    return {
        items: cart.items,
        restaurant: cart.restaurant,
        appliedOffer: cart.appliedOffer,
        cartTotal: totals.total.toFixed(2),
        cartSubtotal: totals.subtotal.toFixed(2),
        deliveryFee: totals.deliveryFee.toFixed(2),
        tax: totals.tax.toFixed(2),
        discount: totals.discount.toFixed(2),
        addToCart: cart.addToCart,
        updateQuantity: cart.updateQuantity,
        removeItem: cart.removeItem,
        clearCart: cart.clearCart,
        applyOffer: cart.applyOffer,
        removeOffer: cart.removeOffer,
        isEmpty: cart.items.length === 0
    };
};

export default useCart; 