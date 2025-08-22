import React from 'react';
import { HERO_IMAGES } from '@/constants/heroSections';

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

interface HeroSectionProps {
  image?: keyof typeof HERO_IMAGES;
  span: string;
  title: string;
  description: string;
  className?: string;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  image = 'DEFAULT',
  span,
  title,
  description,
  className = '',
  showBackButton = false,
  children
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <section className={`relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-10 shadow-md ${className}`}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-amber-500/15 dark:from-orange-500/10 dark:to-amber-500/10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-5"
          style={{ backgroundImage: `url(${HERO_IMAGES[image]})` }}
        ></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 lg:space-y-6">
          <span className="inline-block px-3 py-1.5 text-xs font-medium bg-orange-50/80 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-orange-200 dark:border-amber-800/50 rounded-full backdrop-blur-sm">
            {span}
          </span>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-orange-500">
            {title}
          </h1>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-4 pt-4">
            {showBackButton && (
              <Button
              variant='outline'
                onClick={handleBack}
                className="rounded-full border-primary px-6 inline-flex items-center text-base font-medium text-orange-500 hover:text-amber-800 dark:hover:text-amber-200 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                Retour
              </Button>
            )}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
