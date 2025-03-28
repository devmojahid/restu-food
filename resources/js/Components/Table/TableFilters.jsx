import { Input } from "@/Components/ui/input";
import { Search, Loader2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";

export const TableFilters = ({ filters, onFilterChange, isLoading }) => {
  const searchInputRef = useRef(null);
  const [localSearch, setLocalSearch] = useState(filters?.search || "");

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onFilterChange("search", localSearch, true);
    },
    [localSearch, onFilterChange]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearchSubmit(e);
      }
    },
    [handleSearchSubmit]
  );

  const handleClearSearch = () => {
    setLocalSearch("");
    onFilterChange("search", "", true);
    searchInputRef.current?.focus();
  };

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
    // Don't trigger immediate search on change - wait for submit or Enter key
  };

  return (
    <div className="flex flex-col lg:flex-row w-full gap-3 lg:items-center">
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex-1 min-w-0 flex"
      >
        <div className="relative flex-1 group">
          {isLoading ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-500 dark:text-gray-400" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          )}
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            value={localSearch}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className={cn(
              "pl-9 pr-24 w-full bg-transparent",
              "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
              "focus:ring-2 focus:ring-primary/20",
              "rounded-lg border-gray-200 dark:border-gray-700",
              "h-10 py-2 text-sm",
              "shadow-sm",
              isLoading && "pr-9"
            )}
            disabled={isLoading}
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className={cn(
                "absolute right-[70px] top-1/2 -translate-y-1/2",
                "p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700",
                "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary/20"
              )}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2",
              "px-3 h-8 text-xs font-medium",
              "bg-primary/10 hover:bg-primary/20 text-primary",
              "dark:bg-primary/20 dark:hover:bg-primary/30",
              "transition-all duration-200",
              "rounded-md",
              "shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary/20"
            )}
            disabled={isLoading}
          >
            Search
          </Button>
        </div>
      </form>

      <div className="flex items-center gap-3 lg:w-auto">
        <Select
          value={String(filters?.per_page || "10")}
          onValueChange={(value) => onFilterChange("per_page", value)}
          disabled={isLoading}
        >
          <SelectTrigger
            className={cn(
              "w-[120px] lg:w-[100px]",
              "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
              "h-10 rounded-lg",
              "shadow-sm",
              "focus:ring-2 focus:ring-primary/20"
            )}
          >
            <SelectValue placeholder="Per page" />
          </SelectTrigger>
          <SelectContent
            className="animate-in fade-in-0 zoom-in-95"
            align="end"
            sideOffset={5}
          >
            {[10, 25, 50, 100].map((value) => (
              <SelectItem
                key={value}
                value={String(value)}
                className="flex items-center justify-between px-3 py-2"
              >
                <span>{value}</span>
                <span className="text-xs text-gray-500">rows</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
