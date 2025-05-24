import React from 'react';
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";
import { usePageEditor } from './PageEditorContext';
import { CheckCircle2, AlertCircle, ChevronRight, Settings, Eye } from 'lucide-react';

const SectionNavigation = ({ sections }) => {
  const {
    activeSection,
    setActiveSection,
    isDirty,
    formData,
    errors,
    resetForm
  } = usePageEditor();

  // Function to scroll to the section content when clicked
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Check if a section is enabled based on formData
  const isSectionEnabled = (sectionId) => {
    const key = `${sectionId}_enabled`;
    return formData[key] !== false; // Default to true if not explicitly disabled
  };

  // Check if a section has errors
  const hasSectionError = (sectionId) => {
    return Object.keys(errors || {}).some(key => key.startsWith(sectionId));
  };

  return (
    <Card className="sticky top-24">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-base">Page Sections</h3>
          {isDirty && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300 animate-pulse">
              Unsaved Changes
            </Badge>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-240px)] pr-2">
          <div className="space-y-1 mb-6">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              const isEnabled = isSectionEnabled(section.id);
              const hasError = hasSectionError(section.id);

              return (
                <Button
                  key={section.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-sm transition-all group",
                    isActive ? "font-medium" : "",
                    hasError ? "border-red-300 bg-red-50 hover:bg-red-100 text-red-900" : ""
                  )}
                  onClick={() => scrollToSection(section.id)}
                >
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full mr-2 transition-all",
                    isActive ? "bg-primary" : "bg-muted",
                    hasError ? "bg-red-500" : ""
                  )} />

                  <span className="flex-1">{section.label}</span>

                  {hasError ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  ) : section.id === 'global_settings' ? (
                    <Settings className="w-4 h-4 text-muted-foreground opacity-70" />
                  ) : isEnabled ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 opacity-70" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground opacity-50" />
                  )}

                  <ChevronRight
                    className={cn(
                      "w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all",
                      isActive ? "opacity-100" : ""
                    )}
                  />
                </Button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 pt-2 border-t border-border">
            <h4 className="text-xs text-muted-foreground font-medium mb-2">Quick Actions</h4>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => window.open('/', '_blank')}
            >
              <Eye className="w-3.5 h-3.5 mr-2" />
              Preview Homepage
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-destructive hover:text-destructive"
              onClick={resetForm}
              disabled={!isDirty}
            >
              Reset Changes
            </Button>
          </div>

          {/* Error Summary */}
          {Object.keys(errors || {}).length > 0 && (
            <div className="mt-4 pt-3 border-t border-red-200">
              <h4 className="text-xs text-red-600 font-medium mb-2 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                Error Summary
              </h4>
              <ul className="text-xs text-red-600 space-y-1 list-disc pl-5">
                {Object.entries(errors).slice(0, 3).map(([key, value]) => (
                  <li key={key}>{value}</li>
                ))}
                {Object.keys(errors).length > 3 && (
                  <li>
                    And {Object.keys(errors).length - 3} more errors...
                  </li>
                )}
              </ul>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SectionNavigation; 