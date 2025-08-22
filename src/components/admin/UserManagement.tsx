
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Search, MessageSquare, Star, Calendar, ShoppingCart } from 'lucide-react';
import useStore from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';

const UserManagement: React.FC = () => {
  const { users, orders, activityLogs, updateUserLoyaltyPoints } = useStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messageText, setMessageText] = useState('');

  const filteredUsers = users
    .filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'points':
          return b.loyaltyPoints - a.loyaltyPoints;
        case 'orders':
          const aOrders = orders.filter(o => o.userId === a.id).length;
          const bOrders = orders.filter(o => o.userId === b.id).length;
          return bOrders - aOrders;
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getUserStats = (userId: string) => {
    const userOrders = orders.filter(order => order.userId === userId);
    const totalSpent = userOrders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.total, 0);
    
    return {
      totalOrders: userOrders.length,
      totalSpent,
      lastOrder: userOrders.length > 0 
        ? new Date(Math.max(...userOrders.map(o => new Date(o.createdAt).getTime())))
        : null
    };
  };

  const getUserActivity = (userId: string) => {
    return activityLogs
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  };

  const handleSendMessage = () => {
    if (selectedUser && messageText.trim()) {
      // In a real app, this would send a notification or email
      toast({
        title: "Message envoyé",
        description: `Message envoyé à ${selectedUser.name}`,
      });
      setMessageText('');
    }
  };

  const handleAdjustPoints = (userId: string, points: number) => {
    updateUserLoyaltyPoints(userId, points);
    toast({
      title: "Points mis à jour",
      description: `${points > 0 ? 'Ajouté' : 'Retiré'} ${Math.abs(points)} points`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h2>
        <Badge variant="outline">
          {users.length} Total Users
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="points">Loyalty Points</SelectItem>
                <SelectItem value="orders">Total Orders</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List & Detail */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredUsers.map((user) => {
                const stats = getUserStats(user.id);
                return (
                  <div 
                    key={user.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === user.id 
                        ? 'ring-2 ring-orange-500 border-orange-200' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-orange-200'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email || user.phone}
                        </p>
                        <p className="text-xs text-gray-500">
                          Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-orange-500">
                        <Star className="w-3 h-3 mr-1" />
                        {user.loyaltyPoints}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{stats.totalOrders} commandes</span>
                      <span>{stats.totalSpent.toFixed(2)}€ dépensés</span>
                    </div>
                  </div>
                );
              })}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No users found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Detail */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedUser ? `Détails - ${selectedUser.name}` : 'Select a User'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <div className="space-y-6">
                {/* User Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-900 dark:text-white">Contact</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email: {selectedUser.email || 'Non renseigné'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Téléphone: {selectedUser.phone}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-900 dark:text-white">Stats</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Points: {selectedUser.loyaltyPoints}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Membre depuis: {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                {/* User Statistics */}
                <div className="grid grid-cols-3 gap-4">
                  {(() => {
                    const stats = getUserStats(selectedUser.id);
                    return (
                      <>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-orange-500">
                            {stats.totalOrders}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Commandes
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-green-500">
                            {stats.totalSpent.toFixed(0)}€
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Dépensé
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-blue-500">
                            {selectedUser.loyaltyPoints}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Points
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Recent Activity */}
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Activité récente
                  </h5>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {getUserActivity(selectedUser.id).map((activity) => (
                      <div key={activity.id} className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="text-gray-700 dark:text-gray-300">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Ajuster les points
                    </h5>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAdjustPoints(selectedUser.id, 10)}
                      >
                        +10
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAdjustPoints(selectedUser.id, 25)}
                      >
                        +25
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAdjustPoints(selectedUser.id, -10)}
                      >
                        -10
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Envoyer un message
                    </h5>
                    <Textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Tapez votre message..."
                      rows={3}
                    />
                    <Button
                      className="mt-2 w-full"
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Envoyer le message
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Sélectionnez un utilisateur pour voir les détails</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
