
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { Analytics } from '@/store/types';

interface AnalyticsMetricsProps {
  analytics: Analytics;
}

const AnalyticsMetrics: React.FC<AnalyticsMetricsProps> = ({ analytics }) => {
  const metrics = [
    {
      title: "Revenus du Jour",
      value: `${analytics.dailyRevenue.toFixed(2)}€`,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Revenus de la Semaine",
      value: `${analytics.weeklyRevenue.toFixed(2)}€`,
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Commandes Totales",
      value: analytics.totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-orange-600"
    },
    {
      title: "Utilisateurs Actifs",
      value: analytics.activeUsers.toString(),
      icon: Users,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AnalyticsMetrics;
