import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Badge } from "@/Components/ui/badge";
import { Switch } from "@/Components/ui/switch";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, Copy, Eye } from "lucide-react";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";

const VariationsTable = ({
  variations,
  onUpdate,
  bulkEditMode,
  selectedVariations,
  onSelectVariation,
}) => {
  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectVariation(variations.map((_, index) => index));
    } else {
      onSelectVariation([]);
    }
  };

  const handleSelectVariation = (index) => {
    onSelectVariation(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {bulkEditMode && (
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectedVariations.length === variations.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}
            <TableHead>Variation</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Images</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variations.map((variation, index) => (
            <TableRow 
              key={index}
              className={cn(
                "group hover:bg-muted/50 transition-colors",
                selectedVariations.includes(index) && "bg-primary/5"
              )}
            >
              {bulkEditMode && (
                <TableCell>
                  <Checkbox 
                    checked={selectedVariations.includes(index)}
                    onCheckedChange={() => handleSelectVariation(index)}
                  />
                </TableCell>
              )}
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {variation.attributes.map((attr, idx) => (
                    <Badge key={idx} variant="outline">
                      {attr.name}: {attr.value}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={variation.price}
                  onChange={(e) => onUpdate(index, 'price', e.target.value)}
                  className="w-24"
                  step="0.01"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={variation.stock_quantity}
                  onChange={(e) => onUpdate(index, 'stock_quantity', e.target.value)}
                  className="w-24"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={variation.sku}
                  onChange={(e) => onUpdate(index, 'sku', e.target.value)}
                  className="w-32"
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={variation.is_active}
                  onCheckedChange={(checked) => onUpdate(index, 'is_active', checked)}
                  className="data-[state=checked]:bg-green-500"
                />
              </TableCell>
              <TableCell>
                <FileUploader
                  maxFiles={1}
                  fileType="image"
                  collection={`variation_${index}_image`}
                  value={variation.images}
                  onUpload={(files) => onUpdate(index, 'images', files)}
                  compact
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Duplicate variation
                      const newVariation = { ...variation };
                      newVariation.sku = `${variation.sku}-copy`;
                      onUpdate(variations.length, 'add', newVariation);
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Preview variation
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onUpdate(index, 'delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VariationsTable; 