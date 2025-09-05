import React from 'react';
import { Check, Edit2, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task, TaskStatus } from '../../../types';
import { formatDistanceToNow } from 'date-fns';
import { DashboardPageController } from '@/controllers/page/DashboardPageController';
import { toast } from '@/hooks/use-toast';

interface TaskCardProps {
  controller: DashboardPageController
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  controller,
  task,
}) => {

  const handleDeleteTask = async (taskId: string) => {
    await controller.deleteTask(taskId);
    toast({ title: "Success", description: "Task deleted successfully!" });
  };

  return (
    <Card className={`task-card ${(task.status == TaskStatus.COMPLETED) ? 'opacity-75' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Button
              variant="ghost"
              size="sm"
              className={`mt-1 h-6 w-6 p-0 rounded-full border-2 ${(task.status == TaskStatus.COMPLETED)
                ? 'bg-success text-success-foreground border-success'
                : 'border-muted-foreground hover:border-primary'
                }`}
              onClick={() => controller.toggleTaskStatus(task)}
            >
              {(task.status == TaskStatus.COMPLETED) && <Check className="h-3 w-3" />}
            </Button>

            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-sm ${(task.status == TaskStatus.COMPLETED) ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}>
                {task.title}
              </h3>

              {task.description && (
                <p className={`text-xs mt-1 ${(task.status == TaskStatus.COMPLETED) ? 'line-through text-muted-foreground' : 'text-muted-foreground'
                  }`}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2">
                <Badge variant={(task.status == TaskStatus.COMPLETED) ? 'secondary' : 'outline'} className="text-xs">
                  {(task.status == TaskStatus.COMPLETED) ? 'Completed' : 'Pending'}
                </Badge>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(task.createdAt, { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
              onClick={() => controller.openEditTaskModal(task.id)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleDeleteTask(task.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};