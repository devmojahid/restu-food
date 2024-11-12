import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export const ProfileSection = ({ 
    icon: Icon,
    title,
    description,
    children,
    className = ""
}) => {
    return (
        <Card className={`border-0 shadow-none ${className}`}>
            <CardHeader className="px-6 py-4 border-b">
                <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {description}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {children}
            </CardContent>
        </Card>
    );
}; 