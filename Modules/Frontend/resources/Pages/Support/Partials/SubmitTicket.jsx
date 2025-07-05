import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, AlertCircle, Upload, X } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { cn } from '@/lib/utils';

const SubmitTicket = ({ data }) => {
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const { data: formData, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        subject: '',
        category: '',
        priority: '',
        message: '',
        order_number: '',
        attachments: [],
    });

    // If no data is provided, return null
    if (!data) return null;

    // Handle file selection via file input or drag and drop
    const handleFileChange = (e) => {
        e.preventDefault();

        // Extract files from event
        const newFiles = e.target.files || e.dataTransfer.files;

        if (newFiles.length > 0) {
            // Create an array to hold the new files
            const selectedFiles = Array.from(newFiles);

            // Check if we will exceed the maximum file count
            if (files.length + selectedFiles.length > 5) {
                alert('You can upload a maximum of 5 files');
                return;
            }

            // Check each file size (max 10MB)
            const overSizedFiles = selectedFiles.filter(file => file.size > 10 * 1024 * 1024);

            if (overSizedFiles.length > 0) {
                alert(`The following files exceed the 10MB limit: ${overSizedFiles.map(f => f.name).join(', ')}`);
                return;
            }

            // Update files state and form data
            const updatedFiles = [...files, ...selectedFiles];
            setFiles(updatedFiles);
            setData('attachments', updatedFiles);
        }
    };

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    // Handle drop event
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e);
        }
    };

    // Remove a file from the list
    const removeFile = (indexToRemove) => {
        const updatedFiles = files.filter((_, index) => index !== indexToRemove);
        setFiles(updatedFiles);
        setData('attachments', updatedFiles);
    };

    // Submit the form
    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('frontend.support.ticket'), {
            onSuccess: () => {
                reset();
                setFiles([]);
                // Show success message (using flash messages in Laravel/Inertia)
            },
        });
    };

    // Format file size for display
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    return (
        <div id="support-ticket" className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-primary/10 dark:bg-primary/5 px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {data.title || 'Submit a Support Ticket'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {data.description || 'Fill out the form below to get help from our support team'}
                </p>
            </div>

            {/* Form */}
            <motion.form
                onSubmit={handleSubmit}
                className="p-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                {/* Error Alert */}
                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <AlertDescription>
                            Please fix the errors below and try again.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-900 dark:text-white">
                            Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={cn(
                                "border-gray-300 dark:border-gray-700",
                                "focus:border-primary focus:ring-primary",
                                errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500"
                            )}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-900 dark:text-white">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={cn(
                                "border-gray-300 dark:border-gray-700",
                                "focus:border-primary focus:ring-primary",
                                errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500"
                            )}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>
                </div>

                {/* Subject */}
                <div className="space-y-2 mb-6">
                    <Label htmlFor="subject" className="text-gray-900 dark:text-white">
                        Subject <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="subject"
                        type="text"
                        placeholder="Brief description of your issue"
                        value={formData.subject}
                        onChange={(e) => setData('subject', e.target.value)}
                        className={cn(
                            "border-gray-300 dark:border-gray-700",
                            "focus:border-primary focus:ring-primary",
                            errors.subject && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                    />
                    {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                    )}
                </div>

                {/* Order Number */}
                <div className="space-y-2 mb-6">
                    <Label htmlFor="order_number" className="text-gray-900 dark:text-white">
                        Order Number <span className="text-gray-500 text-sm font-normal">(Optional)</span>
                    </Label>
                    <Input
                        id="order_number"
                        type="text"
                        placeholder="If applicable, enter your order number"
                        value={formData.order_number}
                        onChange={(e) => setData('order_number', e.target.value)}
                        className="border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary"
                    />
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Category Field */}
                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-gray-900 dark:text-white">
                            Category <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => setData('category', value)}
                        >
                            <SelectTrigger
                                className={cn(
                                    "border-gray-300 dark:border-gray-700",
                                    "focus:border-primary focus:ring-primary",
                                    errors.category && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                )}
                            >
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {data.categories?.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                        )}
                    </div>

                    {/* Priority Field */}
                    <div className="space-y-2">
                        <Label htmlFor="priority" className="text-gray-900 dark:text-white">
                            Priority <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.priority}
                            onValueChange={(value) => setData('priority', value)}
                        >
                            <SelectTrigger
                                className={cn(
                                    "border-gray-300 dark:border-gray-700",
                                    "focus:border-primary focus:ring-primary",
                                    errors.priority && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                )}
                            >
                                <SelectValue placeholder="Select priority level" />
                            </SelectTrigger>
                            <SelectContent>
                                {data.priorities?.map((priority) => (
                                    <SelectItem key={priority.id} value={priority.id}>
                                        {priority.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.priority && (
                            <p className="text-red-500 text-sm mt-1">{errors.priority}</p>
                        )}
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-2 mb-6">
                    <Label htmlFor="message" className="text-gray-900 dark:text-white">
                        Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="message"
                        placeholder="Describe your issue in detail"
                        value={formData.message}
                        onChange={(e) => setData('message', e.target.value)}
                        rows={6}
                        className={cn(
                            "border-gray-300 dark:border-gray-700",
                            "focus:border-primary focus:ring-primary",
                            errors.message && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                    />
                    {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                    )}
                </div>

                {/* File Upload */}
                <div className="space-y-2 mb-6">
                    <Label className="text-gray-900 dark:text-white">
                        Attachments <span className="text-gray-500 text-sm font-normal">(Optional, max 5 files, 10MB each)</span>
                    </Label>

                    {/* Drag and Drop Area */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={cn(
                            "border-2 border-dashed rounded-lg p-6 text-center",
                            "transition-colors duration-200",
                            dragActive
                                ? "border-primary bg-primary/5"
                                : "border-gray-300 dark:border-gray-700 hover:border-primary/50",
                            files.length >= 5 && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                            Drag and drop files here, or <span className="text-primary font-medium">browse</span>
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 text-sm">
                            PNG, JPG, PDF, ZIP, DOC up to 10MB
                        </p>

                        {/* Hidden input for file selection */}
                        <input
                            type="file"
                            id="file-upload"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={files.length >= 5}
                        />

                        {/* Browse button */}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => document.getElementById('file-upload').click()}
                            disabled={files.length >= 5}
                        >
                            Browse Files
                        </Button>
                    </div>

                    {/* File Preview */}
                    {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                            <span className="text-xs text-gray-700 dark:text-gray-300 uppercase">{file.name.split('.').pop()}</span>
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(index)}
                                        className="text-gray-500 hover:text-red-500"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {errors.attachments && (
                        <p className="text-red-500 text-sm mt-1">{errors.attachments}</p>
                    )}
                </div>

                {/* Expected Response Time */}
                {data.responseTime && (
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            <span className="font-semibold">Expected response time:</span> {data.responseTime}
                        </p>
                        {data.supportHours && (
                            <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                                <span className="font-semibold">Support hours:</span> {data.supportHours}
                            </p>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="flex items-center space-x-2 min-w-[150px]"
                    >
                        <span>{processing ? 'Submitting...' : 'Submit Ticket'}</span>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </motion.form>
        </div>
    );
};

export default SubmitTicket; 