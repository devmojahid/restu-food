import React, { useRef, useEffect } from 'react';
import { Input } from "@/Components/ui/input";
import { Search } from "lucide-react";

const SearchBox = ({ onPlaceSelected }) => {
  const searchInputRef = useRef(null);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    const initSearchBox = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.log('Waiting for Google Maps Places API...');
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

  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        ref={searchInputRef}
        type="text"
        placeholder="Search for a location..."
        className="pl-8"
      />
    </div>
  );
};

export default SearchBox; 