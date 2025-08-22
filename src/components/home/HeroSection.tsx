import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Phone, Star, ChefHat, Users, Utensils, ArrowRight, Award } from 'lucide-react';
import { MagnetizeButton } from '../ui/magnetize-button';
import { BackgroundCircles } from '../ui/background-circles';
import FlowerDishCluster from './FlowerDishCluster';

interface HeroSectionProps {
  onMenuClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onMenuClick }) => {
  return (
    <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden pt-20 lg:pt-0">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-restaurant-orange/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-restaurant-gold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto py-20 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
          {/* Left Content - Enhanced */}
          <div className="text-center lg:text-left space-y-8">
            {/* Premium Badge */}
            <div className="flex justify-center lg:justify-start">
              <Badge
                variant='outline'
                className="text-sm cursor-default border-2 border-restaurant-gold text-restaurant-gold bg-transparent px-4 py-1  font-bold shadow-xl"
              >
                <Award className="w-5 h-5 mr-2" />
                Plus qu’un plat, une équation sensible
              </Badge>
            </div>

            {/* Main Heading - More Impact */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight">
                <span className="block bg-gradient-to-r from-white via-restaurant-cream to-restaurant-gold bg-clip-text text-transparent">
                  Le Délice
                </span>
                <span className="block bg-gradient-to-r from-restaurant-gold via-restaurant-orange to-red-400 bg-clip-text text-transparent">
                  Moderne
                </span>
              </h1>
            </div>

            <div className="w-32 lg:w-full md:max-w-xs h-1 bg-gradient-to-r from-restaurant-orange to-restaurant-gold mx-auto lg:mx-0 rounded-full"></div>

            {/* Sophisticated Description */}
            <div className="text-base sm:text-lg md:text-xl">
              Ici, <span className="text-restaurant-gold font-semibold"> le rationnel et l’émotionnel</span>&nbsp;
              <span className=" text-gray-400 leading-relaxed max-w-2xl">
                se croisent dans une géométrie qui nourrit l’âme autant que le corspans. Dans chaque détail discret  de notre cuisine se cache une grandeur qui ne cherche pas à impressionner, mais à toucher.
              </span>
            </div>


            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start w-full items-center">
              <MagnetizeButton
                particleCount={14}
                attractRadius={50}
                onClick={onMenuClick}
                className="rounded-full"
              />
            </div>
          </div>

          {/* Right Content - BackgroundCircles + Flower image cluster */}
          <div className="relative flex items-center justify-center w-full min-h-[52vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh]">
            {/* Background behind */}
            <BackgroundCircles className="absolute inset-0 z-10 opacity-20" />
            
            {/* Foreground flower cluster */}
            <div className="absolute z-20">
              <FlowerDishCluster />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
