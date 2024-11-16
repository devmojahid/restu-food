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
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";
import {
  X,
  Save,
  ArrowLeft,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle,
  Settings2,
  ClipboardList,
  Settings,
  HelpCircle,
  Check,
} from "lucide-react";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import toast from "react-hot-toast";
import { ScrollArea, ScrollBar } from "@/Components/ui/scroll-area";
import { cartesianProduct } from '@/utils/productUtils';
import VariableProductSection from "./VariableProductSection";

const FILE_COLLECTIONS = {
  THUMBNAIL: {
    name: "thumbnail",
    maxFiles: 1,
    fileType: "image",
    title: "Thumbnail",
    description: "Upload a thumbnail image (recommended size: 800x800px)",
  },
  GALLERY: {
    name: "gallery",
    maxFiles: 5,
    fileType: "image",
    title: "Product Gallery",
    description: "Upload up to 5 product images",
  }
};

const VARIANT_ATTRIBUTES = [
  { key: 'size', label: 'Size' },
  { key: 'color', label: 'Color' },
  { key: 'material', label: 'Material' },
  { key: 'style', label: 'Style' },
];

const INITIAL_VARIANT = {
  name: "",
  sku: "",
  price: "",
  stock_quantity: 0,
  weight: "",
  length: "",
  width: "",
  height: "",
  is_active: true,
  attributes: {},
  images: [],
};

