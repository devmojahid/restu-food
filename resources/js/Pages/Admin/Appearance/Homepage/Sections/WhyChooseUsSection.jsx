import React from 'react';
import { useForm } from "@inertiajs/react";
import { usePageEditor } from '@/Components/Admin/PageBuilder/PageEditorContext';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Plus, Trash2 } from "lucide-react";

const WhyChooseUsSection = () => {
  const { handleSave, isSaving } = usePageEditor();
  const { data, setData } = useForm({
    title: '',
    text: '',
    large_image: null,
    features: [
      { title: '', text: '' }
    ]
  });

  const addFeature = () => {
    setData('features', [...data.features, { title: '', text: '' }]);
  };

  const removeFeature = (index) => {
    setData('features', data.features.filter((_, i) => i !== index));
  };

  const updateFeature = (index, field, value) => {
    const updatedFeatures = [...data.features];
    updatedFeatures[index][field] = value;
    setData('features', updatedFeatures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title & Text */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={data.title}
            onChange={e => setData('title', e.target.value)}
            placeholder="Type title"
          />
          <p className="text-xs text-muted-foreground">
            *Add your text in [text here] to make it colorful
          </p>
        </div>

        <div className="space-y-2">
          <Label>Text</Label>
          <Textarea
            value={data.text}
            onChange={e => setData('text', e.target.value)}
            placeholder="Type text"
          />
        </div>
      </div>

      {/* Large Image */}
      <div className="space-y-2">
        <Label>Large Image</Label>
        <FileUploader
          maxFiles={1}
          value={data.large_image}
          onUpload={(files) => setData('large_image', files[0])}
          className="min-h-[200px]"
        />
      </div>

      {/* Features */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Features</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addFeature}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Feature
          </Button>
        </div>

        <div className="space-y-6">
          {data.features.map((feature, index) => (
            <div key={index} className="relative space-y-4 p-4 border rounded-lg">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeFeature(index)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>

              <div className="space-y-2">
                <Label>Feature {index + 1} Title</Label>
                <Input
                  value={feature.title}
                  onChange={e => updateFeature(index, 'title', e.target.value)}
                  placeholder="Type title"
                />
              </div>

              <div className="space-y-2">
                <Label>Feature {index + 1} Text</Label>
                <Textarea
                  value={feature.text}
                  onChange={e => updateFeature(index, 'text', e.target.value)}
                  placeholder="Type text"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isSaving}>
        Save Changes
      </Button>
    </form>
  );
};

export default WhyChooseUsSection; 