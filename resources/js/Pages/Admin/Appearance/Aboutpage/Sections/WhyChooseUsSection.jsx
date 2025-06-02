import React from 'react';
import { usePageEditor } from '@/Components/Admin/PageBuilder/PageEditorContext';
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Plus, Trash2 } from 'lucide-react';

const WhyChooseUsSection = () => {
  const {
    formData,
    updateFormData,
    updateNestedFormData,
    addFile,
    isSaving,
    handleSubmit
  } = usePageEditor();

  const handleFileUpload = (field, files) => {
    if (files && files.length > 0) {
      addFile(field, files[0]);
    }
  };

  const addFeature = () => {
    const features = [...(formData.why_choose_us_features || [])];
    features.push({
      title: '',
      text: '',
      icon: 'star',
    });
    updateFormData('why_choose_us_features', features);
  };

  const removeFeature = (index) => {
    const features = [...(formData.why_choose_us_features || [])];
    features.splice(index, 1);
    updateFormData('why_choose_us_features', features);
  };

  const updateFeature = (index, field, value) => {
    updateNestedFormData(`why_choose_us_features.${index}.${field}`, value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Enable/Disable Section */}
      <div className="flex items-center justify-between">
        <Label htmlFor="why_choose_us_enabled">Enable Why Choose Us Section</Label>
        <Switch
          id="why_choose_us_enabled"
          checked={formData.why_choose_us_enabled}
          onCheckedChange={(checked) => updateFormData('why_choose_us_enabled', checked)}
        />
      </div>

      {/* Section Title */}
      <div className="space-y-2">
        <Label htmlFor="why_choose_us_title">Section Title</Label>
        <Input
          id="why_choose_us_title"
          value={formData.why_choose_us_title || ''}
          onChange={e => updateFormData('why_choose_us_title', e.target.value)}
          placeholder="Why Choose Us"
        />
        <p className="text-xs text-muted-foreground">
          *Add your text in [text here] to make it colorful
        </p>
      </div>

      {/* Section Description */}
      <div className="space-y-2">
        <Label htmlFor="why_choose_us_text">Section Description</Label>
        <Textarea
          id="why_choose_us_text"
          value={formData.why_choose_us_text || ''}
          onChange={e => updateFormData('why_choose_us_text', e.target.value)}
          placeholder="We offer the best food delivery service"
          rows={3}
        />
      </div>

      {/* Section Image */}
      <div className="space-y-2">
        <Label>Section Image</Label>
        <FileUploader
          maxFiles={1}
          onUpload={(files) => handleFileUpload('why_choose_us_image', files)}
          className="min-h-[200px]"
          value={formData.why_choose_us_image}
        />
      </div>

      {/* Layout Options */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="why_choose_us_layout">Layout</Label>
          <Select
            value={formData.why_choose_us_layout || 'side-by-side'}
            onValueChange={value => updateFormData('why_choose_us_layout', value)}
          >
            <SelectTrigger id="why_choose_us_layout">
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="side-by-side">Side by Side</SelectItem>
              <SelectItem value="stacked">Stacked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="why_choose_us_image_position">Image Position</Label>
          <Select
            value={formData.why_choose_us_image_position || 'right'}
            onValueChange={value => updateFormData('why_choose_us_image_position', value)}
          >
            <SelectTrigger id="why_choose_us_image_position">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Features</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFeature}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Feature
          </Button>
        </div>

        <div className="space-y-4">
          {(formData.why_choose_us_features || []).map((feature, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">Feature {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFeature(index)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`feature_${index}_title`}>Title</Label>
                  <Input
                    id={`feature_${index}_title`}
                    value={feature.title || ''}
                    onChange={e => updateFeature(index, 'title', e.target.value)}
                    placeholder="Feature title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`feature_${index}_text`}>Description</Label>
                  <Textarea
                    id={`feature_${index}_text`}
                    value={feature.text || ''}
                    onChange={e => updateFeature(index, 'text', e.target.value)}
                    placeholder="Feature description"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`feature_${index}_icon`}>Icon</Label>
                  <Select
                    value={feature.icon || 'star'}
                    onValueChange={value => updateFeature(index, 'icon', value)}
                  >
                    <SelectTrigger id={`feature_${index}_icon`}>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="utensils">Utensils</SelectItem>
                      <SelectItem value="clock">Clock</SelectItem>
                      <SelectItem value="shield">Shield</SelectItem>
                      <SelectItem value="star">Star</SelectItem>
                      <SelectItem value="heart">Heart</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="map">Map</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}

          {(!formData.why_choose_us_features || formData.why_choose_us_features.length === 0) && (
            <div className="text-center py-4 text-muted-foreground">
              No features added yet. Click "Add Feature" to create your first feature.
            </div>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
};

export default WhyChooseUsSection; 