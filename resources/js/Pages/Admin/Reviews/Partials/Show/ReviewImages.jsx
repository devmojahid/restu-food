import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";

const ReviewImages = ({ images }) => {
  if (!images?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Review Images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden",
                "border border-border",
                "group hover:scale-105 transition-transform"
              )}
            >
              <img
                src={image.url}
                alt={`Review image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className={cn(
                "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100",
                "flex items-center justify-center transition-opacity"
              )}>
                <a
                  href={image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-white text-sm font-medium",
                    "hover:underline"
                  )}
                >
                  View Full Size
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewImages; 