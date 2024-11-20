import React from 'react';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/Components/ui/sheet";
import { Settings2 } from "lucide-react";

const BulkActions = ({ 
  selectedCount, 
  onBulkUpdate, 
  basePrice,
  onClose 
}) => {
  const [values, setValues] = React.useState({
    price: '',
    stock: '',
    weight: '',
    length: '',
    width: '',
    height: '',
  });

  const handleApply = () => {
    const updates = Object.entries(values)
      .filter(([_, value]) => value !== '')
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value
      }), {});

    onBulkUpdate(updates);
    setValues({
      price: '',
      stock: '',
      weight: '',
      length: '',
      width: '',
      height: '',
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="w-4 h-4" />
          Bulk Update ({selectedCount})
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Bulk Update Variations</SheetTitle>
          <SheetDescription>
            Update multiple variations at once. Leave fields empty to keep existing values.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Price</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={values.price}
                onChange={(e) => setValues({ ...values, price: e.target.value })}
                placeholder={`Base price: ${basePrice}`}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setValues({ ...values, price: basePrice })}
              >
                Use Base
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Stock Quantity</Label>
            <Input
              type="number"
              value={values.stock}
              onChange={(e) => setValues({ ...values, stock: e.target.value })}
              placeholder="Enter stock quantity"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                step="0.01"
                value={values.weight}
                onChange={(e) => setValues({ ...values, weight: e.target.value })}
                placeholder="Enter weight"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Length (cm)</Label>
              <Input
                type="number"
                step="0.01"
                value={values.length}
                onChange={(e) => setValues({ ...values, length: e.target.value })}
                placeholder="Length"
              />
            </div>
            <div className="space-y-2">
              <Label>Width (cm)</Label>
              <Input
                type="number"
                step="0.01"
                value={values.width}
                onChange={(e) => setValues({ ...values, width: e.target.value })}
                placeholder="Width"
              />
            </div>
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input
                type="number"
                step="0.01"
                value={values.height}
                onChange={(e) => setValues({ ...values, height: e.target.value })}
                placeholder="Height"
              />
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply to {selectedCount} variations
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BulkActions; 