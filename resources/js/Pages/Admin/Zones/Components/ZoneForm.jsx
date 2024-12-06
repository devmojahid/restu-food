import React, { useState } from 'react';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import DeliveryChargesForm from './DeliveryChargesForm';
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";

const ZoneForm = ({ data, setData, errors, className, onSubmit, isProcessing, onCancel }) => {
    const [activeTab, setActiveTab] = useState('basic');

    const isFormValid = () => {
        if (!data.name || !data.display_name) return false;
        if (!data.coordinates || data.coordinates.length < 3) return false;
        if (!data.delivery_charges.min_charge || !data.delivery_charges.max_charge) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            setActiveTab('basic'); // Switch to basic tab if validation fails
            return;
        }
        onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
            {errors.error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.error}</AlertDescription>
                </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger 
                        value="basic"
                        className={cn(
                            errors.name || errors.display_name || errors.coordinates 
                            ? "border-destructive" 
                            : ""
                        )}
                    >
                        Basic Information
                    </TabsTrigger>
                    <TabsTrigger 
                        value="delivery"
                        className={cn(
                            Object.keys(errors).some(key => key.startsWith('delivery_charges'))
                            ? "border-destructive"
                            : ""
                        )}
                    >
                        Delivery Settings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Zone Information</CardTitle>
                            <CardDescription>
                                Enter the basic details for your delivery zone
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Zone Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter zone name"
                                        error={errors.name}
                                        className={cn(errors.name && "border-destructive")}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="display_name">Display Name *</Label>
                                    <Input
                                        id="display_name"
                                        value={data.display_name}
                                        onChange={(e) => setData('display_name', e.target.value)}
                                        placeholder="Enter display name"
                                        error={errors.display_name}
                                        className={cn(errors.display_name && "border-destructive")}
                                    />
                                    {errors.display_name && (
                                        <p className="text-sm text-destructive">{errors.display_name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    <Label htmlFor="is_active">Active Zone</Label>
                                </div>
                                
                                {data.coordinates?.length > 0 && (
                                    <div className="text-sm text-muted-foreground">
                                        {data.coordinates.length} points selected
                                    </div>
                                )}
                            </div>

                            {errors.coordinates && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{errors.coordinates}</AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="delivery" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Charges</CardTitle>
                            <CardDescription>
                                Configure the delivery charges for this zone
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DeliveryChargesForm
                                data={data.delivery_charges}
                                setData={setData}
                                errors={errors}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 mt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    disabled={isProcessing || !isFormValid()}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Zone'
                    )}
                </Button>
            </div>
        </form>
    );
};

export default ZoneForm; 