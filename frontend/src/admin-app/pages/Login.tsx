import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/admin-app/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import logo from "@/assets/mysqfit.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegister) {
      if (password !== confirmPassword) {
        return;
      }
      const success = await register(email, password);
      if (success) {
        navigate('/admin/dashboard');
      }
    } else {
      const success = await login(email, password);
      if (success) {
        navigate('/admin/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <img src={logo} alt="MySqrfit Logo" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-2">MySqrfit</h1>
          <p className="text-muted-foreground">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || (isRegister && password !== confirmPassword)}
          >
            {isLoading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Register' : 'Login')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="ml-2 font-semibold text-primary hover:underline"
              disabled={isLoading}
            >
              {isRegister ? 'Login' : 'Register'}
            </button>
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Restricted to administrators only
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
