import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon, File, Loader2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import { router } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

const FileUploader = ({
  maxFiles = 1,
  fileType = 'image',
  collection = 'default',
  value = null,
  onUpload,
  description,
  error,
  className,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles?.length) {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      acceptedFiles.forEach(file => {
        formData.append('files[]', file);
      });
      formData.append('collection', collection);

      try {
        await router.post(route('app.files.upload'), formData, {
          onProgress: (progress) => {
            setProgress(Math.round(progress.percentage));
          },
          onSuccess: ({ props }) => {
            if (props.files) {
              onUpload(maxFiles === 1 ? props.files[0] : props.files);
              toast({
                title: "Success",
                description: "File uploaded successfully",
              });
            }
          },
          onError: (errors) => {
            toast({
              title: "Error",
              description: errors.message || "Failed to upload file",
              variant: "destructive",
            });
          },
          onFinish: () => {
            setUploading(false);
            setProgress(0);
          },
        });
      } catch (error) {
        console.error('Upload error:', error);
        setUploading(false);
        toast({
          title: "Error",
          description: "Failed to upload file",
          variant: "destructive",
        });
      }
    }
  }, [collection, maxFiles, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: fileType === 'image' 
      ? { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] }
      : undefined,
    maxFiles,
    disabled: uploading,
  });

  const handleRemove = async (file) => {
    try {
      await router.delete(route('app.files.destroy', file.id));
      onUpload(null);
      toast({
        title: "Success",
        description: "File removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove file",
        variant: "destructive",
      });
    }
  };

  const renderPreview = () => {
    if (!value) return null;

    if (fileType === 'image') {
      return (
        <div className="relative group">
          <img
            src={value.url}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleRemove(value)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-3">
          <File className="h-6 w-6" />
          <span className="text-sm truncate">{value.name}</span>
        </div>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => handleRemove(value)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className={className}>
      {value ? (
        renderPreview()
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6",
            "flex flex-col items-center justify-center",
            "cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 dark:border-gray-700",
            "hover:border-primary hover:bg-primary/5",
            error && "border-red-500 dark:border-red-400",
            className
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          ) : (
            <>
              {fileType === 'image' ? (
                <ImageIcon className="h-8 w-8 text-gray-400 mb-4" />
              ) : (
                <Upload className="h-8 w-8 text-gray-400 mb-4" />
              )}
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                {isDragActive ? (
                  "Drop the files here..."
                ) : (
                  <>
                    Drag & drop {fileType} here, or click to select
                    {description && (
                      <span className="block mt-1 text-xs">{description}</span>
                    )}
                  </>
                )}
              </p>
            </>
          )}
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export { FileUploader };
export default FileUploader;
