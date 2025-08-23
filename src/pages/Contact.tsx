import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, User, MessageSquare, Smartphone, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { restaurants } from '@/data/restaurants.data';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Navigation from '@/Layout/Navigation';
import Footer from '@/Layout/footer/Footer';
import SEOHelmet from '@/components/SEO/SEOHelmet';
import { contact_data, social_data } from '@/constants/global';
import HeroSection from '@/components/common/HeroSection';
import { BsFacebook, BsInstagram, BsTwitterX } from 'react-icons/bs';
import { HERO_CONTENT } from '@/constants/heroSections';
import { lazy, Suspense } from 'react';

// Import dynamique du composant InteractiveMap avec React.lazy
const InteractiveMap = lazy(() => import('@/components/Map/InteractiveMap'));


// Schéma de validation avec Zod
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Le nom est trop court' }).max(50, { message: 'Le nom est trop long' }),
  email: z.string().email({ message: 'Adresse email invalide' }),
  phone: z.string().min(10, { message: 'Numéro de téléphone invalide' }),
  subject: z.string().min(5, { message: 'Le sujet est trop court' }),
  message: z.string().min(10, { message: 'Votre message est trop court' })
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Fonction pour formater le numéro WhatsApp
const formatWhatsAppNumber = (phone: string): string => {
  return phone.replace(/\s|\+/g, '');
};

