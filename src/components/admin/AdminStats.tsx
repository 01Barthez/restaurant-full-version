
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  ShoppingBag, 
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Order, User } from '@/store/types';

interface AdminStatsProps {
  orders: Order[];
  users: User[];
}

const AdminStats: React.FC<AdminStatsProps> = ({ orders, users }) => {
  const totalRevenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const todayOrders = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const pendingOrders = orders.filter(order => order.status === 'pending');

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Orders Today</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {todayOrders.length}
              </p>
            </div>
            <ShoppingBag className="w-8 h-8 text-orange-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            +12% from yesterday
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalRevenue.toFixed(0)}€
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            +8% from yesterday
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {users.length}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            +15% from yesterday
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Orders</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {pendingOrders.length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
