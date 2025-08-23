
import React from 'react';
import { MenuItem } from '@/types/global';
import MenuCard from './MenuCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { menuItems } from '@/data/menuItems.data';

interface CategorizedMenuViewProps {
  onItemSelect: (item: MenuItem) => void;
}

const CategorizedMenuView: React.FC<CategorizedMenuViewProps> = ({ onItemSelect }) => {
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const categoryTitles = {
    'boissons': 'Nos Boissons',
    'plats': 'Nos Plats Principaux',
    'desserts': 'Nos Desserts',
    'supplements': 'Nos Suppléments'
  };

  const subCategories = {
    'plats': {
      'riz': menuItems.filter(item => item.category === 'plats' && item.name.toLowerCase().includes('riz')),
      'poulet': menuItems.filter(item => item.category === 'plats' && item.name.toLowerCase().includes('poulet')),
      'boeuf': menuItems.filter(item => item.category === 'plats' && (item.name.toLowerCase().includes('boeuf') || item.name.toLowerCase().includes('bœuf'))),
      'poisson': menuItems.filter(item => item.category === 'plats' && item.name.toLowerCase().includes('poisson'))
    }
  };

  return (
    <div className="space-y-16">
      {Object.entries(groupedItems).map(([category, items]) => (
        <section key={category} className="animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="title font-bold text-restaurant-dark dark:text-white mb-4">
              {categoryTitles[category as keyof typeof categoryTitles] || category}
            </h2>
            <div className="w-24 h-1 bg-restaurant-gradient mx-auto rounded"></div>
          </div>

          {category === 'plats' ? (
            // Special layout for main dishes with subcategories
            <div className="space-y-12">
              {Object.entries(subCategories.plats).map(([subCat, subItems]) => {
                if (subItems.length === 0) return null;
                return (
                  <div key={subCat} className="animate-fade-in">
                    <h3 className="text-2xl font-semibold text-restaurant-dark dark:text-white mb-6 text-center capitalize">
                      Spécialités {subCat}
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {subItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="animate-fade-in"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <MenuCard item={item} onSelect={onItemSelect} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Other main dishes not in subcategories */}
              {(() => {
                const otherPlats = items.filter(item =>
                  !item.name.toLowerCase().includes('riz') &&
                  !item.name.toLowerCase().includes('poulet') &&
                  !item.name.toLowerCase().includes('boeuf') &&
                  !item.name.toLowerCase().includes('bœuf') &&
                  !item.name.toLowerCase().includes('poisson')
                );

                if (otherPlats.length > 0) {
                  return (
                    <div className="animate-fade-in">
                      <h3 className="text-2xl font-semibold text-restaurant-dark dark:text-white mb-6 text-center">
                        Autres Spécialités
                      </h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {otherPlats.map((item, index) => (
                          <div
                            key={item.id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                          >
                            <MenuCard item={item} onSelect={onItemSelect} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          ) : (
            // Regular layout for other categories
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => (
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
        </section>
      ))}

      {/* CTA Section */}
      <Card className="bg-restaurant-gradient text-white text-center dark:bg-gray-800 rounded-lg animate-fade-in">
        <CardContent className="p-10 md:p-14 lg:p-20">
          <h2 className="title mb-6">
            Vous n'avez pas trouvé le repas que vous cherchez ?
          </h2>
          <p className="para mb-6 md:mb-8 opacity-90">
            Notre équipe sera ravie de vous aider à trouver le plat parfait ou de préparer quelque chose de spécial pour vous.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center">
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-restaurant-orange hover:bg-gray-100"
              >
                Contact
              </Button>
            </Link>

            <Link to="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-transparent hover:bg-white/10"
              >
                A Propos de Nous
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategorizedMenuView;
