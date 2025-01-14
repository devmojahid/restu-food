import React from 'react';
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePageEditor } from './PageEditorContext';

const SectionNavigation = ({ sections }) => {
  const { activeSection, setActiveSection } = usePageEditor();

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-4">Page Configuration</h3>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-1">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection(section.id)}
              >
                <div className={cn(
                  "w-2 h-2 rounded-full mr-2",
                  activeSection === section.id ? "bg-primary" : "bg-muted"
                )} />
                {section.label}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SectionNavigation; 