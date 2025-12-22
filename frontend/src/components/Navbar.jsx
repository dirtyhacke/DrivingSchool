import React, { useState, useEffect } from 'react';
import { Menu, X, Car, ChevronDown, User, ShieldAlert, Monitor, ArrowRight, Home, Image, Download, Contact } from 'lucide-react';

const Navbar = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showPortal, setShowPortal] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'About', href: '#about', icon: <Home size={18} /> },
    { name: 'Services', href: '#services', icon: <Car size={18} /> },
    { name: 'mVahan Portal', action: 'mvahan', icon: <Monitor size={18} />, highlight: true },
    { name: 'Memories', href: '#testimonials', icon: <Image size={18} /> },
    { name: 'Downloads', href: '#downloads', icon: <Download size={18} /> },
    { name: 'Contact Us', href: '#ContactUs', icon: <Contact size={18} /> }, // Fixed label and spacing
  ];

  const handleLinkClick = (item) => {
    // If it's a page navigation action (like mvahan)
    if (item.action) {
      onNavigate(item.action);
    } 
    // If it's an anchor link (#about etc)
    else if (item.href) {
      // Close mobile menu first
      setIsOpen(false);
      // Small delay to let the menu close before jumping
      setTimeout(() => {
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${
      scrolled 
        ? 'bg-white/70 backdrop-blur-2xl py-3 border-b border-white/20 shadow-lg' 
        : 'bg-transparent py-6'
    }`}>
      {/* Liquid Glow Effect */}
      {scrolled && <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>}

      <div className="w-full px-6 lg:px-12 flex justify-between items-center relative">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-blue-600 p-2.5 rounded-2xl rotate-3 group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
              <Car className="text-white" size={20} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase italic text-slate-900">
              John's <span className="text-blue-600">Driving</span>
            </span>
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-400">Malakallu Academy</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {menuItems.map((item) => (
            item.action ? (
              <button 
                key={item.name} 
                onClick={() => handleLinkClick(item)}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:scale-105 transition-all flex items-center gap-2 relative group"
              >
                <Monitor size={14} /> 
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </button>
            ) : (
              <a 
                key={item.name} 
                href={item.href} 
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item);
                }}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition-all relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </a>
            )
          ))}

          {/* Liquid Portal Button */}
          <div className="relative">
            <button 
              onClick={() => setShowPortal(!showPortal)}
              className="group flex items-center gap-3 bg-slate-900 text-white px-7 py-3.5 rounded-2xl text-[10px] font-black tracking-widest uppercase overflow-hidden relative shadow-2xl transition-all hover:shadow-blue-500/20 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center gap-2">
                Access Portal <ChevronDown size={14} className={`transition-transform duration-300 ${showPortal ? 'rotate-180' : ''}`} />
              </span>
            </button>

            {showPortal && (
              <div className="absolute right-0 mt-4 w-64 backdrop-blur-3xl bg-white/80 border border-white/20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-3 animate-in fade-in zoom-in duration-300 overflow-hidden">
                <button 
                  onClick={() => { onNavigate('user-login'); setShowPortal(false); }}
                  className="w-full flex items-center justify-between p-4 hover:bg-blue-600 hover:text-white rounded-[1.8rem] transition-all group text-left mb-1"
                >
                  <div className="flex items-center gap-4">
                    <User size={18} className="group-hover:text-white transition-colors" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Student</span>
                  </div>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
                <button 
                  onClick={() => { onNavigate('admin-login'); setShowPortal(false); }}
                  className="w-full flex items-center justify-between p-4 hover:bg-red-600 hover:text-white rounded-[1.8rem] transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <ShieldAlert size={18} className="group-hover:text-white transition-colors" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Admin</span>
                  </div>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden w-12 h-12 flex items-center justify-center bg-slate-900 rounded-2xl text-white shadow-xl active:scale-90 transition-all" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 top-0 left-0 w-full h-screen bg-white/60 backdrop-blur-3xl z-[200] lg:hidden flex flex-col p-6 pt-24 overflow-y-auto">
            {/* Animated Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-400/20 blur-[100px] rounded-full"></div>
            
            <div className="relative flex items-center justify-between mb-10 px-4">
                <div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Menu</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-600">John's Driving Academy</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-full">
                    <X size={20} />
                </button>
            </div>
            
            <div className="space-y-3 flex-1 px-2 relative z-[210]">
              {menuItems.map((item, index) => (
                <button 
                  key={item.name} 
                  onClick={() => handleLinkClick(item)}
                  className="w-full flex items-center justify-between p-5 bg-white border border-white/60 rounded-[2rem] text-left group active:bg-blue-600 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shadow-sm text-blue-600 group-active:scale-90 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-xl font-black uppercase italic tracking-tighter text-slate-900 group-active:text-white transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-active:border-white/40 group-active:text-white transition-all">
                    <ArrowRight size={18} />
                  </div>
                </button>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="grid grid-cols-2 gap-4 mt-6 mb-8 px-2 relative z-[210]">
              <button 
                onClick={() => { onNavigate('user-login'); setIsOpen(false); }} 
                className="flex flex-col items-center gap-3 bg-blue-600 text-white p-7 rounded-[2.5rem] font-black shadow-2xl shadow-blue-500/30 active:scale-95 transition-all"
              >
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <User size={24} />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-center">Student Portal</span>
              </button>
              <button 
                onClick={() => { onNavigate('admin-login'); setIsOpen(false); }} 
                className="flex flex-col items-center gap-3 bg-slate-900 text-white p-7 rounded-[2.5rem] font-black active:scale-95 transition-all"
              >
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <ShieldAlert size={24} />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-center">Admin Login</span>
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Helper for mobile exit animation logic if AnimatePresence is used
const AnimatePresence = ({ children }) => <>{children}</>;

export default Navbar;