const INITIAL_FORM_STATE = {
  restaurant_id: "",
  name: "",
  slug: "",
  sku: "",
  description: "",
  short_description: "",
  price: "",
  cost_per_item: "",
  discounted_price: "",
  sale_price_from: "",
  sale_price_to: "",
  nutritional_info: {},
  is_featured: false,
  is_taxable: true,
  tax_rate: "",
  status: "active",
  stock_quantity: 0,
  weight: "",
  length: "",
  width: "",
  height: "",
  categories: [],
  variant_attributes: [],
  variants: [INITIAL_VARIANT],
  specifications: {},
  labels: [],
  thumbnail: null,
  gallery: [],
  metadata: {},
  stock_management: {
    manage_stock: true,
    low_stock_threshold: 5,
    stock_status: 'in_stock',
    backorders_allowed: false,
  },
  is_variable: false,
  attributes: [],
  variations: [],
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

const VariantAttributeSelector = ({ selectedAttributes, onChange }) => {
  return (
    <div className="space-y-4">
      <Label>Variant Attributes</Label>
      <div className="flex flex-wrap gap-2">
        {VARIANT_ATTRIBUTES.map((attr) => (
          <Badge
            key={attr.key}
            variant={selectedAttributes.includes(attr.key) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => {
              const newSelection = selectedAttributes.includes(attr.key)
                ? selectedAttributes.filter(a => a !== attr.key)
                : [...selectedAttributes, attr.key];
              onChange(newSelection);
            }}
          >
            {attr.label}
          </Badge>
        ))}
      </div>
    </div>
  );
};

const VariantForm = ({ variant, index, onUpdate, onRemove, showRemove }) => {
  const handleUpdate = (field, value) => {
    onUpdate(index, field, value);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center border-b pb-2">
        <h4 className="font-medium text-lg">Variant {index + 1}</h4>
        {showRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="hover:bg-red-100 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            value={variant.name || ''}
            onChange={(e) => handleUpdate('name', e.target.value)}
            placeholder="Variant name"
            className="w-full focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">SKU</Label>
          <Input
            type="text"
            value={variant.sku || ''}
            onChange={(e) => handleUpdate('sku', e.target.value)}
            placeholder="SKU code"
            className="w-full focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Price <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={variant.price || ''}
            onChange={(e) => handleUpdate('price', e.target.value)}
            placeholder="0.00"
            className="w-full focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Stock Quantity</Label>
          <Input
            type="number"
            value={variant.stock_quantity}
            onChange={(e) => handleUpdate("stock_quantity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Weight (kg)</Label>
          <Input
            type="number"
            step="0.01"
            value={variant.weight}
            onChange={(e) => handleUpdate("weight", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Length (cm)</Label>
          <Input
            type="number"
            step="0.01"
            value={variant.length}
            onChange={(e) => handleUpdate("length", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Width (cm)</Label>
          <Input
            type="number"
            step="0.01"
            value={variant.width}
            onChange={(e) => handleUpdate("width", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Height (cm)</Label>
          <Input
            type="number"
            step="0.01"
            value={variant.height}
            onChange={(e) => handleUpdate("height", e.target.value)}
          />
        </div>
      </div>

      <FileUploader
        maxFiles={5}
        fileType="image"
        collection="variant_images"
        value={variant.images}
        onUpload={(files) => handleUpdate("images", files)}
        description="Upload variant images (max 5)"
      />

      <div className="flex items-center space-x-2">
        <Switch
          checked={variant.is_active}
          onCheckedChange={(checked) => handleUpdate("is_active", checked)}
        />
        <Label>Active</Label>
      </div>
    </div>
  );
};

// Add these constants for specifications
const COMMON_UNITS = {
  WEIGHT: [
    { value: 'g', label: 'Grams (g)' },
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'oz', label: 'Ounces (oz)' },
    { value: 'lbs', label: 'Pounds (lbs)' },
  ],
  VOLUME: [
    { value: 'ml', label: 'Milliliters (ml)' },
    { value: 'l', label: 'Liters (l)' },
    { value: 'fl_oz', label: 'Fluid Ounces (fl oz)' },
  ],
  DIMENSION: [
    { value: 'cm', label: 'Centimeters (cm)' },
    { value: 'inch', label: 'Inches (in)' },
  ],
  TIME: [
    { value: 'min', label: 'Minutes' },
    { value: 'hour', label: 'Hours' },
  ],
};

const ALLERGEN_OPTIONS = [
  'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts', 
  'Peanuts', 'Wheat', 'Soybeans', 'Sesame'
];

const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 
  'Kosher', 'Low-Carb', 'Keto-Friendly', 'Dairy-Free'
];

// Add demo specification groups and specifications
const DEMO_SPECIFICATION_GROUPS = [
  {
    id: 1,
    name: "Food Specifications",
    description: "Basic food product specifications",
    icon: "🍽️",
    specifications: [
      {
        id: 'serving_size',
        name: "Serving Size",
        input_type: "number",
        unit: true,
        unit_group: "WEIGHT",
        default_unit: "g",
        required: true,
        help_text: "Size per serving",
      },
      {
        id: 'preparation_time',
        name: "Preparation Time",
        input_type: "number",
        unit: true,
        unit_group: "TIME",
        default_unit: "min",
        required: true,
      },
      {
        id: 'storage_instructions',
        name: "Storage Instructions",
        input_type: "textarea",
        placeholder: "Enter storage instructions",
      },
    ]
  },
  {
    id: 2,
    name: "Pizza Specifications",
    description: "Specific details for pizza products",
    icon: "🍕",
    specifications: [
      {
        id: 'size',
        name: "Size",
        input_type: "select",
        required: true,
        options: [
          { value: 'small', label: 'Small (8")' },
          { value: 'medium', label: 'Medium (12")' },
          { value: 'large', label: 'Large (14")' },
          { value: 'extra_large', label: 'Extra Large (16")' },
        ]
      },
      {
        id: 'crust_type',
        name: "Crust Type",
        input_type: "select",
        required: true,
        options: [
          { value: 'thin', label: 'Thin Crust' },
          { value: 'thick', label: 'Thick Crust' },
          { value: 'stuffed', label: 'Stuffed Crust' },
          { value: 'pan', label: 'Pan Pizza' },
        ]
      },
      {
        id: 'toppings',
        name: "Available Toppings",
        input_type: "multiselect",
        options: [
          { value: 'pepperoni', label: 'Pepperoni' },
          { value: 'mushrooms', label: 'Mushrooms' },
          { value: 'onions', label: 'Onions' },
          { value: 'sausage', label: 'Sausage' },
          { value: 'bacon', label: 'Bacon' },
          { value: 'extra_cheese', label: 'Extra Cheese' },
        ]
      },
    ]
  },
  {
    id: 3,
    name: "Burger Specifications",
    description: "Specific details for burger products",
    icon: "🍔",
    specifications: [
      {
        id: 'patty_weight',
        name: "Patty Weight",
        input_type: "number",
        unit: true,
        unit_group: "WEIGHT",
        default_unit: "g",
        required: true,
      },
      {
        id: 'cooking_preference',
        name: "Cooking Preference Available",
        input_type: "multiselect",
        options: [
          { value: 'rare', label: 'Rare' },
          { value: 'medium_rare', label: 'Medium Rare' },
          { value: 'medium', label: 'Medium' },
          { value: 'medium_well', label: 'Medium Well' },
          { value: 'well_done', label: 'Well Done' },
        ]
      },
      {
        id: 'bun_type',
        name: "Bun Type",
        input_type: "select",
        required: true,
        options: [
          { value: 'sesame', label: 'Sesame Bun' },
          { value: 'brioche', label: 'Brioche Bun' },
          { value: 'potato', label: 'Potato Bun' },
          { value: 'gluten_free', label: 'Gluten-Free Bun' },
        ]
      },
    ]
  },
  {
    id: 4,
    name: "Beverage Specifications",
    description: "Specific details for beverage products",
    icon: "🥤",
    specifications: [
      {
        id: 'volume',
        name: "Volume",
        input_type: "number",
        unit: true,
        unit_group: "VOLUME",
        default_unit: "ml",
        required: true,
      },
      {
        id: 'serving_temperature',
        name: "Serving Temperature",
        input_type: "select",
        required: true,
        options: [
          { value: 'hot', label: 'Hot' },
          { value: 'cold', label: 'Cold' },
          { value: 'room_temp', label: 'Room Temperature' },
        ]
      },
      {
        id: 'carbonated',
        name: "Carbonated",
        input_type: "boolean",
        help_text: "Is this a carbonated beverage?",
      },
    ]
  },
];

// Update the SpecificationGroupCard component for better UI
const SpecificationGroupCard = ({ group, isSelected, isCompleted, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex-shrink-0 w-[180px] sm:w-[200px] p-2.5 rounded-lg cursor-pointer transition-all duration-200",
        "border hover:shadow-md relative group",
        "hover:scale-[1.02] active:scale-[0.98]",
        isSelected 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-border hover:border-primary/30",
        isCompleted && "border-green-500/50 bg-green-50/50 dark:bg-green-900/10"
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className={cn(
          "p-2 rounded-lg",
          isSelected ? "bg-primary/10" : "bg-muted",
          isCompleted && "bg-green-100 dark:bg-green-900/20"
        )}>
          <span className="text-xl">{group.icon}</span>
        </div>
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-medium text-xs sm:text-sm truncate">
              {group.name}
            </h3>
            {isCompleted && (
              <Badge variant="success" className="shrink-0 text-[10px]">
                <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                Done
              </Badge>
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">
            {group.description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Update the SpecificationField component to fix input issues
const SpecificationField = ({ spec, value, onChange }) => {
  // Add local state for input value
  const [inputValue, setInputValue] = useState(value || '');

  // Update local state when prop value changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Handle input change
  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div className="space-y-1">
          <Label 
            htmlFor={`spec_${spec.id}`} 
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium"
          >
            {spec.name}
            {spec.required && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                Required
              </Badge>
            )}
          </Label>
          {spec.help_text && (
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {spec.help_text}
            </p>
          )}
        </div>
      </div>
      <div className="w-full">
        {renderSpecificationInput(spec, inputValue, handleInputChange)}
      </div>
      {spec.description && (
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          {spec.description}
        </p>
      )}
    </div>
  );
};

// Update the renderSpecificationInput function for better input handling
const renderSpecificationInput = (spec, value, onChange) => {
  switch (spec.input_type) {
    case 'select':
      return (
        <Select
          value={value || ''}
          onValueChange={onChange}
        >
          <SelectTrigger className="w-full h-10 text-sm">
            <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {spec.options?.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="text-sm cursor-pointer"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'number':
      return (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Input
              type="number"
              id={`spec_${spec.id}`}
              value={value || ''}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue === '' || !isNaN(newValue)) {
                  onChange(newValue);
                }
              }}
              className="w-full h-10 pr-12 text-sm"
              step={spec.step || "1"}
              min={spec.min}
              max={spec.max}
              placeholder="0"
            />
            {spec.unit && !spec.unit_group && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {spec.unit}
              </span>
            )}
          </div>
          {spec.unit && spec.unit_group && (
            <Select
              value={spec.default_unit}
              onValueChange={(unitValue) => {
                // Handle unit change
              }}
              className="w-full sm:w-[120px]"
            >
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMMON_UNITS[spec.unit_group]?.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      );

    case 'multiselect':
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {spec.options?.map((option) => (
              <Badge
                key={option.value}
                variant={value?.includes(option.value) ? "default" : "outline"}
                className="cursor-pointer py-1.5 px-3 text-xs hover:shadow-sm transition-all"
                onClick={() => {
                  const current = value || [];
                  const updated = current.includes(option.value)
                    ? current.filter(v => v !== option.value)
                    : [...current, option.value];
                  onChange(updated);
                }}
              >
                {option.label}
              </Badge>
            ))}
          </div>
          {spec.required && value?.length === 0 && (
            <p className="text-xs text-destructive">
              Please select at least one option
            </p>
          )}
        </div>
      );

    case 'textarea':
      return (
        <Textarea
          id={`spec_${spec.id}`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={spec.placeholder}
          className="min-h-[100px] resize-y text-sm"
        />
      );

    case 'boolean':
      return (
        <div className="flex items-center gap-2">
          <Switch
            id={`spec_${spec.id}`}
            checked={value || false}
            onCheckedChange={onChange}
          />
          <Label htmlFor={`spec_${spec.id}`} className="text-xs text-muted-foreground">
            {spec.help_text || `Enable ${spec.name.toLowerCase()}`}
          </Label>
        </div>
      );

    default:
      return (
        <Input
          type="text"
          id={`spec_${spec.id}`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 text-sm"
          placeholder={spec.placeholder || `Enter ${spec.name.toLowerCase()}`}
        />
      );
  }
};

export default function CreateProductForm({ restaurants, categories, specificationGroups, globalAttributes }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoUpdateSlug, setAutoUpdateSlug] = useState(true);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedSpecifications, setSelectedSpecifications] = useState({});
  const [isVariableProduct, setIsVariableProduct] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [generatedVariations, setGeneratedVariations] = useState([]);

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

    post(route("app.products.store"), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        toast.success("Product created successfully!");
      },
      onError: () => {
        setIsSubmitting(false);
        toast.error("Failed to create product.");
      },
    });
  };

  const addVariant = () => {
    setData("variants", [...data.variants, { ...INITIAL_VARIANT }]);
  };

  const removeVariant = (index) => {
    setData("variants", data.variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...data.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };
    setData("variants", updatedVariants);
  };

  const VariantsSection = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Variants</CardTitle>
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setData("variant_attributes", [])}
          >
            Reset Variants
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addVariant}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Variant
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <VariantAttributeSelector
          selectedAttributes={data.variant_attributes}
          onChange={(attrs) => setData("variant_attributes", attrs)}
        />
        
        {data.variants.map((variant, index) => (
          <VariantForm
            key={index}
            variant={variant}
            index={index}
            onUpdate={(field, value) => updateVariant(index, field, value)}
            onRemove={() => removeVariant(index)}
            showRemove={index > 0}
          />
        ))}
      </CardContent>
    </Card>
  );

  // Add new handler for specification group selection
  const handleGroupSelection = (groupId) => {
    setSelectedGroupId(groupId);
    if (!selectedSpecifications[groupId]) {
      // Initialize specifications for this group
      setSelectedSpecifications(prev => ({
        ...prev,
        [groupId]: true
      }));
    }
  };

  // Update the SpecificationsSection component
  const SpecificationsSection = () => {
    const groups = specificationGroups?.length ? specificationGroups : DEMO_SPECIFICATION_GROUPS;

    return (
      <div className="space-y-6">
        {/* Specification Groups Selection */}
        <Card className="w-full overflow-hidden bg-card">
          <CardHeader className="p-4 sm:p-6 border-b bg-gradient-to-r from-primary/5 via-primary/2 to-transparent">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                <Settings2 className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl sm:text-2xl">Product Specifications</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select a product type to customize specifications
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4">
                {groups.map((group) => (
                  <SpecificationGroupCard
                    key={group.id}
                    group={group}
                    isSelected={selectedGroupId === group.id}
                    isCompleted={selectedSpecifications[group.id]}
                    onClick={() => {
                      setSelectedGroupId(prev => prev === group.id ? null : group.id);
                    }}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="mt-2" />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Selected Group Specifications */}
        {selectedGroupId && (
          <div className="w-full">
            {groups
              .filter((group) => group.id === selectedGroupId)
              .map((group) => (
                <Card key={group.id} className="w-full overflow-hidden">
                  <CardHeader className="p-4 sm:p-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10">
                          <span className="text-2xl">{group.icon}</span>
                        </div>
                        <div>
                          <CardTitle className="text-xl sm:text-2xl">{group.name}</CardTitle>
                          {group.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {group.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 sm:flex-none gap-2"
                          onClick={() => {
                            setSelectedSpecifications(prev => ({
                              ...prev,
                              [group.id]: true
                            }));
                            setSelectedGroupId(null);
                          }}
                        >
                          <Check className="w-4 h-4" />
                          Save & Continue
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                          onClick={() => setSelectedGroupId(null)}
                        >
                          Change Type
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-6">
                      {/* All Specifications */}
                      <div className="grid gap-6">
                        {group.specifications.map((spec) => (
                          <div 
                            key={spec.id}
                            className="bg-muted/30 rounded-xl p-4 sm:p-6 hover:bg-muted/40 transition-colors"
                          >
                            <SpecificationField
                              spec={spec}
                              value={data.specifications[spec.id]}
                              onChange={(value) =>
                                setData('specifications', {
                                  ...data.specifications,
                                  [spec.id]: value,
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    );
  };

  const handleAttributeChange = (attributeId, values) => {
    const updatedAttributes = data.attributes.map((attr) => {
      if (attr.id === attributeId) {
        return { ...attr, values };
      }
      return attr;
    });
    setData("attributes", updatedAttributes);
  };

  const handleRemoveAttribute = (attributeId) => {
    const updatedAttributes = data.attributes.filter(
      (attr) => attr.id !== attributeId
    );
    setData("attributes", updatedAttributes);
  };

  const handleAddAttribute = (attribute) => {
    setData("attributes", [...data.attributes, attribute]);
  };

  const generateVariations = () => {
    const variationAttributes = data.attributes.filter(attr => attr.variation);
    const attributeValues = variationAttributes.map(attr => 
      attr.isCustom ? attr.values : attr.selectedValues
    );
    
    if (attributeValues.length === 0) {
      toast.error("Please select at least one attribute for variations");
      return;
    }

    const variations = cartesianProduct(...attributeValues).map((combination) => {
      const attributes = combination.map((value, index) => ({
        id: variationAttributes[index].id,
        name: variationAttributes[index].name,
        value,
      }));
      return {
        attributes,
        price: data.price,
        stock_quantity: 0,
        sku: "",
        images: [],
        is_active: true,
      };
    });
    
    setGeneratedVariations(variations);
  };

  const handleVariationChange = (index, field, value) => {
    const updatedVariations = [...generatedVariations];
    updatedVariations[index] = {
      ...updatedVariations[index],
      [field]: value,
    };
    setGeneratedVariations(updatedVariations);
  };

  const handleSaveVariations = () => {
    setData("variations", generatedVariations);
  };

  // Update isVariableProduct state to use form data
  const handleVariableProductChange = (checked) => {
    setData('is_variable', checked);
    if (!checked) {
      // Reset attributes and variations when switching back to simple product
      setData('attributes', []);
      setData('variations', []);
      setGeneratedVariations([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
            disabled={processing || isSubmitting}
            className="flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {processing || isSubmitting ? "Saving..." : "Save Product"}
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
                    value={data.restaurant_id}
                    onValueChange={(value) => setData("restaurant_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a restaurant" />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurants.map((restaurant) => (
                        <SelectItem key={restaurant.id} value={restaurant.id}>
                          {restaurant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

          {/* Move Specifications Section here - before Variants */}
          <SpecificationsSection />

          <VariableProductSection 
            isVariableProduct={data.is_variable}
            setIsVariableProduct={handleVariableProductChange}
            data={data}
            globalAttributes={globalAttributes}
            handleAddAttribute={handleAddAttribute}
            handleRemoveAttribute={handleRemoveAttribute}
            handleAttributeChange={handleAttributeChange}
            generateVariations={generateVariations}
            generatedVariations={generatedVariations}
            handleVariationChange={handleVariationChange}
            handleSaveVariations={handleSaveVariations}
          />

          {/* Variants Section */}
          <VariantsSection />

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
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={data.categories}
                onValueChange={(value) => setData("categories", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* File Uploaders */}
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
    </form>
  );
} 