import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, info);
    }

    handleReload(): void {
        window.location.reload();
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 p-8 rounded-lg max-w-lg">
                        <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">Something went wrong</h2>
                        <p className="text-red-700 dark:text-gray-300 mb-6">
                            An unexpected error occurred. Please reload the page to continue.
                        </p>
                        <button
                            onClick={this.handleReload}
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
