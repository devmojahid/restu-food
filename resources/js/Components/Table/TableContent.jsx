import { Checkbox } from "@/Components/ui/checkbox";
import { cn } from "@/lib/utils";
import { RowActions } from "./RowActions";
import { NoData } from "./NoData";

export const TableContent = ({
  data = [],
  columns = [],
  selectedItems = [],
  onSelectionChange = () => {},
  canSelectItem = () => true,
  keyField = "id",
}) => {
  // Ensure we have arrays even if props are undefined
  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeSelectedItems = Array.isArray(selectedItems) ? selectedItems : [];

  const handleSelectItem = (checked, id) => {
    if (typeof onSelectionChange !== "function") return;

    if (checked) {
      onSelectionChange([...safeSelectedItems, id]);
    } else {
      onSelectionChange(safeSelectedItems.filter((item) => item !== id));
    }
  };

  const handleRowClick = (e, row) => {
    if (!row?.id) return;

    // Don't trigger selection on interactive elements
    if (
      e.target.closest("button") ||
      e.target.closest("a") ||
      e.target.closest('[role="menuitem"]') ||
      e.target.closest(".checkbox-cell")
    ) {
      return;
    }

    // Check if item can be selected
    if (typeof canSelectItem === "function" && !canSelectItem(row)) {
      return;
    }

    handleSelectItem(!safeSelectedItems.includes(row.id), row.id);
  };

  // If no data, show empty state
  if (!safeData.length) {
    return (
      <tbody className="bg-white dark:bg-gray-800">
        <tr>
          <td
            colSpan={safeColumns.length + (onSelectionChange ? 1 : 0)}
            className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            <NoData
              title="No data found"
              description="There are no items to display at the moment."
            />
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      {safeData.map((row) => {
        const isSelected = safeSelectedItems.includes(row?.id);
        const isSelectable =
          typeof canSelectItem === "function" ? canSelectItem(row) : true;
        
        // Use the configurable key field with fallback to id
        const rowKey = row[keyField] || row.id;

        return (
          <tr
            key={rowKey}
            onClick={(e) => handleRowClick(e, row)}
            className={cn(
              "transition-all duration-200 group",
              isSelectable && "cursor-pointer select-none",
              isSelected
                ? "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            {onSelectionChange && (
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap checkbox-cell">
                <div className="flex items-center justify-center">
                  {isSelectable && (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectItem(checked, row.id)
                      }
                      aria-label={`Select row ${row.id}`}
                      className={cn(
                        "transition-transform duration-200 ease-in-out",
                        "h-4 w-4 sm:h-5 sm:w-5",
                        "group-hover:scale-110",
                        isSelected ? "scale-105" : "scale-100"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
              </td>
            )}
            {safeColumns.map((column) => (
              <td
                key={`${rowKey}-${column.id}`}
                className={cn(
                  "px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap",
                  "text-xs sm:text-sm text-gray-500 dark:text-gray-400",
                  column.cellClassName,
                  isSelected && "text-blue-600 dark:text-blue-400"
                )}
              >
                {typeof column.cell === "function" ? column.cell(row) : null}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
};
