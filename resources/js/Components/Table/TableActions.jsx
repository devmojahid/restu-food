import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Badge } from "@/Components/ui/badge";
import { Settings, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const TableActions = ({ selectedItems, bulkActions, onBulkAction }) => {
  if (!selectedItems?.length) return null;

  return (
    <div className="flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-auto gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Settings className="h-4 w-4" />
            <span className="flex-1 text-left">Bulk Actions</span>
            <Badge
              variant="secondary"
              className="ml-2 bg-gray-100 dark:bg-gray-800"
            >
              {selectedItems.length}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[200px] sm:w-[220px] animate-in fade-in-0 zoom-in-95"
        >
          {bulkActions.map((action) => (
            <DropdownMenuItem
              key={action.id}
              onClick={() => onBulkAction(action.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 cursor-pointer",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                action.variant === "destructive" &&
                  "text-red-600 hover:text-red-700"
              )}
            >
              {action.icon && <action.icon className="h-4 w-4" />}
              <div className="flex flex-col flex-1">
                <span>{action.label}</span>
                {action.description && (
                  <span className="text-xs text-gray-500">
                    {action.description}
                  </span>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
