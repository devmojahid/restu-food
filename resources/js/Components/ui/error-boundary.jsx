import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { Alert, AlertTitle, AlertDescription } from "./alert";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Component error caught:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Fallback UI for when an error occurs
            return (
                <div className="p-4 rounded-lg border bg-background">
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Something went wrong</AlertTitle>
                        <AlertDescription>
                            {this.state.error?.message || "An unexpected error occurred"}
                        </AlertDescription>
                    </Alert>

                    <div className="text-sm text-muted-foreground mb-4">
                        {this.props.showErrorDetails && this.state.error && (
                            <pre className="p-2 bg-muted rounded-md overflow-auto text-xs max-h-24">
                                {this.state.error.toString()}
                            </pre>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                this.setState({ hasError: false, error: null, errorInfo: null });
                                if (this.props.onReset) {
                                    this.props.onReset();
                                }
                            }}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className="h-3 w-3" />
                            Try Again
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export { ErrorBoundary }; 