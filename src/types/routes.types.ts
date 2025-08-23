export interface RouteConfig {
  path?: string;
  element: React.ReactNode;
  children?: RouteConfig[];
  index?: boolean;
  auth?: boolean;
  admin?: boolean;
};

// Extend LazyExoticComponent type to include preload method
export interface PreloadableComponent extends React.LazyExoticComponent<React.ComponentType<any>> {
  preload?: () => Promise<{ default: React.ComponentType<any> }>;
}

