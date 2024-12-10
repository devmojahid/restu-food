export const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(price);
};

export const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * (discount / 100));
};

export const getDietaryInfo = (dish) => {
    const info = [];
    if (dish.vegetarian) info.push('Vegetarian');
    if (dish.vegan) info.push('Vegan');
    if (dish.glutenFree) info.push('Gluten-Free');
    if (dish.spicy) info.push('Spicy');
    return info;
}; 