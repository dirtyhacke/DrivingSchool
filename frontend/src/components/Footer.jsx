// components/Footer.jsx
import React from 'react';
import { Facebook, Mail, MessageCircle, Car, MapPin, Phone, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const phoneNumber = "+919400107199";
  const emailAddress = "johnsdrivingschool@gmail.com";
  const facebookUrl = "https://www.facebook.com/profile.php?id=61550888138319";

  return (
    <footer className="bg-[#0A0C10] text-white pt-24 pb-12 overflow-hidden relative border-t border-white/5">
      {/* Subtle Gradient Glow for Depth */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand & Social Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/20">
                <Car size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black uppercase italic tracking-tighter">
                John's <span className="text-blue-500">Driving</span>
              </span>
            </div>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
              Mastering the art of confident driving through Kerala's first NLP-integrated training system. Safety meets psychology.
            </p>
            <div className="flex gap-4">
              <a 
                href={facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 group"
              >
                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href={`mailto:${emailAddress}`} 
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group"
              >
                <Mail size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href={`https://wa.me/${phoneNumber.replace('+', '')}`}
                target="_blank"
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-300 group"
              >
                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Explore</h4>
            <ul className="space-y-4">
              {['About', 'Services', 'Advisor', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`} 
                    className="text-slate-300 hover:text-blue-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2 group"
                  >
                    <div className="w-0 group-hover:w-4 h-px bg-blue-400 transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Support Card */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Direct Support</h4>
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8 backdrop-blur-sm">
              <a href={`tel:${phoneNumber}`} className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">Call Expert</p>
                  <p className="text-base font-black tracking-tight">{phoneNumber}</p>
                </div>
                <ArrowUpRight size={16} className="ml-auto text-slate-700 group-hover:text-blue-500 transition-colors" />
              </a>

              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-500 flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">Visit Hub</p>
                  <p className="text-base font-black tracking-tight">Malakkallu, Kerala</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.25em]">
              © 2025 John's Driving School.
            </p>
            <p className="text-slate-800 text-[9px] font-bold uppercase tracking-widest">
              Built for Safety. Driven by Excellence.
            </p>
          </div>
          
          <div className="flex items-center gap-10 text-slate-600 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Legal Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;