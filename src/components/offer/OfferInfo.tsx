
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Utensils } from 'lucide-react';
import { Offer, MenuItem } from '@/store/types';

interface OfferInfoProps {
  offer: Offer;
  items: MenuItem[];
}

const OfferInfo: React.FC<OfferInfoProps> = ({ offer, items }) => {
  const totalPrepTime = items.reduce((sum, item) => sum + item.preparationTime, 0);
  const averagePrepTime = items.length > 0 ? Math.round(totalPrepTime / items.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {offer.title}
          </h1>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {offer.discount} OFF
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{averagePrepTime} min</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 mr-1" />
            <span className="text-sm">2-3 people</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Utensils className="w-4 h-4 mr-1" />
            <span className="text-sm">{items.length} items</span>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {offer.description}
        </p>

        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-orange-500">
            {offer.discountPrice.toFixed(2)}€
          </span>
          <span className="text-xl text-gray-500 line-through">
            {offer.originalPrice.toFixed(2)}€
          </span>
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Save {(offer.originalPrice - offer.discountPrice).toFixed(2)}€
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Included Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description.substring(0, 60)}...
                  </p>
                </div>
                <span className="font-semibold">{item.price.toFixed(2)}€</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferInfo;
