import React, { useState, useCallback, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { ChevronDown, Circle, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Badge } from "@/Components/ui/badge";

const SidebarNav = ({ items, currentUrl, onItemClick }) => {
  const [expandedSections, setExpandedSections] = useState(
    items.reduce((acc, item) => ({ ...acc, [item.title]: true }), {})
  );

  const isActive = useCallback(
    (href) => {
      return currentUrl?.endsWith(href.split("/").pop());
    },
    [currentUrl]
  );

  const toggleSection = useCallback((title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }, []);

  useEffect(() => {
    items.forEach((section) => {
      const hasActiveItem = section.items.some((item) => isActive(item.href));
      if (hasActiveItem) {
        setExpandedSections((prev) => ({ ...prev, [section.title]: true }));
      }
    });
  }, [currentUrl, items, isActive]);

  return (
    <nav className="space-y-2.5">
      {items.map((section) => {
        const hasActiveItem = section.items.some((item) => isActive(item.href));

        return (
          <div
            key={section.title}
            className={cn(
              "rounded-xl border bg-card shadow-sm transition-all duration-200",
              "hover:shadow-md group",
              hasActiveItem && "ring-2 ring-primary/20",
              expandedSections[section.title] && "ring-1 ring-primary/10"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between px-4 py-3 cursor-pointer",
                "hover:bg-accent/50 rounded-t-xl transition-colors",
                "border-b border-border/50",
                expandedSections[section.title] && "bg-accent/30"
              )}
              onClick={() => toggleSection(section.title)}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold tracking-tight">
                  {section.title}
                </span>
                {section.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {section.badge}
                  </Badge>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-300",
                  "group-hover:text-foreground",
                  expandedSections[section.title] && "transform rotate-180"
                )}
              />
            </div>

            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                expandedSections[section.title]
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              )}
            >
              <div className="p-2 space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <TooltipProvider key={item.href}>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            onClick={() => onItemClick?.(item)}
                            className={cn(
                              "group flex flex-col rounded-lg p-3 text-sm transition-all duration-200",
                              "hover:bg-accent hover:shadow-sm relative overflow-hidden",
                              active && "bg-primary/10 shadow-sm",
                              "border border-transparent",
                              active
                                ? "border-primary/20"
                                : "hover:border-border/50",
                              item.disabled && "opacity-50 pointer-events-none"
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={cn(
                                  "p-1.5 rounded-md transition-colors duration-200",
                                  "bg-background/80 group-hover:bg-background",
                                  active && "bg-primary/10 text-primary",
                                  "group-hover:text-primary"
                                )}
                              >
                                {item.icon}
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span
                                    className={cn(
                                      "font-medium leading-none mb-1 truncate",
                                      active && "text-primary"
                                    )}
                                  >
                                    {item.title}
                                  </span>
                                  {item.status && (
                                    <Badge
                                      variant={
                                        item.status.variant || "secondary"
                                      }
                                      className="ml-2 text-[10px] px-1 py-0"
                                    >
                                      {item.status.label}
                                    </Badge>
                                  )}
                                </div>
                                {item.description && (
                                  <span className="text-[11px] text-muted-foreground line-clamp-1 group-hover:text-foreground/70">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                              {active && (
                                <Check className="h-4 w-4 text-primary ml-2" />
                              )}
                            </div>
                            {active && (
                              <div className="absolute left-0 top-0 w-1 h-full bg-primary rounded-r" />
                            )}
                          </Link>
                        </TooltipTrigger>
                        {item.tooltip && (
                          <TooltipContent
                            side="right"
                            className="max-w-[300px]"
                          >
                            <p>{item.tooltip}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export default SidebarNav;
