import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Alert variant="destructive">
                    <AlertTitle>Something went wrong</AlertTitle>
                    <AlertDescription>
                        <p className="mb-4">{this.state.error?.message || 'An unexpected error occurred'}</p>
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                            className="flex items-center"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reload Page
                        </Button>
                    </AlertDescription>
                </Alert>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 