import React from "react";
import { Head, useForm } from "@inertiajs/react";
import SettingsLayout from "../Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { RefreshCw, Trash } from "lucide-react";
import { useToast } from "@/Components/ui/use-toast";

export default function SystemSettings() {
  const { toast } = useToast();
  const { post, processing } = useForm();

  const handleClearCache = () => {
    post(route("app.settings.system.cache.clear"), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Cache cleared successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to clear cache",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <SettingsLayout>
      <Head title="System Settings" />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cache Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Clear various system caches to ensure optimal performance and
                reflect recent changes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleClearCache}
                  disabled={processing}
                  className="w-full sm:w-auto"
                >
                  {processing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Clearing Cache...
                    </>
                  ) : (
                    <>
                      <Trash className="w-4 h-4 mr-2" />
                      Clear All Cache
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
} 