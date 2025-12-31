import React, { useState, useEffect } from 'react';
import { 
  Car, User, ShieldAlert, Monitor, ArrowRight, 
  Home, Image, Download, Contact, Languages, 
  Lock, ShieldCheck, Globe 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isMalayalam, setIsMalayalam] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: isMalayalam ? 'കുറിച്ച്' : 'About', href: '#about', icon: <Home size={18} /> },
    { name: isMalayalam ? 'സേവനങ്ങൾ' : 'Services', href: '#services', icon: <Car size={18} /> },
    { name: isMalayalam ? 'എം-വാഹൻ' : 'mVahan', action: 'mvahan', icon: <Monitor size={18} /> },
    { name: isMalayalam ? 'ഓർമ്മകൾ' : 'Memories', href: '#testimonials', icon: <Image size={18} /> },
    { name: isMalayalam ? 'ഡൗൺലോഡ്' : 'Downloads', href: '#downloads', icon: <Download size={18} /> },
    { name: isMalayalam ? 'ബന്ധപ്പെടുക' : 'Contact', href: '#ContactUs', icon: <Contact size={18} /> },
  ];

  const handleLinkClick = (item) => {
    if (item.action) {
      onNavigate(item.action);
    } else if (item.href) {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${
      scrolled 
        ? 'bg-slate-950/90 backdrop-blur-2xl py-4 border-b border-white/10 shadow-2xl' 
        : 'bg-transparent py-7'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* LOGO SECTION WITH ANIMATION */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer shrink-0" 
          onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          {/* Replaced Car icon with the GIF animation */}
          <div className=" p-1 rounded-2xl rotate-3 shadow-lg shadow-blue-500/10 borderoverflow-hidden">
             <img 
               src="https://cdn.dribbble.com/userupload/36660518/file/original-6d12e617e99c4a331077717af6ff1ff9.gif" 
               alt="Driving Animation"
               className="w-10 h-10 object-cover rounded-xl"
             />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase italic text-white leading-none">
              John's <span className="text-blue-500">Driving</span>
            </span>
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-blue-400/80 mt-1">Malakallu Academy</span>
          </div>
        </motion.div>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-8 border-r border-white/10 pr-10">
            {menuItems.map((item) => (
              <button 
                key={item.name} 
                onClick={() => handleLinkClick(item)}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <button onClick={() => setIsMalayalam(!isMalayalam)} className="text-[10px] font-black text-blue-500 hover:text-white transition-colors">
              {isMalayalam ? 'ENG' : 'മലയാളം'}
            </button>
            <button onClick={() => onNavigate('user-login')} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              Student Login
            </button>
            <div className="relative" onMouseEnter={() => setShowAdminPanel(true)} onMouseLeave={() => setShowAdminPanel(false)}>
              <motion.div className={`w-12 h-12 flex items-center justify-center rounded-2xl cursor-pointer transition-all border ${showAdminPanel ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                {showAdminPanel ? <ShieldCheck size={20} className="animate-pulse" /> : <Lock size={20} />}
              </motion.div>
              <AnimatePresence>
                {showAdminPanel && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute right-full mr-4 top-0 whitespace-nowrap">
                    <button onClick={() => onNavigate('admin-login')} className="bg-slate-900 border border-white/10 text-white px-6 h-12 rounded-2xl flex items-center gap-3 hover:border-blue-500 transition-all shadow-2xl">
                      <ShieldAlert size={16} className="text-blue-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Admin Portal</span>
                      <span className="ml-2"><ArrowRight size={14} /></span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex lg:hidden items-center gap-6">
          <button 
            onClick={() => onNavigate('user-login')}
            className="flex items-center gap-2 group transition-all"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80 group-active:text-blue-500 transition-colors">
              {isMalayalam ? 'ലോഗിൻ' : 'student Login'}
            </span>
          </button>

          <button 
            className="relative w-6 h-11 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-transparent z-[210] active:scale-90 transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.span animate={isOpen ? { rotate: 45, y: 7, width: '22px' } : { rotate: 0, y: 0, width: '18px' }} className="h-0.5 bg-white rounded-full block origin-center transition-all" />
            <motion.span animate={isOpen ? { opacity: 0 } : { opacity: 1, width: '12px' }} className="h-0.5 bg-blue-500 rounded-full block transition-all" />
            <motion.span animate={isOpen ? { rotate: -45, y: -7, width: '22px' } : { rotate: 0, y: 0, width: '18px' }} className="h-0.5 bg-white rounded-full block origin-center transition-all" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 h-screen bg-slate-950 z-[200] lg:hidden flex flex-col p-8 pt-20"
          >
            {/* DYNAMIC ISLAND (TOP LEFT) */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-8 left-8 flex items-center bg-white/5 border border-white/10 p-1 rounded-2xl backdrop-blur-md"
            >
              <button
                onClick={() => { onNavigate('admin-login'); setIsOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 border-r border-white/10 text-slate-400 hover:text-white transition-all"
              >
                <ShieldAlert size={14} className="text-blue-500" />
                <span className="text-[8px] font-black uppercase tracking-widest">Admin</span>
              </button>

              <button
                onClick={() => setIsMalayalam(!isMalayalam)}
                className="flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white transition-all"
              >
                <Globe size={14} className="text-blue-500" />
                <span className="text-[8px] font-black uppercase tracking-widest">
                  {isMalayalam ? 'ENG' : 'മല'}
                </span>
              </button>
            </motion.div>

            <div className="flex-1 space-y-4 mt-8">
              {menuItems.map((item, i) => (
                <motion.button 
                  key={item.name} 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.05 }} 
                  onClick={() => handleLinkClick(item)} 
                  className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-[2rem] text-left active:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-5 text-white">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-500">{item.icon}</div>
                    <span className="text-lg font-black uppercase italic tracking-tighter">{item.name}</span>
                  </div>
                  <ArrowRight size={18} className="text-slate-600" />
                </motion.button>
              ))}
            </div>

            <div className="mt-auto pb-10 text-center">
               <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">John's Driving Academy</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;