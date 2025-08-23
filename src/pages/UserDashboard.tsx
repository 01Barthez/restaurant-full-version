
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, LogOut, ShoppingBag, Activity, Star, Gift } from 'lucide-react';
import UserStats from '@/components/user/UserStats';
import RecentOrders from '@/components/user/RecentOrders';
import ActivityLog from '@/components/user/ActivityLog';
import useStore from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/Layout/Navigation';
import Footer from '@/Layout/footer/Footer';

const UserDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    currentUser, 
    orders, 
    activityLogs, 
    logout, 
    reorderItems,
    clearCart
  } = useStore();

  // Redirect if no user or wrong user
  if (!currentUser || currentUser.id !== id) {
    navigate('/');
    return null;
  }

  const userOrders = orders.filter(order => order.userId === currentUser.id);
  const userLogs = activityLogs.filter(log => log.userId === currentUser.id);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Disconnected",
      description: "You have been successfully logged out.",
    });
  };

  const handleReorder = (order: any) => {
    clearCart();
    reorderItems(order);
    navigate('/menu');
    toast({
      title: "Items Added to Cart",
      description: "Previous order items have been added to your cart.",
    });
  };

  // Calculate user tier based on loyalty points
  const getUserTier = (points: number) => {
    if (points >= 5000) return { name: 'Platine', color: 'bg-purple-600', textColor: 'text-purple-600' };
    if (points >= 1500) return { name: 'Or', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    if (points >= 500) return { name: 'Argent', color: 'bg-gray-400', textColor: 'text-gray-600' };
    return { name: 'Bronze', color: 'bg-amber-600', textColor: 'text-amber-600' };
  };

  const userTier = getUserTier(currentUser.loyaltyPoints);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your orders and account settings
            </p>
            <div className="flex items-center mt-2">
              <Badge className={`${userTier.color} text-white mr-2`}>
                {userTier.name}
              </Badge>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="font-semibold">{currentUser.loyaltyPoints} points</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate('/about-rewards')}
              className="hidden sm:flex"
            >
              <Gift className="w-4 h-4 mr-2" />
              Rewards
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/user/${currentUser.id}/settings`)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Enhanced Loyalty Points Card */}
        <Card className="mb-8 bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">Your Loyalty Status</h3>
                <p className="opacity-90">
                  {userTier.name} Member • {currentUser.loyaltyPoints} points
                </p>
                <p className="text-sm opacity-75 mt-1">
                  {userTier.name === 'Platine' 
                    ? 'Maximum tier reached! Enjoy all benefits.'
                    : `${userTier.name === 'Or' ? 5000 - currentUser.loyaltyPoints : 
                        userTier.name === 'Argent' ? 1500 - currentUser.loyaltyPoints : 
                        500 - currentUser.loyaltyPoints} points to ${
                        userTier.name === 'Or' ? 'Platine' : 
                        userTier.name === 'Argent' ? 'Or' : 'Argent'}`}
                </p>
              </div>
              <div className="text-right">
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-orange-600"
                  onClick={() => navigate('/about-rewards')}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <UserStats user={currentUser} orders={userOrders} />

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Orders ({userOrders.length})
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="w-4 h-4 mr-2" />
              Activity ({userLogs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <RecentOrders 
              orders={userOrders} 
              userId={currentUser.id}
              onReorder={handleReorder}
            />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLog logs={userLogs} />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20"
                onClick={() => navigate('/menu')}
              >
                <div className="text-center">
                  <ShoppingBag className="w-6 h-6 mx-auto mb-2" />
                  <span>Order Again</span>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-20"
                onClick={() => navigate('/gallery')}
              >
                <div className="text-center">
                  <Activity className="w-6 h-6 mx-auto mb-2" />
                  <span>Gallery</span>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-20"
                onClick={() => navigate('/contact')}
              >
                <div className="text-center">
                  <Settings className="w-6 h-6 mx-auto mb-2" />
                  <span>Contact Us</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;
