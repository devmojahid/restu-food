import React from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export const Rating = ({ value = 0, max = 5, size = "sm", readOnly = false, onChange, className }) => {
  const stars = [];
  const roundedValue = Math.round(value * 2) / 2; // Round to nearest 0.5

  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  const starSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const starSize = starSizes[size] || starSizes.sm;

  for (let i = 1; i <= max; i++) {
    if (i <= roundedValue) {
      // Full star
      stars.push(
        <Star
          key={i}
          className={cn(
            starSize,
            "fill-yellow-400 text-yellow-400",
            !readOnly && "cursor-pointer hover:scale-110 transition-transform"
          )}
          onClick={() => handleClick(i)}
        />
      );
    } else if (i - 0.5 === roundedValue) {
      // Half star
      stars.push(
        <StarHalf
          key={i}
          className={cn(
            starSize,
            "fill-yellow-400 text-yellow-400",
            !readOnly && "cursor-pointer hover:scale-110 transition-transform"
          )}
          onClick={() => handleClick(i - 0.5)}
        />
      );
    } else {
      // Empty star
      stars.push(
        <Star
          key={i}
          className={cn(
            starSize,
            "text-gray-300 dark:text-gray-600",
            !readOnly && "cursor-pointer hover:scale-110 transition-transform"
          )}
          onClick={() => handleClick(i)}
        />
      );
    }
  }

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {stars}
      {!readOnly && (
        <span className="ml-2 text-sm text-muted-foreground">
          {roundedValue} out of {max}
        </span>
      )}
    </div>
  );
};

// Add a default export as well for flexibility
export default Rating; 