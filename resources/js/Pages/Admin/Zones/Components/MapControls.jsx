import React, { useRef } from 'react';
import { Button } from "@/Components/ui/button";
import { 
    MapPin, 
    Trash2, 
    Undo, 
    Redo, 
    Maximize2, 
    Layers, 
    Navigation,
    Pencil,
    Map,
    Settings2
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import { toast } from "react-hot-toast";

const isSecureContextOrLocal = () => {
  return window.isSecureContext || 
         window.location.hostname === 'localhost' || 
         window.location.hostname.endsWith('.test') ||
         window.location.hostname === '127.0.0.1';
};

const MapControls = ({ 
    onClear, 
    onUndo, 
    onRedo, 
    onFullscreen,
    onLocationClick,
    onMapTypeChange,
    canUndo,
    canRedo,
    isDrawing,
    onToggleDrawing,
    mapType,
    map,
    drawingManager
}) => {
    const handleLocationClick = async () => {
        if (!map) return;

        if (!navigator.geolocation) {
            toast({
                title: "Error",
                description: "Geolocation is not supported by your browser",
                variant: "destructive",
            });
            return;
        }

        if (!isSecureContextOrLocal()) {
            toast({
                title: "Security Notice",
                description: "Location access is allowed in local development",
            });
        }

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            });

            const { latitude, longitude } = position.coords;
            map.setCenter({ lat: latitude, lng: longitude });
            map.setZoom(15);

            if (drawingManager.current) {
                drawingManager.current.setPosition({ lat: latitude, lng: longitude });
            } else {
                drawingManager.current = new google.maps.Marker({
                    position: { lat: latitude, lng: longitude },
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#4f46e5",
                        fillOpacity: 0.4,
                        strokeWeight: 2,
                        strokeColor: "#4f46e5",
                    },
                    title: "Your Location"
                });
            }

            const accuracyCircle = new google.maps.Circle({
                map: map,
                center: { lat: latitude, lng: longitude },
                radius: position.coords.accuracy,
                fillColor: "#4f46e5",
                fillOpacity: 0.1,
                strokeColor: "#4f46e5",
                strokeOpacity: 0.3,
                strokeWeight: 1,
            });

            setTimeout(() => accuracyCircle.setMap(null), 3000);

        } catch (error) {
            console.error('Location error:', error);
            
            if (error.code === 1) {
                toast({
                    title: "Location Access Required",
                    description: "Please enable location access in your browser settings",
                    action: (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleLocationClick()}
                        >
                            Try Again
                        </Button>
                    ),
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to get your location. Please try again.",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <div className="absolute right-4 top-4 flex flex-col gap-2 z-[1000]">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg p-2 flex flex-col gap-2">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={isDrawing ? "default" : "outline"}
                                size="icon"
                                onClick={onToggleDrawing}
                                className="h-8 w-8"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>{isDrawing ? 'Stop Drawing' : 'Draw Zone'}</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onLocationClick}
                                className="h-8 w-8"
                            >
                                <Navigation className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>My Location</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onClear}
                                className="h-8 w-8 bg-red-50 hover:bg-red-100 border-red-200"
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>Delete Zone</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onUndo}
                                disabled={!canUndo}
                                className="h-8 w-8"
                            >
                                <Undo className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>Undo</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onRedo}
                                disabled={!canRedo}
                                className="h-8 w-8"
                            >
                                <Redo className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>Redo</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg p-2 flex flex-col gap-2">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                    >
                                        <Map className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="left">
                                    <DropdownMenuItem 
                                        onClick={() => onMapTypeChange('roadmap')}
                                        className={mapType === 'roadmap' ? 'bg-accent' : ''}
                                    >
                                        <Layers className="mr-2 h-4 w-4" />
                                        Roadmap
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => onMapTypeChange('satellite')}
                                        className={mapType === 'satellite' ? 'bg-accent' : ''}
                                    >
                                        <Layers className="mr-2 h-4 w-4" />
                                        Satellite
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => onMapTypeChange('hybrid')}
                                        className={mapType === 'hybrid' ? 'bg-accent' : ''}
                                    >
                                        <Layers className="mr-2 h-4 w-4" />
                                        Hybrid
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => onMapTypeChange('terrain')}
                                        className={mapType === 'terrain' ? 'bg-accent' : ''}
                                    >
                                        <Layers className="mr-2 h-4 w-4" />
                                        Terrain
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>Map Type</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onFullscreen}
                                className="h-8 w-8"
                            >
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>Fullscreen</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default MapControls; 