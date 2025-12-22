// components/About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Users, Target, Brain, Zap } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-28 bg-white overflow-hidden relative">
      {/* Background Liquid Blurs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-50 rounded-full blur-[120px] -z-0 opacity-60"></div>
      <div className="absolute bottom-0 -left-20 w-72 h-72 bg-emerald-50 rounded-full blur-[100px] -z-0 opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20 relative z-10">
        
        {/* Left Side: The Mission Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:w-1/2"
        >
          <div className="flex items-center gap-2 bg-slate-900 text-white w-fit px-5 py-2 rounded-full mb-8 shadow-lg shadow-slate-200">
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Our Mission</span>
          </div>

          <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-[0.9] italic uppercase tracking-tighter">
            More than a <br/>
            <span className="text-blue-600">Driving School</span>
          </h2>

          <div className="space-y-6 max-w-xl">
            <p className="text-slate-700 text-xl leading-relaxed font-bold italic border-l-4 border-blue-600 pl-6">
              "It's a mission to create safer roads by transforming how drivers think and act."
            </p>
            
            <p className="text-slate-500 text-md leading-relaxed font-medium">
              Founded in Kerala, <span className="text-slate-900 font-black">John's Driving School</span> combines traditional instruction with cutting-edge tools like <span className="text-blue-600 font-bold uppercase tracking-tighter italic">NLP (Neuro-Linguistic Programming)</span> and simulator-based learning.
            </p>

            <p className="text-slate-500 text-md leading-relaxed font-medium">
              We believe every driver should not only know how to operate a vehicle but also <span className="text-slate-900 font-bold">understand the psychology of safe driving</span>, ensuring you are prepared for today's complex road environments.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-slate-100">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Brain size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mindset Focused</span>
              </div>
              <h4 className="font-black text-2xl text-slate-900 uppercase italic">NLP Integrated</h4>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Users size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Student Success</span>
              </div>
              <h4 className="font-black text-2xl text-slate-900 uppercase italic">99% Pass Rate</h4>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Visual Image & Floating Glass Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="lg:w-1/2 relative"
        >
          {/* Main Cinematic Image */}
          <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-[10px] border-slate-50 ring-1 ring-slate-200 group">
            <img 
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1000" 
              alt="Psychological Driving Training" 
              className="w-full h-[650px] object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
          </div>

          {/* Floating Glassmorphism Card */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-10 bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white z-20 max-w-[280px] hidden md:block"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-200">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="text-md font-black text-slate-900 leading-tight">MVD Kerala <br/> Approved</h4>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                State-of-the-art simulator facility & certified NLP trainers.
              </p>
            </div>
          </motion.div>

          {/* Liquid Background Shape */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;