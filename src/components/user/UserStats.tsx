
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Star, Clock, Euro } from 'lucide-react';
import { UserStatsProps } from '@/types/global';

const UserStats: React.FC<UserStatsProps> = ({ user, orders }) => {
  const totalSpent = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const completedOrders = orders.filter(order => order.status === 'delivered').length;
  const averageOrderValue = completedOrders > 0 ? totalSpent / completedOrders : 0;

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold">{totalSpent.toFixed(2)}€</p>
            </div>
            <Euro className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Loyalty Points</p>
              <p className="text-2xl font-bold">{user.loyaltyPoints}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Order</p>
              <p className="text-2xl font-bold">{averageOrderValue.toFixed(2)}€</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
