import React, { useState } from 'react'
import { Plus, X, AlertCircle } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Switch } from "@/Components/ui/switch"
import { Badge } from "@/Components/ui/badge"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"

export default function AttributeManager({ 
  attributes, 
  setAttributes,
  readOnly = false 
}) {
  const [showAddAttribute, setShowAddAttribute] = useState(false)
  const [newAttribute, setNewAttribute] = useState({ name: '', values: [], variation: true })

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

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(attributes)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setAttributes(items)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Product Attributes</h3>
        {!readOnly && (
          <Button 
            type="button" // Add type="button" to prevent form submission
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
          <Droppable droppableId="attributes">
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
                            <CardTitle>{attr.name}</CardTitle>
                            {!readOnly && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeAttribute(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
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
          </Droppable>
        </DragDropContext>
      )}

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
    </div>
  )
} 