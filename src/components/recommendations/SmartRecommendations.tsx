
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Clock, Heart } from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { MenuItem } from '@/store/types';

interface SmartRecommendationsProps {
  userHistory: string[]; // Array of menu item IDs
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  userHistory,
  menuItems,
  onAddToCart
}) => {
  // Simple recommendation logic - in real app this would be more sophisticated
  const getRecommendations = () => {
    const recommendations = [];

    // Based on order history
    const historyItems = menuItems.filter(item => userHistory.includes(item.id));
    const categories = [...new Set(historyItems.map(item => item.category))];
    
    // Recommend similar items from same categories
    const similarItems = menuItems.filter(item => 
      categories.includes(item.category) && 
      !userHistory.includes(item.id) &&
      item.available
    ).slice(0, 3);

    recommendations.push({
      title: "Basé sur vos commandes précédentes",
      icon: <Clock className="w-5 h-5" />,
      items: similarItems
    });

    // Popular items
    const popularItems = menuItems
      .filter(item => item.featured && item.available && !userHistory.includes(item.id))
      .slice(0, 3);

    recommendations.push({
      title: "Plats populaires",
      icon: <TrendingUp className="w-5 h-5" />,
      items: popularItems
    });

    // Quick preparation items
    const quickItems = menuItems
      .filter(item => item.preparationTime <= 15 && item.available && !userHistory.includes(item.id))
      .slice(0, 3);

    recommendations.push({
      title: "Préparation rapide",
      icon: <Star className="w-5 h-5" />,
      items: quickItems
    });

    return recommendations.filter(rec => rec.items.length > 0);
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Heart className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl font-bold">Recommandations pour vous</h2>
      </div>

      {recommendations.map((section, sectionIndex) => (
        <Card key={sectionIndex}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {section.icon}
              <span>{section.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {section.items.map((item) => (
                <div key={item.id} className="group">
                  <div className="relative overflow-hidden rounded-lg mb-3">
                    <OptimizedImage
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        {item.preparationTime} min
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-orange-600">
                      {item.price.toFixed(2)}€
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onAddToCart(item)}
                      className="bg-restaurant-gradient hover:opacity-90"
                    >
                      Ajouter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SmartRecommendations;
