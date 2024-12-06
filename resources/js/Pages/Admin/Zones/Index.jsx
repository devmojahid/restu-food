import React, { useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useToast } from '@/Components/ui/use-toast';
import ZoneMap from './Components/ZoneMap';
import ZoneList from './Components/ZoneList';
import DeliveryChargesForm from './Components/DeliveryChargesForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/ui/card';
import ZoneForm from './Components/ZoneForm';
import { cn } from '@/lib/utils';
import ZoneStats from './Components/ZoneStats';
import LocationPermissionManager from './Components/LocationPermissionManager';

const Index = ({ zones, stats, can }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedZone, setSelectedZone] = useState(null);
    const { toast } = useToast();
    const [step, setStep] = useState('draw'); // 'draw' | 'form'
    const [showForm, setShowForm] = useState(false);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);

    const { data, setData, post, put, errors, processing, reset } = useForm({
        name: '',
        display_name: '',
        coordinates: [],
        is_active: true,
        delivery_charges: {
            min_charge: 0,
            max_charge: 0,
            per_km_charge: 0,
            max_cod_amount: 0,
            increase_percentage: 0,
            increase_message: '',
        },
    });

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        
        if (selectedZone) {
            put(route('app.logistics.zones.update', selectedZone.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setSelectedZone(null);
                    toast({
                        title: 'Success',
                        description: 'Zone updated successfully',
                    });
                },
            });
        } else {
            post(route('app.logistics.zones.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    toast({
                        title: 'Success',
                        description: 'Zone created successfully',
                    });
                },
            });
        }
    }, [selectedZone, data]);

    const handleZoneSelect = useCallback((zone) => {
        setSelectedZone(zone);
        setData({
            name: zone.name,
            display_name: zone.display_name,
            coordinates: zone.coordinates,
            is_active: zone.is_active,
            delivery_charges: zone.delivery_charges || {
                min_charge: 0,
                max_charge: 0,
                per_km_charge: 0,
                max_cod_amount: 0,
                increase_percentage: 0,
                increase_message: '',
            },
        });
        setIsOpen(true);
    }, []);

    const handlePolygonComplete = (coordinates) => {
        setData('coordinates', coordinates);
        setShowForm(true);
        setStep('form');
    };

    const handlePermissionChange = (granted) => {
        setHasLocationPermission(granted);
    };

    return (
        <AdminLayout>
            <Head title="Zone Management" />
            
            <LocationPermissionManager onPermissionChange={handlePermissionChange} />
            
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col gap-6">
                    {/* Header Section */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">Zone Management</h1>
                            <p className="text-muted-foreground mt-1">
                                Create and manage delivery zones with custom boundaries
                            </p>
                        </div>
                        {can.create && (
                            <Button onClick={() => {
                                reset();
                                setSelectedZone(null);
                                setIsOpen(true);
                            }}>
                                Create Zone
                            </Button>
                        )}
                    </div>

                    {/* Map Section - Full Width */}
                    <div className="w-full bg-white rounded-lg shadow-sm p-4">
                        <div className="h-[600px]">
                            <ZoneMap
                                coordinates={data.coordinates}
                                onClick={(coords) => setData('coordinates', coords)}
                                selectedZone={selectedZone}
                                onPolygonComplete={handlePolygonComplete}
                            />
                        </div>
                    </div>

                    {/* Zone Form - Appears when drawing is complete */}
                    {showForm && (
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Zone Details</CardTitle>
                                <CardDescription>
                                    Enter the details for your selected zone area
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ZoneForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    onSubmit={handleSubmit}
                                    isProcessing={processing}
                                    onCancel={() => setShowForm(false)}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Stats and List Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Stats Cards */}
                        <Card className="md:col-span-3">
                            <CardHeader>
                                <CardTitle>Zone Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    <ZoneStats stats={stats} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Zone List */}
                        <div className="md:col-span-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Zone List</CardTitle>
                                        <CardDescription>
                                            Manage your delivery zones
                                        </CardDescription>
                                    </div>
                                    <Input 
                                        placeholder="Search zones..." 
                                        className="max-w-xs"
                                        onChange={(e) => {
                                            // Add search functionality
                                        }}
                                    />
                                </CardHeader>
                                <CardContent>
                                    <ZoneList
                                        zones={zones}
                                        selectedZone={selectedZone}
                                        onSelect={handleZoneSelect}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Create/Edit Zone Dialog */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>
                                {selectedZone ? 'Edit Zone' : 'Create Zone'}
                            </DialogTitle>
                        </DialogHeader>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Zone Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
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
                                            onChange={(e) => setData('display_name', e.target.value)}
                                            placeholder="Enter display name"
                                        />
                                        {errors.display_name && (
                                            <p className="text-sm text-destructive">{errors.display_name}</p>
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
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {selectedZone ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default Index; 