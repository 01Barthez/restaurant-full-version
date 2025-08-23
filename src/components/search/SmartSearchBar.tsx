
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Fuse from 'fuse.js';
import useStore from '@/store/useStore';
import { SearchFilters, SmartSearchBarProps } from '@/types/global';

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({ visible, onSearch }) => {
  const { t } = useTranslation();
  const { menuItems } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    dietary: [],
    priceRange: [0, 100],
    sortBy: 'popularity'
  });
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Fuse.js for fuzzy search
  const fuse = new Fuse(menuItems, {
    keys: ['name', 'description', 'category', 'ingredients'],
    threshold: 0.3,
    includeScore: true
  });

  useEffect(() => {
    if (searchQuery.length > 1) {
      const results = fuse.search(searchQuery).slice(0, 5);
      setSuggestions(results.map(result => result.item));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, menuItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    onSearch(searchQuery, filters);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (item: any) => {
    setSearchQuery(item.name);
    setShowSuggestions(false);
    onSearch(item.name, filters);
  };

  const toggleCategoryFilter = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleDietaryFilter = (dietary: string) => {
    setFilters(prev => ({
      ...prev,
      dietary: prev.dietary.includes(dietary)
        ? prev.dietary.filter(d => d !== dietary)
        : [...prev.dietary, dietary]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      dietary: [],
      priceRange: [0, 100],
      sortBy: 'popularity'
    });
  };

  if (!visible) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Input */}
          <div ref={searchRef} className="relative flex-1 w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                ref={inputRef}
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4"
                aria-label={t('search.placeholder')}
              />
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 mt-1">
                {suggestions.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                    role="option"
                    aria-selected={false}
                  >
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>{t('search.filters')}</span>
                  {(filters.categories.length > 0 || filters.dietary.length > 0) && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.categories.length + filters.dietary.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{t('search.filters')}</h4>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Categories */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('menu.categories.all')}
                    </label>
                    <div className="space-y-2">
                      {['appetizers', 'mains', 'desserts', 'drinks'].map(category => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={filters.categories.includes(category)}
                            onCheckedChange={() => toggleCategoryFilter(category)}
                          />
                          <label htmlFor={category} className="text-sm">
                            {t(`menu.categories.${category}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Dietary */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('search.dietary')}
                    </label>
                    <div className="space-y-2">
                      {['vegetarian', 'vegan', 'glutenFree', 'spicy'].map(dietary => (
                        <div key={dietary} className="flex items-center space-x-2">
                          <Checkbox
                            id={dietary}
                            checked={filters.dietary.includes(dietary)}
                            onCheckedChange={() => toggleDietaryFilter(dietary)}
                          />
                          <label htmlFor={dietary} className="text-sm">
                            {t(`search.${dietary}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Sort By */}
            <Select value={filters.sortBy} onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('search.sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">{t('search.popularity')}</SelectItem>
                <SelectItem value="price">{t('search.price')}</SelectItem>
                <SelectItem value="rating">{t('search.rating')}</SelectItem>
                <SelectItem value="name">{t('nav.menu')}</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} size="sm">
              <Search className="w-4 h-4 mr-2" />
              {t('common.search')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSearchBar;
