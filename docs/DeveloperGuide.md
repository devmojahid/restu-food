# Page Builder Developer Guide

This guide is intended for developers who want to extend, modify or integrate with the Page Builder system.

## Architecture Overview

The Page Builder uses a hybrid architecture with:

1. **Backend (Laravel)**: Handles data storage, validation, and processing
2. **Frontend (React/Inertia.js)**: Provides the UI for managing page sections

## Key Files

### Backend

- `app/Services/Admin/HomepageEditorService.php`: Core service for page builder functionality
- `app/Http/Controllers/Admin/Appearance/HomepageController.php`: Controller for page builder requests
- `app/Http/Requests/Admin/Appearance/UpdateHomepageRequest.php`: Request validation
- `app/Models/Option.php`: Database model for storing settings

### Frontend

- `resources/js/Components/Admin/PageBuilder/PageEditorContext.jsx`: State management
- `resources/js/Components/Admin/PageBuilder/SectionContent.jsx`: Section rendering
- `resources/js/Components/Admin/PageBuilder/SectionNavigation.jsx`: Navigation sidebar
- `resources/js/Pages/Admin/Appearance/Homepage/Index.jsx`: Main page builder component
- `resources/js/Pages/Admin/Appearance/Homepage/Sections/*.jsx`: Individual section components

## Data Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Frontend UI    │    │ Backend Service │    │    Database     │
│  (React/Inertia)│    │    (Laravel)    │    │    (MySQL)      │
└────────┬────────┘    └────────┬────────┘    └────────┬────────┘
         │                      │                      │
         │ User Input           │                      │
         ├──────────────────────┘                      │
         │                                             │
         │ HTTP Request                                │
         ├──────────────────────┐                      │
         │                      │                      │
         │                      │ Save Settings        │
         │                      ├──────────────────────┘
         │                      │                      
         │ Response             │ Query Settings       
         ├──────────────────────┤                      
         │                      ├──────────────────────┘
```

## Database Structure

The page builder uses the `options` table with a single JSON record:

```
options
├── id: int
├── key: varchar (homepage_settings)
├── value: json
├── group: varchar (appearance)
└── autoload: boolean
```

The `value` field contains a JSON object with all page builder settings:

```json
{
  "hero_enabled": true,
  "hero_type": "slider",
  "hero_title": "Welcome to our site",
  "hero_slides": [
    {
      "id": 1,
      "title": "Slide 1",
      "description": "Description for slide 1",
      "image": "path/to/image.jpg",
      "cta": {
        "text": "Learn More",
        "link": "/about"
      }
    }
  ],
  "top_categories_enabled": true,
  // ...more settings
}
```

## Adding a New Section (Developer Workflow)

### 1. Plan Your Section

Define:
- What settings will the section need?
- What dynamic data will it use?
- How will it be rendered on the frontend?

### 2. Update Backend

#### Update HomepageEditorService.php

Add default settings:

```php
public function getDefaultSettings(): array
{
    return [
        // ... existing settings
        
        // Your new section
        'new_section_enabled' => true,
        'new_section_title' => 'New Section Title',
        'new_section_items' => [],
        // Add other settings as needed
    ];
}

// If your section needs dynamic data, add a method to getDynamicData():
private function getNewSectionData(): array
{
    return [
        // Your section's dynamic data
    ];
}
```

#### Update UpdateHomepageRequest.php

Add validation rules:

```php
public function rules(): array
{
    return [
        // ... existing rules
        
        // New section rules
        'new_section_enabled' => 'boolean',
        'new_section_title' => 'nullable|string|max:200',
        'new_section_items' => 'nullable|array',
        'new_section_items.*.id' => 'required|integer',
        'new_section_items.*.title' => 'required|string|max:100',
        // Add other validation rules
    ];
}
```

### 3. Create Frontend Components

#### Create Section Component

Create `resources/js/Pages/Admin/Appearance/Homepage/Sections/NewSection.jsx`:

```jsx
import React from 'react';
import { usePageEditor } from '@/Components/Admin/PageBuilder/PageEditorContext';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import { ErrorBoundary } from '@/Components/ui/error-boundary';

