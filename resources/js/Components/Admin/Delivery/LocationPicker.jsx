import React, { useEffect, useRef } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { MapPin } from "lucide-react";

const LocationPicker = ({ 
  address,
  onAddressChange,
  onCoordinatesChange,
  error 
}) => {
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (window.google?.maps && mapRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        { types: ['address'] }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          onAddressChange?.(place.formatted_address);
          onCoordinatesChange?.({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
        }
      });
    }
  }, []);

  return (
    <div className="space-y-2">
      <Label>
        Address
        <span className="text-red-500">*</span>
      </Label>
      <div className="relative">
        <Input
          ref={autocompleteRef}
          value={address}
          onChange={(e) => onAddressChange?.(e.target.value)}
          placeholder="Enter your address"
          className="pl-10"
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default LocationPicker; 