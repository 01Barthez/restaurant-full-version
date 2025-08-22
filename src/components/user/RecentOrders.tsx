
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, RotateCcw, ShoppingCart } from 'lucide-react';
import { Order } from '@/store/types';
import { useNavigate } from 'react-router-dom';

interface RecentOrdersProps {
  orders: Order[];
  userId: string;
  onReorder: (order: Order) => void;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders, userId, onReorder }) => {
  const navigate = useNavigate();

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

  const recentOrders = orders.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recent Orders</CardTitle>
          <Button
            variant="outline"
            onClick={() => navigate('/menu')}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-none"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Order Again
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">Order #{order.id.slice(-6)}</h4>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR')} - {order.total.toFixed(2)}€
                </p>
                <p className="text-sm text-gray-500">
                  {order.items.length} item(s)
                </p>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/user/${userId}/orders/${order.id}`)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReorder(order)}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
