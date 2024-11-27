import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import Price from '@/Components/Price';

const ProductCard = ({ product }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">{product.description}</p>
                    <Price amount={product.price} className="text-lg font-bold" />
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard; 