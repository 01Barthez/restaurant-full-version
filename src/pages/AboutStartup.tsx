
import React from 'react';
import Navigation from '@/Layout/Navigation';
import Footer from '@/Layout/Footer';
import { useLocation } from 'react-router-dom';
import { Star, Users, Award, Phone, Mail, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEOHelmet from '@/components/SEO/SEOHelmet';
import OptimizedLazyImage from '@/components/ui/OptimizedLazyImage';

const AboutStartup = () => {
  const location = useLocation();
  
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/about-startup') return 'about';
    return 'home';
  };

  const handlePageChange = (page: string) => {
    // Navigation will be handled by react-router-dom
  };

  const teamMembers = [
    {
      name: "Jean Dubois",
      role: "Chef Exécutif",
      image: "/placeholder.svg",
      description: "15 ans d'expérience dans la haute gastronomie"
    },
    {
      name: "Marie Martin",
      role: "Directrice Générale",
      image: "/placeholder.svg",
      description: "Expert en gestion d'entreprise et service client"
    },
    {
      name: "Pierre Durand",
      role: "Chef Pâtissier",
      image: "/placeholder.svg",
      description: "Spécialiste des desserts créatifs et raffinés"
    }
  ];

  return (
    <>
      <SEOHelmet
        title="Notre Startup - Le Délice Moderne"
        description="Découvrez l'histoire de notre startup culinaire, notre équipe, nos services et notre vision pour révolutionner l'expérience gastronomique camerounaise."
        keywords="startup restaurant camerounais, équipe délice moderne, innovation culinaire, histoire entreprise, vision gastronomique"
      />
      
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation 
        currentPage={getCurrentPage()}
        onPageChange={handlePageChange}
      />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">À Propos de Le Délice Moderne</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Découvrez l'histoire de notre restaurant innovant qui révolutionne l'expérience culinaire moderne
            </p>
          </div>
        </section>

        {/* Notre Histoire */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Notre Histoire</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Fondé en 2020, Le Délice Moderne est né de la passion de créer une expérience culinaire unique 
                  qui marie tradition française et innovation technologique. Notre vision est de rendre la gastronomie 
                  accessible à tous grâce à notre plateforme de commande intuitive.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Nous nous engagons à utiliser uniquement des ingrédients frais et locaux, 
                  tout en offrant un service client exceptionnel et une expérience digitale moderne.
                </p>
              </div>
              <div className="relative">
                <OptimizedLazyImage
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
                  alt="Notre restaurant - Le Délice Moderne"
                  className="rounded-lg shadow-xl w-full h-64"
                  priority={true}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Nos Produits */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Nos Produits</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow dark:bg-gray-800">
                <CardContent>
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🍕</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Pizzas Artisanales</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Pâte fraîche préparée quotidiennement avec des ingrédients premium
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-lg transition-shadow dark:bg-gray-800">
                <CardContent>
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🍔</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Burgers Gourmet</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Viande de bœuf premium et ingrédients sélectionnés avec soin
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-lg transition-shadow dark:bg-gray-800">
                <CardContent>
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🍜</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Plats Traditionnels</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Recettes authentiques revisitées avec une touche moderne
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Nos Services */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Nos Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚚</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Livraison Rapide</h3>
                <p className="text-gray-600 dark:text-gray-300">Livraison en 30 min ou moins</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Commande Digitale</h3>
                <p className="text-gray-600 dark:text-gray-300">Interface intuitive et moderne</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⭐</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Programme Fidélité</h3>
                <p className="text-gray-600 dark:text-gray-300">Points et récompenses exclusives</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Personnalisation</h3>
                <p className="text-gray-600 dark:text-gray-300">Adaptez vos plats selon vos goûts</p>
              </div>
            </div>
          </div>
        </section>

        {/* Notre Équipe */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Notre Équipe</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow dark:bg-gray-800">
                  <CardContent>
                    <OptimizedLazyImage
                      src={`https://images.unsplash.com/photo-${1583394293214 + index}?auto=format&fit=crop&w=200&h=200`}
                      alt={`${member.name} - ${member.role}`}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-orange-500 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Contactez-Nous</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Phone className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Téléphone</h3>
                <p className="text-gray-600 dark:text-gray-300">+33 1 23 45 67 89</p>
              </div>
              
              <div className="text-center">
                <Mail className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Email</h3>
                <p className="text-gray-600 dark:text-gray-300">contact@delicemoderne.fr</p>
              </div>
              
              <div className="text-center">
                <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Adresse</h3>
                <p className="text-gray-600 dark:text-gray-300">123 Rue de la Gastronomie<br />75001 Yaoundé, France</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-6">Prêt à Découvrir Nos Délices ?</h2>
            <p className="text-xl mb-8">
              Explorez notre menu et commandez dès maintenant pour une expérience culinaire inoubliable
            </p>
            <Button 
              size="lg" 
              className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              onClick={() => window.location.href = '/menu'}
            >
              Voir Notre Menu
            </Button>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
    </>
  );
};

export default AboutStartup;
