import AsyncErrorBoundary from "@/components/utils/errorBoundaries/AsyncErrorBoundary";
import ComponentErrorBoundary from "@/components/utils/errorBoundaries/ComponentErrorBoundary";

// Error Boundary Wrapper
export const RouteWrapper: React.FC<{ component: React.ComponentType; componentName: string }> = ({
  component: Component,
  componentName
}) => (
  <ComponentErrorBoundary componentName={componentName}>
    <AsyncErrorBoundary>
      <Component />
    </AsyncErrorBoundary>
  </ComponentErrorBoundary>
);

