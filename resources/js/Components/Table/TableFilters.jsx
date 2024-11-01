import { Input } from "@/Components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { cn } from "@/lib/utils";

export const TableFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row w-full gap-3 sm:items-center">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          placeholder="Search..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-9 w-full bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        />
      </div>

      <div className="flex items-center gap-3 sm:w-auto">
        <Select
          value={filters.status || "all"}
          onValueChange={(value) => onFilterChange("status", value)}
        >
          <SelectTrigger
            className={cn(
              "w-full sm:w-[130px]",
              "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
              filters.status !== "all" && "border-primary"
            )}
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="animate-in fade-in-0 zoom-in-95">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(filters.per_page || 10)}
          onValueChange={(value) => onFilterChange("per_page", value)}
        >
          <SelectTrigger className="w-[100px] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <SelectValue placeholder="Per page" />
          </SelectTrigger>
          <SelectContent
            className="animate-in fade-in-0 zoom-in-95"
            align="end"
          >
            {[10, 25, 50, 100].map((value) => (
              <SelectItem
                key={value}
                value={String(value)}
                className="flex items-center justify-between"
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
