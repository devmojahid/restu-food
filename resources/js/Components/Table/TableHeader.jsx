import { Checkbox } from "@/Components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

export const TableHeader = ({ columns, selectedItems, onSelectAll, data }) => {
  const handleSelectAll = (checked) => {
    onSelectAll(checked ? data.map((item) => item.id) : []);
  };

  return (
    <thead className="bg-gray-200 dark:bg-gray-700">
      <tr>
        <th className="px-3 sm:px-6 py-3 text-left w-[40px] sm:w-[50px]">
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                data?.length > 0 && selectedItems.length === data?.length
              }
              onCheckedChange={handleSelectAll}
              aria-label="Select all"
              className={cn(
                "transition-all duration-200 ease-in-out",
                "h-4 w-4 sm:h-5 sm:w-5",
                {
                  "opacity-0": data?.length === 0,
                  "opacity-100": data?.length > 0,
                }
              )}
            />
          </div>
        </th>
        {columns.map((column) => (
          <th
            key={column.id}
            className={cn(
              "px-3 sm:px-6 py-3 text-left",
              "text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
              column.className
            )}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="whitespace-nowrap">{column.header}</span>
              {column.sortable && (
                <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              )}
            </div>
          </th>
        ))}
        <th className="px-3 sm:px-6 py-3 text-left w-[100px] sm:w-[120px]">
          <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Actions
          </span>
        </th>
      </tr>
    </thead>
  );
};
