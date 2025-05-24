import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { HelpCircle, Lightbulb, FileText, Info, BookOpen, CheckCircle2, AlertCircle, Image } from 'lucide-react';
import QuickReferenceCard from './QuickReferenceCard';

const GuideModal = ({ trigger }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Homepage Builder Guide
                    </DialogTitle>
                    <DialogDescription>
                        Learn how to effectively use the homepage builder to create an engaging website
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="getting-started" className="mt-4">
                    <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                        <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
                        <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
                        <TabsTrigger value="sliders">Sliders</TabsTrigger>
                    </TabsList>

                    <TabsContent value="getting-started" className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Info className="h-5 w-5 text-blue-500" />
                                Basic Concepts
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                The homepage builder allows you to customize your website's homepage through different sections.
                                Each section can be enabled or disabled, and has its own set of options.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Key Sections</h3>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                <li>
                                    <strong>Hero Section:</strong> The large banner at the top of your homepage.
                                    You can choose between a single hero or a slider with multiple slides.
                                </li>
                                <li>
                                    <strong>Top Categories:</strong> Showcase your most important product categories.
                                </li>
                                <li>
                                    <strong>Why Choose Us:</strong> Highlight your business advantages and features.
                                </li>
                                <li>
                                    <strong>Client Feedback:</strong> Display testimonials from satisfied customers.
                                </li>
                                <li>
                                    <strong>Global Settings:</strong> Configure site-wide appearance settings.
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Steps to Follow</h3>
                            <ol className="list-decimal pl-5 space-y-2 text-sm">
                                <li>Choose which sections you want to enable/disable</li>
                                <li>Configure each enabled section with your content</li>
                                <li>Preview your changes by opening the homepage in a new tab</li>
                                <li>Save your changes when you're satisfied</li>
                                <li>Come back anytime to make further adjustments</li>
                            </ol>
                        </div>
                    </TabsContent>

                    <TabsContent value="tips" className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-amber-500" />
                                Tips for Great Results
                            </h3>

                            <div className="space-y-3">
                                <div className="bg-muted p-3 rounded-md">
                                    <h4 className="font-medium text-sm">Use High-Quality Images</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Images should be at least 1200px wide for optimal display. Use JPG or PNG formats.
                                    </p>
                                </div>

                                <div className="bg-muted p-3 rounded-md">
                                    <h4 className="font-medium text-sm">Keep Text Concise</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Shorter, impactful messages work better than long paragraphs.
                                    </p>
                                </div>

                                <div className="bg-muted p-3 rounded-md">
                                    <h4 className="font-medium text-sm">Use Color Highlights</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Add [brackets] around text you want to highlight in your primary color.
                                    </p>
                                </div>

                                <div className="bg-muted p-3 rounded-md">
                                    <h4 className="font-medium text-sm">Test on Mobile</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Always check how your homepage looks on mobile devices.
                                    </p>
                                </div>

                                <div className="bg-muted p-3 rounded-md">
                                    <h4 className="font-medium text-sm">Use Pre-made Color Schemes</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Try the pre-made color schemes in the Global Settings section for proven combinations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="troubleshooting" className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <FileText className="h-5 w-5 text-red-500" />
                                Common Issues
                            </h3>

                            <div className="space-y-4">
                                <div className="border-l-4 border-orange-500 pl-3 py-1">
                                    <h4 className="font-medium text-sm">Changes Not Saving</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Make sure you click the "Save Changes" button at the bottom of each section.
                                        If you're still having issues, try refreshing the page and making changes again.
                                    </p>
                                </div>

                                <div className="border-l-4 border-orange-500 pl-3 py-1">
                                    <h4 className="font-medium text-sm">Images Not Uploading</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Ensure your images are under 2MB in size and in JPG, PNG, or GIF format.
                                        If you continue to have issues, try a different browser.
                                    </p>
                                </div>

                                <div className="border-l-4 border-orange-500 pl-3 py-1">
                                    <h4 className="font-medium text-sm">Color Format Errors</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Colors must be valid hex codes (e.g., #FF0000). Use the color picker to ensure valid values.
                                    </p>
                                </div>

                                <div className="border-l-4 border-orange-500 pl-3 py-1">
                                    <h4 className="font-medium text-sm">Slide Title Errors</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Each slide in the slider must have a title. Make sure you've provided titles for all slides.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-sm text-green-800">Need More Help?</h4>
                                    <p className="text-xs text-green-700 mt-1">
                                        If you're still experiencing issues, contact our support team for assistance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="sliders">
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium text-lg mb-2">Working with Hero Sliders</h3>
                                <p className="text-muted-foreground">
                                    Hero sliders allow you to showcase multiple images and messages at the top of your homepage.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium">How to Set Up a Slider</h4>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>Go to the <strong>Hero Section</strong> in the page builder</li>
                                    <li>Select <strong>Slider Hero</strong> as the hero type</li>
                                    <li>Click the <strong>Add Slide</strong> button to create your first slide</li>
                                    <li>For each slide, provide a title, description (optional), and image</li>
                                    <li>Add a call-to-action button with text and link if desired</li>
                                    <li>Use the arrow buttons to reorder slides as needed</li>
                                    <li>Save your changes</li>
                                </ol>
                            </div>

                            <div className="p-4 bg-amber-50 rounded-md border border-amber-200">
                                <h4 className="text-amber-800 font-medium flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-2" /> Common Issues with Sliders
                                </h4>
                                <ul className="mt-2 text-amber-700 space-y-2">
                                    <li><strong>Empty Slider:</strong> Make sure to add at least one slide for the slider to display properly.</li>
                                    <li><strong>Slider Not Showing:</strong> Verify that the Hero Section is enabled and the hero type is set to "slider".</li>
                                    <li><strong>Images Not Loading:</strong> Ensure all images are uploaded properly. Try re-uploading if issues persist.</li>
                                    <li><strong>Undefined Values:</strong> If you see errors about undefined values, try saving and refreshing the page.</li>
                                </ul>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-medium">Best Practices</h4>
                                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                    <li>Keep titles short and engaging</li>
                                    <li>Use high-quality images (recommended size: 1920×600 pixels)</li>
                                    <li>Limit to 3-5 slides for optimal performance</li>
                                    <li>Ensure all slides have consistent heights</li>
                                    <li>Use clear call-to-action buttons</li>
                                </ul>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-6">
                    <QuickReferenceCard />
                </div>

                <DialogFooter className="mt-4">
                    <Button type="button">Got It</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default GuideModal; 