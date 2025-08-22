
import React, { Component, ReactNode } from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  loading?: boolean;
  fallback?: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class AsyncErrorBoundary extends Component<Props, State> {
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
    console.error('AsyncErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null
    });
    this.props.onRetry?.();
  };

  render() {
    if (this.props.loading) {
      return (
        <Card className="m-4">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Chargement...</span>
          </CardContent>
        </Card>
      );
    }

    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="h-screen flex items-center justify-center flex-col">
          <h1 className="font-bold mb-4 text-4xl text-primary text-center">Le Délice Moderne</h1>
          <Card className="m-4">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="font-semibold mb-2">Erreur de chargement</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Impossible de charger ce contenu pour le moment.
              </p>
              <Button onClick={this.handleRetry} size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AsyncErrorBoundary;
