import React, { useEffect, useCallback, useMemo } from 'react';
import { usePageEditor } from '@/Components/Admin/PageBuilder/PageEditorContext';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Plus, Trash2, MoveUp, MoveDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/Components/ui/error-boundary';
import { Alert, AlertDescription } from '@/Components/ui/alert';

// Constants for better maintainability
const HERO_TYPES = {
  SINGLE: 'single',
  SLIDER: 'slider'
};

const TEXT_ALIGNMENTS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' }
];

const DEFAULT_SLIDE = {
  id: null,
  title: '',
  description: '',
  image: null,
  cta: {
    text: '',
    link: ''
  }
};

const HeroSection = () => {
  const {
    formData,
    updateFormData,
    addFile,
    isSaving,
    handleSubmit,
    errors
  } = usePageEditor();

  // Memoized values for better performance
  const heroType = useMemo(() => formData.hero_type || HERO_TYPES.SINGLE, [formData.hero_type]);
  const heroSlides = useMemo(() => Array.isArray(formData.hero_slides) ? formData.hero_slides : [], [formData.hero_slides]);
  const overlayValue = useMemo(() => formData.hero_background_overlay || 0.5, [formData.hero_background_overlay]);

  // Set default tab based on hero_type
  const [activeTab, setActiveTab] = React.useState(heroType);

  // Update tab when hero_type changes
  useEffect(() => {
    setActiveTab(heroType);
  }, [heroType]);

  // Fixed updateSlide function - this was the main issue
  const updateSlide = useCallback((index, field, value) => {
    if (index < 0 || index >= heroSlides.length) return;

    const updatedSlides = heroSlides.map((slide, i) => {
      if (i !== index) return slide;

      const updatedSlide = { ...slide };

      if (field.startsWith('cta.')) {
        const ctaField = field.split('.')[1];
        updatedSlide.cta = { ...updatedSlide.cta, [ctaField]: value };
      } else {
        updatedSlide[field] = value;
      }

      return updatedSlide;
    });

    updateFormData('hero_slides', updatedSlides);
  }, [heroSlides, updateFormData]);

  // File upload handler
  const handleFileUpload = useCallback((field, files) => {
    if (files) {
      // If files is an array and has items
      if (Array.isArray(files) && files.length > 0) {
        addFile(field, files[0]);
      }
      // If files is a single file object
      else if (!Array.isArray(files) && typeof files === 'object') {
        addFile(field, files);
      }
    }
  }, [addFile]);

  // NEW: Special file upload handler for slider images
  const handleSliderImageUpload = useCallback((slideIndex, files) => {
    if (!files) return;

    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;

    // First, add to files for upload (using the nested path for backend processing)
    addFile(`hero_slides.${slideIndex}.image`, file);

    // Then update the slide with the image file - this ensures the nested update works properly
    updateSlide(slideIndex, 'image', file);
  }, [addFile, updateSlide]);

  // Slide management functions
  const addSlide = useCallback(() => {
    const newSlide = {
      ...DEFAULT_SLIDE,
      id: Date.now()
    };

    const updatedSlides = [...heroSlides, newSlide];
    updateFormData('hero_slides', updatedSlides);
  }, [heroSlides, updateFormData]);

  const removeSlide = useCallback((index) => {
    if (index < 0 || index >= heroSlides.length) return;

    const updatedSlides = heroSlides.filter((_, i) => i !== index);
    updateFormData('hero_slides', updatedSlides);
  }, [heroSlides, updateFormData]);

  const moveSlide = useCallback((index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= heroSlides.length) return;

    const updatedSlides = [...heroSlides];
    [updatedSlides[index], updatedSlides[newIndex]] = [updatedSlides[newIndex], updatedSlides[index]];

    updateFormData('hero_slides', updatedSlides);
  }, [heroSlides, updateFormData]);



  // Error checking functions
  const hasSlideErrors = useCallback(() => {
    return Object.keys(errors || {}).some(key => key.startsWith('hero_slides'));
  }, [errors]);

  const getFieldError = useCallback((fieldName) => {
    return errors?.[fieldName];
  }, [errors]);

  // Handle hero type change
  const handleHeroTypeChange = useCallback((value) => {
    updateFormData('hero_type', value);
    setActiveTab(value);
  }, [updateFormData]);

  // Handle overlay change
  const handleOverlayChange = useCallback((e) => {
    updateFormData('hero_background_overlay', parseFloat(e.target.value));
  }, [updateFormData]);

  return (
    <ErrorBoundary>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Enable/Disable Section */}
        <div className="flex items-center justify-between">
          <Label htmlFor="hero_enabled">Enable Hero Section</Label>
          <Switch
            id="hero_enabled"
            checked={!!formData.hero_enabled}
            onCheckedChange={(checked) => updateFormData('hero_enabled', checked)}
          />
        </div>

        {/* Hero Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="hero_type">Hero Type</Label>
          <Select
            value={heroType}
            onValueChange={handleHeroTypeChange}
          >
            <SelectTrigger id="hero_type">
              <SelectValue placeholder="Select Hero Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={HERO_TYPES.SINGLE}>Single Hero</SelectItem>
              <SelectItem value={HERO_TYPES.SLIDER}>Slider Hero</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value={HERO_TYPES.SINGLE}>Single Hero</TabsTrigger>
            <TabsTrigger value={HERO_TYPES.SLIDER}>Slider Hero</TabsTrigger>
          </TabsList>

          {/* Single Hero Content */}
          <TabsContent value={HERO_TYPES.SINGLE} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hero_title">Title</Label>
              <Input
                id="hero_title"
                value={formData.hero_title || ''}
                onChange={e => updateFormData('hero_title', e.target.value)}
                placeholder="Type your hero title"
                className={cn(getFieldError('hero_title') && 'border-red-500')}
              />
              {getFieldError('hero_title') && (
                <p className="text-xs text-red-500">{getFieldError('hero_title')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero_subtitle">Subtitle</Label>
              <Input
                id="hero_subtitle"
                value={formData.hero_subtitle || ''}
                onChange={e => updateFormData('hero_subtitle', e.target.value)}
                placeholder="Type your hero subtitle"
                className={cn(getFieldError('hero_subtitle') && 'border-red-500')}
              />
              {getFieldError('hero_subtitle') && (
                <p className="text-xs text-red-500">{getFieldError('hero_subtitle')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Background Image</Label>
              <FileUploader
                maxFiles={1}
                collection="hero_image"
                onUpload={(files) => handleFileUpload('hero_image', files)}
                className="min-h-[200px]"
                value={formData.hero_image}
              />
              {getFieldError('hero_image') && (
                <p className="text-xs text-red-500">{getFieldError('hero_image')}</p>
              )}
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
                  {TEXT_ALIGNMENTS.map(alignment => (
                    <SelectItem key={alignment.value} value={alignment.value}>
                      {alignment.label}
                    </SelectItem>
                  ))}
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
                value={overlayValue}
                onChange={handleOverlayChange}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                Current value: {overlayValue}
              </div>
            </div>
          </TabsContent>

          {/* Slider Hero Content */}
          <TabsContent value={HERO_TYPES.SLIDER} className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Slider Slides</h3>
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

            {hasSlideErrors() && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the errors in your slider configuration before saving
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              {heroSlides.map((slide, index) => (
                <Card key={slide.id || index} className="p-6">
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
                        disabled={index === heroSlides.length - 1}
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
                        className={cn(getFieldError(`hero_slides.${index}.title`) && 'border-red-500')}
                      />
                      {getFieldError(`hero_slides.${index}.title`) && (
                        <p className="text-xs text-red-500">
                          {getFieldError(`hero_slides.${index}.title`)}
                        </p>
                      )}
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
                        onUpload={(files) => handleSliderImageUpload(index, files)}
                        collection={`hero_slides.${index}.image`}
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

              {heroSlides.length === 0 && (
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
    </ErrorBoundary>
  );
};

export default HeroSection;