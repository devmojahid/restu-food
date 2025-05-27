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

const TopCategoriesSection = () => {
  const {
    formData,
    updateFormData,
    isSaving,
    handleSubmit,
    isDirty
  } = usePageEditor();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      <div>
        <div className="space-y-6">
          {/* Enable/Disable Section */}
          <div className="flex items-center justify-between">
            <Label htmlFor="top_categories_enabled" className="flex flex-col">
              <span className="text-sm">Enable Categories Section</span>
              <span className="text-xs text-muted-foreground">Show the categories section on the homepage</span>
            </Label>
            <Switch
              id="top_categories_enabled"
              checked={formData.top_categories_enabled ?? true}
              onCheckedChange={(checked) => updateFormData('top_categories_enabled', checked)}
            />
          </div>

          {/* Section Title */}
          <div className="space-y-2">
            <Label htmlFor="top_categories_title">Section Title</Label>
            <Input
              id="top_categories_title"
              value={formData.top_categories_title || ''}
              onChange={e => updateFormData('top_categories_title', e.target.value)}
              placeholder="Popular Food Categories"
            />
          </div>

          {/* Number of Categories */}
          <div className="space-y-2">
            <Label className="flex justify-between">
              <span>Number of Categories</span>
              <span className="text-primary">{formData.top_categories_count || 8}</span>
            </Label>
            <Slider
              defaultValue={[formData.top_categories_count || 8]}
              min={4}
              max={12}
              step={1}
              onValueChange={([value]) => updateFormData('top_categories_count', value)}
            />
            <p className="text-xs text-muted-foreground">
              Determines how many categories to display in this section
            </p>
          </div>

          {/* Enable Filter */}
          <div className="flex items-center justify-between">
            <Label htmlFor="top_categories_show_filter" className="flex flex-col">
              <span className="text-sm">Show Filter?</span>
              <span className="text-xs text-muted-foreground">Show filter on the top of the categories section</span>
            </Label>
            <Switch
              id="top_categories_show_filter"
              checked={formData.top_categories_show_filter ?? true}
              onCheckedChange={(checked) => updateFormData('top_categories_show_filter', checked)}
            />
          </div>

          {/* Show Descriptions */}
          <div className="flex items-center justify-between">
            <Label htmlFor="top_categories_show_description" className="flex flex-col">
              <span className="text-sm">Show Category Descriptions</span>
              <span className="text-xs text-muted-foreground">Display descriptions for each category</span>
            </Label>
            <Switch
              id="top_categories_show_description"
              checked={formData.top_categories_show_description ?? true}
              onCheckedChange={(checked) => updateFormData('top_categories_show_description', checked)}
            />
          </div>

          {/* Columns Count */}
          <div className="space-y-2">
            <Label htmlFor="top_categories_columns">Number of Columns</Label>
            <Select
              value={formData.top_categories_columns?.toString() || "4"}
              onValueChange={value => updateFormData('top_categories_columns', parseInt(value))}
            >
              <SelectTrigger id="top_categories_columns">
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
        </div>
      </div>

      {/* Preview Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
          <CardDescription>
            A visual representation of how the categories section will look
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-card border overflow-hidden p-4">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {formData.top_categories_title || 'Popular Food Categories'}
            </h3>

            <div className={`grid gap-4 grid-cols-${formData.top_categories_columns || 4}`}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-muted rounded-lg flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-primary/20 mb-3 flex items-center justify-center">
                    <span className="text-primary">🍕</span>
                  </div>
                  <h4 className="font-medium">Category {i}</h4>
                  {(formData.top_categories_show_description ?? true) && (
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

export default TopCategoriesSection; 