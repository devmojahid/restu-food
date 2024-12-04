import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import { Save, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import MultiSelect from "@/Components/ui/multi-select";
import { ScrollArea } from "@/Components/ui/scroll-area";

const AddonForm = ({ addon, categories, onSuccess, onCancel }) => {
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    name: addon?.name || "",
    slug: addon?.slug || "",
    description: addon?.description || "",
    price: addon?.price || "",
    cost_per_item: addon?.cost_per_item || "",
    stock_quantity: addon?.stock_quantity || 0,
    is_active: addon?.is_active ?? true,
    categories: addon?.categories?.map(cat => cat.id.toString()) || [],
    thumbnail: addon?.thumbnail || null,
    meta: addon?.meta || {},
  });

  useEffect(() => {
    if (data.name && !addon) {
      const slug = data.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setData('slug', slug);
    }
  }, [data.name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrors();

    if (addon) {
      put(route("app.products.addons.update", addon.id), {
        preserveScroll: true,
        onSuccess: () => {
          onSuccess?.();
        },
      });
    } else {
      post(route("app.products.addons.store"), {
        preserveScroll: true,
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-8rem)]">
      <ScrollArea className="flex-1 px-6">
        <div className="space-y-6 pb-6">
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className={cn(errors.name && "border-red-500")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={data.slug}
                onChange={(e) => setData("slug", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={data.price}
                  onChange={(e) => setData("price", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost_per_item">Cost Per Item</Label>
                <Input
                  id="cost_per_item"
                  type="number"
                  step="0.01"
                  value={data.cost_per_item}
                  onChange={(e) => setData("cost_per_item", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={data.stock_quantity}
                onChange={(e) => setData("stock_quantity", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={data.is_active}
                onCheckedChange={(checked) => setData("is_active", checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categories">Categories</Label>
              <MultiSelect
                options={categories.map(category => ({
                  value: category.id.toString(),
                  label: category.name,
                }))}
                selected={data.categories}
                onChange={(values) => setData("categories", values)}
                placeholder="Select categories"
              />
            </div>

            <Card>
              <CardContent className="p-4">
                <Label>Thumbnail</Label>
                <FileUploader
                  maxFiles={1}
                  fileType="image"
                  collection="thumbnail"
                  value={data.thumbnail}
                  onUpload={(files) => setData("thumbnail", files)}
                  description="Upload addon thumbnail (recommended size: 800x800px)"
                  error={errors.thumbnail}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>

      {/* Fixed Footer */}
      <div className="flex justify-end gap-2 p-6 border-t bg-background">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={processing}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={processing}>
          <Save className="w-4 h-4 mr-2" />
          {addon ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default AddonForm; 