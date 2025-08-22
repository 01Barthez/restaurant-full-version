
import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowLeft, Navigation2, Star, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/Layout/Navigation';
import Footer from '@/Layout/Footer';
import SEOHelmet from '@/components/SEO/SEOHelmet';
import OptimizedLazyImage from '@/components/ui/OptimizedLazyImage';
import { Link } from 'react-router-dom';
import { restaurants } from '@/data/restaurants.data';
import HeroSection from '@/components/common/HeroSection';
import { HERO_CONTENT } from '@/constants/heroSections';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams();

  const restaurant = restaurants.find(r => r.id === id);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation currentPage="contact" onPageChange={() => { }} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Restaurant non trouvé</h2>
              <p className="text-gray-600 mb-4">Ce restaurant n'existe pas.</p>
              <Link to="/contact">
                <Button>Retour aux restaurants</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEOHelmet
        title={`${restaurant.name} - Le Délice Moderne`}
        description={restaurant.fullDescription}
        keywords={`${restaurant.name}, restaurant camerounais ${restaurant.population}, ${restaurant.specialties.join(', ')}, réservation restaurant yaoundé`}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">

        <Navigation />

        {/* Hero Section */}
        <HeroSection
          image={`RESTAURANT`}
          span={HERO_CONTENT.RESTAURANT.span}
          title={HERO_CONTENT.RESTAURANT.title}
          description={HERO_CONTENT.RESTAURANT.description}
          showBackButton={true}
        />

        <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
          {/* Hero Section with Image Gallery */}
          <Card className="overflow-hidden mb-8">
            <div className="relative">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                {restaurant.images.map((image, index) => (
                  <div key={index} className={`relative ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}>
                    <OptimizedLazyImage
                      src={image}
                      alt={`${restaurant.name} - Image ${index + 1}`}
                      className={`w-full object-cover ${index === 0 ? 'h-80' : 'h-40'}`}
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
              <div className="absolute top-4 left-4 flex space-x-2">
                <Badge className="bg-restaurant-orange text-white">
                  <Star className="w-3 h-3 mr-1" />
                  {restaurant.rating}
                </Badge>
                <Badge variant="outline" className="bg-white/90">
                  {restaurant.reviews} avis
                </Badge>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-restaurant-dark dark:text-white">
                    {restaurant.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-restaurant-orange border-restaurant-orange">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {restaurant.fullDescription}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-restaurant-dark dark:text-white">Capacité</h4>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-restaurant-orange" />
                        <span className="dark:text-gray-300">{restaurant.capacity} places assises</span>
                      </div>
                      {restaurant.terrace > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-restaurant-orange">🌤️</span>
                          <span className="dark:text-gray-300">{restaurant.terrace} places en terrasse</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-restaurant-dark dark:text-white">Services</h4>
                      <div className="space-y-1">
                        {restaurant.parking && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-sm dark:text-gray-300">Parking disponible</span>
                          </div>
                        )}
                        {restaurant.accessible && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-sm dark:text-gray-300">Accès handicapés</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Localisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gradient-to-br from-blue-100 to-green-100 dark:from-gray-700 dark:to-gray-600 h-64 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto mb-2 text-restaurant-orange" />
                        <h3 className="text-lg font-bold text-restaurant-dark dark:text-white mb-1">
                          {restaurant.address}
                        </h3>
                        <Button className="bg-restaurant-gradient text-white hover:opacity-90 mt-2">
                          <Navigation2 className="w-4 h-4 mr-2" />
                          Obtenir l'itinéraire
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact & Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Horaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-restaurant-orange" />
                      <span className="text-sm dark:text-gray-300">{restaurant.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-restaurant-orange" />
                      <a href={`tel:${restaurant.phone}`} className="text-sm dark:text-gray-300 hover:text-restaurant-orange">
                        {restaurant.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-restaurant-orange" />
                      <a href={`mailto:${restaurant.email}`} className="text-sm dark:text-gray-300 hover:text-restaurant-orange">
                        {restaurant.email}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-restaurant-orange" />
                      <span className="text-sm dark:text-gray-300">{restaurant.hours}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/menu">
                    <Button className="w-full bg-restaurant-gradient text-white hover:opacity-90">
                      Voir le Menu
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Réserver une Table
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Navigation2 className="w-4 h-4 mr-2" />
                    Obtenir l'itinéraire
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default RestaurantDetail;
