import React, { useState } from 'react';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Plus, X, Move, Save } from "lucide-react";
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

const AttributeValueInput = ({ value, onChange, onRemove }) => (
  <div className="flex items-center gap-2 group animate-in fade-in-0 duration-200">
    <div className="flex-1 flex items-center gap-2 p-2 rounded-lg border bg-white dark:bg-gray-800">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter value"
        className="border-0 focus-visible:ring-0 p-0 text-sm"
      />
    </div>
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onRemove}
      className="opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <X className="w-4 h-4" />
    </Button>
  </div>
);

export const AttributeActions = ({ 
  globalAttributes, 
  onAddGlobal, 
  onAddLocal,
  existingAttributeIds = [] 
}) => {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('custom'); // 'custom' or 'global'
  const [newAttribute, setNewAttribute] = useState({
    name: '',
    values: [''], // Initialize with one empty value
    type: 'select',
    isCustom: true,
    visible: true,
    variation: true,
  });

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
    if (newAttribute.values.length === 1) return; // Keep at least one value
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
    <div className="flex justify-between items-center">
      <Label className="text-lg font-semibold">Product Attributes</Label>
      <Dialog 
        open={showNewDialog} 
        onOpenChange={setShowNewDialog}
        modal={true}
      >
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Attribute
          </Button>
        </DialogTrigger>
        <DialogContent 
          className="max-w-2xl"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Add Product Attribute</DialogTitle>
            <DialogDescription>
              Create a new attribute or select from existing global attributes
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="custom" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="custom">Custom Attribute</TabsTrigger>
              <TabsTrigger value="global">Global Attributes</TabsTrigger>
            </TabsList>

            <TabsContent value="custom" className="space-y-4 mt-4">
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

                  <div className="space-y-2">
                    <Label>Attribute Type</Label>
                    <Select
                      value={newAttribute.type}
                      onValueChange={(value) => setNewAttribute({
                        ...newAttribute,
                        type: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="select">Dropdown Select</SelectItem>
                        <SelectItem value="color">Color Swatch</SelectItem>
                        <SelectItem value="button">Button</SelectItem>
                        <SelectItem value="radio">Radio Button</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
                  {globalAttributes?.map((attribute) => (
                    <div
                      key={attribute.id}
                      className={cn(
                        "p-4 rounded-lg border hover:bg-accent cursor-pointer transition-all",
                        "group relative overflow-hidden",
                        existingAttributeIds.includes(attribute.id) && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => {
                        if (!existingAttributeIds.includes(attribute.id)) {
                          onAddGlobal(attribute.id.toString());
                          setShowNewDialog(false);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{attribute.name}</h4>
                        <Badge>{attribute.type}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {attribute.values.map((value, index) => (
                          <Badge key={index} variant="secondary">
                            {value.label || value.value}
                          </Badge>
                        ))}
                      </div>
                      {existingAttributeIds.includes(attribute.id) && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <Badge variant="secondary">Already Added</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            {activeTab === 'custom' && (
              <>
                <Button type="button" variant="outline" onClick={() => setShowNewDialog(false)}>
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
  );
}; 