import React, { useRef, useEffect } from 'react';
import { Input } from "@/Components/ui/input";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ui/use-toast";

const SearchBox = ({ onPlaceSelected, onLocationClick }) => {
  const searchInputRef = useRef(null);
  const searchBoxRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const initSearchBox = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        setTimeout(initSearchBox, 100);
        return;
      }

      try {
        searchBoxRef.current = new window.google.maps.places.SearchBox(
          searchInputRef.current
        );

        searchBoxRef.current.addListener('places_changed', () => {
          const places = searchBoxRef.current.getPlaces();
          if (places.length === 0) return;

          const place = places[0];
          if (!place.geometry || !place.geometry.location) return;

          onPlaceSelected({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        });
      } catch (error) {
        console.error('Error initializing SearchBox:', error);
      }
    };

    initSearchBox();

    return () => {
      if (searchBoxRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(searchBoxRef.current);
      }
    };
  }, [onPlaceSelected]);

  const handleLocationClick = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    // Request location permission
    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
    
    if (permissionStatus.state === 'denied') {
      toast({
        title: "Location Access Required",
        description: "Please enable location access in your browser settings and try again.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationClick({ lat: latitude, lng: longitude });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          toast({
            title: "Location Access",
            description: "Please allow location access when prompted",
            action: (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleLocationClick()}
              >
                Try Again
              </Button>
            ),
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
    <div className="relative flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search for a location..."
          className="pl-9 pr-4 h-10 w-full bg-white dark:bg-gray-800"
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleLocationClick}
        className="h-10 w-10 shrink-0"
        title="Use my location"
      >
        <MapPin className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchBox; 