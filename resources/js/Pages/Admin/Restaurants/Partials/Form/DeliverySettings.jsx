import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { cn } from "@/lib/utils";
import { Slider } from "@/Components/ui/slider";

const DeliverySettings = ({ value, onChange, errors = {} }) => {
  const {
    delivery_radius = 5,
    minimum_order = 0,
    delivery_fee = 0,
    commission_rate = 10,
  } = value;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Radius */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="delivery_radius">Delivery Radius (km)</Label>
            <span className="text-sm font-medium">{delivery_radius} km</span>
          </div>
          <Slider
            id="delivery_radius"
            min={1}
            max={50}
            step={0.5}
            value={[delivery_radius]}
            onValueChange={([value]) => onChange("delivery_radius", value)}
            className={cn(errors.delivery_radius && "border-red-500")}
          />
          {errors.delivery_radius && (
            <p className="text-sm text-red-500">{errors.delivery_radius}</p>
          )}
        </div>

        {/* Minimum Order */}
        <div className="space-y-2">
          <Label htmlFor="minimum_order">Minimum Order Amount</Label>
          <div className="relative">
            <Input
              id="minimum_order"
              type="number"
              min="0"
              step="0.01"
              value={minimum_order}
              onChange={(e) => onChange("minimum_order", e.target.value)}
              className={cn(
                "pl-8",
                errors.minimum_order && "border-red-500"
              )}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
          </div>
          {errors.minimum_order && (
            <p className="text-sm text-red-500">{errors.minimum_order}</p>
          )}
        </div>

        {/* Delivery Fee */}
        <div className="space-y-2">
          <Label htmlFor="delivery_fee">Delivery Fee</Label>
          <div className="relative">
            <Input
              id="delivery_fee"
              type="number"
              min="0"
              step="0.01"
              value={delivery_fee}
              onChange={(e) => onChange("delivery_fee", e.target.value)}
              className={cn(
                "pl-8",
                errors.delivery_fee && "border-red-500"
              )}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
          </div>
          {errors.delivery_fee && (
            <p className="text-sm text-red-500">{errors.delivery_fee}</p>
          )}
        </div>

        {/* Commission Rate */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="commission_rate">Commission Rate (%)</Label>
            <span className="text-sm font-medium">{commission_rate}%</span>
          </div>
          <Slider
            id="commission_rate"
            min={0}
            max={100}
            step={0.5}
            value={[commission_rate]}
            onValueChange={([value]) => onChange("commission_rate", value)}
            className={cn(errors.commission_rate && "border-red-500")}
          />
          {errors.commission_rate && (
            <p className="text-sm text-red-500">{errors.commission_rate}</p>
          )}
        </div>

        {/* Summary Card */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-3">Delivery Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Coverage Area</span>
              <span className="font-medium">{delivery_radius} km radius</span>
            </div>
            <div className="flex justify-between">
              <span>Minimum Order</span>
              <span className="font-medium">{formatCurrency(minimum_order)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-medium">{formatCurrency(delivery_fee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Commission Rate</span>
              <span className="font-medium">{commission_rate}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliverySettings; 