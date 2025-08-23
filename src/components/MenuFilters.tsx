
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MenuFiltersProps } from '@/types/global';
import { categories, priceRanges, timeFilters } from '@/constants/menu';

const MenuFilters: React.FC<MenuFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  timeFilter,
  onTimeFilterChange,
  onClearFilters
}) => {
  const hasActiveFilters = selectedCategory !== 'all' || priceRange !== 'all' || timeFilter !== 'all' || searchTerm !== '';

  return (
    <div className="bg-gradient-to-l from-primary/10 via-transparent border border-orange-200 to-primary/10 p-4 rounded-lg shadow-md space-y-4 animate-fade-in">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Rechercher un plat, ingrédient, ou description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtres:</span>
        </div>

        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={onPriceRangeChange}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {priceRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeFilter} onValueChange={onTimeFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {timeFilters.map((time) => (
              <SelectItem key={time.value} value={time.value}>
                {time.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-restaurant-orange border-restaurant-orange hover:bg-restaurant-orange/10"
          >
            Effacer les filtres
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="bg-restaurant-orange/10 text-restaurant-orange">
              Recherche: "{searchTerm}"
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="bg-restaurant-orange/10 text-restaurant-orange">
              {categories.find(c => c.value === selectedCategory)?.label}
            </Badge>
          )}
          {priceRange !== 'all' && (
            <Badge variant="secondary" className="bg-restaurant-orange/10 text-restaurant-orange">
              {priceRanges.find(p => p.value === priceRange)?.label}
            </Badge>
          )}
          {timeFilter !== 'all' && (
            <Badge variant="secondary" className="bg-restaurant-orange/10 text-restaurant-orange">
              {timeFilters.find(t => t.value === timeFilter)?.label}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuFilters;
