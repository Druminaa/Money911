import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { PlayCircle, Star, Globe, Share, Mail, Landmark, ArrowRight, BarChart3, Flag, LayoutDashboard } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface font-body antialiased overflow-x-hidden">
      {/* TopNavBar */}
      <header className="bg-white/70 backdrop-blur-xl fixed top-0 left-0 right-0 z-40 shadow-sm flex justify-between items-center px-6 py-3 w-full">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Landmark className="text-primary w-6 h-6" />
            <span className="text-xl font-bold tracking-tight text-primary font-headline">Financial Atelier</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <a className="text-primary font-semibold font-headline text-sm hover:bg-surface-container transition-colors px-3 py-1 rounded-lg" href="#">Home</a>
            <a className="text-on-surface-variant font-headline text-sm hover:bg-surface-container transition-colors px-3 py-1 rounded-lg" href="#">Product</a>
            <a className="text-on-surface-variant font-headline text-sm hover:bg-surface-container transition-colors px-3 py-1 rounded-lg" href="#">Pricing</a>
            <a className="text-on-surface-variant font-headline text-sm hover:bg-surface-container transition-colors px-3 py-1 rounded-lg" href="#">Resources</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/auth')}
            className="px-6 py-2 bg-primary text-on-primary rounded-full font-bold text-sm hover:scale-105 transition-transform active:scale-95"
          >
            Sign In
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[80%] bg-primary-container/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[70%] bg-secondary-container/20 rounded-full blur-[120px]"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <span className="inline-block px-4 py-1.5 bg-primary-container text-on-primary-container rounded-full text-xs font-semibold tracking-wider mb-6 font-headline uppercase">Personal Finance Redefined</span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-headline font-extrabold text-on-surface leading-[1.1] tracking-tight mb-8">
                The art of <br/><span className="text-primary italic">managing</span> wealth.
              </h1>
              <p className="text-xl text-on-surface-variant mb-10 leading-relaxed max-w-lg">
                Transform your financial data into a curated gallery of your life's progress. Sophisticated tools, ethereal design, and total control.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/auth')}
                  className="px-8 py-4 bg-primary text-on-primary rounded-full font-semibold text-lg shadow-lg hover:scale-[1.02] transition-transform active:scale-95 duration-200"
                >
                  Start Your Atelier
                </button>
                <button className="px-8 py-4 bg-surface-container-lowest text-primary rounded-full font-semibold text-lg shadow-sm hover:bg-surface-container transition-colors active:scale-95 duration-200 flex items-center gap-2">
                  <PlayCircle className="w-6 h-6" />
                  Watch Video
                </button>
              </div>
              
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <img 
                      key={i}
                      alt="User" 
                      className="w-10 h-10 rounded-full border-2 border-surface" 
                      src={`https://i.pravatar.cc/150?u=${i}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-on-surface-variant">Trusted by <span className="font-bold text-on-surface">15,000+</span> luxury investors.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-panel p-4 rounded-2xl shadow-2xl relative z-10 border border-white/20">
                <img 
                  alt="Dashboard Preview" 
                  className="rounded-xl shadow-inner"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA5puQo-HFAhu_HCywRhAsV4UFVEGUq5z0MCOVhCfmqqJG_istGxStsmsewdE4F-lmZn1s_9YD95HRUNPEoKaEDqcmaGeVN2yU7ZkU1wOgZEPbcDmHsMkoRt4JcUal63vQprRDYRsMx6hJvOo5cYP3YY88FwcDhVfGdrvGs_7-Y4aI27B1elu1fB9ORZulggVlp2wdIk54wbCPYddXrNm7s9XBIZaLirdvDSw1IdLsI0-DZK5a2pHA6AI5v2R-eAnvGcNx6TFvCA"
                />
              </div>
              
              {/* Decorative Floating Element */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 glass-panel p-6 rounded-2xl shadow-xl z-20 hidden md:block"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-secondary">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-headline font-bold">Total Savings</p>
                    <p className="text-lg font-bold text-on-surface font-headline">$142,500.00</p>
                  </div>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-3/4 rounded-full"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="py-24 bg-surface-container-low">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-headline font-bold mb-4">Curated Intelligence</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">Every feature is designed to provide maximum clarity with minimal effort. Precision meets beauty in your financial journey.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                <div className="max-w-md">
                  <div className="w-12 h-12 bg-primary-container text-primary rounded-xl flex items-center justify-center mb-6">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-3">Ethereal Analytics</h3>
                  <p className="text-on-surface-variant leading-relaxed">Visualize your spending patterns through high-fidelity charts that reveal the stories behind your numbers. No more spreadsheets, just insight.</p>
                </div>
                <div className="mt-8 overflow-hidden rounded-xl bg-surface">
                  <img 
                    alt="Analytics View" 
                    className="w-full h-48 object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2gfyBsZD-KgWiLxEInS32xGKiNsFQeWOtU53MvbfDSdlIyl22QmlLBLLf9cONlPI_Owoj6gHKAxNWQHVCdEdie7Oghc2djia15dESFFlMSm-1CazQs6jcw9xxp48RDsCHjT2aXVZK7p4DDvykLbeLq5RtXaULt1e8yA7Ntllg8FfoJSMqjPgmKzpz5osbYnEgLnRGRtdrtCXzKN7WOwV1wyROw6Kg7bSvND8h1OiiWwNwFY4a_47VmWelvf_DDrxHT3WoIyrAQw"
                  />
                </div>
              </div>

              <div className="md:col-span-4 bg-primary text-on-primary p-8 rounded-2xl flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <Landmark className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-headline font-bold mb-3">Biometric Vault</h3>
                <p className="opacity-80">Bank-grade security with seamless biometric authentication. Your data is encrypted and accessible only to you.</p>
              </div>

              <div className="md:col-span-4 bg-secondary-container p-8 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-secondary text-on-secondary rounded-xl flex items-center justify-center mb-6">
                    <Flag className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-on-secondary-container mb-3">Ambition Tracking</h3>
                  <p className="text-on-secondary-container/70">Define your future. Whether it's a coastal villa or retirement, we help you map the path to your goals.</p>
                </div>
              </div>

              <div className="md:col-span-8 bg-tertiary-container/20 p-8 rounded-2xl flex items-center gap-8 hover:bg-tertiary-container/30 transition-colors">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-tertiary text-on-tertiary rounded-xl flex items-center justify-center mb-6">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-3">The Command Center</h3>
                  <p className="text-on-surface-variant">A bird's-eye view of your entire financial ecosystem. Unified, organized, and effortlessly elegant.</p>
                </div>
                <div className="hidden lg:block w-1/3">
                  <div className="aspect-square bg-white rounded-2xl shadow-sm border border-tertiary/10 p-4 flex flex-col justify-between">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-surface-container rounded"></div>
                      <div className="h-2 w-2/3 bg-surface-container rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="bg-on-surface text-surface rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-headline font-bold mb-8">Ready to curate your financial life?</h2>
                <p className="text-surface/70 text-xl max-w-2xl mx-auto mb-10">Join the elite circle of individuals who treat their finances with the respect they deserve.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                    onClick={() => navigate('/auth')}
                    className="px-10 py-4 bg-primary text-on-primary rounded-full font-bold text-lg hover:scale-105 transition-transform active:scale-95 duration-200"
                  >
                    Create Account
                  </button>
                  <button className="px-10 py-4 border border-surface/30 text-surface rounded-full font-bold text-lg hover:bg-white/10 transition-colors active:scale-95 duration-200">
                    Contact Private Desk
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-high pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
            <div className="col-span-2">
              <span className="text-2xl font-bold tracking-tight text-primary font-headline mb-6 block">Financial Atelier</span>
              <p className="text-on-surface-variant leading-relaxed max-w-xs">The premium financial management platform for the modern era. Elegance in every transaction.</p>
              <div className="flex gap-4 mt-8">
                <a className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-on-surface hover:text-primary transition-colors" href="#"><Mail className="w-4 h-4" /></a>
                <a className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-on-surface hover:text-primary transition-colors" href="#"><Share className="w-4 h-4" /></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-on-surface">Product</h4>
              <ul className="space-y-4 text-on-surface-variant text-sm">
                <li><a className="hover:text-primary transition-colors" href="#">Features</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Analytics</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-on-surface">Company</h4>
              <ul className="space-y-4 text-on-surface-variant text-sm">
                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-on-surface">Resources</h4>
              <ul className="space-y-4 text-on-surface-variant text-sm">
                <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-on-surface">Legal</h4>
              <ul className="space-y-4 text-on-surface-variant text-sm">
                <li><a className="hover:text-primary transition-colors" href="#">Privacy</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-on-surface-variant">© 2024 Financial Atelier. All rights reserved. Member SIPC/FINRA.</p>
            <div className="flex items-center gap-6 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> System Operational</span>
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
