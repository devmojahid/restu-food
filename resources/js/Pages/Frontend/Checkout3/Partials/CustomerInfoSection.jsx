import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

const CustomerInfoSection = ({
    isOpen,
    toggleSection,
    onComplete,
    initialValues = {},
    isComplete = false,
    errors = {}
}) => {
    const [formData, setFormData] = useState({
        firstName: initialValues?.firstName || '',
        lastName: initialValues?.lastName || '',
        email: initialValues?.email || '',
        phone: initialValues?.phone || ''
    });

    const [localErrors, setLocalErrors] = useState({});

    // Update form when initialValues change
    useEffect(() => {
        if (initialValues) {
            setFormData({
                firstName: initialValues.firstName || formData.firstName,
                lastName: initialValues.lastName || formData.lastName,
                email: initialValues.email || formData.email,
                phone: initialValues.phone || formData.phone
            });
        }
    }, [initialValues]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error for this field when user types
        if (localErrors[name]) {
            setLocalErrors({
                ...localErrors,
                [name]: ''
            });
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        }

        return errors;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setLocalErrors(validationErrors);
            return;
        }

        onComplete(formData);
    };

    return (
        <div className="mb-6">
            <div
                className={cn(
                    "border rounded-lg overflow-hidden transition-all",
                    isComplete && !isOpen ? "border-green-200 bg-green-50" : "border-gray-200",
                    isOpen ? "shadow-md" : ""
                )}
            >
                {/* Section Header - Always visible */}
                <div
                    className={cn(
                        "flex items-center justify-between p-4 cursor-pointer transition-colors",
                        isOpen ? "bg-gray-50" : isComplete ? "bg-green-50" : "bg-white",
                        (isComplete && !isOpen) ? "hover:bg-green-100" : "hover:bg-gray-50"
                    )}
                    onClick={toggleSection}
                >
                    <div className="flex items-center">
                        <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full mr-3",
                            isComplete ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        )}>
                            {isComplete ? (
                                <Check className="h-5 w-5" />
                            ) : (
                                <User className="h-5 w-5" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-medium text-lg">Customer Information</h3>
                            {!isOpen && isComplete && (
                                <p className="text-sm text-gray-500">
                                    {formData.firstName} {formData.lastName} • {formData.email}
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                    </div>
                </div>

                {/* Section Content - Only visible when expanded */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <form onSubmit={handleSubmit} className="p-4 pt-2 space-y-4 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={localErrors.firstName ? "border-red-300" : ""}
                                        />
                                        {localErrors.firstName && (
                                            <p className="text-sm text-red-500">{localErrors.firstName}</p>
                                        )}
                                        {errors.firstName && (
                                            <p className="text-sm text-red-500">{errors.firstName}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={localErrors.lastName ? "border-red-300" : ""}
                                        />
                                        {localErrors.lastName && (
                                            <p className="text-sm text-red-500">{localErrors.lastName}</p>
                                        )}
                                        {errors.lastName && (
                                            <p className="text-sm text-red-500">{errors.lastName}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={localErrors.email ? "border-red-300" : ""}
                                    />
                                    {localErrors.email && (
                                        <p className="text-sm text-red-500">{localErrors.email}</p>
                                    )}
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={localErrors.phone ? "border-red-300" : ""}
                                    />
                                    {localErrors.phone && (
                                        <p className="text-sm text-red-500">{localErrors.phone}</p>
                                    )}
                                    {errors.phone && (
                                        <p className="text-sm text-red-500">{errors.phone}</p>
                                    )}
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <Button type="submit">
                                        Continue to Shipping
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CustomerInfoSection; 