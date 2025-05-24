import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

const QuickReferenceCard = () => {
    return (
        <Card className="shadow-lg border-primary/20">
            <CardHeader className="bg-muted/50 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Page Builder Quick Reference
                </CardTitle>
                <CardDescription className="text-xs">
                    Tips for working with the homepage builder
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs defaultValue="dos" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 rounded-none">
                        <TabsTrigger value="dos" className="text-xs py-1.5">
                            <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                            Do's
                        </TabsTrigger>
                        <TabsTrigger value="donts" className="text-xs py-1.5">
                            <X className="h-3 w-3 mr-1 text-red-500" />
                            Don'ts
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="dos" className="p-3 pt-2">
                        <ul className="text-xs space-y-1.5 text-muted-foreground">
                            <li className="flex gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                                <span>Use <strong>Preview</strong> to check your changes before saving</span>
                            </li>
                            <li className="flex gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                                <span>Add <strong>fallback text</strong> for all titles and descriptions</span>
                            </li>
                            <li className="flex gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                                <span>Use high-quality images (recommended: 1920×600px)</span>
                            </li>
                            <li className="flex gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                                <span>Fill in all required fields (marked with *)</span>
                            </li>
                            <li className="flex gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                                <span>Use <strong>[text here]</strong> syntax for highlighted text</span>
                            </li>
                        </ul>
                    </TabsContent>

                    <TabsContent value="donts" className="p-3 pt-2">
                        <ul className="text-xs space-y-1.5 text-muted-foreground">
                            <li className="flex gap-1.5">
                                <X className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                                <span>Don't leave required fields empty in slider slides</span>
                            </li>
                            <li className="flex gap-1.5">
                                <X className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                                <span>Don&apos;t use very large images ({'>'}2MB) as they slow loading</span>
                            </li>
                            <li className="flex gap-1.5">
                                <X className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                                <span>Don't create too many slider slides (3-5 is optimal)</span>
                            </li>
                            <li className="flex gap-1.5">
                                <X className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                                <span>Don't use special characters in CTA links</span>
                            </li>
                            <li className="flex gap-1.5">
                                <X className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                                <span>Don't navigate away without saving changes</span>
                            </li>
                        </ul>
                    </TabsContent>
                </Tabs>

                <div className="p-3 border-t border-muted text-xs">
                    <div className="flex items-start gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-semibold text-amber-700">Quick Tip:</span>
                            <p className="mt-0.5 text-muted-foreground">
                                If you encounter errors with sliders, try saving your changes, refreshing the page, and then continuing your edits.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuickReferenceCard; 