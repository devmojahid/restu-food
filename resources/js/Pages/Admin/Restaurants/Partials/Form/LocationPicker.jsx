import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Loader2 } from "lucide-react";
import { loadGoogleMaps, getMapsConfig } from '@/utils/maps';

const LocationPicker = ({
  address,
  latitude,
  longitude,
  onAddressChange,
  onLocationChange,
  errors = {},
}) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(null);

  useEffect(() => {
    loadGoogleMaps()
      .then(() => {
        initializeMap();
      })
      .catch((error) => {
        setScriptError(error.message);
        console.error("Google Maps loading error:", error);
      });

    return () => {
      window.initGoogleMaps = null;
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const initialPosition = {
      lat: parseFloat(latitude) || 0,
      lng: parseFloat(longitude) || 0,
    };

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: initialPosition,
      zoom: 15,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    const marker = new window.google.maps.Marker({
      position: initialPosition,
      map: mapInstance,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    // Initialize search box
    const input = document.getElementById("address-search");
    const searchBoxInstance = new window.google.maps.places.SearchBox(input);

    // Create a custom control div for the search box
    const searchBoxDiv = document.createElement("div");
    searchBoxDiv.style.padding = "10px";
    searchBoxDiv.style.width = "300px";
    searchBoxDiv.appendChild(input);

    // Add the search box to the map
    mapInstance.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
      searchBoxDiv
    );

    // Bias searchBox results towards current map's viewport
    mapInstance.addListener("bounds_changed", () => {
      searchBoxInstance.setBounds(mapInstance.getBounds());
    });

    // Listen for marker drag events
    marker.addListener("dragend", () => {
      const position = marker.getPosition();
      updateLocation(position.lat(), position.lng());
      reverseGeocode(position.lat(), position.lng());
    });

    // Listen for searchBox place selection
    searchBoxInstance.addListener("places_changed", () => {
      const places = searchBoxInstance.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      // Update map and marker
      mapInstance.setCenter(place.geometry.location);
      marker.setPosition(place.geometry.location);

      // Update form data
      updateLocation(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
      onAddressChange(place.formatted_address);
    });

    setMap(mapInstance);
    setSearchBox(searchBoxInstance);
    markerRef.current = marker;

    // If we have initial coordinates, reverse geocode them
    if (latitude && longitude) {
      reverseGeocode(parseFloat(latitude), parseFloat(longitude));
    }
  };

  const updateLocation = (lat, lng) => {
    onLocationChange(lat, lng);
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      setIsLoading(true);
      const geocoder = new window.google.maps.Geocoder();
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === "OK") {
              resolve(results);
            } else {
              reject(status);
            }
          }
        );
      });

      if (response[0]) {
        onAddressChange(response[0].formatted_address);
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        
        // Update map and marker
        map?.setCenter({ lat, lng });
        markerRef.current?.setPosition({ lat, lng });
        
        // Update form data
        updateLocation(lat, lng);
        reverseGeocode(lat, lng);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLoading(false);
        alert("Unable to retrieve your location");
      }
    );
  };

  if (scriptError) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600">
          Error loading Google Maps: {scriptError}. Please check your API key configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address-search" className="flex items-center space-x-1">
          <span>Address</span>
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="address-search"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            className={cn(
              "pl-10",
              errors.address && "border-red-500"
            )}
            placeholder="Search for a location"
          />
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={handleCurrentLocation}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Current Location"}
          </Button>
        </div>
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address}</p>
        )}
      </div>

      <div
        ref={mapRef}
        className="w-full h-[300px] rounded-lg border border-border"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            value={latitude}
            onChange={(e) => updateLocation(e.target.value, longitude)}
            className={cn(errors.latitude && "border-red-500")}
            placeholder="Latitude"
          />
          {errors.latitude && (
            <p className="text-sm text-red-500">{errors.latitude}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            value={longitude}
            onChange={(e) => updateLocation(latitude, e.target.value)}
            className={cn(errors.longitude && "border-red-500")}
            placeholder="Longitude"
          />
          {errors.longitude && (
            <p className="text-sm text-red-500">{errors.longitude}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationPicker; 