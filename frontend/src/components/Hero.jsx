// components/Hero.jsx
import React from 'react';
import { ArrowRight, Play, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-white overflow-hidden pt-20">
      {/* Soft Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px] -z-10 translate-x-1/4 -translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Minimalist Text Content */}
        <div className="z-10 order-2 lg:order-1">
          {/* Elegant Small Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full mb-8">
            <CheckCircle2 size={10} className="text-blue-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">NLP Specialized School</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tighter mb-6 uppercase italic">
            Drive with <br />
            <span className="text-blue-600">Intelligence.</span>
          </h1>

          <p className="text-slate-400 text-[13px] md:text-sm max-w-sm font-medium leading-relaxed mb-10 tracking-tight">
            Professional instruction with <span className="text-slate-900 font-bold">Simulators</span> & <span className="text-slate-900 font-bold italic">NLP Coaching</span>. 
            Designed for total road confidence.
          </p>

          <div className="flex items-center gap-6">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 active:scale-95">
              Start Learning <ArrowRight size={14} />
            </button>
            
            <button className="flex items-center gap-3 text-slate-900 font-black text-[10px] tracking-widest uppercase group">
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-50 transition-all">
                <Play size={12} className="text-blue-600 fill-blue-600 ml-0.5" />
              </div>
              The Process
            </button>
          </div>
        </div>

        {/* Right Side: Driving Related Visual */}
        <div className="relative order-1 lg:order-2">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group border border-slate-100">
            {/* NOTE: If this placeholder doesn't show a driving image, 
                it's because your internet is blocking external images.
                To fix: Put an image in your 'public' folder and use src="/yourimage.jpg"
            */}
            <img 
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop" 
              alt="Driving Training" 
              className="w-full h-[500px] lg:h-[620px] object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            
            {/* Integrated Glass Badge Overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 shadow-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-200">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">MVD Kerala Certified</h4>
                  <div className="flex items-center gap-1">
                    <MapPin size={8} className="text-blue-600" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Malakkallu, Kasaragod</p>
                  </div>
                </div>
              </div>
              
              <div className="hidden sm:block">
                <span className="bg-slate-950 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                  Since 2004
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;