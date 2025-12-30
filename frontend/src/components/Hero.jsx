import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, ShieldCheck, MapPin, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = ({ onNavigate }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1528&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1470&auto=format&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-slate-950 py-20 lg:py-0">
      
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={images[currentImage]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Side: Content */}
          <motion.div 
            variants={containerVars}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-2/5 text-center lg:text-left"
          >
            <motion.div variants={itemVars} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 mt-5">
              <Sparkles size={12} className="text-blue-400 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">NLP Specialized School</span>
            </motion.div>

            <motion.h1 variants={itemVars} className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-8 uppercase italic">
              Drive with <br />
              <span className="text-blue-500 inline-block not-italic">Intelligence.</span>
            </motion.h1>

            <motion.p variants={itemVars} className="text-slate-400 text-base max-w-md mx-auto lg:mx-0 font-medium leading-relaxed mb-10 tracking-tight">
              Premium instruction combining <span className="text-white font-bold">Advanced Simulators</span> and <span className="text-blue-500 font-bold">NLP Psychology</span> to build elite road confidence.
            </motion.p>

            <motion.div variants={itemVars} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <button 
                onClick={() => onNavigate('user-login')}
                className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-[11px] tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 active:scale-95 group"
              >
                Start Learning 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="flex items-center gap-4 text-white font-bold text-[11px] tracking-widest uppercase group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500 transition-all">
                  <Play size={14} className="text-blue-500 fill-blue-500 ml-1" />
                </div>
                <span>The Process</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Right Side: LANDSCAPE CARD */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full lg:w-3/5"
          >
            <div className="relative group p-3 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem]">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImage}
                    src={images[currentImage]} 
                    initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Landscape Card Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                
                <motion.div 
                  className="absolute bottom-6 left-6 right-6 flex items-end justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-3 rounded-xl text-white">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-tighter">MVD Kerala Certified</p>
                      <div className="flex items-center gap-1 text-slate-400">
                        <MapPin size={10} />
                        <span className="text-[9px] font-bold uppercase">Malakkallu Campus</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {images.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 rounded-full transition-all duration-500 ${currentImage === i ? 'w-6 bg-blue-500' : 'w-2 bg-white/20'}`} 
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Stats Overlaying the Landscape Card bottom */}
            <div className="flex gap-8 mt-8 px-6">
               <div className="flex flex-col">
                  <div className="flex text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">4.9/5 Student Rating</p>
               </div>
               <div className="w-px h-10 bg-white/10" />
               <div className="flex flex-col">
                  <p className="text-xl font-black text-white leading-none">20+</p>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-1">Years Excellence</p>
               </div>
            </div>
          </motion.div>

        </div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
      >
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-t from-blue-500 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;