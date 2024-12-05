import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { MapPin, Edit, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
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

const ZoneList = ({ zones, selectedZone, onSelect }) => {
  const handleDelete = (zoneId) => {
    // Implement delete functionality
  };

  // Handle both paginated and non-paginated data
  const zoneData = zones?.data || zones || [];

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-2">
        {Array.isArray(zoneData) && zoneData.length > 0 ? (
          zoneData.map((zone) => (
            <div
              key={zone.id}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                selectedZone?.id === zone.id && "bg-accent text-accent-foreground"
              )}
              onClick={() => onSelect(zone)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{zone.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(zone);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Zone</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this zone? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(zone.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2 text-sm">
                <Badge variant="secondary">{zone.display_name}</Badge>
                {zone.deliveryCharges && (
                  <Badge variant="outline">
                    {zone.deliveryCharges.min_charge} - {zone.deliveryCharges.max_charge} USD
                  </Badge>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No zones found. Create your first zone to get started.
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ZoneList; 