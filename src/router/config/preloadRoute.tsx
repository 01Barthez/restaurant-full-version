import About from "@/pages/About";
import AdminDashboard from "@/pages/AdminDashboard";
import Contact from "@/pages/Contact";
import Gallery from "@/pages/Gallery";
import UserOrders from "@/pages/UserOrders";
import UserSettings from "@/pages/UserSettings";
import { PreloadableComponent } from "@/types/routes.types";

// Preload common routes
export const preloadRoute = (path: string) => {
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