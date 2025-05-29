import React from "react"
import { cn } from "@/lib/utils"

const Timeline = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn(
                "space-y-3",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

const TimelineItem = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn(
                "relative pl-8 pb-8",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

const TimelineIcon = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn(
                "absolute left-0 flex h-6 w-6 items-center justify-center rounded-full",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

const TimelineConnector = ({
    className,
    ...props
}) => {
    return (
        <div
            className={cn(
                "absolute bottom-0 left-3 top-8 -translate-x-1/2 w-0.5 bg-gray-200 dark:bg-gray-800",
                className
            )}
            {...props}
        />
    )
}

const TimelineHeader = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn(
                "mb-2 flex items-center",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

const TimelineBody = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn(
                "ml-3",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export {
    Timeline,
    TimelineItem,
    TimelineIcon,
    TimelineConnector,
    TimelineHeader,
    TimelineBody
} 