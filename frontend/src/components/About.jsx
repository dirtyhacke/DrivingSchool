import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Users, Target, Brain, Zap, Sparkles, Navigation } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-28 bg-[#f8fafc] overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-100 rounded-full blur-[120px] -z-0 opacity-40"></div>
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
        
        {/* Left Side: The Mission Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2"
        >
          <div className="flex items-center gap-2 bg-blue-600 text-white w-fit px-5 py-2 rounded-full mb-8 shadow-xl shadow-blue-200">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pioneering Excellence</span>
          </div>

          <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-[0.95] italic uppercase tracking-tighter">
            Kerala's First <br/>
            <span className="text-blue-600">NLP Powered</span> <br/>
            Driving Hub
          </h2>

          <div className="space-y-6 max-w-xl">
            <p className="text-slate-600 text-lg leading-relaxed font-bold border-l-4 border-blue-600 pl-6 bg-blue-50/50 py-4 rounded-r-2xl">
              "We don't just teach you to handle a steering wheel; we teach your mind to master the road."
            </p>
            
            <p className="text-slate-500 text-md leading-relaxed font-medium">
              John's Driving School is proud to be the <span className="text-slate-900 font-black italic underline decoration-blue-400 decoration-4">First NLP Integrated</span> institution in the state. By applying Neuro-Linguistic Programming, we eliminate driving anxiety and build subconscious road reflexes.
            </p>

            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Brain size={20}/></div>
                <div>
                  <h5 className="font-black text-xs uppercase tracking-widest text-slate-900">Psychology First</h5>
                  <p className="text-xs text-slate-400 font-medium">Overcome road-phobia with certified NLP techniques.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Target size={20}/></div>
                <div>
                  <h5 className="font-black text-xs uppercase tracking-widest text-slate-900">Simulator Precision</h5>
                  <p className="text-xs text-slate-400 font-medium">Master complex maneuvers in a risk-free digital environment.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Technical SVG Illustration */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="lg:w-1/2 relative"
        >
          {/* Main SVG Container */}
          <div className="relative z-10 rounded-[3rem] bg-slate-900 p-8 lg:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-t border-white/10 group overflow-hidden">
            
            {/* Abstract Tech SVG */}
            <svg viewBox="0 0 400 400" className="w-full h-auto drop-shadow-2xl">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor:'#2563eb', stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:'#4f46e5', stopOpacity:1}} />
                    </linearGradient>
                </defs>
                {/* Dashboard Base */}
                <path d="M50 300 Q200 100 350 300" stroke="url(#grad1)" strokeWidth="12" fill="none" opacity="0.3" />
                <path d="M80 280 Q200 130 320 280" stroke="url(#grad1)" strokeWidth="4" fill="none" opacity="0.6" strokeDasharray="10 5" />
                
                {/* Steering Wheel Arc */}
                <circle cx="200" cy="350" r="120" stroke="white" strokeWidth="2" fill="none" opacity="0.1" />
                <path d="M120 350 A80 80 0 0 1 280 350" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
                
                {/* Neural Connections (NLP) */}
                <g className="animate-pulse">
                    <circle cx="200" cy="180" r="4" fill="#60a5fa" />
                    <circle cx="150" cy="140" r="3" fill="#60a5fa" opacity="0.5" />
                    <circle cx="250" cy="140" r="3" fill="#60a5fa" opacity="0.5" />
                    <line x1="200" y1="180" x2="150" y2="140" stroke="#60a5fa" strokeWidth="1" opacity="0.3" />
                    <line x1="200" y1="180" x2="250" y2="140" stroke="#60a5fa" strokeWidth="1" opacity="0.3" />
                </g>

                {/* Navigation Arrow */}
                <motion.path 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    d="M200 220 L215 250 L200 240 L185 250 Z" 
                    fill="#2563eb" 
                />
            </svg>

            {/* Glowing Scan Line Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent h-1/2 w-full animate-scan"></div>
          </div>

          {/* Floating Hero Badge */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-8 -right-4 lg:-right-12 bg-white p-6 lg:p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 z-20 max-w-[260px]"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 p-3 rounded-2xl text-white">
                  <Navigation size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Innovation</p>
                  <h4 className="text-xs font-black text-slate-900 uppercase">Kerala's 1st NLP School</h4>
                </div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                Combining Neuro-Linguistic Programming with Smart Simulator technology.
              </p>
            </div>
          </motion.div>

          {/* Background Decor Element */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        </motion.div>
      </div>
      
      {/* Custom Styles for SVG Scan Animation */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default About;