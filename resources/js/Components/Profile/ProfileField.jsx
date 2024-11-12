import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { cn } from "@/lib/utils";

export const ProfileField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    className = "",
    icon: Icon,
    ...props
}) => {
    return (
        <div className={cn("space-y-2", className)}>
            <Label htmlFor={name}>{label}</Label>
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
                <Input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={e => onChange(name, e.target.value)}
                    className={cn(Icon && "pl-9")}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    );
}; 