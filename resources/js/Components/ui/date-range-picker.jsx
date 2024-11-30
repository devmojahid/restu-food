import * as React from "react";
import { format, isValid } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Separator } from "@/Components/ui/separator";

const presets = [
    {
        name: 'Today',
        getValue: () => ({
            from: new Date(),
            to: new Date(),
        }),
    },
    {
        name: 'Yesterday',
        getValue: () => {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            return {
                from: date,
                to: date,
            };
        },
    },
    {
        name: 'Last 7 days',
        getValue: () => {
            const to = new Date();
            const from = new Date();
            from.setDate(from.getDate() - 6);
            return { from, to };
        },
    },
    {
        name: 'Last 30 days',
        getValue: () => {
            const to = new Date();
            const from = new Date();
            from.setDate(from.getDate() - 29);
            return { from, to };
        },
    },
    {
        name: 'This month',
        getValue: () => {
            const now = new Date();
            const from = new Date(now.getFullYear(), now.getMonth(), 1);
            const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            return { from, to };
        },
    },
];

export function DateRangePicker({
    className,
    from,
    to,
    onSelect,
}) {
    const [date, setDate] = React.useState({ from, to });
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        setDate({ from, to });
    }, [from, to]);

    const handleSelect = (range) => {
        setDate(range);
        onSelect(range);
    };

    const handlePresetSelect = (preset) => {
        const range = preset.getValue();
        handleSelect(range);
        setIsOpen(false);
    };

    const formatDateRange = () => {
        if (!date?.from) return "Select date range";
        if (!date?.to) return format(date.from, "MMM dd, yyyy");
        return `${format(date.from, "MMM dd, yyyy")} - ${format(date.to, "MMM dd, yyyy")}`;
    };

    const clearDates = () => {
        handleSelect({ from: null, to: null });
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-between text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>{formatDateRange()}</span>
                        </div>
                        {(date?.from || date?.to) && (
                            <X
                                className="h-4 w-4 opacity-50 hover:opacity-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearDates();
                                }}
                            />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="flex">
                        <div className="p-3 space-y-3">
                            <div className="space-y-1.5">
                                <h4 className="text-sm font-medium">Presets</h4>
                                <div className="flex flex-col gap-1">
                                    {presets.map((preset) => (
                                        <Button
                                            key={preset.name}
                                            variant="ghost"
                                            size="sm"
                                            className="justify-start font-normal"
                                            onClick={() => handlePresetSelect(preset)}
                                        >
                                            {preset.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearDates}
                                    className="w-full"
                                >
                                    Clear Dates
                                </Button>
                            </div>
                        </div>
                        <div className="border-l">
                            <DayPicker
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={handleSelect}
                                numberOfMonths={2}
                                disabled={[{ after: new Date() }]}
                                classNames={{
                                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                    month: "space-y-4",
                                    caption: "flex justify-center pt-1 relative items-center",
                                    caption_label: "text-sm font-medium",
                                    nav: "space-x-1 flex items-center",
                                    nav_button: cn(
                                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                                    ),
                                    nav_button_previous: "absolute left-1",
                                    nav_button_next: "absolute right-1",
                                    table: "w-full border-collapse space-y-1",
                                    head_row: "flex",
                                    head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                                    row: "flex w-full mt-2",
                                    cell: cn(
                                        "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                                        "[&:has([aria-selected].day-range-end)]:rounded-r-md",
                                        "[&:has([aria-selected].day-range-start)]:rounded-l-md"
                                    ),
                                    day: cn(
                                        "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
                                    ),
                                    day_range_start: "day-range-start",
                                    day_range_end: "day-range-end",
                                    day_selected:
                                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                    day_today: "bg-accent text-accent-foreground",
                                    day_outside: "text-muted-foreground opacity-50",
                                    day_disabled: "text-muted-foreground opacity-50",
                                    day_range_middle:
                                        "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                    day_hidden: "invisible",
                                }}
                            />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
} 