import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Car, ShieldCheck, Fuel, Activity, 
  ArrowLeft, Loader2, AlertCircle, MapPin, 
  Wrench, ShieldAlert 
} from 'lucide-react';

const MVahanPortal = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [vehicleInput, setVehicleInput] = useState('');
  const [error, setError] = useState(null);

  // Maintenance is now permanent (no close state)
  const isMaintenance = true;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans relative">
      
      {/* --- STICKY MAINTENANCE BANNER --- */}
      <div className="sticky top-0 z-[100] bg-amber-500 text-white px-6 py-3 flex items-center justify-center gap-3 shadow-lg">
        <Wrench size={16} className="animate-bounce" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
          System Notice: Scheduled Maintenance in Progress
        </span>
      </div>

      {/* Decorative background blur */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto pt-20 pb-20 px-6 relative z-10 blur-[2px] pointer-events-none">
        {/* Main content is visible but blurred/disabled during maintenance */}
        <div className="mb-12">
          <h2 className="text-5xl md:text-6xl font-black italic uppercase text-slate-900 leading-[0.9] tracking-tighter">
            mVahan <br /> <span className="text-blue-600">Portal</span>
          </h2>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 p-8 h-32 flex items-center justify-center">
            <p className="text-slate-300 font-black uppercase tracking-widest">Search Disabled</p>
        </div>
      </div>

      {/* --- MAINTENANCE MODAL POPUP (NO CLOSE BUTTON) --- */}
      <AnimatePresence>
        {isMaintenance && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            {/* Maintenance Card */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl text-center"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-blue-600 rounded-b-full" />
              
              <div className="bg-amber-50 w-20 h-20 rounded-[2rem] flex items-center justify-center text-amber-500 mb-8 mx-auto shadow-inner">
                <ShieldAlert size={40} />
              </div>
              
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 mb-4">
                Server on <br /> <span className="text-blue-600">Maintenance</span>
              </h3>
              
              <p className="text-slate-500 text-sm font-bold leading-relaxed mb-10 px-2 uppercase tracking-wide">
                Maintenance work is currently in progress. This feature will be <span className="text-slate-900">available soon</span>.
              </p>
              
              {/* ONLY BACK BUTTON */}
              <button 
                onClick={onBack}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10 active:scale-95"
              >
                <ArrowLeft size={18} />
                Back to Home
              </button>

              <p className="mt-8 text-[8px] font-black text-slate-300 uppercase tracking-[0.5em]">
                System Protected • John's Academy
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MVahanPortal;