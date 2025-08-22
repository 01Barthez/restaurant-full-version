
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple demo authentication
    if (username === 'admin' && password === 'admin123') {
      onLogin(true);
    } else {
      setError('Identifiants incorrects');
      onLogin(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 text-restaurant-orange hover:bg-restaurant-orange/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Button>

        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">🔐</div>
            <CardTitle className="text-2xl text-restaurant-dark">
              Administration
            </CardTitle>
            <p className="text-gray-600">
              Connectez-vous pour accéder au panneau d'administration
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-restaurant-gradient hover:opacity-90 text-white"
              >
                Se connecter
              </Button>
            </form>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
              <strong>Demo:</strong> Utilisez "admin" / "admin123"
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
