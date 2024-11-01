import { Checkbox } from "@/Components/ui/checkbox";
import { cn } from "@/lib/utils";
import { RowActions } from "./RowActions";
import { NoData } from "./NoData";

export const TableContent = ({
  data,
  columns,
  selectedItems,
  onSelectionChange,
}) => {
  const handleSelectItem = (checked, id) => {
    if (checked) {
      onSelectionChange([...selectedItems, id]);
    } else {
      onSelectionChange(selectedItems.filter((item) => item !== id));
    }
  };

  const handleRowClick = (e, row) => {
    if (
      e.target.closest("button") ||
      e.target.closest("a") ||
      e.target.closest('[role="menuitem"]') ||
      e.target.closest(".checkbox-cell")
    ) {
      return;
    }

    handleSelectItem(!selectedItems.includes(row.id), row.id);
  };

  return (
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      {data?.length > 0 ? (
        data.map((row) => (
          <tr
            key={row.id}
            onClick={(e) => handleRowClick(e, row)}
            className={cn(
              "transition-all duration-200 group cursor-pointer select-none",
              selectedItems.includes(row.id)
                ? "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap checkbox-cell">
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={selectedItems.includes(row.id)}
                  onCheckedChange={(checked) =>
                    handleSelectItem(checked, row.id)
                  }
                  aria-label={`Select row ${row.id}`}
                  className={cn(
                    "transition-transform duration-200 ease-in-out",
                    "h-4 w-4 sm:h-5 sm:w-5",
                    "group-hover:scale-110",
                    selectedItems.includes(row.id) ? "scale-105" : "scale-100"
                  )}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </td>
            {columns.map((column) => (
              <td
                key={column.id}
                className={cn(
                  "px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap",
                  "text-xs sm:text-sm text-gray-500 dark:text-gray-400",
                  column.cellClassName,
                  selectedItems.includes(row.id) &&
                    "text-blue-600 dark:text-blue-400"
                )}
              >
                {column.cell(row)}
              </td>
            ))}
            <td
              className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end">
                <RowActions row={row} />
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan={columns.length + 2}
            className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            <NoData
              title="No data found"
              description="There are no items to display at the moment."
            />
          </td>
        </tr>
      )}
    </tbody>
  );
};
