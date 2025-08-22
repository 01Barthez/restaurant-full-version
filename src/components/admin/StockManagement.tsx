
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package, Search, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  category: string;
  lastUpdated: Date;
  menuItemIds: string[]; // Which menu items use this ingredient
}

interface StockManagementProps {
  menuItems: any[];
  onUpdateMenuAvailability: (itemId: string, available: boolean) => void;
}

const StockManagement: React.FC<StockManagementProps> = ({
  menuItems,
  onUpdateMenuAvailability
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock stock data - in real app this would come from database
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: '1',
      name: 'Tomates',
      currentStock: 5,
      minStock: 10,
      maxStock: 50,
      unit: 'kg',
      category: 'Légumes',
      lastUpdated: new Date(),
      menuItemIds: ['pizza-margherita', 'salade-tomate']
    },
    {
      id: '2',
      name: 'Mozzarella',
      currentStock: 2,
      minStock: 5,
      maxStock: 20,
      unit: 'kg',
      category: 'Fromage',
      lastUpdated: new Date(),
      menuItemIds: ['pizza-margherita', 'pizza-4-fromages']
    },
    {
      id: '3',
      name: 'Pâtes Fraîches',
      currentStock: 15,
      minStock: 8,
      maxStock: 30,
      unit: 'kg',
      category: 'Féculents',
      lastUpdated: new Date(),
      menuItemIds: ['pasta-carbonara', 'pasta-bolognese']
    }
  ]);

  const categories = [...new Set(stockItems.map(item => item.category))];

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = stockItems.filter(item => item.currentStock <= item.minStock);

  const updateStock = (itemId: string, newStock: number) => {
    setStockItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, currentStock: Math.max(0, newStock), lastUpdated: new Date() }
        : item
    ));

    // Check if any menu items should be disabled
    const item = stockItems.find(s => s.id === itemId);
    if (item && newStock === 0) {
      item.menuItemIds.forEach(menuItemId => {
        onUpdateMenuAvailability(menuItemId, false);
      });
      
      toast({
        title: "Stock épuisé",
        description: `${item.name} est en rupture. Les plats associés ont été désactivés.`,
        variant: "destructive"
      });
    }
  };

  const getStockStatus = (item: StockItem) => {
    if (item.currentStock === 0) return { status: 'out', color: 'bg-red-500', text: 'Rupture' };
    if (item.currentStock <= item.minStock) return { status: 'low', color: 'bg-orange-500', text: 'Faible' };
    return { status: 'ok', color: 'bg-green-500', text: 'OK' };
  };

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Alertes Stock ({lowStockItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-orange-600">
                    {item.currentStock} {item.unit} restant(s)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher un ingrédient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="all">Toutes catégories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Stock List */}
      <div className="grid gap-4">
        {filteredItems.map((item) => {
          const status = getStockStatus(item);
          
          return (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Package className="w-8 h-8 text-gray-400" />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </div>
                    <Badge className={`${status.color} text-white`}>
                      {status.text}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {item.currentStock}
                      </div>
                      <div className="text-xs text-gray-500">{item.unit}</div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(item.id, item.currentStock - 1)}
                        disabled={item.currentStock === 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(item.id, item.currentStock + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-right text-sm text-gray-500">
                      <div>Min: {item.minStock} {item.unit}</div>
                      <div>Max: {item.maxStock} {item.unit}</div>
                    </div>
                  </div>
                </div>

                {/* Affected Menu Items */}
                {item.menuItemIds.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Plats affectés: </span>
                      {item.menuItemIds.map((menuItemId, index) => {
                        const menuItem = menuItems.find(m => m.id === menuItemId);
                        return (
                          <span key={menuItemId}>
                            {menuItem?.name || menuItemId}
                            {index < item.menuItemIds.length - 1 ? ', ' : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StockManagement;
