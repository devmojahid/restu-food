import React, { useState } from 'react';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Plus, X, Move, Save, Search, Settings2, Palette, Box } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Switch } from "@/Components/ui/switch";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { toast } from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/Components/ui/collapsible";
import { Card, CardContent } from "@/Components/ui/card";

const AttributeTypeInfo = {
    select: {
        icon: <Box className="w-4 h-4" />,
        label: 'Dropdown Select',
        description: 'Simple dropdown selection'
    },
    color: {
        icon: <Palette className="w-4 h-4" />,
        label: 'Color Swatch',
        description: 'Visual color selection'
    },
    button: {
        icon: <Button variant="ghost" size="icon" className="w-4 h-4" />,
        label: 'Button',
        description: 'Clickable button selection'
    },
    radio: {
        icon: <Circle className="w-4 h-4" />,
        label: 'Radio Button',
        description: 'Single choice selection'
    }
};

const AttributeTypeSelector = ({ value, onChange }) => (
    <div className="grid grid-cols-2 gap-4">
        {Object.entries(AttributeTypeInfo).map(([type, info]) => (
            <div
                key={type}
                className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all",
                    "hover:border-primary/50 hover:bg-accent",
                    value === type && "border-primary bg-primary/5"
                )}
                onClick={() => onChange(type)}
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-lg",
                        value === type ? "bg-primary/10" : "bg-muted"
                    )}>
                        {info.icon}
                    </div>
                    <div>
                        <h4 className="font-medium">{info.label}</h4>
                        <p className="text-xs text-muted-foreground">
                            {info.description}
                        </p>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const GlobalAttributeCard = ({ 
    attribute, 
    isSelected, 
    onSelect,
    showValues = false 
}) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card
            className={cn(
                "group transition-all duration-200",
                "hover:shadow-md cursor-pointer",
                isSelected && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !isSelected && onSelect(attribute)}
        >
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "p-2 rounded-lg",
                            isSelected ? "bg-muted" : "bg-primary/10"
                        )}>
                            {AttributeTypeInfo[attribute.type]?.icon}
                        </div>
                        <div>
                            <h4 className="font-medium">{attribute.name}</h4>
                            <p className="text-xs text-muted-foreground">
                                {attribute.values.length} values
                            </p>
                        </div>
                    </div>
                    <Badge variant={isSelected ? "outline" : "default"}>
                        {attribute.type}
                    </Badge>
                </div>

                <Collapsible open={expanded} onOpenChange={setExpanded}>
                    <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                            {expanded ? "Show less" : "Show values"}
                            <ChevronDown className={cn(
                                "w-4 h-4 transition-transform",
                                expanded && "rotate-180"
                            )} />
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                        <div className="flex flex-wrap gap-1">
                            {attribute.values.map((value, index) => (
                                <Badge 
                                    key={index} 
                                    variant="secondary"
                                    className="text-xs"
                                >
                                    {value.label || value.value}
                                </Badge>
                            ))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
};

export const AttributeActions = ({ 
    globalAttributes, 
    onAddGlobal, 
    onAddLocal,
    existingAttributeIds = [] 
}) => {
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [activeTab, setActiveTab] = useState('custom');
    const [searchTerm, setSearchTerm] = useState('');
    const [newAttribute, setNewAttribute] = useState({
        name: '',
        values: [''],
        type: 'select',
        isCustom: true,
        visible: true,
        variation: true,
    });

    const filteredGlobalAttributes = globalAttributes?.filter(attr => 
        attr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attr.values.some(v => 
            (v.label || v.value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleAddValue = () => {
        setNewAttribute(prev => ({
            ...prev,
            values: [...prev.values, '']
        }));
    };

    const handleUpdateValue = (index, value) => {
        setNewAttribute(prev => ({
            ...prev,
            values: prev.values.map((v, i) => i === index ? value : v)
        }));
    };

    const handleRemoveValue = (index) => {
        if (newAttribute.values.length === 1) return;
        setNewAttribute(prev => ({
            ...prev,
            values: prev.values.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const values = newAttribute.values.filter(Boolean);
        
        if (!newAttribute.name || values.length === 0) {
            toast.error("Please add attribute name and at least one value");
            return;
        }

        onAddLocal({
            ...newAttribute,
            id: `local-${Date.now()}`,
            values: values,
        });

        setNewAttribute({
            name: '',
            values: [''],
            type: 'select',
            isCustom: true,
            visible: true,
            variation: true,
        });
        setShowNewDialog(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">Product Attributes</Label>
                <Dialog 
                    open={showNewDialog} 
                    onOpenChange={setShowNewDialog}
                >
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Attribute
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add Product Attribute</DialogTitle>
                            <DialogDescription>
                                Create a new attribute or select from existing global attributes
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="custom" onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="custom">
                                    <Settings2 className="w-4 h-4 mr-2" />
                                    Custom Attribute
                                </TabsTrigger>
                                <TabsTrigger value="global">
                                    <Globe className="w-4 h-4 mr-2" />
                                    Global Attributes
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="custom" className="space-y-4 mt-4">
                                {/* Custom Attribute Form */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Attribute Name</Label>
                                            <Input
                                                value={newAttribute.name}
                                                onChange={(e) => setNewAttribute({
                                                    ...newAttribute,
                                                    name: e.target.value
                                                })}
                                                placeholder="e.g., Size, Color, Material"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Attribute Type</Label>
                                        <AttributeTypeSelector
                                            value={newAttribute.type}
                                            onChange={(type) => setNewAttribute({
                                                ...newAttribute,
                                                type
                                            })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>Attribute Values</Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleAddValue}
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Value
                                            </Button>
                                        </div>
                                        
                                        <ScrollArea className="h-[200px]">
                                            <div className="space-y-2 pr-4">
                                                {newAttribute.values.map((value, index) => (
                                                    <AttributeValueInput
                                                        key={index}
                                                        value={value}
                                                        type={newAttribute.type}
                                                        onChange={(value) => handleUpdateValue(index, value)}
                                                        onRemove={() => handleRemoveValue(index)}
                                                    />
                                                ))}
                                            </div>
                                        </ScrollArea>
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
                                </div>
                            </TabsContent>

                            <TabsContent value="global" className="mt-4">
                                <div className="mb-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search attributes..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <ScrollArea className="h-[400px]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
                                        {filteredGlobalAttributes?.map((attribute) => (
                                            <GlobalAttributeCard
                                                key={attribute.id}
                                                attribute={attribute}
                                                isSelected={existingAttributeIds.includes(attribute.id)}
                                                onSelect={() => {
                                                    onAddGlobal(attribute.id.toString());
                                                    setShowNewDialog(false);
                                                }}
                                            />
                                        ))}

                                        {filteredGlobalAttributes?.length === 0 && (
                                            <div className="col-span-2 text-center py-8 text-muted-foreground">
                                                No attributes found matching your search
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>

                        <DialogFooter className="mt-6">
                            {activeTab === 'custom' && (
                                <>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => setShowNewDialog(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="button" onClick={handleSubmit}>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Attribute
                                    </Button>
                                </>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}; 