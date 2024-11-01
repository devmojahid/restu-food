import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
import { Tag, ImageIcon, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/Components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { X } from "lucide-react";

const Form = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    name: "",
    permalink: "",
    description: "",
    shortDescription: "",
    categories: [],
    tags: [],
    status: "draft",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));

    console.log(data);
  };

  return (
    <>
      <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="flex flex-wrap bg-muted p-1 rounded-lg">
            {[
              { value: "general", label: "General", icon: Tag },
              { value: "media", label: "Media", icon: ImageIcon },
              { value: "seo", label: "SEO", icon: Search },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 flex items-center justify-center capitalize px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="max-w-md"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permalink">Permalink</Label>
                  <Input
                    id="permalink"
                    value={data.permalink}
                    onChange={(e) => setData("permalink", e.target.value)}
                    className="max-w-md"
                  />
                  {errors.permalink && (
                    <p className="text-red-500 text-sm">{errors.permalink}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    className="min-h-[200px]"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    value={data.shortDescription}
                    onChange={(e) =>
                      setData("shortDescription", e.target.value)
                    }
                    className="max-w-md"
                  />
                  {errors.shortDescription && (
                    <p className="text-red-500 text-sm">
                      {errors.shortDescription}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Categories</Label>
                  <Select
                    value={data.categories[data.categories.length - 1]}
                    onValueChange={(value) =>
                      setData("categories", [...data.categories, value])
                    }
                  >
                    <SelectTrigger className="max-w-md">
                      <SelectValue placeholder="Select categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.categories && (
                    <p className="text-red-500 text-sm">{errors.categories}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div>
                    <Input
                      placeholder="Add a tag and press Enter"
                      className="max-w-md"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const newTag = e.currentTarget.value.trim();
                          if (newTag && !data.tags.includes(newTag)) {
                            setData("tags", [...data.tags, newTag]);
                            e.currentTarget.value = "";
                          }
                        }
                      }}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {data.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 p-0 h-auto"
                            onClick={() => {
                              const newTags = [...data.tags];
                              newTags.splice(index, 1);
                              setData("tags", newTags);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <RadioGroup
                    value={data.status}
                    onValueChange={(value) => setData("status", value)}
                  >
                    {["draft", "published", "archived"].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <RadioGroupItem value={status} id={status} />
                        <Label htmlFor={status} className="capitalize">
                          {status}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </>
  );
};

export default Form;
