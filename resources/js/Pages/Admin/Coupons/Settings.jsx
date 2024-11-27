import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Button } from "@/Components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Switch } from "@/Components/ui/switch";
import { useForm } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";

const CouponSettings = ({ coupon }) => {
  const { toast } = useToast();
  const { data, setData, put, processing } = useForm({
    notifications_enabled: coupon.notifications_enabled ?? false,
    auto_apply: coupon.auto_apply ?? false,
    track_usage: coupon.track_usage ?? true,
  });

  const handleSettingChange = (key, value) => {
    setData(key, value);
    put(route('app.coupons.settings.update', coupon.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Settings updated successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update settings",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <AdminLayout>
      <Head title={`Coupon Settings - ${coupon.code}`} />

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href={route('app.coupons.index')}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-semibold">Coupon Settings</h1>
            </div>
            <p className="text-muted-foreground">
              Configure settings for coupon code: {coupon.code}
            </p>
          </div>
        </div>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Enable email notifications for coupon usage
                </div>
              </div>
              <Switch
                checked={data.notifications_enabled}
                onCheckedChange={(checked) => 
                  handleSettingChange('notifications_enabled', checked)
                }
                disabled={processing}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Auto Apply</div>
                <div className="text-sm text-muted-foreground">
                  Automatically apply coupon when conditions are met
                </div>
              </div>
              <Switch
                checked={data.auto_apply}
                onCheckedChange={(checked) => 
                  handleSettingChange('auto_apply', checked)
                }
                disabled={processing}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Track Usage</div>
                <div className="text-sm text-muted-foreground">
                  Track detailed usage statistics for this coupon
                </div>
              </div>
              <Switch
                checked={data.track_usage}
                onCheckedChange={(checked) => 
                  handleSettingChange('track_usage', checked)
                }
                disabled={processing}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CouponSettings; 