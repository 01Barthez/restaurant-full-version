import { PreloadableComponent } from "@/types/routes.types";
import { lazy } from "react";


// Lazy load components with preloading
export const lazyWithPreload = (factory: () => Promise<{ default: React.ComponentType<any> }>): PreloadableComponent => {
  const Component = lazy(factory) as PreloadableComponent;
  Component.preload = factory;
  return Component;
};