const NewSection = () => {
  const {
    formData,
    updateFormData,
    updateNestedFormData,
    isSaving,
    handleSubmit,
    errors
  } = usePageEditor();

  // Helper function to ensure items is always an array
  const getItems = () => {
    return Array.isArray(formData.new_section_items) 
      ? formData.new_section_items 
      : [];
  };

  const addItem = () => {
    const items = getItems();
    items.push({
      id: Date.now(),
      title: '',
      description: ''
    });
    updateFormData('new_section_items', items);
  };

  const removeItem = (index) => {
    const items = getItems();
    items.splice(index, 1);
    updateFormData('new_section_items', items);
  };

  const updateItem = (index, field, value) => {
    updateNestedFormData(`new_section_items.${index}.${field}`, value);
  };

  return (
    <ErrorBoundary>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Enable/Disable Section */}
        <div className="flex items-center justify-between">
          <Label htmlFor="new_section_enabled">Enable New Section</Label>
          <Switch
            id="new_section_enabled"
            checked={formData.new_section_enabled}
            onCheckedChange={(checked) => updateFormData('new_section_enabled', checked)}
          />
        </div>

        {/* Section Title */}
        <div className="space-y-2">
          <Label htmlFor="new_section_title">Section Title</Label>
          <Input
            id="new_section_title"
            value={formData.new_section_title || ''}
            onChange={e => updateFormData('new_section_title', e.target.value)}
            placeholder="Enter section title"
          />
        </div>

        {/* Section Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Items</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
            >
              Add Item
            </Button>
          </div>

          {getItems().map((item, index) => (
            <div key={item.id || index} className="border p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <h4>Item {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-destructive"
                >
                  Remove
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`item_${index}_title`}>Title</Label>
                <Input
                  id={`item_${index}_title`}
                  value={item.title || ''}
                  onChange={e => updateItem(index, 'title', e.target.value)}
                  placeholder="Item title"
                />
              </div>

              <div className="space-y-2 mt-2">
                <Label htmlFor={`item_${index}_description`}>Description</Label>
                <Input
                  id={`item_${index}_description`}
                  value={item.description || ''}
                  onChange={e => updateItem(index, 'description', e.target.value)}
                  placeholder="Item description"
                />
              </div>
            </div>
          ))}

          {getItems().length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No items added yet. Click "Add Item" to create your first item.
            </div>
          )}
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </ErrorBoundary>
  );
};

export default NewSection;
```

#### Update Index.jsx

Add your new section to the SECTIONS array:

```jsx
const SECTIONS = [
  { id: 'hero', label: 'Hero Section', default: true },
  // ... other sections
  { id: 'new_section', label: 'New Section' },
  { id: 'global_settings', label: 'Global Settings' },
];

// Add it to the SectionContent mapping
<SectionContent key={section.id} section={section}>
  {section.id === 'hero' && <HeroSection />}
  {/* ... other sections */}
  {section.id === 'new_section' && <NewSection />}
  {section.id === 'global_settings' && <GlobalSettingsSection />}
</SectionContent>
```

### 4. Create Frontend Rendering Component

Create a component to render your section on the frontend:

```jsx
// resources/js/Pages/Frontend/Home/Partials/NewSection.jsx
import React from 'react';

const NewSection = ({ title, items = [] }) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div 
              key={item.id || index} 
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewSection;
```

### 5. Update Homepage.jsx

Add your section to the homepage:

```jsx
// In resources/js/Pages/Frontend/Home/Index.jsx
import NewSection from './Partials/NewSection';

// In the render function
return (
  <Layout>
    <Head title="Home" />
    
    {/* ... other sections ... */}
    
    {siteSettings?.new_section_enabled && (
      <NewSection 
        title={siteSettings.new_section_title} 
        items={Array.isArray(siteSettings.new_section_items) ? siteSettings.new_section_items : []}
      />
    )}
    
    {/* ... other sections ... */}
  </Layout>
);
```

## Type Safety and Error Handling

Always implement defensive programming when working with the page builder:

1. **Type Checking**: Verify data types before using methods like `map`, `filter`, etc.
2. **Default Values**: Provide defaults for all properties
3. **Error Boundaries**: Wrap components in ErrorBoundary
4. **Try/Catch**: Use try/catch for operations that might fail

Example:

```jsx
// Bad
const items = formData.some_array.map(item => ...);

// Good
const items = Array.isArray(formData.some_array) 
  ? formData.some_array.map(item => ...)
  : [];
```

## Debugging Tips

1. **Check Browser Console**: Many issues are visible in the browser console
2. **Laravel Logs**: Check `storage/logs/laravel.log` for backend errors
3. **Use dd() in PHP**: Use `dd()` to debug variables in PHP code
4. **React DevTools**: Use React DevTools to inspect component state
5. **Network Tab**: Check network requests to see what data is being sent/received

## Common Issues and Solutions

### 1. Data Not Saving

- Check if the form is submitting correctly
- Verify validation rules in UpdateHomepageRequest.php
- Check for PHP errors in Laravel logs

### 2. Frontend Not Updating

- Make sure PageEditorProvider is correctly initialized
- Check if the data is being passed correctly from the backend
- Verify React component rendering logic

### 3. Array Handling

- Always check if a property is an array before using array methods
- Initialize arrays properly
- Handle edge cases like empty arrays

### 4. Image Upload Issues

- Check file permissions
- Verify disk configuration in config/filesystems.php
- Ensure form has correct enctype attribute

## Performance Considerations

1. **Caching**: The page builder uses caching to improve performance
2. **Optimize Images**: Compress and resize images before uploading
3. **Lazy Loading**: Consider lazy loading components on the frontend
4. **Limit API Calls**: Minimize unnecessary API calls
5. **Debounce Input**: Use debounce for frequent input changes

## Contributing

When contributing to the page builder:

1. Follow the existing code style
2. Add proper documentation
3. Write tests for new features
4. Make sure all existing tests pass
5. Use meaningful commit messages
6. Submit a pull request with a clear description 