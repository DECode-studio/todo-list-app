import React from 'react';
import { observer } from 'mobx-react-lite';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { registerPageController } from '../../../controllers/page/RegisterPageController';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = observer(({ onSwitchToLogin }) => {
  const controller = registerPageController;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await controller.handleSubmit();
  };

  return (
    <Card className="glass-card w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold gradient-text">Create Account</CardTitle>
        <CardDescription>
          Join us to start managing your tasks effectively
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {controller.error && (
            <Alert variant="destructive">
              <AlertDescription>{controller.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={controller.formData.name}
              onChange={(e) => controller.updateFormField('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={controller.formData.email}
              onChange={(e) => controller.updateFormField('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={controller.showPassword ? 'text' : 'password'}
                placeholder="Create a password (min. 6 characters)"
                value={controller.formData.password}
                onChange={(e) => controller.updateFormField('password', e.target.value)}
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => controller.togglePasswordVisibility()}
              >
                {controller.showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={controller.showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={controller.formData.confirmPassword}
                onChange={(e) => controller.updateFormField('confirmPassword', e.target.value)}
                required
                className={!controller.passwordsMatch && controller.formData.confirmPassword ? 'border-destructive' : ''}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => controller.toggleConfirmPasswordVisibility()}
              >
                {controller.showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {!controller.passwordsMatch && controller.formData.confirmPassword && (
              <p className="text-sm text-destructive">Passwords do not match</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!controller.isFormValid || controller.isLoading}
          >
            {controller.isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Create Account</span>
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-medium text-primary hover:text-primary/80"
              onClick={() => onSwitchToLogin()}
            >
              Sign in here
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
});