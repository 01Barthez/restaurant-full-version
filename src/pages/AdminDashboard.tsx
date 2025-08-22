
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, BarChart3, Users, ShoppingCart, Menu, Gift, UserPlus, MessageSquare } from 'lucide-react';
import AdminStats from '@/components/admin/AdminStats';
import AdminFilters from '@/components/admin/AdminFilters';
import AdminCharts from '@/components/admin/AdminCharts';
import OrderManagement from '@/components/admin/OrderManagement';
import OffersManagement from '@/components/admin/OffersManagement';
import MenuManagement from '@/components/admin/MenuManagement';
import ManualOrderEntry from '@/components/admin/ManualOrderEntry';
import MessagesManagement from '@/components/admin/MessagesManagement';
import PDFGenerator from '@/components/pdf/PDFGenerator';
import useStore from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { orders, users, updateOrderStatus, contactMessages, calculateDashboardStats } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    period: 'today',
    dateRange: 'last-7-days',
    metric: 'revenue'
  });

  const handleLogout = () => {
    toast({
      title: "Logged Out Successfully",
      description: "You have been logged out from admin panel.",
    });
    navigate('/');
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const generateChartData = () => {
    const today = new Date();
    const days = 7;
    
    return {
      revenue: Array.from({ length: days }, (_, i) => ({
        date: new Date(today.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        amount: Math.floor(Math.random() * 1000) + 500
      })),
      orders: Array.from({ length: days }, (_, i) => ({
        date: new Date(today.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        count: Math.floor(Math.random() * 50) + 10
      })),
      customers: Array.from({ length: days }, (_, i) => ({
        date: new Date(today.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        count: Math.floor(Math.random() * 20) + 5
      })),
      topItems: [
        { name: 'Pizza Margherita', value: 35 },
        { name: 'Burger Classic', value: 25 },
        { name: 'Pasta Carbonara', value: 20 },
        { name: 'Salade César', value: 15 },
        { name: 'Autres', value: 5 }
      ]
    };
  };

  const chartData = generateChartData();
  const analytics = calculateDashboardStats();
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const unreadMessages = contactMessages.filter(msg => !msg.read);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Le Délice Moderne Restaurant Management
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="manual-entry">
              <UserPlus className="w-4 h-4 mr-2" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="menu">
              <Menu className="w-4 h-4 mr-2" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="offers">
              <Gift className="w-4 h-4 mr-2" />
              Offers
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages {unreadMessages.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadMessages.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="flex justify-between items-center">
              <AdminFilters onFilterChange={handleFilterChange} />
              <PDFGenerator 
                data={analytics}
                filename="analytics-report"
                title="Rapport d'Analytics"
              />
            </div>
            <AdminStats orders={orders} users={users} />
            <AdminCharts data={chartData} />

            {/* Recent Orders Requiring Action */}
            <Card>
              <CardHeader>
                <CardTitle>Orders Requiring Action</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...pendingOrders, ...preparingOrders].slice(0, 5).map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{order.customerName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          #{order.id.slice(-6)} - {order.total.toFixed(2)}€
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString('en-US')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {order.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateOrderStatus(order.id, 'accepted')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Accept Order
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Mark Ready
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
          <TabsContent value="orders">
            <OrderManagement 
              orders={orders} 
              onUpdateStatus={updateOrderStatus}
            />
          </TabsContent>

          <TabsContent value="manual-entry">
            <ManualOrderEntry />
          </TabsContent>

          <TabsContent value="menu">
            <MenuManagement />
          </TabsContent>

          <TabsContent value="offers">
            <OffersManagement />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
