import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Link, router } from "@inertiajs/react";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { useToast } from "@/Components/ui/use-toast";

/**
 * RowActions component for displaying a dropdown of actions for a table row
 * @param {Object} props - Component props
 * @param {Object} props.row - Row data
 * @param {Object|Array} props.actions - Actions configuration, can be object (legacy) or array (new)
 * @param {String} props.resourceName - Name of the resource for alert dialog text
 */
export const RowActions = ({
  row,
  actions,
  resourceName = "item", // For alert dialog text
}) => {
  const [activeAlert, setActiveAlert] = useState(null);
  const { toast } = useToast();
  
  // Support both formats of actions for backward compatibility
  const isLegacyFormat = !Array.isArray(actions) && typeof actions === 'object';
  
  // For legacy format
  const legacyActions = isLegacyFormat ? actions : {};
  
  const handleActionClick = (action) => {
    if (action.confirm) {
      setActiveAlert(action);
    } else if (action.onClick) {
      action.onClick(row);
    }
  };
  
  const closeAlert = () => {
    setActiveAlert(null);
  };

  const renderItems = () => {
    if (isLegacyFormat) {
      // Legacy format support
      return (
        <>
          {legacyActions.view && (
            <DropdownMenuItem asChild>
              <Link
                href={route(legacyActions.view, row.id)}
                className="flex items-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
          )}
          {legacyActions.edit && (
            <DropdownMenuItem asChild>
              <Link
                href={route(legacyActions.edit, row.id)}
                className="flex items-center"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
          )}
          {legacyActions.delete && (
            <>
              {(legacyActions.view || legacyActions.edit) && <DropdownMenuSeparator />}
              <DropdownMenuItem
                className="flex items-center text-red-600 focus:text-red-600"
                onSelect={() => setActiveAlert({ id: 'delete', label: 'Delete' })}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </>
      );
    }
    
    // New array format
    return (
      <>
        {Array.isArray(actions) && actions.map((action, index) => {
          // Add separators between action groups if needed
          const needsSeparator = index > 0 && 
            (actions[index-1].group !== action.group) && 
            action.group;
          
          return (
            <div key={`action-${index}`}>
              {needsSeparator && <DropdownMenuSeparator />}
              <DropdownMenuItem
                className={action.className || ""}
                onSelect={() => handleActionClick(action)}
              >
                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                {action.label}
              </DropdownMenuItem>
            </div>
          );
        })}
      </>
    );
  };

  // Handle legacy delete action
  const handleLegacyDelete = () => {
    if (!legacyActions.delete) return;
    closeAlert();

    router.delete(route(legacyActions.delete, row.id), {
      onSuccess: () => {
        toast({
          title: "Success",
          description: `${resourceName} deleted successfully`,
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: `Failed to delete ${resourceName}`,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {renderItems()}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      {activeAlert && (
        <AlertDialog open={!!activeAlert} onOpenChange={() => activeAlert ? null : closeAlert()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {activeAlert.confirmTitle || "Are you absolutely sure?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {activeAlert.confirmMessage || 
                  `This action cannot be undone. This will permanently affect the
                  ${row.title ? ` ${resourceName} "${row.title}"` : ` selected ${resourceName}`} 
                  and related data.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeAlert}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  // For legacy delete action
                  if (isLegacyFormat && activeAlert.id === 'delete') {
                    handleLegacyDelete();
                  } 
                  // For new action format
                  else if (activeAlert.onClick) {
                    activeAlert.onClick(row);
                    closeAlert();
                  }
                }}
                className={activeAlert.confirmButtonClass || "bg-red-600 focus:ring-red-600 hover:bg-red-700"}
              >
                {activeAlert.confirmText || "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
