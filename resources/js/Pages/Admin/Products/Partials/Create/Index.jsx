import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import {
  Save,
  ArrowLeft,
  AlertCircle,
  FolderTree,
  ChevronRight,
} from "lucide-react";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import ProductVariations from "../Components/Variations/Index";
import { Badge } from "@/Components/ui/badge";
import MultiSelect from "@/Components/ui/multi-select";

const FILE_COLLECTIONS = {
  THUMBNAIL: {
    name: "thumbnail",
    maxFiles: 1,
    fileType: "image",
    title: "Product Thumbnail",
    description: "Upload a product thumbnail (recommended size: 800x800px)",
  },
  GALLERY: {
    name: "gallery",
    maxFiles: 5,
    fileType: "image",
    title: "Product Gallery",
    description: "Upload product gallery images (up to 5)",
  }
};

const INITIAL_FORM_STATE = {
  restaurant_id: "",
  name: "",
  slug: "",
  description: "",
  short_description: "",
  price: "",
  cost_per_item: "",
  discounted_price: "",
  is_featured: false,
  is_taxable: true,
  tax_rate: "",
  status: "active",
  length: "",
  categories: [],
  thumbnail: null,
  gallery: [],
  variations: [],
  attributes: [],
  stock_management: {
    manage_stock: true,
    low_stock_threshold: 5,
    stock_status: 'in_stock',
    backorders_allowed: false,
  },
};

const ErrorAlert = ({ errors }) => {
  if (!Object.keys(errors).length) return null;

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1">
          {Object.entries(errors).map(([field, messages]) => (
            <li key={field} className="text-sm">
              <span className="font-medium capitalize">
                {field.replace("_", " ")}
              </span>
              : {Array.isArray(messages) ? messages[0] : messages}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

// First, let's create a helper function to format categories for the select component
const formatCategoriesForSelect = (categories = []) => {
  if (!Array.isArray(categories)) return [];
  
  return categories.map(category => ({
    value: category.id.toString(),
    label: category.name,
    ...(category.parent && {
      label: `${category.name} (${category.parent.name})`,
      parent: category.parent
    })
  }));
};

export default function CreateProductForm({ restaurants, categories, globalAttributes }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoUpdateSlug, setAutoUpdateSlug] = useState(true);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [variationsData, setVariationsData] = useState({
    attributes: [],
    variations: []
  });

  const { data, setData, post, processing, errors } = useForm(INITIAL_FORM_STATE);

  // Auto-generate slug from name
  useEffect(() => {
    if (data.name && autoUpdateSlug) {
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
    setIsSubmitting(true);
    post(route("app.products.store"));
  };

  const handleVariationsChange = (variationData) => {
    setVariationsData(variationData);
    
    const mappedVariations = variationData.variations.map(variation => ({
      ...variation,
      thumbnail: variation.thumbnail || null,
    }));

    setData(prev => ({
      ...prev,
      variations: mappedVariations,
      attributes: variationData.attributes
    }));
  };

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
          handleSubmit(e);
        }
      }} 
      className="space-y-8"
    >
      <ErrorAlert errors={errors} />

      {/* Form Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create New Product
          </h1>
        </div>
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={processing}
            className="flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {processing ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information Card */}
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurant_id">Restaurant</Label>
                  <Select
                    value={data.restaurant_id?.toString() || ""}
                    onValueChange={(value) => setData("restaurant_id", value)}
                  >
                    <SelectTrigger id="restaurant_id" className={cn(errors.restaurant_id && "border-red-500")}>
                      <SelectValue placeholder="Select a restaurant" />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurants?.length > 0 ? (
                        restaurants.map((restaurant) => (
                          <SelectItem 
                            key={restaurant.id} 
                            value={restaurant.id.toString()}
                          >
                            {restaurant.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          No restaurants available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.restaurant_id && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.restaurant_id}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
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
                    value={data.slug || ''}
                    onChange={(e) => {
                      setAutoUpdateSlug(false);
                      setData('slug', e.target.value);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Textarea
                    id="short_description"
                    value={data.short_description}
                    onChange={(e) => setData("short_description", e.target.value)}
                    className="h-24"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Regular Price *</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="discounted_price">Sale Price</Label>
                  <Input
                    id="discounted_price"
                    type="number"
                    step="0.01"
                    value={data.discounted_price}
                    onChange={(e) => setData("discounted_price", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    step="0.01"
                    value={data.tax_rate}
                    onChange={(e) => setData("tax_rate", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_taxable"
                  checked={data.is_taxable}
                  onCheckedChange={(checked) => setData("is_taxable", checked)}
                />
                <Label htmlFor="is_taxable">Product is taxable</Label>
              </div>
            </CardContent>
          </Card>

          {/* <WorkableVariations /> */}
          <ProductVariations
            initialAttributes={[]}
            initialVariations={[]}
            onChange={handleVariationsChange}
            readOnly={false}
            globalAttributes={globalAttributes}
          />

          {/* Stock Management Card */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="manage_stock"
                  checked={data.stock_management.manage_stock}
                  onCheckedChange={(checked) =>
                    setData("stock_management", {
                      ...data.stock_management,
                      manage_stock: checked,
                    })
                  }
                />
                <Label htmlFor="manage_stock">Track stock level</Label>
              </div>

              {data.stock_management.manage_stock && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="low_stock_threshold">
                      Low stock threshold
                    </Label>
                    <Input
                      id="low_stock_threshold"
                      type="number"
                      value={data.stock_management.low_stock_threshold}
                      onChange={(e) =>
                        setData("stock_management", {
                          ...data.stock_management,
                          low_stock_threshold: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="backorders_allowed"
                      checked={data.stock_management.backorders_allowed}
                      onCheckedChange={(checked) =>
                        setData("stock_management", {
                          ...data.stock_management,
                          backorders_allowed: checked,
                        })
                      }
                    />
                    <Label htmlFor="backorders_allowed">
                      Allow backorders
                    </Label>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={data.status}
                  onValueChange={(value) => setData("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={data.is_featured}
                  onCheckedChange={(checked) => setData("is_featured", checked)}
                />
                <Label htmlFor="is_featured">Featured product</Label>
              </div>
            </CardContent>
          </Card>

          {/* Categories Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-4 w-4" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categories">
                  Select Categories
                  <span className="text-xs text-muted-foreground ml-2">
                    (You can select multiple)
                  </span>
                </Label>
                
                <MultiSelect
                  options={categories.map(category => ({
                    value: category.id.toString(),
                    label: category.name,
                    ...(category.parent && {
                      parent: category.parent
                    })
                  }))}
                  selected={data.categories || []}
                  onChange={(values) => setData("categories", values)}
                  placeholder="Select categories"
                  error={errors.categories}
                />

                {errors.categories && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.categories}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* File Uploaders */}
          <div className="space-y-6">
            {Object.values(FILE_COLLECTIONS).map((collection) => (
              <Card key={collection.name}>
                <CardHeader>
                  <CardTitle>{collection.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploader
                    maxFiles={collection.maxFiles}
                    fileType={collection.fileType}
                    collection={collection.name}
                    value={data[collection.name]}
                    onUpload={(files) => setData(collection.name, files)}
                    description={collection.description}
                    error={errors[collection.name]}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
} 