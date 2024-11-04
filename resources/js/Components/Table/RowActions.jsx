import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Link } from "@inertiajs/react";
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
import { router } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";

export const RowActions = ({
  row,
  actions = {
    view: null, // route name for view action
    edit: null, // route name for edit action
    delete: null, // route name for delete action
  },
  resourceName = "item", // For alert dialog text
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    if (!actions.delete) return;

    router.delete(route(actions.delete, row.id), {
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
          {actions.view && (
            <DropdownMenuItem asChild>
              <Link
                href={route(actions.view, row.id)}
                className="flex items-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
          )}
          {actions.edit && (
            <DropdownMenuItem asChild>
              <Link
                href={route(actions.edit, row.id)}
                className="flex items-center"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
          )}
          {actions.delete && (
            <>
              {(actions.view || actions.edit) && <DropdownMenuSeparator />}
              <DropdownMenuItem
                className="flex items-center text-red-600 focus:text-red-600"
                onSelect={() => setShowDeleteAlert(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {actions.delete && (
        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                {row.title
                  ? ` ${resourceName} "${row.title}"`
                  : ` selected ${resourceName}`}{" "}
                and remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 focus:ring-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
