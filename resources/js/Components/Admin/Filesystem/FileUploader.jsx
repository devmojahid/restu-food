import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  Trash2,
  FileVideo as VideoIcon,
  Music2 as AudioIcon,
  FileText as DocumentIcon,
  Eye,
  Download,
  File as FileIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

axios.defaults.headers.common["X-CSRF-TOKEN"] = document
  .querySelector('meta[name="csrf-token"]')
  ?.getAttribute("content");
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true;

// Move formatFileSize outside components so it's accessible to both
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// File type configurations with correct icons
const FILE_TYPES = {
  image: {
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg", ".bmp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    icon: ImageIcon,
    preview: true,
    label: "Image",
  },
  video: {
    accept: {
      "video/*": [".mp4", ".webm", ".ogg", ".mov", ".avi"],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    icon: VideoIcon,
    preview: true,
    label: "Video",
  },
  audio: {
    accept: {
      "audio/*": [".mp3", ".wav", ".ogg", ".m4a"],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    icon: AudioIcon,
    preview: false,
    label: "Audio",
  },
  document: {
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
        ".pptx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    icon: DocumentIcon,
    preview: false,
    label: "Document",
  },
};

// Get icon for file type
const getFileTypeIcon = (mimeType) => {
  if (mimeType.startsWith("image/")) return ImageIcon;
  if (mimeType.startsWith("video/")) return VideoIcon;
  if (mimeType.startsWith("audio/")) return AudioIcon;
  if (mimeType.startsWith("application/pdf")) return DocumentIcon;
  if (
    mimeType.startsWith("application/msword") ||
    mimeType.startsWith(
      "application/vnd.openxmlformats-officedocument.wordprocessingml"
    )
  )
    return DocumentIcon;
  if (
    mimeType.startsWith("application/vnd.ms-excel") ||
    mimeType.startsWith(
      "application/vnd.openxmlformats-officedocument.spreadsheetml"
    )
  )
    return DocumentIcon;
  return FileIcon;
};

// Get file type label
const getFileTypeLabel = (mimeType) => {
  if (mimeType.startsWith("image/")) return "Image";
  if (mimeType.startsWith("video/")) return "Video";
  if (mimeType.startsWith("audio/")) return "Audio";
  if (mimeType.startsWith("application/pdf")) return "PDF";
  if (
    mimeType.startsWith("application/msword") ||
    mimeType.startsWith(
      "application/vnd.openxmlformats-officedocument.wordprocessingml"
    )
  )
    return "Word Document";
  if (
    mimeType.startsWith("application/vnd.ms-excel") ||
    mimeType.startsWith(
      "application/vnd.openxmlformats-officedocument.spreadsheetml"
    )
  )
    return "Excel Spreadsheet";
  return "File";
};

// Enhanced FilePreview component for different file types
const FilePreview = ({
  file,
  index,
  maxFiles,
  onRemove,
  isDeleting,
  disabled,
}) => {
  const FileTypeIcon = getFileTypeIcon(file.mime_type);
  const fileTypeLabel = getFileTypeLabel(file.mime_type);
  const canPreview =
    file.mime_type.startsWith("image/") || file.mime_type.startsWith("video/");

  return (
    <div className="group relative aspect-square rounded-lg overflow-hidden bg-background/50 border-2 border-border hover:border-primary/50 transition-all duration-300 ease-in-out">
      <div className="relative w-full h-full">
        {canPreview ? (
          file.mime_type.startsWith("image/") ? (
            <img
              src={file.url}
              alt={file.original_name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          ) : (
            <video
              src={file.url}
              className="w-full h-full object-cover"
              controls={false}
              muted
              loop
              onMouseOver={(e) => e.target.play()}
              onMouseOut={(e) => e.target.pause()}
            />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted p-4">
            <FileTypeIcon className="w-1/3 h-1/3 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground text-center">
              {fileTypeLabel}
            </span>
          </div>
        )}

        {/* Enhanced Overlay with Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
          <div className="space-y-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-32"
              onClick={() => window.open(file.url, "_blank")}
            >
              {canPreview ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-32"
              onClick={() => onRemove(file)}
              disabled={isDeleting || disabled}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </>
              )}
            </Button>
          </div>

          {/* Enhanced File Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/80 backdrop-blur-sm">
            <p className="text-sm font-medium text-white truncate">
              {file.original_name}
            </p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-white/70">
                {formatFileSize(file.size)}
              </span>
              <span className="text-xs text-white/70">{fileTypeLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add upload area classes as a constant
const UPLOAD_AREA_CLASSES = cn(
  "relative border-2 border-dashed rounded-lg transition-all duration-300",
  "hover:border-primary/50 focus-within:border-primary/50",
  "group cursor-pointer"
);

// Add dynamic classes for upload area states
const getUploadAreaStateClasses = ({
  isDragActive,
  isUploading,
  isDeleting,
  hasFiles,
}) =>
  cn(
    isDragActive && "border-primary bg-primary/10 scale-[1.02]",
    !isDragActive && "border-muted-foreground/25",
    (isUploading || isDeleting) && "pointer-events-none opacity-50",
    hasFiles && "border-primary/25"
  );

// Enhanced FileUploader component
const FileUploader = ({
  onUpload,
  maxFiles = 1,
  fileType = "image",
  collection = null,
  value = null,
  className,
  disabled = false,
  description,
  error,
}) => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get file type config
  const fileConfig = FILE_TYPES[fileType] || FILE_TYPES.document;

  // Initialize previews from value prop
  useEffect(() => {
    const initialPreviews = Array.isArray(value) ? value : value ? [value] : [];
    setPreviews(initialPreviews);
  }, [value]);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    if (collection) {
      formData.append("collection", collection);
    }

    try {
      const response = await axios.post("/admin/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress((prev) => ({
            ...prev,
            [file.name]: percentage,
          }));
        },
      });

      if (response.data.success) {
        const newFile = response.data.file;
        setPreviews((prev) => [...prev, newFile]);
        // Pass all files to parent component
        onUpload?.(maxFiles === 1 ? newFile : [...previews, newFile]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (previews.length >= maxFiles) return;

      const remainingSlots = maxFiles - previews.length;
      const newFiles = acceptedFiles.slice(0, remainingSlots);

      setFiles((prev) => [...prev, ...newFiles]);
      setIsUploading(true);

      try {
        for (const file of newFiles) {
          setProgress((prev) => ({
            ...prev,
            [file.name]: 0,
          }));

          await uploadFile(file);

          setFiles((prev) => prev.filter((f) => f.name !== file.name));
          setProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [maxFiles, previews.length, collection, onUpload]
  );

  const removeFile = async (fileToRemove) => {
    if (!fileToRemove?.id || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete(`/admin/files/${fileToRemove.id}`);

      if (response.data.success) {
        const updatedPreviews = previews.filter(
          (f) => f.id !== fileToRemove.id
        );
        setPreviews(updatedPreviews);
        onUpload?.(maxFiles === 1 ? null : updatedPreviews);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Enhanced drop zone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles - previews.length,
    maxSize: fileConfig.maxSize,
    accept: fileConfig.accept,
    disabled:
      isUploading || isDeleting || previews.length >= maxFiles || disabled,
    multiple: maxFiles > 1,
  });

  // Get upload area classes
  const uploadAreaClasses = cn(
    UPLOAD_AREA_CLASSES,
    getUploadAreaStateClasses({
      isDragActive,
      isUploading,
      isDeleting,
      hasFiles: previews.length > 0,
    })
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* File Type Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <fileConfig.icon className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {fileType.charAt(0).toUpperCase() + fileType.slice(1)} Uploader
          </span>
        </div>
        {maxFiles > 1 && (
          <span className="text-xs text-muted-foreground">
            {previews.length} of {maxFiles} files
          </span>
        )}
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {previews.map((preview, index) => (
            <FilePreview
              key={preview.id}
              file={preview}
              index={index}
              maxFiles={maxFiles}
              onRemove={() => removeFile(preview)}
              isDeleting={isDeleting}
              disabled={disabled}
            />
          ))}
        </div>
      )}

      {/* Upload Area */}
      {previews.length < maxFiles && !disabled && (
        <div {...getRootProps()} className={uploadAreaClasses}>
          <div className="p-6 text-center">
            <input {...getInputProps()} />
            {isUploading ? (
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-muted-foreground" />
            ) : (
              <fileConfig.icon className="h-12 w-12 mx-auto text-muted-foreground" />
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              {isDragActive
                ? `Drop your ${fileType} here`
                : description ||
                  `Drag & drop ${fileType}s here, or click to select`}
            </p>
            <div className="mt-1 text-xs text-muted-foreground space-y-1">
              <p>
                Accepted formats:{" "}
                {Object.values(fileConfig.accept).flat().join(", ")}
              </p>
              <p>Max size: {formatFileSize(fileConfig.maxSize)}</p>
              {maxFiles > 1 && (
                <p>
                  {maxFiles - previews.length} file
                  {maxFiles - previews.length !== 1 ? "s" : ""} remaining
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-3 p-3 border rounded-lg bg-background/50 backdrop-blur-sm"
            >
              <fileConfig.icon className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                  <p className="text-xs text-primary">
                    {progress[file.name] || 0}%
                  </p>
                </div>
                <Progress
                  value={progress[file.name] || 0}
                  className="h-1 mt-1"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default FileUploader;

// Add this CSS to your global styles or component
const styles = `
  @media (max-width: 768px) {
    .show-controls .absolute {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
