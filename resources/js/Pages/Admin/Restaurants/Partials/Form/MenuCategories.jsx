import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Plus, X, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const MenuCategories = ({ value = [], onChange, errors = {} }) => {
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = () => {
    if (!newCategory.trim()) return;

    const category = {
      id: Date.now(),
      name: newCategory,
      active: true,
      order: value.length,
    };

    onChange([...value, category]);
    setNewCategory("");
  };

  const handleRemove = (id) => {
    onChange(value.filter((cat) => cat.id !== id));
  };

  const handleToggle = (id) => {
    onChange(
      value.map((cat) =>
        cat.id === id ? { ...cat, active: !cat.active } : cat
      )
    );
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(value);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    onChange(updatedItems);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Category */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <Button onClick={handleAdd} type="button">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Categories List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {value.map((category, index) => (
                  <Draggable
                    key={category.id}
                    draggableId={category.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center gap-2 p-2 bg-background border rounded-lg group"
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                          <span className="font-medium">{category.name}</span>
                          <div className="flex items-center gap-4">
                            <Switch
                              checked={category.active}
                              onCheckedChange={() => handleToggle(category.id)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemove(category.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {errors.categories && (
          <p className="text-sm text-red-500">{errors.categories}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuCategories; 