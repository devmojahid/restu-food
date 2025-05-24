import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useToast } from "@/Components/ui/use-toast";
import { router } from '@inertiajs/react';

const PageEditorContext = createContext();

export const usePageEditor = () => {
  const context = useContext(PageEditorContext);
  if (!context) {
    throw new Error('usePageEditor must be used within a PageEditorProvider');
  }
  return context;
};

export const PageEditorProvider = ({ children, initialData = {}, onSave, saveUrl }) => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(initialData || {});
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});

  // Set the first section as active by default if none is set
  useEffect(() => {
    if (!activeSection && children?.props?.sections?.length > 0) {
      const defaultSection = children.props.sections.find(section => section.default) || children.props.sections[0];
      setActiveSection(defaultSection?.id);
    }
  }, [activeSection, children]);

  // Reset form state when initialData changes (like after a successful save)
  useEffect(() => {
    setFormData(initialData || {});
    setIsDirty(false);
    setErrors({});
  }, [initialData]);

  // Update form data with error handling
  const updateFormData = useCallback((field, value) => {
    try {
      setFormData(prev => {
        const updated = { ...prev, [field]: value };
        setIsDirty(true);

        // Clear any error for this field
        if (errors[field]) {
          setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[field];
            return newErrors;
          });
        }

        return updated;
      });
    } catch (error) {
      console.error(`Error updating field ${field}:`, error);
      setErrors(prev => ({ ...prev, [field]: 'Failed to update field' }));
    }
  }, [errors]);

  // Update nested form data with error handling
  const updateNestedFormData = useCallback((path, value) => {
    try {
      setFormData(prev => {
        const keys = path.split('.');
        const newData = { ...prev };
        let current = newData;

        // Track the full path for each level
        let currentPath = '';

        // Navigate to the last object in the path
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          currentPath = currentPath ? `${currentPath}.${key}` : key;

          if (key.match(/^\d+$/)) {
            // If the key is a number, treat it as an array index
            const index = parseInt(key);
            const arrayKey = keys[i - 1];

            // Make sure the array exists
            if (!Array.isArray(current[arrayKey])) {
              current[arrayKey] = [];
            }

            // Make sure the array is long enough
            while (current[arrayKey].length <= index) {
              current[arrayKey].push({});
            }

            // Move to the array item
            current = current[arrayKey][index];
          } else {
            // Handle object properties
            if (!current[key] || typeof current[key] !== 'object' || Array.isArray(current[key])) {
              current[key] = {};
            }
            current = current[key];
          }
        }

        // Set the value at the final key
        const finalKey = keys[keys.length - 1];
        current[finalKey] = value;

        setIsDirty(true);

        // Clear any error for this path
        if (errors[path]) {
          setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[path];
            return newErrors;
          });
        }

        return newData;
      });
    } catch (error) {
      console.error(`Error updating nested field ${path}:`, error);
      setErrors(prev => ({ ...prev, [path]: `Failed to update nested field: ${error.message}` }));

      // Try a simpler approach as fallback
      try {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const parentPath = keys.join('.');

        setFormData(prev => {
          const newData = { ...prev };
          if (!parentPath) {
            newData[lastKey] = value;
          } else {
            const parent = keys.reduce((obj, key) => {
              if (!obj[key]) obj[key] = {};
              return obj[key];
            }, newData);
            parent[lastKey] = value;
          }
          return newData;
        });

        setIsDirty(true);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
  }, [errors]);

  // Add file to be uploaded
  const addFile = useCallback((field, file) => {
    if (!file) return;

    setFiles(prev => {
      const newFiles = { ...prev, [field]: file };
      setIsDirty(true);
      return newFiles;
    });

    // Clear any error for this field
    if (errors[field]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();

    try {
      setIsSaving(true);
      setErrors({});

      if (typeof onSave === 'function') {
        // Use custom save handler if provided
        await onSave(formData, files);
      } else if (saveUrl) {
        // Default to using Inertia router
        const formDataObj = new FormData();

        // Add all form data to FormData
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (typeof value === 'object' && !Array.isArray(value)) {
              // For non-array objects, stringify
              formDataObj.append(key, JSON.stringify(value));
            } else if (Array.isArray(value)) {
              // For arrays, we need special handling
              formDataObj.append(key, JSON.stringify(value));
            } else {
              // For primitive values
              formDataObj.append(key, value);
            }
          }
        });

        // Add files to FormData
        Object.entries(files).forEach(([key, file]) => {
          if (file instanceof File) {
            formDataObj.append(key, file);
          }
        });

        // Submit with Inertia
        router.post(saveUrl, formDataObj, {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Changes saved successfully",
              variant: "success",
            });
            setIsDirty(false);
            setFiles({});
          },
          onError: (errors) => {
            console.error('Validation errors:', errors);
            setErrors(errors);

            toast({
              title: "Error",
              description: Object.values(errors).join(', ') || "Failed to save changes",
              variant: "destructive",
            });
          },
          preserveState: true,
        });
      } else {
        throw new Error("No save method provided");
      }
    } catch (error) {
      console.error('Submit error:', error);

      toast({
        title: "Error",
        description: error.message || "Failed to save changes",
        variant: "destructive",
      });

      setErrors(prev => ({
        ...prev,
        general: error.message || "Failed to save changes"
      }));
    } finally {
      setIsSaving(false);
    }
  }, [onSave, saveUrl, formData, files, toast]);

  // Check if a field has an error
  const hasError = useCallback((fieldName) => {
    return !!errors[fieldName];
  }, [errors]);

  // Get error message for a field
  const getErrorMessage = useCallback((fieldName) => {
    return errors[fieldName];
  }, [errors]);

  // Reset form to initial data
  const resetForm = useCallback(() => {
    setFormData(initialData || {});
    setFiles({});
    setIsDirty(false);
    setErrors({});

    toast({
      title: "Form Reset",
      description: "All changes have been discarded",
      variant: "default",
    });
  }, [initialData, toast]);

  return (
    <PageEditorContext.Provider value={{
      activeSection,
      setActiveSection,
      isDirty,
      setIsDirty,
      isSaving,
      formData,
      updateFormData,
      updateNestedFormData,
      addFile,
      files,
      handleSubmit,
      errors,
      hasError,
      getErrorMessage,
      resetForm,
    }}>
      {children}
    </PageEditorContext.Provider>
  );
}; 