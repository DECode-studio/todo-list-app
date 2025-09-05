import React from 'react';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DashboardPageController } from '@/controllers/page/DashboardPageController';
import { toast } from '@/hooks/use-toast';
import { observer } from 'mobx-react-lite';

interface EditTaskModalProps {
  controller: DashboardPageController
}

export const EditTaskModal: React.FC<EditTaskModalProps> = observer(({
  controller
}) => {
  const isValid = controller.isEditTaskFormValid
  const isSubmitting = controller.isTasksLoading

  const onSubmit = async () => {
    const success = await controller.handleUpdateTask();
    if (success) {
      toast({ title: "Success", description: "Task updated successfully!" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      await onSubmit();
    }
  };

  return (
    <Dialog
      open={controller.isEditModalOpen}
      onOpenChange={() => controller.closeEditTaskModal()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5 text-primary" />
            Edit Task
          </DialogTitle>
          <DialogDescription>
            Update your task details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-task-title">Title *</Label>
            <Input
              id="edit-task-title"
              placeholder="Enter task title..."
              value={controller.editTaskForm.title}
              onChange={(e) => controller.updateEditTaskField('title', e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-task-description">Description</Label>
            <Textarea
              id="edit-task-description"
              placeholder="Enter task description (optional)..."
              value={controller.editTaskForm.description}
              onChange={(e) => controller.updateEditTaskField('description', e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => controller.closeEditTaskModal()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Edit2 className="h-4 w-4" />
                  <span>Save Changes</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});