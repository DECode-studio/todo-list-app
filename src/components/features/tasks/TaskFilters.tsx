import React from 'react';
import { CheckCircle, Circle, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskStatus } from '../../../types';

interface TaskFiltersProps {
  currentFilter: TaskStatus;
  onFilterChange: (filter: TaskStatus) => void;
  taskStats: {
    total: number;
    completed: number;
    pending: number;
  };
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentFilter,
  onFilterChange,
  taskStats
}) => {
  const filters = [
    {
      key: TaskStatus.ALL,
      label: 'All Tasks',
      icon: List,
      count: taskStats.total,
      variant: 'default' as const
    },
    {
      key: TaskStatus.PENDING,
      label: 'Pending',
      icon: Circle,
      count: taskStats.pending,
      variant: 'secondary' as const
    },
    {
      key: TaskStatus.COMPLETED,
      label: 'Completed',
      icon: CheckCircle,
      count: taskStats.completed,
      variant: 'default' as const
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = currentFilter === filter.key;
        
        return (
          <Button
            key={filter.key}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(filter.key)}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            <span>{filter.label}</span>
            <Badge
              variant={isActive ? 'secondary' : filter.variant}
              className="ml-1 text-xs"
            >
              {filter.count}
            </Badge>
          </Button>
        );
      })}
    </div>
  );
};