import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Uncaught error in ${this.props.componentName || 'a component'}:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white border-4 border-red-500 shadow-[4px_4px_0px_#FF0000] p-6 flex flex-col items-center justify-center text-center h-full w-full">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-red-500 uppercase mb-2">
            {this.props.componentName ? `${this.props.componentName} ERROR` : 'COMPONENT ERROR'}
          </h3>
          <p className="text-gray-600 text-sm">
            Failed to load this module.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
