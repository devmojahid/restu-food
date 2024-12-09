import React from 'react';

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
            return this.props.fallback || (
                <div className="rounded-xl bg-red-50 p-4 text-red-500">
                    <div className="w-8 h-8 mx-auto mb-2">⚠️</div>
                    <p className="text-center">Something went wrong</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 