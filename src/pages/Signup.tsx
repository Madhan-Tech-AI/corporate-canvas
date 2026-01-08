import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Eye, EyeOff, Check } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', company: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); navigate('/'); }, 1500);
  };

  const passwordRequirements = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'One number', met: /[0-9]/.test(formData.password) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container-premium max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-3">Create Account</h1>
            <p className="text-muted-foreground">Join Artéum for exclusive access to premium corporate art</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-foreground mb-2">First Name</label>
                <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} required className="w-full bg-card border border-border rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-copper/50 transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-foreground mb-2">Last Name</label>
                <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} required className="w-full bg-card border border-border rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-copper/50 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Work Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full bg-card border border-border rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-copper/50 transition-colors" placeholder="your@company.com" />
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Company Name</label>
              <input name="company" type="text" value={formData.company} onChange={handleChange} className="w-full bg-card border border-border rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-copper/50 transition-colors" />
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Password</label>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required className="w-full bg-card border border-border rounded-sm px-4 py-3 pr-12 text-foreground focus:outline-none focus:border-copper/50 transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-3 space-y-1">
                {passwordRequirements.map((req) => (
                  <div key={req.label} className="flex items-center gap-2">
                    <Check className={`w-4 h-4 ${req.met ? 'text-copper' : 'text-muted-foreground'}`} />
                    <span className={`text-xs ${req.met ? 'text-foreground' : 'text-muted-foreground'}`}>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input type="checkbox" id="terms" required className="w-4 h-4 mt-0.5 accent-copper" />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the <Link to="/terms" className="text-copper hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-copper hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" disabled={isLoading} className="w-full btn-primary disabled:opacity-50 mt-6">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">Already have an account? <Link to="/login" className="text-copper hover:underline">Sign in</Link></p>
          </div>
        </div>
      </main>
    </div>
  );
}
