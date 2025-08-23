import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChefHat, Star, Clock, Phone, MapPin } from 'lucide-react';
import { contact_data } from '@/constants/global';

const RestaurantInfoSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in lg:block flex items-center flex-col justify-center">
            <Badge className="bg-restaurant-orange/10 text-restaurant-orange px-3 py-1 mb-4">
              Notre Histoire
            </Badge>
            <h2 className="title text-center text-restaurant-dark dark:text-white mb-6">
              Pourquoi choisir Le Délice Moderne ?
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-restaurant-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <ChefHat className="w-6 h-6 text-restaurant-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-restaurant-dark dark:text-white text-base md:text-lg">Cuisine Authentique</h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Nos chefs expérimentés préparent chaque plat avec passion et savoir-faire traditionnel</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-restaurant-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-restaurant-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-restaurant-dark dark:text-white text-base md:text-lg">Ingrédients Premium</h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Nous sélectionnons uniquement des produits frais et de qualité supérieure</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-restaurant-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-restaurant-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-restaurant-dark dark:text-white text-base md:text-lg">Service Excellence</h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Une expérience client exceptionnelle du début à la fin</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-8 animate-fade-in bg-restaurant-cream/20 border-restaurant-orange/20 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="title font-bold text-restaurant-dark dark:text-white mb-6 text-center">Informations Pratiques</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-restaurant-orange/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-restaurant-orange" />
                </div>
                <div>
                  <div className="font-medium text-restaurant-dark dark:text-white">Adresse</div>
                  <div className="text-gray-600 dark:text-gray-300">{contact_data.location}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-restaurant-orange/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-restaurant-orange" />
                </div>
                <div>
                  <div className="font-medium text-restaurant-dark dark:text-white">Téléphone</div>
                  <div className="text-gray-600 dark:text-gray-300">{contact_data.phone}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-restaurant-orange/10 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-restaurant-orange" />
                </div>
                <div>
                  <div className="font-medium text-restaurant-dark dark:text-white">Horaires</div>
                  {(() => {
                    const hours: string | undefined = (contact_data.email as any).hours ?? (contact_data.open_hours as any).openingHours;
                    return <div className="text-gray-600 dark:text-gray-300">{hours}</div>;
                  })()}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-restaurant-orange/20">
              <Button className="w-full bg-restaurant-gradient hover:opacity-90 text-white">
                <Phone className="w-4 h-4 mr-2" />
                Réserver Maintenant
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RestaurantInfoSection;
