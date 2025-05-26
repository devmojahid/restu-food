import React, { createContext, useContext, useState, useCallback, useEffect, useReducer } from 'react';
import { useToast } from "@/Components/ui/use-toast";
import { router } from '@inertiajs/react';

const PageEditorContext = createContext();

// Action types for reducer
const ACTIONS = {
  SET_FORM_DATA: 'SET_FORM_DATA',
  UPDATE_FIELD: 'UPDATE_FIELD',
  UPDATE_NESTED_FIELD: 'UPDATE_NESTED_FIELD',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  SET_ERRORS: 'SET_ERRORS',
  RESET_FORM: 'RESET_FORM',
  SET_DIRTY: 'SET_DIRTY'
};

// Utility functions
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.map(deepClone);

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  let current = obj;

  // Navigate to the parent of the target property
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (key.match(/^\d+$/)) {
      // Handle array indices
      const index = parseInt(key);
      const arrayKey = keys[i - 1];

      if (!Array.isArray(current[arrayKey])) {
        current[arrayKey] = [];
      }

      // Ensure array is long enough
      while (current[arrayKey].length <= index) {
        current[arrayKey].push({});
      }

      current = current[arrayKey][index];
    } else {
      // Handle object properties
      if (!current[key] || typeof current[key] !== 'object' || Array.isArray(current[key])) {
        current[key] = {};
      }
      current = current[key];
    }
  }

  // Set the final value
  const finalKey = keys[keys.length - 1];
  current[finalKey] = value;
};

// Form state reducer
const formReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_FORM_DATA:
      return {
        ...state,
        formData: action.payload,
        isDirty: false,
        errors: {}
      };

    case ACTIONS.UPDATE_FIELD:
      const newFormData = {
        ...state.formData,
        [action.field]: action.value
      };

      const newErrors = { ...state.errors };
      delete newErrors[action.field];

      return {
        ...state,
        formData: newFormData,
        errors: newErrors,
        isDirty: true
      };

    case ACTIONS.UPDATE_NESTED_FIELD:
      const clonedData = deepClone(state.formData);
      try {
        setNestedValue(clonedData, action.path, action.value);

        const clearedErrors = { ...state.errors };
        delete clearedErrors[action.path];

        return {
          ...state,
          formData: clonedData,
          errors: clearedErrors,
          isDirty: true
        };
      } catch (error) {
        console.error(`Error updating nested field ${action.path}:`, error);
        return {
          ...state,
          errors: {
            ...state.errors,
            [action.path]: `Failed to update field: ${error.message}`
          }
        };
      }

    case ACTIONS.CLEAR_ERRORS:
      return {
        ...state,
        errors: action.field ?
          { ...state.errors, [action.field]: undefined } :
          {}
      };

    case ACTIONS.SET_ERRORS:
      return {
        ...state,
        errors: action.payload
      };

    case ACTIONS.RESET_FORM:
      return {
        ...state,
        formData: action.payload,
        isDirty: false,
        errors: {}
      };

    case ACTIONS.SET_DIRTY:
      return {
        ...state,
        isDirty: action.payload
      };

    default:
      return state;
  }
};

export const usePageEditor = () => {
  const context = useContext(PageEditorContext);
  if (!context) {
    throw new Error('usePageEditor must be used within a PageEditorProvider');
  }
  return context;
};

