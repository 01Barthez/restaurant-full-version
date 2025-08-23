
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  LogOut, Plus, Edit, Trash2, TrendingUp, Users, ShoppingCart, 
  Package, BarChart3, Settings, Calendar, Filter, Search,
  Star, Clock, Euro, Eye, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import useStore from '@/store/useStore';
import { contact_data } from '@/constants/global';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { orders, users, menuItems, categories, offers, updateOrderStatus } = useStore();
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [orderFilter, setOrderFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate statistics
  const todayOrders = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const totalRevenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      const today = new Date();
      const orderDate = new Date(order.createdAt);
      matchesDate = orderDate.toDateString() === today.toDateString();
    }
    
    return matchesFilter && matchesSearch && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'delivered': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Acceptée';
      case 'preparing': return 'En préparation';
      case 'ready': return 'Prête';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Administration</h1>
            <p className="text-gray-600 dark:text-gray-400">Gestion du restaurant Le Délice Moderne</p>
          </div>
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Commandes aujourd'hui</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{todayOrders.length}</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="mt-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +12% par rapport à hier
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Revenus totaux</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalRevenue.toFixed(0)}€</p>
                    </div>
                    <Euro className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="mt-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +8% par rapport à hier
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Clients actifs</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="mt-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +15% par rapport à hier
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Commandes en attente</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingOrders.length}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Commandes récentes nécessitant une action</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...pendingOrders, ...preparingOrders].slice(0, 5).map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{order.customerName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">#{order.id.slice(-6)} - {order.total.toFixed(2)}€</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString('fr-FR')}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                        {order.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(order.id, 'accepted')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accepter
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(order.id, 'ready')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            Prêt
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={orderFilter} onValueChange={setOrderFilter}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="accepted">Acceptées</SelectItem>
                      <SelectItem value="preparing">En préparation</SelectItem>
                      <SelectItem value="ready">Prêtes</SelectItem>
                      <SelectItem value="delivered">Livrées</SelectItem>
                      <SelectItem value="cancelled">Annulées</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Aujourd'hui</SelectItem>
                      <SelectItem value="week">Cette semaine</SelectItem>
                      <SelectItem value="month">Ce mois</SelectItem>
                      <SelectItem value="all">Toutes</SelectItem>
                    </SelectContent>
                  </Select>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Nouvelle commande
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Créer une nouvelle commande</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="customer-name">Nom du client</Label>
                            <Input id="customer-name" placeholder="Nom complet" />
                          </div>
                          <div>
                            <Label htmlFor="customer-phone">Téléphone (optionnel)</Label>
                            <Input id="customer-phone" placeholder="+33 1 23 45 67 89" />
                          </div>
                          <div>
                            <Label htmlFor="customer-email">Email (optionnel)</Label>
                            <Input id="customer-email" type="email" placeholder="email@example.com" />
                          </div>
                        </div>
                        <div>
                          <Label>Articles</Label>
                          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Sélectionnez les articles du menu...</p>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="special-requests">Demandes spéciales</Label>
                          <Textarea id="special-requests" placeholder="Demandes particulières du client..." />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline">Annuler</Button>
                          <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                            Créer la commande
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{order.customerName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Commande #{order.id.slice(-6)} - {new Date(order.createdAt).toLocaleString('fr-FR')}
                        </p>
                        <p className="text-sm text-gray-500">{order.customerPhone && `Tél: ${order.customerPhone}`}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>{(item.price * item.quantity).toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {order.specialRequests && (
                      <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm"><strong>Demandes spéciales:</strong> {order.specialRequests}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="font-bold text-lg text-orange-500">
                        Total: {order.total.toFixed(2)}€
                      </span>
                      <div className="space-x-2">
                        {order.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleStatusUpdate(order.id, 'accepted')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accepter
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Refuser
                            </Button>
                          </>
                        )}
                        {order.status === 'accepted' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(order.id, 'preparing')}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            En préparation
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(order.id, 'ready')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Prêt
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(order.id, 'delivered')}
                            className="bg-gray-600 hover:bg-gray-700"
                          >
                            Livré
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gestion du Menu</h2>
              <div className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvelle catégorie
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter une catégorie</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cat-name">Nom de la catégorie</Label>
                        <Input id="cat-name" placeholder="Ex: Entrées, Plats, Desserts..." />
                      </div>
                      <div>
                        <Label htmlFor="cat-desc">Description</Label>
                        <Textarea id="cat-desc" placeholder="Description de la catégorie..." />
                      </div>
                      <div>
                        <Label htmlFor="cat-image">URL de l'image</Label>
                        <Input id="cat-image" placeholder="https://..." />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Annuler</Button>
                        <Button>Ajouter</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouveau plat
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Ajouter un plat</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dish-name">Nom du plat</Label>
                          <Input id="dish-name" placeholder="Nom du plat" />
                        </div>
                        <div>
                          <Label htmlFor="dish-price">Prix (€)</Label>
                          <Input id="dish-price" type="number" step="0.01" placeholder="0.00" />
                        </div>
                        <div>
                          <Label htmlFor="dish-category">Catégorie</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="entrees">Entrées</SelectItem>
                              <SelectItem value="plats">Plats</SelectItem>
                              <SelectItem value="desserts">Desserts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="prep-time">Temps de préparation (min)</Label>
                          <Input id="prep-time" type="number" placeholder="15" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="dish-desc">Description</Label>
                        <Textarea id="dish-desc" placeholder="Description détaillée du plat..." />
                      </div>
                      <div>
                        <Label htmlFor="dish-ingredients">Ingrédients (séparés par des virgules)</Label>
                        <Textarea id="dish-ingredients" placeholder="tomate, mozzarella, basilic, huile d'olive..." />
                      </div>
                      <div>
                        <Label htmlFor="dish-images">URLs des images (une par ligne)</Label>
                        <Textarea id="dish-images" placeholder="https://image1.jpg&#10;https://image2.jpg" />
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span>Plat vedette</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span>Disponible</span>
                        </label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Annuler</Button>
                        <Button>Ajouter le plat</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Menu Items Grid - using mock data since menuItems might be empty */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: '1', name: 'Burger Gourmet', price: 15.90, category: 'Plats', featured: true, available: true },
                { id: '2', name: 'Salade César', price: 12.50, category: 'Entrées', featured: false, available: true },
                { id: '3', name: 'Tiramisu', price: 7.90, category: 'Desserts', featured: true, available: false }
              ].map((item) => (
                <Card key={item.id} className="relative">
                  <CardContent className="p-4">
                    {item.featured && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Vedette
                      </Badge>
                    )}
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-orange-500">{item.price}€</span>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge className={item.available ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>
                        {item.available ? 'Disponible' : 'Indisponible'}
                      </Badge>
                      <div className="space-x-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gestion des utilisateurs</h2>
              <div className="flex space-x-2">
                <Input placeholder="Rechercher un utilisateur..." className="w-64" />
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="recent">Récents</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4">Utilisateur</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Commandes</th>
                        <th className="p-4">Points fidélité</th>
                        <th className="p-4">Inscription</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 10).map((user) => {
                        const userOrderCount = orders.filter(order => order.userId === user.id).length;
                        const userTotalSpent = orders
                          .filter(order => order.userId === user.id && order.status === 'delivered')
                          .reduce((sum, order) => sum + order.total, 0);
                        
                        return (
                          <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-4">
                              <div>
                                <div className="font-semibold">{user.name}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">ID: {user.id.slice(-6)}</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                {user.email && <div>{user.email}</div>}
                                {user.phone && <div>{user.phone}</div>}
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <div className="font-semibold">{userOrderCount} commandes</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{userTotalSpent.toFixed(2)}€ dépensés</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                {user.loyaltyPoints} points
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                              {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-1">
                                <Button size="sm" variant="ghost">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Analytics et Rapports</h2>
              <div className="flex space-x-2">
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="quarter">Ce trimestre</SelectItem>
                    <SelectItem value="year">Cette année</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  Exporter
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Revenus du jour</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">486€</p>
                    </div>
                    <Euro className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Commandes/jour</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Panier moyen</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">20.25€</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Nouveaux clients</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                    </div>
                    <Users className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Plats les plus populaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Burger Gourmet Truffe', orders: 45, percentage: 90 },
                      { name: 'Saumon Grillé Teriyaki', orders: 38, percentage: 76 },
                      { name: 'Pasta Carbonara', orders: 32, percentage: 64 },
                      { name: 'Tiramisu Maison', orders: 28, percentage: 56 }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.orders} commandes</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-10">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenus hebdomadaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => {
                      const revenue = Math.floor(Math.random() * 200 + 300);
                      const percentage = (revenue / 500) * 100;
                      return (
                        <div key={day} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{day}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12">{revenue}€</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du restaurant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="restaurant-name">Nom du restaurant</Label>
                    <Input id="restaurant-name" defaultValue="Le Délice Moderne" />
                  </div>
                  <div>
                    <Label htmlFor="restaurant-address">Adresse</Label>
                    <Textarea id="restaurant-address" defaultValue={`${contact_data.location}`} />
                  </div>
                  <div>
                    <Label htmlFor="restaurant-phone">Téléphone</Label>
                    <Input id="restaurant-phone" defaultValue="+33 1 23 45 67 89" />
                  </div>
                  <div>
                    <Label htmlFor="restaurant-email">Email</Label>
                    <Input id="restaurant-email" defaultValue="contact@delicemoderne.fr" />
                  </div>
                  <Button>Sauvegarder</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horaires d'ouverture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="w-20">{day}</span>
                      <div className="flex items-center space-x-2">
                        <Input className="w-20" defaultValue="11:00" />
                        <span>-</span>
                        <Input className="w-20" defaultValue="23:00" />
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Ouvert</span>
                      </div>
                    </div>
                  ))}
                  <Button>Sauvegarder</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
