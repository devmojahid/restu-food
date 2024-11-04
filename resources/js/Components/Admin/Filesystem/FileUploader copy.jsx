import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/Components/ui/button";
import {
  X,
  Upload,
  File,
  Image as ImageIcon,
  Video,
  FileText,
} from "lucide-react";
import { router } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { getCsrfToken } from "@/utils/csrf";
import { handleError, handleSuccess } from "@/utils/error-handler";
import { AppError } from "@/utils/error-handler";
import { apiClient } from "@/utils/api-client";

export default function FileUploader({
  maxFiles = 1,
  fileType = "any",
  collection = "default",
  value = null,
  onUpload = () => {},
  className = "",
}) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState(
    value ? (Array.isArray(value) ? value : [value]) : []
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleUpload = useCallback(
    async (acceptedFiles) => {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append("files[]", file);
      });
      formData.append("collection", collection);

      try {
        const data = await apiClient.upload(
          "files/upload",
          formData,
          (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(Math.round(progress));
          }
        );

        if (data.files?.length > 0) {
          const newFiles = data.files.map((file) => ({
            ...file,
            url: `/storage/${file.path}`,
          }));

          setFiles((prevFiles) => {
            const updatedFiles =
              maxFiles === 1 ? [newFiles[0]] : [...prevFiles, ...newFiles];
            return updatedFiles;
          });

          if (maxFiles === 1) {
            onUpload(newFiles[0]);
          } else {
            onUpload((prevFiles) => [...prevFiles, ...newFiles]);
          }

          handleSuccess("Files uploaded successfully");
        }
      } catch (error) {
        handleError(error, "File upload failed");
        setError(error.message);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [collection, maxFiles, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleUpload,
    maxFiles,
    accept: getAcceptedFileTypes(fileType),
  });

  const removeFile = (fileToRemove) => {
    const updatedFiles = files.filter(
      (file) => file.uuid !== fileToRemove.uuid
    );
    setFiles(updatedFiles);
    onUpload(maxFiles === 1 ? null : updatedFiles);
  };

  const getFileIcon = (file) => {
    if (isImageFile(file))
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    if (file.mime_type?.startsWith("video/"))
      return <Video className="h-8 w-8 text-purple-500" />;
    if (file.mime_type?.includes("pdf"))
      return <FileText className="h-8 w-8 text-red-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className={className}>
      {/* File Preview Section */}
      {files.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div
                key={file.uuid || index}
                className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="aspect-square relative">
                  {isImageFile(file) ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-t-lg">
                      {getFileIcon(file)}
                      <span className="mt-2 text-xs text-gray-500 truncate max-w-full">
                        {file.name}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="transform scale-90 hover:scale-100 transition-transform"
                      onClick={() => removeFile(file)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-2 text-center bg-gray-50 dark:bg-gray-900 rounded-b-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-primary bg-primary/10 scale-102"
            : "border-gray-300 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800",
          className
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isDragActive ? (
            <span className="text-primary font-medium">Drop files here...</span>
          ) : (
            <span>
              Drag & drop {maxFiles > 1 ? "files" : "a file"} here, or{" "}
              <span className="text-primary">browse</span>
            </span>
          )}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          {getFileTypeText(fileType)}{" "}
          {maxFiles > 1 ? `(Max ${maxFiles} files)` : ""}
        </p>
        {uploading && (
          <div className="mt-4">
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              {uploadProgress > 0 ? (
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              ) : (
                <div className="h-full bg-primary animate-progress-indeterminate" />
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {uploadProgress > 0
                ? `Uploading... ${uploadProgress}%`
                : "Preparing upload..."}
            </p>
          </div>
        )}
        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
      </div>
    </div>
  );
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getAcceptedFileTypes(fileType) {
  switch (fileType) {
    case "image":
      return { "image/*": [".png", ".jpg", ".jpeg", ".gif"] };
    case "video":
      return { "video/*": [".mp4", ".mov", ".avi"] };
    case "document":
      return {
        "application/pdf": [".pdf"],
        "application/msword": [".doc", ".docx"],
        "application/vnd.ms-excel": [".xls", ".xlsx"],
      };
    default:
      return {};
  }
}

function getFileTypeText(fileType) {
  switch (fileType) {
    case "image":
      return "PNG, JPG, GIF up to 10MB";
    case "video":
      return "MP4, MOV, AVI up to 50MB";
    case "document":
      return "PDF, DOC, DOCX, XLS, XLSX up to 10MB";
    default:
      return "Any file type up to 10MB";
  }
}

function isImageFile(file) {
  return (
    file.mime_type?.startsWith("image/") || file.type?.startsWith("image/")
  );
}
