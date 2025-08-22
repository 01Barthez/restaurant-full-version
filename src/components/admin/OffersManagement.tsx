
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Gift, Search, X } from 'lucide-react';
import useStore from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';

const OffersManagement: React.FC = () => {
  const { offers, addOffer, updateOffer, deleteOffer, menuItems } = useStore();
  const { toast } = useToast();
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalPrice: 0,
    discountPrice: 0,
    discount: '',
    image: '',
    available: true,
    items: [] as Array<{ menuItemId: string; quantity: number }>
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const discountPercentage = formData.originalPrice > 0 
      ? Math.round(((formData.originalPrice - formData.discountPrice) / formData.originalPrice) * 100)
      : 0;

    const offerData = {
      ...formData,
      discount: `${discountPercentage}%`
    };
    
    if (editingOffer) {
      updateOffer(editingOffer.id, offerData);
      toast({
        title: "Offre modifiée",
        description: "L'offre spéciale a été modifiée avec succès.",
      });
    } else {
      addOffer(offerData);
      toast({
        title: "Offre créée",
        description: "Nouvelle offre spéciale créée avec succès.",
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      originalPrice: 0,
      discountPrice: 0,
      discount: '',
      image: '',
      available: true,
      items: []
    });
    setEditingOffer(null);
  };

  const handleEdit = (offer: any) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      originalPrice: offer.originalPrice,
      discountPrice: offer.discountPrice,
      discount: offer.discount,
      image: offer.image,
      available: offer.available,
      items: offer.items || []
    });
  };

  const handleDelete = (offerId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      deleteOffer(offerId);
      toast({
        title: "Offre supprimée",
        description: "L'offre spéciale a été supprimée avec succès.",
      });
    }
  };

  const addOfferItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { menuItemId: '', quantity: 1 }]
    }));
  };

  const updateOfferItem = (index: number, field: 'menuItemId' | 'quantity', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeOfferItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotalOriginalPrice = () => {
    return formData.items.reduce((total, item) => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      return total + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);
  };

  const discountPercentage = formData.originalPrice > 0 
    ? Math.round(((formData.originalPrice - formData.discountPrice) / formData.originalPrice) * 100)
    : 0;

  // Filter offers based on search
  const filteredOffers = offers.filter(offer => 
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestion des Offres Spéciales
        </h2>
        <Button onClick={resetForm}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Offre
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {editingOffer ? 'Modifier l\'Offre' : 'Créer une Nouvelle Offre'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              {/* Items in Offer */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Articles inclus dans l'offre</Label>
                  <Button type="button" size="sm" onClick={addOfferItem}>
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
                
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2 p-3 border rounded">
                    <div className="flex-1">
                      <Select 
                        value={item.menuItemId} 
                        onValueChange={(value) => updateOfferItem(index, 'menuItemId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un article" />
                        </SelectTrigger>
                        <SelectContent>
                          {menuItems.map((menuItem) => (
                            <SelectItem key={menuItem.id} value={menuItem.id}>
                              {menuItem.name} - {menuItem.price.toFixed(2)}€
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-20">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateOfferItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        placeholder="Qté"
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeOfferItem(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {formData.items.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    Aucun article ajouté à l'offre
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="originalPrice">Prix original (€)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: parseFloat(e.target.value) || 0})}
                    required
                  />
                  {formData.items.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Prix calculé: {calculateTotalOriginalPrice().toFixed(2)}€
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="discountPrice">Prix remisé (€)</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    step="0.01"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({...formData, discountPrice: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
              </div>

              {discountPercentage > 0 && (
                <div className="text-center">
                  <Badge variant="secondary" className="text-lg px-4 py-1">
                    -{discountPercentage}% de réduction
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    Économie de {(formData.originalPrice - formData.discountPrice).toFixed(2)}€
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="image">URL de l'image</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="/placeholder.svg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({...formData, available: checked})}
                />
                <Label htmlFor="available">Disponible</Label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  {editingOffer ? 'Modifier l\'Offre' : 'Créer l\'Offre'}
                </Button>
                {editingOffer && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annuler
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Offers List */}
        <Card>
          <CardHeader>
            <CardTitle>Offres Actuelles ({filteredOffers.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher des offres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredOffers.map((offer) => (
                <div key={offer.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{offer.title}</h4>
                        <Badge variant={offer.available ? "default" : "secondary"}>
                          {offer.available ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {offer.description}
                      </p>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-gray-400 line-through text-sm">
                          {offer.originalPrice.toFixed(2)}€
                        </span>
                        <span className="font-bold text-orange-500">
                          {offer.discountPrice.toFixed(2)}€
                        </span>
                        <Badge variant="outline">
                          -{Math.round(((offer.originalPrice - offer.discountPrice) / offer.originalPrice) * 100)}%
                        </Badge>
                      </div>
                      {offer.items && offer.items.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {offer.items.length} article(s) inclus
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(offer)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(offer.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredOffers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune offre trouvée</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OffersManagement;
