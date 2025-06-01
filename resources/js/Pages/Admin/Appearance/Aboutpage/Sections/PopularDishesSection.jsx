import React from 'react';
import { usePageEditor } from '@/Components/Admin/PageBuilder/PageEditorContext';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Slider } from "@/Components/ui/slider";
import MultiSelect from "@/Components/ui/multi-select";

const PopularDishesSection = () => {
  const {
    formData,
    updateFormData,
    isSaving,
    handleSubmit,
    isDirty,
    dynamicData
  } = usePageEditor();

  console.log(dynamicData, 'dynamicData');

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      <div>
        <div className="space-y-6">
          {/* Enable/Disable Section */}
          <div className="flex items-center justify-between">
            <Label htmlFor="popular_dishes_enabled" className="flex flex-col">
              <span className="text-sm">Enable Popular Dishes Section</span>
              <span className="text-xs text-muted-foreground">Show the Popular dishes section on the homepage</span>
            </Label>
            <Switch
              id="popular_dishes_enabled"
              checked={formData.popular_dishes_enabled ?? true}
              onCheckedChange={(checked) => updateFormData('popular_dishes_enabled', checked)}
            />
          </div>

          {/* Section Title */}
          <div className="space-y-2">
            <Label htmlFor="popular_dishes_title">Section Title (Optional)</Label>
            <Input
              id="popular_dishes_title"
              value={formData.popular_dishes_title || ''}
              onChange={e => updateFormData('popular_dishes_title', e.target.value)}
              placeholder="Popular Dishes"
            />
          </div>

          {/* Number of Categories */}
          <div className="space-y-2">
            <Label className="flex justify-between">
              <span>Number of Dishes</span>
              <span className="text-primary">{formData.popular_dishes_count || 8}</span>
            </Label>
            <Slider
              defaultValue={[formData.popular_dishes_count || 8]}
              min={4}
              max={12}
              step={1}
              onValueChange={([value]) => updateFormData('popular_dishes_count', value)}
            />
            <p className="text-xs text-muted-foreground">
              Determines how many dishes to display in this section
            </p>
          </div>

          {/* Enable Filter */}
          <div className="flex items-center justify-between">
            <Label htmlFor="popular_dishes_show_filter" className="flex flex-col">
              <span className="text-sm">Show Filter?</span>
              <span className="text-xs text-muted-foreground">Show filter on the top of the Popular dishes section</span>
            </Label>
            <Switch
              id="popular_dishes_show_filter"
              checked={formData.popular_dishes_show_filter ?? true}
              onCheckedChange={(checked) => updateFormData('popular_dishes_show_filter', checked)}
            />
          </div>

          {/* Show Descriptions */}
          <div className="flex items-center justify-between">
            <Label htmlFor="popular_dishes_show_description" className="flex flex-col">
              <span className="text-sm">Show Dish Descriptions</span>
              <span className="text-xs text-muted-foreground">Display descriptions for each dish</span>
            </Label>
            <Switch
              id="popular_dishes_show_description"
              checked={formData.popular_dishes_show_description ?? true}
              onCheckedChange={(checked) => updateFormData('popular_dishes_show_description', checked)}
            />
          </div>

          {/* Columns Count */}
          <div className="space-y-2">
            <Label htmlFor="popular_dishes_columns">Number of Columns (Optional)</Label>
            <Select
              value={formData.popular_dishes_columns?.toString() || "4"}
              onValueChange={value => updateFormData('popular_dishes_columns', parseInt(value))}
            >
              <SelectTrigger id="popular_dishes_columns">
                <SelectValue placeholder="Select number of columns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
                <SelectItem value="5">5 Columns</SelectItem>
                <SelectItem value="6">6 Columns</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Number of columns to display in grid mode (on large screens)
            </p>
          </div>

          {/* select categories */}
          <div className="space-y-2">
            <Label htmlFor="popular_dishes_categories">
              Select Dishes
              <span className="text-xs text-muted-foreground ml-2">
                (You can select multiple)
              </span>
            </Label>

            <MultiSelect
              options={dynamicData?.productCategories?.map(category => ({
                value: category.id.toString(),
                label: category.name,
                ...(category.parent && {
                  parent: category.parent
                })
              }))}
              selected={formData.selected_popular_dishes || []}
              onChange={(values) => updateFormData("selected_popular_dishes", values)}
              placeholder="Select dishes"
            />
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
          <CardDescription>
            A visual representation of how the Popular dishes section will look
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-card border overflow-hidden p-4">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {formData.popular_dishes_title || 'Popular Food Dishes'}
            </h3>

            <div className={`grid gap-4 grid-cols-${formData.popular_dishes_columns || 4}`}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-muted rounded-lg flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-primary/20 mb-3 flex items-center justify-center">
                    <span className="text-primary">🍕</span>
                  </div>
                  <h4 className="font-medium">Category {i}</h4>
                  {(formData.popular_dishes_show_description ?? true) && (
                    <p className="text-xs text-muted-foreground text-center mt-1">Short description text</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
};

export default PopularDishesSection; 