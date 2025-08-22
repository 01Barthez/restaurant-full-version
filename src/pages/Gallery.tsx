import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Award } from 'lucide-react';
import SEOHelmet from '@/components/SEO/SEOHelmet';
import OptimizedLazyImage from '@/components/ui/OptimizedLazyImage';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Layout/Navigation';
import Footer from '@/Layout/Footer';
import { galleryItems } from '@/data/galleryItems.data';

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tout voir', icon: null },
    { id: 'milestone', name: 'Étapes importantes', icon: Award },
    { id: 'team', name: 'Équipe', icon: Users },
    { id: 'renovation', name: 'Rénovations', icon: MapPin },
    { id: 'event', name: 'Événements', icon: Calendar },
    { id: 'award', name: 'Récompenses', icon: Award }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'milestone': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'team': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'renovation': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'event': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'award': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <>
      <SEOHelmet
        title="Galerie Photos - Le Délice Moderne"
        description="Découvrez l'histoire du Délice Moderne en images : ouverture, équipe, rénovations, événements et moments marquants de notre restaurant camerounais."
        keywords="galerie photos restaurant camerounais, histoire délice moderne, équipe restaurant, événements culinaires, rénovations restaurant"
        image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
      />
      
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation 
        currentPage="gallery" 
        onPageChange={(page) => navigate(page === 'home' ? '/' : `/${page}`)} 
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Notre Histoire
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Découvrez les moments qui ont marqué l'évolution du Délice Moderne
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter Categories */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 
                  "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600" : 
                  ""
                }
              >
                {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="relative">
                <OptimizedLazyImage
                  src={`https://images.unsplash.com/photo-${1517248135467 + item.id}?auto=format&fit=crop&w=400&h=300`}
                  alt={`${item.title} - ${item.date}`}
                  className="w-full h-48 object-cover"
                />
                <Badge className={`absolute top-4 right-4 ${getCategoryColor(item.category)}`}>
                  {categories.find(c => c.id === item.category)?.name}
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  {item.date}
                </div>
                <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Story Timeline */}
        <section className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">
            Notre Parcours
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-500 to-yellow-500"></div>
              
              <div className="space-y-12">
                <div className="flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <h3 className="font-bold text-xl">2020</h3>
                    <p className="text-gray-600 dark:text-gray-400">Ouverture et premiers pas</p>
                  </div>
                  <div className="w-4 h-4 bg-orange-500 rounded-full relative z-10"></div>
                  <div className="flex-1 pl-8">
                    <p className="text-gray-700 dark:text-gray-300">
                      Lancement du restaurant avec une petite équipe passionnée et une vision claire.
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <p className="text-gray-700 dark:text-gray-300">
                      Expansion de l'équipe et modernisation des équipements.
                    </p>
                  </div>
                  <div className="w-4 h-4 bg-yellow-500 rounded-full relative z-10"></div>
                  <div className="flex-1 pl-8">
                    <h3 className="font-bold text-xl">2021</h3>
                    <p className="text-gray-600 dark:text-gray-400">Croissance et reconnaissance</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <h3 className="font-bold text-xl">2022</h3>
                    <p className="text-gray-600 dark:text-gray-400">Expansion et célébrations</p>
                  </div>
                  <div className="w-4 h-4 bg-orange-500 rounded-full relative z-10"></div>
                  <div className="flex-1 pl-8">
                    <p className="text-gray-700 dark:text-gray-300">
                      Agrandissement des espaces et célébration de nos clients fidèles.
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <p className="text-gray-700 dark:text-gray-300">
                      Innovation continue et service d'excellence pour l'avenir.
                    </p>
                  </div>
                  <div className="w-4 h-4 bg-yellow-500 rounded-full relative z-10"></div>
                  <div className="flex-1 pl-8">
                    <h3 className="font-bold text-xl">2023+</h3>
                    <p className="text-gray-600 dark:text-gray-400">Vers l'avenir</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Faites partie de notre histoire
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez-nous et créons ensemble les prochains chapitres de notre aventure culinaire
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100"
              onClick={() => navigate('/')}
            >
              Découvrir le menu
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-orange-600"
              onClick={() => navigate('/about-rewards')}
            >
              Programme fidélité
            </Button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
    </>
  );
};

export default Gallery;
