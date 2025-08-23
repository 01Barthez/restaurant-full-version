import { RouteConfig } from "@/types/routes.types";
import { PublicLayout } from "./PublicLayout";
import { RouteWrapper } from "./ErrorBoundaryWrapper";
import { UserLayout } from "./UserLayout";
import { AdminLayout } from "./AdminLayout";
import { lazyWithPreload } from "./lazyWithPreload";

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



// Routes configuration
export const routes: RouteConfig[] = [
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
