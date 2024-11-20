import React, { useState } from 'react'
import { Calendar, Check, ImageIcon, Info, Upload } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Checkbox } from "@/Components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Textarea } from "@/Components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Badge } from "@/Components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip"

export default function VariationForm({
  variation = {},
  attributes = [],
  onSave,
  onCancel,
  readOnly = false
}) {
  const [formData, setFormData] = useState(variation)
  const [showSchedule, setShowSchedule] = useState(false)

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {variation.id ? 'Edit Variation' : 'Add New Variation'}
          </DialogTitle>
          <DialogDescription>
            {variation.id 
              ? 'Modify the details for this product variation'
              : 'Create a new product variation'
            }
          </DialogDescription>
        </DialogHeader>

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
              {!readOnly && (
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
              )}
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              {/* Attribute selections for manual add */}
              {!variation.id && attributes.filter(a => a.variation).map((attr, index) => (
                <div key={index} className="space-y-2">
                  <Label>{attr.name}</Label>
                  <Select
                    value={formData[attr.name] || ''}
                    onValueChange={(value) => 
                      setFormData({ ...formData, [attr.name]: value })
                    }
                    disabled={readOnly}
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
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Enter SKU"
                    disabled={readOnly}
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
                    value={formData.gtin || ''}
                    onChange={(e) => setFormData({ ...formData, gtin: e.target.value })}
                    placeholder="Enter identifier"
                    disabled={readOnly}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enabled"
                    checked={formData.enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                    disabled={readOnly}
                  />
                  <Label htmlFor="enabled">Enabled</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="downloadable"
                    checked={formData.downloadable}
                    onCheckedChange={(checked) => setFormData({ ...formData, downloadable: checked })}
                    disabled={readOnly}
                  />
                  <Label htmlFor="downloadable">Downloadable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="virtual"
                    checked={formData.virtual}
                    onCheckedChange={(checked) => setFormData({ ...formData, virtual: checked })}
                    disabled={readOnly}
                  />
                  <Label htmlFor="virtual">Virtual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manage_stock"
                    checked={formData.manage_stock}
                    onCheckedChange={(checked) => setFormData({ ...formData, manage_stock: checked })}
                    disabled={readOnly}
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
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Sale price ($)</Label>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setShowSchedule(!showSchedule)}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule
                  </Button>
                )}
              </div>
              <Input
                type="number"
                value={formData.sale_price || ''}
                onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                placeholder="0.00"
                disabled={readOnly}
              />
              {showSchedule && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label className="text-sm">Sale start date</Label>
                    <Input 
                      type="datetime-local" 
                      disabled={readOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Sale end date</Label>
                    <Input 
                      type="datetime-local"
                      disabled={readOnly}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Stock status</Label>
              <Select
                value={formData.stock_status || 'instock'}
                onValueChange={(value) => setFormData({ ...formData, stock_status: value })}
                disabled={readOnly}
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
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="0.00"
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dimensions (cm)</Label>
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Length"
                value={formData.dimensions?.length || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  dimensions: { ...formData.dimensions, length: e.target.value }
                })}
                disabled={readOnly}
              />
              <Input
                placeholder="Width"
                value={formData.dimensions?.width || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  dimensions: { ...formData.dimensions, width: e.target.value }
                })}
                disabled={readOnly}
              />
              <Input
                placeholder="Height"
                value={formData.dimensions?.height || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  dimensions: { ...formData.dimensions, height: e.target.value }
                })}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Shipping class</Label>
            <Select
              value={formData.shipping_class || 'same_as_parent'}
              onValueChange={(value) => setFormData({ ...formData, shipping_class: value })}
              disabled={readOnly}
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
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter variation description"
              className="min-h-[100px]"
              disabled={readOnly}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {!readOnly && (
            <Button onClick={() => onSave(formData)}>
              {variation.id ? 'Save Changes' : 'Add Variation'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}