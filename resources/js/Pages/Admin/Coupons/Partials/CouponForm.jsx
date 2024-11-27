import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import { Separator } from "@/Components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { DatePicker } from "@/Components/ui/date-picker";
import { Save, X, Loader2, AlertCircle, Percent, DollarSign } from "lucide-react";
import { useToast } from "@/Components/ui/use-toast";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { cn } from "@/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/Components/ui/card";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Badge } from "@/Components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip";
import { format } from "date-fns";

const CouponForm = ({ 
  coupon, 
  isEditing, 
  onCancel, 
  onSuccess, 
  can,
  isProcessing,
  setIsProcessing 
}) => {
  const { flash } = usePage().props;
  const { toast } = useToast();
  const [isDirty, setIsDirty] = useState(false);
  const [localProcessing, setLocalProcessing] = useState(false);

  // Initial form state
  const initialFormState = {
    code: "",
    type: "percentage",
    value: "",
    min_order_value: "",
    max_uses: "",
    start_date: null,
    end_date: null,
    is_active: true,
    description: "",
    max_discount_amount: "",
    user_type: "all",
    usage_limit_per_user: "",
    exclude_sale_items: false,
    exclude_categories: [],
    include_categories: [],
    exclude_products: [],
    include_products: [],
    min_items_count: "",
  };

  const {
    data,
    setData,
    post,
    put,
    processing,
    errors,
    reset,
    clearErrors,
    setError,
  } = useForm(initialFormState);

  // Update form initialization
  useEffect(() => {
    if (isEditing && coupon) {
      const formattedData = {
        ...initialFormState,
        ...coupon,
        start_date: coupon.start_date ? new Date(coupon.start_date) : null,
        end_date: coupon.end_date ? new Date(coupon.end_date) : null,
      };
      setData(formattedData);
      setIsDirty(false); // Reset dirty state for edit
    } else {
      setData(initialFormState);
      setIsDirty(false); // Reset dirty state for create
    }
  }, [coupon?.id, isEditing]); // Only re-run when coupon ID or editing state changes

  // Update flash message handler
  useEffect(() => {
    if (flash?.success) {
      toast({
        title: isEditing ? "Updated!" : "Created!",
        description: flash.message,
      });
      setLocalProcessing(true);
      setIsProcessing?.(true);
      onSuccess?.();
    } else if (flash?.error) {
      toast({
        title: "Error",
        description: flash.message,
        variant: "destructive",
      });
      setLocalProcessing(false);
      setIsProcessing?.(false);
    }
  }, [flash?.success, flash?.error]); // Only depend on flash success/error

  // Form validation (moved up)
  const formValidation = useMemo(() => {
    const errors = {};
    
    if (!data.code) {
      errors.code = 'Coupon code is required';
    }
    
    if (!data.value || data.value <= 0) {
      errors.value = 'Value must be greater than 0';
    }
    
    if (data.type === 'percentage' && data.value > 100) {
      errors.value = 'Percentage cannot exceed 100%';
    }
    
    if (data.end_date && data.start_date && new Date(data.end_date) < new Date(data.start_date)) {
      errors.end_date = 'End date must be after start date';
    }
    
    return errors;
  }, [data]);

  // Enhanced form submission (after formValidation)
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (localProcessing) return; // Prevent double submission

    clearErrors();
    setLocalProcessing(true);
    setIsProcessing?.(true);

    const formData = {
      ...data,
      start_date: data.start_date ? new Date(data.start_date).toISOString() : null,
      end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
    };

    const action = isEditing ? put : post;
    const url = route(
      isEditing ? 'app.coupons.update' : 'app.coupons.store', 
      isEditing ? [coupon.id] : []
    );

    action(url, formData, {
      preserveScroll: true,
      onError: (errors) => {
        Object.keys(errors).forEach(key => {
          setError(key, errors[key]);
        });
        toast({
          title: "Error",
          description: "Please check the form for errors.",
          variant: "destructive",
        });
        setLocalProcessing(false);
        setIsProcessing?.(false);
      },
    });
  }, [isEditing, coupon, data, put, post, clearErrors, setError, toast, localProcessing]);

  // Add form state tracking
  useEffect(() => {
    const isFormDirty = JSON.stringify(initialFormState) !== JSON.stringify(data);
    setIsDirty(isFormDirty);
  }, [data, initialFormState]);

  // Add unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty && !localProcessing) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, localProcessing]);

  // Enhanced form status indicator
  const FormStatus = () => {
    if (localProcessing) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Processing...
        </Badge>
      );
    }
    
    if (Object.keys(errors).length > 0) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700">
          <AlertCircle className="w-3 h-3 mr-1" />
          Has Errors
        </Badge>
      );
    }

    if (isDirty) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
          <AlertCircle className="w-3 h-3 mr-1" />
          Unsaved Changes
        </Badge>
      );
    }
    
    return null;
  };

  // Form sections
  const formSections = [
    {
      id: "basic",
      label: "Basic Info",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormItem className="col-span-full">
              <FormLabel error={errors.code}>
                Coupon Code <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  value={data.code}
                  onChange={(e) => setData("code", e.target.value.toUpperCase())}
                  placeholder="SUMMER2024"
                  className="uppercase font-mono tracking-wider"
                />
              </FormControl>
              <FormDescription>
                A unique code for customers to apply at checkout
              </FormDescription>
              <FormMessage error={errors.code} />
            </FormItem>

            <FormItem>
              <FormLabel error={errors.type}>
                Discount Type <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                value={data.type}
                onValueChange={(value) => setData("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">
                    <div className="flex items-center">
                      <Percent className="w-4 h-4 mr-2" />
                      Percentage Off
                    </div>
                  </SelectItem>
                  <SelectItem value="fixed">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Fixed Amount
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage error={errors.type} />
            </FormItem>

            <FormItem>
              <FormLabel error={errors.value}>
                Value <span className="text-red-500">*</span>
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="number"
                    value={data.value}
                    onChange={(e) => setData("value", e.target.value)}
                    placeholder={data.type === "percentage" ? "10" : "50"}
                    min="0"
                    max={data.type === "percentage" ? "100" : undefined}
                    step="0.01"
                    className="pl-8"
                  />
                </FormControl>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {data.type === "percentage" ? "%" : "$"}
                </span>
              </div>
              <FormMessage error={errors.value} />
            </FormItem>
          </div>

          <FormItem>
            <FormLabel error={errors.description}>Description</FormLabel>
            <FormControl>
              <Textarea
                value={data.description || ""}
                onChange={(e) => setData("description", e.target.value)}
                placeholder="Describe the coupon and its terms"
                className="h-20"
              />
            </FormControl>
            <FormMessage error={errors.description} />
          </FormItem>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormItem>
              <FormLabel error={errors.start_date}>Start Date</FormLabel>
              <DatePicker
                value={data.start_date}
                onChange={(date) => setData("start_date", date)}
              />
              <FormMessage error={errors.start_date} />
            </FormItem>

            <FormItem>
              <FormLabel error={errors.end_date}>End Date</FormLabel>
              <DatePicker
                value={data.end_date}
                onChange={(date) => setData("end_date", date)}
                minDate={data.start_date}
              />
              <FormMessage error={errors.end_date} />
            </FormItem>
          </div>
        </div>
      ),
    },
    {
      id: "limits",
      label: "Usage Limits",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormItem>
              <FormLabel error={errors.min_order_value}>
                Minimum Order Value
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="number"
                    value={data.min_order_value}
                    onChange={(e) => setData("min_order_value", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="pl-8"
                  />
                </FormControl>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
              </div>
              <FormMessage error={errors.min_order_value} />
            </FormItem>

            <FormItem>
              <FormLabel error={errors.max_discount_amount}>
                Maximum Discount
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="number"
                    value={data.max_discount_amount}
                    onChange={(e) => setData("max_discount_amount", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="pl-8"
                  />
                </FormControl>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
              </div>
              <FormMessage error={errors.max_discount_amount} />
            </FormItem>

            <FormItem>
              <FormLabel error={errors.max_uses}>Total Usage Limit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={data.max_uses}
                  onChange={(e) => setData("max_uses", e.target.value)}
                  placeholder="Unlimited"
                  min="1"
                />
              </FormControl>
              <FormDescription>
                Maximum number of times this coupon can be used
              </FormDescription>
              <FormMessage error={errors.max_uses} />
            </FormItem>

            <FormItem>
              <FormLabel error={errors.usage_limit_per_user}>
                Per User Limit
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={data.usage_limit_per_user}
                  onChange={(e) =>
                    setData("usage_limit_per_user", e.target.value)
                  }
                  placeholder="Unlimited"
                  min="1"
                />
              </FormControl>
              <FormDescription>
                How many times each user can use this coupon
              </FormDescription>
              <FormMessage error={errors.usage_limit_per_user} />
            </FormItem>
          </div>

          <FormItem>
            <FormLabel error={errors.user_type}>User Type</FormLabel>
            <Select
              value={data.user_type}
              onValueChange={(value) => setData("user_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="new">New Users Only</SelectItem>
                <SelectItem value="existing">Existing Users Only</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage error={errors.user_type} />
          </FormItem>

          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Active Status</FormLabel>
              <FormDescription>
                Disable to temporarily suspend this coupon
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={data.is_active}
                onCheckedChange={(checked) => setData("is_active", checked)}
              />
            </FormControl>
          </FormItem>
        </div>
      ),
    },
    {
      id: "restrictions",
      label: "Restrictions",
      content: (
        <div className="space-y-6">
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Exclude Sale Items</FormLabel>
              <FormDescription>
                Prevent this coupon from being applied to items on sale
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={data.exclude_sale_items}
                onCheckedChange={(checked) =>
                  setData("exclude_sale_items", checked)
                }
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel error={errors.min_items_count}>
              Minimum Items in Cart
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                value={data.min_items_count}
                onChange={(e) => setData("min_items_count", e.target.value)}
                placeholder="No minimum"
                min="1"
              />
            </FormControl>
            <FormDescription>
              Minimum number of items required in cart
            </FormDescription>
            <FormMessage error={errors.min_items_count} />
          </FormItem>
        </div>
      ),
    },
  ];

  // Add help tooltips to form fields
  const FormFieldWithTooltip = ({ label, tooltip, error, required, children }) => (
    <div className="relative group">
      <div className="flex items-center space-x-2">
        <FormLabel className={cn(error && "text-destructive")}>
          {label} {required && <span className="text-destructive">*</span>}
        </FormLabel>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {children}
    </div>
  );

  // Add this component
  const CouponPreview = ({ data }) => {
    const calculateSampleDiscount = useCallback(() => {
      const orderAmount = 100;
      if (data.type === 'percentage') {
        const discount = orderAmount * (data.value / 100);
        return data.max_discount_amount 
          ? Math.min(discount, data.max_discount_amount)
          : discount;
      }
      return Math.min(data.value || 0, orderAmount);
    }, [data.type, data.value, data.max_discount_amount]);

    const formatDate = useCallback((date) => {
      try {
        return date ? format(new Date(date), "PPP") : null;
      } catch (error) {
        return null;
      }
    }, []);

    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Live Preview</CardTitle>
          <CardDescription>See how your coupon will appear</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Code:</span>
              <Badge variant="outline" className="font-mono">
                {data.code || 'EXAMPLE'}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Type:</span>
              <Badge variant="secondary">
                {data.type === 'percentage' ? 'Percentage Off' : 'Fixed Amount'}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Value:</span>
              <span className="font-medium">
                {data.type === 'percentage' ? `${data.value || 0}%` : `$${data.value || 0}`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sample Discount:</span>
              <div className="text-right">
                <div className="font-medium text-green-600">
                  -${calculateSampleDiscount().toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  on $100 order
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge variant={data.is_active ? "success" : "secondary"}>
                {data.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {data.start_date && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valid From:</span>
                <span className="text-sm">
                  {formatDate(data.start_date)}
                </span>
              </div>
            )}

            {data.end_date && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expires On:</span>
                <span className="text-sm">
                  {formatDate(data.end_date)}
                </span>
              </div>
            )}

            {data.max_uses && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Usage Limit:</span>
                <span className="text-sm font-medium">{data.max_uses}</span>
              </div>
            )}

            {data.usage_limit_per_user && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Per User:</span>
                <span className="text-sm font-medium">{data.usage_limit_per_user}</span>
              </div>
            )}

            {data.min_order_value && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Min Order:</span>
                <span className="text-sm font-medium">${data.min_order_value}</span>
              </div>
            )}
          </div>

          {data.description && (
            <>
              <Separator className="my-3" />
              <div className="space-y-1.5">
                <span className="text-sm text-muted-foreground">Description:</span>
                <p className="text-sm text-foreground/90">{data.description}</p>
              </div>
            </>
          )}

          {(data.exclude_sale_items || data.min_items_count) && (
            <>
              <Separator className="my-3" />
              <div className="space-y-2">
                <span className="text-sm font-medium">Restrictions:</span>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {data.exclude_sale_items && (
                    <li>• Not valid on sale items</li>
                  )}
                  {data.min_items_count && (
                    <li>• Minimum {data.min_items_count} items required</li>
                  )}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  // Add form actions
  const FormActions = () => (
    <div className="flex items-center justify-between gap-4 sticky bottom-0 pt-4 bg-background border-t">
      <div className="flex items-center gap-2">
        <FormStatus />
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={localProcessing}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={localProcessing || (!isDirty && isEditing)}
        >
          {localProcessing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isEditing ? "Update" : "Create"} Coupon
        </Button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-1rem)] max-h-full">
      {/* Form Header */}
      <div className="flex-none px-6 py-4 border-b bg-background sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">
              {isEditing ? "Edit Coupon" : "Create New Coupon"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Update the coupon details below."
                : "Fill in the details to create a new coupon."}
            </p>
          </div>
          <FormStatus />
        </div>
      </div>

      {/* Form Content - Main scrollable area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row gap-6 p-6">
          {/* Main Form Area */}
          <div className="flex-1 min-w-0 lg:max-w-[calc(100%-24rem)]">
            <ScrollArea className="h-[calc(100vh-15rem)] lg:h-[calc(100vh-12rem)]" type="always">
              <div className="pr-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="w-full justify-start mb-4 sticky top-0 bg-background z-10">
                    {formSections.map((section) => (
                      <TabsTrigger
                        key={section.id}
                        value={section.id}
                        className="flex-1 sm:flex-none whitespace-nowrap"
                      >
                        {section.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <div className="space-y-6">
                    {formSections.map((section) => (
                      <TabsContent 
                        key={section.id} 
                        value={section.id}
                        className="mt-0 space-y-6"
                      >
                        <Card className="border-0 shadow-none">
                          <CardContent className="p-0">
                            {section.content}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              </div>
            </ScrollArea>
          </div>

          {/* Preview Panel - Fixed width on large screens */}
          <div className="w-full lg:w-96 flex-none">
            <div className="sticky top-0 lg:top-6">
              <CouponPreview data={data} />
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions - Sticky Footer */}
      <div className="flex-none px-6 py-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky bottom-0 z-50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {isDirty && !localProcessing && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                <AlertCircle className="w-3 h-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={localProcessing}
              className="min-w-[100px]"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={localProcessing || (!isDirty && isEditing)}
              className="min-w-[100px]"
            >
              {localProcessing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CouponForm; 