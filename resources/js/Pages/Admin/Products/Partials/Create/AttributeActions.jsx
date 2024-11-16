import React, { useState } from 'react';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";

export const AttributeActions = ({ 
  globalAttributes, 
  onAddGlobal, 
  onAddLocal,
  existingAttributeIds = [] 
}) => {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newAttribute, setNewAttribute] = useState({
    name: '',
    values: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAttribute.name || !newAttribute.values) {
      toast.error("Please fill in all fields");
      return;
    }

    onAddLocal({
      id: `local-${Date.now()}`,
      name: newAttribute.name,
      values: newAttribute.values.split(',').map(v => v.trim()),
      type: 'select',
      isCustom: true,
      visible: true,
      variation: true,
    });

    setNewAttribute({ name: '', values: '' });
    setShowNewDialog(false);
  };

  const availableGlobalAttributes = globalAttributes?.filter(
    attr => !existingAttributeIds.includes(attr.id)
  );

  return (
    <div className="flex justify-between items-center">
      <Label className="text-lg font-semibold">Product Attributes</Label>
      <div className="flex gap-2">
        {availableGlobalAttributes?.length > 0 && (
          <Select
            value=""
            onValueChange={onAddGlobal}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Add existing attribute" />
            </SelectTrigger>
            <SelectContent>
              {availableGlobalAttributes.map((attribute) => (
                <SelectItem 
                  key={attribute.id} 
                  value={attribute.id.toString()}
                >
                  {attribute.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Attribute</DialogTitle>
              <DialogDescription>
                Create a new attribute specific to this product
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label>Attribute Values</Label>
                <Input
                  value={newAttribute.values}
                  onChange={(e) => setNewAttribute({
                    ...newAttribute,
                    values: e.target.value
                  })}
                  placeholder="Enter values separated by commas"
                />
                <p className="text-sm text-muted-foreground">
                  Enter multiple values separated by commas (e.g., Small, Medium, Large)
                </p>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowNewDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Attribute</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}; 