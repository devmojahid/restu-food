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
import { Plus, Trash2, Copy, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { cartesianProduct, generateSKU } from '@/utils/productUtils';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { AttributeActions } from './AttributeActions';
import VariationCard from './VariationCard';
import VariationsTable from './VariationsTable';
import BulkActions from './BulkActions';

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
    const [editedValues, setEditedValues] = useState(
        Array.isArray(attribute.values) ? attribute.values : 
        attribute.values?.split(',').map(v => v.trim()) || []
    );

    const validateValues = (values) => {
        if (!values.length) {
            toast.error("At least one value is required");
            return false;
        }
        if (values.some(v => !v.trim())) {
            toast.error("Empty values are not allowed");
            return false;
        }
        return true;
    };

    const handleSaveValues = () => {
        if (validateValues(editedValues)) {
            onUpdate(attribute.id, 'values', editedValues);
            setIsEditing(false);
        }
    };

    const handleBulkAdd = () => {
        const input = prompt("Enter multiple values separated by commas");
        if (input) {
            const newValues = input.split(',').map(v => v.trim()).filter(Boolean);
            if (validateValues(newValues)) {
                setEditedValues([...new Set([...editedValues, ...newValues])]);
            }
        }
    };

    const handleRemoveValue = (valueToRemove) => {
        setEditedValues(editedValues.filter(v => v !== valueToRemove));
    };

    const handleUpdateValues = (values) => {
        if (isGlobal) {
            onUpdate(attribute.id, 'selectedValues', values);
        } else {
            onUpdate(attribute.id, 'values', values);
        }
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
                            onChange={handleUpdateValues}
                        />
                    ) : (
                        <>
                            {isEditing ? (
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Input
                                            value={editedValues.join(", ")}
                                            onChange={(e) => setEditedValues(
                                                e.target.value.split(",")
                                                    .map(v => v.trim())
                                                    .filter(Boolean)
                                            )}
                                            placeholder="Enter values separated by commas"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleBulkAdd}
                                            title="Add multiple values at once"
                                        >
                                            Bulk Add
                                        </Button>
                                    </div>
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
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {editedValues.map((value, index) => (
                                            <Badge 
                                                key={index} 
                                                variant="secondary"
                                                className="group"
                                            >
                                                {value}
                                                <X 
                                                    className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 cursor-pointer"
                                                    onClick={() => handleRemoveValue(value)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit Values
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleBulkAdd}
                                        >
                                            Add More Values
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {attribute.values?.length > 0 && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                        <Label className="text-sm font-medium">Preview</Label>
                        <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                                This attribute will create {attribute.values.length} variations when combined with other attributes.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {attribute.values.map((value, index) => (
                                    <Badge key={index}>
                                        {value}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
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

const generateVariationSKU = (baseSlug, attributes) => {
    if (!attributes || !Array.isArray(attributes)) return '';
    
    const variantSlug = attributes
        .map(attr => attr.value?.toLowerCase().replace(/\s+/g, '-'))
        .filter(Boolean)
        .join('-');
    
    return `${baseSlug}-${variantSlug}`;
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
    const [activeVariationTab, setActiveVariationTab] = useState('list');
    const [bulkEditMode, setBulkEditMode] = useState(false);
    const [selectedVariations, setSelectedVariations] = useState([]);
    const [variationFilter, setVariationFilter] = useState('');

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

    const handleGenerateVariations = () => {
        const variationAttributes = data.attributes.filter(attr => attr.variation);
        
        if (variationAttributes.length === 0) {
            toast.error("Please select at least one attribute for variations");
            return;
        }

        const attributeValues = variationAttributes.map(attr => 
            attr.isCustom ? attr.values : attr.selectedValues
        );

        if (attributeValues.some(values => !values?.length)) {
            toast.error("Please select values for all variation attributes");
            return;
        }

        const variations = cartesianProduct(...attributeValues).map((combination) => {
            const attributes = combination.map((value, index) => ({
                id: variationAttributes[index].id,
                name: variationAttributes[index].name,
                value,
            }));

            return {
                attributes,
                price: data.price || 0,
                stock_quantity: 0,
                sku: generateVariationSKU(data.slug || '', attributes),
                images: [],
                is_active: true,
                weight: data.weight || '',
                length: data.length || '',
                width: data.width || '',
                height: data.height || '',
            };
        });

        setGeneratedVariations(variations);
        toast.success(`Generated ${variations.length} variations`);
    };

    const handleBulkEdit = (field, value) => {
        const updatedVariations = generatedVariations.map((variation, index) => {
            if (selectedVariations.includes(index)) {
                return {
                    ...variation,
                    [field]: value
                };
            }
            return variation;
        });
        setGeneratedVariations(updatedVariations);
    };

    const filteredVariations = generatedVariations.filter(variation => 
        variation.attributes.some(attr => 
            attr.value.toLowerCase().includes(variationFilter.toLowerCase())
        )
    );

    const VariationsTabContent = () => {
        const hasVariations = filteredVariations.length > 0;
        
        if (!hasVariations) {
            return (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                        <AlertCircle className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No Variations Generated</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Select attributes and generate variations to start managing product variants.
                    </p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={handleGenerateVariations}
                    >
                        Generate Variations
                    </Button>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Input
                            placeholder="Filter variations..."
                            value={variationFilter}
                            onChange={(e) => setVariationFilter(e.target.value)}
                            className="w-full sm:w-64"
                        />
                        <Select
                            value={activeVariationTab}
                            onValueChange={setActiveVariationTab}
                        >
                            <SelectTrigger className="w-full sm:w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="list">List View</SelectItem>
                                <SelectItem value="grid">Grid View</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setBulkEditMode(!bulkEditMode)}
                        >
                            {bulkEditMode ? 'Exit Bulk Edit' : 'Bulk Edit'}
                        </Button>
                        
                        {bulkEditMode && selectedVariations.length > 0 && (
                            <BulkActions
                                selectedCount={selectedVariations.length}
                                onBulkUpdate={(updates) => {
                                    selectedVariations.forEach(index => {
                                        Object.entries(updates).forEach(([field, value]) => {
                                            handleVariationChange(index, field, value);
                                        });
                                    });
                                    setBulkEditMode(false);
                                    setSelectedVariations([]);
                                    toast.success(`Updated ${selectedVariations.length} variations`);
                                }}
                                basePrice={data.price}
                                onClose={() => setBulkEditMode(false)}
                            />
                        )}
                        
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleGenerateVariations}
                        >
                            Regenerate
                        </Button>
                    </div>
                </div>

                {activeVariationTab === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredVariations.map((variation, index) => (
                            <VariationCard
                                key={index}
                                variation={variation}
                                index={index}
                                onUpdate={handleVariationChange}
                                isSelected={selectedVariations.includes(index)}
                                onSelect={() => {
                                    if (bulkEditMode) {
                                        setSelectedVariations(prev => 
                                            prev.includes(index)
                                                ? prev.filter(i => i !== index)
                                                : [...prev, index]
                                        );
                                    }
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <VariationsTable
                        variations={filteredVariations}
                        onUpdate={handleVariationChange}
                        bulkEditMode={bulkEditMode}
                        selectedVariations={selectedVariations}
                        onSelectVariation={setSelectedVariations}
                    />
                )}

                <div className="flex justify-end">
                    <Button onClick={handleSaveVariations}>
                        Save All Variations
                    </Button>
                </div>
            </div>
        );
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

                        

                        <TabsContent value="variations" className="space-y-4">
                            <VariationsTabContent />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            )}
        </Card>
    );
};

export default VariableProductSection; 