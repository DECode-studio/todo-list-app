import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { Plus, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from '../components/features/tasks/TaskCard';
import { CreateTaskModal } from '../components/features/tasks/CreateTaskModal';
import { EditTaskModal } from '../components/features/tasks/EditTaskModal';
import { TaskFilters } from '../components/features/tasks/TaskFilters';
import { QuoteCard } from '../components/features/quote/QuoteCard';
import { DashboardStats } from '../components/features/dashboard/DashboardStats';
import { dashboardPageController } from '../controllers/page/DashboardPageController';
import { authController } from '../controllers/data/AuthController';
import { useToast } from '@/hooks/use-toast';

export const DashboardPage: React.FC = observer(() => {
  const controller = dashboardPageController;
  const { toast } = useToast();

  useEffect(() => {
    controller.initialize();
  }, []);

  // Redirect if not logged in
  if (!authController.isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleCreateTask = async () => {
    const success = await controller.handleCreateTask();
    if (success) {
      toast({ title: "Success", description: "Task created successfully!" });
    }
  };

  const handleUpdateTask = async () => {
    const success = await controller.handleUpdateTask();
    if (success) {
      toast({ title: "Success", description: "Task updated successfully!" });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await controller.deleteTask(taskId);
    toast({ title: "Success", description: "Task deleted successfully!" });
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Task Manager</h1>
            <p className="text-muted-foreground">
              Welcome back, {controller.user?.name}!
            </p>
          </div>
          <Button variant="outline" onClick={controller.handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <DashboardStats stats={controller.taskStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Section */}
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
              <Button onClick={controller.openCreateTaskModal}>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>

            <div className="space-y-3">
              {controller.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={controller.toggleTaskStatus}
                  onEdit={controller.openEditTaskModal}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </div>

          {/* Quote Section */}
          <div>
            <QuoteCard
              quote={controller.currentQuote}
              isLoading={controller.isQuoteLoading}
              onRefresh={controller.refreshQuote}
            />
          </div>
        </div>

        {/* Modals */}
        <CreateTaskModal
          isOpen={controller.isCreateTaskModalOpen}
          onOpenChange={controller.closeCreateTaskModal}
          title={controller.newTaskForm.title}
          description={controller.newTaskForm.description}
          onTitleChange={(value) => controller.updateNewTaskField('title', value)}
          onDescriptionChange={(value) => controller.updateNewTaskField('description', value)}
          onSubmit={handleCreateTask}
          isSubmitting={controller.isTasksLoading}
          isValid={controller.isNewTaskFormValid}
        />

        <EditTaskModal
          isOpen={controller.isEditModalOpen}
          onOpenChange={controller.closeEditTaskModal}
          title={controller.editTaskForm.title}
          description={controller.editTaskForm.description}
          onTitleChange={(value) => controller.updateEditTaskField('title', value)}
          onDescriptionChange={(value) => controller.updateEditTaskField('description', value)}
          onSubmit={handleUpdateTask}
          isSubmitting={controller.isTasksLoading}
          isValid={controller.isEditTaskFormValid}
        />
      </div>
    </div>
  );
});

export default DashboardPage;