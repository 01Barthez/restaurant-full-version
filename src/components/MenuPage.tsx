
import React, { useState, useMemo, useCallback } from 'react';
import { MenuItem } from '@/types/restaurant';
import { menuItems } from '@/data/mockData';
import MenuCard from './MenuCard';
import MenuFilters from './MenuFilters';
import CategorizedMenuView from './CategorizedMenuView';
import VirtualizedList from '@/components/ui/VirtualizedList';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';
import HeroSection from './common/HeroSection';
import { HERO_CONTENT } from '@/constants/heroSections';

interface MenuPageProps {
  onItemSelect: (item: MenuItem) => void;
  selectedCategory?: string;
}

const MenuPage: React.FC<MenuPageProps> = ({ onItemSelect, selectedCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(selectedCategory || 'all');
  const [priceRange, setPriceRange] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'categorized' | 'filtered'>('categorized');
  const [useVirtualization, setUseVirtualization] = useState(false);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      // Search filter
      const matchesSearch = searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

      // Price filter
      let matchesPrice = true;
      if (priceRange === '0-10') matchesPrice = item.price < 10;
      else if (priceRange === '10-20') matchesPrice = item.price >= 10 && item.price <= 20;
      else if (priceRange === '20+') matchesPrice = item.price > 20;

      // Time filter
      let matchesTime = true;
      if (timeFilter === '0-10') matchesTime = item.preparationTime < 10;
      else if (timeFilter === '10-20') matchesTime = item.preparationTime >= 10 && item.preparationTime <= 20;
      else if (timeFilter === '20+') matchesTime = item.preparationTime > 20;

      return matchesSearch && matchesCategory && matchesPrice && matchesTime && item.available;
    });
  }, [searchTerm, categoryFilter, priceRange, timeFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setPriceRange('all');
    setTimeFilter('all');
    setViewMode('categorized');
  };

  const hasActiveFilters = categoryFilter !== 'all' || priceRange !== 'all' || timeFilter !== 'all' || searchTerm !== '';

  // Switch to filtered view when filters are applied
  React.useEffect(() => {
    if (hasActiveFilters) {
      setViewMode('filtered');
    }
  }, [hasActiveFilters]);

  // Enable virtualization for large lists
  React.useEffect(() => {
    setUseVirtualization(filteredItems.length > 20);
  }, [filteredItems.length]);

  const renderMenuItem = useCallback((item: MenuItem, index: number) => (
    <div
      className="animate-fade-in p-2"
      style={{ animationDelay: `${index * 0.02}s` }}
    >
      <MenuCard item={item} onSelect={onItemSelect} />
    </div>
  ), [onItemSelect]);

  React.useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      setCategoryFilter(selectedCategory);
      setViewMode('filtered');
    }
  }, [selectedCategory]);

  const getCategoryTitle = () => {
    const categoryTitles = {
      'all': 'Notre Menu Complet',
      'plats': 'Nos Plats',
      'boissons': 'Nos Boissons',
      'desserts': 'Nos Desserts',
      'supplements': 'Suppléments'
    };
    return categoryTitles[categoryFilter as keyof typeof categoryTitles] || 'Notre Menu';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        image={`MENU`}
        span={HERO_CONTENT.MENU.span}
        title={viewMode === 'categorized' ? HERO_CONTENT.MENU.title : getCategoryTitle()}
        description={HERO_CONTENT.MENU.description}
      />

      <div className="max-w-7xl mx-auto py-10 lg:py-16:">
        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-background rounded-lg p-1 shadow-md">
            <Button
              variant={viewMode === 'categorized' ? 'default' : 'ghost'}
              onClick={() => {
                setViewMode('categorized');
                clearFilters();
              }}
              className="flex items-center space-x-2"
            >
              <Grid className="w-4 h-4" />
              <span>Vue par Catégories</span>
            </Button>

            <Button
              variant={viewMode === 'filtered' ? 'default' : 'ghost'}
              onClick={() => setViewMode('filtered')}
              className="flex items-center space-x-2"
            >
              <List className="w-4 h-4" />
              <span>Vue avec Filtres</span>
            </Button>
          </div>
        </div>

        {viewMode === 'filtered' && (
          <MenuFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={categoryFilter}
            onCategoryChange={setCategoryFilter}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
            onClearFilters={clearFilters}
          />
        )}

        <div className="mt-8">
          {viewMode === 'categorized' ? (
            <CategorizedMenuView onItemSelect={onItemSelect} />
          ) : (
            <>
              {filteredItems.length > 0 ? (
                <>
                  <div className="mb-4 text-gray-600 flex items-center justify-between">
                    <span>
                      {filteredItems.length} plat{filteredItems.length > 1 ? 's' : ''} trouvé{filteredItems.length > 1 ? 's' : ''}
                    </span>
                    {filteredItems.length > 20 && (
                      <span className="text-sm text-green-600">
                        ⚡ Mode virtualisé activé
                      </span>
                    )}
                  </div>

                  {useVirtualization ? (
                    <VirtualizedList
                      items={filteredItems}
                      height={600}
                      itemHeight={320}
                      renderItem={renderMenuItem}
                      className="border rounded-lg"
                    />
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="animate-fade-in"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <MenuCard item={item} onSelect={onItemSelect} />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 animate-fade-in">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                    Aucun plat trouvé
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Essayez de modifier vos critères de recherche
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-restaurant-orange hover:underline"
                  >
                    Effacer tous les filtres
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
