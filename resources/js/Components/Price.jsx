import React from "react";
import { usePage } from "@inertiajs/react";

const Price = ({ amount, className = "" }) => {
    const { currentCurrency } = usePage().props;
    
    return (
        <span className={className}>
            {currentCurrency.format(amount)}
        </span>
    );
};

export default Price; 