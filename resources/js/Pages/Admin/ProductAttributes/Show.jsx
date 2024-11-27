import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Home, Box } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";

const Show = ({ attribute, can }) => {
  return (
    <AdminLayout>
      <Head title={`Attribute: ${attribute.name}`} />
      <div className="container mx-auto py-6 px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Product Attributes", href: "app.product-attributes.index", icon: Box },
            { label: attribute.name },
          ]}
        />

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">{attribute.name}</h1>
            {can.edit && (
              <Link href={route("app.product-attributes.edit", attribute.id)}>
                <Button>Edit Attribute</Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                  <dd className="mt-1">{attribute.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Slug</dt>
                  <dd className="mt-1">{attribute.slug}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                  <dd className="mt-1">
                    <Badge variant="secondary">
                      {attribute.type.charAt(0).toUpperCase() + attribute.type.slice(1)}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd className="mt-1">
                    <Badge variant={attribute.is_visible ? "success" : "secondary"}>
                      {attribute.is_visible ? "Visible" : "Hidden"}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
                  <dd className="mt-1">{format(new Date(attribute.created_at), "PPP")}</dd>
                </div>
              </dl>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Attribute Values</h2>
              <div className="space-y-4">
                {attribute.values.map((value) => (
                  <div
                    key={value.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {attribute.type === "color" && (
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: value.color_code }}
                        />
                      )}
                      <div>
                        <div className="font-medium">{value.label || value.value}</div>
                        {value.label && (
                          <div className="text-sm text-muted-foreground">
                            {value.value}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline">
                      Order: {value.sort_order}
                    </Badge>
                  </div>
                ))}

                {attribute.values.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No values added yet.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Show; 