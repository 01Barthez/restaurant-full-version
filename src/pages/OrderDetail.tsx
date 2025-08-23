
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RefreshCw, Phone, Mail, MessageSquare } from 'lucide-react';
import useStore from '@/store/useStore';
import Navigation from '@/Layout/Navigation';
import Footer from '@/Layout/footer/Footer';

const OrderDetail: React.FC = () => {
  const { userId, orderId } = useParams();
  const { currentUser, orders, addOrder } = useStore();

  const order = orders.find(o => o.id === orderId && o.userId === userId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const handleReorder = () => {
    if (!order) return;
    
    const newOrderId = addOrder({
      userId: order.userId,
      items: order.items,
      total: order.total,
      status: 'pending',
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      specialRequests: order.specialRequests
    });
    
    window.location.href = `/user/${userId}/orders/${newOrderId}`;
  };

  if (!currentUser || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Commande non trouvée</h2>
              <p className="text-gray-600 mb-4">Cette commande n'existe pas ou vous n'y avez pas accès.</p>
              <Link to={`/user/${userId}`}>
                <Button>Retour au profil</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to={`/user/${userId}`}>
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au profil
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-restaurant-dark">
              Commande #{order.id.slice(-6)}
            </h1>
            <p className="text-gray-600">
              Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Statut de la commande */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Statut de la commande
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Commande reçue</span>
                    <span className="text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commande acceptée</span>
                    <span className={order.status === 'pending' ? 'text-gray-400' : 'text-green-600'}>
                      {order.status === 'pending' ? '⏳' : '✓'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>En préparation</span>
                    <span className={['pending', 'accepted'].includes(order.status) ? 'text-gray-400' : 'text-green-600'}>
                      {['pending', 'accepted'].includes(order.status) ? '⏳' : '✓'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prête à récupérer</span>
                    <span className={['pending', 'accepted', 'preparing'].includes(order.status) ? 'text-gray-400' : 'text-green-600'}>
                      {['pending', 'accepted', 'preparing'].includes(order.status) ? '⏳' : '✓'}
                    </span>
                  </div>
                </div>
                
                {order.estimatedDelivery && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Estimation:</strong> Prête vers {new Date(order.estimatedDelivery).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Articles commandés */}
            <Card>
              <CardHeader>
                <CardTitle>Articles commandés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                        {item.specialRequests && (
                          <p className="text-sm text-gray-500 italic">{item.specialRequests}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{(item.price * item.quantity).toFixed(2)}€</p>
                        <p className="text-sm text-gray-600">{item.price.toFixed(2)}€ / unité</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-restaurant-orange">{order.total.toFixed(2)}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {order.specialRequests && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Demandes spéciales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{order.specialRequests}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {/* Informations client */}
            <Card>
              <CardHeader>
                <CardTitle>Informations client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <p>{order.customerName}</p>
                </div>
                {order.customerPhone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {order.customerPhone}
                    </p>
                  </div>
                )}
                {order.customerEmail && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {order.customerEmail}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.status === 'delivered' && (
                  <Button 
                    className="w-full bg-restaurant-gradient"
                    onClick={handleReorder}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recommander
                  </Button>
                )}
                
                <Link to="/menu">
                  <Button variant="outline" className="w-full">
                    Voir le menu
                  </Button>
                </Link>
                
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    Contacter le restaurant
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderDetail;
