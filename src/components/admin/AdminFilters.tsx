
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, BarChart3, TrendingUp, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdminFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

interface FilterOptions {
  period: string;
  dateRange: string;
  metric: string;
}

const AdminFilters: React.FC<AdminFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    period: 'today',
    dateRange: 'last-7-days',
    metric: 'revenue'
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const periods = [
    { value: 'today', label: "Aujourd'hui" },
    { value: 'yesterday', label: 'Hier' },
    { value: 'this-week', label: 'Cette semaine' },
    { value: 'last-week', label: 'Semaine dernière' },
    { value: 'this-month', label: 'Ce mois' },
    { value: 'last-month', label: 'Mois dernier' },
    { value: 'this-year', label: 'Cette année' },
    { value: 'custom', label: 'Personnalisé' }
  ];

  const dateRanges = [
    { value: 'last-7-days', label: '7 derniers jours' },
    { value: 'last-30-days', label: '30 derniers jours' },
    { value: 'last-90-days', label: '90 derniers jours' },
    { value: 'last-6-months', label: '6 derniers mois' },
    { value: 'last-year', label: 'Dernière année' }
  ];

  const metrics = [
    { value: 'revenue', label: 'Chiffre d\'affaires' },
    { value: 'orders', label: 'Commandes' },
    { value: 'customers', label: 'Clients' },
    { value: 'avg-order', label: 'Panier moyen' }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtres Avancés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Période</label>
            <Select value={filters.period} onValueChange={(value) => handleFilterChange('period', value)}>
              <SelectTrigger>
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Plage de dates</label>
            <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
              <SelectTrigger>
                <BarChart3 className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Métrique</label>
            <Select value={filters.metric} onValueChange={(value) => handleFilterChange('metric', value)}>
              <SelectTrigger>
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {metrics.map((metric) => (
                  <SelectItem key={metric.value} value={metric.value}>
                    {metric.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary">
            {periods.find(p => p.value === filters.period)?.label}
          </Badge>
          <Badge variant="secondary">
            {dateRanges.find(r => r.value === filters.dateRange)?.label}
          </Badge>
          <Badge variant="secondary">
            {metrics.find(m => m.value === filters.metric)?.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminFilters;
