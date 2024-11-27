import React, { useEffect, useCallback } from "react";
import { useForm } from "@inertiajs/react";
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
import { Card, CardContent } from "@/Components/ui/card";

const CouponForm = ({ coupon, isEditing, onCancel, onSuccess, can }) => {
  const { toast } = useToast();

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
  } = useForm(initialFormState);

  // Form sections
  const formSections = [
    {
      id: "basic",
      label: "Basic Info",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormItem className="col-span-2">
              <FormLabel error={errors.code}>
                Coupon Code <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  value={data.code}
                  onChange={(e) => setData("code", e.target.value.toUpperCase())}
                  placeholder="SUMMER2024"
                  className="uppercase font-mono"
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

          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
            <FormMessage error={errors.min_items_count} />
          </FormItem>
        </div>
      ),
    },
  ];

  // Complete reset function
  const resetForm = useCallback(() => {
    clearErrors();
    reset();
    setData(initialFormState);
  }, [clearErrors, reset, setData]);

  // Handle successful form submission
  const handleSuccess = useCallback(() => {
    if (!isEditing) {
      resetForm();
    }
    onSuccess?.();
  }, [isEditing, resetForm, onSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrors();

    if (isEditing) {
      put(route("app.coupons.update", coupon.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Coupon updated successfully",
          });
          handleSuccess();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update coupon",
            variant: "destructive",
          });
        },
      });
    } else {
      post(route("app.coupons.store"), {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Coupon created successfully",
          });
          handleSuccess();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create coupon",
            variant: "destructive",
          });
        },
      });
    }
  };

  // Handle cancel
  const handleCancel = useCallback(() => {
    resetForm();
    onCancel?.();
  }, [resetForm, onCancel]);

  // Reset form when coupon changes
  useEffect(() => {
    if (coupon && isEditing) {
      setData({
        ...coupon,
        start_date: coupon.start_date ? new Date(coupon.start_date) : null,
        end_date: coupon.end_date ? new Date(coupon.end_date) : null,
      });
    } else {
      resetForm();
    }
  }, [coupon, isEditing]);

  // Show validation errors summary
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {isEditing ? "Edit Coupon" : "Create New Coupon"}
        </h2>
        <div className="flex items-center gap-2">
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={processing}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={processing}>
            {processing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Validation Errors */}
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please correct the following errors:
            <ul className="mt-2 list-disc list-inside">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Form Content */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {formSections.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {formSections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            <Card>
              <CardContent className="pt-6">{section.content}</CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </form>
  );
};

export default CouponForm; 