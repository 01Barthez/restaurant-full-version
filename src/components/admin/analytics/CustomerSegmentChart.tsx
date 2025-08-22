
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface CustomerSegmentChartProps {
  data: {
    new: number;
    regular: number;
    vip: number;
    inactive: number;
  };
}

const CustomerSegmentChart: React.FC<CustomerSegmentChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Nouveaux', count: data.new, fill: '#06D6A0' },
    { name: 'Réguliers', count: data.regular, fill: '#118AB2' },
    { name: 'VIP', count: data.vip, fill: '#FFD23F' },
    { name: 'Inactifs', count: data.inactive, fill: '#EF476F' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Segmentation Clients
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#FF6B35" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CustomerSegmentChart;
