import React from 'react';
import { Link } from 'react-router-dom';
import { NavItemProps } from '@/types/global';

const NavItem: React.FC<NavItemProps> = ({ 
  item, 
  currentPage, 
  clickedTab, 
  onClick, 
  className = '' 
}) => {
  const isActive = currentPage === item.path || 
                 (currentPage === '/' && item.path === '/') ||
                 (item.path !== '/' && currentPage.startsWith(item.path));
    
  return (
    <div className={`flex-1 flex flex-col items-center relative group ${className}`}>
      <Link
        to={item.path}
        onClick={() => onClick(item.path, item.key)}
        className={`flex flex-col items-center justify-center w-full py-2 transition-all duration-300 relative z-10 ${
          isActive 
            ? 'text-orange-500 dark:text-orange-400' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        {/* Icon container */}
        <div 
          className={`relative p-2.5 rounded-full transition-all duration-300 ${
            isActive 
              ? 'bg-orange-100 dark:bg-orange-900/30' 
              : 'group-hover:bg-gray-100/50 dark:group-hover:bg-gray-800/50'
          } ${clickedTab === item.key ? 'animate-bounce-once' : ''}`}
          style={{
            transform: isActive ? 'scale(1.15)' : 'scale(1)',
            transformOrigin: 'center'
          }}
        >
          {item.icon}          
        </div>
        
        {/* Label */}
        <span 
          className={`text-xs mt-1.5 transition-all duration-300 ${
            isActive 
              ? 'font-semibold text-orange-500 dark:text-orange-400' 
              : 'font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
          }`}
        >
          {item.label}
        </span>
        
        {/* Active indicator bar */}
        <div 
          className={`absolute -bottom-1 left-1/2 h-1 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300 transform -translate-x-1/2 ${
            isActive ? 'w-8 opacity-100' : 'w-0 opacity-0'
          }`}
        ></div>
      </Link>
    </div>
  );
};

export default NavItem;
