import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Landmark, TrendingUp, User } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { cn } from '@/src/lib/utils';
import { authAPI } from '@/src/lib/api';
import { useToast } from '@/src/components/ToastProvider';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { success, error } = useToast();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const response = await authAPI.googleAuth(tokenResponse.access_token);
        
        // Store token
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        success('Welcome!', `Logged in as ${response.user.email}`);
        navigate('/dashboard');
      } catch (err: any) {
        error('Google Login Failed', err.message || 'Please try again');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      error('Google Login Failed', 'Could not authenticate with Google');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        
        // Store token
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        success('Welcome Back!', `Logged in as ${response.user.email}`);
        navigate('/dashboard');
      } else {
        // Register
        const response = await authAPI.register({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password
        });
        
        success('Account Created!', 'Please login with your credentials');
        setIsLogin(true);
        setFormData({ ...formData, password: '' });
      }
    } catch (err: any) {
      error(
        isLogin ? 'Login Failed' : 'Registration Failed',
        err.message || 'Please check your credentials and try again'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-primary-container opacity-20 blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-secondary-container opacity-20 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full bg-tertiary-container opacity-10 blur-[100px]"></div>
      </div>

      {/* Main Container */}
      <main className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-outline-variant/15">
        {/* Left: Branding & Visual Narrative */}
        <section className="hidden lg:flex flex-col justify-between p-12 bg-surface-container-low relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12 cursor-pointer" onClick={() => navigate('/')}>
              <Landmark className="text-primary w-8 h-8" />
              <h1 className="font-headline text-xl font-bold tracking-tight text-teal-800">Financial Atelier</h1>
            </div>
            <div className="space-y-6">
              <h2 className="font-headline text-4xl font-extrabold leading-tight text-on-surface">
                The Ethereal <br/>
                <span className="text-primary">Ledger</span> Experience.
              </h2>
              <p className="text-on-surface-variant text-lg max-w-sm leading-relaxed">
                Treat your personal finance not as a chore, but as a curated gallery of your life's journey.
              </p>
            </div>
          </div>

          <div className="mt-auto relative z-10">
            <div className="p-6 rounded-xl bg-surface-container-lowest/60 backdrop-blur-md ring-1 ring-white/20 shadow-sm max-w-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-wider">Net Worth Growth</p>
                  <p className="font-headline text-lg font-bold text-on-surface">+12.4% <span className="text-xs font-normal text-primary">this month</span></p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Abstract Visual */}
          <div className="absolute bottom-0 right-0 w-[80%] h-[80%] -mr-20 -mb-20 pointer-events-none opacity-40">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-container to-secondary-container blur-3xl"></div>
          </div>
        </section>

        {/* Right: Auth Forms */}
        <section className="p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Toggle Tab */}
            <div className="flex p-1 bg-surface-container rounded-full mb-10 w-fit mx-auto lg:mx-0">
              <button 
                onClick={() => setIsLogin(true)}
                className={cn(
                  "px-8 py-2 rounded-full text-sm font-headline font-bold transition-all",
                  isLogin ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={cn(
                  "px-8 py-2 rounded-full text-sm font-headline font-bold transition-all",
                  !isLogin ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                Register
              </button>
            </div>

            {/* Form Header */}
            <div className="mb-10 text-center lg:text-left">
              <h3 className="font-headline text-3xl font-bold text-on-surface mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-on-surface-variant">
                {isLogin ? 'Sign in to manage your curated portfolio.' : 'Join the elite circle of luxury investors.'}
              </p>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-headline font-bold text-on-surface ml-1" htmlFor="full_name">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                    <input 
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-highest/50 border-none rounded-xl focus:ring-2 focus:ring-primary-container text-on-surface placeholder:text-outline transition-all" 
                      id="full_name"
                      name="full_name"
                      placeholder="John Doe" 
                      type="text"
                      value={formData.full_name}
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-headline font-bold text-on-surface ml-1" htmlFor="email">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-highest/50 border-none rounded-xl focus:ring-2 focus:ring-primary-container text-on-surface placeholder:text-outline transition-all" 
                    id="email"
                    name="email"
                    placeholder="your@email.com" 
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-headline font-bold text-on-surface" htmlFor="password">Password</label>
                  {isLogin && <a className="text-xs font-headline font-bold text-primary hover:underline" href="#">Forgot password?</a>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                  <input 
                    className="w-full pl-12 pr-12 py-3.5 bg-surface-container-highest/50 border-none rounded-xl focus:ring-2 focus:ring-primary-container text-on-surface placeholder:text-outline transition-all" 
                    id="password"
                    name="password"
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-1">
                <input className="w-4 h-4 rounded text-primary border-outline focus:ring-primary-container bg-surface-container-lowest" id="remember" type="checkbox"/>
                <label className="text-sm text-on-surface-variant" htmlFor="remember">Keep me signed in</label>
              </div>

              <button 
                className="w-full py-4 bg-primary text-on-primary font-headline font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </span>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant opacity-20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface-container-lowest px-4 text-xs font-headline font-bold text-outline uppercase tracking-widest">or continue with</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => handleGoogleLogin()}
                className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-outline-variant/20 hover:bg-surface-container-low transition-colors group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-5.38z" fill="#EA4335"></path>
                </svg>
                <span className="text-sm font-medium text-on-surface">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-outline-variant/20 hover:bg-surface-container-low transition-colors group">
                <svg className="w-5 h-5 fill-on-surface" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.06.75.79-.02 2.05-.92 3.58-.75 1.7.2 2.96.94 3.65 2.25-3.4 1.83-2.84 6.3.57 7.71-.69 1.85-1.83 3.42-2.86 3.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.51-3.74 4.25z"></path>
                </svg>
                <span className="text-sm font-medium text-on-surface">Apple</span>
              </button>
            </div>

            <p className="mt-12 text-center text-xs text-on-surface-variant leading-relaxed">
              By accessing the Atelier, you agree to our <a className="underline hover:text-primary" href="#">Terms of Service</a> and <a className="underline hover:text-primary" href="#">Privacy Policy</a>. We treat your data as securely as our vault.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
