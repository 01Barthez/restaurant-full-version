
import React, { Suspense, lazy, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import AsyncErrorBoundary from '@/components/utils/errorBoundaries/AsyncErrorBoundary';

interface LazyComponentProps {
  loader: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: any;
  onRetry?: () => void;
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  loader,
  fallback,
  props = {},
  onRetry
}) => {
  const Component = lazy(loader);

  const defaultFallback = (
    <div className="p-4">
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );

  return (
    <AsyncErrorBoundary onRetry={onRetry}>
      <Suspense fallback={fallback || defaultFallback}>
        <Component {...props} />
      </Suspense>
    </AsyncErrorBoundary>
  );
};

export default LazyComponent;
