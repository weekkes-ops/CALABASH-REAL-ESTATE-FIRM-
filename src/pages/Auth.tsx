import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? false : true;
  const [isLogin, setIsLogin] = useState(initialMode);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') setIsLogin(false);
    if (mode === 'login') setIsLogin(true);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Authentication failed');

      if (isLogin) {
        login(data.token, data.user);
      } else {
        signup(data.token, data.user);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 bg-white">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row bg-white rounded-[60px] shadow-2xl overflow-hidden border border-gray-50">
        {/* Left Side - Visual */}
        <div className="lg:w-1/2 bg-primary p-16 md:p-24 text-white relative overflow-hidden hidden lg:flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/4"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-primary mb-12 shadow-xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-5xl font-serif mb-8 leading-tight">Welcome to the <br /><span className="italic text-secondary">Calabash Circle.</span></h2>
            <p className="text-white/50 text-lg leading-relaxed max-w-md">
              Join Sierra Leone's most exclusive real estate community. Access off-market listings, personalized alerts, and expert advisory.
            </p>
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Global Standards, Local Expertise</span>
            </div>
            <div className="pt-8 border-t border-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Trusted by 1000+ Investors</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-1/2 p-12 md:p-24">
          <div className="max-w-md mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl font-serif text-primary mb-4">{isLogin ? 'Sign In' : 'Create Account'}</h1>
              <p className="text-gray-400 text-sm">
                {isLogin ? "Welcome back. Please enter your details." : "Join us to start listing and searching for properties."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
                      <input 
                        type="text" 
                        required={!isLogin}
                        className="w-full bg-gray-50 border-none pl-16 pr-8 py-5 rounded-2xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
                  <input 
                    type="email" 
                    required
                    className="w-full bg-gray-50 border-none pl-16 pr-8 py-5 rounded-2xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
                  <input 
                    type="password" 
                    required
                    className="w-full bg-gray-50 border-none pl-16 pr-8 py-5 rounded-2xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 text-red-500 text-xs font-bold rounded-xl border border-red-100"
                >
                  {error}
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-6 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center group active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                {!loading && <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />}
              </button>
            </form>

            <div className="mt-12 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
              >
                {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
