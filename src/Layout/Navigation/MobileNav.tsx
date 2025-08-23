import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, User, Utensils } from 'lucide-react';
import ThemeToggle from '@/components/utils/ThemeToggle';
import LanguageToggle from '@/components/utils/LanguageToggle';
import NavItem from './NavItem';
import useStore from '@/store/useStore';
import { MobileNavProps, navigationItems } from './types';

const MobileNav: React.FC<MobileNavProps> = ({ 
  currentPage, 
  onNavClick, 
  showAuthModal,
  clickedTab
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser } = useStore();
  const location = useLocation();

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed inset-x-0 top-0 z-50">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-800/30 shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center"
              onClick={() => onNavClick('/', 'home')}
            >
              <span className="text-2xl mr-2">🍽️</span>
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Le Délice Moderne
              </h1>
            </Link>
            
            <div className="flex items-center space-x-2">
              <LanguageToggle />
              <ThemeToggle />
              <button 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          <div 
            className={`px-4 pb-4 bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => onNavClick(item.path, item.key)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${
                    currentPage === item.path
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {!currentUser && (
                <button
                  onClick={showAuthModal}
                  className="w-full px-4 py-3 text-left rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Se Connecter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/30 dark:border-gray-800/30 z-40 shadow-lg" style={{ height: '80px' }}>
        <div className="relative h-full">
          {/* Animated Wave Effect */}
          <div 
            className="absolute -top-4 left-0 right-0 h-4 overflow-hidden pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% -10%, rgba(249, 115, 22, 0.1), transparent 70%)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          ></div>
          <div className="flex items-end justify-around h-full px-2 pb-2">
            {/* Home */}
            <NavItem 
              item={navigationItems[0]} 
              currentPage={currentPage} 
              clickedTab={clickedTab}
              onClick={onNavClick}
            />
            
            {/* About */}
            <NavItem 
              item={navigationItems[1]} 
              currentPage={currentPage} 
              clickedTab={clickedTab}
              onClick={onNavClick}
            />
            
            {/* Menu (Center Button) */}
            <div className="flex-1 flex flex-col items-center relative">
              <Link
                to={navigationItems[2].path}
                onClick={() => onNavClick(navigationItems[2].path, navigationItems[2].key)}
                className="flex flex-col items-center justify-center -mt-8 group"
              >
                <div className={`relative z-10 p-4 rounded-full shadow-lg transform transition-all duration-300 ${
                  currentPage === navigationItems[2].path || currentPage.startsWith(navigationItems[2].path)
                    ? 'bg-gradient-to-br from-orange-500 to-yellow-500 scale-110 shadow-orange-500/50'
                    : 'bg-background scale-100 shadow-orange-500/20 group-hover:scale-105'
                } ${clickedTab === navigationItems[2].key ? 'animate-bounce-once' : ''}`}>
                  <Utensils className={`h-7 w-7 ${
                    currentPage === navigationItems[2].path || currentPage.startsWith(navigationItems[2].path)
                      ? 'text-white'
                      : 'text-foreground group-hover:text-orange-500'
                  }`} />
                  {(currentPage === navigationItems[2].path || currentPage.startsWith(navigationItems[2].path)) && (
                    <>
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full animate-ping"></span>
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full"></span>
                    </>
                  )}
                </div>
                <span className={`text-xs font-medium mt-2 transition-colors duration-300 ${
                  currentPage === navigationItems[2].path || currentPage.startsWith(navigationItems[2].path)
                    ? 'text-orange-500 dark:text-orange-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-orange-500 dark:group-hover:text-orange-400'
                }`}>
                  {navigationItems[2].label}
                </span>
              </Link>
            </div>
            
            {/* Contact */}
            <NavItem 
              item={navigationItems[3]} 
              currentPage={currentPage} 
              clickedTab={clickedTab}
              onClick={onNavClick}
            />
            
            {/* Profile/Login */}
            <div className="flex-1 flex flex-col items-center relative">
              {currentUser ? (
                <Link
                  to={`/user/${currentUser.id}`}
                  onClick={() => onNavClick(`/user/${currentUser.id}`, 'profile')}
                  className="flex flex-col items-center justify-center"
                >
                  <div className={`relative p-2 rounded-full transition-all duration-200 ${
                    currentPage === '/profile' || currentPage.startsWith('/user/')
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                  } ${clickedTab === 'profile' ? 'animate-bounce-once' : ''}`}>
                    <User className="h-6 w-6" />
                    {(currentPage === '/profile' || currentPage.startsWith('/user/')) && (
                      <>
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full"></span>
                      </>
                    )}
                  </div>
                  <span className={`text-xs font-medium mt-1 ${
                    currentPage === '/profile' || currentPage.startsWith('/user/')
                      ? 'text-orange-500 dark:text-orange-400 font-semibold'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    Profil
                  </span>
                </Link>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    showAuthModal();
                    onNavClick('', 'login');
                  }}
                  className="flex flex-col items-center justify-center"
                >
                  <div className={`p-2 rounded-full transition-colors duration-200 ${
                    clickedTab === 'login' 
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 animate-bounce-once'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                  }`}>
                    <User className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium mt-1 text-gray-500 dark:text-gray-400">
                    Connexion
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
