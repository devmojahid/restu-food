import React from 'react';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Loader2, Save, Upload } from "lucide-react";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";

const FeedbackForm = ({ data, setData, onSubmit, isSubmitting }) => {
  const handleChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Add New Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Type reviewer name"
              className="max-w-md"
            />
          </div>

          {/* Rating Select */}
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Select
              value={data.rating}
              onValueChange={value => handleChange('rating', value)}
            >
              <SelectTrigger id="rating" className="max-w-[200px]">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(num => (
                  <SelectItem 
                    key={num} 
                    value={num.toString()}
                    className="flex items-center gap-2"
                  >
                    <span>{num}</span>
                    <div className="flex">
                      {Array.from({ length: num }).map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Review Textarea */}
          <div className="space-y-2">
            <Label htmlFor="review">Review</Label>
            <Textarea
              id="review"
              value={data.review}
              onChange={e => handleChange('review', e.target.value)}
              placeholder="Type review"
              className="min-h-[100px]"
            />
          </div>

          {/* Avatar Upload */}
          <div className="space-y-2">
            <Label>Avatar Image</Label>
            <FileUploader
              maxFiles={1}
              value={data.avatar}
              onUpload={files => handleChange('avatar', files[0])}
              accept={{
                'image/*': ['.png', '.jpg', '.jpeg', '.gif']
              }}
              className="max-w-md"
            >
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50">
                {data.avatar ? (
                  <div className="relative group">
                    <img
                      src={typeof data.avatar === 'string' ? data.avatar : URL.createObjectURL(data.avatar)}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click or drag image to upload
                    </p>
                  </>
                )}
              </div>
            </FileUploader>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm; 