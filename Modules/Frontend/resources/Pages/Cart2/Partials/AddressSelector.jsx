import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Home,
    Briefcase,
    Map,
    PenLine,
    Plus,
    Trash2,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { cn } from '@/lib/utils';

const AddressSelector = ({
    addresses = [],
    selectedAddress = null,
    onSelectAddress
}) => {
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        title: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        instructions: '',
        type: 'home'
    });

    // Default addresses if none provided
    const defaultAddresses = [
        {
            id: 'home-address',
            title: 'Home',
            address_line1: '123 Main Street',
            address_line2: 'Apt 4B',
            city: 'New York',
            state: 'NY',
            postal_code: '10001',
            instructions: 'Leave at the door. The doorbell is broken.',
            type: 'home',
            is_default: true
        },
        {
            id: 'work-address',
            title: 'Work',
            address_line1: '85 Business Avenue',
            address_line2: '15th Floor',
            city: 'New York',
            state: 'NY',
            postal_code: '10016',
            instructions: 'Call when you arrive at the lobby.',
            type: 'work'
        }
    ];

    const displayAddresses = addresses?.length > 0 ? addresses : defaultAddresses;
    const selected = selectedAddress?.id ? selectedAddress : displayAddresses.find(addr => addr.is_default) || displayAddresses[0];

    const handleNewAddressSubmit = (e) => {
        e.preventDefault();

        // In a real app, this would send the data to the server
        // For demo purposes, we'll just close the form
        setShowAddressForm(false);

        // Reset form
        setNewAddress({
            title: '',
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            postal_code: '',
            instructions: '',
            type: 'home'
        });
    };

    const getAddressIcon = (type) => {
        switch (type) {
            case 'home':
                return Home;
            case 'work':
                return Briefcase;
            default:
                return MapPin;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Delivery Address</h2>

                <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add New</span>
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                            <DialogDescription>
                                Enter the details for your new delivery address.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleNewAddressSubmit} className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <Label htmlFor="title">Address Label</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Home, Work, etc."
                                        value={newAddress.title}
                                        onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="address_line1">Address Line 1</Label>
                                    <Input
                                        id="address_line1"
                                        placeholder="Street address"
                                        value={newAddress.address_line1}
                                        onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
                                    <Input
                                        id="address_line2"
                                        placeholder="Apartment, suite, unit, etc."
                                        value={newAddress.address_line2}
                                        onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        placeholder="City"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        placeholder="State"
                                        value={newAddress.state}
                                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="postal_code">Postal Code</Label>
                                    <Input
                                        id="postal_code"
                                        placeholder="Postal code"
                                        value={newAddress.postal_code}
                                        onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                                    <Textarea
                                        id="instructions"
                                        placeholder="Special delivery instructions, building access codes, etc."
                                        value={newAddress.instructions}
                                        onChange={(e) => setNewAddress({ ...newAddress, instructions: e.target.value })}
                                        className="resize-none"
                                        rows={3}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label>Address Type</Label>
                                    <div className="flex space-x-4 mt-2">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id="type-home"
                                                name="address-type"
                                                value="home"
                                                checked={newAddress.type === 'home'}
                                                onChange={() => setNewAddress({ ...newAddress, type: 'home' })}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <Label htmlFor="type-home" className="cursor-pointer">Home</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id="type-work"
                                                name="address-type"
                                                value="work"
                                                checked={newAddress.type === 'work'}
                                                onChange={() => setNewAddress({ ...newAddress, type: 'work' })}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <Label htmlFor="type-work" className="cursor-pointer">Work</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id="type-other"
                                                name="address-type"
                                                value="other"
                                                checked={newAddress.type === 'other'}
                                                onChange={() => setNewAddress({ ...newAddress, type: 'other' })}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <Label htmlFor="type-other" className="cursor-pointer">Other</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" type="button">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Save Address</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {displayAddresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Map className="w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No addresses found</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                        You don't have any saved addresses yet. Add a new address to continue.
                    </p>
                    <Button
                        onClick={() => setShowAddressForm(true)}
                        className="flex items-center gap-1"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add New Address</span>
                    </Button>
                </div>
            ) : (
                <RadioGroup
                    defaultValue={selected?.id}
                    value={selected?.id}
                    onValueChange={(value) => {
                        const address = displayAddresses.find(addr => addr.id === value);
                        if (address) {
                            onSelectAddress(address);
                        }
                    }}
                    className="space-y-4"
                >
                    {displayAddresses.map((address) => {
                        const Icon = getAddressIcon(address.type);
                        const isSelected = selected?.id === address.id;

                        return (
                            <div
                                key={address.id}
                                className={cn(
                                    "relative rounded-xl overflow-hidden",
                                    "border transition-all duration-300 p-4",
                                    isSelected
                                        ? "border-primary/70 ring-2 ring-primary/30 bg-primary/5 dark:bg-primary/10"
                                        : "border-gray-200 dark:border-gray-700 hover:border-primary/40"
                                )}
                            >
                                <RadioGroupItem
                                    value={address.id}
                                    id={address.id}
                                    className="absolute top-4 right-4"
                                />

                                <div className="flex">
                                    <div className="mr-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center",
                                            isSelected
                                                ? "bg-primary/10 text-primary"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                        )}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center mb-1">
                                            <span className="font-semibold mr-2">{address.title}</span>

                                            {address.is_default && (
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                    Default
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                                            {address.address_line1}
                                            {address.address_line2 && `, ${address.address_line2}`}
                                        </p>

                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                            {address.city}, {address.state} {address.postal_code}
                                        </p>

                                        {address.instructions && (
                                            <div className="mt-2 text-xs bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                                                <span className="font-medium block mb-1">Delivery Instructions:</span>
                                                <p className="italic text-gray-600 dark:text-gray-400">
                                                    "{address.instructions}"
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-end mt-3 gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 text-gray-500"
                                            >
                                                <PenLine className="h-3.5 w-3.5 mr-1" />
                                                <span className="text-xs">Edit</span>
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                <span className="text-xs">Remove</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="absolute top-4 right-4">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </RadioGroup>
            )}
        </motion.div>
    );
};

export default AddressSelector; 