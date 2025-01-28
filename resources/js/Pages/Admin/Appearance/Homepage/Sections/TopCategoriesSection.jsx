import React from 'react';
import { useForm } from "@inertiajs/react";
import { usePageEditor } from '@/Components/Admin/PageBuilder/PageEditorContext';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";

const TopCategoriesSection = () => {
  const { handleSave, isSaving } = usePageEditor();
  const { data, setData } = useForm({
    title: '',
    categories: [],
    hover_background: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={data.title}
          onChange={e => setData('title', e.target.value)}
          placeholder="Type text"
        />
        <p className="text-xs text-muted-foreground">
          *Add your text in [text here] to make it colorful
        </p>
      </div>

      {/* Categories Select */}
      <div className="space-y-2">
        <Label>Top Categories</Label>
        <Select
          value={data.categories}
          onValueChange={value => setData('categories', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Top Categories" />
          </SelectTrigger>
          <SelectContent>
            {/* Add your categories here */}
          </SelectContent>
        </Select>
      </div>

      {/* Hover Background Image */}
      <div className="space-y-2">
        <Label>Hover Background Image</Label>
        <FileUploader
          maxFiles={1}
          value={data.hover_background}
          onUpload={(files) => setData('hover_background', files[0])}
          className="min-h-[200px]"
        />
      </div>

      <Button type="submit" disabled={isSaving}>
        Save
      </Button>
    </form>
  );
};

export default TopCategoriesSection; 