export const PageEditorProvider = ({
  children,
  initialData = {},
  onSave,
  saveUrl,
  validationRules = {}
}) => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [files, setFiles] = useState({});

  // Use reducer for complex form state management
  const [state, dispatch] = useReducer(formReducer, {
    formData: initialData || {},
    isDirty: false,
    errors: {}
  });

  // Set the first section as active by default if none is set
  useEffect(() => {
    if (!activeSection && children?.props?.sections?.length > 0) {
      const defaultSection = children.props.sections.find(section => section.default) || children.props.sections[0];
      setActiveSection(defaultSection?.id);
    }
  }, [activeSection, children]);

  // Reset form state when initialData changes
  useEffect(() => {
    dispatch({ type: ACTIONS.SET_FORM_DATA, payload: initialData || {} });
    setFiles({});
  }, [initialData]);

  // Validation function
  const validateField = useCallback((field, value) => {
    const rules = validationRules[field];
    if (!rules) return null;

    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${field} is required`;
    }

    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return `${field} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return `${field} cannot exceed ${rules.maxLength} characters`;
    }

    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return rules.patternMessage || `${field} format is invalid`;
    }

    return null;
  }, [validationRules]);

  // Update form data - simplified and more reliable
  const updateFormData = useCallback((field, value) => {
    // Validate if rules exist
    const error = validateField(field, value);
    if (error) {
      dispatch({ type: ACTIONS.SET_ERRORS, payload: { ...state.errors, [field]: error } });
      return;
    }

    dispatch({
      type: ACTIONS.UPDATE_FIELD,
      field,
      value
    });
  }, [validateField, state.errors]);

  // Update nested form data - improved reliability
  const updateNestedFormData = useCallback((path, value) => {
    dispatch({
      type: ACTIONS.UPDATE_NESTED_FIELD,
      path,
      value
    });
  }, []);

  // Add file to be uploaded
  const addFile = useCallback((field, file) => {
    if (!file) return;

    setFiles(prev => ({
      ...prev,
      [field]: file
    }));

    dispatch({ type: ACTIONS.SET_DIRTY, payload: true });
    dispatch({ type: ACTIONS.CLEAR_ERRORS, field });
  }, []);

  // Validate entire form
  const validateForm = useCallback(() => {
    const errors = {};

    Object.entries(validationRules).forEach(([field, rules]) => {
      const value = state.formData[field];
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
      }
    });

    return errors;
  }, [state.formData, validationRules, validateField]);

  // FIXED: Properly serialize complex data for FormData
  const serializeForFormData = useCallback((obj, prefix = '') => {
    const formData = new FormData();

    const appendToFormData = (value, key) => {
      if (value === null || value === undefined) {
        return;
      }

      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        // Handle arrays properly - Laravel expects array notation
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            // For complex objects in arrays
            Object.keys(item).forEach(subKey => {
              const arrayKey = `${key}[${index}][${subKey}]`;
              if (typeof item[subKey] === 'object' && item[subKey] !== null && !Array.isArray(item[subKey])) {
                // Handle nested objects (like cta.text, cta.link)
                Object.keys(item[subKey]).forEach(nestedKey => {
                  formData.append(`${arrayKey}[${nestedKey}]`, item[subKey][nestedKey] || '');
                });
              } else {
                formData.append(arrayKey, item[subKey] || '');
              }
            });
          } else {
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else if (typeof value === 'object') {
        // Handle nested objects
        Object.keys(value).forEach(nestedKey => {
          appendToFormData(value[nestedKey], `${key}[${nestedKey}]`);
        });
      } else {
        formData.append(key, String(value));
      }
    };

    Object.entries(obj).forEach(([key, value]) => {
      const finalKey = prefix ? `${prefix}[${key}]` : key;
      appendToFormData(value, finalKey);
    });

    return formData;
  }, []);

  // Handle form submission with better error handling
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();

    try {
      setIsSaving(true);

      // Validate form
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        dispatch({ type: ACTIONS.SET_ERRORS, payload: validationErrors });
        toast({
          title: "Validation Error",
          description: "Please fix the form errors before saving",
          variant: "destructive",
        });
        return;
      }

      dispatch({ type: ACTIONS.CLEAR_ERRORS });

      if (typeof onSave === 'function') {
        // Use custom save handler if provided
        await onSave(state.formData, files);
        toast({
          title: "Success",
          description: "Changes saved successfully",
          variant: "success",
        });
        dispatch({ type: ACTIONS.SET_DIRTY, payload: false });
        setFiles({});
      } else if (saveUrl) {
        // FIXED: Use proper serialization for FormData
        const formDataObj = serializeForFormData(state.formData);

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
            dispatch({ type: ACTIONS.SET_DIRTY, payload: false });
            setFiles({});
          },
          onError: (errors) => {
            console.error('Validation errors:', errors);
            dispatch({ type: ACTIONS.SET_ERRORS, payload: errors });

            toast({
              title: "Error",
              description: Object.values(errors).flat().join(', ') || "Failed to save changes",
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

      dispatch({
        type: ACTIONS.SET_ERRORS,
        payload: { general: error.message || "Failed to save changes" }
      });
    } finally {
      setIsSaving(false);
    }
  }, [onSave, saveUrl, state.formData, files, toast, validateForm, serializeForFormData]);

  // Utility functions
  const hasError = useCallback((fieldName) => {
    return !!state.errors[fieldName];
  }, [state.errors]);

  const getErrorMessage = useCallback((fieldName) => {
    return state.errors[fieldName];
  }, [state.errors]);

  const resetForm = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_FORM, payload: initialData || {} });
    setFiles({});

    toast({
      title: "Form Reset",
      description: "All changes have been discarded",
      variant: "default",
    });
  }, [initialData, toast]);

  // Bulk update function for complex operations
  const bulkUpdateFormData = useCallback((updates) => {
    const newFormData = { ...state.formData };

    Object.entries(updates).forEach(([key, value]) => {
      newFormData[key] = value;
    });

    dispatch({ type: ACTIONS.UPDATE_FIELD, field: '_bulk', value: newFormData });
  }, [state.formData]);

  const contextValue = {
    // State
    activeSection,
    setActiveSection,
    isDirty: state.isDirty,
    setIsDirty: (value) => dispatch({ type: ACTIONS.SET_DIRTY, payload: value }),
    isSaving,
    formData: state.formData,
    files,
    errors: state.errors,

    // Actions
    updateFormData,
    updateNestedFormData,
    bulkUpdateFormData,
    addFile,
    handleSubmit,

    // Utilities
    hasError,
    getErrorMessage,
    resetForm,
    validateForm,
  };

  return (
    <PageEditorContext.Provider value={contextValue}>
      {children}
    </PageEditorContext.Provider>
  );
};