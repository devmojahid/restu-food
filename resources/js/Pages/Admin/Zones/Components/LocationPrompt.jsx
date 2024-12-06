import React from 'react';
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
import { MapPin } from "lucide-react";

const LocationPrompt = ({ open, onOpenChange, onAllow, onSkip }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Enable Location Access
          </AlertDialogTitle>
          <AlertDialogDescription>
            Allow location access to better manage your delivery zones. This helps in setting up accurate delivery areas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onSkip}>Skip for now</AlertDialogCancel>
          <AlertDialogAction onClick={onAllow}>Allow access</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LocationPrompt; 