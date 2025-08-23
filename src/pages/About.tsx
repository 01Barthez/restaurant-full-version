import React, { useState } from 'react';
import { Star, Users, Calendar, Award, Heart, Target, TrendingUp, MapPin, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '@/Layout/Navigation';
import Footer from '@/Layout/footer/Footer';
import SEOHelmet from '@/components/SEO/SEOHelmet';
import OptimizedLazyImage from '@/components/ui/OptimizedLazyImage';
import HeroSection from '@/components/common/HeroSection';
import { HERO_CONTENT } from '@/constants/heroSections';
import { stats } from '@/constants/stats';
import { values } from '@/data/values.data';
import { timeline } from '@/data/timeline.data';
import { team } from '@/data/team.data';
import ModernTimeline from '@/components/ui/ModernTimeline';

const About = () => {
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const navigate = useNavigate();

  return (
    <>
      <SEOHelmet
        title="À Propos - Le Délice Moderne"
        description="Découvrez l'histoire du Délice Moderne, notre équipe passionnée et nos valeurs. Plus de 15 ans d'expérience dans la cuisine camerounaise authentique."
        keywords="histoire restaurant camerounais, équipe délice moderne, valeurs cuisine africaine, chef camerounais, expérience culinaire"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />

        {/* Hero Section */}
        <HeroSection
          image={`ABOUT`}
          span={HERO_CONTENT.ABOUT.span}
          title={HERO_CONTENT.ABOUT.title}
          description={HERO_CONTENT.ABOUT.description}
        />

        <div className="max-w-7xl mx-auto px-4 pt-8">
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow dark:bg-gray-800">
                  <CardContent className="p-2 bg-primary/15 border">
                    <CardContent className="p-6 bg-background border">
                      <IconComponent className="w-12 h-12 mx-auto mb-4 text-restaurant-orange" />
                      <h3 className="text-2xl font-bold text-restaurant-dark dark:text-white mb-2">
                        {stat.value}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
                    </CardContent>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Our Story */}
          <Card className="mb-16 dark:bg-gray-800 mx-10 md:mx-0">
            <CardContent className="p-8">
              <h2 className="title font-bold text-restaurant-dark dark:text-white mb-6 text-center">
                Notre Histoire
              </h2>
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="flex items-center lg:items-start justify-center md:justify-normal flex-col">
                  <p className="para text-center lg:text-left text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Tout a commencé en 2008 avec un rêve simple : créer un lieu où la passion pour la cuisine
                    rencontre l'art de recevoir. Nos fondateurs, passionnés de gastronomie, ont voulu créer
                    une expérience culinaire unique qui honore les traditions tout en embrassant l'innovation.
                  </p>
                  <p className="para text-center lg:text-left text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Aujourd'hui, nous sommes fiers d'être reconnus comme l'une des références culinaires de la région,
                    servant plus de 10,000 clients satisfaits chaque année.
                  </p>
                  <Button
                    onClick={() => navigate("/menu")}
                    className="bg-restaurant-gradient hover:opacity-90 px-2 py-1 "
                  >
                    Découvrir notre menu
                  </Button>
                </div>
                <div className="relative">
                  <OptimizedLazyImage
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
                    alt="Notre restaurant - Le Délice Moderne"
                    className="rounded-lg shadow-lg w-full h-64"
                    priority={true}
                    quality={100}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    blurDataURL="data:image/jpeg;base64,..."
                  />
                  <Button
                    onClick={() => navigate("/gallery")}
                    variant="outline"
                    className="absolute bottom-4 right-4 bg-white/90 hover:bg-white"
                  >
                    Voir la galerie
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Values */}
          <div className="mb-16 mx-10 md:mx-0">
            <h2 className="title font-bold text-restaurant-dark dark:text-white mb-8 text-center">
              Nos Valeurs
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow dark:bg-gray-800">
                    <CardContent className="p-8">
                      <IconComponent className="w-16 h-16 mx-auto mb-6 text-restaurant-orange" />
                      <h3 className="text-xl font-bold text-restaurant-dark dark:text-white mb-4">
                        {value.title}
                      </h3>
                      <p className="para text-gray-600 dark:text-gray-300 leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Timeline Moderne */}
          <div className="mb-24">
            <h2 className="title font-bold text-restaurant-dark dark:text-white mb-12 text-center">
              Notre Parcours
            </h2>
            <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
              <ModernTimeline items={timeline} />
            </div>
          </div>

          {/* Team */}
          <div className="mb-16 ">
            <h2 className="title  text-restaurant-dark dark:text-white mb-8 text-center">
              Notre Équipe
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mx-10 md:mx-0">
              {team.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow dark:bg-gray-800">
                  <div className="relative">
                    <OptimizedLazyImage
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      className="w-full h-64 object-cover rounded-t-lg"
                      priority={true}
                      quality={100}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <Badge className="absolute top-4 right-4 bg-restaurant-orange text-white">
                      <ChefHat className="w-4 h-4 mr-1" />
                      {member.experience}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg md:text-xl font-bold text-restaurant-dark dark:text-white mb-2">
                      {member.name}
                    </h3>
                    <Badge variant="outline" className="mb-4 border-restaurant-orange text-restaurant-orange">
                      {member.role}
                    </Badge>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                      {member.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-restaurant-orange">
                        Spécialité: {member.speciality}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-restaurant-gradient text-white text-center dark:bg-gray-800">
          <CardContent className="p-10 md:p-14 lg:p-20">
            <h2 className="title mb-6">
              Rejoignez Notre Aventure Culinaire
            </h2>
            <p className="para mb-6 md:mb-8 opacity-90">
              Découvrez nos créations et laissez-vous surprendre par notre passion pour la gastronomie.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center">
              <Link to="/menu">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-restaurant-orange hover:bg-gray-100"
                >
                  <ChefHat className="w-5 h-5 mr-2" />
                  Notre menu
                </Button>
              </Link>

              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white bg-transparent hover:bg-white/10"
                >
                  Nous contacter
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Footer className="mt-0" />
      </div>
    </>
  );
};

export default About;
