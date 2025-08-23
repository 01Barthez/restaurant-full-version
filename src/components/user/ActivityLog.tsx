
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ShoppingBag, User, LogIn } from 'lucide-react';
import { ActivityLogProps } from '@/types/global';

const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-4 h-4" />;
      case 'profile': return <User className="w-4 h-4" />;
      case 'login': 
      case 'register': return <LogIn className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'profile': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'login': 
      case 'register': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const recentLogs = logs.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentLogs.map((log) => (
            <div key={log.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Badge className={getActivityColor(log.type)}>
                {getActivityIcon(log.type)}
              </Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">{log.action}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{log.description}</p>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleString('fr-FR')}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
