import React from 'react';
import { usePageEditor } from '@/Components/Admin/PageBuilder/PageEditorContext';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { AlertCircle } from 'lucide-react';

const GlobalSettingsSection = () => {
    const {
        formData,
        updateFormData,
        isSaving,
        handleSubmit,
        isDirty,
        errors,
        hasError
    } = usePageEditor();

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle>Global Theme Settings</CardTitle>
                        {isDirty && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                                Unsaved Changes
                            </Badge>
                        )}
                    </div>
                    <CardDescription>
                        Configure global appearance settings for your site
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="layout" className="space-y-6">
                        <TabsList className="grid grid-cols-3 w-full">
                            <TabsTrigger value="layout">Layout</TabsTrigger>
                            <TabsTrigger value="colors">Colors</TabsTrigger>
                            <TabsTrigger value="typography">Typography</TabsTrigger>
                        </TabsList>

                        {/* Layout Settings */}
                        <TabsContent value="layout" className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="layout_width">Layout Width</Label>
                                <Select
                                    value={formData.layout_width || 'contained'}
                                    onValueChange={value => updateFormData('layout_width', value)}
                                >
                                    <SelectTrigger id="layout_width">
                                        <SelectValue placeholder="Select layout width" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="contained">Contained</SelectItem>
                                        <SelectItem value="full">Full Width</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    "Contained" has a max-width, "Full Width" spans the entire screen
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="section_spacing">Section Spacing</Label>
                                <Select
                                    value={formData.section_spacing || 'medium'}
                                    onValueChange={value => updateFormData('section_spacing', value)}
                                >
                                    <SelectTrigger id="section_spacing">
                                        <SelectValue placeholder="Select section spacing" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small">Small</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="large">Large</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Controls the vertical spacing between homepage sections
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="animations_enabled" className="flex flex-col">
                                    <span className="text-sm">Enable Animations</span>
                                    <span className="text-xs text-muted-foreground">Add subtle animations to elements</span>
                                </Label>
                                <Switch
                                    id="animations_enabled"
                                    checked={formData.animations_enabled ?? true}
                                    onCheckedChange={(checked) => updateFormData('animations_enabled', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="scroll_animations" className="flex flex-col">
                                    <span className="text-sm">Scroll Animations</span>
                                    <span className="text-xs text-muted-foreground">Animate elements as they enter the viewport</span>
                                </Label>
                                <Switch
                                    id="scroll_animations"
                                    checked={formData.scroll_animations ?? true}
                                    onCheckedChange={(checked) => updateFormData('scroll_animations', checked)}
                                />
                            </div>
                        </TabsContent>

                        {/* Colors Settings */}
                        <TabsContent value="colors" className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="color_scheme">Color Scheme</Label>
                                <Select
                                    value={formData.color_scheme || 'system'}
                                    onValueChange={value => updateFormData('color_scheme', value)}
                                >
                                    <SelectTrigger id="color_scheme">
                                        <SelectValue placeholder="Select color scheme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System (Auto)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    "System" follows the user's device preference
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="primary_color">Primary Color</Label>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-full border"
                                        style={{ backgroundColor: formData.primary_color || '#22C55E' }}
                                    />
                                    <Input
                                        id="primary_color"
                                        type="text"
                                        value={formData.primary_color || '#22C55E'}
                                        onChange={e => updateFormData('primary_color', e.target.value)}
                                        placeholder="#22C55E"
                                        className="font-mono"
                                    />
                                    <Input
                                        type="color"
                                        value={formData.primary_color || '#22C55E'}
                                        onChange={e => updateFormData('primary_color', e.target.value)}
                                        className="w-10 h-10 p-1 cursor-pointer"
                                    />
                                </div>
                                {hasError('primary_color') && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        <span>Please enter a valid hex color (e.g. #FF0000)</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="secondary_color">Secondary Color</Label>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-full border"
                                        style={{ backgroundColor: formData.secondary_color || '#0EA5E9' }}
                                    />
                                    <Input
                                        id="secondary_color"
                                        type="text"
                                        value={formData.secondary_color || '#0EA5E9'}
                                        onChange={e => updateFormData('secondary_color', e.target.value)}
                                        placeholder="#0EA5E9"
                                        className="font-mono"
                                    />
                                    <Input
                                        type="color"
                                        value={formData.secondary_color || '#0EA5E9'}
                                        onChange={e => updateFormData('secondary_color', e.target.value)}
                                        className="w-10 h-10 p-1 cursor-pointer"
                                    />
                                </div>
                                {hasError('secondary_color') && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        <span>Please enter a valid hex color (e.g. #0000FF)</span>
                                    </div>
                                )}
                            </div>

                            {/* Color Presets */}
                            <div className="space-y-2 mt-4">
                                <Label>Color Presets</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="p-1 h-auto flex flex-col items-center"
                                        onClick={() => {
                                            updateFormData('primary_color', '#22C55E');
                                            updateFormData('secondary_color', '#0EA5E9');
                                        }}
                                    >
                                        <div className="flex gap-1 mb-1">
                                            <div className="w-4 h-4 rounded-full bg-[#22C55E]" />
                                            <div className="w-4 h-4 rounded-full bg-[#0EA5E9]" />
                                        </div>
                                        <span className="text-xs">Modern</span>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="p-1 h-auto flex flex-col items-center"
                                        onClick={() => {
                                            updateFormData('primary_color', '#2563EB');
                                            updateFormData('secondary_color', '#4F46E5');
                                        }}
                                    >
                                        <div className="flex gap-1 mb-1">
                                            <div className="w-4 h-4 rounded-full bg-[#2563EB]" />
                                            <div className="w-4 h-4 rounded-full bg-[#4F46E5]" />
                                        </div>
                                        <span className="text-xs">Classic</span>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="p-1 h-auto flex flex-col items-center"
                                        onClick={() => {
                                            updateFormData('primary_color', '#18181B');
                                            updateFormData('secondary_color', '#27272A');
                                        }}
                                    >
                                        <div className="flex gap-1 mb-1">
                                            <div className="w-4 h-4 rounded-full bg-[#18181B]" />
                                            <div className="w-4 h-4 rounded-full bg-[#27272A]" />
                                        </div>
                                        <span className="text-xs">Minimal</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4 border rounded-lg bg-gradient-to-r from-slate-50 to-slate-100">
                                <h4 className="text-sm font-medium mb-3">Color Preview</h4>
                                <div className="space-y-3">
                                    <div
                                        className="py-2 px-4 rounded-md text-white font-medium text-center"
                                        style={{ backgroundColor: formData.primary_color || '#22C55E' }}
                                    >
                                        Primary Button
                                    </div>
                                    <div
                                        className="py-2 px-4 rounded-md text-white font-medium text-center"
                                        style={{ backgroundColor: formData.secondary_color || '#0EA5E9' }}
                                    >
                                        Secondary Button
                                    </div>
                                    <div className="py-2 px-4 border rounded-md text-center font-medium" style={{
                                        color: formData.primary_color || '#22C55E',
                                        borderColor: formData.primary_color || '#22C55E'
                                    }}>
                                        Outlined Button
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Typography Settings */}
                        <TabsContent value="typography" className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="font_heading">Heading Font</Label>
                                <Select
                                    value={formData.font_heading || 'inter'}
                                    onValueChange={value => updateFormData('font_heading', value)}
                                >
                                    <SelectTrigger id="font_heading">
                                        <SelectValue placeholder="Select heading font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="inter">Inter</SelectItem>
                                        <SelectItem value="roboto">Roboto</SelectItem>
                                        <SelectItem value="poppins">Poppins</SelectItem>
                                        <SelectItem value="montserrat">Montserrat</SelectItem>
                                        <SelectItem value="open-sans">Open Sans</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Font used for headings throughout the site
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="font_body">Body Font</Label>
                                <Select
                                    value={formData.font_body || 'inter'}
                                    onValueChange={value => updateFormData('font_body', value)}
                                >
                                    <SelectTrigger id="font_body">
                                        <SelectValue placeholder="Select body font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="inter">Inter</SelectItem>
                                        <SelectItem value="roboto">Roboto</SelectItem>
                                        <SelectItem value="poppins">Poppins</SelectItem>
                                        <SelectItem value="open-sans">Open Sans</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Font used for body text throughout the site
                                </p>
                            </div>

                            {/* Font Preview */}
                            <Card className="bg-muted/50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Font Preview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="mb-3"
                                        style={{
                                            fontFamily: formData.font_heading === 'inter' ? 'Inter, sans-serif' :
                                                formData.font_heading === 'roboto' ? 'Roboto, sans-serif' :
                                                    formData.font_heading === 'poppins' ? 'Poppins, sans-serif' :
                                                        formData.font_heading === 'montserrat' ? 'Montserrat, sans-serif' :
                                                            formData.font_heading === 'open-sans' ? 'Open Sans, sans-serif' :
                                                                'Inter, sans-serif'
                                        }}
                                    >
                                        <h2 className="text-xl font-bold">Heading Font: {formData.font_heading || 'Inter'}</h2>
                                        <p className="text-lg font-semibold">The quick brown fox jumps over the lazy dog.</p>
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: formData.font_body === 'inter' ? 'Inter, sans-serif' :
                                                formData.font_body === 'roboto' ? 'Roboto, sans-serif' :
                                                    formData.font_body === 'poppins' ? 'Poppins, sans-serif' :
                                                        formData.font_body === 'open-sans' ? 'Open Sans, sans-serif' :
                                                            'Inter, sans-serif'
                                        }}
                                    >
                                        <p className="text-sm mb-1">Body Font: {formData.font_body || 'Inter'}</p>
                                        <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed risus euismod, vestibulum nunc sit amet, faucibus nisl. Vivamus efficitur magna nec diam malesuada blandit.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="bg-muted/20 flex justify-end pt-3 pb-2">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
};

export default GlobalSettingsSection; 