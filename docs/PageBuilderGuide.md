# Page Builder Documentation

## Overview

The Page Builder is a flexible system for managing the layout and content of your website's homepage. It allows you to:

- Enable/disable different content sections
- Customize each section's appearance and content
- Change global settings like colors, fonts, and layout
- Preview changes before publishing

## Table of Contents

1. [Architecture](#architecture)
2. [Core Components](#core-components)
3. [How It Works](#how-it-works)
4. [Available Sections](#available-sections)
5. [Adding a New Section](#adding-a-new-section)
6. [Common Issues and Solutions](#common-issues-and-solutions)
7. [Best Practices](#best-practices)

## Architecture

The Page Builder follows a clean architecture pattern with these main components:

### Backend (PHP/Laravel)

- **HomepageEditorService**: Main service that handles loading, updating, and processing homepage settings
- **HomepageController**: Controller that handles HTTP requests for the page builder
- **Option Model**: Database model for storing page builder settings

### Frontend (React/Inertia.js)

- **PageEditorProvider**: Context provider that manages state for the page builder
- **SectionContent**: Component that renders the content area for each section
- **SectionNavigation**: Component that renders the navigation sidebar
- **Individual Section Components**: Components specific to each section (HeroSection, WhyChooseUsSection, etc.)

## Core Components

### PageEditorContext.jsx

This is the heart of the page builder frontend. It provides:

- State management for form data
- Functions for updating form values
- File upload handling
- Form submission
- Error handling

### SectionContent.jsx

Renders the content area for the currently selected section. It receives a section prop and children, and only renders the children when the section is active.

### SectionNavigation.jsx

Renders the navigation sidebar that allows users to switch between different sections. It also shows validation errors and save status.

## How It Works

1. **Data Loading**: When the page loads, the `HomepageController` fetches settings from the database via `HomepageEditorService`
2. **Initialization**: Data is passed to the React frontend where `PageEditorProvider` initializes state
3. **Editing**: Users edit sections using the form interfaces
4. **Submission**: When saved, data is sent back to the server, validated, and stored in the database
5. **Frontend Rendering**: The saved settings are used to render the actual homepage

## Available Sections

The page builder comes with these pre-built sections:

1. **Hero Section**: Configure a hero banner or slider
2. **Why Choose Us**: Highlight your company's unique selling points
3. **Top Categories**: Display popular product or content categories
4. **Client Feedback**: Show testimonials from happy customers
5. **Global Settings**: Configure global appearance settings

## Adding a New Section

Follow these steps to add a new custom section to the page builder:

### 1. Backend Setup

First, update the default settings in `HomepageEditorService.php`:

```php
public function getDefaultSettings(): array
{
    return [
        // ... existing settings
        
        // Add your new section defaults
        'your_section_enabled' => true,
        'your_section_title' => 'Your Section Title',
        'your_section_content' => 'Your default content',
        // Add any other settings needed
    ];
}
```

### 2. Create a React Component

Create a new file for your section in the `resources/js/Pages/Admin/Appearance/Homepage/Sections` directory:

```jsx
// YourNewSection.jsx
import React from 'react';
import { usePageEditor } from '@/Components/Admin/PageBuilder/PageEditorContext';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import { ErrorBoundary } from '@/Components/ui/error-boundary';

const YourNewSection = () => {
  const {
    formData,
    updateFormData,
    isSaving,
    handleSubmit
  } = usePageEditor();

  return (
    <ErrorBoundary>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Enable/Disable Section */}
        <div className="flex items-center justify-between">
          <Label htmlFor="your_section_enabled">Enable Your Section</Label>
          <Switch
            id="your_section_enabled"
            checked={formData.your_section_enabled}
            onCheckedChange={(checked) => updateFormData('your_section_enabled', checked)}
          />
        </div>

        {/* Your section form fields */}
        <div className="space-y-2">
          <Label htmlFor="your_section_title">Title</Label>
          <Input
            id="your_section_title"
            value={formData.your_section_title || ''}
            onChange={e => updateFormData('your_section_title', e.target.value)}
            placeholder="Enter section title"
          />
        </div>

        {/* Add more form fields as needed */}

        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </ErrorBoundary>
  );
};

export default YourNewSection;
```

### 3. Update the Homepage Index Component

Add your new section to the `SECTIONS` array in `resources/js/Pages/Admin/Appearance/Homepage/Index.jsx`:

```jsx
const SECTIONS = [
  { id: 'hero', label: 'Hero Section', default: true },
  { id: 'top_categories', label: 'Top Categories' },
  { id: 'why_choose_us', label: 'Why Choose Us' },
  { id: 'client_feedback', label: 'Client Feedback' },
  { id: 'your_section', label: 'Your New Section' }, // Add this line
  { id: 'global_settings', label: 'Global Settings' },
];

// Then also add it to the SectionContent mapping
<SectionContent key={section.id} section={section}>
  {section.id === 'hero' && (
    <HeroSection />
  )}
  {/* ... other sections ... */}
  {section.id === 'your_section' && (
    <YourNewSection />
  )}
  {section.id === 'global_settings' && (
    <GlobalSettingsSection />
  )}
</SectionContent>
```

### 4. Update the Frontend Rendering

Create a component for rendering your section on the frontend and add it to the homepage.

### 5. Add Form Validation (Optional)

Update `app/Http/Requests/Admin/Appearance/UpdateHomepageRequest.php` to add validation rules:

```php
public function rules(): array
{
    return [
        // ... existing rules
        
        // Your new section rules
        'your_section_enabled' => 'boolean',
        'your_section_title' => 'nullable|string|max:200',
        'your_section_content' => 'nullable|string|max:1000',
        // Add other validation rules as needed
    ];
}
```

## Common Issues and Solutions

### 1. Null/Undefined Values

**Issue**: Some properties might be undefined or null, causing errors.

**Solution**: Always use default values and optional chaining:

```jsx
value={formData.your_property || ''}
onChange={e => updateFormData('your_property', e.target.value)}
```

### 2. Array Handling

**Issue**: Arrays might not be initialized properly or might be stored as strings.

**Solution**: Always check if values are arrays before using array methods:

```jsx
const items = Array.isArray(formData.your_array) ? formData.your_array : [];
```

### 3. Image Upload Issues

**Issue**: Uploaded images might not appear or save correctly.

**Solution**: Make sure to use the `addFile` function from the context:

```jsx
const handleFileUpload = (field, files) => {
  if (files && files.length > 0) {
    addFile(field, files[0]);
  }
};
```

## Best Practices

1. **Defensive Programming**: Always check for null/undefined values
2. **Error Handling**: Use try/catch blocks and ErrorBoundary components
3. **Type Checking**: Verify data types before operations (especially for arrays)
4. **Validation**: Add proper validation rules on the backend
5. **Reusable Components**: Create reusable UI components for consistent interfaces
6. **Documentation**: Document any new sections or features you add

## Page Builder Lifecycle

1. **Loading**: Page loads and fetches settings from the database
2. **Initialization**: PageEditorProvider initializes with the settings data
3. **Editing**: User makes changes to different sections
4. **Validation**: Client-side validation occurs during editing
5. **Submission**: Form is submitted to the server
6. **Server Validation**: Server validates the data
7. **Storage**: Valid data is stored in the database
8. **Rendering**: Frontend homepage uses the stored settings for rendering

This lifecycle ensures that the page builder is always in a consistent state and that invalid data is caught before it affects the live site. 