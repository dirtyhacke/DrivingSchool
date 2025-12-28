import React, { useState } from 'react'; // Import useState
import { ArrowRight, Play, CheckCircle2, ShieldCheck, MapPin, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import BookingModal from './BookingModal'; // Import the new BookingModal

const Hero = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // State for modal

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section id="home" className="relative min-h-[90vh] lg:min-h-screen flex items-center bg-[#f8fafc] overflow-hidden pt-24 lg:pt-32 pb-12">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-400/10 rounded-full blur-[80px] md:blur-[120px] -z-10 translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-indigo-400/10 rounded-full blur-[60px] md:blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Content */}
        <motion.div 
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="z-10 order-2 lg:order-1 text-center lg:text-left"
        >
          {/* Animated Badge */}
          <motion.div variants={itemVars} className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full mb-6 lg:mb-8 shadow-sm">
            <Sparkles size={12} className="text-blue-600 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">NLP Specialized School</span>
          </motion.div>

          <motion.h1 variants={itemVars} className="text-4xl sm:text-6xl lg:text-8xl font-black text-slate-900 leading-[1.1] lg:leading-[0.95] tracking-tighter mb-6 lg:mb-8 uppercase italic">
            Drive with <br />
            <span className="text-blue-600 inline-block">Intelligence.</span>
          </motion.h1>

          <motion.p variants={itemVars} className="text-slate-500 text-sm md:text-base max-w-lg lg:max-w-sm mx-auto lg:mx-0 font-medium leading-relaxed mb-8 lg:mb-10 tracking-tight">
            Premium instruction combining <span className="text-slate-900 font-bold">Advanced Simulators</span> and <span className="text-blue-600 font-bold">NLP Psychology</span> to build elite road confidence.
          </motion.p>

          <motion.div variants={itemVars} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 lg:gap-8">
            <button 
              onClick={() => setIsBookingModalOpen(true)} // Open booking modal
              className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-[11px] tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95 group"
            >
              Start Learning 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="flex items-center gap-4 text-slate-900 font-bold text-[11px] tracking-widest uppercase group">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-600 transition-all shadow-sm">
                <Play size={14} className="text-blue-600 fill-blue-600 ml-1" />
              </div>
              <span className="hidden sm:inline">The Process</span>
            </button>
          </motion.div>

          {/* Social Proof / Stats */}
          <motion.div variants={itemVars} className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center lg:justify-start gap-8">
            <div>
              <div className="flex text-amber-400 mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400">4.9/5 Rating</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <p className="text-xl font-black text-slate-900 leading-none">20+</p>
              <p className="text-[10px] font-black uppercase text-slate-400">Years Exp</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Visual Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative order-1 lg:order-2 px-4 lg:px-0"
        >
          <div className="relative rounded-[2rem] lg:rounded-[3.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] group">
            <img 
              src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1470&auto=format&fit=crop" 
              alt="Professional Driving Interior" 
              className="w-full h-[350px] sm:h-[450px] lg:h-[650px] object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            
            {/* Glassmorphism Floating Badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>
            
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 bg-white/80 backdrop-blur-2xl p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/50 shadow-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3 sm:gap-5">
                <div className="bg-blue-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-white shadow-xl shadow-blue-500/30">
                  <ShieldCheck size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] sm:text-[12px] font-black text-slate-900 uppercase tracking-tighter leading-none mb-1 sm:mb-1.5">MVD Certified</h4>
                  <div className="flex items-center gap-1">
                    <MapPin size={10} className="text-blue-600" />
                    <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Malakkallu, Kerala</p>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:block">
                <div className="bg-slate-900 text-white text-[9px] font-bold px-4 py-2 rounded-xl uppercase tracking-[0.2em]">
                  Est. 2004
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </section>
  );
};

export default Hero;