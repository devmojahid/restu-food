import React, { useState, useCallback } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import SettingsLayout from "../../Settings/Index";
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

const ZoneSettings = ({ zones = { data: [] }, settings = {} }) => {
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
      put(route("app.settings.zones.update", selectedZone.id), {
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
      post(route("app.settings.zones.store"), {
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

  const actionButtons = (
    <div className="flex items-center space-x-2">
      {isEditing && (
        <Button
          type="button"
          variant="outline"
          onClick={handleAddNewZone}
          className="w-full sm:w-auto"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      )}
      <Button
        type="submit"
        disabled={processing}
        onClick={handleSubmit}
        className="w-full sm:w-auto"
      >
        {processing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span>{isEditing ? "Updating..." : "Saving..."}</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            <span>{isEditing ? "Update Zone" : "Save Zone"}</span>
          </>
        )}
      </Button>
    </div>
  );

  return (
    <SettingsLayout actions={actionButtons}>
      <Head title="Zone Management" />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {isEditing ? "Edit Zone" : "Zone Management"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {isEditing 
                    ? "Edit delivery zone and its charges" 
                    : "Create and manage delivery zones with specific charges"}
                </p>
              </div>
              <Button onClick={handleAddNewZone}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Zone
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
};

export default ZoneSettings; 