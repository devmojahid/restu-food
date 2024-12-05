import React, { useState, useCallback } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ui/use-toast";
import { MapPin, Save, Plus, Loader2, X } from "lucide-react";
import { useForm } from "@inertiajs/react";
import ZoneMap from "./Components/ZoneMap";
import ZoneList from "./Components/ZoneList";
import DeliveryChargesForm from "./Components/DeliveryChargesForm";
import StatsCard from "@/Components/Admin/StatsCard";

const INITIAL_FORM_STATE = {
  name: "",
  display_name: "",
  coordinates: [],
  delivery_charges: {
    min_charge: "",
    max_charge: "",
    per_km_charge: "",
    max_cod_amount: "",
    increase_percentage: "",
    increase_message: "",
  },
};

const ZonesIndex = ({ zones = { data: [] }, stats = {} }) => {
  const { toast } = useToast();
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data, setData, post, put, processing, errors, reset } = useForm(INITIAL_FORM_STATE);

  const handleMapClick = useCallback((coords) => {
    setData("coordinates", coords);
  }, []);

  const handleAddNewZone = () => {
    setSelectedZone(null);
    reset(INITIAL_FORM_STATE);
    setIsEditing(false);
  };

  const handleZoneSelect = (zone) => {
    setSelectedZone(zone);
    setData({
      name: zone.name,
      display_name: zone.display_name,
      coordinates: zone.coordinates,
      delivery_charges: {
        min_charge: zone.delivery_charges?.min_charge || "",
        max_charge: zone.delivery_charges?.max_charge || "",
        per_km_charge: zone.delivery_charges?.per_km_charge || "",
        max_cod_amount: zone.delivery_charges?.max_cod_amount || "",
        increase_percentage: zone.delivery_charges?.increase_percentage || "",
        increase_message: zone.delivery_charges?.increase_message || "",
      },
    });
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing && selectedZone) {
      put(route("app.zones.update", selectedZone.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Zone updated successfully",
          });
          handleAddNewZone();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update zone",
            variant: "destructive",
          });
        },
      });
    } else {
      post(route("app.zones.store"), {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Zone created successfully",
          });
          handleAddNewZone();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create zone",
            variant: "destructive",
          });
        },
      });
    }
  };

  // Stats configuration
  const statsConfig = [
    {
      title: "Total Zones",
      value: stats.total || 0,
      description: "Total number of delivery zones",
      icon: MapPin,
      className: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Active Zones",
      value: stats.active || 0,
      description: "Currently active zones",
      icon: MapPin,
      trend: "up",
      className: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Coverage Area",
      value: stats.coverage_area || "0 km²",
      description: "Total area covered by zones",
      icon: MapPin,
      className: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <AdminLayout>
      <Head title="Zone Management" />

      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Zone Management</h1>
            <p className="text-muted-foreground">Create and manage delivery zones</p>
          </div>
          <Button onClick={handleAddNewZone}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Zone
          </Button>
        </div>

        {/* Stats */}
        <StatsCard stats={statsConfig} />

        {/* Main Content */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Zone List */}
              <div className="lg:col-span-1">
                <ZoneList
                  zones={zones}
                  selectedZone={selectedZone}
                  onSelect={handleZoneSelect}
                />
              </div>

              {/* Map and Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="h-[400px] rounded-lg overflow-hidden border">
                  <ZoneMap
                    coordinates={data.coordinates}
                    onClick={handleMapClick}
                    onBoundsChanged={setMapBounds}
                    selectedZone={selectedZone}
                  />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Zone Name</Label>
                        <Input
                          id="name"
                          value={data.name}
                          onChange={(e) => setData("name", e.target.value)}
                          placeholder="Enter zone name"
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="display_name">Display Name</Label>
                        <Input
                          id="display_name"
                          value={data.display_name}
                          onChange={(e) => setData("display_name", e.target.value)}
                          placeholder="Enter display name"
                        />
                        {errors.display_name && (
                          <p className="text-sm text-destructive">
                            {errors.display_name}
                          </p>
                        )}
                      </div>
                    </div>

                    <DeliveryChargesForm
                      data={data.delivery_charges}
                      setData={setData}
                      errors={errors}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddNewZone}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={processing}>
                      {processing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {isEditing ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {isEditing ? "Update Zone" : "Create Zone"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ZonesIndex; 