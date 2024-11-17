import React from 'react';
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import { Switch } from "@/Components/ui/switch";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { cn } from "@/lib/utils";

const VariationCard = ({ 
    variation, 
    index, 
    onUpdate,
    isSelected,
    onSelect,
    className 
}) => {
    return (
        <Card 
            className={cn(
                "group transition-all duration-200 hover:shadow-md",
                isSelected && "ring-2 ring-primary",
                className
            )}
            onClick={() => onSelect?.()}
        >
            <CardContent className="p-4 space-y-4">
                {/* Variation Attributes */}
                <div>
                    <Label className="text-sm font-medium mb-2">Variation</Label>
                    <div className="flex flex-wrap gap-1.5">
                        {variation.attributes.map((attr, idx) => (
                            <Badge 
                                key={idx} 
                                variant={attr.type === 'color' ? 'outline' : 'secondary'}
                                className="text-xs"
                            >
                                {attr.type === 'color' ? (
                                    <div className="flex items-center gap-1.5">
                                        <div 
                                            className="w-3 h-3 rounded-full ring-1 ring-inset ring-black/10"
                                            style={{ backgroundColor: attr.value }}
                                        />
                                        {attr.name}: {attr.label || attr.value}
                                    </div>
                                ) : (
                                    `${attr.name}: ${attr.value}`
                                )}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`variation-${index}-price`}>Price</Label>
                        <Input
                            id={`variation-${index}-price`}
                            type="number"
                            step="0.01"
                            value={variation.price}
                            onChange={(e) => onUpdate(index, 'price', e.target.value)}
                            className="text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`variation-${index}-stock`}>Stock</Label>
                        <Input
                            id={`variation-${index}-stock`}
                            type="number"
                            value={variation.stock_quantity}
                            onChange={(e) => onUpdate(index, 'stock_quantity', e.target.value)}
                            className="text-sm"
                        />
                    </div>
                </div>

                {/* SKU */}
                <div className="space-y-2">
                    <Label htmlFor={`variation-${index}-sku`}>SKU</Label>
                    <Input
                        id={`variation-${index}-sku`}
                        value={variation.sku}
                        onChange={(e) => onUpdate(index, 'sku', e.target.value)}
                        className="text-sm"
                    />
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                    <Label htmlFor={`variation-${index}-status`}>Status</Label>
                    <Switch
                        id={`variation-${index}-status`}
                        checked={variation.is_active}
                        onCheckedChange={(checked) => onUpdate(index, 'is_active', checked)}
                    />
                </div>

                {/* Images */}
                <div className="space-y-2">
                    <Label>Images</Label>
                    <FileUploader
                        maxFiles={5}
                        fileType="image"
                        collection={`variation_${index}_images`}
                        value={variation.images}
                        onUpload={(files) => onUpdate(index, 'images', files)}
                        compact
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default VariationCard; 