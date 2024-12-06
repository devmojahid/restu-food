import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { MapPin, Edit, Trash2, Eye, EyeOff, MoreVertical } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ui/use-toast";
import { router } from "@inertiajs/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Card } from "@/Components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";

const ZoneList = ({ zones, selectedZone, onSelect }) => {
  const { toast } = useToast();
  const [zoneToDelete, setZoneToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = (zone) => {
    router.delete(route('app.logistics.zones.destroy', zone.id), {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Zone deleted successfully",
        });
        setIsDeleteDialogOpen(false);
        setZoneToDelete(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error?.message || "Failed to delete zone",
          variant: "destructive",
        });
      },
    });
  };

  const handleToggleStatus = (zone) => {
    router.post(route('app.logistics.zones.toggle-status', zone.id), {}, {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Success",
          description: `Zone ${zone.is_active ? 'deactivated' : 'activated'} successfully`,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error?.message || "Failed to update zone status",
          variant: "destructive",
        });
      },
    });
  };

  // Handle both paginated and non-paginated data
  const zoneData = zones?.data || zones || [];

  return (
    <Card className="h-[600px]">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {zoneData.length > 0 ? (
            zoneData.map((zone) => (
              <div
                key={zone.id}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-all",
                  "hover:bg-accent hover:text-accent-foreground",
                  selectedZone?.id === zone.id && "bg-accent text-accent-foreground",
                  !zone.is_active && "opacity-60"
                )}
                onClick={() => onSelect(zone)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{zone.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {zone.display_name}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onSelect(zone)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(zone);
                        }}
                      >
                        {zone.is_active ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setZoneToDelete(zone);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant={zone.is_active ? "success" : "secondary"}>
                    {zone.is_active ? "Active" : "Inactive"}
                  </Badge>
                  {zone.delivery_charges && (
                    <Badge variant="outline">
                      ${zone.delivery_charges.min_charge} - ${zone.delivery_charges.max_charge}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No zones found
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Zone</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this zone? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false);
              setZoneToDelete(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(zoneToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ZoneList; 