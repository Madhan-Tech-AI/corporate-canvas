import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container-premium max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-serif text-cream mb-3">Welcome Back</h1>
            <p className="text-cream-muted">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm text-cream mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-charcoal border border-border rounded-sm px-4 py-3 text-cream placeholder:text-muted-foreground focus:outline-none focus:border-champagne/50 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-cream mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-charcoal border border-border rounded-sm px-4 py-3 pr-12 text-cream placeholder:text-muted-foreground focus:outline-none focus:border-champagne/50 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-cream transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-sm border-border bg-transparent checked:bg-champagne"
                />
                <span className="text-sm text-cream-muted">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-champagne hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-cream-muted">
              Don't have an account?{' '}
              <Link to="/signup" className="text-champagne hover:underline">
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-border">
            <p className="text-caption text-center mb-6">Or continue with</p>
            <div className="grid grid-cols-2 gap-4">
              <button className="btn-secondary text-center text-sm">Google</button>
              <button className="btn-secondary text-center text-sm">LinkedIn</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
