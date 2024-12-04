import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { X, Tag as TagIcon, Plus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const TagInput = ({ 
  value = [], 
  onChange,
  placeholder,
  error,
  maxTags = 10,
  className 
}) => {
  const [inputValue, setInputValue] = useState("");
  const [localTags, setLocalTags] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [hoveredTag, setHoveredTag] = useState(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setLocalTags(value || []);
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && localTags.length > 0) {
      const newTags = localTags.slice(0, -1);
      setLocalTags(newTags);
      onChange?.(newTags);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (tag && !localTags.includes(tag) && localTags.length < maxTags) {
      const newTags = [...localTags, tag];
      setLocalTags(newTags);
      onChange?.(newTags);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = localTags.filter(tag => tag !== tagToRemove);
    setLocalTags(newTags);
    onChange?.(newTags);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className={cn(
          "flex flex-wrap gap-2 p-3 rounded-lg border min-h-[100px]",
          "transition-all duration-300 ease-in-out",
          "bg-white dark:bg-gray-950",
          "hover:border-primary/50",
          isFocused && "ring-2 ring-primary/20 border-primary",
          error && "border-red-500",
          "cursor-text",
          "relative"
        )}
      >
        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2 w-full">
          {localTags.map((tag, index) => (
            <div
              key={`${tag}-${index}`}
              onMouseEnter={() => setHoveredTag(index)}
              onMouseLeave={() => setHoveredTag(null)}
              className={cn(
                "transition-all duration-300 ease-in-out",
                "transform origin-left",
                "animate-tag-enter",
                "group"
              )}
            >
              <Badge 
                variant="secondary"
                className={cn(
                  "px-3 py-2",
                  "bg-primary/5",
                  "transition-all duration-300",
                  "flex items-center gap-2",
                  "border border-primary/10",
                  "text-base",
                  "relative",
                  hoveredTag === index && "bg-primary/10 scale-105",
                  "hover:bg-primary/10"
                )}
              >
                <TagIcon className={cn(
                  "w-4 h-4",
                  "transition-all duration-300",
                  hoveredTag === index ? "text-primary" : "text-primary/50"
                )} />
                <span className={cn(
                  "transition-all duration-300",
                  "text-sm font-medium",
                  "text-foreground",
                  hoveredTag === index && "text-primary"
                )}>
                  {tag}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                  // className={cn(
                  //   "absolute right-2",
                  //   "p-1 rounded-full",
                  //   "hover:bg-red-500/10 hover:text-red-500",
                  //   "focus:outline-none focus:ring-2 focus:ring-red-500/20",
                  //   "transition-all duration-300",
                  //   "flex items-center justify-center",
                  //   hoveredTag === index ? "opacity-100 scale-100" : "opacity-0 scale-75",
                  //   "transform",
                  //   "bg-background/50 backdrop-blur-sm"
                  // )}

                  className={cn(hoveredTag === index ? "opacity-100 scale-100 bg-red-500/10 text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20" : "opacity-0 scale-75")}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </div>
          ))}
        </div>
        
        {/* Input Field */}
        <div className={cn(
          "flex-1 min-w-[200px]",
          "relative",
          localTags.length > 0 && "mt-2"
        )}>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              if (inputValue) addTag();
            }}
            placeholder={localTags.length < maxTags ? placeholder : `Maximum ${maxTags} tags reached`}
            disabled={localTags.length >= maxTags}
            className={cn(
              "border-0 focus-visible:ring-0 px-0 py-1",
              "bg-transparent",
              "placeholder:text-muted-foreground",
              "transition-all duration-300",
              "text-base"
            )}
          />

          {/* Add Tag Button */}
          {inputValue && (
            <button
              type="button"
              onClick={addTag}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2",
                "p-1.5 rounded-full",
                "bg-primary/10 hover:bg-primary/20",
                "transition-all duration-300",
                "flex items-center gap-1",
                "text-sm font-medium",
                "text-primary",
                "animate-fade-in"
              )}
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className={cn(
          "flex items-center gap-2",
          "text-sm text-red-500",
          "animate-slide-down"
        )}>
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Helper Text */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <TagIcon className="w-4 h-4" />
          <span>Press <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Enter</kbd> or <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">,</kbd> to add</span>
        </span>
        <span className={cn(
          "transition-all duration-300",
          "font-medium",
          localTags.length >= maxTags ? "text-red-500" : "text-primary"
        )}>
          {maxTags - localTags.length} remaining
        </span>
      </div>
    </div>
  );
};

export default TagInput; 