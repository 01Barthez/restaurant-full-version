
import React from 'react';
import CategorySection from './CategorySection';
import OffersCarousel from './OffersCarousel';
import { HeroSection, FeaturedItemsSection, RestaurantInfoSection } from '@/components/home';
import FeaturesSection from './home/FeaturesSection';
import SmallGallery from './home/SmallGallery';

interface HomePageProps {
  onMenuClick: () => void;
  onItemSelect: (itemId: string) => void;
  onCategorySelect: (category: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onMenuClick, onItemSelect, onCategorySelect }) => {

  return (
    <div className="min-h-screen">
      <HeroSection onMenuClick={onMenuClick} />

      <CategorySection onCategorySelect={onCategorySelect} />

      <FeaturesSection />

      <FeaturedItemsSection onMenuClick={onMenuClick} onItemSelect={onItemSelect} />

      <OffersCarousel />

      <SmallGallery />

      <RestaurantInfoSection />
    </div>
  );
};

export default HomePage;
