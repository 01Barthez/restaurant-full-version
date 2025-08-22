
import React, { Suspense, lazy, useCallback } from 'react';
import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import ComponentErrorBoundary from '@/components/utils/errorBoundaries/ComponentErrorBoundary';
import AsyncErrorBoundary from '@/components/utils/errorBoundaries/AsyncErrorBoundary';
import LoaderPage from '@/Layout/LoaderPage';
import ScrollToTop from '@/components/utils/ScrollToTop';

// Types
type RouteConfig = {
  path?: string;
  element: React.ReactNode;
  children?: RouteConfig[];
  index?: boolean;
  auth?: boolean;
  admin?: boolean;
};

// Extend LazyExoticComponent type to include preload method
interface PreloadableComponent extends React.LazyExoticComponent<React.ComponentType<any>> {
  preload?: () => Promise<{ default: React.ComponentType<any> }>;
}

// Lazy load components with preloading
const lazyWithPreload = (factory: () => Promise<{ default: React.ComponentType<any> }>): PreloadableComponent => {
  const Component = lazy(factory) as PreloadableComponent;
  Component.preload = factory;
  return Component;
};

// Public Pages
const Index = lazyWithPreload(() => import('@/pages/Home'));
const About = lazyWithPreload(() => import('@/pages/About'));
const Contact = lazyWithPreload(() => import('@/pages/Contact'));
const AboutStartup = lazyWithPreload(() => import('@/pages/AboutStartup'));
const AboutRewards = lazyWithPreload(() => import('@/pages/AboutRewards'));
const Gallery = lazyWithPreload(() => import('@/pages/Gallery'));
const MenuDetail = lazyWithPreload(() => import('@/pages/MenuDetail'));
const SpecialOfferDetail = lazyWithPreload(() => import('@/pages/SpecialOfferDetail'));
const RestaurantDetail = lazyWithPreload(() => import('@/pages/RestaurantDetail'));

// User Pages
const UserDashboard = lazyWithPreload(() => import('@/pages/UserDashboard'));
const UserOrders = lazyWithPreload(() => import('@/pages/UserOrders'));
const UserSettings = lazyWithPreload(() => import('@/pages/UserSettings'));
const OrderDetail = lazyWithPreload(() => import('@/pages/OrderDetail'));

// Admin Pages
const AdminLogin = lazyWithPreload(() => import('@/pages/AdminLogin'));
const AdminDashboard = lazyWithPreload(() => import('@/pages/AdminDashboard'));

// Error Pages
const NotFound = lazyWithPreload(() => import('@/pages/NotFound'));
const Unauthorized = lazyWithPreload(() => import('@/Layout/Unauthorized'));

// Preload common routes
const preloadRoute = (path: string) => {
  const routesToPreload: Record<string, () => Promise<void>> = {
    '/': async () => {
      await Promise.all([
        (About as PreloadableComponent).preload?.(),
        (Contact as PreloadableComponent).preload?.(),
        (Gallery as PreloadableComponent).preload?.()
      ]);
    },
    '/user': async () => {
      await Promise.all([
        (UserOrders as PreloadableComponent).preload?.(),
        (UserSettings as PreloadableComponent).preload?.()
      ]);
    },
    '/admin': async () => {
      await (AdminDashboard as PreloadableComponent).preload?.();
    }
  };

  const preload = routesToPreload[path];
  if (preload) preload();
};

// Layout Wrappers
const PublicLayout = () => (
  <Suspense fallback={<LoaderPage />}>
    <Outlet />
  </Suspense>
);

const UserLayout = () => {
  // Add authentication check here
  const isAuthenticated = true; // Replace with actual auth check
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Suspense fallback={<LoaderPage />}>
      <Outlet />
    </Suspense>
  );
};

const AdminLayout = () => {
  // Add admin check here
  const isAdmin = true; // Replace with actual admin check
  
  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <Suspense fallback={<LoaderPage />}>
      <Outlet />
    </Suspense>
  );
};

// Error Boundary Wrapper
const RouteWrapper: React.FC<{ component: React.ComponentType; componentName: string }> = ({
  component: Component,
  componentName
}) => (
  <ComponentErrorBoundary componentName={componentName}>
    <AsyncErrorBoundary>
      <Component />
    </AsyncErrorBoundary>
  </ComponentErrorBoundary>
);

// Routes configuration
const routes: RouteConfig[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <RouteWrapper component={Index} componentName="Index" /> },
      { path: 'menu', element: <RouteWrapper component={Index} componentName="Menu" /> },
      { path: 'menu/:id', element: <RouteWrapper component={MenuDetail} componentName="MenuDetail" /> },
      { path: 'menu-special/:id', element: <RouteWrapper component={SpecialOfferDetail} componentName="SpecialOffer" /> },
      { path: 'about', element: <RouteWrapper component={About} componentName="About" /> },
      { path: 'about-rewards', element: <RouteWrapper component={AboutRewards} componentName="AboutRewards" /> },
      { path: 'about-startup', element: <RouteWrapper component={AboutStartup} componentName="AboutStartup" /> },
      { path: 'gallery', element: <RouteWrapper component={Gallery} componentName="Gallery" /> },
      { path: 'contact', element: <RouteWrapper component={Contact} componentName="Contact" /> },
      { path: 'restaurant/:id', element: <RouteWrapper component={RestaurantDetail} componentName="Restaurant" /> },
      { path: 'unauthorized', element: <RouteWrapper component={Unauthorized} componentName="Unauthorized" /> },
    ]
  },
  {
    path: '/user',
    element: <UserLayout />,
    children: [
      { path: ':id', element: <RouteWrapper component={UserDashboard} componentName="UserDashboard" /> },
      { path: ':id/orders', element: <RouteWrapper component={UserOrders} componentName="UserOrders" /> },
      { path: ':id/settings', element: <RouteWrapper component={UserSettings} componentName="UserSettings" /> },
      { path: ':userId/orders/:orderId', element: <RouteWrapper component={OrderDetail} componentName="OrderDetail" /> },
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'login', element: <RouteWrapper component={AdminLogin} componentName="AdminLogin" /> },
      { path: 'dashboard', element: <RouteWrapper component={AdminDashboard} componentName="AdminDashboard" /> },
    ]
  },
  {
    path: '*',
    element: <RouteWrapper component={NotFound} componentName="NotFound" />
  }
];

// Convert route config to React Router elements
const renderRoutes = (routesToRender: RouteConfig[]) => {
  return routesToRender.map((route, index) => {
    if (route.children) {
      return (
        <Route key={index} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    
    return route.index ? (
      <Route key={index} index element={route.element} />
    ) : (
      <Route key={index} path={route.path} element={route.element} />
    );
  });
};

const Router: React.FC = () => {
  const location = useLocation();
  
  // Preload routes on hover
  const handleMouseEnter = useCallback((path: string) => {
    preloadRoute(path);
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {renderRoutes(routes)}
      </Routes>
      
      {/* Add route preloading for better UX */}
      {routes.map((route) => (
        <div 
          key={route.path} 
          onMouseEnter={() => handleMouseEnter(route.path)}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

export default Router;
