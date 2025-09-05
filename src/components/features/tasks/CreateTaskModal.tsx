import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { observer } from 'mobx-react-lite';
import { DashboardPageController } from '@/controllers/page/DashboardPageController';
import { toast } from '@/hooks/use-toast';

interface CreateTaskModalProps {
  controller: DashboardPageController
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = observer(({
  controller,
}) => {

  const handleCreateTask = async () => {
    const success = await controller.handleCreateTask();
    if (success) {
      toast({ title: "Success", description: "Task created successfully!" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (controller.isNewTaskFormValid) {
      await handleCreateTask();
    }
  };

  return (
    <Dialog
      open={controller.isCreateTaskModalOpen}
      onOpenChange={(_) => controller.configCreateTaskModal()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Create New Task
          </DialogTitle>
          <DialogDescription>
            Add a new task to your to-do list
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title *</Label>
            <Input
              id="task-title"
              placeholder="Enter task title..."
              value={controller.newTaskForm.title}
              onChange={(e) => controller.updateNewTaskField('title', e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Enter task description (optional)..."
              value={controller.newTaskForm.description}
              onChange={(e) => controller.updateNewTaskField('description', e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => controller.configCreateTaskModal()}
              disabled={controller.isTasksLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!controller.isNewTaskFormValid || controller.isTasksLoading}
            >
              {controller.isTasksLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Task</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});