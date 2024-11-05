import { Checkbox } from "@/Components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/Components/ui/button";

export const TableHeader = ({
  columns = [],
  selectedItems = [],
  onSelectAll,
  data = [],
  sorting = {},
  onSort,
}) => {
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeSelectedItems = Array.isArray(selectedItems) ? selectedItems : [];
  const safeData = Array.isArray(data) ? data : [];

  const handleSelectAll = (checked) => {
    if (typeof onSelectAll === "function") {
      onSelectAll(checked ? safeData.map((item) => item.id) : []);
    }
  };

  const handleSort = (column) => {
    if (column.sortable && typeof onSort === "function") {
      onSort(column.id);
    }
  };

  const getSortIcon = (column) => {
    if (!column.sortable) return null;

    if (column.id === sorting.column) {
      return sorting.direction === "asc" ? (
        <ArrowUp className="h-4 w-4 ml-1" />
      ) : (
        <ArrowDown className="h-4 w-4 ml-1" />
      );
    }
    return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
  };

  const showCheckbox = safeData.length > 0 && typeof onSelectAll === "function";

  return (
    <thead className="bg-gray-200 dark:bg-gray-700">
      <tr>
        {showCheckbox && (
          <th className="px-3 sm:px-6 py-3 text-left w-[40px] sm:w-[50px]">
            <div className="flex items-center justify-center">
              <Checkbox
                checked={
                  safeData.length > 0 &&
                  safeSelectedItems.length === safeData.length
                }
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
                className={cn(
                  "transition-all duration-200 ease-in-out",
                  "h-4 w-4 sm:h-5 sm:w-5",
                  {
                    "opacity-0": safeData.length === 0,
                    "opacity-100": safeData.length > 0,
                  }
                )}
              />
            </div>
          </th>
        )}
        {safeColumns.map((column) => (
          <th
            key={column.id}
            className={cn(
              "px-3 sm:px-6 py-3 text-left",
              "text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
              column.className,
              column.sortable &&
                "cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
            )}
            onClick={() => handleSort(column)}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="whitespace-nowrap">{column.header}</span>
              {getSortIcon(column)}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};
