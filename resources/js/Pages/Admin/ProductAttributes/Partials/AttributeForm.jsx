import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import { Separator } from "@/Components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Save, X, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { cn } from "@/lib/utils";

const AttributeForm = ({ attribute, isEditing, onCancel, onSuccess }) => {
  const initialFormState = {
    name: "",
    slug: "",
    type: "select",
    is_global: true,
    is_visible: true,
    is_variation: true,
    values: [],
  };

  const {
    data,
    setData,
    post,
    put,
    processing,
    errors,
    reset,
    clearErrors,
  } = useForm(isEditing && attribute ? {
    ...attribute,
    values: attribute.values || [],
  } : initialFormState);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrors();

    if (isEditing) {
        put(route("app.product-attributes.update", attribute.id), {
            onSuccess: () => {
                onSuccess?.();
            },
        });
    } else {
        post(route("app.product-attributes.store"), {
            onSuccess: () => {
                reset();
                onSuccess?.();
            }
        });
    }
  };

  const handleAddValue = () => {
    setData("values", [
      ...data.values,
      { value: "", label: "", color_code: data.type === "color" ? "#000000" : null }
    ]);
  };

  const handleRemoveValue = (index) => {
    setData("values", data.values.filter((_, i) => i !== index));
  };

  const handleUpdateValue = (index, field, value) => {
    const updatedValues = [...data.values];
    updatedValues[index] = { ...updatedValues[index], [field]: value };
    setData("values", updatedValues);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(data.values);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setData("values", items);
  };

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditing && data.name) {
      const slug = data.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setData("slug", slug);
    }
  }, [data.name, isEditing]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {isEditing ? "Edit Attribute" : "Create New Attribute"}
        </h2>
        <div className="flex items-center gap-2">
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={processing}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={processing}>
            {processing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </div>

      <Separator />

      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please correct the following errors:
            <ul className="mt-2 list-disc list-inside">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <div className="space-y-6">
          <FormItem>
            <FormLabel error={errors.name}>
              Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Attribute name"
              />
            </FormControl>
            <FormMessage error={errors.name} />
          </FormItem>

          <FormItem>
            <FormLabel error={errors.slug}>Slug</FormLabel>
            <FormControl>
              <Input
                value={data.slug}
                onChange={(e) => setData("slug", e.target.value)}
                placeholder="attribute-slug"
              />
            </FormControl>
            <FormDescription>
              Leave empty to auto-generate from name
            </FormDescription>
            <FormMessage error={errors.slug} />
          </FormItem>

          <FormItem>
            <FormLabel error={errors.type}>
              Type <span className="text-red-500">*</span>
            </FormLabel>
            <Select
              value={data.type}
              onValueChange={(value) => setData("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select">Dropdown Select</SelectItem>
                <SelectItem value="color">Color Swatch</SelectItem>
                <SelectItem value="button">Button</SelectItem>
                <SelectItem value="radio">Radio Button</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage error={errors.type} />
          </FormItem>

          <div className="flex flex-col gap-4">
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Global Attribute</FormLabel>
                <FormDescription>
                  Make this attribute available globally
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={data.is_global}
                  onCheckedChange={(checked) => setData("is_global", checked)}
                />
              </FormControl>
            </FormItem>

            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Visible</FormLabel>
                <FormDescription>
                  Show this attribute on the frontend
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={data.is_visible}
                  onCheckedChange={(checked) => setData("is_visible", checked)}
                />
              </FormControl>
            </FormItem>

            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Used for Variations</FormLabel>
                <FormDescription>
                  Use this attribute for product variations
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={data.is_variation}
                  onCheckedChange={(checked) => setData("is_variation", checked)}
                />
              </FormControl>
            </FormItem>
          </div>
        </div>

        {/* Values Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Attribute Values</h3>
            <Button type="button" onClick={handleAddValue}>
              Add Value
            </Button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="values">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {data.values.map((value, index) => (
                    <Draggable
                      key={index}
                      draggableId={`value-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg border bg-card",
                            "hover:border-primary/50 transition-colors"
                          )}
                        >
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <Input
                              value={value.value}
                              onChange={(e) =>
                                handleUpdateValue(index, "value", e.target.value)
                              }
                              placeholder="Value"
                            />
                            <Input
                              value={value.label}
                              onChange={(e) =>
                                handleUpdateValue(index, "label", e.target.value)
                              }
                              placeholder="Label (optional)"
                            />
                            {data.type === "color" && (
                              <Input
                                type="color"
                                value={value.color_code}
                                onChange={(e) =>
                                  handleUpdateValue(
                                    index,
                                    "color_code",
                                    e.target.value
                                  )
                                }
                                className="col-span-2"
                              />
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveValue(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {data.values.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No values added yet. Click "Add Value" to create your first value.
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default AttributeForm; 