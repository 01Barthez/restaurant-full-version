
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';
import { Order } from '@/store/types';

interface OrderManagementProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ orders, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
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
                    Order #{order.id.slice(-6)} - {new Date(order.createdAt).toLocaleString('en-US')}
                  </p>
                  {order.customerPhone && (
                    <p className="text-sm text-gray-500">Phone: {order.customerPhone}</p>
                  )}
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
                  <p className="text-sm">
                    <strong>Special Requests:</strong> {order.specialRequests}
                  </p>
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
                        onClick={() => onUpdateStatus(order.id, 'accepted')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => onUpdateStatus(order.id, 'cancelled')}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  {order.status === 'accepted' && (
                    <Button 
                      size="sm" 
                      onClick={() => onUpdateStatus(order.id, 'preparing')}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      Start Preparing
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button 
                      size="sm" 
                      onClick={() => onUpdateStatus(order.id, 'ready')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Mark Ready
                    </Button>
                  )}
                  {order.status === 'ready' && (
                    <Button 
                      size="sm" 
                      onClick={() => onUpdateStatus(order.id, 'delivered')}
                      className="bg-gray-600 hover:bg-gray-700"
                    >
                      Mark Delivered
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;
