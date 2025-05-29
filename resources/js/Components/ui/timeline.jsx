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

const TimelineDot = ({
    className,
    variant = "outlined",
    color = "primary",
    ...props
}) => {
    return (
        <div
            className={cn(
                "absolute left-3 top-0 -translate-x-1/2 h-6 w-6 rounded-full border-2 flex items-center justify-center",
                variant === "filled" && color === "primary" && "bg-primary border-primary",
                variant === "filled" && color === "success" && "bg-green-500 border-green-500",
                variant === "filled" && color === "warning" && "bg-yellow-500 border-yellow-500",
                variant === "filled" && color === "error" && "bg-red-500 border-red-500",
                variant === "filled" && color === "gray" && "bg-gray-400 border-gray-400",
                variant === "outlined" && color === "primary" && "border-primary",
                variant === "outlined" && color === "success" && "border-green-500",
                variant === "outlined" && color === "warning" && "border-yellow-500",
                variant === "outlined" && color === "error" && "border-red-500",
                variant === "outlined" && color === "gray" && "border-gray-400",
                className
            )}
            {...props}
        />
    )
}

const TimelineContent = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn(
                "pt-0.5 ml-6",
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
    TimelineBody,
    TimelineDot,
    TimelineContent
} 