
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Bell, Shield, Globe, Palette, Save } from 'lucide-react';
import useStore from '@/store/useStore';
import Navigation from '@/Layout/Navigation';
import Footer from '@/Layout/footer/Footer';
import { useToast } from '@/hooks/use-toast';

const UserSettings: React.FC = () => {
  const { id } = useParams();
  const { currentUser, isDarkMode, toggleDarkMode, currentLanguage, setLanguage } = useStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });
  
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
  });

  const handleSave = () => {
    // Ici, on sauvegarderait les modifications
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos modifications ont été enregistrées avec succès.",
    });
  };

  if (!currentUser || currentUser.id !== id) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Accès non autorisé</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Vous devez être connecté pour accéder à cette page.</p>
              <Link to="/">
                <Button>Retour à l'accueil</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to={`/user/${id}`}>
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au profil
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
            <p className="text-gray-600 dark:text-gray-400">Gérez vos préférences et informations personnelles</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom complet"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
                <div>
                  <Label>Points de fidélité</Label>
                  <div className="mt-1 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <span className="text-2xl font-bold text-orange-500">{currentUser.loyaltyPoints}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">points</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Mises à jour des commandes</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recevez des notifications sur l'état de vos commandes</p>
                </div>
                <Switch
                  checked={notifications.orderUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, orderUpdates: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Promotions et offres</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recevez nos offres spéciales et promotions</p>
                </div>
                <Switch
                  checked={notifications.promotions}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Newsletter</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recevez notre newsletter mensuelle</p>
                </div>
                <Switch
                  checked={notifications.newsletter}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newsletter: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Préférences d'affichage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Préférences d'affichage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Mode sombre</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Basculer entre le mode clair et sombre</p>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Langue</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Choisissez votre langue préférée</p>
                </div>
                <div className="flex space-x-2">
                  {[
                    { code: 'fr', name: 'FR', flag: '🇫🇷' },
                    { code: 'en', name: 'EN', flag: '🇺🇸' },
                    { code: 'ar', name: 'AR', flag: '🇸🇦' }
                  ].map((lang) => (
                    <Button
                      key={lang.code}
                      variant={currentLanguage === lang.code ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLanguage(lang.code as 'fr' | 'en' | 'ar')}
                      className="min-w-[60px]"
                    >
                      <span className="mr-1">{lang.flag}</span>
                      {lang.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" placeholder="••••••••" />
              </div>
              <div>
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" placeholder="••••••••" />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" />
              </div>
              <Button variant="outline" size="sm">
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>

          {/* Bouton de sauvegarde */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder les modifications
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserSettings;
