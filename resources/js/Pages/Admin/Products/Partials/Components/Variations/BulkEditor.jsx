import React, { useState } from 'react'
import { DollarSign, Package, Trash2, ChevronDown } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function BulkEditor({
  selectedVariations,
  variations,
  setVariations,
  setSelectedVariations
}) {
  const [bulkEditField, setBulkEditField] = useState('')
  const [bulkEditValue, setBulkEditValue] = useState('')

  const handleBulkEdit = () => {
    const updatedVariations = variations.map(variation => 
      selectedVariations.includes(variation.id)
        ? { ...variation, [bulkEditField]: bulkEditValue }
        : variation
    )
    setVariations(updatedVariations)
    setSelectedVariations([])
    setBulkEditField('')
    setBulkEditValue('')
  }

  const selectedCount = selectedVariations.length

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "flex items-center gap-2",
              selectedCount > 0 && "border-primary"
            )}
            disabled={selectedCount === 0}
          >
            <span>Bulk actions</span>
            {selectedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                {selectedCount}
              </span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem 
            onSelect={() => setBulkEditField('price')}
            className="flex items-center"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Set Regular Prices</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => setBulkEditField('stock')}
            className="flex items-center"
          >
            <Package className="mr-2 h-4 w-4" />
            <span>Set Stock</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive flex items-center" 
            onSelect={() => {
              setVariations(variations.filter(v => !selectedVariations.includes(v.id)))
              setSelectedVariations([])
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Selected</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Bulk Edit Dialog */}
      <Dialog 
        open={!!bulkEditField} 
        onOpenChange={() => setBulkEditField('')}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Bulk Edit {bulkEditField === 'price' ? 'Prices' : 'Stock'}
            </DialogTitle>
            <DialogDescription>
              Set {bulkEditField} for {selectedCount} selected variation{selectedCount !== 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                {bulkEditField === 'price' ? 'Regular Price' : 'Stock Quantity'}
              </Label>
              <Input
                type="number"
                value={bulkEditValue}
                onChange={(e) => setBulkEditValue(e.target.value)}
                placeholder={bulkEditField === 'price' ? '0.00' : '0'}
                step={bulkEditField === 'price' ? '0.01' : '1'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkEditField('')}>
              Cancel
            </Button>
            <Button onClick={handleBulkEdit}>
              Apply to {selectedCount} variation{selectedCount !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 