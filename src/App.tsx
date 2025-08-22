
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/theme/ThemeProvider';
import Router from './router/Router';
import GlobalErrorBoundary from './components/utils/errorBoundaries/GlobalErrorBoundary';
import { cacheService } from './services/cacheService';
import { useEffect } from 'react';
import useStore from '@/store/useStore';
import './i18n/config';
import AppInitializer from "./components/utils/AppInitializer";
import FireCursor from "./components/nurui/fire-cursor";

const App = () => {
  // Initialize app data/services on load (theme is handled by boot script + store)
  useEffect(() => {
    // Initialize test data for the application
    const store = useStore.getState();
    if (store.initializeTestData) {
      store.initializeTestData();
    }

    // Initialize cache service with error handling
    if (cacheService && typeof cacheService.init === 'function') {
      cacheService.init().then(() => {
        console.log('Cache service ready');
      }).catch((error) => {
        console.error('Failed to initialize cache service:', error);
      });
    }

    // Initialize analytics
    if (store.calculateDashboardStats) {
      store.calculateDashboardStats();
    }
  }, []);

  return (
    <GlobalErrorBoundary onError={(error, errorInfo) => {
      console.error('Global error caught:', error, errorInfo);
    }}>
      <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider defaultTheme="delice-moderne">
            <TooltipProvider>
              <AppInitializer>
                <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
                  <Router />
                  <Toaster />
                  <Sonner position="top-center" />
                  <FireCursor />
                </div>
              </AppInitializer>
            </TooltipProvider>
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
