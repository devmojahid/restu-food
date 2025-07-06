import React, { useState, useEffect, useCallback } from 'react'
import { Plus, X, ImageIcon, Save, ChevronLeft, Settings2, MoreVertical, Copy, Trash2, DollarSign, Package, RefreshCw, AlertCircle, Upload, Search, ArrowUpDown, Calendar, Info, Edit } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Switch } from "@/Components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { Badge } from "@/Components/ui/badge"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Checkbox } from "@/Components/ui/checkbox"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Textarea } from "@/Components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export default function ProductVariations() {
  const [attributes, setAttributes] = useState([])
  const [variations, setVariations] = useState([])
  const [showAddAttribute, setShowAddAttribute] = useState(false)
  const [newAttribute, setNewAttribute] = useState({ name: '', values: [], variation: true })
  const [showManualAdd, setShowManualAdd] = useState(false)
  const [manualVariation, setManualVariation] = useState({})
  const [selectedVariations, setSelectedVariations] = useState([])
  const [bulkEditField, setBulkEditField] = useState('')
  const [bulkEditValue, setBulkEditValue] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')
  const [editingVariation, setEditingVariation] = useState(null)
  const [showSchedule, setShowSchedule] = useState(false)

  const generateVariations = useCallback(() => {
    if (attributes.length === 0) return

    const combinations = attributes.reduce((acc, attr) => {
      if (!attr.variation) return acc
      const values = attr.values
      if (acc.length === 0) {
        return values.map(value => ({ [attr.name]: value }))
      }
      return acc.flatMap(combo => 
        values.map(value => ({ ...combo, [attr.name]: value }))
      )
    }, [])

    const newVariations = combinations.map((combo, index) => {
      const existingVariation = variations.find(v => 
        Object.entries(combo).every(([key, value]) => v[key] === value)
      )
      return {
        id: existingVariation?.id || Date.now() + index,
        ...combo,
        sku: existingVariation?.sku || '',
        price: existingVariation?.price || '',
        sale_price: existingVariation?.sale_price || '',
        stock: existingVariation?.stock || 0,
        enabled: existingVariation?.enabled ?? true,
        virtual: existingVariation?.virtual || false,
        downloadable: existingVariation?.downloadable || false,
        manage_stock: existingVariation?.manage_stock ?? true,
        weight: existingVariation?.weight || '',
        dimensions: existingVariation?.dimensions || { length: '', width: '', height: '' },
        image: existingVariation?.image || null
      }
    })

    setVariations(newVariations)
  }, [attributes, variations])

  const addAttribute = () => {
    if (!newAttribute.name || newAttribute.values.length === 0) return

    setAttributes([...attributes, { ...newAttribute, variation: true }])
    setNewAttribute({ name: '', values: [], variation: true })
    setShowAddAttribute(false)
  }

  const updateAttribute = (index, field, value) => {
    const newAttributes = [...attributes]
    newAttributes[index] = { ...newAttributes[index], [field]: value }
    setAttributes(newAttributes)
  }

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index))
  }

  const addAttributeValue = (value) => {
    if (value && !newAttribute.values.includes(value)) {
      setNewAttribute({
        ...newAttribute,
        values: [...newAttribute.values, value]
      })
    }
  }

  const removeAttributeValue = (index) => {
    setNewAttribute({
      ...newAttribute,
      values: newAttribute.values.filter((_, i) => i !== index)
    })
  }

  const addManualVariation = () => {
    const newVariation = {
      id: Date.now(),
      ...manualVariation,
      enabled: true,
      virtual: false,
      downloadable: false,
      manage_stock: true,
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      image: null
    }
    setVariations([...variations, newVariation])
    setManualVariation({})
    setShowManualAdd(false)
  }

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

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(attributes)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setAttributes(items)
  }

  const filteredVariations = variations
    .filter(variation => 
      Object.values(variation).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const VariationEditForm = ({ variation, onSave, onCancel }) => {
    const [formData, setFormData] = useState(variation)

    return (
      <div className="space-y-6">
        <div className="flex items-start gap-6 flex-wrap md:flex-nowrap">
          <div className="w-full md:w-[150px] h-[150px] bg-muted rounded-lg flex items-center justify-center relative group">
            {formData.image ? (
              <img 
                src={formData.image} 
                alt="Variation" 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <label htmlFor="variation-image" className="cursor-pointer">
                <Upload className="h-8 w-8 text-white" />
              </label>
              <input
                id="variation-image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setFormData({ ...formData, image: reader.result })
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />
            </div>
          </div>
          
          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  SKU
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 ml-1 inline-block text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Stock Keeping Unit - A unique identifier for this variation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Enter SKU"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  GTIN/UPC/EAN/ISBN
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 ml-1 inline-block text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Global Trade Item Number or similar product identifier</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  value={formData.gtin}
                  onChange={(e) => setFormData({ ...formData, gtin: e.target.value })}
                  placeholder="Enter identifier"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                />
                <Label htmlFor="enabled">Enabled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="downloadable"
                  checked={formData.downloadable}
                  onCheckedChange={(checked) => setFormData({ ...formData, downloadable: checked })}
                />
                <Label htmlFor="downloadable">Downloadable</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="virtual"
                  checked={formData.virtual}
                  onCheckedChange={(checked) => setFormData({ ...formData, virtual: checked })}
                />
                <Label htmlFor="virtual">Virtual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manage_stock"
                  checked={formData.manage_stock}
                  onCheckedChange={(checked) => setFormData({ ...formData, manage_stock: checked })}
                />
                <Label htmlFor="manage_stock">Manage stock?</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Regular price ($)</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Sale price ($)</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setShowSchedule(!showSchedule)}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Schedule
              </Button>
            </div>
            <Input
              type="number"
              value={formData.sale_price}
              onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
              placeholder="0.00"
            />
            {showSchedule && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label className="text-sm">Sale start date</Label>
                  <Input type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Sale end date</Label>
                  <Input type="datetime-local" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Stock status</Label>
            <Select
              value={formData.stock_status}
              onValueChange={(value) => setFormData({ ...formData, stock_status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instock">In stock</SelectItem>
                <SelectItem value="outofstock">Out of stock</SelectItem>
                <SelectItem value="onbackorder">On backorder</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            <Input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Dimensions (cm)</Label>
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Length"
              value={formData.dimensions.length}
              onChange={(e) => setFormData({
                ...formData,
                dimensions: { ...formData.dimensions, length: e.target.value }
              })}
            />
            <Input
              placeholder="Width"
              value={formData.dimensions.width}
              onChange={(e) => setFormData({
                ...formData,
                dimensions: { ...formData.dimensions, width: e.target.value }
              })}
            />
            <Input
              placeholder="Height"
              value={formData.dimensions.height}
              onChange={(e) => setFormData({
                ...formData,
                dimensions: { ...formData.dimensions, height: e.target.value }
              })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Shipping class</Label>
          <Select
            value={formData.shipping_class}
            onValueChange={(value) => setFormData({ ...formData, shipping_class: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="same_as_parent">Same as parent</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="express">Express</SelectItem>
              <SelectItem value="free">Free shipping</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter variation description"
            className="min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>
            Save Changes
          </Button>
        </DialogFooter>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Variations</CardTitle>
          <CardDescription>Manage your product attributes and variations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="attributes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
              <TabsTrigger value="variations">Variations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="attributes">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Product Attributes</h3>
                  <Button onClick={() => setShowAddAttribute(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Attribute
                  </Button>
                </div>
                {attributes.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No attributes added yet. Click the "Add Attribute" button to create your first attribute.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="attributes">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {attributes.map((attr, index) => (
                            <Draggable key={attr.name} draggableId={attr.name} index={index}>
                              {(provided) => (
                                <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="mb-4">
                                  <CardHeader>
                                    <div className="flex justify-between items-center">
                                      <CardTitle>{attr.name}</CardTitle>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeAttribute(index)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                      {attr.values.map((value, vIndex) => (
                                        <Badge key={vIndex} variant="secondary">
                                          {value}
                                        </Badge>
                                      ))}
                                    </div>
                                    <div className="flex items-center mt-4">
                                      <Checkbox
                                        id={`variation-${index}`}
                                        checked={attr.variation}
                                        onCheckedChange={(checked) => updateAttribute(index, 'variation', checked)}
                                      />
                                      <Label htmlFor={`variation-${index}`} className="ml-2">
                                        Used for variations
                                      </Label>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="variations">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Product Variations</h3>
                  <div className="flex gap-2">
                    <Button onClick={generateVariations}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate variations
                    </Button>
                    <Button variant="outline" onClick={() => setShowManualAdd(true)}>
                      Add manually
                    </Button>
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
                        <DropdownMenuItem className="text-destructive" onSelect={() => {
                          setVariations(variations.filter(v => !selectedVariations.includes(v.id)))
                          setSelectedVariations([])
                        }}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Selected
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {variations.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No variations yet. Add attributes and click "Regenerate variations" to create them automatically, or click "Add manually" to create them one by one.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Card>
                    <CardContent className="p-0">
                      <div className="p-4 border-b">
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Search variations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                          />
                          <Button variant="outline" className="shrink-0">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </Button>
                        </div>
                      </div>
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
                              />
                            </TableHead>
                            <TableHead className="w-[100px]">Image</TableHead>
                            {attributes.filter(a => a.variation).map((attr, index) => (
                              <TableHead key={index} className="cursor-pointer" onClick={() => handleSort(attr.name)}>
                                {attr.name}
                                {sortField === attr.name && (
                                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                                )}
                              </TableHead>
                            ))}
                            <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>
                              Price
                              {sortField === 'price' && (
                                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                              )}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('stock')}>
                              Stock
                              {sortField === 'stock' && (
                                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                              )}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('sku')}>
                              SKU
                              {sortField === 'sku' && (
                                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                              )}
                            </TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredVariations.map((variation, index) => (
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
                                />
                              </TableCell>
                              <TableCell>
                                {variation.image ? (
                                  <img src={variation.image} alt="Variation" className="w-16 h-16 object-cover rounded" />
                                ) : (
                                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                    <ImageIcon className="h-8 w-8 text-gray-400" />
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
                                    <DropdownMenuItem onSelect={() => setEditingVariation(variation)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                      const newVariation = { ...variation, id: Date.now() }
                                      setVariations([...variations, newVariation])
                                    }}>
                                      <Copy className="mr-2 h-4 w-4" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <label htmlFor={`image-upload-${variation.id}`} className="cursor-pointer flex items-center">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Image
                                      </label>
                                      <input
                                        id={`image-upload-${variation.id}`}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files[0]
                                          if (file) {
                                            const reader = new FileReader()
                                            reader.onloadend = () => {
                                              const newVariations = [...variations]
                                              newVariations[index].image = reader.result
                                              setVariations(newVariations)
                                            }
                                            reader.readAsDataURL(file)
                                          }
                                        }}
                                      />
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => {
                                        setVariations(variations.filter(v => v.id !== variation.id))
                                      }}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Attribute Dialog */}
      <Dialog open={showAddAttribute} onOpenChange={setShowAddAttribute}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Attribute</DialogTitle>
            <DialogDescription>
              Create a new attribute and add its values
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Attribute Name</Label>
              <Input
                placeholder="e.g., Size, Color, Material"
                value={newAttribute.name}
                onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Values</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newAttribute.values.map((value, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {value}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() => removeAttributeValue(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a value"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addAttributeValue(e.target.value)
                      e.target.value = ''
                    }
                  }}
                />
                <Button onClick={() => {
                  const input = document.querySelector('input[placeholder="Type a value"]')
                  if (input) {
                    addAttributeValue(input.value)
                    input.value = ''
                  }
                }}>
                  Add
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAttribute(false)}>
              Cancel
            </Button>
            <Button onClick={addAttribute}>Add Attribute</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Manual Variation Dialog */}
      <Dialog open={showManualAdd} onOpenChange={setShowManualAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Manual Variation</DialogTitle>
            <DialogDescription>
              Create a new variation by selecting values for each attribute
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {attributes.filter(a => a.variation).map((attr, index) => (
              <div key={index} className="space-y-2">
                <Label>{attr.name}</Label>
                <Select
                  value={manualVariation[attr.name] || ''}
                  onValueChange={(value) => 
                    setManualVariation({ ...manualVariation, [attr.name]: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${attr.name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {attr.values.map((value, vIndex) => (
                      <SelectItem key={vIndex} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  value={manualVariation.price || ''}
                  onChange={(e) => 
                    setManualVariation({ ...manualVariation, price: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={manualVariation.stock || ''}
                  onChange={(e) => 
                    setManualVariation({ ...manualVariation, stock: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManualAdd(false)}>
              Cancel
            </Button>
            <Button onClick={addManualVariation}>Add Variation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* Variation Edit Dialog */}
      <Dialog open={!!editingVariation} onOpenChange={(open) => !open && setEditingVariation(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Variation</DialogTitle>
            <DialogDescription>
              Modify the details for this product variation
            </DialogDescription>
          </DialogHeader>
          
          {editingVariation && (
            <VariationEditForm
              variation={editingVariation}
              onSave={(formData) => {
                const newVariations = variations.map(v =>
                  v.id === editingVariation.id ? { ...v, ...formData } : v
                )
                setVariations(newVariations)
                setEditingVariation(null)
              }}
              onCancel={() => setEditingVariation(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}