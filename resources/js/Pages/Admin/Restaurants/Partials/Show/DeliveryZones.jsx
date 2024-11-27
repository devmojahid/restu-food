import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { MapPin } from "lucide-react";
import { loadGoogleMaps, getMapsConfig } from '@/utils/maps';

const DeliveryZones = ({ zones = [], defaultLocation }) => {
  const [map, setMap] = React.useState(null);
  const [polygons, setPolygons] = React.useState([]);
  const mapRef = React.useRef(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    loadGoogleMaps()
      .then(() => {
        initializeMap();
      })
      .catch((error) => {
        setError(error.message);
        console.error("Google Maps loading error:", error);
      });

    return () => {
      // Cleanup polygons
      polygons.forEach(polygon => polygon.setMap(null));
    };
  }, []);

  React.useEffect(() => {
    if (map && zones.length > 0) {
      drawZones();
    }
  }, [map, zones]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation || { lat: 0, lng: 0 },
      zoom: 13,
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

    // Add restaurant marker
    if (defaultLocation) {
      new window.google.maps.Marker({
        position: defaultLocation,
        map: mapInstance,
        icon: {
          url: "/images/restaurant-marker.png",
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });
    }

    setMap(mapInstance);
  };

  const drawZones = () => {
    // Clear existing polygons
    polygons.forEach(polygon => polygon.setMap(null));
    const newPolygons = [];

    zones.forEach(zone => {
      if (!zone.coordinates || !Array.isArray(zone.coordinates)) return;

      const polygon = new window.google.maps.Polygon({
        paths: zone.coordinates,
        strokeColor: "#3b82f6",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#3b82f6",
        fillOpacity: 0.35,
        map,
      });

      // Add hover effect
      polygon.addListener("mouseover", () => {
        polygon.setOptions({
          fillOpacity: 0.5,
          strokeWeight: 3,
        });
      });

      polygon.addListener("mouseout", () => {
        polygon.setOptions({
          fillOpacity: 0.35,
          strokeWeight: 2,
        });
      });

      newPolygons.push(polygon);
    });

    setPolygons(newPolygons);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">
            Error loading map: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div
            ref={mapRef}
            className="w-full h-[400px] rounded-lg border border-border"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {zones.map((zone) => (
          <Card key={zone.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {zone.name}
                </CardTitle>
                <Badge variant={zone.is_active ? "success" : "secondary"}>
                  {zone.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee:</span>
                  <span className="font-medium">
                    {formatCurrency(zone.delivery_fee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minimum Order:</span>
                  <span className="font-medium">
                    {formatCurrency(zone.minimum_order)}
                  </span>
                </div>
                {zone.estimated_delivery_time && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Estimated Delivery:
                    </span>
                    <span className="font-medium">
                      {zone.estimated_delivery_time} mins
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {zones.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No delivery zones defined.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeliveryZones; 