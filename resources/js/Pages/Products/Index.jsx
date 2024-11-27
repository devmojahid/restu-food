import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';
import CurrencySwitcher from '@/Components/CurrencySwitcher';
import CurrencyDisplay from '@/Components/CurrencyDisplay';

const ProductsIndex = ({ products, currencies, currentCurrency }) => {
    return (
        <AppLayout>
            <Head title="Products" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">Products</h1>
                        <CurrencySwitcher 
                            currencies={currencies} 
                            currentCurrency={currentCurrency} 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ProductsIndex; 