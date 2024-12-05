import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import SearchBox from './SearchBox';

const ZoneMap = ({ coordinates, onClick, onBoundsChanged, selectedZone }) => {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const polygonRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: window.googleMapsApiKey || '',
          version: "weekly",
          libraries: ["places", "drawing", "geometry"]
        });

        const google = await loader.load();
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 23.8103, lng: 90.4125 }, // Default to Dhaka
          zoom: 12,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });

        googleMapRef.current = map;
        window.google = google; // Make google available globally

        // Initialize drawing manager
        const drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.POLYGON,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON],
          },
          polygonOptions: {
            fillColor: "#FF0000",
            fillOpacity: 0.3,
            strokeWeight: 2,
            strokeColor: "#FF0000",
            editable: true,
            draggable: true,
          },
        });

        drawingManager.setMap(map);

        // Handle polygon complete
        google.maps.event.addListener(
          drawingManager,
          "polygoncomplete",
          function (polygon) {
            if (polygonRef.current) {
              polygonRef.current.setMap(null);
            }
            polygonRef.current = polygon;

            // Get coordinates
            const coords = polygon.getPath().getArray().map((coord) => ({
              lat: coord.lat(),
              lng: coord.lng(),
            }));

            onClick(coords);

            // Switch back to hand tool
            drawingManager.setDrawingMode(null);
          }
        );

        // Handle bounds changed
        map.addListener("bounds_changed", () => {
          const bounds = map.getBounds();
          if (bounds && onBoundsChanged) {
            onBoundsChanged(bounds.toJSON());
          }
        });
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  // Update polygon when coordinates change
  useEffect(() => {
    if (googleMapRef.current && window.google && coordinates?.length > 0) {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }

      polygonRef.current = new window.google.maps.Polygon({
        paths: coordinates,
        fillColor: "#FF0000",
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: "#FF0000",
        editable: true,
        draggable: true,
      });

      polygonRef.current.setMap(googleMapRef.current);

      // Fit bounds to show the entire polygon
      const bounds = new window.google.maps.LatLngBounds();
      coordinates.forEach((coord) => bounds.extend(coord));
      googleMapRef.current.fitBounds(bounds);
    }
  }, [coordinates]);

  const handlePlaceSelected = ({ lat, lng }) => {
    if (googleMapRef.current) {
      googleMapRef.current.setCenter({ lat, lng });
      googleMapRef.current.setZoom(15);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 right-4 z-10">
        <SearchBox onPlaceSelected={handlePlaceSelected} />
      </div>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default ZoneMap; 