import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-red-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-center text-red-600 mb-4">Something went wrong</h2>
            <p className="mb-4">The app encountered an error. Please try refreshing the page.</p>
            
            {this.props.showDetails && (
              <details className="mt-4 p-4 bg-gray-100 rounded-lg">
                <summary className="cursor-pointer font-semibold">Technical Details</summary>
                <p className="mt-2 text-red-600">{this.state.error && this.state.error.toString()}</p>
                <div className="mt-2 text-sm overflow-auto max-h-40">
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </div>
              </details>
            )}
            
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors w-full"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;