import React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/Components/ui/scroll-area";

const MobileTabSelect = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="md:hidden relative">
      <ScrollArea className="w-full" orientation="horizontal">
        <div className="flex space-x-2 p-1 min-w-max">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap",
                "text-sm font-medium transition-all",
                "border border-border",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                activeTab === id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-background hover:bg-muted"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
};

export default MobileTabSelect; 