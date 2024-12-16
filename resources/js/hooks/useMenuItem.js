import { useState, useCallback } from 'react';

export const useMenuItem = (initialQuantity = 1) => {
    const [quantity, setQuantity] = useState(initialQuantity);
    const [selectedVariations, setSelectedVariations] = useState({});
    const [selectedAddons, setSelectedAddons] = useState([]);

    const handleQuantityChange = useCallback((delta) => {
        setQuantity(prev => {
            const newQuantity = prev + delta;
            return newQuantity >= 1 && newQuantity <= 10 ? newQuantity : prev;
        });
    }, []);

    const handleVariationChange = useCallback((name, option) => {
        setSelectedVariations(prev => ({
            ...prev,
            [name]: option
        }));
    }, []);

    const handleAddonToggle = useCallback((addon) => {
        setSelectedAddons(prev => {
            const exists = prev.find(a => a.name === addon.name);
            return exists 
                ? prev.filter(a => a.name !== addon.name)
                : [...prev, addon];
        });
    }, []);

    const calculateTotalPrice = useCallback((basePrice) => {
        let total = basePrice * quantity;
        
        Object.values(selectedVariations).forEach(variation => {
            if (variation.price) {
                total += variation.price * quantity;
            }
        });

        selectedAddons.forEach(addon => {
            total += addon.price * quantity;
        });

        return total.toFixed(2);
    }, [quantity, selectedVariations, selectedAddons]);

    const resetSelections = useCallback(() => {
        setQuantity(1);
        setSelectedVariations({});
        setSelectedAddons([]);
    }, []);

    return {
        quantity,
        selectedVariations,
        selectedAddons,
        handleQuantityChange,
        handleVariationChange,
        handleAddonToggle,
        calculateTotalPrice,
        resetSelections
    };
}; 