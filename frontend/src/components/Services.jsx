// components/Services.jsx
import React from 'react';
import { Monitor, Brain, Users, Info, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Services = () => {
  const serviceList = [
    { 
      title: "Simulator Training", 
      icon: <Monitor size={24} />, 
      accent: "bg-blue-600",
      desc: "Experience high-fidelity virtual driving environments. Master the controls before you hit the road." 
    },
    { 
      title: "NLP Mindset", 
      icon: <Brain size={24} />, 
      accent: "bg-emerald-600",
      desc: "Remove driving anxiety through Neuro-Linguistic Programming techniques for total road confidence." 
    },
    { 
      title: "Flexible Modules", 
      icon: <Users size={24} />, 
      accent: "bg-orange-600",
      desc: "Specialized training paths designed for teens, working professionals, and senior citizens." 
    },
    { 
      title: "Road Awareness", 
      icon: <Info size={24} />, 
      accent: "bg-purple-600",
      desc: "Deep-dive sessions on mechanical servicing, speed control, and legal road regulations." 
    }
  ];

  return (
    <section id="services" className="py-28 bg-white relative overflow-hidden">
      {/* Liquid background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[100px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl text-left">
            <div className="flex items-center gap-2 bg-slate-900 text-white w-fit px-4 py-1.5 rounded-full mb-6">
              <Zap size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Our Expertise</span>
            </div>
            <h2 className="text-6xl font-black italic text-slate-900 tracking-tighter uppercase leading-[0.9]">
              Premium <br /> <span className="text-blue-600">Training</span>
            </h2>
          </div>
          <p className="text-slate-500 text-sm max-w-xs font-medium border-l-2 border-blue-600 pl-6 italic">
            "Beyond simple steering—we build professional driving mindsets."
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceList.map((s, i) => (
            <div 
              key={i} 
              className="group relative bg-slate-50/50 hover:bg-white p-1 rounded-[3rem] transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-transparent hover:border-slate-100"
            >
              <div className="p-10 rounded-[2.8rem] h-full flex flex-col items-start transition-all">
                {/* Icon Container with Floating Effect */}
                <div className={`w-16 h-16 ${s.accent} text-white rounded-[1.5rem] flex items-center justify-center mb-10 shadow-lg group-hover:-translate-y-2 group-hover:rotate-6 transition-all duration-500`}>
                  {s.icon}
                </div>
                
                <h4 className="font-black text-xl mb-4 text-slate-900 italic uppercase tracking-tighter">
                  {s.title}
                </h4>
                
                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8 flex-grow">
                  {s.desc}
                </p>

                <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  Learn More <ArrowRight size={14} />
                </div>
              </div>
              
              {/* Subtle number indicator in corner */}
              <span className="absolute bottom-10 right-10 text-4xl font-black text-slate-100 pointer-events-none group-hover:text-slate-200 transition-colors italic">
                0{i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Trust Badge Bar */}
        <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
            <ShieldCheck size={20} /> MVD Kerala Approved
          </div>
          <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
            <ShieldCheck size={20} /> ISO 9001 Certified
          </div>
          <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
            <ShieldCheck size={20} /> 20+ Years Legacy
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;