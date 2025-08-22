import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import SEOHelmet from '@/components/SEO/SEOHelmet';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/Layout/Navigation';
import Footer from '@/Layout/Footer';
import { pointsRules } from '@/data/pointsRules.data';
import { rewardTiers } from '@/data/rewardTiers.data';
import { redeemOptions } from '@/store/constants';

const AboutRewards: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHelmet
        title="Programme de Fidélité - Le Délice Moderne"
        description="Découvrez notre programme de fidélité : gagnez des points, débloquez des récompenses et profitez d'avantages exclusifs au Délice Moderne."
        keywords="programme fidélité restaurant camerounais, points récompenses, avantages clients, réductions restaurant, cashback délice moderne"
      />
      
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation 
        currentPage="about" 
        onPageChange={(page) => navigate(page === 'home' ? '/' : `/${page}`)} 
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Programme de Fidélité
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Plus vous commandez, plus vous gagnez !
          </p>
          <Button 
            size="lg" 
            className="bg-white text-orange-600 hover:bg-gray-100"
            onClick={() => navigate('/')}
          >
            Commencer à gagner des points
          </Button>
        </div>
      </div>

      {/* How it Works */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Comment gagner des points ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pointsRules.map((rule, index) => {
              const IconComponent = rule.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                        <IconComponent className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{rule.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                          {rule.description}
                        </p>
                        <Badge className="bg-orange-500 text-white">
                          {rule.points}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Reward Tiers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Niveaux de Fidélité
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewardTiers.map((tier, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-2 ${tier.color}`}></div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {tier.name}
                    <Star className="w-5 h-5 text-yellow-500" />
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    À partir de {tier.pointsRequired} points
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="text-sm flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Redeem Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Échanger vos points
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {redeemOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="font-bold">{option.points}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{option.reward}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {option.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Créez votre compte et commencez à gagner des points dès aujourd'hui !
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
              onClick={() => navigate('/gallery')}
            >
              Voir notre galerie
            </Button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
    </>
  );
};

export default AboutRewards;
