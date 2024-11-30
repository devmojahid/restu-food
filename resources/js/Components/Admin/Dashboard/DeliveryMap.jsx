import React, { useEffect, useRef } from "react";
import { Card } from "@/Components/ui/card";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/Components/ui/badge";
import { 
  Bike, 
  Navigation,
  MapPin,
  Clock
} from 'lucide-react';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

// Custom icons
const deliveryIcon = new L.Icon({
  iconUrl: '/images/delivery-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const restaurantIcon = new L.Icon({
  iconUrl: '/images/restaurant-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const customerIcon = new L.Icon({
  iconUrl: '/images/customer-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Auto center map component
const AutoCenter = ({ deliveries, currentLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!deliveries?.length) return;

    const bounds = L.latLngBounds([]);
    
    // Add current location to bounds
    if (currentLocation) {
      bounds.extend([currentLocation.latitude, currentLocation.longitude]);
    }

    // Add all delivery points to bounds
    deliveries.forEach(delivery => {
      if (delivery.pickup_location) {
        bounds.extend([
          delivery.pickup_location.latitude,
          delivery.pickup_location.longitude
        ]);
      }
      if (delivery.delivery_location) {
        bounds.extend([
          delivery.delivery_location.latitude,
          delivery.delivery_location.longitude
        ]);
      }
    });

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [deliveries, currentLocation]);

  return null;
};

const DeliveryMap = ({ deliveries, currentLocation }) => {
  const mapRef = useRef(null);

  const getDeliveryStatus = (status) => {
    const statusColors = {
      assigned: 'warning',
      picked_up: 'default',
      delivered: 'success',
      cancelled: 'danger'
    };
    return statusColors[status] || 'default';
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Navigation className="w-6 h-6 mr-2" />
          Live Tracking
        </h2>
        <Badge variant="outline" className="flex items-center">
          <Bike className="w-4 h-4 mr-1" />
          {deliveries?.length || 0} Active
        </Badge>
      </div>

      <div className="h-[600px] rounded-lg overflow-hidden">
        <MapContainer
          ref={mapRef}
          center={[0, 0]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Current Location Marker */}
          {currentLocation && (
            <Marker
              position={[currentLocation.latitude, currentLocation.longitude]}
              icon={deliveryIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-medium">Your Location</h3>
                  <p className="text-sm text-gray-500">
                    Currently here
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Delivery Markers */}
          {deliveries?.map((delivery) => (
            <React.Fragment key={delivery.id}>
              {/* Restaurant Marker */}
              <Marker
                position={[
                  delivery.pickup_location.latitude,
                  delivery.pickup_location.longitude
                ]}
                icon={restaurantIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-medium">{delivery.restaurant.name}</h3>
                    <p className="text-sm text-gray-500">Pickup Point</p>
                    <div className="flex items-center mt-2">
                      <Clock className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="text-sm">
                        {delivery.pickup_time || 'Not picked up yet'}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* Delivery Location Marker */}
              <Marker
                position={[
                  delivery.delivery_location.latitude,
                  delivery.delivery_location.longitude
                ]}
                icon={customerIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-medium">Order #{delivery.order_id}</h3>
                    <p className="text-sm text-gray-500">
                      {delivery.delivery_address}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant={getDeliveryStatus(delivery.status)}>
                        {delivery.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        ETA: {delivery.eta || 'Calculating...'}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

          <AutoCenter deliveries={deliveries} currentLocation={currentLocation} />
        </MapContainer>
      </div>
    </Card>
  );
};

export default DeliveryMap; 