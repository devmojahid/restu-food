import React from "react";
import { FileType } from "lucide-react";
import { Button } from "@/Components/ui/button";

const DocumentPreview = ({ document, title }) => {
  if (!document?.url) {
    return (
      <div className="text-center p-6 bg-muted rounded-lg">
        <FileType className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p>No {title.toLowerCase()} uploaded</p>
      </div>
    );
  }

  const handleView = () => {
    window.open(document.url, '_blank');
  };

  return (
    <div className="space-y-4">
      {document.mime_type?.startsWith('image/') ? (
        <img 
          src={document.url} 
          alt={title} 
          className="w-full rounded-lg object-cover aspect-video"
        />
      ) : (
        <div className="aspect-video flex items-center justify-center bg-muted rounded-lg">
          <FileType className="w-12 h-12 text-muted-foreground" />
        </div>
      )}
      <div className="flex gap-2">
        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleView}
        >
          <FileType className="w-4 h-4 mr-2" />
          View Document
        </Button>
      </div>
    </div>
  );
};

export default DocumentPreview; 