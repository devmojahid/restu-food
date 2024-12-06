import React, { useEffect, useRef, useState, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import SearchBox from './SearchBox';
import { useToast } from '@/Components/ui/use-toast';
import { Button } from "@/Components/ui/button";
import { MapPin, Trash2, Undo } from "lucide-react";
import MapControls from './MapControls';
import { Loader2 } from "lucide-react";

const ZoneMap = ({ coordinates, onClick, onBoundsChanged, selectedZone, onPolygonComplete }) => {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const polygonRef = useRef(null);
  const { toast } = useToast();

  const [drawingHistory, setDrawingHistory] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mapType, setMapType] = useState('roadmap');
  const drawingManagerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initMap = async () => {
      setIsLoading(true);
      try {
        const loader = new Loader({
          apiKey: window.googleMapsApiKey || '',
          version: "weekly",
          libraries: ["places", "drawing", "geometry"]
        });

        const google = await loader.load();
        
        // Create map with better default options
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 23.8103, lng: 90.4125 },
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          gestureHandling: 'greedy',
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
          },
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        // Initialize location access
        if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
          try {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
              });
            });
            
            const { latitude, longitude } = position.coords;
            map.setCenter({ lat: latitude, lng: longitude });
            map.setZoom(14);

            // Add a marker for current location
            new google.maps.Marker({
              position: { lat: latitude, lng: longitude },
              map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#4f46e5",
                fillOpacity: 0.4,
                strokeWeight: 2,
                strokeColor: "#4f46e5",
              },
              title: "Your Location"
            });
          } catch (locationError) {
            console.warn('Location access denied:', locationError);
            // Keep default center if location access fails
          }
        }

        googleMapRef.current = map;
        setMapInstance(map);
        window.google = google;

        // Enhanced drawing manager with better styling
        const drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: null, // Start with selection mode
          drawingControl: false, // We'll use our custom controls
          polygonOptions: {
            fillColor: "#4f46e5",
            fillOpacity: 0.3,
            strokeWeight: 2,
            strokeColor: "#4f46e5",
            editable: true,
            draggable: true,
            zIndex: 1,
          },
        });

        drawingManagerRef.current = drawingManager;
        drawingManager.setMap(map);

        // Handle polygon complete with enhanced validation
        google.maps.event.addListener(
          drawingManager,
          "polygoncomplete",
          function (polygon) {
            if (polygonRef.current) {
              polygonRef.current.setMap(null);
            }
            polygonRef.current = polygon;

            const coords = polygon.getPath().getArray().map((coord) => ({
              lat: coord.lat(),
              lng: coord.lng(),
            }));

            if (coords.length < 3) {
              toast({
                title: "Error",
                description: "Please draw a valid zone with at least 3 points",
                variant: "destructive",
              });
              return;
            }

            onClick(coords);
            drawingManager.setDrawingMode(null);
            setIsDrawing(false);

            // Add path change listeners
            google.maps.event.addListener(polygon.getPath(), "set_at", () => {
              const updatedCoords = polygon.getPath().getArray().map((coord) => ({
                lat: coord.lat(),
                lng: coord.lng(),
              }));
              onClick(updatedCoords);
            });

            google.maps.event.addListener(polygon.getPath(), "insert_at", () => {
              const updatedCoords = polygon.getPath().getArray().map((coord) => ({
                lat: coord.lat(),
                lng: coord.lng(),
              }));
              onClick(updatedCoords);
            });

            // Show the form or trigger callback
            if (typeof onPolygonComplete === 'function') {
              onPolygonComplete(coords);
            }
          }
        );

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('Error loading Google Maps:', error);
        toast({
          title: "Error",
          description: "Failed to load Google Maps. Please check your internet connection and try again.",
          variant: "destructive",
        });
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

  const handleClearDrawing = useCallback(() => {
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    onClick([]);
    setDrawingHistory([]);
  }, [onClick]);

  const handleUndoLastPoint = useCallback(() => {
    if (coordinates?.length > 3) {
      const newCoords = [...coordinates];
      newCoords.pop();
      onClick(newCoords);
      setDrawingHistory([...drawingHistory, coordinates]);
    }
  }, [coordinates, drawingHistory]);

  const handleRedoLastPoint = useCallback(() => {
    if (drawingHistory.length > 0) {
      const lastState = drawingHistory[drawingHistory.length - 1];
      onClick(lastState);
      setDrawingHistory(drawingHistory.slice(0, -1));
    }
  }, [drawingHistory]);

  const handleLocationClick = async () => {
    if (!googleMapRef.current) return;

    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      toast({
        title: "Security Error",
        description: "Location access requires a secure connection (HTTPS)",
        variant: "destructive",
      });
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      googleMapRef.current.setCenter({ lat: latitude, lng: longitude });
      googleMapRef.current.setZoom(15);

      // Add or update location marker
      if (locationMarkerRef.current) {
        locationMarkerRef.current.setPosition({ lat: latitude, lng: longitude });
      } else {
        locationMarkerRef.current = new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: googleMapRef.current,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4f46e5",
            fillOpacity: 0.4,
            strokeWeight: 2,
            strokeColor: "#4f46e5",
          },
          title: "Your Location"
        });
      }
    } catch (error) {
      if (error.code === 1) {
        toast({
          title: "Location Access Required",
          description: "Please enable location access in your browser settings and try again.",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                window.open('chrome://settings/content/location', '_blank');
              }}
            >
              Open Settings
            </Button>
          ),
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to get your location. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleDrawing = useCallback(() => {
    if (drawingManagerRef.current) {
      const newDrawingMode = isDrawing ? null : google.maps.drawing.OverlayType.POLYGON;
      drawingManagerRef.current.setDrawingMode(newDrawingMode);
      setIsDrawing(!isDrawing);
    }
  }, [isDrawing]);

  const handleMapTypeChange = useCallback((type) => {
    if (googleMapRef.current) {
      googleMapRef.current.setMapTypeId(type);
      setMapType(type);
    }
  }, []);

  const handleFullscreen = useCallback(() => {
    if (mapRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        mapRef.current.requestFullscreen();
      }
    }
  }, []);

  // Add useEffect to handle map type changes
  useEffect(() => {
    if (mapInstance && mapType) {
      mapInstance.setMapTypeId(mapType);
    }
  }, [mapType, mapInstance]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 z-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading map...</span>
          </div>
        </div>
      )}
      
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-2xl mx-auto">
          <SearchBox 
            onPlaceSelected={handlePlaceSelected}
            onLocationClick={({ lat, lng }) => {
              googleMapRef.current?.setCenter({ lat, lng });
              googleMapRef.current?.setZoom(15);
            }}
          />
        </div>
      </div>

      {mapInstance && (
        <MapControls 
          onClear={handleClearDrawing}
          onUndo={handleUndoLastPoint}
          onRedo={handleRedoLastPoint}
          onFullscreen={handleFullscreen}
          onLocationClick={handleLocationClick}
          onMapTypeChange={handleMapTypeChange}
          onToggleDrawing={handleToggleDrawing}
          canUndo={coordinates?.length > 3}
          canRedo={drawingHistory.length > 0}
          isDrawing={isDrawing}
          map={mapInstance}
          drawingManager={drawingManagerRef.current}
        />
      )}
      
      {coordinates?.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Zone Coverage</div>
              <div className="text-sm text-muted-foreground mt-1">
                {coordinates.length} points selected
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearDrawing}
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => onPolygonComplete?.(coordinates)}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
};

export default ZoneMap; 