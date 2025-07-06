import React from 'react'
import { MoreVertical, Copy, Trash2, Edit, Upload, ArrowUpDown, ImageIcon } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Checkbox } from "@/Components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function VariationTable({
  variations,
  attributes,
  selectedVariations,
  setSelectedVariations,
  setVariations,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  readOnly = false
}) {
  const handleImageUpload = (variationId, file) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newVariations = variations.map(v =>
          v.id === variationId ? { ...v, thumbnail: reader.result } : v
        )
        setVariations(newVariations)
      }
      reader.readAsDataURL(file)
    }
  }

  // Helper function to get image URL
  const getImageUrl = (variation) => {
    if (!variation.thumbnail) return null
    // Handle both URL string and file object cases
    return typeof variation.thumbnail === 'string' 
      ? variation.thumbnail 
      : variation.thumbnail.url || variation.thumbnail
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={selectedVariations.length === variations.length}
              onCheckedChange={(checked) => {
                setSelectedVariations(checked
                  ? variations.map(v => v.id)
                  : []
                )
              }}
              disabled={readOnly}
            />
          </TableHead>
          <TableHead className="w-[100px]">Thumbnail</TableHead>
          {attributes.filter(a => a.variation).map((attr, index) => (
            <TableHead 
              key={index} 
              className="cursor-pointer" 
              onClick={() => onSort(attr.name)}
            >
              {attr.name}
              {sortField === attr.name && (
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              )}
            </TableHead>
          ))}
          <TableHead 
            className="cursor-pointer" 
            onClick={() => onSort('price')}
          >
            Price
            {sortField === 'price' && (
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            )}
          </TableHead>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => onSort('stock')}
          >
            Stock
            {sortField === 'stock' && (
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            )}
          </TableHead>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => onSort('sku')}
          >
            SKU
            {sortField === 'sku' && (
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            )}
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {variations.map((variation, index) => (
          <TableRow key={variation.id}>
            <TableCell>
              <Checkbox
                checked={selectedVariations.includes(variation.id)}
                onCheckedChange={(checked) => {
                  setSelectedVariations(
                    checked
                      ? [...selectedVariations, variation.id]
                      : selectedVariations.filter(id => id !== variation.id)
                  )
                }}
                disabled={readOnly}
              />
            </TableCell>
            <TableCell>
              {variation.thumbnail ? (
                <div className="w-16 h-16 relative group">
                  <img 
                    src={variation.thumbnail.url}
                    alt={variation.thumbnail.original_name || 'Variation thumbnail'} 
                    className="w-16 h-16 object-cover rounded-lg ring-1 ring-border"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </TableCell>
            {attributes.filter(a => a.variation).map((attr, attrIndex) => (
              <TableCell key={attrIndex}>{variation[attr.name]}</TableCell>
            ))}
            <TableCell>
              <Input
                type="number"
                value={variation.price}
                onChange={(e) => {
                  const newVariations = [...variations]
                  newVariations[index].price = e.target.value
                  setVariations(newVariations)
                }}
                className="w-20"
                disabled={readOnly}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={variation.stock}
                onChange={(e) => {
                  const newVariations = [...variations]
                  newVariations[index].stock = e.target.value
                  setVariations(newVariations)
                }}
                className="w-20"
                disabled={readOnly}
              />
            </TableCell>
            <TableCell>
              <Input
                value={variation.sku}
                onChange={(e) => {
                  const newVariations = [...variations]
                  newVariations[index].sku = e.target.value
                  setVariations(newVariations)
                }}
                className="w-32"
                disabled={readOnly}
              />
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onSelect={() => onEdit(variation)}
                    disabled={readOnly}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      const newVariation = { 
                        ...variation, 
                        id: Date.now(),
                        thumbnail: null // Reset thumbnail for new variation
                      };
                      setVariations([...variations, newVariation]);
                    }}
                    disabled={readOnly}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  {!readOnly && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setVariations(variations.filter(v => v.id !== variation.id));
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 