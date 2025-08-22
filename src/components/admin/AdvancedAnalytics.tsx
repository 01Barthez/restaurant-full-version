
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RevenueChart from './analytics/RevenueChart';
import PopularItemsChart from './analytics/PopularItemsChart';
import CustomerSegmentChart from './analytics/CustomerSegmentChart';
import AnalyticsMetrics from './analytics/AnalyticsMetrics';
import { Order, MenuItem, Analytics } from '@/store/types';

interface AdvancedAnalyticsProps {
  orders: Order[];
  menuItems: MenuItem[];
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ orders, menuItems }) => {
  // Calculate analytics data from orders and menu items
  const calculateAnalytics = (): Analytics => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const deliveredOrders = orders.filter(order => order.status === 'delivered');
    
    const dailyRevenue = deliveredOrders
      .filter(order => new Date(order.createdAt) >= oneDayAgo)
      .reduce((sum, order) => sum + order.total, 0);
      
    const weeklyRevenue = deliveredOrders
      .filter(order => new Date(order.createdAt) >= oneWeekAgo)
      .reduce((sum, order) => sum + order.total, 0);
      
    const monthlyRevenue = deliveredOrders
      .filter(order => new Date(order.createdAt) >= oneMonthAgo)
      .reduce((sum, order) => sum + order.total, 0);

    // Calculate popular items
    const itemCounts: { [key: string]: { name: string; count: number } } = {};
    deliveredOrders.forEach(order => {
      order.items.forEach(item => {
        if (itemCounts[item.name]) {
          itemCounts[item.name].count += item.quantity;
        } else {
          itemCounts[item.name] = { name: item.name, count: item.quantity };
        }
      });
    });
    
    const popularItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate customer segments (simplified)
    const customerSegments = {
      new: Math.floor(Math.random() * 20) + 10,
      regular: Math.floor(Math.random() * 50) + 30,
      vip: Math.floor(Math.random() * 15) + 5,
      inactive: Math.floor(Math.random() * 10) + 2
    };

    return {
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
      totalOrders: orders.length,
      activeUsers: Math.floor(Math.random() * 100) + 50, // Mock data
      popularItems,
      customerSegments
    };
  };

  const generateChartData = () => {
    const now = new Date();
    
    // Revenue data for the last 7 days
    const revenueData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString() && order.status === 'delivered';
      });
      const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      
      return {
        name: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        revenue
      };
    });

    return { revenueData };
  };

  const analytics = calculateAnalytics();
  const chartData = generateChartData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Business Intelligence</h2>
      </div>

      <AnalyticsMetrics analytics={analytics} />

      <div className="grid md:grid-cols-2 gap-6">
        <RevenueChart data={chartData.revenueData} />
        <CustomerSegmentChart data={analytics.customerSegments} />
      </div>

      <PopularItemsChart data={analytics.popularItems} />
    </div>
  );
};

export default AdvancedAnalytics;
