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

const FeaturedRestaurantsSection = () => {
  const {
    formData,
    updateFormData,
    isSaving,
    handleSubmit,
    isDirty
  } = usePageEditor();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Section Settings */}
      <div>
        <div className="space-y-6">
          {/* Enable/Disable Section */}
          <div className="flex items-center justify-between">
            <Label htmlFor="top_restaurants_enabled" className="flex flex-col">
              <span className="text-sm">Enable Restaurants Section</span>
              <span className="text-xs text-muted-foreground">Show the restaurants section on the homepage</span>
            </Label>
            <Switch
              id="top_restaurants_enabled"
              checked={formData.top_restaurants_enabled ?? true}
              onCheckedChange={(checked) => updateFormData('top_restaurants_enabled', checked)}
            />
          </div>

          {/* Section Title */}
          <div className="space-y-2">
            <Label htmlFor="top_restaurants_title">Section Title</Label>
            <Input
              id="top_restaurants_title"
              value={formData.top_restaurants_title || ''}
              onChange={e => updateFormData('top_restaurants_title', e.target.value)}
              placeholder="Popular Food Restaurants"
            />
            <p className="text-xs text-muted-foreground">
              *Add your text in [text here] to make it colorful
            </p>
          </div>

          {/* Number of Restaurants */}
          <div className="space-y-2">
            <Label className="flex justify-between">
              <span>Number of Restaurants</span>
              <span className="text-primary">{formData.top_restaurants_count || 8}</span>
            </Label>
            <Slider
              defaultValue={[formData.top_restaurants_count || 8]}
              min={4}
              max={12}
              step={1}
              onValueChange={([value]) => updateFormData('top_restaurants_count', value)}
            />
            <p className="text-xs text-muted-foreground">
              Determines how many restaurants to display in this section
            </p>
          </div>

          {/* Layout Selection */}
          <div className="space-y-2">
            <Label htmlFor="top_restaurants_layout">Layout Style</Label>
            <Select
              value={formData.top_restaurants_layout || 'grid'}
              onValueChange={value => updateFormData('top_restaurants_layout', value)}
            >
              <SelectTrigger id="top_restaurants_layout">
                <SelectValue placeholder="Select a layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Grid shows all restaurants at once, List shows one restaurant at one row
            </p>
          </div>

          {/* Columns Count */}
          <div className="space-y-2">
            <Label htmlFor="top_restaurants_columns">Number of Columns</Label>
            <Select
              value={formData.top_restaurants_columns?.toString() || "4"}
              onValueChange={value => updateFormData('top_restaurants_columns', parseInt(value))}
            >
              <SelectTrigger id="top_restaurants_columns">
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

          {/* Show Descriptions */}
          <div className="flex items-center justify-between">
            <Label htmlFor="top_restaurants_show_description" className="flex flex-col">
              <span className="text-sm">Show Category Descriptions</span>
              <span className="text-xs text-muted-foreground">Display descriptions for each category</span>
            </Label>
            <Switch
              id="top_restaurants_show_description"
              checked={formData.top_restaurants_show_description ?? true}
              onCheckedChange={(checked) => updateFormData('top_restaurants_show_description', checked)}
            />
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
          <CardDescription>
            A visual representation of how the restaurants section will look
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-card border overflow-hidden p-4">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {formData.top_restaurants_title || 'Popular Food Restaurants'}
            </h3>

            <div className={`grid gap-4 grid-cols-${formData.top_restaurants_columns || 4}`}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-muted rounded-lg flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-primary/20 mb-3 flex items-center justify-center">
                    <span className="text-primary">🍕</span>
                  </div>
                  <h4 className="font-medium">Restaurant {i}</h4>
                  {(formData.top_restaurants_show_description ?? true) && (
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

export default FeaturedRestaurantsSection; 