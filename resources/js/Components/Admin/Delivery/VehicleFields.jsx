import React from "react";
import { FormField } from "@/Components/Admin/Form/FormSection";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

const VehicleFields = ({ data, setData, errors, vehicleType }) => {
  const showVehicleFields = vehicleType && vehicleType !== 'bicycle';

  return (
    <>
      <FormField label="Vehicle Type" required error={errors?.vehicle_type}>
        <Select
          value={vehicleType}
          onValueChange={(value) => setData("vehicle_type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select vehicle type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="car">Car</SelectItem>
            <SelectItem value="motorcycle">Motorcycle</SelectItem>
            <SelectItem value="bicycle">Bicycle</SelectItem>
            <SelectItem value="scooter">Scooter</SelectItem>
            <SelectItem value="van">Van</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {showVehicleFields && (
        <>
          <FormField label="Vehicle Model" required error={errors?.vehicle_model}>
            <Input
              value={data?.vehicle_model}
              onChange={(e) => setData("vehicle_model", e.target.value)}
              placeholder="e.g., Toyota Corolla"
            />
          </FormField>

          <FormField label="Vehicle Year" required error={errors?.vehicle_year}>
            <Input
              value={data?.vehicle_year}
              onChange={(e) => setData("vehicle_year", e.target.value)}
              placeholder="e.g., 2020"
            />
          </FormField>

          <FormField label="Vehicle Color" required error={errors?.vehicle_color}>
            <Input
              value={data?.vehicle_color}
              onChange={(e) => setData("vehicle_color", e.target.value)}
              placeholder="e.g., Silver"
            />
          </FormField>

          <FormField label="License Plate" required error={errors?.license_plate}>
            <Input
              value={data?.license_plate}
              onChange={(e) => setData("license_plate", e.target.value)}
              placeholder="e.g., ABC123"
            />
          </FormField>
        </>
      )}
    </>
  );
};

export default VehicleFields; 