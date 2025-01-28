import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from "@/Components/ui/use-toast";

const PageEditorContext = createContext();

export const usePageEditor = () => {
  const context = useContext(PageEditorContext);
  if (!context) {
    throw new Error('usePageEditor must be used within a PageEditorProvider');
  }
  return context;
};

export const PageEditorProvider = ({ children, initialData = {}, onSave }) => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async (data) => {
    try {
      setIsSaving(true);
      await onSave(data);
      setIsDirty(false);
      toast({
        title: "Success",
        description: "Changes saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [onSave, toast]);

  return (
    <PageEditorContext.Provider value={{
      activeSection,
      setActiveSection,
      isDirty,
      setIsDirty,
      isSaving,
      handleSave,
    }}>
      {children}
    </PageEditorContext.Provider>
  );
}; 