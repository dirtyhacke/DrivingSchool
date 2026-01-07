'use client'; // Required in Next.js App Router for hooks and animations

import React, { useRef } from 'react';
import { ArrowRight, Play, ShieldCheck, MapPin, Sparkles, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Hero = ({ onNavigate }) => {
  const containerRef = useRef(null);
  
  // Hook for scroll-linked animations
  const { scrollY } = useScroll();

  // Parallax effects for the large background text
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#020202] overflow-hidden flex items-center pt-0 pb-20 lg:py-0"
    >
      
      {/* 1. DUAL VIDEO ENGINE BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {/* DESKTOP VIDEO */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hidden md:block w-full h-full object-cover opacity-40 grayscale-[0.2]"
        >
          <source src="https://media.istockphoto.com/id/1437677591/video/animation-of-a-red-car-running-around-a-curve-it-runs-forever-without-interruption.mp4?s=mp4-640x640-is&k=20&c=4mMUeuy492Wx_SV0QJMIAcu3YVTs0b7nrnyWDgBfu1g=" type="video/mp4" />
        </video>

        {/* MOBILE VIDEO */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="block md:hidden w-full h-full object-cover opacity-50 grayscale-[0.3]"
        >
          <source src="https://cdn.dribbble.com/userupload/42780877/file/original-f947a833159aa73398fc9bfc8468c2d9.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/90 to-transparent lg:via-[#020202]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/60" />
      </div>

      {/* 2. LARGE BACKGROUND FADE TEXT (Parallax) */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none select-none">
        <motion.h2 
          style={{ y: y1 }}
          className="absolute top-[10%] -left-5 md:-left-10 text-[28vw] md:text-[20vw] font-black text-white/[0.02] leading-none uppercase italic whitespace-nowrap"
        >
          DRIVING
        </motion.h2>
        <motion.h2 
          style={{ y: y2 }}
          className="absolute bottom-[10%] -right-5 md:-right-10 text-[28vw] md:text-[20vw] font-black text-blue-500/[0.02] leading-none uppercase whitespace-nowrap"
        >
          ELITE
        </motion.h2>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-9 sm:px-12 w-full relative z-10">
        <div className="max-w-4xl">
          
          {/* MOBILE ONLY LOTTIE ANIMATION */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="block lg:hidden w-full max-w-[240px] mx-auto mb-6 aspect-square"
          >
            <DotLottieReact
              src="/path/to/animation.lottie" // Ensure your .lottie file is in /public
              loop
              autoplay
            />
          </motion.div>

          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl px-4 py-2 rounded-full mb-6 md:mb-8 mx-auto lg:mx-0"
          >
            <Sparkles size={14} className="text-blue-400 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-black text-blue-400 uppercase tracking-[0.3em]">NLP Specialized School</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[12vw] sm:text-7xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter mb-8 uppercase italic text-center lg:text-left"
          >
            Drive with <br />
            <span className="text-blue-600 not-italic inline-block">Intelligence.</span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-sm sm:text-xl max-w-2xl font-medium leading-relaxed mb-10 md:mb-12 border-l-2 border-blue-600 pl-4 md:pl-6 mx-auto lg:mx-0 text-center lg:text-left"
          >
            Premium instruction combining <span className="text-white font-bold">Advanced Simulators</span> and <span className="text-blue-500 font-bold">NLP Psychology</span> to build elite road confidence.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10"
          >
            <button 
              onClick={() => onNavigate('user-login')}
              className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-[11px] tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 active:scale-95 group"
            >
              Start Learning 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="flex items-center gap-4 text-white font-black text-[11px] tracking-widest uppercase group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500 transition-all">
                <Play size={14} className="text-blue-500 fill-blue-500 ml-1" />
              </div>
              <span className="opacity-60 group-hover:opacity-100 transition-opacity">The Process</span>
            </button>
          </motion.div>

          {/* Trust Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16"
          >
            <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-blue-500" size={20} />
                <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">MVD Kerala Certified</p>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin size={12} />
                <span className="text-[9px] font-bold uppercase">Malakkallu Campus</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-1">4.9 Student Rating</p>
            </div>

            <div className="flex flex-col">
              <p className="text-3xl font-black text-white leading-none tracking-tighter">20+</p>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2">Years Excellence</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* HUD Signal */}
      <div className="absolute bottom-10 right-10 hidden lg:flex items-center gap-4">
         <div className="text-right">
            <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.3em]">System.Active</p>
            <p className="text-[10px] font-bold text-white uppercase">NLP Mode</p>
         </div>
         <div className="h-10 w-[1px] bg-white/10" />
         <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(37,99,235,1)]" />
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-slate-500 opacity-40"
      >
        <span className="text-[8px] font-black uppercase tracking-[0.4em]">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-blue-600 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;