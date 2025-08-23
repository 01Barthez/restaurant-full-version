import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useStore from '@/store/useStore';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import AuthModal from '@/components/AuthModal';
import { navigationItems } from './types';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [clickedTab, setClickedTab] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const { scrollToTop } = useStore();
  
  const currentPage = location.pathname;
  
  // Check if mobile and handle redirection
  useEffect(() => {
    const mobileBreakpoint = 1024; // lg breakpoint
    const isMobileView = window.innerWidth < mobileBreakpoint;
    setIsMobile(isMobileView);
    
    const isInitialLoad = !window.history.state || window.history.state.idx === 0;
    
    if (isMobileView && (currentPage === '/' || currentPage === '') && isInitialLoad) {
      const timer = setTimeout(() => {
        navigate('/menu', { 
          replace: true,
          state: { fromRedirect: true }
        });
      }, 0);
      
      return () => clearTimeout(timer);
    }
    
    const handleResize = () => {
      const newIsMobile = window.innerWidth < mobileBreakpoint;
      setIsMobile(newIsMobile);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPage, navigate]);

  const handleNavClick = (path: string, tab: string) => {
    setClickedTab(tab);
    scrollToTop();
    setTimeout(() => setClickedTab(''), 300);
  };

  // Update active tab when URL changes
  useEffect(() => {
    const currentItem = navigationItems.find(item => item.path === currentPage);
    if (currentItem) {
      setClickedTab(currentItem.key);
    } else if (currentPage === '/profile' || currentPage.startsWith('/user/')) {
      setClickedTab('profile');
    }
  }, [currentPage]);

  // Animation on mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className={`w-full fixed top-6 left-0 right-0 z-50 px-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
        <DesktopNav 
          currentPage={currentPage}
          onNavClick={handleNavClick}
          showAuthModal={() => setShowAuthModal(true)}
        />
      </div>
      
      <MobileNav 
        currentPage={currentPage}
        onNavClick={handleNavClick}
        showAuthModal={() => setShowAuthModal(true)}
        clickedTab={clickedTab}
      />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Navigation;