// Fonction pour détecter si l'utilisateur est sur mobile
const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Fonction pour ouvrir WhatsApp avec le message formaté
const openWhatsApp = (formData: ContactFormData) => {
  const { name, email, phone, subject, message } = formData;
  const formattedMessage = `Bonjour, je m'appelle ${name}.\n\n${message}\n\nPour me recontacter :\n📞 ${phone}\n📧 ${email}`;
  const encodedMessage = encodeURIComponent(formattedMessage);
  const whatsappNumber = formatWhatsAppNumber(contact_data.phone);
  window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
};

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // Simulation d'envoi au backend
      console.log('Envoi des données au backend :', data);

      // Attendre 2 secondes pour simuler l'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Afficher un toast de succès
      toast.success('Votre message a été envoyé avec succès !', {
        duration: 5000,
      });

      // Réinitialiser le formulaire
      reset();

      // Attendre 3 secondes supplémentaires avant la redirection
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Si c'est un appareil mobile, ouvrir WhatsApp
      if (isMobileDevice()) {
        openWhatsApp(data);
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire :', error);
      toast.error('Une erreur est survenue lors de l\'envoi du formulaire.', {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHelmet
        title="Contact - Le Délice Moderne"
        description="Contactez le Délice Moderne pour vos réservations, commandes et questions. 4 restaurants à Yaoundé, livraison rapide et service client de qualité."
        keywords="contact restaurant camerounais, réservation délice moderne, livraison yaoundé, téléphone restaurant, adresse restaurant cameroun"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navigation />

        {/* Hero Section */}
        <HeroSection
          image={`DEFAULT`}
          span={HERO_CONTENT.CONTACT.span}
          title={HERO_CONTENT.CONTACT.title}
          description={HERO_CONTENT.CONTACT.description}
        />

        <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 lg:py-12">
          {/* Contact Layout */}
          <div className="flex flex-col lg:flex-row gap-8 mb-16 w-full">
            {/* Left Column - Form & Quick Info */}
            <div className="w-full lg:w-1/3 space-y-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/20 shadow-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-amber-50/10 to-amber-100/5 border-b border-amber-500/20">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-6 h-6 text-amber-500" />
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                        Envoyez-nous un Message
                      </CardTitle>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Nous vous répondrons dans les plus brefs délais</p>
                  </CardHeader>
                  <CardContent className="space-y-5 p-6">
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          placeholder="Votre Nom"
                          className={`pl-10 dark:bg-gray-700/50 text-foreground/50 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500' : ''}`}
                          {...register('name')}
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="Votre email"
                          className={`pl-10 dark:bg-gray-700/50 text-foreground/50 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${errors.email ? 'border-red-500' : ''}`}
                          {...register('email')}
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          type="tel"
                          placeholder="+237 6XX XXX XXX"
                          className={`pl-10 dark:bg-gray-700/50 text-foreground/50 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${errors.phone ? 'border-red-500' : ''}`}
                          {...register('phone')}
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="relative">
                        <select
                          className={`w-full pl-10 pr-3 py-2.5 border ${errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700/50 text-foreground/50 appearance-none bg-transparent`}
                          {...register('subject')}
                          defaultValue=""
                        >
                          <option value="" disabled>Sélectionnez un sujet</option>
                          <option value="Réservation">Réservation</option>
                          <option value="Commande spéciale">Commande spéciale</option>
                          <option value="Événement privé">Événement privé</option>
                          <option value="Réclamation">Réclamation</option>
                          <option value="Autre">Autre</option>
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.subject.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-amber-500" />
                        Votre message
                      </label>
                      <div className="relative">
                        <textarea
                          rows={4}
                          className={`bg-background text-foreground/80 w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700/50 text-foreground/50 transition-all`}
                          placeholder="Votre message..."
                          {...register('message')}
                        ></textarea>
                      </div>
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full group bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-amber-500/20"
                        disabled={isSubmitting}
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                            Envoyer le message
                          </>
                        )}
                      </Button>
                      <p className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
                        En cliquant sur "Envoyer", vous acceptez notre politique de confidentialité.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </form>

              {/* Quick Contact Info */}
              <Card className="dark:bg-gray-800">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-restaurant-orange" />
                    <span className="text-foreground/50">
                      {contact_data.location}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-restaurant-orange" />
                    <span className="text-foreground/50">
                      {contact_data.phone}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-restaurant-orange" />
                    <span className="text-foreground/50">
                      {contact_data.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-restaurant-orange" />
                    <span className="text-foreground/50">
                      {contact_data.open_hours}
                    </span>
                  </div>
                  <hr />

                  <div className="flex gap-6 justify-center items-center">
                    <Link to={`${social_data.facebook}`}>
                      <BsFacebook className="w-6 h-6 hover:text-gray-300 text-orange-400 cursor-pointer transition-colors duration-300" />
                    </Link>

                    <Link to={`${social_data.instagram}`}>
                      <BsInstagram className="w-6 h-6 hover:text-gray-300 text-orange-400 cursor-pointer transition-colors duration-300" />
                    </Link>

                    <Link to={`${social_data.twitter}`}>
                      <BsTwitterX className="w-6 h-6 hover:text-gray-300 text-orange-400 cursor-pointer transition-colors duration-300" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Map */}
            <div className="hidden lg:block w-full lg:w-2/3">
              <Card className="dark:bg-gray-800 h-full">
                <CardContent className="p-0 h-full">
                  <iframe
                    className="w-full h-full min-h-[450px]"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127374.63544326797!2d11.518408866481833!3d3.925602099951553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcfc8a32f5289%3A0xc58677a4a22ca41a!2sThe%20Famous!5e0!3m2!1sen!2scm!4v1755584536836!5m2!1sen!2scm"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Restaurant Locations Grid */}
          <div className="mb-16 mt-12">
            {/* Map for tablet view - hidden on mobile and large screens */}
            <div className="w-full mb-8 md:block lg:hidden">
              <Card className="dark:bg-gray-800">
                <CardContent className="p-0">
                  <iframe
                    className="w-full h-[400px]"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127374.63544326797!2d11.518408866481833!3d3.925602099951553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcfc8a32f5289%3A0xc58677a4a22ca41a!2sThe%20Famous!5e0!3m2!1sen!2scm!4v1755584536836!5m2!1sen!2scm"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Map of restaurants */}
        <div className="w-full bg-white dark:bg-gray-900 py-8 md:py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Découvrez nos restaurants
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Retrouvez tous nos établissements sur la carte et venez nous rendre visite dans celui de votre choix.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mx-10 md:mx-0">
              {restaurants.map((restaurant, index) => (
                <Card key={restaurant.id} className="hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 bg-restaurant-orange rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-restaurant-dark text-foreground/50 mb-2">
                      {restaurant.name}
                    </h3>

                    <p className="para text-foreground/50 dark:text-foreground/75 mb-4 leading-relaxed">
                      {restaurant.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-3 h-3 text-restaurant-orange mt-1 flex-shrink-0" />
                        <span className="text-sm text-foreground/50 dark:text-foreground/25">{restaurant.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3 text-restaurant-orange" />
                        <span className="text-sm text-foreground/50 dark:text-foreground/25">{restaurant.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3 text-restaurant-orange" />
                        <span className="text-sm text-foreground/50 dark:text-foreground/25">{restaurant.hours}</span>
                      </div>
                    </div>

                    <Link to={`/restaurant/${restaurant.id}`}>
                      <Button className="w-full mt-4 bg-restaurant-gradient text-white hover:opacity-90 text-sm py-2">
                        Voir les Détails
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
              <InteractiveMap
                restaurants={restaurants}
                height="500px"
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
