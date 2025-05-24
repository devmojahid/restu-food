import React, { useEffect } from 'react';
import { usePageEditor } from '@/Components/Admin/PageBuilder/PageEditorContext';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const HeroSection = () => {
  // Get context values
  const {
    formData,
    updateFormData,
    updateNestedFormData,
    addFile,
    isSaving,
    handleSubmit
  } = usePageEditor();

  // Set default tab based on hero_type
  const [activeTab, setActiveTab] = React.useState(formData.hero_type || 'single');

  // Update tab when hero_type changes
  useEffect(() => {
    if (formData.hero_type) {
      setActiveTab(formData.hero_type);
    }
  }, [formData.hero_type]);

  const handleFileUpload = (field, files) => {
    if (files && files.length > 0) {
      addFile(field, files[0]);
    }
  };

  const addSlide = () => {
    const slides = [...(formData.hero_slides || [])];
    slides.push({
      id: Date.now(),
      title: '',
      description: '',
      image: null,
      cta: {
        text: '',
        link: ''
      }
    });
    updateFormData('hero_slides', slides);
  };

  const removeSlide = (index) => {
    const slides = [...(formData.hero_slides || [])];
    slides.splice(index, 1);
    updateFormData('hero_slides', slides);
  };

  const moveSlide = (index, direction) => {
    const slides = [...(formData.hero_slides || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < slides.length) {
      [slides[index], slides[newIndex]] = [slides[newIndex], slides[index]];
      updateFormData('hero_slides', slides);
    }
  };

  const updateSlide = (index, field, value) => {
    if (field.startsWith('cta.')) {
      const ctaField = field.split('.')[1];
      updateNestedFormData(`hero_slides.${index}.cta.${ctaField}`, value);
    } else {
      updateNestedFormData(`hero_slides.${index}.${field}`, value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Enable/Disable Section */}
      <div className="flex items-center justify-between">
        <Label htmlFor="hero_enabled">Enable Hero Section</Label>
        <Switch
          id="hero_enabled"
          checked={formData.hero_enabled}
          onCheckedChange={(checked) => updateFormData('hero_enabled', checked)}
        />
      </div>

      {/* Hero Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="hero_type">Hero Type</Label>
        <Select
          value={formData.hero_type || 'single'}
          onValueChange={(value) => {
            updateFormData('hero_type', value);
            setActiveTab(value);
          }}
        >
          <SelectTrigger id="hero_type">
            <SelectValue placeholder="Select Hero Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single Hero</SelectItem>
            <SelectItem value="slider">Slider Hero</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single Hero</TabsTrigger>
          <TabsTrigger value="slider">Slider Hero</TabsTrigger>
        </TabsList>

        {/* Single Hero Content */}
        <TabsContent value="single" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hero_title">Title</Label>
            <Input
              id="hero_title"
              value={formData.hero_title || ''}
              onChange={e => updateFormData('hero_title', e.target.value)}
              placeholder="Type your hero title"
            />
            <p className="text-xs text-muted-foreground">
              *Add your text in [text here] to make it colorful
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_subtitle">Subtitle</Label>
            <Input
              id="hero_subtitle"
              value={formData.hero_subtitle || ''}
              onChange={e => updateFormData('hero_subtitle', e.target.value)}
              placeholder="Type your hero subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label>Background Image</Label>
            <FileUploader
              maxFiles={1}
              onUpload={(files) => handleFileUpload('hero_image', files)}
              className="min-h-[200px]"
              // Show existing image if available
              value={formData.hero_image}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hero_cta_text">CTA Text</Label>
              <Input
                id="hero_cta_text"
                value={formData.hero_cta_text || ''}
                onChange={e => updateFormData('hero_cta_text', e.target.value)}
                placeholder="Order Now"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_cta_link">CTA Link</Label>
              <Input
                id="hero_cta_link"
                value={formData.hero_cta_link || ''}
                onChange={e => updateFormData('hero_cta_link', e.target.value)}
                placeholder="/restaurants"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_text_alignment">Text Alignment</Label>
            <Select
              value={formData.hero_text_alignment || 'center'}
              onValueChange={value => updateFormData('hero_text_alignment', value)}
            >
              <SelectTrigger id="hero_text_alignment">
                <SelectValue placeholder="Select text alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_background_overlay">Background Overlay Opacity</Label>
            <Input
              id="hero_background_overlay"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formData.hero_background_overlay || 0.5}
              onChange={e => updateFormData('hero_background_overlay', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">
              Current value: {formData.hero_background_overlay || 0.5}
            </div>
          </div>
        </TabsContent>

        {/* Slider Hero Content */}
        <TabsContent value="slider" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Slides</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSlide}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Slide
            </Button>
          </div>

          <div className="space-y-6">
            {(formData.hero_slides || []).map((slide, index) => (
              <Card key={slide.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Slide {index + 1}</h4>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSlide(index, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSlide(index, 'down')}
                      disabled={index === (formData.hero_slides?.length || 0) - 1}
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSlide(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`slide_${index}_title`}>Title</Label>
                    <Input
                      id={`slide_${index}_title`}
                      value={slide.title || ''}
                      onChange={e => updateSlide(index, 'title', e.target.value)}
                      placeholder="Slide title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`slide_${index}_description`}>Description</Label>
                    <Input
                      id={`slide_${index}_description`}
                      value={slide.description || ''}
                      onChange={e => updateSlide(index, 'description', e.target.value)}
                      placeholder="Slide description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Background Image</Label>
                    <FileUploader
                      maxFiles={1}
                      onUpload={(files) => {
                        if (files && files.length > 0) {
                          addFile(`hero_slides.${index}.image`, files[0]);
                          updateSlide(index, 'image', URL.createObjectURL(files[0]));
                        }
                      }}
                      value={slide.image}
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`slide_${index}_cta_text`}>CTA Text</Label>
                      <Input
                        id={`slide_${index}_cta_text`}
                        value={slide.cta?.text || ''}
                        onChange={e => updateSlide(index, 'cta.text', e.target.value)}
                        placeholder="Order Now"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`slide_${index}_cta_link`}>CTA Link</Label>
                      <Input
                        id={`slide_${index}_cta_link`}
                        value={slide.cta?.link || ''}
                        onChange={e => updateSlide(index, 'cta.link', e.target.value)}
                        placeholder="/restaurants"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {(!formData.hero_slides || formData.hero_slides.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No slides added yet. Click "Add Slide" to create your first slide.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
};

export default HeroSection;
