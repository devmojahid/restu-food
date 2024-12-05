import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";

const DeliveryChargesForm = ({ data, setData, errors }) => {
  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      delivery_charges: {
        ...prev.delivery_charges,
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="min_charge">Minimum Delivery Charge ($)</Label>
        <Input
          id="min_charge"
          type="number"
          step="0.01"
          value={data.min_charge}
          onChange={(e) => handleChange("min_charge", e.target.value)}
          placeholder="0.00"
        />
        {errors?.["delivery_charges.min_charge"] && (
          <p className="text-sm text-destructive">
            {errors["delivery_charges.min_charge"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="max_charge">Maximum Delivery Charge ($)</Label>
        <Input
          id="max_charge"
          type="number"
          step="0.01"
          value={data.max_charge}
          onChange={(e) => handleChange("max_charge", e.target.value)}
          placeholder="0.00"
        />
        {errors?.["delivery_charges.max_charge"] && (
          <p className="text-sm text-destructive">
            {errors["delivery_charges.max_charge"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="per_km_charge">Delivery Charge Per KM ($)</Label>
        <Input
          id="per_km_charge"
          type="number"
          step="0.01"
          value={data.per_km_charge}
          onChange={(e) => handleChange("per_km_charge", e.target.value)}
          placeholder="0.00"
        />
        {errors?.["delivery_charges.per_km_charge"] && (
          <p className="text-sm text-destructive">
            {errors["delivery_charges.per_km_charge"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="max_cod_amount">Maximum COD Amount ($)</Label>
        <Input
          id="max_cod_amount"
          type="number"
          step="0.01"
          value={data.max_cod_amount}
          onChange={(e) => handleChange("max_cod_amount", e.target.value)}
          placeholder="0.00"
        />
        {errors?.["delivery_charges.max_cod_amount"] && (
          <p className="text-sm text-destructive">
            {errors["delivery_charges.max_cod_amount"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="increase_percentage">
          Delivery Charge Increase (%)
        </Label>
        <Input
          id="increase_percentage"
          type="number"
          step="1"
          value={data.increase_percentage}
          onChange={(e) => handleChange("increase_percentage", e.target.value)}
          placeholder="0"
        />
        {errors?.["delivery_charges.increase_percentage"] && (
          <p className="text-sm text-destructive">
            {errors["delivery_charges.increase_percentage"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="increase_message">Increase Message</Label>
        <Textarea
          id="increase_message"
          value={data.increase_message}
          onChange={(e) => handleChange("increase_message", e.target.value)}
          placeholder="Ex: Increased due to high demand"
        />
        {errors?.["delivery_charges.increase_message"] && (
          <p className="text-sm text-destructive">
            {errors["delivery_charges.increase_message"]}
          </p>
        )}
      </div>
    </div>
  );
};

export default DeliveryChargesForm; 