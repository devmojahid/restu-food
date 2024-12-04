import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/Components/ui/scroll-area";

const TabHeader = ({ tabs, activeTab, onTabChange }) => {
  const scrollRef = useRef(null);

  // Handle tab scrolling
  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.querySelector('[data-state="active"]');
      if (activeElement) {
        const container = scrollRef.current;
        const scrollLeft = activeElement.offsetLeft - (container.offsetWidth - activeElement.offsetWidth) / 2;
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeTab]);

  return (
    <div className="hidden md:block relative border-b">
      <ScrollArea className="w-full" ref={scrollRef}>
        <TabsList className="inline-flex h-11 items-center justify-start rounded-none bg-transparent p-0 w-full">
          {tabs.map(({ id, label, icon: Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              onClick={() => onTabChange?.(id)}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-4 py-2",
                "text-sm font-medium transition-all relative",
                "data-[state=active]:text-primary",
                "border-b-2 border-transparent",
                "data-[state=active]:border-primary",
                "hover:bg-muted/50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                "min-w-[120px]" // Ensure minimum width for better visibility
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {id === activeTab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar 
          orientation="horizontal" 
          className="invisible hover:visible" 
        />
      </ScrollArea>
      
      {/* Enhanced Fade Indicators */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default TabHeader; 