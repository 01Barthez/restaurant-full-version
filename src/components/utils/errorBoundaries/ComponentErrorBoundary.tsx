
import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ComponentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(`ComponentErrorBoundary (${this.props.componentName}) caught an error:`, error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Erreur dans {this.props.componentName || 'ce composant'}. 
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-2">
                  <summary className="cursor-pointer">Voir les détails</summary>
                  <pre className="text-xs mt-1 whitespace-pre-wrap">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </span>
            <Button onClick={this.handleRetry} size="sm" variant="outline">
              <RefreshCw className="w-3 h-3 mr-1" />
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ComponentErrorBoundary;
