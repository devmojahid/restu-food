import React from 'react';
import { Card, CardContent } from "@/Components/ui/card";
import { usePageEditor } from './PageEditorContext';

const SectionContent = ({
  section,
  children,
  className = ""
}) => {
  const { activeSection } = usePageEditor();

  // Don't render if this section is not active
  if (activeSection !== section.id) {
    return null;
  }

  return (
    <Card className={className} id={`section-${section.id}`}>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">{section.label}</h2>
        {children}
      </CardContent>
    </Card>
  );
};

export default SectionContent; 