import React from "react";
import { Head, useForm } from "@inertiajs/react";
import SettingsLayout from "../Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { MediaUploader } from "@/Components/MediaUploader";
import { Toast } from "@/Components/ui/toast";

export default function StoreSettings() {
  const { data, setData, post, processing, errors } = useForm({
    store_name: "",
    store_email: "",
    store_phone: "",
    store_address: "",
    store_logo: null,
    store_favicon: null,
    meta_title: "",
    meta_description: "",
    footer_text: "",
    google_analytics: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.settings.store.update"), {
      preserveScroll: true,
    });
  };

  return (
    <SettingsLayout>
      <Head title="Store Settings" />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="store_name">Store Name</Label>
                  <Input
                    id="store_name"
                    value={data.store_name}
                    onChange={(e) => setData("store_name", e.target.value)}
                    placeholder="Enter store name"
                  />
                  {errors.store_name && (
                    <p className="text-red-500 text-sm">{errors.store_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store_email">Store Email</Label>
                  <Input
                    id="store_email"
                    type="email"
                    value={data.store_email}
                    onChange={(e) => setData("store_email", e.target.value)}
                    placeholder="store@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store_phone">Store Phone</Label>
                  <Input
                    id="store_phone"
                    value={data.store_phone}
                    onChange={(e) => setData("store_phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store_address">Store Address</Label>
                  <Textarea
                    id="store_address"
                    value={data.store_address}
                    onChange={(e) => setData("store_address", e.target.value)}
                    placeholder="Enter store address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Store Logo</Label>
                  <MediaUploader
                    onUpload={(file) => setData("store_logo", file)}
                    currentImage={data.store_logo}
                    maxFiles={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Store Favicon</Label>
                  <MediaUploader
                    onUpload={(file) => setData("store_favicon", file)}
                    currentImage={data.store_favicon}
                    maxFiles={1}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">SEO Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={data.meta_title}
                    onChange={(e) => setData("meta_title", e.target.value)}
                    placeholder="SEO Meta Title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={data.meta_description}
                    onChange={(e) =>
                      setData("meta_description", e.target.value)
                    }
                    placeholder="SEO Meta Description"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="footer_text">Footer Text</Label>
                  <Textarea
                    id="footer_text"
                    value={data.footer_text}
                    onChange={(e) => setData("footer_text", e.target.value)}
                    placeholder="Footer copyright text"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google_analytics">
                    Google Analytics Code
                  </Label>
                  <Textarea
                    id="google_analytics"
                    value={data.google_analytics}
                    onChange={(e) =>
                      setData("google_analytics", e.target.value)
                    }
                    placeholder="Paste your Google Analytics code here"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  {processing ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}
