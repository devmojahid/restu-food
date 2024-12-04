import React from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { FileType } from "lucide-react";

const DocumentPreview = ({ file }) => {
  if (!file) return null;

  const isImage = file.mime_type?.startsWith('image/');
  const fileSize = formatFileSize(file.size);

  return (
    <Card className="group hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="aspect-square rounded-lg bg-muted flex items-center justify-center mb-3 overflow-hidden">
          {isImage ? (
            <img 
              src={file.url} 
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FileType className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{fileSize}</p>
        <div className="mt-2 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => window.open(file.url, '_blank')}
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export default DocumentPreview; 