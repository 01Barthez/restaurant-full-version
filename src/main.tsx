import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ErrorState from './Layout/ErrorState.tsx';

// Improved error handling and loading management
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Performance-optimized app initialization
const initializeApp = async () => {
  try {
    // Minimum loading time for better UX
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 500));

    // Check for slow connections
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');

    if (isSlowConnection) {
      // Defer non-critical resources for slow connections
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Wait for minimum load time
    await minLoadTime;

    // Render the main app
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

  } catch (error) {
    console.error('App initialization failed:', error);

    // Show error state
    root.render(
      <React.StrictMode>
        <ErrorState/>
      </React.StrictMode>
    );

  }
};
// Initialize the app
initializeApp();
