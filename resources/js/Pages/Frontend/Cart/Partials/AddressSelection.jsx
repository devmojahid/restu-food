import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Home,
    Building2,
    Map,
    Plus,
    ChevronDown,
    Edit,
    Trash2,
    Check,
    X,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Textarea } from '@/Components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/Components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from '@/Components/ui/dialog';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/Components/ui/collapsible';
import { Badge } from '@/Components/ui/badge';
import { useToast } from '@/Components/ui/use-toast';
import { cn } from '@/lib/utils';

const AddressForm = ({ existingAddress = null, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: existingAddress?.name || '',
        address_line1: existingAddress?.address_line1 || '',
        address_line2: existingAddress?.address_line2 || '',
        city: existingAddress?.city || '',
        state: existingAddress?.state || '',
        postal_code: existingAddress?.postal_code || '',
        country: existingAddress?.country || 'USA',
        phone: existingAddress?.phone || '',
        is_default: existingAddress?.is_default || false,
        delivery_instructions: existingAddress?.delivery_instructions || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!formData.name || !formData.address_line1 || !formData.city ||
            !formData.state || !formData.postal_code || !formData.phone) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            // In a real app, you would submit to an API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Call the onSave callback with the form data
            onSave({
                ...formData,
                id: existingAddress?.id || Date.now().toString()
            });

            toast({
                title: existingAddress ? "Address Updated" : "Address Added",
                description: existingAddress ?
                    "Your delivery address has been updated" :
                    "Your new delivery address has been added",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save address. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Address Name (e.g. Home, Work)</Label>
                <Input
                    id="name"
                    name="name"
                    placeholder="Home"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <Label htmlFor="address_line1">Address Line 1</Label>
                <Input
                    id="address_line1"
                    name="address_line1"
                    placeholder="123 Main Street"
                    value={formData.address_line1}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
                <Input
                    id="address_line2"
                    name="address_line2"
                    placeholder="Apt 4B"
                    value={formData.address_line2}
                    onChange={handleChange}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                        id="city"
                        name="city"
                        placeholder="New York"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                        id="state"
                        name="state"
                        placeholder="NY"
                        value={formData.state}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                        id="postal_code"
                        name="postal_code"
                        placeholder="10001"
                        value={formData.postal_code}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                        id="country"
                        name="country"
                        placeholder="USA"
                        value={formData.country}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <Label htmlFor="delivery_instructions">Delivery Instructions (Optional)</Label>
                <Textarea
                    id="delivery_instructions"
                    name="delivery_instructions"
                    placeholder="Ring doorbell twice, leave at the door, etc."
                    value={formData.delivery_instructions}
                    onChange={handleChange}
                    className="resize-none h-20"
                />
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="is_default"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="is_default" className="text-sm font-normal">
                    Set as default delivery address
                </Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            {existingAddress ? 'Update' : 'Add'} Address
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};

const AddressCard = ({ address, isSelected, onSelect, onEdit, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();

    const handleDelete = async (e) => {
        e.stopPropagation();

        setIsDeleting(true);
        try {
            // In a real app, you would delete via API
            await new Promise(resolve => setTimeout(resolve, 800));

            onDelete(address.id);

            toast({
                title: "Address Deleted",
                description: "Your delivery address has been removed",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete address",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const getAddressIcon = () => {
        if (address.name.toLowerCase().includes('home')) return Home;
        if (address.name.toLowerCase().includes('work') || address.name.toLowerCase().includes('office')) return Building2;
        return MapPin;
    };

    const AddressIcon = getAddressIcon();

    return (
        <motion.div
            whileHover={{ y: -2 }}
            onClick={() => onSelect(address.id)}
            className={cn(
                "relative p-4 rounded-xl cursor-pointer transition-all duration-300",
                "border",
                isSelected
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary/50",
                "flex"
            )}
        >
            {/* Selection indicator */}
            {isSelected && (
                <div className="absolute top-3 right-3">
                    <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                    </div>
                </div>
            )}

            <div className="mr-4">
                <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center",
                    isSelected ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                )}>
                    <AddressIcon className="h-5 w-5" />
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center">
                    <h3 className="font-medium text-gray-900 dark:text-white">{address.name}</h3>
                    {address.is_default && (
                        <Badge variant="outline" className="ml-2 text-xs">Default</Badge>
                    )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {address.address_line1}
                    {address.address_line2 && `, ${address.address_line2}`},
                    {address.city}, {address.state} {address.postal_code}, {address.country}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {address.phone}
                </p>

                {/* Actions */}
                <div className="flex mt-2 space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(address);
                        }}
                    >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                            <Trash2 className="h-3 w-3 mr-1" />
                        )}
                        Delete
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

const AddressSelection = ({ addresses = [], onAddressSelect, selectedAddressId = null }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [selectedId, setSelectedId] = useState(selectedAddressId);
    const { toast } = useToast();

    // Ensure addresses is an array
    const safeAddresses = Array.isArray(addresses) ? addresses : [];

    // Find the default address if no address is selected
    const defaultAddress = safeAddresses.find(a => a.is_default);

    // Set selected address to default if none is selected
    React.useEffect(() => {
        if (!selectedId && defaultAddress) {
            setSelectedId(defaultAddress.id);
            if (onAddressSelect) onAddressSelect(defaultAddress.id);
        }
    }, [defaultAddress, selectedId, onAddressSelect]);

    const handleSelect = (addressId) => {
        setSelectedId(addressId);
        if (onAddressSelect) onAddressSelect(addressId);
    };

    const handleAddAddress = (newAddress) => {
        // In a real app, you would update state through a proper state management system
        console.log('Added new address:', newAddress);
        setIsAddDialogOpen(false);

        // If it's set as default, select it
        if (newAddress.is_default) {
            handleSelect(newAddress.id);
        }
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setIsAddDialogOpen(true);
    };

    const handleUpdateAddress = (updatedAddress) => {
        // In a real app, you would update state through a proper state management system
        console.log('Updated address:', updatedAddress);
        setIsAddDialogOpen(false);
        setEditingAddress(null);
    };

    const handleDeleteAddress = (addressId) => {
        // In a real app, you would update state through a proper state management system
        console.log('Deleted address:', addressId);

        // If the deleted address was selected, select the default or first available
        if (selectedId === addressId) {
            const newSelectedId = defaultAddress?.id || safeAddresses[0]?.id;
            if (newSelectedId) {
                handleSelect(newSelectedId);
            }
        }
    };

    if (safeAddresses.length === 0) {
        return (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Delivery Address</CardTitle>
                    <CardDescription>Add an address for delivery</CardDescription>
                </CardHeader>

                <CardContent className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <MapPin className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Addresses Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Please add a delivery address to continue with your order.
                    </p>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Address
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add Delivery Address</DialogTitle>
                                <DialogDescription>
                                    Enter your delivery address details below
                                </DialogDescription>
                            </DialogHeader>

                            <AddressForm
                                onSave={handleAddAddress}
                                onCancel={() => setIsAddDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Delivery Address</CardTitle>
                        <CardDescription>Select where to deliver your order</CardDescription>
                    </div>
                    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-9 p-0">
                                <ChevronDown className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    isOpen ? "rotate-180" : "rotate-0"
                                )} />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent className="pt-2">
                                <div className="space-y-3">
                                    <div className="space-y-3">
                                        <AnimatePresence>
                                            {safeAddresses.map(address => (
                                                <AddressCard
                                                    key={address.id}
                                                    address={address}
                                                    isSelected={selectedId === address.id}
                                                    onSelect={handleSelect}
                                                    onEdit={handleEditAddress}
                                                    onDelete={handleDeleteAddress}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full mt-4">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add New Address
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    {editingAddress ? 'Edit' : 'Add'} Delivery Address
                                                </DialogTitle>
                                                <DialogDescription>
                                                    {editingAddress
                                                        ? 'Update your delivery address details below'
                                                        : 'Enter your delivery address details below'
                                                    }
                                                </DialogDescription>
                                            </DialogHeader>

                                            <AddressForm
                                                existingAddress={editingAddress}
                                                onSave={editingAddress ? handleUpdateAddress : handleAddAddress}
                                                onCancel={() => {
                                                    setIsAddDialogOpen(false);
                                                    setEditingAddress(null);
                                                }}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </CardHeader>
        </Card>
    );
};

export default AddressSelection; 