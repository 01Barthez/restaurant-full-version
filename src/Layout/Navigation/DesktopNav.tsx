import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlinePhone } from 'react-icons/ai';
import { Home, Utensils, Info } from 'lucide-react';
import { LogIn } from 'lucide-react';
import ThemeToggle from '@/components/utils/ThemeToggle';
import LanguageToggle from '@/components/utils/LanguageToggle';
import UserProfile from '@/components/UserProfile';
import { DesktopNavProps, navigationItems } from './types';
import useStore from '@/store/useStore';

const DesktopNav: React.FC<DesktopNavProps> = ({ 
  currentPage, 
  onNavClick, 
  showAuthModal 
}) => {
  const { currentUser } = useStore();

  return (
    <div className="hidden lg:flex w-full fixed top-6 left-0 right-0 z-50 px-4">
      <div className="max-w-6xl mx-auto w-full">
        <div className="relative">
          <div className="flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 dark:border-gray-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10">
            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 flex items-center group"
              onClick={() => onNavClick('/', 'home')}
            >
              <span className="text-2xl mr-2 transition-transform duration-300 group-hover:scale-110">
                🍽️
              </span>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Le Délice Moderne
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => onNavClick(item.path, item.key)}
                  className={`relative px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg group/nav-link ${
                    currentPage === item.path
                      ? 'text-white bg-gradient-to-r from-orange-500 to-yellow-500 shadow-lg shadow-orange-500/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 hover:text-orange-500 dark:hover:text-orange-400'
                  }`}
                >
                  <span className="relative z-10">
                    {item.label}
                    {currentPage !== item.path && (
                      <span className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full scale-x-0 group-hover/nav-link:scale-x-100 origin-left transition-transform duration-300 -bottom-1" />
                    )}
                  </span>
                  {currentPage === item.path && (
                    <span className="absolute -bottom-1 left-1/2 w-4 h-0.5 bg-white rounded-full -translate-x-1/2" />
                  )}
                </Link>
              ))}

              <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200/70 dark:border-gray-700/70 h-8">
                <div className="hover:scale-110 transition-transform flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  <LanguageToggle />
                </div>
                <div className="hover:scale-110 transition-transform flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  <ThemeToggle />
                </div>

                {currentUser ? (
                  <div className="ml-2">
                    <UserProfile />
                  </div>
                ) : (
                  <button
                    onClick={showAuthModal}
                    className="h-9 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5 transition-all duration-300 border-0 flex items-center"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    <span className="relative top-px">Se Connecter</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopNav;
