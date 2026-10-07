import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface AuthViewProps {
  onLogin: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('demo@nexus.com');
  const [password, setPassword] = useState('password');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900/90"></div>
        
        <div className="relative z-10 max-w-lg text-white">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/20">
            <span className="text-white text-3xl font-bold">N</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Nexus SaaS Platform</h1>
          <p className="text-slate-300 text-xl leading-relaxed mb-8">
            Manage tenants, analyze churn, and get AI-powered business insights in one unified dashboard.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-200">
              <div className="p-2 bg-slate-800 rounded-lg text-indigo-400"><CheckCircle2 size={20} /></div>
              <span className="font-medium">Multi-tenant Architecture</span>
            </div>
            <div className="flex items-center gap-4 text-slate-200">
              <div className="p-2 bg-slate-800 rounded-lg text-indigo-400"><CheckCircle2 size={20} /></div>
              <span className="font-medium">Gemini 2.5 Powered Insights</span>
            </div>
            <div className="flex items-center gap-4 text-slate-200">
              <div className="p-2 bg-slate-800 rounded-lg text-indigo-400"><CheckCircle2 size={20} /></div>
              <span className="font-medium">Real-time Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 animate-in fade-in slide-in-from-right-8 duration-700">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-slate-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/20 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2" size={20} />
                </>
              )}
            </button>
          </form>
          
          <div className="relative">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
             <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">Or continue with</span></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <button className="flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" /> Google
             </button>
             <button className="flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/448234/github.svg" alt="GitHub" /> GitHub
             </button>
          </div>

          <p className="text-center text-sm text-slate-500">
            Don't have an account? <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Start a 14-day free trial</a>
          </p>
        </div>
      </div>
    </div>
  );
};