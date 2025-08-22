
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, ShoppingCart, UserPlus, Search, X } from 'lucide-react';
import useStore from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';

const ManualOrderEntry: React.FC = () => {
  const { menuItems, addOrder, users, offers } = useStore();
  const { toast } = useToast();
  
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    isExistingUser: false,
    userId: ''
  });
  const [specialRequests, setSpecialRequests] = useState('');

  const addItem = (menuItem: any) => {
    const existingItem = orderItems.find(item => item.id === menuItem.id);
    if (existingItem) {
      setOrderItems(items => 
        items.map(item => 
          item.id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems(items => [...items, { ...menuItem, quantity: 1 }]);
    }
  };

  const addOffer = (offer: any) => {
    const offerItem = {
      id: `offer-${offer.id}`,
      name: offer.title,
      price: offer.discountPrice,
      quantity: 1,
      image: offer.image,
      isOffer: true,
      originalPrice: offer.originalPrice,
      discount: offer.discount
    };
    
    const existingOffer = orderItems.find(item => item.id === offerItem.id);
    if (existingOffer) {
      setOrderItems(items => 
        items.map(item => 
          item.id === offerItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems(items => [...items, offerItem]);
    }
  };

  const removeItem = (itemId: string) => {
    setOrderItems(items => items.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }
    setOrderItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateSavings = () => {
    return orderItems.reduce((savings, item) => {
      if (item.isOffer && item.originalPrice) {
        return savings + ((item.originalPrice - item.price) * item.quantity);
      }
      return savings;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (orderItems.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins un article à la commande.",
        variant: "destructive"
      });
      return;
    }

    if (!customerInfo.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du client est requis.",
        variant: "destructive"
      });
      return;
    }

    const orderId = addOrder({
      userId: customerInfo.userId || 'admin-manual-entry',
      items: orderItems,
      total: calculateTotal(),
      status: 'accepted' as const,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerEmail: customerInfo.email,
      specialRequests
    });

    toast({
      title: "Commande créée avec succès",
      description: `Commande #${orderId.slice(-6)} créée et acceptée.`,
    });

    // Reset form
    setOrderItems([]);
    setCustomerInfo({
      name: '',
      phone: '',
      email: '',
      isExistingUser: false,
      userId: ''
    });
    setSpecialRequests('');
    setSearchTerm('');
  };

  const categories = [...new Set(menuItems.map(item => item.category))];
  
  // Filter menu items based on search and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const isAvailable = item.available;
    return matchesSearch && matchesCategory && isAvailable;
  });

  // Filter available offers
  const availableOffers = offers.filter(offer => offer.available);

  const totalSavings = calculateSavings();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ShoppingCart className="w-6 h-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Saisie Manuelle de Commande
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Menu Items and Offers Selection */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher des articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Special Offers */}
            {availableOffers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-orange-500">Offres Spéciales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {availableOffers.map(offer => (
                      <div key={offer.id} className="border rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-orange-700 dark:text-orange-300">{offer.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {offer.description}
                            </p>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-gray-400 line-through text-sm">
                                {offer.originalPrice.toFixed(2)}€
                              </span>
                              <span className="font-bold text-orange-600">
                                {offer.discountPrice.toFixed(2)}€
                              </span>
                              <Badge variant="secondary">
                                {offer.discount}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => addOffer(offer)}
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Ajouter l'offre
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Menu Items */}
            <Card>
              <CardHeader>
                <CardTitle>Articles du Menu ({filteredMenuItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categories.map(category => {
                    const categoryItems = filteredMenuItems.filter(item => item.category === category);
                    
                    if (categoryItems.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <h3 className="font-semibold text-lg mb-3 text-orange-500">
                          {category}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {categoryItems.map(item => (
                            <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-medium">{item.name}</h4>
                                    {item.featured && (
                                      <Badge variant="default" className="bg-yellow-500 text-xs">
                                        Vedette
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {item.description}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-orange-500">
                                      {item.price.toFixed(2)}€
                                    </span>
                                    <Button
                                      size="sm"
                                      onClick={() => addItem(item)}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredMenuItems.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>Aucun article trouvé</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order Summary & Customer Info */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="existingUser"
                  checked={customerInfo.isExistingUser}
                  onChange={(e) => setCustomerInfo({
                    ...customerInfo, 
                    isExistingUser: e.target.checked,
                    userId: e.target.checked ? customerInfo.userId : ''
                  })}
                />
                <Label htmlFor="existingUser">Client existant</Label>
              </div>

              {customerInfo.isExistingUser ? (
                <div>
                  <Label htmlFor="userId">Sélectionner le client</Label>
                  <Select 
                    value={customerInfo.userId} 
                    onValueChange={(value) => {
                      const user = users.find(u => u.id === value);
                      setCustomerInfo({
                        ...customerInfo,
                        userId: value,
                        name: user?.name || '',
                        phone: user?.phone || '',
                        email: user?.email || ''
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} - {user.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <>
                  <div>
                    <Label htmlFor="customerName">Nom *</Label>
                    <Input
                      id="customerName"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Téléphone</Label>
                    <Input
                      id="customerPhone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé de la Commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Aucun article ajouté
                  </p>
                ) : (
                  <>
                    {orderItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 border rounded">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{item.name}</h4>
                            {item.isOffer && (
                              <Badge variant="secondary" className="text-xs">
                                Offre
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            {item.isOffer && item.originalPrice && (
                              <span className="text-gray-400 line-through">
                                {(item.originalPrice * item.quantity).toFixed(2)}€
                              </span>
                            )}
                            <span className="text-gray-600">
                              {item.price.toFixed(2)}€ × {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t space-y-2">
                      {totalSavings > 0 && (
                        <div className="flex justify-between items-center text-green-600">
                          <span>Économies:</span>
                          <span className="font-bold">
                            -{totalSavings.toFixed(2)}€
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-orange-500">
                          {calculateTotal().toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="specialRequests">Demandes spéciales</Label>
                  <Textarea
                    id="specialRequests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Demandes spéciales..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={orderItems.length === 0 || !customerInfo.name.trim()}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Créer la Commande
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManualOrderEntry;
