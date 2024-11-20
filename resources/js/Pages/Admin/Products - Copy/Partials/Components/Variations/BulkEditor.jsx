import React, { useState } from 'react'
import { DollarSign, Package, Trash2 } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"

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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Bulk actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setBulkEditField('price')}>
            <DollarSign className="mr-2 h-4 w-4" />
            Set Regular Prices
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setBulkEditField('stock')}>
            <Package className="mr-2 h-4 w-4" />
            Set Stock
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive" 
            onSelect={() => {
              setVariations(variations.filter(v => !selectedVariations.includes(v.id)))
              setSelectedVariations([])
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Bulk Edit Dialog */}
      {bulkEditField && (
        <Dialog open={true} onOpenChange={() => setBulkEditField('')}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bulk Edit {bulkEditField}</DialogTitle>
              <DialogDescription>
                Set {bulkEditField} for all selected variations
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{bulkEditField}</Label>
                <Input
                  type={bulkEditField === 'price' || bulkEditField === 'stock' ? 'number' : 'text'}
                  value={bulkEditValue}
                  onChange={(e) => setBulkEditValue(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBulkEditField('')}>
                Cancel
              </Button>
              <Button onClick={handleBulkEdit}>Apply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
} 