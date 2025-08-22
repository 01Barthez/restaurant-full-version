
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Settings, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PWAInstallButton from '@/components/ui/PWAInstallButton';
import { contact_data, social_data } from '@/store/constants';
import { subscribeToNewsletter } from '@/services/newsletterService';
// import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface FooterProps {
  onAdminClick?: () => void;
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick, className }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation de l'email
    if (!email.trim()) {
      setEmailError('Veuillez entrer une adresse email');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Veuillez entrer une adresse email valide');
      return;
    }
    
    setEmailError('');
    setIsLoading(true);
    
    try {
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        toast.success(result.message, {
          duration: 5000,
          position: 'top-right',
          style: {
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '1rem',
            fontSize: '0.875rem',
          },
        });
        setEmail('');
      } else {
        toast.error(result.message, {
          duration: 5000,
          position: 'top-right',
          style: {
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '1rem',
            fontSize: '0.875rem',
          },
        });
      }
    } catch (error) {
      toast.error('Une erreur inattendue est survenue', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '1rem',
          fontSize: '0.875rem',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <footer className={`bg-gray-900 dark:bg-black text-white transition-colors ${className || ''}`.trim()}>
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 pb-24 md:pb-28 lg:pb-12 ">
        {/* PWA Install Button - Always visible */}
        <div className="mb-6 flex justify-center">
          <PWAInstallButton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center sm:text-left">
          {/* Restaurant Info */}
          <div className="space-y-4 flex flex-col items-center sm:items-start">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🍽️</span>
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Le Délice Moderne</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Découvrez notre cuisine
              Savourez l'authenticité,
            </p>
            <div className="flex space-x-4 justify-center sm:justify-start">
              <Link to={`${social_data.facebook}`}>
                <Facebook className="w-5 h-5 text-gray-300 hover:text-orange-400 cursor-pointer transition-colors" />
              </Link>

              <Link to={`${social_data.instagram}`}>
                <Instagram className="w-5 h-5 text-gray-300 hover:text-orange-400 cursor-pointer transition-colors" />
              </Link>

              <Link to={`${social_data.twitter}`}>
                <Twitter className="w-5 h-5 text-gray-300 hover:text-orange-400 cursor-pointer transition-colors" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4 flex flex-col items-center sm:items-start">
            <h4 className="text-lg font-semibold text-orange-400">Navigation</h4>
            <div className="space-y-2 flex flex-col items-center sm:items-start">
              <Link to="/" className="block text-gray-300 hover:text-orange-400 transition-colors">
                Accueil
              </Link>
              <Link to="/menu" className="block text-gray-300 hover:text-orange-400 transition-colors">
                Menu
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-orange-400 transition-colors">
                À Propos
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-orange-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 flex flex-col items-center sm:items-start">
            <h4 className="text-lg font-semibold text-orange-400">Contact</h4>
            <div className="space-y-3 flex flex-col items-center sm:items-start">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300 text-sm">
                  {contact_data.location}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300 text-sm">
                  {contact_data.phone}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300 text-sm">
                  {contact_data.email}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300 text-sm">
                  {contact_data.open_hours}
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter & Admin */}
          <div className="space-y-4 flex flex-col items-center sm:items-start w-full">
            <h4 className="text-lg font-semibold text-orange-400">Newsletter</h4>
            <p className="text-gray-300 text-sm text-center sm:text-left">
              Restez informé de nos nouveautés et offres spéciales
            </p>
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-2">
              <div className="flex flex-col space-y-1 lg:space-y-2 items-center">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    className={`w-fit max-w-xs lg:max-w-lg lg:w-full px-20 md:px-0  ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={isLoading}
                  />
                  {emailError && (
                    <p className="mt-1 text-xs text-red-500 text-left">{emailError}</p>
                  )}
                </div>
               
                <Button 
                  type="submit" 
                  className="bg-orange-500 hover:bg-orange-600 transition-colors w-fit lg:w-full px-20 lg:px-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "S'abonner"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Le Délice Moderne. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <p className="text-gray-400 text-sm">
              Designed and Developed by{' '}
              <Link
                to="/about-startup"
                className="text-orange-400 hover:underline font-medium"
              >
                NewTech
              </Link>
            </p>

            <Link to="/admin/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500  text-xs p-1"
                title="Administration"
              >
                <Settings className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
