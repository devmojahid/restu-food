import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { LazyImage } from "@/Components/Table/LazyImage";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";

const MenuItems = ({ categories = [], items = [] }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getItemsByCategory = (categoryId) => {
    return items.filter(item => item.category_id === categoryId);
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{category.name}</CardTitle>
              <Badge variant={category.is_active ? "success" : "secondary"}>
                {category.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            {category.description && (
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getItemsByCategory(category.id).map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex space-x-4 p-4 rounded-lg border",
                    !item.is_available && "opacity-60"
                  )}
                >
                  <LazyImage
                    src={item.image?.url || "/images/default-food.png"}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <Badge
                        variant={item.is_available ? "outline" : "secondary"}
                        className="ml-2 shrink-0"
                      >
                        {item.is_available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="space-x-2">
                        <span className="font-medium">
                          {formatPrice(item.price)}
                        </span>
                        {item.sale_price && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.sale_price)}
                          </span>
                        )}
                      </div>
                      {item.preparation_time && (
                        <span className="text-sm text-muted-foreground">
                          {item.preparation_time} mins
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {categories.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No menu categories found.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MenuItems; 