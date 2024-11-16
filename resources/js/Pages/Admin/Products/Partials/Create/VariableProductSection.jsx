import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Plus, Trash2, Copy, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { cartesianProduct, generateSKU } from '@/utils/productUtils';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { AttributeActions } from './AttributeActions';

const SAMPLE_ATTRIBUTES = [
    {
        id: 1,
        name: 'Size',
        values: ['Small', 'Medium', 'Large', 'XL'],
        type: 'select',
    },
    {
        id: 2,
        name: 'Color',
        values: ['Red', 'Blue', 'Green', 'Black', 'White'],
        type: 'color',
    },
    {
        id: 3,
        name: 'Material',
        values: ['Cotton', 'Polyester', 'Wool', 'Silk'],
        type: 'select',
    }
];

const AttributeValueSelector = ({ attribute, selectedValues, onChange }) => {
    if (attribute.type === 'color') {
        return (
            <div className="flex flex-wrap gap-2">
                {attribute.values.map((value) => (
                    <div
                        key={value.id}
                        onClick={() => {
                            const newValues = selectedValues.includes(value.id)
                                ? selectedValues.filter(v => v !== value.id)
                                : [...selectedValues, value.id];
                            onChange(newValues);
                        }}
                        className={cn(
                            "w-8 h-8 rounded-full cursor-pointer border-2 transition-all",
                            selectedValues.includes(value.id)
                                ? "border-primary scale-110"
                                : "border-transparent scale-100 hover:scale-105"
                        )}
                        style={{ backgroundColor: value.color_code }}
                        title={value.label || value.value}
                    />
                ))}
            </div>
        );
    }

    return (
        <Select
            value={selectedValues}
            onValueChange={onChange}
            multiple
        >
            <SelectTrigger>
                <SelectValue placeholder="Select values" />
            </SelectTrigger>
            <SelectContent>
                {attribute.values.map((value) => (
                    <SelectItem key={value.id} value={value.id}>
                        {value.label || value.value}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

const AttributeForm = ({
    attribute,
    onUpdate,
    onRemove,
    isGlobal = false
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState(attribute.values || []);

    const handleSaveValues = () => {
        onUpdate(attribute.id, 'values', editedValues);
        setIsEditing(false);
    };

    return (
        <div className="mb-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Label className="text-base font-medium">{attribute.name}</Label>
                    <Badge variant={isGlobal ? "default" : "secondary"}>
                        {isGlobal ? "Global" : "Custom"}
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Switch
                        checked={attribute.visible}
                        onCheckedChange={(checked) =>
                            onUpdate(attribute.id, 'visible', checked)
                        }
                        id={`visible-${attribute.id}`}
                    />
                    <Label htmlFor={`visible-${attribute.id}`} className="text-sm">
                        Visible
                    </Label>

                    <Switch
                        checked={attribute.variation}
                        onCheckedChange={(checked) =>
                            onUpdate(attribute.id, 'variation', checked)
                        }
                        id={`variation-${attribute.id}`}
                    />
                    <Label htmlFor={`variation-${attribute.id}`} className="text-sm">
                        Used for variations
                    </Label>

                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemove(attribute.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <Label className="text-sm font-medium">Values</Label>
                    {isGlobal ? (
                        <AttributeValueSelector
                            attribute={attribute}
                            selectedValues={attribute.selectedValues || []}
                            onChange={(values) => onUpdate(attribute.id, 'selectedValues', values)}
                        />
                    ) : (
                        <>
                            {isEditing ? (
                                <div className="space-y-2">
                                    <Input
                                        value={editedValues.join(", ")}
                                        onChange={(e) => setEditedValues(e.target.value.split(",").map(v => v.trim()))}
                                        placeholder="Enter values separated by commas"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleSaveValues}
                                        >
                                            Save Values
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {attribute.values.map((value, index) => (
                                        <Badge key={index} variant="secondary">
                                            {value}
                                        </Badge>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Values
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const NewAttributeForm = ({ onSubmit, onCancel }) => {
    const [newAttribute, setNewAttribute] = useState({
        name: '',
        values: [],
        visible: true,
        variation: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newAttribute.name || !newAttribute.values.length) {
            toast.error("Please fill in all required fields");
            return;
        }
        onSubmit({
            ...newAttribute,
            id: `custom-${Date.now()}`,
            isCustom: true,
        });
        setNewAttribute({
            name: '',
            values: [],
            visible: true,
            variation: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <div className="space-y-2">
                <Label>Attribute Name</Label>
                <Input
                    value={newAttribute.name}
                    onChange={(e) => setNewAttribute({
                        ...newAttribute,
                        name: e.target.value
                    })}
                    placeholder="Enter attribute name (e.g., Size, Color)"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label>Values</Label>
                <Input
                    value={newAttribute.values.join(", ")}
                    onChange={(e) => setNewAttribute({
                        ...newAttribute,
                        values: e.target.value.split(",").map(v => v.trim()).filter(Boolean)
                    })}
                    placeholder="Enter values separated by commas (e.g., Small, Medium, Large)"
                    required
                />
                <p className="text-sm text-muted-foreground">
                    Enter multiple values separated by commas
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Switch
                        id="visible"
                        checked={newAttribute.visible}
                        onCheckedChange={(checked) =>
                            setNewAttribute({ ...newAttribute, visible: checked })
                        }
                    />
                    <Label htmlFor="visible">Visible on product page</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Switch
                        id="variation"
                        checked={newAttribute.variation}
                        onCheckedChange={(checked) =>
                            setNewAttribute({ ...newAttribute, variation: checked })
                        }
                    />
                    <Label htmlFor="variation">Used for variations</Label>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    Add Attribute
                </Button>
            </div>
        </form>
    );
};

const VariableProductSection = ({
    isVariableProduct,
    setIsVariableProduct,
    data,
    globalAttributes,
    handleAddAttribute,
    handleRemoveAttribute,
    handleAttributeChange,
    generateVariations,
    generatedVariations,
    handleVariationChange,
    handleSaveVariations,
}) => {
    const [showNewAttributeForm, setShowNewAttributeForm] = useState(false);

    const handleVariableToggle = (checked) => {
        if (!checked && data.attributes?.length > 0) {
            if (confirm('Disabling variable product will remove all attributes and variations. Are you sure?')) {
                setIsVariableProduct(checked);
            }
        } else {
            setIsVariableProduct(checked);
        }
    };

    const handleAddGlobalAttribute = (attributeId) => {
        const attribute = globalAttributes.find(
            (attr) => attr.id === Number(attributeId)
        );

        if (attribute) {
            // Check if attribute is already added
            if (data.attributes?.some(attr => attr.id === attribute.id)) {
                toast.error("This attribute is already added");
                return;
            }

            handleAddAttribute({
                ...attribute,
                selectedValues: [],
                visible: true,
                variation: true,
            });
        }
    };

    const handleAddCustomAttribute = (attribute) => {
        handleAddAttribute(attribute);
        setShowNewAttributeForm(false);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Variable Product</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={isVariableProduct}
                            onCheckedChange={handleVariableToggle}
                            id="variable-product-toggle"
                        />
                        <Label htmlFor="variable-product-toggle">
                            Enable variable product
                        </Label>
                    </div>
                </div>
                {isVariableProduct && (
                    <p className="text-sm text-muted-foreground mt-2">
                        Configure product attributes and generate variations
                    </p>
                )}
            </CardHeader>

            {isVariableProduct && (
                <CardContent className="space-y-6">
                    <Tabs defaultValue="attributes">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="attributes">Attributes</TabsTrigger>
                            <TabsTrigger value="variations">Variations</TabsTrigger>
                        </TabsList>

                        <TabsContent value="attributes" className="space-y-4">
                            <AttributeActions
                                globalAttributes={globalAttributes}
                                onAddGlobal={handleAddGlobalAttribute}
                                onAddLocal={handleAddCustomAttribute}
                                existingAttributeIds={data.attributes?.map(attr => attr.id) || []}
                            />

                            <ScrollArea className="h-[400px] pr-4">
                                {data.attributes?.map((attribute) => (
                                    <AttributeForm
                                        key={attribute.id}
                                        attribute={attribute}
                                        isGlobal={!attribute.isCustom}
                                        onUpdate={handleAttributeChange}
                                        onRemove={handleRemoveAttribute}
                                    />
                                ))}

                                {!data.attributes?.length && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No attributes added yet. Add some attributes to create variations.
                                    </div>
                                )}
                            </ScrollArea>

                            {data.attributes?.length > 0 && (
                                <div className="flex justify-end">
                                    <Button onClick={generateVariations}>
                                        Generate Variations
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="attributes" className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-lg font-semibold">Product Attributes</Label>
                                <div className="flex gap-2">
                                    <Select
                                        value=""
                                        onValueChange={handleAddGlobalAttribute}
                                    >
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Add global attribute" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {globalAttributes?.map((attribute) => (
                                                <SelectItem
                                                    key={attribute.id}
                                                    value={attribute.id.toString()}
                                                    disabled={data.attributes?.some(attr => attr.id === attribute.id)}
                                                >
                                                    {attribute.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowNewAttributeForm(true)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Custom Attribute
                                    </Button>
                                </div>
                            </div>

                            <ScrollArea className="h-[400px] pr-4">
                                {showNewAttributeForm && (
                                    <NewAttributeForm
                                        onSubmit={handleAddCustomAttribute}
                                        onCancel={() => setShowNewAttributeForm(false)}
                                    />
                                )}

                                {data.attributes?.map((attribute) => (
                                    <AttributeForm
                                        key={attribute.id}
                                        attribute={attribute}
                                        isGlobal={!attribute.isCustom}
                                        onUpdate={handleAttributeChange}
                                        onRemove={handleRemoveAttribute}
                                    />
                                ))}

                                {!data.attributes?.length && !showNewAttributeForm && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No attributes added yet. Add some attributes to create variations.
                                    </div>
                                )}
                            </ScrollArea>

                            {data.attributes?.length > 0 && (
                                <div className="flex justify-end">
                                    <Button onClick={generateVariations}>
                                        Generate Variations
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="variations" className="space-y-4">
                            {generatedVariations.length > 0 ? (
                                <>
                                    <div className="flex justify-between items-center">
                                        <Label className="text-lg font-semibold">
                                            Product Variations ({generatedVariations.length})
                                        </Label>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => bulkUpdateVariations('price', data.price)}
                                            >
                                                Set Default Prices
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => bulkUpdateVariations('stock_quantity', 0)}
                                            >
                                                Reset Stock
                                            </Button>
                                        </div>
                                    </div>

                                    <ScrollArea className="h-[400px]">
                                        <div className="space-y-4">
                                            {generatedVariations.map((variation, index) => (
                                                <Card key={index}>
                                                    <CardContent className="p-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <Label>Variation</Label>
                                                                <div className="flex flex-wrap gap-2 mt-1">
                                                                    {variation.attributes.map((attr, idx) => (
                                                                        <Badge key={idx}>
                                                                            {attr.name}: {attr.value}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>Price</Label>
                                                                    <Input
                                                                        type="number"
                                                                        step="0.01"
                                                                        value={variation.price}
                                                                        onChange={(e) =>
                                                                            handleVariationChange(
                                                                                index,
                                                                                'price',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>Stock</Label>
                                                                    <Input
                                                                        type="number"
                                                                        value={variation.stock_quantity}
                                                                        onChange={(e) =>
                                                                            handleVariationChange(
                                                                                index,
                                                                                'stock_quantity',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <Label>SKU</Label>
                                                                <Input
                                                                    value={variation.sku || generateSKU(variation)}
                                                                    onChange={(e) =>
                                                                        handleVariationChange(
                                                                            index,
                                                                            'sku',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Images</Label>
                                                                <FileUploader
                                                                    maxFiles={5}
                                                                    fileType="image"
                                                                    collection={`variation_${index}_images`}
                                                                    value={variation.images}
                                                                    onUpload={(files) =>
                                                                        handleVariationChange(index, 'images', files)
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </ScrollArea>

                                    <div className="flex justify-end">
                                        <Button onClick={handleSaveVariations}>
                                            Save Variations
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        No variations generated yet. Please add attributes and generate variations first.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            )}
        </Card>
    );
};

export default VariableProductSection; 