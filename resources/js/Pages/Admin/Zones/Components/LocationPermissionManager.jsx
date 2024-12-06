import React, { useEffect, useState } from 'react';
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
import { useToast } from "@/Components/ui/use-toast";

const LocationPermissionManager = ({ onPermissionChange }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permissionState, setPermissionState] = useState('prompt');
  const { toast } = useToast();

  const isSecureContextOrLocal = () => {
    return window.isSecureContext || 
           window.location.hostname === 'localhost' || 
           window.location.hostname.endsWith('.test') ||
           window.location.hostname === '127.0.0.1';
  };

  useEffect(() => {
    if (!isSecureContextOrLocal()) {
      console.warn('Non-secure context detected. Location features may be limited.');
      return;
    }
    checkPermission();
  }, []);

  const checkPermission = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionState(permissionStatus.state);

      permissionStatus.onchange = () => {
        setPermissionState(permissionStatus.state);
        onPermissionChange(permissionStatus.state === 'granted');
        
        if (permissionStatus.state === 'granted') {
          toast({
            title: "Location Access Enabled",
            description: "You can now use location features",
          });
        } else if (permissionStatus.state === 'denied') {
          toast({
            title: "Location Access Denied",
            description: "Some features may be limited",
            variant: "destructive",
          });
        }
      };

      if (permissionStatus.state === 'prompt') {
        setShowPrompt(true);
      }
    } catch (error) {
      console.error('Error checking permission:', error);
      setShowPrompt(true);
    }
  };

  const handleRequestPermission = () => {
    if (!isSecureContextOrLocal()) {
      toast({
        title: "Security Notice",
        description: "Location access is allowed in local development",
      });
      setShowPrompt(false);
      onPermissionChange(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setShowPrompt(false);
        onPermissionChange(true);
        toast({
          title: "Location Access Enabled",
          description: "You can now use location features",
        });
      },
      (error) => {
        setShowPrompt(false);
        onPermissionChange(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast({
            title: "Location Access Denied",
            description: "Please enable location access in your browser settings to use all features",
            variant: "destructive",
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <AlertDialog open={showPrompt} onOpenChange={setShowPrompt}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Enable Location Access
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isSecureContextOrLocal() 
              ? "This app needs location access to help you better manage delivery zones and track deliveries in real-time."
              : "You are in local development mode. Location features will work for testing purposes."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            setShowPrompt(false);
            onPermissionChange(false);
          }}>
            Not Now
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleRequestPermission}>
            Enable Location
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LocationPermissionManager; 