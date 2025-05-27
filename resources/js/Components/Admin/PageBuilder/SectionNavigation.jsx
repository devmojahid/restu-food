import React from 'react';
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";
import { usePageEditor } from './PageEditorContext';
import { CheckCircle2, AlertCircle, ChevronRight, Settings, Eye, RefreshCw, ExternalLink } from 'lucide-react';

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

  // Get section icon based on type
  const getSectionIcon = (sectionId) => {
    switch (sectionId) {
      case 'global_settings':
        return Settings;
      case 'hero':
        return () => (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="10" rx="2" ry="2" />
            <circle cx="12" cy="8" r="1" />
          </svg>
        );
      case 'featured_restaurants':
        return () => (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="10" rx="2" ry="2" />
            <circle cx="12" cy="8" r="1" />
          </svg>
        );
      case 'top_categories':
        return () => (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        );
      case 'why_choose_us':
        return () => (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
            <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3" />
            <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3" />
          </svg>
        );
      case 'client_feedback':
        return () => (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 9h8" />
            <path d="M8 13h6" />
          </svg>
        );
      default:
        return () => <div className="w-4 h-4 rounded-full bg-current opacity-20" />;
    }
  };

  const totalErrors = Object.keys(errors || {}).length;

  return (
    <Card className="sticky top-24 shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 pb-3 border-b border-gray-100 bg-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm">Page Sections</h3>
            {isDirty && (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200 animate-pulse text-xs px-2 py-0.5 font-medium"
              >
                Unsaved
              </Badge>
            )}
          </div>
          {totalErrors > 0 && (
            <div className="mt-2 flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md">
              <AlertCircle className="w-3 h-3 mr-1" />
              {totalErrors} error{totalErrors > 1 ? 's' : ''} found
            </div>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-280px)]">
          {/* Navigation Items */}
          <div className="p-3 space-y-1">
            {sections.map((section, index) => {
              const isActive = activeSection === section.id;
              const isEnabled = isSectionEnabled(section.id);
              const hasError = hasSectionError(section.id);
              const IconComponent = getSectionIcon(section.id);

              return (
                <div key={section.id} className="relative">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sm transition-all duration-200 group relative overflow-hidden h-auto py-2.5 px-3",
                      isActive
                        ? "bg-primary/10 text-primary font-medium border border-primary/20 shadow-sm"
                        : "hover:bg-gray-50 text-gray-700 hover:text-gray-900",
                      hasError
                        ? "bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
                        : "",
                      !isEnabled && !hasError && !isActive
                        ? "opacity-60"
                        : ""
                    )}
                    onClick={() => scrollToSection(section.id)}
                  >
                    {/* Background highlight for active state */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
                    )}

                    {/* Left border indicator */}
                    <div className={cn(
                      "absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-200",
                      isActive ? "bg-primary" : "bg-transparent",
                      hasError ? "bg-red-500" : ""
                    )} />

                    {/* Section Icon */}
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-md mr-3 transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200",
                      hasError
                        ? "bg-red-100 text-red-600"
                        : ""
                    )}>
                      <IconComponent />
                    </div>

                    {/* Section Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{section.label}</span>

                        {/* Status Icons */}
                        <div className="flex items-center space-x-1">
                          {hasError ? (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          ) : isEnabled ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 opacity-60" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400 opacity-60" />
                          )}

                          <ChevronRight className={cn(
                            "w-4 h-4 transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5",
                            isActive ? "opacity-100" : ""
                          )} />
                        </div>
                      </div>

                      {/* Section Status */}
                      <p className={cn(
                        "text-xs mt-0.5 transition-colors",
                        hasError
                          ? "text-red-500"
                          : isActive
                            ? "text-primary/70"
                            : "text-gray-500"
                      )}>
                        {hasError
                          ? "Has errors"
                          : isEnabled
                            ? "Enabled"
                            : "Disabled"
                        }
                      </p>
                    </div>
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="px-3 py-4 border-t border-gray-100 bg-gray-50/50">
            <h4 className="text-xs text-gray-600 font-semibold mb-3 uppercase tracking-wide">Quick Actions</h4>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs h-8 text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
                onClick={() => window.open('/', '_blank')}
              >
                <ExternalLink className="w-3.5 h-3.5 mr-2" />
                Preview Homepage
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs h-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50 transition-colors disabled:opacity-50"
                onClick={resetForm}
                disabled={!isDirty}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Reset Changes
              </Button>
            </div>
          </div>

          {/* Detailed Error Summary */}
          {totalErrors > 0 && (
            <div className="px-3 py-4 border-t border-red-100 bg-red-50/50">
              <h4 className="text-xs text-red-700 font-semibold mb-2 flex items-center uppercase tracking-wide">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                Error Details
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {Object.entries(errors).slice(0, 5).map(([key, value], index) => (
                  <div key={key} className="text-xs text-red-600 bg-white p-2 rounded border border-red-200">
                    <span className="font-medium text-red-700">{key}:</span>
                    <span className="ml-1">{value}</span>
                  </div>
                ))}
                {totalErrors > 5 && (
                  <p className="text-xs text-red-600 text-center py-1 font-medium">
                    +{totalErrors - 5} more errors...
                  </p>
                )}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SectionNavigation;