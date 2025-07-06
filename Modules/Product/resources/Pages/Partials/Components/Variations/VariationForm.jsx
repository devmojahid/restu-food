import React, { useState } from 'react'
import { Calendar, Check, ImageIcon, Info, Upload, X, DollarSign, Package, Box, Tag, Plus, Scale, FileText } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Checkbox } from "@/Components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Textarea } from "@/Components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/Components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/Components/ui/card"
import { Separator } from "@/Components/ui/separator"
import { cn } from "@/lib/utils"
import FileUploader from "@/Components/Admin/Filesystem/FileUploader"

const FILE_COLLECTIONS = {
  THUMBNAIL: {
    name: "thumbnail",
    maxFiles: 1,
    fileType: "image",
    title: "Variation Image",
    description: "Upload a variation image (recommended size: 800x800px)",
  }
};

export default function VariationForm({
  variation = {},
  attributes = [],
  onSave,
  onCancel,
  readOnly = false
}) {
  const [formData, setFormData] = useState({
    ...variation,
    dimensions: variation.dimensions || { length: '', width: '', height: '' },
    thumbnail: variation.thumbnail || null
  })
  const [showSchedule, setShowSchedule] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const handleFileUpload = (files) => {
    const thumbnail = Array.isArray(files) ? files[0] : files;
    
    setFormData(prevData => {
      const newData = {
        ...prevData,
        thumbnail: thumbnail
      };
      return newData;
    });
  };

  const handleSave = () => {
    const thumbnailData = formData.thumbnail ? {
      id: formData.thumbnail.id,
      uuid: formData.thumbnail.uuid,
      url: formData.thumbnail.url,
      original_name: formData.thumbnail.original_name,
      collection_name: 'thumbnail'
    } : null;

    const dataToSave = {
      id: formData.id,
      sku: formData.sku || '',
      price: formData.price || '',
      sale_price: formData.sale_price || '',
      stock: formData.stock || 0,
      enabled: formData.enabled ?? true,
      virtual: formData.virtual ?? false,
      downloadable: formData.downloadable ?? false,
      manage_stock: formData.manage_stock ?? true,
      weight: formData.weight || '',
      dimensions: {
        length: formData.dimensions?.length || '',
        width: formData.dimensions?.width || '',
        height: formData.dimensions?.height || ''
      },
      thumbnail: thumbnailData,
      ...attributes.filter(a => a.variation).reduce((acc, attr) => ({
        ...acc,
        [attr.name]: formData[attr.name] || ''
      }), {})
    };

    onSave(dataToSave);
  };

  return (
    <Dialog 
      open={true} 
      onOpenChange={(open) => {
        if (!open) onCancel()
      }}
    >
      <DialogContent 
        className={cn(
          "p-0 gap-0",
          "w-full h-full md:h-auto",
          "max-w-[95vw] max-h-[100vh] md:max-h-[90vh] md:max-w-[85vw] lg:max-w-[75vw]",
          "rounded-none md:rounded-lg",
        )}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col h-[100vh] md:h-[calc(90vh-2rem)]">
          {/* Enhanced Header for Mobile */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-background sticky top-0 z-20">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold flex items-center gap-2 pr-8">
              {variation.id ? (
                <>
                  <Tag className="h-5 w-5 md:h-6 md:w-6" />
                  Edit Variation
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 md:h-6 md:w-6" />
                  Add New Variation
                </>
              )}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm">
              {variation.id 
                ? 'Modify the details for this product variation'
                : 'Create a new product variation with specific attributes and pricing'
              }
            </DialogDescription>
          </div>

          {/* Enhanced Tab Navigation for Mobile */}
          <div className="px-4 sm:px-6 py-2 sm:py-3 border-b bg-background sticky top-[60px] sm:top-[73px] z-10">
            <ScrollArea className="w-full" orientation="horizontal">
              <nav className="flex justify-start sm:justify-center min-w-full">
                <div className="inline-flex items-center justify-start sm:justify-center rounded-lg bg-muted p-1 text-muted-foreground">
                  {[
                    { id: 'basic', label: 'Basic Info', icon: Box },
                    { id: 'pricing', label: 'Pricing', icon: DollarSign },
                    { id: 'shipping', label: 'Shipping', icon: Package }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "inline-flex items-center justify-center gap-1.5 rounded-md px-3 sm:px-4 py-2 text-sm font-medium transition-all whitespace-nowrap",
                        "hover:bg-background/50",
                        activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
                      )}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="hidden xs:inline">{tab.label}</span>
                      <span className="xs:hidden">{tab.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </nav>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
          </div>

          {/* Enhanced Content Area for Mobile */}
          <ScrollArea 
            className="flex-1 overflow-y-auto"
            type="always"
          >
            <div className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
                {/* Basic Info Tab */}
                <div className={cn("space-y-6", activeTab !== 'basic' && "hidden")}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Image Upload Section */}
                    <Card className="lg:col-span-4 bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          Variation Image
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FileUploader
                          fileType="image"
                          maxFiles={1}
                          collection={FILE_COLLECTIONS.THUMBNAIL.name}
                          value={formData.thumbnail}
                          onUpload={handleFileUpload}
                          description={FILE_COLLECTIONS.THUMBNAIL.description}
                          disabled={readOnly}
                        />
                      </CardContent>
                    </Card>

                    {/* Main Form Fields */}
                    <div className="lg:col-span-8 space-y-6">
                      {/* Attribute selections */}
                      {!variation.id && attributes.filter(a => a.variation).map((attr, index) => (
                        <div key={index} className="space-y-2">
                          <Label className="font-medium">{attr.name}</Label>
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* SKU Field */}
                        <div className="space-y-2">
                          <Label className="font-medium flex items-center gap-1">
                            SKU
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Stock Keeping Unit - A unique identifier</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <Input
                            value={formData.sku || ''}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            placeholder="Enter SKU"
                            disabled={readOnly}
                            className="font-mono"
                          />
                        </div>

                        {/* Stock Field */}
                        <div className="space-y-2">
                          <Label className="font-medium">Stock</Label>
                          <Input
                            type="number"
                            value={formData.stock || ''}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            placeholder="Enter stock quantity"
                            disabled={readOnly}
                          />
                        </div>
                      </div>

                      {/* Options Card */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                              { id: 'enabled', label: 'Enabled' },
                              { id: 'downloadable', label: 'Downloadable' },
                              { id: 'virtual', label: 'Virtual' },
                              { id: 'manage_stock', label: 'Manage stock' }
                            ].map((option) => (
                              <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={option.id}
                                  checked={formData[option.id]}
                                  onCheckedChange={(checked) => 
                                    setFormData({ ...formData, [option.id]: checked })
                                  }
                                  disabled={readOnly}
                                />
                                <Label 
                                  htmlFor={option.id}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Description moved to Basic Info tab only */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter variation description"
                        className="min-h-[100px]"
                        disabled={readOnly}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Pricing Tab */}
                <div className={cn("space-y-6", activeTab !== 'pricing' && "hidden")}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Pricing Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="font-medium">Regular Price</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              step="0.01"
                              value={formData.price || ''}
                              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                              className="pl-9"
                              placeholder="0.00"
                              disabled={readOnly}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="font-medium">Sale Price</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              step="0.01"
                              value={formData.sale_price || ''}
                              onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                              className="pl-9"
                              placeholder="0.00"
                              disabled={readOnly}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">Schedule Sale</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSchedule(!showSchedule)}
                            type="button"
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            {showSchedule ? 'Hide Schedule' : 'Set Schedule'}
                          </Button>
                        </div>
                        
                        {showSchedule && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                              <Label>Sale Start Date</Label>
                              <Input
                                type="datetime-local"
                                value={formData.sale_price_from || ''}
                                onChange={(e) => setFormData({ ...formData, sale_price_from: e.target.value })}
                                disabled={readOnly}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Sale End Date</Label>
                              <Input
                                type="datetime-local"
                                value={formData.sale_price_to || ''}
                                onChange={(e) => setFormData({ ...formData, sale_price_to: e.target.value })}
                                disabled={readOnly}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Shipping Tab */}
                <div className={cn("space-y-6", activeTab !== 'shipping' && "hidden")}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Shipping Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4 text-muted-foreground" />
                          <Label className="font-medium">Weight & Dimensions</Label>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Weight (kg)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={formData.weight || ''}
                              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                              placeholder="0.00"
                              disabled={readOnly}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Length (cm)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={formData.dimensions?.length || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                dimensions: { ...formData.dimensions, length: e.target.value }
                              })}
                              placeholder="0.00"
                              disabled={readOnly}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Width (cm)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={formData.dimensions?.width || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                dimensions: { ...formData.dimensions, width: e.target.value }
                              })}
                              placeholder="0.00"
                              disabled={readOnly}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Height (cm)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={formData.dimensions?.height || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                dimensions: { ...formData.dimensions, height: e.target.value }
                              })}
                              placeholder="0.00"
                              disabled={readOnly}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            <ScrollBar />
          </ScrollArea>

          {/* Enhanced Footer for Mobile */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t bg-background mt-auto">
            <div className="flex items-center justify-end gap-2 sm:gap-3 max-w-5xl mx-auto">
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="min-w-[80px] sm:min-w-[100px] h-9 sm:h-10 text-sm"
              >
                <X className="h-4 w-4 mr-1.5 sm:mr-2" />
                Cancel
              </Button>
              {!readOnly && (
                <Button 
                  onClick={handleSave}
                  className="min-w-[100px] sm:min-w-[120px] h-9 sm:h-10 text-sm"
                >
                  <Check className="h-4 w-4 mr-1.5 sm:mr-2" />
                  {variation.id ? 'Save Changes' : 'Add Variation'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
