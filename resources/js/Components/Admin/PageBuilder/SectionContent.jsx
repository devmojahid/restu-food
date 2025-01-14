import React from 'react';
import { Card, CardContent } from "@/Components/ui/card";
import { usePageEditor } from './PageEditorContext';

const SectionContent = ({ 
  section,
  children,
  className = ""
}) => {
  const { activeSection } = usePageEditor();

  if (activeSection !== section.id) {
    return null;
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">{section.label}</h2>
        {children}
      </CardContent>
    </Card>
  );
};

export default SectionContent; 