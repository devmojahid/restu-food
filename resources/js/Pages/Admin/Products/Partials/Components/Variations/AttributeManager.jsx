import React, { useState } from 'react'
import { Plus, X, AlertCircle, Pencil, Check } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Switch } from "@/Components/ui/switch"
import { Badge } from "@/Components/ui/badge"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { cn } from "@/lib/utils"

const DroppableComponent = React.memo(function DroppableComponent({ children, droppableId }) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => children(provided)}
    </Droppable>
  );
});

export default function AttributeManager({ 
  attributes, 
  setAttributes,
  globalAttributes = [],
  readOnly = false 
}) {
  const [showAddAttribute, setShowAddAttribute] = useState(false)
  const [newAttribute, setNewAttribute] = useState({ name: '', values: [], variation: true })
  const [selectedTab, setSelectedTab] = useState('new')
  const [selectedGlobalAttribute, setSelectedGlobalAttribute] = useState(null)
  const [selectedValues, setSelectedValues] = useState([])
  const [editingAttributeIndex, setEditingAttributeIndex] = useState(null)

  const addAttribute = () => {
    if (selectedTab === 'new') {
      if (!newAttribute.name || newAttribute.values.length === 0) return

      setAttributes([...attributes, { ...newAttribute, variation: true }])
      setNewAttribute({ name: '', values: [], variation: true })
    } else {
      if (!selectedGlobalAttribute || selectedValues.length === 0) return

      const globalAttr = globalAttributes.find(attr => attr.id === selectedGlobalAttribute)
      if (!globalAttr) return

      setAttributes([...attributes, {
        name: globalAttr.name,
        values: selectedValues,
        variation: true,
        isGlobal: true,
        globalId: globalAttr.id
      }])
      
      // Reset selections
      setSelectedValues([])
    }
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

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(attributes)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setAttributes(items)
  }

  const handleEditAttribute = (index) => {
    const attr = attributes[index]
    if (attr.isGlobal) {
      setSelectedTab('existing')
      setSelectedGlobalAttribute(attr.globalId)
      setSelectedValues(attr.values)
    } else {
      setSelectedTab('new')
      setNewAttribute({
        name: attr.name,
        values: attr.values,
        variation: attr.variation
      })
    }
    setEditingAttributeIndex(index)
    setShowAddAttribute(true)
  }

  const handleSaveEdit = () => {
    if (editingAttributeIndex === null) return

    const newAttributes = [...attributes]
    if (selectedTab === 'new') {
      newAttributes[editingAttributeIndex] = { 
        ...newAttribute, 
        variation: true 
      }
    } else {
      const globalAttr = globalAttributes.find(attr => attr.id === selectedGlobalAttribute)
      if (!globalAttr) return

      newAttributes[editingAttributeIndex] = {
        name: globalAttr.name,
        values: selectedValues,
        variation: true,
        isGlobal: true,
        globalId: globalAttr.id
      }
    }

    setAttributes(newAttributes)
    setEditingAttributeIndex(null)
    setShowAddAttribute(false)
    setNewAttribute({ name: '', values: [], variation: true })
    setSelectedValues([])
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Product Attributes</h3>
        {!readOnly && (
          <Button 
            type="button"
            onClick={() => setShowAddAttribute(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Attribute
          </Button>
        )}
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
          <DroppableComponent droppableId="attributes">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {attributes.map((attr, index) => (
                  <Draggable 
                    key={attr.name} 
                    draggableId={attr.name} 
                    index={index}
                    isDragDisabled={readOnly}
                  >
                    {(provided) => (
                      <Card 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                        {...provided.dragHandleProps} 
                        className="mb-4"
                      >
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2">
                              {attr.name}
                              {attr.isGlobal && (
                                <Badge variant="secondary" className="text-xs">
                                  Global
                                </Badge>
                              )}
                            </CardTitle>
                            {!readOnly && (
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  type="button"
                                  onClick={() => handleEditAttribute(index)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  type="button"
                                  onClick={() => removeAttribute(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {attr.values.map((value, vIndex) => (
                              <Badge 
                                key={vIndex} 
                                variant="secondary"
                                className="px-3 py-1 text-sm"
                              >
                                {value}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center mt-4">
                            <Switch
                              id={`variation-${index}`}
                              checked={attr.variation}
                              onCheckedChange={(checked) => updateAttribute(index, 'variation', checked)}
                              disabled={readOnly}
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
          </DroppableComponent>
        </DragDropContext>
      )}

      {/* Enhanced Add/Edit Attribute Dialog */}
      <Dialog 
        open={showAddAttribute} 
        onOpenChange={(open) => {
          if (!open && !readOnly) {
            setShowAddAttribute(false)
            setEditingAttributeIndex(null)
            setNewAttribute({ name: '', values: [], variation: true })
            setSelectedValues([])
          }
        }}
      >
        <DialogContent 
          className="max-w-2xl"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {editingAttributeIndex !== null ? 'Edit Attribute' : 'Add Attribute'}
            </DialogTitle>
            <DialogDescription>
              {editingAttributeIndex !== null 
                ? 'Modify the attribute details'
                : 'Create a new attribute or select from existing ones'
              }
            </DialogDescription>
          </DialogHeader>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">New Attribute</TabsTrigger>
              <TabsTrigger value="existing">Existing Attribute</TabsTrigger>
            </TabsList>

            <TabsContent value="new" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="existing" className="space-y-4">
              <div className="space-y-2">
                <Label>Select Attribute</Label>
                <Select
                  value={selectedGlobalAttribute}
                  onValueChange={(value) => {
                    setSelectedGlobalAttribute(value)
                    setSelectedValues([])
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an attribute" />
                  </SelectTrigger>
                  <SelectContent>
                    {globalAttributes.map((attr) => (
                      <SelectItem key={attr.id} value={attr.id}>
                        {attr.name} ({attr.values.length} values)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedGlobalAttribute && (
                <div className="space-y-2">
                  <Label>Select Values</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 border rounded-lg min-h-[120px] max-h-[300px] overflow-y-auto">
                    {globalAttributes
                      .find(attr => attr.id === selectedGlobalAttribute)
                      ?.values.map((value) => (
                        <div
                          key={value.id}
                          onClick={() => {
                            setSelectedValues(prev => 
                              prev.includes(value.value)
                                ? prev.filter(v => v !== value.value)
                                : [...prev, value.value]
                            )
                          }}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                            "border hover:bg-accent",
                            selectedValues.includes(value.value) && "bg-accent border-primary",
                          )}
                        >
                          {value.color_code && (
                            <span 
                              className="w-4 h-4 rounded-full shrink-0"
                              style={{ backgroundColor: value.color_code }}
                            />
                          )}
                          <span className="truncate">
                            {value.label || value.value}
                          </span>
                          {selectedValues.includes(value.value) && (
                            <Check className="h-4 w-4 ml-auto shrink-0" />
                          )}
                        </div>
                      ))}
                  </div>
                  {selectedValues.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Click on values to select them
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Selected {selectedValues.length} values
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddAttribute(false)
              setEditingAttributeIndex(null)
            }}>
              Cancel
            </Button>
            <Button 
              onClick={editingAttributeIndex !== null ? handleSaveEdit : addAttribute}
              disabled={selectedTab === 'existing' && (
                !selectedGlobalAttribute || selectedValues.length === 0
              )}
            >
              {editingAttributeIndex !== null ? 'Save Changes' : 'Add Attribute'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 