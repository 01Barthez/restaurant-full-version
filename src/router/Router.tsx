
import React, { useCallback } from 'react';
import { Routes } from 'react-router-dom';
import ScrollToTop from '@/components/utils/ScrollToTop';
import { preloadRoute } from './config/preloadRoute';
import { renderRoutes } from './renderRoutes';
import { routes } from './config/Routes.config';


const Router: React.FC = () => {
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
      {
        routes.map((route) => (
          <div
            key={route.path}
            onMouseEnter={() => handleMouseEnter(route.path || '/')}
            style={{ display: 'none' }}
            aria-hidden="true"
          />
        ))
      }
    </>
  );
};

export default Router;
