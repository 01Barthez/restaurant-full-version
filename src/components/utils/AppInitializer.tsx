import { ReactNode, useEffect } from 'react';

interface AppInitializerProps {
  children?: ReactNode;
}

const AppInitializer = ({ children }: AppInitializerProps) => {
  useEffect(() => {
    // Service worker registration sans notifications automatiques
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/advanced-sw.js');
          console.log('Advanced SW registered:', registration);
          
          // Pas de notifications automatiques, l'utilisateur peut choisir de rafraîchir
        } catch (error) {
          console.warn('Advanced SW registration failed, trying basic SW:', error);
          
          try {
            await navigator.serviceWorker.register('/sw.js');
            console.log('Basic SW registered as fallback');
          } catch (fallbackError) {
            console.error('SW registration completely failed:', fallbackError);
          }
        }
      });
    }
  }, []);

  return <>{children}</>;
};

export default AppInitializer;