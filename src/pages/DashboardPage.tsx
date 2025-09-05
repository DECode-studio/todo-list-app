import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Plus, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from '../components/features/tasks/TaskCard';
import { CreateTaskModal } from '../components/features/tasks/CreateTaskModal';
import { EditTaskModal } from '../components/features/tasks/EditTaskModal';
import { TaskFilters } from '../components/features/tasks/TaskFilters';
import { QuoteCard } from '../components/features/quote/QuoteCard';
import { DashboardStats } from '../components/features/dashboard/DashboardStats';
import { dashboardPageController } from '../controllers/page/DashboardPageController';
import { useToast } from '@/hooks/use-toast';

export const DashboardPage: React.FC = observer(() => {
  const controller = dashboardPageController;
  const { toast } = useToast();

  useEffect(() => {
    controller.initialize();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Task Manager</h1>
            <p className="text-muted-foreground">
              Welcome back!
            </p>
          </div>
          <Button variant="outline" onClick={controller.handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <DashboardStats stats={controller.taskStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Your Tasks</h2>
                <TaskFilters
                  currentFilter={controller.currentFilter}
                  onFilterChange={controller.setTaskFilter}
                  taskStats={controller.taskStats}
                />
              </div>
              <Button onClick={() => controller.configCreateTaskModal()}>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>

            <div className="space-y-3">
              {controller.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  controller={controller}
                  task={task}
                />
              ))}
            </div>
          </div>

          <div>
            <QuoteCard
              quote={controller.currentQuote}
              isLoading={controller.isQuoteLoading}
              onRefresh={controller.refreshQuote}
            />
          </div>
        </div>

        {
          controller.isCreateTaskModalOpen && (
            <CreateTaskModal
              controller={controller}
            />
          )
        }

        {
          controller.isEditModalOpen && (
            <EditTaskModal
              controller={controller}
            />
          )
        }
      </div>
    </div>
  );
});

export default DashboardPage;