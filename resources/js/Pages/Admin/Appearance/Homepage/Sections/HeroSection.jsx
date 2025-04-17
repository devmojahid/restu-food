import React, { useState } from 'react';
import { useForm } from "@inertiajs/react";
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
  const { handleSave, isSaving } = usePageEditor();
  const [activeTab, setActiveTab] = useState('single');
  const { data, setData } = useForm({
    hero_enabled: true,
    hero_type: 'single', // 'single' or 'slider'
    hero_title: '',
    hero_subtitle: '',
    hero_image: null,
    hero_cta_text: '',
    hero_cta_link: '',
    hero_background_overlay: 0.5,
    hero_text_alignment: 'center',
    hero_slides: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSave(data);
  };

  const addSlide = () => {
    setData('hero_slides', [
      ...data.hero_slides,
      {
        id: Date.now(),
        title: '',
        description: '',
        image: null,
        cta: {
          text: '',
          link: ''
        }
      }
    ]);
  };

  const removeSlide = (index) => {
    setData('hero_slides', data.hero_slides.filter((_, i) => i !== index));
  };

  const moveSlide = (index, direction) => {
    const newSlides = [...data.hero_slides];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newSlides.length) {
      [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
      setData('hero_slides', newSlides);
    }
  };

  const updateSlide = (index, field, value) => {
    const newSlides = [...data.hero_slides];
    if (field.startsWith('cta.')) {
      const ctaField = field.split('.')[1];
      newSlides[index].cta[ctaField] = value;
    } else {
      newSlides[index][field] = value;
    }
    setData('hero_slides', newSlides);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Enable/Disable Section */}
      <div className="flex items-center justify-between">
        <Label>Enable Hero Section</Label>
        <Switch
          checked={data.hero_enabled}
          onCheckedChange={(checked) => setData('hero_enabled', checked)}
        />
      </div>

      {/* Hero Type Selection */}
      <div className="space-y-2">
        <Label>Hero Type</Label>
        <Select
          value={data.hero_type}
          onValueChange={(value) => {
            setData('hero_type', value);
            setActiveTab(value);
          }}
        >
          <SelectTrigger>
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
            <Label>Title</Label>
            <Input
              value={data.hero_title}
              onChange={e => setData('hero_title', e.target.value)}
              placeholder="Type your hero title"
            />
            <p className="text-xs text-muted-foreground">
              *Add your text in [text here] to make it colorful
            </p>
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={data.hero_subtitle}
              onChange={e => setData('hero_subtitle', e.target.value)}
              placeholder="Type your hero subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label>Background Image</Label>
            <FileUploader
              maxFiles={1}
              value={data.hero_image}
              onUpload={(files) => setData('hero_image', files[0])}
              className="min-h-[200px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CTA Text</Label>
              <Input
                value={data.hero_cta_text}
                onChange={e => setData('hero_cta_text', e.target.value)}
                placeholder="Order Now"
              />
            </div>
            <div className="space-y-2">
              <Label>CTA Link</Label>
              <Input
                value={data.hero_cta_link}
                onChange={e => setData('hero_cta_link', e.target.value)}
                placeholder="/restaurants"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Text Alignment</Label>
            <Select
              value={data.hero_text_alignment}
              onValueChange={value => setData('hero_text_alignment', value)}
            >
              <SelectTrigger>
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
            <Label>Background Overlay Opacity</Label>
            <Input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={data.hero_background_overlay}
              onChange={e => setData('hero_background_overlay', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">
              Current value: {data.hero_background_overlay}
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
            {data.hero_slides.map((slide, index) => (
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
                      disabled={index === data.hero_slides.length - 1}
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
                    <Label>Title</Label>
                    <Input
                      value={slide.title}
                      onChange={e => updateSlide(index, 'title', e.target.value)}
                      placeholder="Slide title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={slide.description}
                      onChange={e => updateSlide(index, 'description', e.target.value)}
                      placeholder="Slide description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Background Image</Label>
                    <FileUploader
                      maxFiles={1}
                      value={slide.image}
                      onUpload={(files) => updateSlide(index, 'image', files[0])}
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>CTA Text</Label>
                      <Input
                        value={slide.cta.text}
                        onChange={e => updateSlide(index, 'cta.text', e.target.value)}
                        placeholder="Order Now"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CTA Link</Label>
                      <Input
                        value={slide.cta.link}
                        onChange={e => updateSlide(index, 'cta.link', e.target.value)}
                        placeholder="/restaurants"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {data.hero_slides.length === 0 && (
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
