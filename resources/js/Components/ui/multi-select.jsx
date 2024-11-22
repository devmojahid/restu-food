'use client';

import * as React from "react"
import { X, Check, ChevronsUpDown, ChevronRight, FolderTree } from "lucide-react"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Input } from "@/Components/ui/input"

const MultiSelect = ({
  options = [],
  selected = [],
  onChange,
  placeholder = "Select items...",
  className,
  error,
}) => {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const containerRef = React.useRef(null)

  // Ensure selected is always an array
  const selectedArray = Array.isArray(selected) ? selected : []

  // Group options by parent
  const groupedOptions = React.useMemo(() => {
    const groups = {}
    const rootItems = []

    options.forEach(option => {
      if (option.parent) {
        if (!groups[option.parent.name]) {
          groups[option.parent.name] = []
        }
        groups[option.parent.name].push(option)
      } else {
        rootItems.push(option)
      }
    })

    return { groups, rootItems }
  }, [options])

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return groupedOptions
    
    const query = searchQuery.toLowerCase()
    const filteredGroups = {}
    const filteredRootItems = []

    // Filter root items
    groupedOptions.rootItems.forEach(option => {
      if (option.label.toLowerCase().includes(query)) {
        filteredRootItems.push(option)
      }
    })

    // Filter grouped items
    Object.entries(groupedOptions.groups).forEach(([parentName, items]) => {
      const filteredItems = items.filter(option =>
        option.label.toLowerCase().includes(query) ||
        parentName.toLowerCase().includes(query)
      )
      if (filteredItems.length > 0) {
        filteredGroups[parentName] = filteredItems
      }
    })

    return { groups: filteredGroups, rootItems: filteredRootItems }
  }, [groupedOptions, searchQuery])

  // Get selected items with proper ordering
  const selectedItems = React.useMemo(() => {
    const items = options.filter(option => 
      selectedArray.includes(option.value.toString())
    )
    
    return items.sort((a, b) => {
      if (!a.parent && b.parent) return -1
      if (a.parent && !b.parent) return 1
      if (a.parent && b.parent) {
        return a.parent.name.localeCompare(b.parent.name) || 
               a.label.localeCompare(b.label)
      }
      return a.label.localeCompare(b.label)
    })
  }, [options, selectedArray])

  const handleSelect = React.useCallback((value) => {
    const newSelected = selectedArray.includes(value.toString())
      ? selectedArray.filter(item => item !== value.toString())
      : [...selectedArray, value.toString()]
    onChange(newSelected)
  }, [selectedArray, onChange])

  const handleRemove = React.useCallback((e, value) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(selectedArray.filter(item => item !== value.toString()))
  }, [selectedArray, onChange])

  return (
    <div ref={containerRef} className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between min-h-[2.5rem] h-auto",
              "hover:bg-background/50 active:bg-background/50",
              error && "border-destructive",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center gap-1 py-0.5 px-0.5 max-w-[calc(100%-2rem)]">
              {selectedItems.length > 0 ? (
                <div className="flex flex-wrap gap-1 items-center">
                  {selectedItems.map((item) => (
                    <Badge
                      key={item.value}
                      variant="secondary"
                      className="flex items-center gap-1 px-1.5 py-0.5 text-xs max-w-[200px] truncate"
                    >
                      {item.parent && (
                        <>
                          <span className="text-muted-foreground font-normal truncate">
                            {item.parent.name}
                          </span>
                          <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                        </>
                      )}
                      <span className="truncate">{item.label}</span>
                      <button
                        type="button"
                        className="ml-1 rounded-full outline-none hover:bg-secondary/80 p-0.5"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleRemove(e, item.value)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground truncate">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 shadow-lg z-50 w-[var(--radix-popover-trigger-width)] max-w-[min(calc(100vw-2rem),500px)]"
          align="start"
          sideOffset={4}
        >
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 px-1 mb-2">
              <FolderTree className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Categories</span>
            </div>
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8"
            />
          </div>
          <ScrollArea className="max-h-[300px] overflow-y-auto">
            <div className="p-2 space-y-3">
              {/* Root Categories */}
              {filteredOptions.rootItems.length > 0 && (
                <div className="space-y-1">
                  {filteredOptions.rootItems.map((option) => {
                    const isSelected = selectedArray.includes(option.value.toString())
                    return (
                      <div
                        key={option.value}
                        className={cn(
                          "flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer transition-colors",
                          isSelected ? "bg-accent" : "hover:bg-muted",
                        )}
                        onClick={() => handleSelect(option.value)}
                      >
                        <div className={cn(
                          "h-4 w-4 border rounded-sm flex items-center justify-center transition-colors",
                          isSelected && "bg-primary border-primary"
                        )}>
                          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                        </div>
                        <span className="font-medium">{option.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Grouped Categories */}
              {Object.entries(filteredOptions.groups).map(([parentName, items]) => (
                <div key={parentName} className="space-y-1">
                  <div className="px-2 py-1 text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <ChevronRight className="h-3 w-3" />
                    {parentName}
                  </div>
                  <div className="ml-3 space-y-1">
                    {items.map((option) => {
                      const isSelected = selectedArray.includes(option.value.toString())
                      return (
                        <div
                          key={option.value}
                          className={cn(
                            "flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer transition-colors",
                            isSelected ? "bg-accent" : "hover:bg-muted",
                          )}
                          onClick={() => handleSelect(option.value)}
                        >
                          <div className={cn(
                            "h-4 w-4 border rounded-sm flex items-center justify-center transition-colors",
                            isSelected && "bg-primary border-primary"
                          )}>
                            {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <span>{option.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              {filteredOptions.rootItems.length === 0 && 
               Object.keys(filteredOptions.groups).length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No categories found
                </div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-destructive mt-1.5">
          {error}
        </p>
      )}
    </div>
  )
}

export default MultiSelect
