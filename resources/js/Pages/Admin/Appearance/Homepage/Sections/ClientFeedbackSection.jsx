import React from 'react';
import { usePageEditor } from '@/Components/Admin/PageBuilder/PageEditorContext';
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/Components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import { Plus, Trash2, Star, Calendar } from 'lucide-react';
import { Badge } from "@/Components/ui/badge";

const ClientFeedbackSection = () => {
  const {
    formData,
    updateFormData,
    updateNestedFormData,
    addFile,
    isSaving,
    handleSubmit,
    isDirty
  } = usePageEditor();

  const handleFileUpload = (field, files) => {
    if (files && files.length > 0) {
      addFile(field, files[0]);
    }
  };

  const addFeedback = () => {
    const feedbacks = [...(formData.feedbacks || [])];
    feedbacks.push({
      id: Date.now(),
      name: '',
      review: '',
      rating: 5,
      avatar: null,
      date: new Date().toISOString().split('T')[0],
    });
    updateFormData('feedbacks', feedbacks);
  };

  const removeFeedback = (index) => {
    const feedbacks = [...(formData.feedbacks || [])];
    feedbacks.splice(index, 1);
    updateFormData('feedbacks', feedbacks);
  };

  const updateFeedback = (index, field, value) => {
    updateNestedFormData(`feedbacks.${index}.${field}`, value);
  };

  const renderStarRating = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Settings Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Client Feedback Settings</CardTitle>
            {isDirty && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                Unsaved Changes
              </Badge>
            )}
          </div>
          <CardDescription>
            Showcase testimonials from happy customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Enable/Disable Section */}
            <div className="flex items-center justify-between">
              <Label htmlFor="client_feedback_enabled" className="flex flex-col">
                <span className="text-sm">Enable Testimonials Section</span>
                <span className="text-xs text-muted-foreground">Display customer testimonials on homepage</span>
              </Label>
              <Switch
                id="client_feedback_enabled"
                checked={formData.client_feedback_enabled ?? true}
                onCheckedChange={(checked) => updateFormData('client_feedback_enabled', checked)}
              />
            </div>

            {/* Section Title */}
            <div className="space-y-2">
              <Label htmlFor="client_feedback_title">Section Title</Label>
              <Input
                id="client_feedback_title"
                value={formData.client_feedback_title || ''}
                onChange={e => updateFormData('client_feedback_title', e.target.value)}
                placeholder="What Our Customers Say"
              />
              <p className="text-xs text-muted-foreground">
                *Add your text in [text here] to make it colorful
              </p>
            </div>

            {/* Section Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="client_feedback_subtitle">Section Subtitle</Label>
              <Textarea
                id="client_feedback_subtitle"
                value={formData.client_feedback_subtitle || ''}
                onChange={e => updateFormData('client_feedback_subtitle', e.target.value)}
                placeholder="Read what our customers say about us"
                rows={2}
              />
            </div>

            {/* Layout Style */}
            <div className="space-y-2">
              <Label htmlFor="client_feedback_layout">Layout Style</Label>
              <Select
                value={formData.client_feedback_layout || 'grid'}
                onValueChange={value => updateFormData('client_feedback_layout', value)}
              >
                <SelectTrigger id="client_feedback_layout">
                  <SelectValue placeholder="Select layout style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                  <SelectItem value="masonry">Masonry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Columns */}
            <div className="space-y-2">
              <Label htmlFor="client_feedback_columns">Number of Columns</Label>
              <Select
                value={formData.client_feedback_columns?.toString() || "3"}
                onValueChange={value => updateFormData('client_feedback_columns', parseInt(value))}
              >
                <SelectTrigger id="client_feedback_columns">
                  <SelectValue placeholder="Select columns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Show Rating */}
            <div className="flex items-center justify-between">
              <Label htmlFor="client_feedback_show_rating" className="flex flex-col">
                <span className="text-sm">Show Rating</span>
                <span className="text-xs text-muted-foreground">Display star ratings with testimonials</span>
              </Label>
              <Switch
                id="client_feedback_show_rating"
                checked={formData.client_feedback_show_rating ?? true}
                onCheckedChange={(checked) => updateFormData('client_feedback_show_rating', checked)}
              />
            </div>

            {/* Show Date */}
            <div className="flex items-center justify-between">
              <Label htmlFor="client_feedback_show_date" className="flex flex-col">
                <span className="text-sm">Show Date</span>
                <span className="text-xs text-muted-foreground">Display review date with testimonials</span>
              </Label>
              <Switch
                id="client_feedback_show_date"
                checked={formData.client_feedback_show_date ?? true}
                onCheckedChange={(checked) => updateFormData('client_feedback_show_date', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Testimonials</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFeedback}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        </div>

        {(!formData.feedbacks || formData.feedbacks.length === 0) && (
          <Card className="bg-muted/50">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No testimonials added yet. Click "Add Testimonial" to get started.
              </p>
            </CardContent>
          </Card>
        )}

        {(formData.feedbacks || []).map((feedback, index) => (
          <Card key={feedback.id || index} className="overflow-hidden">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Testimonial {index + 1}</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFeedback(index)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-4 space-y-4">
              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor={`feedback_${index}_name`}>Customer Name</Label>
                <Input
                  id={`feedback_${index}_name`}
                  value={feedback.name || ''}
                  onChange={e => updateFeedback(index, 'name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <Label htmlFor={`feedback_${index}_review`}>Review</Label>
                <Textarea
                  id={`feedback_${index}_review`}
                  value={feedback.review || ''}
                  onChange={e => updateFeedback(index, 'review', e.target.value)}
                  placeholder="The food delivery service is exceptional! I love how I can track my order in real-time..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Rating */}
                <div className="space-y-2">
                  <Label htmlFor={`feedback_${index}_rating`}>Rating</Label>
                  <Select
                    value={(feedback.rating || 5).toString()}
                    onValueChange={value => updateFeedback(index, 'rating', parseInt(value))}
                  >
                    <SelectTrigger id={`feedback_${index}_rating`}>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(rating => (
                        <SelectItem key={rating} value={rating.toString()}>
                          <div className="flex items-center gap-2">
                            <span>{rating}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                />
                              ))}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor={`feedback_${index}_date`}>Date</Label>
                  <Input
                    id={`feedback_${index}_date`}
                    type="date"
                    value={feedback.date || ''}
                    onChange={e => updateFeedback(index, 'date', e.target.value)}
                  />
                </div>
              </div>

              {/* Avatar */}
              <div className="space-y-2">
                <Label>Customer Avatar</Label>
                <FileUploader
                  maxFiles={1}
                  onUpload={(files) => {
                    if (files && files.length > 0) {
                      addFile(`feedbacks.${index}.avatar`, files[0]);
                      // Add a preview URL
                      updateFeedback(index, 'avatar', URL.createObjectURL(files[0]));
                    }
                  }}
                  className="min-h-[120px]"
                  value={feedback.avatar}
                />
              </div>
            </CardContent>

            {/* Preview */}
            <CardFooter className="bg-muted/10 border-t">
              <div className="w-full">
                <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                <div className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                      {feedback.avatar ? (
                        <img src={feedback.avatar} alt={feedback.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          {feedback.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{feedback.name || 'Anonymous'}</div>
                      {formData.client_feedback_show_rating && (
                        <div className="flex">{renderStarRating(feedback.rating || 5)}</div>
                      )}
                    </div>
                    {formData.client_feedback_show_date && feedback.date && (
                      <div className="ml-auto flex items-center text-xs text-muted-foreground">
                        <Calendar size={12} className="mr-1" />
                        {feedback.date}
                      </div>
                    )}
                  </div>
                  <p className="text-sm">
                    {feedback.review || 'No review text yet...'}
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
};

export default ClientFeedbackSection; 